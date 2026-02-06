import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useState } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import Cookies from "js-cookie";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import "../../styles/sharedStyles.css";
import { useDispatch } from "react-redux";
import { tableSlice } from "../../Redux/Slices/applicationDataApiSlice";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const SmsAndWhatsapp = (props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
    "& .MuiDialog-root": {
      maxWidth: false,
    },
  }));

  const {
    templateBody,
    smsDltContentId,
    selecteMobileNumber,
    from,
    setSelectedApplications,
    setSelectedEmails,
    setSelectedMobileNumbers,
    setTemplateBody,
    smsType,
    smsSenderName,
    selectedRawDataUploadHistoryRow,
    setSelectedRawDataUploadHistoryRow,
    templateId,
    dataSegmentId,
    timelineTagInvalidate,
  } = props || {};

  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const dispatch = useDispatch();
  const {
    setApiResponseChangeMessage,
    apiResponseChangeMessage,
    whatsappTemplateObjectId,
  } = useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [somethingWentWrongInSendSms, setSomethingWentWrongInSendSms] =
    useState(false);
  const [sendSmsInternalServerError, setSendSmsInternalServerError] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendSms = (e) => {
    e.preventDefault();

    let payload;
    if (props?.name === "SMS") {
      if (from === "lead-manager" || from === "interview-list") {
        payload = {
          send_to: selecteMobileNumber,
        };
      } else if (from === "data-segment") {
        payload = {
          send_to: selecteMobileNumber,
          data_segments_ids: selecteMobileNumber,
        };
      } else {
        payload = {
          send_to: [selecteMobileNumber],
        };
      }
    } else {
      if (from === "lead-manager" || from === "interview-list") {
        payload = {
          send_to: selecteMobileNumber,
          template_id: templateId,
          template_content: templateBody,
          whatsapp_obj_id: whatsappTemplateObjectId,
        };
      } else if (from === "data-segment") {
        payload = {
          send_to: selecteMobileNumber,
          data_segments_ids: selecteMobileNumber,
          template_id: templateId,
          template_content: templateBody,
          whatsapp_obj_id: whatsappTemplateObjectId,
        };
      } else {
        payload = {
          send_to: [selecteMobileNumber],
          template_id: templateId,
          template_content: templateBody,
          whatsapp_obj_id: whatsappTemplateObjectId,
        };
      }
    }

    setIsLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification(
        "success",
        `Successfully sent ${
          props.name === "SMS" ? "SMS" : "What's app message"
        } !`
      );
      setIsLoading(false);
      props?.handleCloseDialogs();
      setTemplateBody("");
    } else {
      customFetch(
        `${import.meta.env.VITE_API_BASE_URL}${
          props.name === "SMS"
            ? `/sms/send_to_user/?sms_content=${encodeURIComponent(
                templateBody
              )}&dlt_content_id=${smsDltContentId}&sms_type=${smsType}&sender_name=${smsSenderName}&is_interview_list=${
                from === "interview-list" ? true : false
              }${dataSegmentId ? `&data_segment_id=${dataSegmentId}` : ""}${
                collegeId ? "&college_id=" + collegeId : ""
              }`
            : `/whatsapp/send_whatsapp_to_user/?is_interview_list=${
                from === "interview-list" ? true : false
              }${dataSegmentId ? `&data_segment_id=${dataSegmentId}` : ""}${
                collegeId ? "&college_id=" + collegeId : ""
              }`
        }`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
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
                  props?.handleCloseDialogs();
                  if (timelineTagInvalidate) {
                    dispatch(
                      tableSlice.util.invalidateTags([
                        "UserProfileTimelineInfo",
                      ])
                    );
                  }
                  setSelectedMobileNumbers([]);
                  localStorage.removeItem(
                    `${Cookies.get("userId")}${props?.localStorageKey}`
                  );
                  setSelectedApplications([]);
                  setSelectedEmails([]);
                  setSelectedMobileNumbers([]);
                  setTemplateBody("");
                } else {
                  throw new Error("send sms API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSendSms,
                  props?.handleCloseDialogs,
                  5000
                );
                setTemplateBody("");
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
            }
          })
        )
        .catch((err) => {
          setTemplateBody("");
          handleInternalServerError(
            setSendSmsInternalServerError,
            props?.handleCloseDialogs,
            5000
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleSendSmsOnRawData = (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification(
        "success",
        `Successfully sent ${
          props.name === "SMS" ? "SMS" : "What's app message"
        } !`
      );
      setIsLoading(false);
      props?.handleCloseDialogs();
      setTemplateBody("");
    } else {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/manage/action_on_raw_data/?action=${
          props?.name === "SMS" ? "sms" : "whatsapp"
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        ApiCallHeaderAndBody(
          token,
          "POST",
          JSON.stringify(
            props?.name === "SMS"
              ? {
                  offline_ids: selectedRawDataUploadHistoryRow,
                  sms_content: templateBody,
                  dlt_content_id: smsDltContentId,
                  sms_type: smsType,
                  sender_name: smsSenderName,
                }
              : {
                  offline_ids: selectedRawDataUploadHistoryRow,
                  whatsapp_text: templateBody,
                  whatsapp_obj_id: whatsappTemplateObjectId,
                }
          )
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
                  props?.handleCloseDialogs();
                  setSelectedRawDataUploadHistoryRow([]);
                  setTemplateBody("");
                  localStorage.removeItem(
                    `${Cookies.get("userId")}${props?.localStorageKey}`
                  );
                } else {
                  throw new Error(
                    "perform action on raw data API response has changed"
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInSendSms,
                  props?.handleCloseDialogs,
                  5000
                );
                setTemplateBody("");
              }
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
            }
          })
        )
        .catch((err) => {
          setTemplateBody("");
          handleInternalServerError(
            setSendSmsInternalServerError,
            props?.handleCloseDialogs,
            5000
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <Box>
      <BootstrapDialog
        onClose={() => {
          props?.handleCloseDialogs();
          setTemplateBody("");
        }}
        aria-labelledby="customized-dialog-title"
        open={props?.openDialogs}
        maxWidth={false}
      >
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: " center", mt: 2 }}>
            <CircularProgress size={35} value="40" color="info" />
          </Box>
        )}
        <Box
          sx={{
            backgroundColor: "background.paper",
            minHeight: "100%",
            width: { md: "430px" },
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              display: "flex",

              px: 2,
              py: 1,
            }}
          >
            <Typography color={props?.color} variant="h6">
              {" "}
              {props?.name}
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            {props?.name === "WhatsApp" && (
              <Button
                onClick={() => props?.handleClickOpenSelectTemplate("whatsapp")}
                variant="text"
                color="info"
              >
                Select Template
              </Button>
            )}

            <IconButton
              onClick={() => {
                props?.handleCloseDialogs();
                setTemplateBody("");
              }}
              data-testid="mail-cancel-button"
            >
              <CancelIcon></CancelIcon>
            </IconButton>
          </Box>

          {somethingWentWrongInSendSms || sendSmsInternalServerError ? (
            <Box>
              {sendSmsInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInSendSms && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box
              sx={{
                pb: 3,
                px: 2,
              }}
            >
              <form
                onSubmit={
                  from === "raw-data" ? handleSendSmsOnRawData : handleSendSms
                }
              >
                {from !== "lead-manager" &&
                  from !== "raw-data" &&
                  from !== "interview-list" &&
                  from !== "data-segment" && (
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      defaultValue={selecteMobileNumber}
                      value={selecteMobileNumber}
                      required
                      fullWidth
                      label="Mobile No"
                      name="Mobile No"
                      rows={4}
                      color="info"
                    />
                  )}
                <TextField
                  InputProps={{
                    readOnly: true,
                  }}
                  defaultValue={templateBody}
                  sx={{ mt: 2 }}
                  required
                  fullWidth
                  label="Content"
                  name="content"
                  multiline
                  rows={4}
                  color="info"
                />
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button type="submit" className="common-contained-button">
                    Send
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Box>
      </BootstrapDialog>
    </Box>
  );
};

export default React.memo(SmsAndWhatsapp);
