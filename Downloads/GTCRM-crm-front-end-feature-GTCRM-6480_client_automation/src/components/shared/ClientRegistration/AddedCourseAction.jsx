import { IconButton, Tooltip } from "@mui/material";
import React from "react";

const AddedCourseAction = ({
  Icon,
  helpText,
  handleAction,
  color,
  disabled,
  style,
}) => {
  return (
    <>
      <IconButton size="small" onClick={handleAction} disabled={disabled}>
        <Tooltip arrow placement="top" title={helpText}>
          <Icon color={color} sx={{ color: color }} style={style} />
        </Tooltip>
      </IconButton>
    </>
  );
};

export default AddedCourseAction;
