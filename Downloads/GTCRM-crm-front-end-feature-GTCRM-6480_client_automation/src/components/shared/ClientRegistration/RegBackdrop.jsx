import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const RegBackdrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="info" />
    </Backdrop>
  );
};

export default RegBackdrop;
