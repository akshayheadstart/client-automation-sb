import { Box, Typography } from "@mui/material";
import React from "react";
import { BorderLinearProgress } from "../../../counsellor-dashboard/LeadStageDetailsProgressBar";
import { calculatePercentageOfValue } from "../../../../../pages/StudentTotalQueries/helperFunction";

const ProgressDetails = ({ details, onClick }) => {
  return (
    <Box>
      <Box>
        <Typography
          sx={{ cursor: onClick ? "pointer" : "default" }}
          onClick={() => onClick(details)}
        >
          {details?.name}
        </Typography>
        <Typography>
          {details?.pending_followup}/{details?.total_followup}
        </Typography>
      </Box>
      <BorderLinearProgress
        variant="determinate"
        value={calculatePercentageOfValue(details.pending_followup, [
          details.total_followup || 0,
        ])}
      />
    </Box>
  );
};

export default ProgressDetails;
