/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext } from "react";
// import { userProfilePhoto } from '../../../images/interviewAmajonS3Url';
import { Box, IconButton, Typography } from "@mui/material";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import SearchIcon from "@rsuite/icons/Search";
// import { Input, InputGroup } from 'rsuite';
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import { todayDateData } from "../../Calendar/utils";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
const InterViewNavbar = ({
  reschedule,
  role,
  headline,
  setCurrentDate,
  formatDateToFilter,
  formattedDate,
  setReschedule,
  setCalendarFilterPayload,
}) => {
  const today = new Date();
  const dateSplit = formattedDate?.split(" ");

  // const styles = {
  //     marginBottom: 10,
  //     color: "#008BE2",
  //   };
  // const CustomInputGroupWidthButton = ({ placeholder, ...props }) => (
  //     <InputGroup {...props} inside style={styles}>
  //       <Input placeholder={placeholder} />
  //       <InputGroup.Button>
  //         <SearchIcon />
  //       </InputGroup.Button>
  //     </InputGroup>
  //   );
  const {
    headTitle
  } = useContext(LayoutSettingContext);
  return (
    <Box className="MOD-box-container">
      <Box className="headline-box-container-interview-navbar">
        {reschedule && (
          <IconButton
            onClick={() => {
              setReschedule(false);
              setCalendarFilterPayload({
                filter_slot: [],
                program_name: [],
                slot_status: [],
                moderator: [],
                slot_state: "",
              });
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        )}
        {/* <Typography className="slot-planner-text">{headline}</Typography> */}
        {(headTitle === "Planner" ||
          headTitle === "Slot Planner" ||
          headTitle === "Reschedule") && (
          <Typography
            sx={{
              color: "#039BDC",
              fontSize: "15px",
              fontWeight: 800,
              cursor: "pointer",
              pt: "2px",
            }}
            onClick={() => {
              setCurrentDate(today);
              formatDateToFilter(todayDateData);
            }}
          >
            {dateSplit[1]?.slice(0, 2)} {dateSplit[0]} {dateSplit[2]}
          </Typography>
        )}
      </Box>
      {/* <Box className="mod-profile-section">
              <Box sx={{ mt: 1.8 }}>
                <CustomInputGroupWidthButton size="md" placeholder="Search" />
              </Box>
              <Box sx={{ display: "flex" }}>
                <NotificationsOutlinedIcon sx={{ color: "#008BE2" }} />
                <Typography sx={{ ml: -1.8 }} className="mod-text-notification">
                  2
                </Typography>
              </Box>
              <Box className="mod-photo-box-container">
                <img
                  src={userProfilePhoto}
                  alt="Image description"
                  width="45px"
                  height="45px"
                />
                <Typography>
                  <Typography sx={{ fontSize: "18px", whiteSpace: "nowrap" }}>
                    Hey Aditya
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "12px" }}>
                    {role}
                  </Typography>
                </Typography>
              </Box>
            </Box> */}
    </Box>
  );
};

export default InterViewNavbar;
