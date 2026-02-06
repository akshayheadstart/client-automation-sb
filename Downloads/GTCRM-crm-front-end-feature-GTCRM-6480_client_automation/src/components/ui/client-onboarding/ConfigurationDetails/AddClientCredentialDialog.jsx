import { Close } from "@mui/icons-material";
import { Dialog, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ConfigurationDetailsForm from "./ConfigurationDetailsForm";

const AddClientCredentialDialog = ({ open, setOpen, selectedClient }) => {
  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "20px" } }}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="lg"
      fullWidth
    >
      <Box sx={{ p: 3 }}>
        <Box className="edit-course-header">
          <Typography variant="h6">Add Client Credentials</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ my: 2 }}>
          <ConfigurationDetailsForm
            selectedClient={selectedClient}
            setOpen={setOpen}
          />
        </Box>
      </Box>
    </Dialog>
  );
};

export default AddClientCredentialDialog;
