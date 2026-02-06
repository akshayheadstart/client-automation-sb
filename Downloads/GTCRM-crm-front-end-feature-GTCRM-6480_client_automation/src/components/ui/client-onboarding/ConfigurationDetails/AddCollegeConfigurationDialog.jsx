import { Close } from "@mui/icons-material";
import { Box, Dialog, IconButton, Typography } from "@mui/material";
import React from "react";
import CollegeConfigurationDetailsForm from "./CollegeConfigurationDetailsForm";

const AddCollegeConfigurationDialog = ({open, setOpen, selectedCollegeId}) => {
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
          <Typography variant="h6">Add College Configuration</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ my: 2 }}>
          <CollegeConfigurationDetailsForm
            selectedCollegeId={selectedCollegeId}
            setOpen={setOpen}
          />
        </Box>
      </Box>
    </Dialog>
    );
};

export default AddCollegeConfigurationDialog;