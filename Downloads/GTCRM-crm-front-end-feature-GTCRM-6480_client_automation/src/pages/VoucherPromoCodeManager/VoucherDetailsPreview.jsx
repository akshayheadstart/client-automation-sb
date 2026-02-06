/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DateRangePicker } from "rsuite";
import { useGetUserListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import {
  useGetAllCourseListQuery,
  useUpdateVoucherInfoMutation,
} from "../../Redux/Slices/filterDataSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import {
  organizeCourseFilterCourseIdOption,
  organizePublisherFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/dataSegmentUserProfile.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import {
  formatDatePromoCodePreview,
  formatDatePromoCodePreviewForString,
} from "../StudentTotalQueries/helperFunction";
import VoucherInputComponent from "./VoucherInputComponent";
const VoucherDetailsPreview = ({
  openPreviewVoucher,
  handleVoucherPreviewClose,
  selectedVoucherList,
  setSelectedVoucherId,
  setSelectedVoucherList,
  selectedVoucherId,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  //Voucher State
  const [voucherName, setVoucherName] = useState("");
  const [quantity, setQuantity] = useState();
  const [costPerVoucher, setCostPerVoucher] = useState();
  const [voucherDuration, setVoucherDuration] = useState([]);
  const [assignedPublisher, setAssignedPublisher] = useState(null);

  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [skipPublisherApiCall, setSkipPublisherApiCall] = useState(
    selectedVoucherList?.assign_to ? false : true
  );
  const [hidePublisherList, setHidePublisherList] = useState(false);
  const [publisherList, setPublisherList] = useState([]);

  const publisherListApiCallInfo = useGetUserListQuery(
    {
      userType: "college_publisher_console",
      collegeId,
    },
    {
      skip: skipPublisherApiCall,
    }
  );

  React.useEffect(() => {
    if (!skipPublisherApiCall) {
      const list = publisherListApiCallInfo?.data?.data[0];
      handleFilterListApiCall(
        list,
        publisherListApiCallInfo,
        setPublisherList,
        setHidePublisherList,
        organizePublisherFilterOption
      );
    }
  }, [publisherListApiCallInfo, skipPublisherApiCall]);
  //get course list
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [hideCourseList, setHideCourseList] = useState(false);

  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterCourseIdOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useEffect(() => {
    if (selectedVoucherList?.name) {
      setVoucherName(selectedVoucherList?.name);
    }
    if (selectedVoucherList?.name) {
      setVoucherName(selectedVoucherList?.name);
    }
    if (selectedVoucherList?.assign_id) {
      setAssignedPublisher(selectedVoucherList?.assign_id);
    }
    if (selectedVoucherList?.created) {
      setQuantity(selectedVoucherList?.created);
    }
    if (selectedVoucherList?.cost_per_voucher) {
      setCostPerVoucher(selectedVoucherList?.cost_per_voucher);
    }
    if (selectedVoucherList?.start_date) {
      setVoucherDuration([
        new Date(selectedVoucherList?.start_date),
        new Date(selectedVoucherList.end_date),
      ]);
    }
    if (selectedVoucherList?.program_name?.length > 0) {
      setSelectedCourseId(selectedVoucherList?.program_name);
      setSkipCourseApiCall(false);
    }
  }, [selectedVoucherList]);
  const pushNotification = useToasterHook();
  useEffect(() => {
    if (
      voucherName &&
      quantity &&
      costPerVoucher &&
      assignedPublisher &&
      voucherDuration?.length > 0 &&
      selectedCourseId.length > 0
    ) {
      if (selectedVoucherList?.used > parseInt(quantity)) {
        pushNotification(
          "warning",
          "The Quantity value must be greater than the Used value!"
        );
        return setButtonDisabled(true);
      } else if (voucherDuration?.length > 0) {
        if (selectedVoucherList?.status === "Upcoming") {
          const todayDate = new Date();
          if (
            formatDatePromoCodePreview(todayDate) >
            formatDatePromoCodePreviewForString(voucherDuration[0])
          ) {
            pushNotification(
              "warning",
              "Start Date must be greater than today Date!"
            );
            return setButtonDisabled(true);
          }
        }
        if (selectedVoucherList?.status === "Inactive") {
          const todayDate = new Date();
          if (
            formatDatePromoCodePreview(todayDate) >
            formatDatePromoCodePreviewForString(voucherDuration[0])
          ) {
            pushNotification(
              "warning",
              "Start Date can be equal to Today date or greater than Today!"
            );
            return setButtonDisabled(true);
          }
        }
        if (selectedVoucherList?.status === "Active") {
          if (
            formatDatePromoCodePreview(selectedVoucherList?.start_date) !==
            formatDatePromoCodePreview(voucherDuration[0])
          ) {
            pushNotification("warning", "Don't change the start Date!");
            return setButtonDisabled(true);
          }
        }
        if (selectedVoucherList?.status === "Expired") {
          pushNotification("warning", "This Voucher all ready Expired!");
          return setButtonDisabled(true);
        }
        const today = new Date();
        if (
          formatDatePromoCodePreview(today) >
          formatDatePromoCodePreviewForString(voucherDuration[1])
        ) {
          pushNotification(
            "warning",
            "End Date can be equal to Today date or must be greater than Today!"
          );
          return setButtonDisabled(true);
        }
      } else {
        return setButtonDisabled(false);
      }
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [
    voucherName,
    quantity,
    costPerVoucher,
    assignedPublisher,
    voucherDuration,
    selectedCourseId,
  ]);
  const { beforeToday } = DateRangePicker;

  //{Voucher Status update}
  const [
    updateVoucherInternalServerError,
    setUpdateVoucherInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInUpdateVoucher,
    setSomethingWentWrongInUpdateVoucher,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [updateVoucherInfo] = useUpdateVoucherInfoMutation();
  const handleUpdatePromoCodeStatus = () => {
    const voucherPayload = {
      name: voucherName,
      quantity: quantity ? parseInt(quantity) : 0,
      cost_per_voucher: costPerVoucher ? parseInt(costPerVoucher) : 0,
      duration: GetFormatDate(voucherDuration),
      assign_to: assignedPublisher,
      program_name: selectedCourseId,
      status: false,
    };
    setLoading(true);
    updateVoucherInfo({
      collegeId: collegeId,
      voucherId: selectedVoucherId,
      payload: voucherPayload,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Voucher Info Update Successful");
              handleVoucherPreviewClose();
              setSelectedVoucherId([]);
              setSelectedVoucherList([]);
            } else {
              throw new Error("Updated voucher API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdateVoucher,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdateVoucherInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={openPreviewVoucher}
        onClose={handleVoucherPreviewClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Box className="create-promoCode-voucher-headline-text">
            <Typography className="create-promoCode-voucher-text-to-create">
              Voucher Details | {selectedVoucherList?.name}
            </Typography>
            <IconButton>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleVoucherPreviewClose()}
              />
            </IconButton>
          </Box>
          {loading && (
            <Box sx={{ display: "grid", placeItems: "center" }}>
              <CircularProgress color="info" />
            </Box>
          )}
          {updateVoucherInternalServerError ||
          somethingWentWrongInUpdateVoucher ? (
            <>
              {updateVoucherInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInUpdateVoucher && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <>
              <Box
                className="promoCode-input-box-container"
                sx={{ mt: "20px" }}
              >
                <VoucherInputComponent
                  setVoucherName={setVoucherName}
                  voucherName={voucherName}
                  selectedVoucherList={selectedVoucherList}
                  hidePublisherList={hidePublisherList}
                  assignedPublisher={assignedPublisher}
                  publisherList={publisherList}
                  publisherListApiCallInfo={publisherListApiCallInfo}
                  setSkipPublisherApiCall={setSkipPublisherApiCall}
                  setAssignedPublisher={setAssignedPublisher}
                  hideCourseList={hideCourseList}
                  setSelectedCourseId={setSelectedCourseId}
                  courseDetails={courseDetails}
                  selectedCourseId={selectedCourseId}
                  courseListInfo={courseListInfo}
                  setSkipCourseApiCall={setSkipCourseApiCall}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  costPerVoucher={costPerVoucher}
                  setCostPerVoucher={setCostPerVoucher}
                  voucherDuration={voucherDuration}
                  setVoucherDuration={setVoucherDuration}
                  beforeToday={beforeToday}
                />
              </Box>
              <Box className="create-voucher-promoCode-button-container">
                <Button
                  sx={{ borderRadius: 50 }}
                  className="create-voucher-promoCode-cancel-button"
                  color="info"
                  variant="outlined"
                  onClick={() => {
                    handleVoucherPreviewClose();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{ borderRadius: 50 }}
                  className={
                    buttonDisabled
                      ? "create-voucher-promoCode-create-button-disabled"
                      : "create-voucher-promoCode-create-button"
                  }
                  color="info"
                  variant="contained"
                  disabled={buttonDisabled}
                  onClick={() => {
                    handleUpdatePromoCodeStatus();
                  }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoucherDetailsPreview;
