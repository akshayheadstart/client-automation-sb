import React, { useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import "../../../styles/leadofflinePayment.css";
import paymentCardIcon from "../../../images/paymentCardIcon.svg";
import CourseInfo from "./CourseInfo";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import { paymentDeviceInfo } from "../../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import headStart from "../../../images/headstart-logo.png";
import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { useDispatch } from "react-redux";
import { fetchGetPaymentClientID } from "../../../Redux/Slices/notificationSlice";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { tableSlice } from "../../../Redux/Slices/applicationDataApiSlice";
import { filterOptionData } from "../../../Redux/Slices/filterDataSlice";
import { reZorPayScript } from "../../../constants/CommonApiUrls";
import { adminDashboardSlice } from "../../../Redux/Slices/adminDashboardSlice";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";
const RPayOfflinePaymentDialog = ({
  rPayDialogOpen,
  handleRPayDialogClose,
  studentId,
}) => {
  const { studentInfoDetails } = useContext(LayoutSettingContext);
  const systemPreference = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.system_preference
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const deviceOs = window.navigator.userAgentData?.platform;
  const paymentDevice = paymentDeviceInfo(window.innerWidth);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchGetPaymentClientID({ token, collegeId }));
  }, [token, dispatch]);
  const reSorPayInfo = useSelector((state) => state?.notificationsData);

  const pushNotification = useToasterHook();
  const [somethingWentWrongInRPayMent, setSomethingWentWrongInRPayMent] =
    useState(false);
  const [rPayMentInternalServerError, setRPayMentInternalServerError] =
    useState(false);
  const [apiCallLoading, setApiCallLoading] = useState(false);
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  async function handleUpdatePayment() {
    const res = await loadScript(reZorPayScript);
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    // const amountOfCourse = course_fees?.split(".")[1]?.split("/")[0];
    const amountOfCourse = `${studentInfoDetails?.amount}`;
    setApiCallLoading(true);
    //  fetch to create order and get order id
    const data = await customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/payments/create_order/?application_id=${
        studentInfoDetails?.applicationId
      }&amount=${amountOfCourse.concat(
        "00"
      )}&payment_device=${paymentDevice}&device_os=${deviceOs}&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((response) => response.json())

      .catch(() => {
        handleInternalServerError(setRPayMentInternalServerError, "", 5000);
      })
      .finally(() => setApiCallLoading(false));

    if (data?.detail) {
      pushNotification("error", data?.detail);
      return;
    }

    let defaultOptions = {
      key: reSorPayInfo?.razorPayKeyId?.data?.[0]?.client_id,
      currency: data?.data[0]?.currency,
      amount: data?.data[0]?.amount,
      name: `${studentInfoDetails?.student_name}`,
      description: {
        code: "",
        course_fee: amountOfCourse,
      },
      image:
        import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? headStart : headStart,
      order_id: data?.data[0]?.id,
    };
    if (reSorPayInfo?.razorPayKeyId?.data?.[0]?.account_id) {
      defaultOptions = {
        ...defaultOptions,
        account_id: reSorPayInfo?.razorPayKeyId?.data?.[0]?.account_id,
      };
    }

    // options for razor payment
    const options = {
      ...defaultOptions,
      async handler(response) {
        const paymentData = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        setApiCallLoading(true);
        customFetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/student_application/update_payment_status/${
            studentInfoDetails?.applicationId
          }/?course_fee=${amountOfCourse.concat("00")}&payment_id=${
            paymentData?.razorpayPaymentId
          }&order_id=${paymentData?.razorpayOrderId}&rezorpay_signature=${
            paymentData?.razorpaySignature
          }&payment_device=${paymentDevice}&device_os=${deviceOs}${
            systemPreference && systemPreference?.preference
              ? `&preference_fee=${amountOfCourse}`
              : ""
          }&college_id=${collegeId}`,
          ApiCallHeaderAndBody(token, "PUT")
        )
          .then((resp) => resp.json())
          .then((payData) => {
            if (payData.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (payData.detail) {
              pushNotification("error", payData.detail);
            } else {
              try {
                if (payData?.message) {
                  pushNotification("success", payData?.message);
                  dispatch(
                    tableSlice.util.invalidateTags([
                      "leadHeader",
                      "UserProfileLeadStep",
                      "updateApplications",
                      "getLeadHeaderData",
                      "getCounselorPerformanceReport",
                    ])
                  );
                  dispatch(
                    filterOptionData.util.invalidateTags([
                      "AllOfflinePaymentList",
                    ])
                  );
                  dispatch(
                    adminDashboardSlice.util.invalidateTags([
                      "getScoreBoard",
                      "getProgramWise",
                      "getApplicationFunnel",
                      "getLeadVsApplications",
                      "getSourceWise",
                    ])
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInRPayMent,
                  "",
                  5000
                );
              }
            }
          })
          .catch(() => {
            handleInternalServerError(setRPayMentInternalServerError, "", 5000);
          })
          .finally(() => setApiCallLoading(false));
      },
      prefill: {
        name: `${studentInfoDetails?.student_name}`,
        email: `${studentInfoDetails?.email}`,
        contact: `${studentInfoDetails?.mobile}`,
      },
      notes: {
        address: `${""}`,
      },
      theme: {
        color: "#10B981",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      if (response?.error?.metadata?.payment_id) {
        customFetch(
          `${import.meta.env.VITE_API_BASE_URL}/payments/${
            response?.error?.metadata?.payment_id
          }/update/?user_id=${studentId}&application_id=${
            studentInfoDetails?.applicationId
          }&order_id=${
            response?.error?.metadata?.order_id
          }&payment_device=${paymentDevice}&device_os=${deviceOs}&college_id=${collegeId}`,
          ApiCallHeaderAndBody(
            token,
            "PUT",
            JSON.stringify({
              status: "failed",
              error_code: response.error.code,
              error_description: response.error.description,
            })
          )
        )
          .then((resp) => resp.json())
          .then(() => {})
          .catch(() => {
            handleInternalServerError(setRPayMentInternalServerError, "", 5000);
          });
      }
    });
    paymentObject.open();
  }
  return (
    <div>
      <Dialog
        maxWidth="lg"
        onClose={handleRPayDialogClose}
        open={rPayDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "15px !important",
            background: "white !important",
            boxShadow: "11px 11px 22px 6px rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        {rPayMentInternalServerError || somethingWentWrongInRPayMent ? (
          <>
            {rPayMentInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInRPayMent && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <Box sx={{ minWidth: { md: "459px" } }}>
            <Box className="payment-card-course-info">
              <img
                src={paymentCardIcon}
                alt="payment icon"
                className="payment-icon-set-right"
              />
              <IconButton onClick={() => handleRPayDialogClose()}>
                <ArrowBackIosIcon sx={{ color: "white" }} />
              </IconButton>
              <Typography variant="h5" className="payment-card-title">
                {studentInfoDetails?.paymentStatus?.toLowerCase() === "captured"
                  ? "Payment Done successfully"
                  : "Complete Your payment "}
              </Typography>
              <CourseInfo studentInfoDetails={studentInfoDetails} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <Button
                type="submit"
                variant="contained"
                size="small"
                onClick={() => {
                  if (
                    studentInfoDetails?.paymentStatus?.toLowerCase() !==
                    "captured"
                  ) {
                    handleUpdatePayment();
                  }
                }}
                className={
                  studentInfoDetails?.paymentStatus?.toLowerCase() ===
                    "captured" || apiCallLoading
                    ? "new-design-payment-button-disabled"
                    : "new-design-payment-button"
                }
                disabled={
                  studentInfoDetails?.paymentStatus?.toLowerCase() ===
                    "captured" || apiCallLoading
                }
              >
                {apiCallLoading ? (
                  <CircularProgress size={30} color="info" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Dialog>
    </div>
  );
};

export default RPayOfflinePaymentDialog;
