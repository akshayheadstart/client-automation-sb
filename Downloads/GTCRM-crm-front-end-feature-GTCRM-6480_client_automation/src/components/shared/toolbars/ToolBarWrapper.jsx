import { Box } from "@mui/material";
import React from "react";

export default function ToolbarWrapper(props) {
  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        boxShadow: 1,
        textAlign: "center",
        display: "flex",
        paddingLeft: "20px",
        paddingRight: "5px",
        paddingTop: "5px",
        paddingBottom: "5px",
      }}
    >
      {props.children}
    </Box>
  );
}
