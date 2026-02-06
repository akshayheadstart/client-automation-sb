import DoNotDisturbAltOutlinedIcon from "@mui/icons-material/DoNotDisturbAltOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Card, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import SelectTemplateDialog from "../../../pages/TemplateManager/SelectTemplateDialog";
import Mail from "../../userProfile/Mail";
import SmsAndWhatsapp from "../../userProfile/SmsAndWhatsapp";
import CustomTooltip from "../Popover/Tooltip";
const ViewStudentListActions = ({
  isScrolledToPagination,
  selectedStudent,
  handleDownloadStudentDetails,
  downloadLoading,
  setOpenDeleteModal,
  selectedEmail,
  selectedMobileNumbers,
  setSelectedEmail,
}) => {
  const [openSentEmailBox, setOpenSentEmailBox] = useState(false);
  //select sms template component
  const [openSelectTemplateDialog, setOpenSelectTemplateDialog] =
    React.useState(false);
  const [templateId, setTemplateId] = useState("");
  const [templateType, setTemplateType] = React.useState("");
  const [templateBody, setTemplateBody] = React.useState("");
  const [smsDltContentId, setSmsDltContentId] = React.useState("");
  const [smsType, setSmsType] = React.useState("");
  const [smsSenderName, setSenderName] = React.useState("");

  const [openDialogsSms, setOpenDialogsSms] = React.useState(false);
  const [openDialogsWhatsapp, setOpenDialogsWhatsapp] = React.useState(false);

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
                {selectedStudent} student selected
              </Typography>
            </Box>
            <Box onClick={setOpenDeleteModal} className="lead-action-content">
              <DoNotDisturbAltOutlinedIcon /> Delist
            </Box>
            {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
              <CustomTooltip
                description={<div>Will not work in demo</div>}
                component={
                  <Box
                    onClick={setOpenSentEmailBox}
                    className="lead-action-content"
                  >
                    <EmailOutlinedIcon /> Email
                  </Box>
                }
                color={true}
                placement={"top"}
                accountType={
                  import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
                }
              />
            ) : (
              <Box
                onClick={setOpenSentEmailBox}
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
                    onClick={() => {
                      handleClickOpenSelectTemplate("sms");
                    }}
                    className="lead-action-content"
                  >
                    <SmsOutlinedIcon /> SMS
                  </Box>
                }
                color={true}
                placement={"top"}
                accountType={
                  import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
                }
              />
            ) : (
              <Box
                onClick={() => {
                  handleClickOpenSelectTemplate("sms");
                }}
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
                  import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
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

            {downloadLoading ? (
              <CircularProgress size={25} color="info" />
            ) : (
              <Box
                onClick={handleDownloadStudentDetails}
                className="lead-action-content"
              >
                <FileDownloadOutlinedIcon /> Download
              </Box>
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
          setSenderName={setSenderName}
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
          selecteMobileNumber={selectedMobileNumbers}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          smsDltContentId={smsDltContentId}
          from={"lead-manager"}
        ></SmsAndWhatsapp>
      </Box>
      <Box>
        <SmsAndWhatsapp
          templateId={templateId}
          color="#25D366"
          name={"WhatsApp"}
          handleClickOpenSelectTemplate={handleClickOpenSelectTemplate}
          selecteMobileNumber={selectedMobileNumbers}
          templateBody={templateBody}
          setTemplateBody={setTemplateBody}
          handleClickOpenDialogs={handleClickOpenDialogsWhatsapp}
          handleCloseDialogs={handleCloseDialogsWhatsapp}
          openDialogs={openDialogsWhatsapp}
          setOpenDialogs={setOpenDialogsWhatsapp}
          from={"lead-manager"}
        ></SmsAndWhatsapp>
      </Box>
      <Mail
        email={selectedEmail}
        open={openSentEmailBox}
        onClose={setOpenSentEmailBox}
        hideToInputField={true}
        sendBulkEmail={true}
        selectedEmails={selectedEmail}
        setSelectedEmails={setSelectedEmail}
      ></Mail>
    </Box>
  );
};
export default ViewStudentListActions;
