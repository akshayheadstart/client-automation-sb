import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Card, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteArchivedInterviewListMutation,
  useUpdateInterviewListStatusMutation,
} from "../../Redux/Slices/filterDataSlice";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import useToasterHook from "../../hooks/useToasterHook";
import SelectTemplateDialog from "../../pages/TemplateManager/SelectTemplateDialog";
import "../../styles/ApplicationManagerTable.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import CustomTooltip from "../shared/Popover/Tooltip";
import ChangeStatus from "../shared/ViewStudentList/ChangeStatus";
import Mail from "../userProfile/Mail";
import SmsAndWhatsapp from "../userProfile/SmsAndWhatsapp";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

const InterviewListTableActions = ({
  isScrolledToPagination,
  selectedInterviewList,
  setSelectedInterviewList,
  setApiResponseChangeMessage,
  setInterviewListInternalServerError,
  setInterviewListSomethingWentWrong,
  localStorageKeyName,
  localStorageKey,
  from,
}) => {
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const status = ["Active", "Closed", "Archived"];
  const ref = useRef();

  const [isComposeOpen, setIsComposeOpen] = useState(false);
  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    useState(false);
  const [templateId, setTemplateId] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [templateBody, setTemplateBody] = useState("");
  const [smsDltContentId, setSmsDltContentId] = useState("");
  const [smsType, setSmsType] = useState("");
  const [smsSenderName, setSmsSenderName] = useState("");

  const [openDialogsSms, setOpenDialogsSms] = useState(false);
  const [openDialogsWhatsapp, setOpenDialogsWhatsapp] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [clickedArchive, setClickedArchive] = useState(false);

  const handleComposerClose = () => {
    setIsComposeOpen(false);
  };

  const handleClickOpenDialogsSms = () => {
    setOpenDialogsSms(true);
  };

  const handleCloseSelectTemplate = () => {
    setOpenSelectTemplateDialog(false);
  };
  const handleCloseDialogsSms = () => {
    setOpenDialogsSms(false);
  };

  const handleClickOpenSelectTemplate = (type) => {
    setOpenSelectTemplateDialog(true);
    setTemplateType(type);
  };
  const handleClickOpenDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(true);
  };
  const handleCloseDialogsWhatsapp = () => {
    setOpenDialogsWhatsapp(false);
  };

  const [updateInterviewListStatus] = useUpdateInterviewListStatusMutation();
  function handleSelectMenu(status) {
    setLoadingChangeStatus(true);
    updateInterviewListStatus({
      status: status,
      collegeId,
      selectedInterviewList,
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
            setSelectedInterviewList([]);
            localStorage.removeItem(localStorageKeyName);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setInterviewListSomethingWentWrong,
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
        } else if (error?.status === 500) {
          handleInternalServerError(
            setInterviewListInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setLoadingChangeStatus(false));
  }

  const [isDownloading, setIsDownloading] = useState(false);

  //download interview list
  const handleInterviewListDownload = () => {
    setIsDownloading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/interview/download_interview_list/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(selectedInterviewList))
    )
      .then((res) =>
        res.json().then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.message) {
            const expectedData = result?.file_url;
            try {
              if (typeof expectedData === "string") {
                window.open(result?.file_url);
                setSelectedInterviewList([]);
                localStorage.removeItem(localStorageKeyName);
              } else {
                throw new Error(
                  "download interview list API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setInterviewListSomethingWentWrong,
                "",
                5000
              );
            }
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
      )
      .catch((err) => {
        handleInternalServerError(
          setInterviewListInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsDownloading(false));
  };

  const [deleteArchivedInterviewList] =
    useDeleteArchivedInterviewListMutation();
  const handleArchivedListDelete = () => {
    setLoadingChangeStatus(true);
    deleteArchivedInterviewList({
      selectedArchivedList: selectedInterviewList,
      collegeId,
    })
      .unwrap()
      .then((data) => {
        try {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.message) {
            pushNotification("success", data?.message);
            setSelectedInterviewList([]);
            localStorage.removeItem(localStorageKeyName);
          } else if (data?.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setInterviewListSomethingWentWrong,
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
        } else if (error?.status === 500) {
          handleInternalServerError(
            setInterviewListInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setLoadingChangeStatus(false));
  };

  return (
    <Box className="lead-action-container">
      <Box className="lead-action-wrapper">
        <Card
          className={`lead-action-card ${
            isScrolledToPagination ? "move-up" : "move-down"
          }`}
        >
          <Box className="lead-action-content-container">
            <Box className="lead-action-content">
              <Typography variant="subtitle1">
                {selectedInterviewList?.length} item selected
              </Typography>
            </Box>

            {from === "archived-list" ? (
              <Box
                onClick={() => {
                  setClickedArchive(true);
                  setOpenDeleteDialog(true);
                }}
                className="lead-action-content"
              >
                <DeleteOutlineOutlinedIcon /> Delete
              </Box>
            ) : (
              <>
                <Box
                  onClick={() => {
                    setClickedArchive(true);
                    setOpenDeleteDialog(true);
                  }}
                  className="lead-action-content"
                >
                  <DeleteOutlineOutlinedIcon /> Archive
                </Box>

                {!clickedArchive && loadingChangeStatus ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  <Box className="lead-action-content">
                    <ChangeStatus
                      reference={ref}
                      handleSelectMenu={handleSelectMenu}
                      statusList={status}
                    />
                  </Box>
                )}
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => setIsComposeOpen(true)}
                        className="lead-action-content"
                      >
                        <EmailOutlinedIcon /> Email
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => setIsComposeOpen(true)}
                    className="lead-action-content"
                  >
                    <EmailOutlinedIcon /> Email
                  </Box>
                )}
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => handleClickOpenSelectTemplate("sms")}
                        className="lead-action-content"
                      >
                        <SmsOutlinedIcon /> SMS
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => handleClickOpenSelectTemplate("sms")}
                    className="lead-action-content"
                  >
                    <SmsOutlinedIcon /> SMS
                  </Box>
                )}
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        onClick={() => {
                          handleClickOpenSelectTemplate("whatsapp");
                          handleClickOpenDialogsWhatsapp();
                        }}
                        className="lead-action-content"
                      >
                        <WhatsAppIcon /> Whatsapp
                      </Box>
                    }
                    color={true}
                    placement={"top"}
                    accountType={
                      import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                        ? true
                        : false
                    }
                  />
                ) : (
                  <Box
                    onClick={() => {
                      handleClickOpenSelectTemplate("whatsapp");
                      handleClickOpenDialogsWhatsapp();
                    }}
                    className="lead-action-content"
                  >
                    <WhatsAppIcon /> Whatsapp
                  </Box>
                )}

                {isDownloading ? (
                  <CircularProgress size={25} color="info" />
                ) : (
                  <Box
                    onClick={handleInterviewListDownload}
                    className="lead-action-content"
                  >
                    <FileDownloadOutlinedIcon /> Download
                  </Box>
                )}
              </>
            )}
          </Box>
        </Card>
      </Box>
      {/* select sms template component  */}
      {openSelectTemplateDialog && (
        <SelectTemplateDialog
          setTemplateId={setTemplateId}
          handleClickOpenDialogsSms={handleClickOpenDialogsSms}
          openDialoge={openSelectTemplateDialog}
          handleClose={handleCloseSelectTemplate}
          setTemplateBody={setTemplateBody}
          setSmsDltContentId={setSmsDltContentId}
          setSmsType={setSmsType}
          setSenderName={setSmsSenderName}
          from={templateType}
        ></SelectTemplateDialog>
      )}

      {/* Send Sms  */}
      <Box>
        <SmsAndWhatsapp
          color="#DD34B8"
          name={"SMS"}
          handleClickOpenDialogs={handleClickOpenDialogsSms}
          handleCloseDialogs={handleCloseDialogsSms}
          openDialogs={openDialogsSms}
          setOpenDialogs={setOpenDialogsSms}
          smsType={smsType}
          smsSenderName={smsSenderName}
          selecteMobileNumber={selectedInterviewList}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          from="interview-list"
          setSelectedMobileNumbers={setSelectedInterviewList}
          localStorageKey={localStorageKey}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          color="#25D366"
          name={"WhatsApp"}
          templateId={templateId}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          selecteMobileNumber={selectedInterviewList}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsapp}
          handleCloseDialogs={handleCloseDialogsWhatsapp}
          openDialogs={openDialogsWhatsapp}
          setOpenDialogs={setOpenDialogsWhatsapp}
          from="interview-list"
          setSelectedMobileNumbers={setSelectedInterviewList}
          localStorageKey={localStorageKey}
        ></SmsAndWhatsapp>
      </Box>
      <Mail
        email={selectedInterviewList}
        open={isComposeOpen}
        onClose={handleComposerClose}
        hideToInputField={true}
        setSelectedEmails={setSelectedInterviewList}
        localStorageKey={localStorageKey}
        from="interview-list"
        selectedEmails={selectedInterviewList}
        sendBulkEmail={true}
      ></Mail>
      <DeleteDialogue
        handleDeleteSingleTemplate={() => {
          if (from === "archived-list") {
            handleArchivedListDelete();
          } else {
            handleSelectMenu("Archived");
          }
        }}
        openDeleteModal={openDeleteDialog}
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        loading={clickedArchive && loadingChangeStatus}
        title={`Are you sure you want to ${
          from === "archived-list" ? "Delete" : "Archive"
        }?`}
      />
    </Box>
  );
};
export default InterviewListTableActions;
