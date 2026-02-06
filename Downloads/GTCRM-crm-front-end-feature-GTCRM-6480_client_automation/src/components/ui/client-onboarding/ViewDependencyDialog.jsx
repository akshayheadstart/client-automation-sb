import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import FormFields from "../../shared/ClientRegistration/FormFields";

const ViewDependencyDialog = ({
  open,
  handleCloseDialog,
  heading,
  dependentFields,
  setFields,
  fields,
  selectedOption,
  handleDeleteField,
  handleAddFields,
  handleUpdateField,
}) => {
  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: 2 } }}
      open={open}
      onClose={() => handleCloseDialog()}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box className="configure-dependent-field-header">
          <Typography variant="h6">{heading}</Typography>
          <IconButton onClick={() => handleCloseDialog()}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormFields
          fieldDetails={fields}
          setFieldDetails={setFields}
          dependentFields={dependentFields}
          selectedOption={selectedOption}
          handleDeleteField={handleDeleteField}
          handleAddFields={handleAddFields}
          handleAddCustomField={handleUpdateField}
          showActions={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewDependencyDialog;
