import React from "react";
import {
  Box,
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";

import Error500Animation from "../ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";

import "../../../styles/ConfirmationDialog.css";

const ConfirmationDialog = ({
  title,
  message,
  open,
  handleClose = () => {},
  handleOk = () => {},
  loading,
  className = "",
  internalServerError,
  somethingWentWrong,
  apiResponseChangeMessage,
}) => {
  return (
    <Dialog
      classes={{ paper: `confirmation-dialog ${className}` }}
      open={open}
      onClose={handleClose}
    >
      {internalServerError || somethingWentWrong ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400} />
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          <DialogTitle className="confirmation-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent className="confirmation-dialog-content">
            <DialogContentText id="alert-dialog-description">
              {message}
            </DialogContentText>
          </DialogContent>
          <DialogActions className="confirmation-dialog-actions">
            {loading ? (
              <CircularProgress size={22} color="info" />
            ) : (
              <Button className="confirmation-ok-btn" onClick={handleOk}>
                Yes
              </Button>
            )}
            <Button
              className="confirmation-cancel-btn"
              data-testid="cancelBtn"
              onClick={handleClose}
            >
              No
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ConfirmationDialog;
