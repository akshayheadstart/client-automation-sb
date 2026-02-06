import React from "react";
import {
  Dialog,
  Box,
  DialogTitle,
  IconButton,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import "../../../styles/ManageCourseDialog.css";

const ManageCourseDialog = ({
  onClose = () => {},
  title = "",
  open = false,
  children,
  className = ''
}) => {
  return (
    <Dialog classes={{ paper: `course-dialog ${className}` }} onClose={onClose} open={open}>
      <Box className="center-align-items justify-space-between course-dialog-header">
        <DialogTitle className="course-dialog-title">{title}</DialogTitle>
        <IconButton data-testid="closeBtn" className="course-dialog-close-btn" onClick={onClose}>
          <CloseIcon className="course-dialog-close-icon" />
        </IconButton>
      </Box>

      <DialogContent className="course-dialog-content">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default ManageCourseDialog;
