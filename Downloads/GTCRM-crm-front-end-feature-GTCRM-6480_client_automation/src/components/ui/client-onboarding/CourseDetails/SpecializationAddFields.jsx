import React, { useState } from "react";
import useToasterHook from "../../../../hooks/useToasterHook";
import DeleteDialogue from "../../../shared/Dialogs/DeleteDialogue";
import { Button, Grid } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SharedTextField from "../../../shared/forms/ClientOnboardingForms/SharedTextField";

const SpecializationAddFields = ({
  spec,
  index,
  handleChange,
  handleRemoveSpec,
  handleBlur,
  isFieldTouched,
  isFieldError,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const pushNotification = useToasterHook();

  return (
    <Grid sx={{ mb: 3 }} container spacing={3}>
      <Grid item md={3.33} sm={6} xs={12}>
        <SharedTextField
          field={{
            required: true,
            name: `specialization_names.${index}.spec_name`,
            label: "Specialization Name",
          }}
          value={spec?.spec_name}
          onChange={handleChange}
          handleBlur={handleBlur}
          isFieldError={isFieldError?.spec_name}
          isFieldTouched={isFieldTouched?.spec_name}
        />
      </Grid>

      <Grid item md={3.33} sm={6} xs={12}>
        <SharedTextField
          field={{
            required: true,
            name: `specialization_names.${index}.spec_custom_id`,
            label: "Custom ID of the Specialization",
          }}
          value={spec?.spec_custom_id}
          onChange={handleChange}
          handleBlur={handleBlur}
          isFieldError={isFieldError?.spec_custom_id}
          isFieldTouched={isFieldTouched?.spec_custom_id}
        />
      </Grid>
      <Grid item md={3.33} sm={6} xs={12}>
        <SharedTextField
          field={{
            name: `specialization_names.${index}.spec_fees`,
            label: "Specialization Fees",
          }}
          value={spec?.spec_fees}
          onChange={handleChange}
          handleBlur={handleBlur}
          isFieldError={isFieldError?.spec_fees}
          isFieldTouched={isFieldTouched?.spec_fees}
        />
      </Grid>
      <Grid item md={2} sm={6} xs={12}>
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
      </Grid>
      {openDeleteDialog && (
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={() => {
            pushNotification("success", "Specialization deleted successfully");
            setOpenDeleteDialog(false);
            handleRemoveSpec(index);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </Grid>
  );
};

export default SpecializationAddFields;
