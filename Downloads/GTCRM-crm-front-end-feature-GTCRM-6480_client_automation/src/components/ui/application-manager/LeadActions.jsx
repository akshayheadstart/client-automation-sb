import { Box, Card, CircularProgress, Typography } from "@mui/material";
import React from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "../../../icons/add-tag-icon.svg";
import MailIcon from "../../../icons/mail-icon.svg";
import SmsIcon from "../../../icons/sms-icon.svg";
import ChangeLeadStageIcon from "../../../icons/change-lead-stage-icon.svg";
import AssignCounsellorIcon from "../../../icons/assign-counsellor-icon.svg";
import MergeLeadIcon from "../../../icons/merge-lead-icon.svg";
import DownloadActionIcon from "../../../icons/download-action-icon.svg";
import SendVerificationIcon from "../../../icons/send-verification-link-icon.svg";
import WhatsappIcon from "../../../icons/whatsapp-icon.svg";

import AddTagDialog from "./AddTagDialog";
import { useState } from "react";
import CustomTooltip from "../../shared/Popover/Tooltip";
const LeadActions = (props) => {
  const {
    isDownloadLoading,
    showMergeLead,
    handleDownload,
    handleSentWhatsapp,
    handleSendSms,
    handleSentEmail,
    handleAssignCounselor,
    assignCounselorPermission,
    smsEmailWhatsappPermission,
    handleChangeLeadStage,
    changeLeadStagePermission,
    selectedApplications,
    isScrolledToPagination,
    publisher,
    handleAllApplicationsDownload,
    rawDataUploadHistory,
    handleSendVerificationEmail,
    handleClickOpenSelectTemplate,
    studentId,
    isLeadUpload,
    setOpenDeleteModal,
    setOpenAssignCounsellorDialog,
    dataSegment,
  } = props;
  const [openAddTagDialog, setOpenAddTagDialog] = useState(false);
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
                {selectedApplications} selected
              </Typography>
            </Box>
            {smsEmailWhatsappPermission && (
              <>
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        className="lead-action-content"
                        onClick={() => handleSentEmail("selected email")}
                      >
                        <img src={MailIcon} alt="mail-icon" /> Email
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
                    className="lead-action-content"
                    onClick={() => handleSentEmail("selected email")}
                  >
                    <img src={MailIcon} alt="mail-icon" /> Email
                  </Box>
                )}
              </>
            )}
            {smsEmailWhatsappPermission && (
              <>
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        className="lead-action-content"
                        onClick={() => handleSendSms("sms")}
                      >
                        <img src={SmsIcon} alt="sms-icon" /> SMS
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
                    className="lead-action-content"
                    onClick={() => handleSendSms("sms")}
                  >
                    <img src={SmsIcon} alt="sms-icon" /> SMS
                  </Box>
                )}
              </>
            )}
            {smsEmailWhatsappPermission && (
              <>
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        className="lead-action-content"
                        onClick={() => {
                          handleClickOpenSelectTemplate("whatsapp");

                          handleSentWhatsapp();
                        }}
                      >
                        <img src={WhatsappIcon} alt="whatsapp-icon" /> WhatsApp
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
                    className="lead-action-content"
                    onClick={() => {
                      handleClickOpenSelectTemplate("whatsapp");

                      handleSentWhatsapp();
                    }}
                  >
                    <img src={WhatsappIcon} alt="whatsapp-icon" /> WhatsApp
                  </Box>
                )}
              </>
            )}

            {smsEmailWhatsappPermission && !dataSegment && (
              <>
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Box
                        className="lead-action-content"
                        onClick={handleSendVerificationEmail}
                      >
                        <img
                          src={SendVerificationIcon}
                          alt="send-verification-icon"
                        />
                        Verification Link
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
                    className="lead-action-content"
                    onClick={handleSendVerificationEmail}
                  >
                    <img
                      src={SendVerificationIcon}
                      alt="send-verification-icon"
                    />
                    Verification Link
                  </Box>
                )}
              </>
            )}
            {rawDataUploadHistory || (
              <>
                {isDownloadLoading ? (
                  <CircularProgress color="info" size={25} />
                ) : (
                  <Box
                    className="lead-action-content"
                    onClick={() =>
                      handleDownload("custom download", selectedApplications)
                    }
                  >
                    <img src={DownloadActionIcon} alt="download-icon" />{" "}
                    Download
                  </Box>
                )}
              </>
            )}
            {/* student id is used just to add tag (nothing else) */}
            {studentId && (
              <Box
                className="lead-action-content"
                onClick={() => setOpenAddTagDialog(true)}
              >
                <img src={AddIcon} alt="add-tag-icon" /> Add Tags
              </Box>
            )}
            {changeLeadStagePermission && (
              <Box
                className="lead-action-content"
                onClick={handleChangeLeadStage}
              >
                <img src={ChangeLeadStageIcon} alt="change-lead-stage-icon" />{" "}
                Change Lead Stage
              </Box>
            )}
            {(assignCounselorPermission || isLeadUpload) && (
              <Box
                className="lead-action-content"
                onClick={() => {
                  if (assignCounselorPermission) {
                    handleAssignCounselor();
                  } else {
                    setOpenAssignCounsellorDialog(true);
                  }
                }}
              >
                <img src={AssignCounsellorIcon} alt="assign-counsellor-icon" />{" "}
                Assign Counselor
              </Box>
            )}
            {showMergeLead && (
              <CustomTooltip
                component={
                  <Box className="lead-action-content">
                    <img src={MergeLeadIcon} alt="merge-lead-icon" /> Merge Lead
                  </Box>
                }
                description="Feature coming soon."
              />
            )}
            {isLeadUpload && (
              <Box
                onClick={() => setOpenDeleteModal(true)}
                className="lead-action-content"
              >
                <DeleteOutlineOutlinedIcon /> Delete
              </Box>
            )}
            {/* Right now publisher section we are not use this code if we need this code in future we use it. */}
            {/* {publisher && (
              <Box
                className="lead-action-content"
                onClick={handleAllApplicationsDownload}
              >
                <img src={DownloadActionIcon} alt="download-icon" /> Download
                Records
              </Box>
            )}
            {publisher && (
              <Box className="lead-action-content">
                <img src={DownloadActionIcon} alt="download-icon" /> Download
                Documents
              </Box>
            )} */}
          </Box>
        </Card>
      </Box>
      <AddTagDialog
        openDialog={openAddTagDialog}
        setOpenDialog={setOpenAddTagDialog}
        studentId={studentId}
      />
    </Box>
  );
};

export default React.memo(LeadActions);
