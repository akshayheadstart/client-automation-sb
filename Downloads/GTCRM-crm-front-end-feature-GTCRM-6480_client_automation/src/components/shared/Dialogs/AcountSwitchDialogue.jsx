import React from "react";
import {
  Dialog,
  Box,
  CircularProgress,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const AcountSwitchDialogue = ({
  openAccoundSwitch,
  handleCloseAccountSwitchDialog,
  isLoading,
  loadingCollege,
  addedUserEmail,
  removeAccount,
  handleActiveAnotherUser,
}) => {
  return (
    <Dialog
      sx={{ maxWidth: "500px", mx: "auto" }}
      open={openAccoundSwitch}
      onClose={handleCloseAccountSwitchDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress color="info" />
        </Box>
      )}
      {loadingCollege && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
          <CircularProgress color="info" />
        </Box>
      )}
      <DialogContent>
        {handleActiveAnotherUser &&
          "Click on the Switch button to switch your account into "}
        <span className="switch-account-email">{addedUserEmail}</span>. Or, you
        can remove this account by clicking on Remove Account
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleCloseAccountSwitchDialog}>
          Cancel
        </Button>
        <Button variant="text" onClick={removeAccount}>
          Remove Account
        </Button>
        {handleActiveAnotherUser && (
          <Button variant="text" onClick={handleActiveAnotherUser}>
            Switch
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AcountSwitchDialogue;
