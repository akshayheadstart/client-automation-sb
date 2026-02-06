import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import React, { useState } from "react";
import DeleteDialogue from "../Dialogs/DeleteDialogue";
import useToasterHook from "../../../hooks/useToasterHook";
import AddValidationDialog from "./AddValidationDialog";

function ValidationActions({
  validations,
  index,
  setValidations,
  currentValidation,
  currentField,
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditValidationDialog, setOpenEditValidationDialog] =
    useState(false);

  const pushNotification = useToasterHook();

  const handleDeleteValidation = () => {
    const updatedValidations = structuredClone(validations);
    updatedValidations.splice(index, 1);
    setValidations(updatedValidations);

    pushNotification("success", "Validation field is deleted!");
    setOpenDeleteDialog(false);
  };
  return (
    <Box>
      <IconButton onClick={() => setOpenEditValidationDialog(true)}>
        <Edit color="info" />
      </IconButton>
      <IconButton onClick={() => setOpenDeleteDialog(true)}>
        <Delete color="error" />
      </IconButton>
      {openDeleteDialog && (
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={handleDeleteValidation}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
      {openEditValidationDialog && (
        <AddValidationDialog
          open={openEditValidationDialog}
          setOpen={setOpenEditValidationDialog}
          setValidations={setValidations}
          currentField={currentField}
          validations={validations}
          editIndex={index}
          editValidation={currentValidation}
        />
      )}
    </Box>
  );
}

export default ValidationActions;
