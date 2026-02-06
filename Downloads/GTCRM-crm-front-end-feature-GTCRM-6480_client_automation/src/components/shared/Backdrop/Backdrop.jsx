import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const BackDrop = ({ openBackdrop, text }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openBackdrop}
    >
      <span style={{ fontWeight: "bold", marginRight: "5px" }}>
        {text ? text : "Downloading"}
      </span>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackDrop;
