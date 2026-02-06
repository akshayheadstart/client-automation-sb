import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "../../../styles/AdminDashboard.css";
const IndicatorComponent = ({
  iconMargin,
  indicator,
  percentage = 0,
  title,
  performance = "equal",
  tooltipPosition = "top",
  indicatorSize,
  fontSize,
}) => {
  // Define styles based on performance
  const textStyles = {
    up: { color: "#00AC4F" },
    equal: { color: "#c96565" },
    down: { color: "red" },
  };

  const iconStyles = {
    up: { color: "#00AC4F" },
    equal: { color: "#BCBEC0" },
    down: { color: "red" },
  };

  // Helper function to render the correct icon
  const renderIcon = () => {
    if (performance === "up") {
      return <ArrowUpwardIcon sx={{ width: `${indicatorSize}px` }} />;
    } else if (performance === "equal") {
      return <ArrowForwardIcon sx={{ width: `${indicatorSize}px` }} />;
    } else {
      return <ArrowDownwardIcon sx={{ width: `${indicatorSize}px` }} />;
    }
  };

  return (
    <Tooltip
      arrow
      title={`${title} performance is ${performance} compared to ${indicator ? indicator.split("_").join(" ") : "Last 7 days"
        }.`}
      placement={tooltipPosition}
    >
      <Box className="indicator-shared-percentage">
        <Typography
          sx={{
            ...textStyles[performance],
            fontSize: `${fontSize}px !important`,
          }}
          variant="caption"
        >
          {percentage}%
        </Typography>
        <IconButton
          sx={{
            ...iconStyles[performance],
            p: "0",
            marginBottom: `${iconMargin}px`,
          }}
        >
          {renderIcon()}
        </IconButton>
      </Box>
    </Tooltip>
  );
};

export default IndicatorComponent;
