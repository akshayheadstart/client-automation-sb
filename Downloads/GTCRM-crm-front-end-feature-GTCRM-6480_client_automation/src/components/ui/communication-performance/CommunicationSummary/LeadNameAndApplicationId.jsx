import { Box, Drawer, Typography } from "@mui/material";
import React from "react";
import ApplicationHeader from "../../../userProfile/ApplicationHeader";

function LeadNameAndApplicationId({ callDetails }) {
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  return (
    <>
      <Box className="call-summary-lead-name">
        <Typography onClick={() => setUserProfileOpen(true)}>
          {callDetails?.applicant_name || "--"}
        </Typography>
        <Typography>{callDetails?.custom_application_id || "--"}</Typography>
      </Box>

      <Drawer
        anchor={"right"}
        open={userProfileOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setUserProfileOpen(false);
        }}
        className="vertical-scrollbar-drawer"
      >
        <Box className="user-profile-control-drawer-box-container">
          <Box>
            <ApplicationHeader
              userDetailsStateData={{
                applicationId: callDetails?.application_id,
                studentId: callDetails?.student_id,
                eventType: "telephony",
              }}
              viewProfileButton={true}
              setUserProfileOpen={setUserProfileOpen}
            ></ApplicationHeader>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default LeadNameAndApplicationId;
