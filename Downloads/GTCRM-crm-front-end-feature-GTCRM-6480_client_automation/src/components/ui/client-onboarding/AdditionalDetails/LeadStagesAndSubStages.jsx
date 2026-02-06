import { Button, Grid, TextField } from "@mui/material";
import React, { useMemo, useState } from "react";
import SharedAutocomplete from "../../../shared/forms/ClientOnboardingForms/SharedAutocomplete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteDialogue from "../../../shared/Dialogs/DeleteDialogue";
import useToasterHook from "../../../../hooks/useToasterHook";

function LeadStagesAndSubStages({
  leadSubStageValue,
  leadStageValue,
  index,
  setFieldValue,
  handleChange,
  handleRemoveLeadStage,
  handleBlur,
  isFieldError,
  isFieldTouched,
}) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const pushNotification = useToasterHook();
  const subStageField = useMemo(() => {
    return {
      label: "Lead Sub stages",
      name: `lead_stages.${index}.sub_lead_stage`,
      options: [],
      multiple: true,
      freeSolo: true,
      limitTags: 4,
      info: (
        <div>
          After entering a sub-stage, press the{" "}
          <code className="info-code">Enter</code> key.{" "}
        </div>
      ),
    };
  }, [index]);
  return (
    <Grid sx={{ mb: 3 }} container spacing={3}>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Lead Stage Name"
          name={`lead_stages.${index}.stage_name`}
          value={leadStageValue}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched && Boolean(isFieldError)}
          helperText={isFieldTouched && isFieldError}
        />
      </Grid>

      <Grid item md={7} sm={6} xs={12}>
        <SharedAutocomplete
          field={subStageField}
          value={leadSubStageValue}
          setFieldValue={setFieldValue}
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
            pushNotification("success", "Lead Stage is successfully deleted");
            setOpenDeleteDialog(false);
            handleRemoveLeadStage(index);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </Grid>
  );
}

export default React.memo(LeadStagesAndSubStages);
