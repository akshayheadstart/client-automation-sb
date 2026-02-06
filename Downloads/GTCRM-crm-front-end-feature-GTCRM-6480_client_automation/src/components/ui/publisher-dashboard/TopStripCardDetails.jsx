import { Box, Typography } from "@mui/material";
import React from "react";
import IndicatorComponent from "../admin-dashboard/IndicatorComponent";

const TopStripCardDetails = ({ details, selectedSummery, id }) => {
  return (
    <Box>
      <Typography
        id={`summary-lead-${id}`}
        sx={{
          pointerEvents: `${
            selectedSummery === details.subHeading ? "none" : "auto"
          }`,
          opacity: `${selectedSummery === details.subHeading ? "0.4" : "1"} `,
          mb: "2px",
        }}
        className="publisher-card-lead-count"
        onClick={() =>
          details.handleApplyFilter(details.sourceType, details.subHeading)
        }
      >
        {details.value}
        <IndicatorComponent
          indicator="Last 30 Days"
          indicatorSize="15"
          fontSize="12"
          title={details.subHeading}
          performance={details.performance}
          percentage={details.percentage}
          tooltipPosition="right"
        ></IndicatorComponent>
      </Typography>
    </Box>
  );
};

export default TopStripCardDetails;
