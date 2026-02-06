import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import ClientRegTextField from "./ClientRegTextField";
import FormRadioField from "./FormRadioField";
import TagPicker from "./TagPicker";
import AddIcon from "@mui/icons-material/Add";
import FieldMapping from "./FieldMapping";

function AddNewField({
  newAddedFieldInfo,
  listOfFormFields,
  hideFieldMapping,
  loading,
  setCallFormFieldsApi,
  documentStep,
}) {
  const {
    fieldName,
    setFieldName,
    fieldType,
    setFieldType,
    charLimit,
    setCharLimit,
    selectOptions,
    setSelectOptions,
    isMandatory,
    setIsMandatory,
    editField,
    mappedField,
    setMappedField,
  } = newAddedFieldInfo;
  let fieldTypeOptions = ["text", "number", "email", "select", "date"];
  return (
    <Box>
      <Typography variant="h6" sx={{ mt: 3 }}>
        Add New Field
      </Typography>
      <Grid container spacing={3} alignItems={"center"}>
        <Grid item md={3} sm={6} xs={12}>
          <ClientRegTextField
            value={fieldName}
            setValue={setFieldName}
            label="Field Name"
            type="text"
          />
        </Grid>
        <Grid item md={3} sm={6} xs={12}>
          <Autocomplete
            readOnly={editField?.can_remove === false ? true : false}
            sx={{ mt: 3 }}
            options={documentStep ? ["upload"] : fieldTypeOptions}
            value={fieldType}
            getOptionLabel={(option) => option}
            onChange={(_, newValue) => {
              setFieldType(newValue);
              if (newValue !== "select") setSelectOptions([]);
            }}
            renderInput={(params) => (
              <TextField required {...params} label="Field Type" color="info" />
            )}
          />
        </Grid>
        <>
          {fieldType === "select" ? (
            <>
              <Grid item md={3} sm={6} xs={12}>
                <FormRadioField
                  value={isMandatory}
                  setValue={setIsMandatory}
                  label="Is field mandatory?"
                  styles={{ mt: 3 }}
                />
              </Grid>
              {listOfFormFields && (
                <Grid
                  sx={{ mt: 3, display: hideFieldMapping ? "none" : "block" }}
                  item
                  md={3}
                  sm={6}
                  xs={12}
                >
                  <FieldMapping
                    options={listOfFormFields}
                    loading={loading}
                    setCallFormFieldsApi={setCallFormFieldsApi}
                    mappedField={mappedField}
                    setMappedField={setMappedField}
                  />
                </Grid>
              )}
              <TagPicker
                options={selectOptions}
                setOptions={setSelectOptions}
                helpText="After entering option, please press enter. You can add maximum 20 options."
                label="Add options"
              />
            </>
          ) : (
            <>
              {!documentStep && (
                <Grid item md={3} sm={6} xs={12}>
                  <ClientRegTextField
                    value={charLimit}
                    setValue={setCharLimit}
                    label="Character Limit"
                    type="number"
                    required={false}
                  />
                </Grid>
              )}
              <Grid item md={3} sm={6} xs={12}>
                <FormRadioField
                  value={isMandatory}
                  setValue={setIsMandatory}
                  label="Is field mandatory?"
                  styles={{ mt: 3 }}
                />
              </Grid>

              {listOfFormFields && !documentStep && (
                <Grid
                  sx={{ display: hideFieldMapping ? "none" : "block" }}
                  item
                  md={3}
                  sm={6}
                  xs={12}
                >
                  <FieldMapping
                    options={listOfFormFields}
                    loading={loading}
                    setCallFormFieldsApi={setCallFormFieldsApi}
                    mappedField={mappedField}
                    setMappedField={setMappedField}
                  />
                </Grid>
              )}
            </>
          )}
        </>

        <Grid item md={12}>
          <Button endIcon={<AddIcon />} type="submit" variant="outlined">
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default React.memo(AddNewField);
