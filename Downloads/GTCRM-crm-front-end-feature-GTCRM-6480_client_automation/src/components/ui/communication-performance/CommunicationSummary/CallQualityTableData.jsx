import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import IndicatorComponent from "../../admin-dashboard/IndicatorComponent";

function CallQualityTableData({ details }) {
  return (
    <Box className="call-quality-table-data">
      <Typography>{details?.value}</Typography>
      <IndicatorComponent
        indicator={details.indicator}
        indicatorSize="15"
        fontSize="12"
        title={details.tooltipText}
        performance={details.performance}
        percentage={details.percentage}
        tooltipPosition="right"
      ></IndicatorComponent>
    </Box>
  );
}

export default CallQualityTableData;
