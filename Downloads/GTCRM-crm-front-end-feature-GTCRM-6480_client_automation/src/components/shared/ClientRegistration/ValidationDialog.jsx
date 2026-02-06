import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ValidationDetailsTable from "./ValidationDetailsTable";
import AddValidationDialog from "./AddValidationDialog";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { returnFieldsWithValidations } from "../../../utils/FormErrorValidationSchema";

function ValidationDialog({
  open,
  setOpen,
  currentField,
  fields,
  setFields,
  setCustomFieldValidation,
}) {
  const [openAddValidationDialog, setOpenAddValidationDialog] = useState(false);
  const [validations, setValidations] = useState([]);

  const { targetKeyPath, setTargetKeyPath } = useContext(DashboradDataContext);
  const pushNotification = useToasterHook();

  useEffect(() => {
    setValidations(currentField?.validations || []);
  }, [currentField]);

  const removeTheLastTargetPath = () => {
    const targetPath = structuredClone(targetKeyPath);
    targetPath.splice(targetPath.length - 1, 1);
    setTargetKeyPath(targetPath);
    setOpen(false);
  };
  const handleSaveValidations = () => {
    if (validations?.length) {
      if (setCustomFieldValidation) {
        setCustomFieldValidation(validations);
      } else {
        const updatedFields = returnFieldsWithValidations({
          validations,
          targetKeyPath,
          fields,
        });
        setFields(updatedFields);
      }
      removeTheLastTargetPath();
      pushNotification("success", `Validation is saved successfully!`);
    } else {
      pushNotification("warning", "No validation is found to add!.");
    }
  };
  return (
    <Dialog
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
      open={open}
      onClose={removeTheLastTargetPath}
      maxWidth="lg"
    >
      <DialogTitle>
        <Box className="configure-dependent-field-header">
          <Typography variant="h6">Field Validations</Typography>
          <IconButton onClick={removeTheLastTargetPath}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className="field-validation-header">
          <Typography variant="body1">
            <b>{validations.length}</b> Validations Added
          </Typography>
          <Button
            onClick={setOpenAddValidationDialog}
            className="common-contained-button"
          >
            Add Validation
          </Button>
        </Box>
        <ValidationDetailsTable
          validations={validations}
          setValidations={setValidations}
          currentField={currentField}
        />
      </DialogContent>
      <DialogActions>
        <Box sx={{ px: 1.5, py: 2 }}>
          <Button
            onClick={removeTheLastTargetPath}
            sx={{ mr: 1.2 }}
            className="common-outlined-button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveValidations}
            className="common-contained-button"
          >
            Save
          </Button>
        </Box>
      </DialogActions>
      {openAddValidationDialog && (
        <AddValidationDialog
          open={openAddValidationDialog}
          setOpen={setOpenAddValidationDialog}
          setValidations={setValidations}
          currentField={currentField}
          validations={validations}
        />
      )}
    </Dialog>
  );
}

export default ValidationDialog;
