import {
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomAudioPlayer from "./CustomAudioPlayer";
const CallRecordingDialog = ({
  openDialog,
  setOpenDialog,
  phoneNumber,
  callRecordingFile,
}) => {
  return (
    <Dialog
      maxWidth={"md"}
      open={openDialog}
      onClose={() => setOpenDialog(false)}
    >
      <>
        <DialogContent sx={{ minWidth: 350 }}>
          <DialogContentText>
            <Box className="call-recording-container">
              <Typography>
                {phoneNumber ? phoneNumber : ""} Recording
              </Typography>

              <IconButton onClick={() => setOpenDialog(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <CustomAudioPlayer
                callRecordingFile={callRecordingFile}
                openDialog={openDialog}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
      </>
    </Dialog>
  );
};

export default CallRecordingDialog;
