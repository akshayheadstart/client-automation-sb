import { Add, Close, VisibilityOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import AddFieldDialog from "./AddFieldDialog";
import ViewDependencyDialog from "./ViewDependencyDialog";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import {
  addDynamicNestedDependentField,
  deleteDynamicNestedDependentField,
  getDependentFieldsByTargetKeyPath,
} from "../../../pages/StudentTotalQueries/helperFunction";
import useToasterHook from "../../../hooks/useToasterHook";

const AddDependentFieldDialog = ({
  open,
  setOpen,
  currentField,
  fields,
  setFields,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [openViewDependencyDialog, setOpenDependencyDialog] = useState(false);
  const [selectedDependentFields, setSelectedDependentFields] = useState([]);

  const pushNotification = useToasterHook();

  const { targetKeyPath, setTargetKeyPath } = useContext(DashboradDataContext);

  const handleAddFields = (selectedFields) => {
    const updatedFields = addDynamicNestedDependentField({
      fields,
      targetKeyPath,
      selectedOption,
      selectedFields,
      pushNotification,
    });

    setFields(updatedFields);
  };

  const handleCloseDialog = (setOpen) => {
    setTargetKeyPath((prev) => prev.slice(0, prev.length - 1));
    setOpen(false);
  };

  useEffect(() => {
    const foundFields = getDependentFieldsByTargetKeyPath(
      fields,
      targetKeyPath,
      selectedOption
    );

    setSelectedDependentFields(foundFields);
  }, [fields, targetKeyPath, selectedOption]);

  const handleAddFieldDetails = (_, selectedRows) => {
    handleAddFields(selectedRows);
  };
  const handleDeleteField = (deleteIndex) => {
    const updatedFields = deleteDynamicNestedDependentField({
      fields,
      targetKeyPath,
      selectedOption,
      startingIndex: deleteIndex,
    });
    setFields(updatedFields);
  };
  const handleUpdateField = (updatedField, editingIndex) => {
    const updatedFields = deleteDynamicNestedDependentField({
      fields,
      targetKeyPath,
      selectedOption,
      updatedField,
      startingIndex: editingIndex,
    });
    setFields(updatedFields);
  };
  return (
    <>
      <Dialog
        PaperProps={{ sx: { borderRadius: 2 } }}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>
          <Box className="configure-dependent-field-header">
            <Typography variant="h6">Configure Dependent Fields</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 1 }}>
            <Autocomplete
              value={selectedOption}
              onChange={(_, value) => setSelectedOption(value)}
              fullWidth
              options={currentField?.options}
              renderInput={(params) => (
                <TextField
                  color="info"
                  {...params}
                  label="Dependent Field For"
                />
              )}
            />
            <Box className="add-dependent-field-actions">
              <Button
                endIcon={<VisibilityOutlined />}
                variant="contained"
                color="info"
                size="small"
                onClick={() => {
                  setOpenDependencyDialog(true);
                  setTargetKeyPath((prev) => [...prev, currentField?.key_name]);
                }}
                disabled={!selectedOption}
              >
                View
              </Button>
              <Button
                onClick={(e) => {
                  setOpenAddFieldDialog(true);
                  setTargetKeyPath((prev) => [...prev, currentField?.key_name]);
                }}
                endIcon={<Add />}
                variant="contained"
                color="info"
                size="small"
                disabled={!selectedOption}
              >
                Add
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {openAddFieldDialog && (
        <AddFieldDialog
          title="Add a Dependent Field"
          openAddFieldDialog={openAddFieldDialog}
          handleCloseDialog={() => handleCloseDialog(setOpenAddFieldDialog)}
          handleAddFields={handleAddFieldDetails}
          prevSelectedRows={selectedDependentFields}
        />
      )}
      {openViewDependencyDialog && (
        <ViewDependencyDialog
          setFields={setFields}
          heading="View Dependent Fields"
          open={openViewDependencyDialog}
          handleCloseDialog={() => handleCloseDialog(setOpenDependencyDialog)}
          dependentFields={selectedDependentFields}
          fields={fields}
          selectedOption={selectedOption}
          handleDeleteField={handleDeleteField}
          handleAddFields={handleAddFieldDetails}
          handleUpdateField={handleUpdateField}
        />
      )}
    </>
  );
};

export default AddDependentFieldDialog;
