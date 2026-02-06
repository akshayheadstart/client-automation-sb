import React, { useContext, useState } from "react";
import MinimizeIcon from "@mui/icons-material/Minimize";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  IconButton,
  Input,
  Paper,
  Portal,
  TextField,
  Typography,
} from "@mui/material";
import { QuillEditor } from "./quilEditor/quilEditor";
import Cookies from "js-cookie";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import "../../styles/EmailTemplateBuilder.css";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import SelectTemplateDialog from "../../pages/TemplateManager/SelectTemplateDialog";
import { EmailProviderList, EmailTypeList } from "../../constants/EmailList";
import { useSelector } from "react-redux";
import "../../styles/sharedStyles.css";
import { useDispatch } from "react-redux";
import { tableSlice } from "../../Redux/Slices/applicationDataApiSlice";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const Mail = (props) => {
  const {
    open,
    onClose,
    hideToInputField,
    sendBulkEmail,
    selectedEmails,
    emailPayload,
    payloadForEmail,
    from,
    selectedRawDataUploadHistoryRow,
    setSelectedRawDataUploadHistoryRow,
    formInitiated,
    dataSegmentId,
    timelineTagInvalidate,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [subjectOfEmail, setSubjectOfEmail] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [templateBody, setTemplateBody] = useState(null);
  const [showRequiredError, setShowRequiredError] = useState(false);
  // const [attachmentFiles, setAttachmentFiles] = useState({});
  const dispatch = useDispatch();
  const [
    sendSingleEmailInternalServerError,
    setSendSingleEmailInternalServerError,
  ] = useState(false);
  const [
    sendBulkEmailInternalServerError,
    setSendBulkEmailInternalServerError,
  ] = useState(false);
  const [somethingWentWrongInSendMail, setSomethingWentWrongInSendMail] =
    useState(false);
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const [emailType, setEmailType] = useState(null);
  const [emailProvider, setEmailProvider] = useState(null);
  const [templateId, setTemplateId] = useState("");
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const handleChange = (value) => {
    setMessageBody(value);
  };

  const handleExitFullScreen = () => {
    setIsFullScreen(false);
  };

  const handleEnterFullScreen = () => {
    setIsFullScreen(true);
  };

  const [openDialoge, setOpenDialoge] = React.useState(false);

  const handleClickOpen = () => {
    setOpenDialoge(true);
  };

  const handleClose = () => {
    setOpenDialoge(false);
  };

  const bulkEmailPayload =
    emailPayload === true
      ? {
          email_id: [],
          filter_option: payloadForEmail,
        }
      : props?.from === "interview-list"
      ? {
          interview_lists: selectedEmails,
        }
      : props?.from === "data-segment"
      ? {
          data_segments_ids: selectedEmails,
        }
      : {
          email_id: selectedEmails,
        };

  const resetFields = () => {
    setMessageBody("");
    setTemplateBody("");
    setSubjectOfEmail("");
    setEmailType(null);
    setEmailProvider(null);
    setTemplateId("");
  };

  const handleSendBulkEmail = (e) => {
    e.preventDefault();
    if (
      (messageBody?.includes("<br>") && messageBody?.length < 12) ||
      messageBody?.length < 1
    ) {
      setShowRequiredError(true);
      return;
    } else {
      setShowRequiredError(false);
    }

    setIsLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully sent mail !");
      setIsLoading(false);
      onClose();
      resetFields();
    } else {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/counselor/send_email_to_multiple_lead/?${
          templateId ? `template_id=${templateId}&` : ""
        }subject=${encodeURIComponent(subjectOfEmail)}${
          formInitiated ? "&form_initiated=false" : "&form_initiated=true"
        }${dataSegmentId ? `&data_segment_id=${dataSegmentId}` : ""}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        ApiCallHeaderAndBody(
          token,
          "POST",
          JSON.stringify({
            payload: bulkEmailPayload,
            template: messageBody,
            email_type: emailType?.toLowerCase(),
            email_provider: emailProvider?.toLowerCase(),
          })
        )
      )
        .then((res) =>
          res.json().then((data) => {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.message) {
              const expectedData = data?.message;
              try {
                if (typeof expectedData === "string") {
                  pushNotification("success", data?.message);
                  props?.onClose();
                  resetFields();
                  localStorage.removeItem(
                    `${Cookies.get("userId")}${props?.localStorageKey}`
                  );
                  props?.setSelectedEmails([]);
                  props?.setSelectedApplications([]);
                } else {
                  throw new Error(
                    "send_email_to_multiple_lead API response has changed"
                  );
                }
              } catch (error) {
                resetFields();
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSendMail,
                  props?.onClose,
                  5000
                );
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
              resetFields();
            }
          })
        )
        .catch((err) => {
          resetFields();
          handleInternalServerError(
            setSendBulkEmailInternalServerError,
            props?.onClose,
            5000
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (
      (messageBody?.includes("<br>") && messageBody?.length < 12) ||
      messageBody?.length < 1
    ) {
      setShowRequiredError(true);
      return;
    } else {
      setShowRequiredError(false);
    }

    setIsLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully sent mail !");
      setIsLoading(false);
      onClose();
      resetFields();
    } else {
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}/lead/send_email_sidebar?to=${
          props?.email
        }${
          templateId ? `&template_id=${templateId}` : ""
        }&subject=${encodeURIComponent(subjectOfEmail)}&email_type=${
          emailType ? emailType?.toLowerCase() : ""
        }&email_provider=${emailProvider ? emailProvider?.toLowerCase() : ""}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(messageBody))
      )
        .then((res) =>
          res.json().then((data) => {
            if (data.detail === "Could not validate credentials") {
              resetFields();
              window.location.reload();
            } else if (data?.message) {
              const expectedData = data?.message;
              try {
                if (typeof expectedData === "string") {
                  pushNotification("success", data?.message);
                  props?.onClose();
                  if (timelineTagInvalidate) {
                    dispatch(
                      tableSlice.util.invalidateTags([
                        "UserProfileTimelineInfo",
                      ])
                    );
                  }
                  resetFields();
                  props?.setSelectedApplications([]);
                  localStorage.removeItem(
                    `${Cookies.get("userId")}${props?.localStorageKey}`
                  );
                  props?.setSelectedEmails([]);
                } else {
                  throw new Error(
                    "send_email_sidebar API response has changed"
                  );
                }
              } catch (error) {
                resetFields();
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSendMail,
                  props?.onClose,
                  5000
                );
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
              resetFields();
            }
          })
        )
        .catch((err) => {
          resetFields();
          handleInternalServerError(
            setSendSingleEmailInternalServerError,
            props?.onClose,
            5000
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  if (!open) {
    return null;
  }

  const payloadForRawData = {
    offline_ids: selectedRawDataUploadHistoryRow,
    template: messageBody,
    subject: subjectOfEmail,
    email_type: emailType?.toLowerCase(),
    email_provider: emailProvider?.toLowerCase(),
  };

  const handleSendEmailOnRawData = (event) => {
    event.preventDefault();
    if (
      (messageBody?.includes("<br>") && messageBody?.length < 12) ||
      messageBody?.length < 1
    ) {
      setShowRequiredError(true);
      return;
    } else {
      setShowRequiredError(false);
    }

    setIsLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully sent mail !");
      setIsLoading(false);
      onClose();
      resetFields();
    } else {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/manage/action_on_raw_data/?action=email${
          templateId ? `&template_id=${templateId}` : ""
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(payloadForRawData))
      )
        .then((res) =>
          res.json().then((data) => {
            if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.message) {
              const expectedData = data?.message;
              try {
                if (typeof expectedData === "string") {
                  pushNotification("success", data?.message);
                  props?.onClose();
                  resetFields();
                  setSelectedRawDataUploadHistoryRow([]);
                  localStorage.removeItem(
                    `${Cookies.get("userId")}${props?.localStorageKey}`
                  );
                } else {
                  throw new Error(
                    "perform action on raw data API response has changed"
                  );
                }
              } catch (error) {
                resetFields();
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSendMail,
                  props?.onClose,
                  5000
                );
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
              resetFields();
            }
          })
        )
        .catch((err) => {
          resetFields();
          handleInternalServerError(
            setSendBulkEmailInternalServerError,
            props?.onClose,
            5000
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Portal>
      <Backdrop open={isFullScreen} />
      <form
        onSubmit={
          from === "raw-data"
            ? handleSendEmailOnRawData
            : sendBulkEmail === true
            ? handleSendBulkEmail
            : handleSendEmail
        }
      >
        <Paper
          sx={{
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            margin: 3,
            maxHeight: (theme) => `calc(100% - ${theme.spacing(6)})`,
            maxWidth: (theme) => `calc(100% - ${theme.spacing(6)})`,
            minHeight: 500,
            outline: "none",
            position: "fixed",
            right: 0,
            width: 600,
            boxShadow:
              "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
            zIndex: 2000,
            ...(isFullScreen && {
              height: "100%",
              width: "100%",
            }),
          }}
          elevation={12}
        >
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: " center", mt: 2 }}>
              <CircularProgress size={35} value="40" color="info" />
            </Box>
          )}
          {sendSingleEmailInternalServerError ||
          sendBulkEmailInternalServerError ||
          somethingWentWrongInSendMail ? (
            <Box>
              <Typography sx={{ pl: 2, py: 2 }} variant="h6">
                Send Email
              </Typography>
              {(sendSingleEmailInternalServerError ||
                sendBulkEmailInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInSendMail && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",

                  px: 2,
                  py: 1,
                }}
              >
                <Typography variant="h6">New Message</Typography>

                <Box sx={{ flexGrow: 1 }} />

                {templateBody ? (
                  <Button
                    endIcon={<CheckCircleIcon />}
                    onClick={handleClickOpen}
                    variant="text"
                  >
                    Selected
                  </Button>
                ) : (
                  <Button onClick={handleClickOpen} variant="text" color="info">
                    Select Template
                  </Button>
                )}

                {templateBody && (
                  <Button
                    onClick={() => {
                      resetFields();
                    }}
                    variant="text"
                  >
                    Reset
                  </Button>
                )}
                {isFullScreen ? (
                  <IconButton onClick={handleExitFullScreen}>
                    <MinimizeIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton onClick={handleEnterFullScreen}>
                    <OpenWithIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => {
                    onClose();
                    resetFields();
                    setShowRequiredError(false);
                  }}
                  data-testid="mail-cancel-button"
                >
                  <CancelIcon></CancelIcon>
                </IconButton>
              </Box>

              {hideToInputField !== true && (
                <Input
                  required
                  disableUnderline
                  fullWidth
                  value={props?.email}
                  readOnly={true}
                  placeholder="To"
                  type="email"
                  sx={{
                    p: 1,
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                />
              )}

              <Input
                required
                disableUnderline
                fullWidth
                type="text"
                placeholder="Subject"
                value={subjectOfEmail}
                onChange={(e) => setSubjectOfEmail(e.target.value)}
                sx={{
                  p: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              />
              {templateBody ? (
                <iframe
                  style={{ pointerEvents: "none" }}
                  srcDoc={templateBody}
                  title="3"
                  width="100%"
                  height={`${window.innerHeight * 0.9}px`}
                ></iframe>
              ) : (
                <QuillEditor
                  onChange={handleChange}
                  placeholder="Leave a message"
                  sx={{
                    border: "none",
                    flexGrow: 1,
                  }}
                />
              )}
              <Divider />
              {showRequiredError && templateBody !== null && !templateBody && (
                <FormHelperText error sx={{ ml: 2 }}>
                  Required *
                </FormHelperText>
              )}

              {templateBody?.length > 0 || (
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    px: 1,
                  }}
                >
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={EmailTypeList}
                    sx={{ width: 280 }}
                    value={emailType}
                    onChange={(_, newValue) => {
                      setEmailType(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Email Type"
                        color="info"
                      />
                    )}
                  />

                  <Autocomplete
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={EmailProviderList}
                    sx={{ width: 280 }}
                    value={emailProvider}
                    onChange={(_, newValue) => {
                      setEmailProvider(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Email Provider"
                        color="info"
                      />
                    )}
                  />
                </Box>
              )}

              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button
                  size="small"
                  type="submit"
                  variant="contained"
                  color="info"
                  sx={{ borderRadius: 50 }}
                  className="save-button-design"
                >
                  Send
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </form>

      {openDialoge && (
        <SelectTemplateDialog
          openDialoge={openDialoge}
          handleClose={handleClose}
          setSubjectOfEmail={setSubjectOfEmail}
          setMessageBody={setMessageBody}
          setTemplateBody={setTemplateBody}
          from={"email"}
          setEmailType={setEmailType}
          setEmailProvider={setEmailProvider}
          setTemplateId={setTemplateId}
        ></SelectTemplateDialog>
      )}
    </Portal>
  );
};

export default React.memo(Mail);
