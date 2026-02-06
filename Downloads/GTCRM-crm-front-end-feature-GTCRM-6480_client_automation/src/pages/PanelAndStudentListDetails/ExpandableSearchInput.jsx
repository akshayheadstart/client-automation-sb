import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Box } from "@mui/material";
const ExpandableSearchInput = ({ className, handleClick }) => {
  return (
    <Box onClick={handleClick} className={className}>
      <SearchOutlinedIcon />
    </Box>
  );
};

export default ExpandableSearchInput;
