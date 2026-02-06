import { Box, Card, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import "../../../../styles/ApplicationManagerTable.css";

import UnselectIcon from "../../../../icons/UnselectIcon";
import ChangeLeadStageIcon from "../../../../icons/change-lead-stage-icon.svg";
import WhatsappIcon from "../../../../icons/whatsapp-icon.svg";
import SmsIcon from "../../../../icons/sms-icon.svg";
import { useSelector } from "react-redux";
import AssignMissedCallToCounsellorDialog from "./AssignMissedCallToCounsellorDialog";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useAssignCounselorToMissedCallMutation } from "../../../../Redux/Slices/telephonySlice";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";

const MissedCallQuickActions = ({
  isScrolledToPagination,
  selectedStudentMobile,
  setSelectedStudentMobile,
  handleClickOpenSelectTemplate,
  handleSentWhatsapp,
  handleSendSms,
}) => {
  const userTypePermission =
    useSelector((state) => state.authentication.token)?.scopes?.[0] !==
    "college_counselor";
  const [openAssignMissedCallDialog, setOpenAssignMissedCallDialog] =
    useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [loadingAssignCounselor, setLoadingAssignCounselor] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const pushNotification = useToasterHook();
  const [assignCounselorToMissedCall] =
    useAssignCounselorToMissedCallMutation();
  const handleAssignCounselor = (counselorId) => {
    const payload = {
      counsellor_id: counselorId,
      student_phone: selectedStudentMobile,
    };
    setLoadingAssignCounselor(true);
    assignCounselorToMissedCall({ collegeId, payload })
      .unwrap()
      .then((response) => {
        try {
          if (typeof response?.message === "string") {
            pushNotification("success", response?.message);
            setOpenAssignMissedCallDialog(false);
            setSelectedStudentMobile([]);
          } else {
            throw new Error(
              "Assign call to counselor API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setLoadingAssignCounselor(false);
      });
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
                {selectedStudentMobile.length} selected
              </Typography>
            </Box>
            <Box
              className="lead-action-content"
              onClick={() => handleSendSms("sms")}
            >
              <img src={SmsIcon} alt="sms-icon" /> SMS
            </Box>
            <Box
              className="lead-action-content"
              onClick={() => {
                handleClickOpenSelectTemplate("whatsapp");

                handleSentWhatsapp();
              }}
            >
              <img src={WhatsappIcon} alt="whatsapp-icon" /> WhatsApp
            </Box>
            {userTypePermission && (
              <Box
                className="lead-action-content"
                onClick={() => setOpenAssignMissedCallDialog(true)}
              >
                <img src={ChangeLeadStageIcon} alt="change-lead-stage-icon" />{" "}
                Change Counsellor
              </Box>
            )}
            <Box
              className="lead-action-content"
              onClick={() => setSelectedStudentMobile([])}
            >
              <UnselectIcon />
              Unselect
            </Box>
          </Box>
        </Card>
      </Box>
      <AssignMissedCallToCounsellorDialog
        open={openAssignMissedCallDialog}
        setOpen={setOpenAssignMissedCallDialog}
        loading={loadingAssignCounselor}
        isInternalServerError={isInternalServerError}
        isSomethingWentWrong={isSomethingWentWrong}
        handleAssignCounselor={handleAssignCounselor}
      />
    </Box>
  );
};

export default MissedCallQuickActions;
