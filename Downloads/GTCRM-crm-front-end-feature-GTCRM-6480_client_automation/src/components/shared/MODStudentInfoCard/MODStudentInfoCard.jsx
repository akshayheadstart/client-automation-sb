/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Button, Card, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddLinkIcon from "@mui/icons-material/AddLink";
import InviteLinkDrawer from "../../InviteLinkDrawer/InviteLinkDrawer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import interviewStudentProfilePhoto from "../../../images/interviewProfilee.svg";
const MODStudentInfoCard = ({
  handleOpenInviteLink,
  setStudentApplicationId,
  placementInviteLink,
  openInviteLink,
  setOpenInviteLink,
  handleInviteLink,
  setReschedule,
  setPanelOrSlot,
  handleClickOpen,
  setUnAssigneeStudentId,
  applicationId,
  info,
  dataSet,
  setUnAssigneeStudentInfo,
  setSelectedApplicant,
  setCalendarFilterPayload,
}) => {
  return (
    <>
      <Box
        sx={{
          p: "16px",
          position: "relative",
        }}
      >
        <Box className="mod-photoProfile-box-container">
          <Box
            sx={{
              position: "absolute",
              mt: 12,
              borderRadius: 10,
            }}
          >
            <img
              src={
                info?.attachments?.recent_photo
                  ? info?.attachments?.recent_photo
                  : interviewStudentProfilePhoto
              }
              alt="Profile Photo"
              style={{
                borderRadius: "20px",
                width: "100px",
                height: "100px",
              }}
              // className="profile-photo-design"
            />
          </Box>
          <CheckCircleIcon className="checkCircleIcon" sx={{ mt: 21, ml: 9 }} />
        </Box>
        <Box sx={{ mt: 6 }} className="mod-box-data-info-container">
          <Box
            sx={{
              display: "grid",
              placeItems: "end",
              pr: 1,
              pt: 1,
            }}
          ></Box>
          <Typography sx={{ mt: 5, pt: 2 }} className="mod-student-name-box">
            <Typography
              className="student-name-text"
              sx={{ fontSize: "22px", fontWeight: 800 }}
            >
              {info?.name}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: "12px", paddingX: "5px" }}>
            Applied For: {dataSet?.course_Name} in{" "}
            {dataSet?.specialization_name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 1.5 }} className="mod-box-button-invite-container">
        <Button
          sx={{ borderRadius: 50, paddingX: 1.5 }}
          color="info"
          variant="contained"
          size="small"
          startIcon={<AddLinkIcon />}
          onClick={() => {
            handleOpenInviteLink("right");
            setStudentApplicationId(applicationId);
          }}
          className="button-text-size"
        >
          Invite
        </Button>
        <InviteLinkDrawer
          placementInviteLink={placementInviteLink}
          openInviteLink={openInviteLink}
          setOpenInviteLink={setOpenInviteLink}
          handleInviteLink={handleInviteLink}
        ></InviteLinkDrawer>
        <Button
          onClick={() => {
            setReschedule(true);
            setPanelOrSlot(false);
            setSelectedApplicant(info);
            setCalendarFilterPayload({
              filter_slot: ["Slot"],
              program_name: [
                {
                  course_name: dataSet?.course_Name,
                  specialization_name: dataSet?.specialization_name,
                },
              ],
              slot_status: ["Available"],
              moderator: [],
              slot_state: "",
            });
          }}
          sx={{ borderRadius: 50 }}
          color="info"
          variant="contained"
          size="small"
          startIcon={<CalendarMonthIcon />}
          className="button-text-size"
        >
          Reschedule
        </Button>

        <Button
          disabled={true}
          onClick={() => {
            handleClickOpen();
            setUnAssigneeStudentId(applicationId);
            setUnAssigneeStudentInfo(info);
          }}
          sx={{
            borderRadius: 50,
            whiteSpace: "nowrap",
          }}
          color="info"
          variant="contained"
          size="small"
          startIcon={<DoNotDisturbAltIcon />}
          className="button-text-size"
        >
          Un-assigne
        </Button>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
          UG Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px", mt: 1 }}>
              Program Name :{" "}
              {info?.ug_info?.program_name
                ? info?.ug_info?.program_name
                : "N/A"}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            College Name :{" "}
            {info?.ug_info?.college_name ? info?.ug_info?.college_name : "N/A"}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>
              Year : {info?.ug_info?.year ? info?.ug_info?.year : "N/A"}
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              Marks : {info?.ug_info?.marks ? info?.ug_info?.marks : "0"}%
            </Typography>
          </Typography>
        </Card>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
          12th Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px", mt: 1 }}>
              Board : {info?.inter_info ? info?.inter_info?.board : "N/A"}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            School Name :{" "}
            {info?.inter_info ? info?.inter_info?.school_name : "N/A"}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>
              Year : {info?.inter_info ? info?.inter_info.year : "N/A"}
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              Marks : {info?.inter_info?.marks ? info?.inter_info?.marks : "0"}%
            </Typography>
          </Typography>
        </Card>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
          10th Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px", mt: 1 }}>
              Board :{" "}
              {info?.tenth_info?.board ? info?.tenth_info?.board : "N/A"}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            School Name :{" "}
            {info?.tenth_info?.school_name
              ? info?.tenth_info?.school_name
              : "N/A"}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>
              Year : {info?.tenth_info?.year ? info?.tenth_info?.year : "N/A"}
            </Typography>
            <Typography sx={{ fontSize: "12px" }}>
              Marks : {info?.tenth_info?.marks ? info?.tenth_info?.marks : "0"}%
            </Typography>
          </Typography>
        </Card>
      </Box>
    </>
  );
};

export default MODStudentInfoCard;
