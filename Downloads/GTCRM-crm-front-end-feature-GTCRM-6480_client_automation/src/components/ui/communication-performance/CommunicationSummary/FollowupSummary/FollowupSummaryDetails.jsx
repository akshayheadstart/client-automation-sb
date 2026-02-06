import { Box } from "@mui/system";
import React from "react";
import FollowupTaskDetailsHeader from "../../../counsellor-dashboard/FollowupTaskDetailsHeader";
import FollowupTaskDetails from "../../../counsellor-dashboard/FollowupTaskDetails";
import CalenderAndProgressBar from "./CalenderAndProgressBar";

const FollowupSummaryDetails = ({ featurePermission }) => {
  return (
    <Box>
      {featurePermission?.["4a6a4dbb"]?.visibility && (
        <FollowupTaskDetailsHeader sx={{ mt: 3, mb: 3 }} />
      )}
      {featurePermission?.["575710fb"]?.visibility && (
        <CalenderAndProgressBar getCounselorListKey="bd87f00a" />
      )}
      {featurePermission?.["dda0dd77"]?.visibility && (
        <FollowupTaskDetails
          showCounsellorFilter={true}
          getFollowupKey="dda0dd77"
          getCounselorListKey="c378aa93"
        />
      )}
    </Box>
  );
};

export default FollowupSummaryDetails;
