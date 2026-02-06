import React, { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@mui/material";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import useToasterHook from "../../hooks/useToasterHook";
const RemovePocField = ({ handleRemovePoc, index }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const pushNotification = useToasterHook();
  return (
    <>
      <Button
        endIcon={<DeleteOutlineOutlinedIcon />}
        size="large"
        color="error"
        fullWidth
        variant="outlined"
        onClick={() => setOpenDeleteDialog(true)}
      >
        Remove
      </Button>

      {openDeleteDialog && (
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={() => {
            pushNotification("success", "POC is successfully removed");
            setOpenDeleteDialog(false);
            handleRemovePoc(index);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </>
  );
};

export default RemovePocField;
