import { Box } from "@mui/material";
import React from "react";
import { Popover, Whisper } from "rsuite";
import "../../../styles/tooltip.css";
const CustomTooltip = ({
  title,
  description,
  component,
  placement,
  color,
  accountType,
  maxWidth,
}) => {
  const speaker = (
    <Popover
      style={{
        maxWidth: maxWidth? maxWidth:"500px",
        zIndex: 2000,
        backgroundColor:
          color && !accountType
            ? "rgba(0, 139, 226, 1)"
            : color && accountType
            ? "#ffcd3a"
            : "white",
        color: color ? "white" : "rgba(9, 44, 76, 1)",
        borderRadius: color ? "8px" : "5px",
      }}
      title={title}
      className={
        color && placement === "left"
          ? "popover-arrow-color-update popover-arrow-color-left"
          : color && placement === "right"
          ? "popover-arrow-color-update popover-arrow-color-right"
          : color && placement === "top" && !accountType
          ? "popover-arrow-color-update-top popover-arrow-color-top"
          : color && placement === "bottom"
          ? "popover-arrow-color-update-bottom"
          : color && placement === "top" && accountType
          ? "popover-arrow-color-update-top-demo"
          : ""
      }
    >
      <Box>{description}</Box>
    </Popover>
  );
  return (
    <Whisper
      placement={placement ? placement : "auto"}
      trigger="hover"
      controlId="control-id-hover"
      speaker={speaker}
    >
      {component}
    </Whisper>
  );
};

export default CustomTooltip;
