import React from "react";
import { useToaster } from "rsuite";
import "../styles/toasterMessage.css";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
const useToasterHook = () => {
  const toaster = useToaster();
  const pushNotification = (type, message) => {
    toaster.push(
      <Box className="wrapper">
        {type?.toLowerCase() === "success" && (
          <Box className="toast success">
            <Box className="container-1">
              <i className="fas fa-check-circle"></i>
            </Box>
            <Box className="container-2">
              <Typography>Success</Typography>
              <Typography>{message?.slice(0, 200)}</Typography>
            </Box>
            <IconButton
              onClick={() => {
                toaster.clear();
              }}
            >
              {" "}
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        )}
        {type?.toLowerCase() === "error" && (
          <Box className="toast error">
            <Box className="container-1">
              <i className="fas fa-times-circle"></i>
            </Box>
            <Box className="container-2">
              <Typography>Error</Typography>
              <Typography>{message?.slice(0, 200)}</Typography>
            </Box>
            <IconButton onClick={() => toaster.clear()}>
              {" "}
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        )}
        {type?.toLowerCase() === "info" && (
          <Box className="toast info">
            <Box className="container-1">
              <i className="fas fa-info-circle"></i>
            </Box>
            <Box className="container-2">
              <Typography>Info</Typography>
              <Typography>{message?.slice(0, 200)}</Typography>
            </Box>
            <IconButton onClick={() => toaster.clear()}>
              {" "}
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        )}
        {type?.toLowerCase() === "warning" && (
          <Box className="toast warning">
            <Box className="container-1">
              <i className="fas fa-exclamation-circle"></i>
            </Box>
            <Box className="container-2">
              <Typography>Warning</Typography>
              <Typography>{message?.slice(0, 200)}</Typography>
            </Box>
            <IconButton onClick={() => toaster.clear()}>
              {" "}
              <CloseIcon></CloseIcon>
            </IconButton>
          </Box>
        )}
      </Box>,
      { placement: "topCenter" }
    );
    setTimeout(() => {
      toaster.clear();
    }, 3000);
  };
  return pushNotification;
};

export default useToasterHook;
