/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card } from "@mui/material";
import React from "react";
import StudentProfileDialog from "../../components/StudentProfileDialog/StudentProfileDialog";
import StudentProfilePage from "../../components/shared/StudentProfilePage/StudentProfilePage";
import { useSelector } from "react-redux/es";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useState } from "react";
import { useEffect } from "react";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import "../../styles/StudentProfilePageDesign.css";
import "../../styles/sharedStyles.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import { customFetch } from "../StudentTotalQueries/helperFunction";
//Student Profile design for HOD
const StudentProfileViewHOD = () => {
  const [status, setStatus] = useState({});
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
  const [applicationSomethingWentWrong, setApplicantSomethingWentWrong] =
    useState(false);
  const [applicationInternalServerError, setApplicantInternalServerError] =
    useState(false);
  const role = "HOD";
  const navigate = useNavigate();
  const { state } = useLocation();
  if (!state) {
    navigate("/");
  }
  const handleClickOpen = () => {
    setOpenConfirmationDialog(true);
  };

  const handleClose = () => {
    setOpenConfirmationDialog(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    getStudentInfoInternalServerError,
    setGetStudentInfoInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetStudentInfo,
    setSomethingWentWrongInGetStudentInfo,
  ] = useState(false);
  const [studentInfo, setStudentInfo] = useState({});

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/planner/student_profile/?interview_list_id=${
      state?.interview_list_id
    }&application_id=${state?.application_id}&college_id=${collegeId}`;
    customFetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
          navigate("/authorized-approver-dashboard");
        } else if (result) {
          try {
            if (typeof result === "object" && result !== null) {
              setStudentInfo(result);
            } else {
              throw new Error("Get Student info API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInGetStudentInfo,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setGetStudentInfoInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const { handleChangeStatusApiCall } = useCommonApiCalls();
  const handleRedirect = () => {
    navigate("/authorized-approver-dashboard");
  };
  const handleChangeStatus = (status) => {
    const params = {
      approvalStatus: true,
      payload: {
        interview_list_id: state?.interview_list_id,
        application_ids: [state?.application_id],
        status: status,
      },
      collegeId,
      setLoadingChangeStatus,
      setStudentListSomethingWentWrong: setApplicantSomethingWentWrong,
      setStudentListInternalServerError: setApplicantInternalServerError,
      setOpenConfirmationDialog,
      handleRedirect,
    };
    handleChangeStatusApiCall(params);
  };

  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Student Profile");
    document.title = "Student Profile";
  }, [headTitle]);
  return (
    <>
      {applicationInternalServerError ||
      applicationSomethingWentWrong ||
      getStudentInfoInternalServerError ||
      somethingWentWrongInGetStudentInfo ? (
        <Box className="loading-animation-for-notification">
          {(applicationInternalServerError ||
            getStudentInfoInternalServerError) && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(applicationSomethingWentWrong ||
            somethingWentWrongInGetStudentInfo) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Card
          sx={{ mx: "28px" }}
          className="student-profile-card-margin custom-component-container-box"
        >
          <>
            {loading ? (
              <Card className="loader-wrapper">
                <LeefLottieAnimationLoader
                  height={100}
                  width={150}
                ></LeefLottieAnimationLoader>{" "}
              </Card>
            ) : (
              <StudentProfilePage
                role={role}
                studentInfoData={studentInfo}
              ></StudentProfilePage>
            )}
          </>
          <Box
            className="HOD-all-button-Design"
            sx={{
              display: "flex",
              p: 4,
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box className="button-flex-design">
              <Button
                size="small"
                sx={{
                  borderRadius: 30,
                  paddingX: 3,
                  bgcolor: "#FFDFDD",
                  color: "#E06259",
                }}
                onClick={() => {
                  handleClickOpen();
                  setStatus({ title: "Rejected", name: "Rejected" });
                }}
                className="button-reject-design"
              >
                Reject
              </Button>
              <Button
                size="small"
                sx={{
                  borderRadius: 30,
                  paddingX: 3,
                  bgcolor: "white",
                  color: "#008BE2",
                  border: "1px solid #008BE2",
                }}
                onClick={() => {
                  handleClickOpen();
                  setStatus({ title: "Put On Hold", name: "Hold" });
                }}
                className="button-height-design"
              >
                Put On Hold
              </Button>
              {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                <CustomTooltip
                  description={<div>Will not work in demo</div>}
                  component={
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: 30, paddingX: 3 }}
                      color="info"
                      onClick={() => {
                        handleClickOpen();
                        setStatus({
                          title: "Select & Send Offer Letter",
                          name: "Selected",
                        });
                      }}
                      className="button-height-design send-offer-letter-button-text"
                    >
                      Select & Send Offer Letter
                    </Button>
                  }
                  color={true}
                  placement={"top"}
                  accountType={
                    import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
                  }
                />
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: 30, paddingX: 3 }}
                  color="info"
                  onClick={() => {
                    handleClickOpen();
                    setStatus({
                      title: "Select & Send Offer Letter",
                      name: "Selected",
                    });
                  }}
                  className="button-height-design send-offer-letter-button-text"
                >
                  Select & Send Offer Letter
                </Button>
              )}
              <Button
                size="small"
                sx={{
                  borderRadius: 30,
                  paddingX: 3,
                  bgcolor: "white",
                  color: "#008BE2",
                  border: "1px solid #008BE2",
                  mt: "20px",
                }}
                onClick={() => {
                  handleClickOpen();
                  handleRedirect();
                }}
                className="button-height-design back-button-list"
              >
                Back to list
              </Button>
            </Box>
          </Box>
          <Box
            className="back-to-list-button"
            sx={{ display: "grid", placeItems: "end", mt: -7.9, mr: 4, mb: 5 }}
          >
            <Link to="/authorized-approver-dashboard">
              <Button
                size="small"
                sx={{
                  borderRadius: 30,
                  paddingX: 3,
                  bgcolor: "white",
                  color: "#008BE2",
                  border: "1px solid #008BE2",
                }}
                className="button-back-to-list-design"
                onClick={() => handleRedirect()}
              >
                Back to list
              </Button>
            </Link>
          </Box>
          {openConfirmationDialog && (
            <StudentProfileDialog
              handleClose={handleClose}
              open={openConfirmationDialog}
              selectedStudentName={state?.student_name}
              status={status}
              handleChangeStatus={handleChangeStatus}
              loadingChangeStatus={loadingChangeStatus}
            ></StudentProfileDialog>
          )}
        </Card>
      )}
    </>
  );
};

export default StudentProfileViewHOD;
