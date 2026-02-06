import { Box, Typography } from "@mui/material";
import React from "react";
import crosImage from "../../../images/cross.svg";
import "../../../styles/sharedStyles.css";
const DateRangeShowcase = ({
  startDateRange,
  endDateRange,
  triggeredFunction,
}) => {
  return (
    <Box className="showcase-date-range">
      <Typography className={"showcase-date-range-text"} variant="caption">
        {startDateRange} - {endDateRange}
      </Typography>
      <Box sx={{ display: "inline-block" }}>
        <img onClick={triggeredFunction} src={crosImage} alt="crosImage" />
      </Box>
    </Box>
  );
};

export default DateRangeShowcase;
