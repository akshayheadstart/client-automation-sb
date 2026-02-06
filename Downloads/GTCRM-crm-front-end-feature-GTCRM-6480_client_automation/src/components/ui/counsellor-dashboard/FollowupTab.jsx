import { Box } from "@mui/material";
import React from "react";

const FollowupTab = ({
  item,
  index,
  selected,
  setSelected,
  handleTabChange,
}) => {
  return (
    <Box
      onClick={() => {
        handleTabChange(index);
        setSelected(index);
      }}
      className={`followup-task-tab ${
        selected === index ? "followup-task-selected-tab" : ""
      }`}
    >
      {item}
    </Box>
  );
};

export default FollowupTab;
