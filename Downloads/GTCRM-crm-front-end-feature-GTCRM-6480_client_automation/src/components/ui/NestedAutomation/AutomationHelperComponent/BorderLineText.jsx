import { Box } from "@mui/material";
import React from "react";

const BorderLineText = ({ text, width }) => {
  return (
    <Box
      style={{
        position: "relative",
        background: "white",
        top: "-44px",
        left: "11px",
        fontSize: "10px",
        width: `${width}px`,
        zIndex: 100,
        textAlign: "center",
      }}
    >
      {text.trim()}
    </Box>
  );
};

export default BorderLineText;
