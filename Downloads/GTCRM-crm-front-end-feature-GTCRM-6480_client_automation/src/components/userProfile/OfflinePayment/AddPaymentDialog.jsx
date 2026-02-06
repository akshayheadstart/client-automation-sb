import CloseIcon from "@mui/icons-material/Close";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input, InputGroup, SelectPicker } from "rsuite";
import {
  useGetAllCourseListQuery,
  useManualAddPaymentMutation,
} from "../../../Redux/Slices/filterDataSlice";
import {
  organizeCourseFilterCourseIdOption,
  paymentDeviceInfo,
} from "../../../helperFunctions/filterHelperFunction";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import "../../../styles/leadDetails.css";
import "../../../styles/leadofflinePayment.css";
import "../../../styles/sharedStyles.css";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import BorderLineText from "../../ui/NestedAutomation/AutomationHelperComponent/BorderLineText";
import {
  allowedTypes,
  MAX_FILE_SIZE,
  reasonList,
} from "../../../constants/LeadStageList";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { filterOptionData } from "../../../Redux/Slices/filterDataSlice";
import { useDispatch } from "react-redux";
import { tableSlice } from "../../../Redux/Slices/applicationDataApiSlice";
import { adminDashboardSlice } from "../../../Redux/Slices/adminDashboardSlice";
const AddPaymentDialog = ({
  handleAddPaymentOfflineClose,
  openAddPaymentOffline,
  programName,
  applicationId,
}) => {
  const { studentInfoDetails } = useContext(LayoutSettingContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [name, setName] = useState(
    studentInfoDetails?.student_name ? studentInfoDetails?.student_name : ""
  );
  const [amount, setAmount] = useState(
    studentInfoDetails?.amount ? studentInfoDetails?.amount : null
  );
  const [paymentId, setPaymentId] = useState("");
  const [addNote, setAddNote] = useState("");
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [customSelectedReason, setCustomSelectedReason] = useState("");
  const [indexOfOther, setIndexOfOther] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(programName);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(
    programName?.length > 0 ? false : true
  );
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const dispatch = useDispatch();
  const [hideCourseList, setHideCourseList] = useState(false);
  //get course list
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

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (allowedTypes.includes(file?.type) && file?.size < MAX_FILE_SIZE) {
        setSelectedFile(file);
      } else {
        if(!allowedTypes.includes(file?.type)){
          pushNotification(
            "error",
            "File type should be .png, .jpg, .jpeg, .doc, .pdf"
          );
        }
        if(file?.size > MAX_FILE_SIZE){
          pushNotification(
            "error",
            "File size exceeds the maximum limit of 5MB."
          );
        }
        
      }
    }
  };
  const deviceOs = window.navigator.userAgentData?.platform;
  const paymentDevice = paymentDeviceInfo(window.innerWidth);
  const pushNotification = useToasterHook();
  const [addOfflinePaymentLoading, setAddOfflinePaymentLoading] =
    useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    somethingWentWrongInAddOfflinePayment,
    setSomethingWentWrongInAddOfflinePayment,
  ] = useState(false);
  const [
    addOfflinePaymentInternalServerError,
    setAddOfflinePaymentServerError,
  ] = useState(false);
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const [addManualPayment] = useManualAddPaymentMutation();
  const handleAddManualPayment = () => {
    const formData = new FormData();
    formData.append("document_files", selectedFile, selectedFile.name);

    setAddOfflinePaymentLoading(true);
    addManualPayment({
      name: name,
      amount: amount,
      courseName: selectedCourseId[0]?.course_name,
      sPceName: selectedCourseId[0]?.course_name,
      applicationId: applicationId,
      paymentId: paymentId,
      selectedReason: selectedReason,
      note: addNote,
      paymentDevice: paymentDevice,
      deviceOS: deviceOs,
      payload: formData,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Add offline payment Successful");
              handleAddPaymentOfflineClose();
              dispatch(
                filterOptionData.util.invalidateTags(["AllOfflinePaymentList"])
              );
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
                adminDashboardSlice.util.invalidateTags([
                  "getScoreBoard",
                  "getProgramWise",
                  "getApplicationFunnel",
                  "getLeadVsApplications",
                  "getSourceWise",
                ])
              );
            } else {
              throw new Error("add offline payment API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAddOfflinePayment,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setAddOfflinePaymentServerError, "", 10000);
        }
      })
      .finally(() => {
        setAddOfflinePaymentLoading(false);
      });
  };
  useEffect(() => {
    if (
      name &&
      selectedCourseId.length > 0 &&
      amount &&
      paymentId &&
      selectedReason &&
      selectedFile
    ) {
      setSaveButtonDisabled(true);
    } else {
      setSaveButtonDisabled(false);
    }
  }, [name, selectedCourseId, amount, paymentId, selectedReason, selectedFile]);
  useEffect(() => {
    const modifiedResponse = reasonList?.map((reason, index) => {
      if (reason?.label === "Other") {
        setIndexOfOther(index);
        return {
          label: "",
          value: reason?.value,
        };
      }
      return {
        label: reason?.label,
        value: reason?.value,
      };
    });
    setReasons(modifiedResponse);
  }, [reasonList]);
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openAddPaymentOffline}
        onClose={handleAddPaymentOfflineClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Box className="create-add-payment-headline-text">
            <Typography className="create-add-payment-text-to-create">
              Add Payment
            </Typography>
            <IconButton>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => handleAddPaymentOfflineClose()}
              />
            </IconButton>
          </Box>
          {addOfflinePaymentInternalServerError ||
          somethingWentWrongInAddOfflinePayment ? (
            <>
              {addOfflinePaymentInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInAddOfflinePayment && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <Box className="input-field-placeholder-design">
                    <Input
                      placeholder={"Name*"}
                      size="md"
                      className="select-picker select-picker-design"
                      onChange={(event) => {
                        setName(event);
                      }}
                      value={name}
                      style={{ width: "100%" }}
                      readOnly={true}
                    />
                    {name && (
                      <BorderLineText
                        text={"Name*"}
                        width={30}
                      ></BorderLineText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  {hideCourseList || (
                    <MultipleFilterSelectPicker
                      style={{ width: "280px" }}
                      placement="bottomEnd"
                      placeholder="Course*"
                      className="dashboard-select-picker input-field-placeholder-color-for-check-picker"
                      onChange={(value) => {
                        setSelectedCourseId(value);
                      }}
                      pickerData={courseDetails}
                      setSelectedPicker={setSelectedCourseId}
                      pickerValue={selectedCourseId}
                      loading={courseListInfo.isFetching}
                      onOpen={() => setSkipCourseApiCall(false)}
                      readOnly={true}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box className="input-field-placeholder-design">
                    <Input
                      placeholder={"Amount*"}
                      size="md"
                      className="select-picker select-picker-design"
                      type="number"
                      value={amount}
                      onChange={(value) => {
                        setAmount(value);
                      }}
                      readOnly={true}
                    />
                    {amount && (
                      <BorderLineText
                        text={"Amount*"}
                        width={50}
                      ></BorderLineText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box className="input-field-placeholder-design">
                    <InputGroup
                      inside
                      style={{ width: "100%" }}
                      className="select-picker select-picker-design"
                    >
                      <Input
                        placeholder={
                          selectedFile ? selectedFile.name : "Upload Document*"
                        }
                        readOnly
                      />
                      <InputGroup.Addon onClick={handleFileClick}>
                        <Box className="add-payment-upload-input-icon">
                          <FileUploadOutlinedIcon
                            sx={{ height: "12px", color: "white" }}
                          />
                        </Box>
                      </InputGroup.Addon>
                      <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </InputGroup>
                    {selectedFile && (
                      <BorderLineText
                        text={"Upload Document*"}
                        width={90}
                      ></BorderLineText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box className="input-field-placeholder-design">
                    <Input
                      placeholder={"Payment ID*"}
                      size="md"
                      className="select-picker select-picker-design"
                      type="string"
                      value={paymentId}
                      onChange={(value) => {
                        setPaymentId(value);
                      }}
                    />
                    {paymentId && (
                      <BorderLineText
                        text={"Payment ID*"}
                        width={70}
                      ></BorderLineText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box className="input-field-placeholder-design">
                    {/* <SelectPicker size="md" placeholder="Reason*" data={reasonList}
            className="select-picker select-picker-design input-field-for-select-picker"
            style={{width:'100%'}}
            onChange={(value)=>handleReasonChange(value)}
            renderMenuItem={renderMenuItem}
            value={reason}
            
            /> */}
                    <SelectPicker
                      value={selectedReason}
                      searchable={false}
                      placeholder="Reasons*"
                      className="select-picker select-picker-design"
                      data={reasons}
                      block
                      menuMaxHeight={260}
                      // onOpen={() => setSkipReasonApiCall(false)}
                      // loading={isFetching}
                      onChange={(value) => {
                        const listOfReasons = [...reasons];
                        listOfReasons[indexOfOther] = {
                          label: "",
                          value: listOfReasons[indexOfOther]?.value,
                        };
                        setReasons(listOfReasons);

                        setSelectedReason(value);
                        setCustomSelectedReason("");
                      }}
                      renderMenuItem={(label, item) => (
                        <Box
                          onClick={(e) =>
                            item?.value === reasons[indexOfOther]?.value &&
                            e.stopPropagation()
                          }
                        >
                          {item?.value === reasons[indexOfOther]?.value ? (
                            <>
                              <Input
                                value={reasons[indexOfOther]?.label}
                                onChange={(value) => {
                                  const listOfReasons = [...reasons];

                                  listOfReasons[indexOfOther] = {
                                    label: value,
                                    value: item?.value,
                                  };
                                  setReasons(listOfReasons);
                                  setSelectedReason(item?.value);
                                  setCustomSelectedReason(value);
                                }}
                                placeholder={"Other"}
                              />
                            </>
                          ) : (
                            <Box className="check-out-box-container">
                              <Typography className="check-out-label-text-size">
                                {label}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    />
                    {selectedReason && (
                      <BorderLineText
                        text={"Reason*"}
                        width={50}
                      ></BorderLineText>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <Box
                    className="input-field-placeholder-design"
                    sx={{ mt: selectedReason ? "0px" : "15px" }}
                  >
                    <Input
                      as="textarea"
                      rows={2}
                      placeholder="Add Note"
                      value={addNote}
                      onChange={(value) => {
                        setAddNote(value);
                      }}
                      className="select-picker select-picker-design"
                      style={{ width: "100%" }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box className="add-payment-save-box-container">
                <Button
                  sx={{ borderRadius: 50 }}
                  className={
                    !saveButtonDisabled
                      ? "app-payment-save-button-disabled"
                      : "app-payment-save-button"
                  }
                  color="info"
                  variant="contained"
                  disabled={!saveButtonDisabled}
                  onClick={() => {
                    handleAddManualPayment();
                  }}
                >
                  {addOfflinePaymentLoading ? (
                    <CircularProgress
                      size={20}
                      sx={{ color: "white !important" }}
                    />
                  ) : (
                    "Save"
                  )}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPaymentDialog;
