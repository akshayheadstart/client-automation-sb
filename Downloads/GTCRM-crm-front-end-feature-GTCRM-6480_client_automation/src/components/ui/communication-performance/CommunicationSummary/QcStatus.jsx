import { Typography } from "@mui/material";
import React from "react";

const QcStatus = ({ status }) => {
  return (
    <>
      {status ? (
        <Typography className={`${status} common-status`}>{status}</Typography>
      ) : (
        "--"
      )}
    </>
  );
};

export default QcStatus;
