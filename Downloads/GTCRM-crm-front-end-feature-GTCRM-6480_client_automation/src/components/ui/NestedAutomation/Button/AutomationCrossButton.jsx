import { Box } from "@mui/material";
import React from "react";
import crosImage from "../../../../images/crossSVG.svg";
const AutomationCrossButton = ({ triggeredFunction }) => {
  return (
    <Box className="automation-delete-button">
      <Box sx={{ display: "inline-block" }}>
        <img onClick={triggeredFunction} src={crosImage} alt="crosImage" />
      </Box>
    </Box>
  );
};

export default AutomationCrossButton;
