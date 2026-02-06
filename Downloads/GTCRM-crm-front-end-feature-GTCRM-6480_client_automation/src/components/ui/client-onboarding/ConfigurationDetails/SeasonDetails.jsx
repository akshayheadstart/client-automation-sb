import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import SharedDatePicker from "../../../shared/forms/ClientOnboardingForms/SharedDatePicker";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteDialogue from "../../../shared/Dialogs/DeleteDialogue";
import useToasterHook from "../../../../hooks/useToasterHook";
const SeasonDetails = ({
  index,
  setFieldValue,
  handleChange,
  handleRemoveSeason,
  handleBlur,
  isFieldError,
  isFieldTouched,
  seasonNameValue,
  seasonStartDate,
  seasonEndDate,
  databaseUserName,
  databasePassWord,
  databaseUrl,
  databaseDbName,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const pushNotification = useToasterHook();
  return (
    <Grid sx={{ mb: 3 }} container spacing={3}>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Season Name"
          name={`seasons.${index}.season_name`}
          value={seasonNameValue}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.season_name && Boolean(isFieldError?.season_name)}
          helperText={isFieldTouched?.season_name && isFieldError?.season_name}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedDatePicker
          field={{ name: `seasons.${index}.start_date`, label: "Start Date",required:true }}
          value={seasonStartDate}
          setFieldValue={setFieldValue}
          onChange={handleChange}
          handleBlur={handleBlur}
          isFieldError={isFieldError?.start_date}
          isFieldTouched={isFieldTouched?.start_date}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedDatePicker
          field={{ name: `seasons.${index}.end_date`, label: "End Date",required:true }}
          value={seasonEndDate}
          setFieldValue={setFieldValue}
          onChange={handleChange}
          handleBlur={handleBlur}
          isFieldError={isFieldError?.end_date}
          isFieldTouched={isFieldTouched?.end_date}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Database Username"
          name={`seasons.${index}.database.username`}
          value={databaseUserName}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.database?.username && Boolean(isFieldError?.database?.username)}
          helperText={isFieldTouched?.database?.username && isFieldError?.database?.username}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Database Password"
          name={`seasons.${index}.database.password`}
          value={databasePassWord}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.database?.password && Boolean(isFieldError?.database?.password)}
          helperText={isFieldTouched?.database?.password && isFieldError?.database?.password}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Database Url"
          name={`seasons.${index}.database.url`}
          value={databaseUrl}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.database?.url && Boolean(isFieldError?.database?.url)}
          helperText={isFieldTouched?.database?.url && isFieldError?.database?.url}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Database Name"
          name={`seasons.${index}.database.db_name`}
          value={databaseDbName}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.database?.db_name && Boolean(isFieldError?.database?.db_name)}
          helperText={isFieldTouched?.database?.db_name && isFieldError?.database?.db_name}
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
            pushNotification("success", "Season is successfully deleted");
            setOpenDeleteDialog(false);
            handleRemoveSeason(index);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </Grid>
  );
};

export default SeasonDetails;
