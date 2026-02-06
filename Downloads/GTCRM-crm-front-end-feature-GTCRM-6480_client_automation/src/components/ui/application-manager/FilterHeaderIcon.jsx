import { Box } from "@mui/material";
import React from "react";
import "../../../styles/ApplicationManagerTable.css";
const FilterHeaderIcon = ({ icon, condition, action, sx }) => {
  return (
    <Box
      onClick={action}
      className={`filter-header-icon ${
        condition ? "filter-header-icon-active" : ""
      }`}
      sx={sx}
    >
      <img src={icon} alt="all-column-icon" />
    </Box>
  );
};

export default FilterHeaderIcon;
