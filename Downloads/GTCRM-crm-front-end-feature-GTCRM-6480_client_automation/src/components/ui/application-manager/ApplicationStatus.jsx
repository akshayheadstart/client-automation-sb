import { Box } from "@mui/material";
import React from "react";

function ApplicationStatus({ dataRow }) {
  const { application_status } = dataRow || {};
  return (
    <Box
      className={`${
        typeof application_status === "string"
          ? application_status?.toLowerCase() === "in progress"
            ? "in-progress"
            : application_status?.toLowerCase()
          : ""
      } status`}
    >
      <Box>{application_status || `– –`}</Box>
    </Box>
  );
}

export default ApplicationStatus;
