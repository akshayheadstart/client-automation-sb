import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import {
  useAddCustomFieldMutation,
  useFormKeyNameValidationMutation,
} from "../../../Redux/Slices/clientOnboardingSlice";
import {
  allowedFileExtensions,
  fieldTypeOptions,
} from "../../../constants/LeadStageList";
import { customFieldValidationSchema } from "../../../utils/FormErrorValidationSchema";
import useDebounce from "../../../hooks/useDebounce";
import AddFieldValidations from "../../shared/ClientRegistration/AddFieldValidations";
import useToasterHook from "../../../hooks/useToasterHook";
import { useSelector } from "react-redux";

const AddCustomFieldDialog = ({
  openAddCustomFieldDialog,
  title,
  subTitle,
  handleCloseCustomFieldDialog,
  editingField,
  editingIndex,
  viewField,
  sectionIndex,
  collegeId,
  clientId,
  handleAddCustomField,
  from,
}) => {
  const [keyNameValidation, setKeyNameValidation] = useState({
    status: "",
    message: "",
  });

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const pushNotification = useToasterHook();
  const [addCustomField] = useAddCustomFieldMutation();

  const [loadingAddCustomField, setLoadingAddCustomField] = useState(false);

  const formik = useFormik({
    initialValues: {
      fieldName: editingField?.field_name || "",
      key_name: editingField?.key_name || "",
      field_type: editingField?.field_type || "",
      options: editingField?.options || [],
      isMandatory: editingField?.is_mandatory || false,
      selectVerification: editingField?.selectVerification || "",
      isReadonly: editingField?.is_readonly || false,
      defaultValue: editingField?.default_value || "",
      addOptionsFrom: editingField?.addOptionsFrom || "",
      apiFunction: editingField?.apiFunction || "",
      validations: editingField?.validations || [],
      where_to_show_upload_field:
        editingField?.with_field_upload_file &&
        editingField?.separate_upload_API
          ? "both"
          : editingField?.with_field_upload_file &&
            !editingField?.separate_upload_API
          ? "in this section"
          : !editingField?.with_field_upload_file &&
            editingField?.separate_upload_API
          ? "separate document section"
          : "",
      accepted_file_type: editingField?.accepted_file_type,
    },
    validationSchema: customFieldValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const whereToShow = values.where_to_show_upload_field?.toLowerCase();

      const updatedField = {
        field_name: values.fieldName,
        field_type: values.field_type,
        key_name: values.key_name,
        is_mandatory: values.isMandatory,
        is_readonly: values.isReadonly,
        is_custom: true,
        editable: true,
        can_remove: true,
        default_value: values.defaultValue,
        validations: values?.validations,
      };

      if (values.field_type === "select") {
        updatedField.options = values.options || [];
        updatedField.addOptionsFrom = values.addOptionsFrom;

        if (values.addOptionsFrom === "API") {
          updatedField.apiFunction = values.apiFunction;
        }
      }
      if (values.field_type === "number") {
        updatedField.selectVerification = values.selectVerification;
      }

      if (values.field_type === "file") {
        updatedField.with_field_upload_file = [
          "in this section",
          "both",
        ].includes(whereToShow);
        updatedField.separate_upload_API = [
          "separate document section",
          "both",
        ].includes(whereToShow);
        updatedField.accepted_file_type = values.accepted_file_type;
      }

      if (
        keyNameValidation.status !== "" &&
        keyNameValidation.status !== "success"
      ) {
        pushNotification("warning", "Key name should be unique!");
      } else {
        if (
          from !== "add-field-dialog" &&
          title.toLowerCase() === "edit field"
        ) {
          handleAddCustomField(updatedField, editingIndex, sectionIndex);
          handleCloseCustomFieldDialog();
        } else {
          setLoadingAddCustomField(true);
          const queries = {
            clientId: clientId ? clientId : !collegeId ? userId : "",
            payload: updatedField,
            collegeId: collegeId,
          };
          if (title.toLowerCase() === "edit field") {
            queries.keyName = updatedField?.key_name;
          }

          addCustomField(queries)
            .unwrap()
            .then((response) => {
              if (response.message) {
                pushNotification("success", response.message);
                formik.handleReset();
              }
            })
            .catch((error) => {
              if (error?.data?.detail === "Could not validate credentials") {
                window.location.reload();
              } else if (error?.data?.detail) {
                pushNotification("error", error?.data?.detail);
              }
            })
            .finally(() => {
              setLoadingAddCustomField(false);
              handleCloseCustomFieldDialog();
            });
        }
      }
    },
  });

  const [formKeyNameValidation] = useFormKeyNameValidationMutation();
  const handleKeyNameValidation = (keyName) => {
    if (keyName?.length) {
      setKeyNameValidation({ status: "loading", message: "" });
      formKeyNameValidation({
        keyName: keyName,
        clientId: clientId ? clientId : !collegeId ? userId : "",
        collegeId: collegeId,
      })
        .unwrap()
        .then((response) => {
          try {
            const expectedData = response.message;
            if (typeof expectedData === "string") {
              setKeyNameValidation({
                status: "success",
                message: expectedData,
              });
            } else {
              throw new Error(
                "Key name validation api response has been changed."
              );
            }
          } catch (error) {
            setKeyNameValidation({ status: "error", message: error.message });
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            setKeyNameValidation({
              status: "error",
              message: error?.data?.detail,
            });
          } else {
            setKeyNameValidation({
              status: "error",
              message: "Error occurs!",
            });
          }
        })
        .finally(() => {});
    }
  };

  const isError =
    (formik.touched.key_name && Boolean(formik.errors.key_name)) ||
    keyNameValidation.status === "error";

  const isSuccess = keyNameValidation.status === "success";

  const setCustomFieldValidation = (validations) => {
    formik.setFieldValue("validations", validations);
  };

  return (
    <React.Fragment>
      <Dialog
        PaperProps={{ sx: { borderRadius: 2.5 } }}
        open={openAddCustomFieldDialog}
        onClose={handleCloseCustomFieldDialog}
        fullWidth
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent sx={{ py: 6 }}>
          <DialogContentText>{subTitle}</DialogContentText>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  id="fieldName"
                  name="fieldName"
                  label="Field Name"
                  color="info"
                  inputProps={{ readOnly: viewField }}
                  value={formik.values.fieldName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.fieldName && Boolean(formik.errors.fieldName)
                  }
                  helperText={
                    formik.touched.fieldName && formik.errors.fieldName
                  }
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth
                  name="key_name"
                  label="Key Name"
                  type="text"
                  color={
                    keyNameValidation.status === "success" ? "success" : "info"
                  }
                  inputProps={{
                    readOnly: viewField || title.toLowerCase() === "edit field",
                  }}
                  value={formik.values.key_name}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    if (title.toLowerCase() !== "edit field") {
                      formik.handleBlur(e);
                      handleKeyNameValidation(e.target.value);
                    }
                  }}
                  error={isError}
                  helperText={
                    keyNameValidation.status === "loading" ? (
                      "Validating..."
                    ) : isSuccess ? (
                      <Typography color="success.main" variant="caption">
                        {keyNameValidation.message}
                      </Typography>
                    ) : (
                      (formik.touched.key_name && formik.errors.key_name) ||
                      (keyNameValidation.status === "error" &&
                        keyNameValidation.message)
                    )
                  }
                  InputProps={{
                    endAdornment:
                      keyNameValidation.status === "loading" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Autocomplete
                  disablePortal
                  fullWidth
                  readOnly={viewField}
                  options={fieldTypeOptions}
                  value={formik.values.field_type}
                  onChange={(_, newValue) => {
                    // Manually update Formik state
                    formik.setFieldValue("field_type", newValue);
                    formik.setFieldValue("addOptionsFrom", "");
                    formik.setFieldValue("options", "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      required
                      disabled
                      {...params}
                      label="Field Type"
                      name="field_type"
                      color="info"
                      error={
                        formik.touched.field_type &&
                        Boolean(formik.errors.field_type)
                      }
                      helperText={
                        formik.touched.field_type && formik.errors.field_type
                      }
                    />
                  )}
                />
              </Grid>

              {/* Conditionally render Add Options when fieldType is 'select' */}
              {formik.values.field_type === "select" && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    readOnly={viewField}
                    options={["API", "Custom"]}
                    value={formik.values.addOptionsFrom}
                    onChange={(_, newValue) => {
                      // Manually update Formik state
                      formik.setFieldValue("addOptionsFrom", newValue);
                      formik.setFieldValue("apiFunction", "");
                      formik.setFieldValue("options", "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        disabled
                        {...params}
                        label="Add Options From"
                        name="addOptionsFrom"
                        color="info"
                        error={
                          formik.touched.addOptionsFrom &&
                          Boolean(formik.errors.addOptionsFrom)
                        }
                        helperText={
                          formik.touched.addOptionsFrom &&
                          formik.errors.addOptionsFrom
                        }
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Conditionally render Add Options when fieldType is 'file' */}
              {formik.values.field_type === "file" && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    readOnly={viewField}
                    options={[
                      "In this section",
                      "Separate document section",
                      "Both",
                    ]}
                    value={formik.values.where_to_show_upload_field}
                    onChange={(_, newValue) => {
                      // Manually update Formik state
                      formik.setFieldValue(
                        "where_to_show_upload_field",
                        newValue
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        disabled
                        {...params}
                        label="Where do you want to show this field?"
                        name="where_to_show_upload_field"
                        color="info"
                      />
                    )}
                  />
                </Grid>
              )}

              {formik.values.field_type === "file" && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={allowedFileExtensions}
                    value={formik.values.accepted_file_type}
                    getOptionLabel={(option) => option}
                    freeSolo
                    readOnly={viewField}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    onChange={(_, newValue) =>
                      formik.setFieldValue("accepted_file_type", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        required={
                          formik?.values?.accepted_file_type?.length === 0
                        }
                        multiline
                        {...params}
                        label="Accepted File Type"
                        color="info"
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Conditionally render Add Options when fieldType is 'select' */}
              {formik.values.addOptionsFrom === "API" && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    readOnly={viewField}
                    options={[
                      "fetchCountry",
                      "fetchDiplomaCollege",
                      "fetchUniversity",
                      "fetchDegree",
                      "fetchCollegeName",
                      "fetchState",
                      "fetchDiplomaStream",
                      "fetchBoardName",
                      "fetchCity",
                      "fetchSchoolName",
                      "fetchCourse",
                    ]}
                    value={formik.values.apiFunction}
                    onChange={(_, newValue) => {
                      // Manually update Formik state
                      formik.setFieldValue("apiFunction", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        disabled
                        {...params}
                        label="API Function"
                        name="apiFunction"
                        color="info"
                        error={
                          formik.touched.apiFunction &&
                          Boolean(formik.errors.apiFunction)
                        }
                        helperText={
                          formik.touched.apiFunction &&
                          formik.errors.apiFunction
                        }
                      />
                    )}
                  />
                </Grid>
              )}

              {(formik.values.addOptionsFrom === "Custom" ||
                formik.values.field_type === "radio") && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    multiple
                    options={[]}
                    value={formik.values.options}
                    getOptionLabel={(option) => option}
                    freeSolo
                    readOnly={viewField}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                          <Chip
                            variant="outlined"
                            label={option}
                            key={key}
                            {...tagProps}
                          />
                        );
                      })
                    }
                    onChange={(_, newValue) =>
                      formik.setFieldValue("options", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        required={formik?.values?.options?.length === 0}
                        multiline
                        {...params}
                        label="Add Options"
                        color="info"
                      />
                    )}
                  />
                  <FormHelperText sx={{ color: "#ffcc00" }}>
                    After entering an option, please press enter.
                  </FormHelperText>
                </Grid>
              )}

              {/* Conditionally render Select Verification when fieldType is 'number' */}
              {formik.values.field_type === "number" && (
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    fullWidth
                    readOnly={viewField}
                    options={["Mobile OTP Verification", "Aadhar Verification"]}
                    value={formik.values.selectVerification}
                    onChange={(_, newValue) => {
                      // Manually update Formik state
                      formik.setFieldValue("selectVerification", newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        disabled
                        {...params}
                        label="Select Verification"
                        name="selectVerification"
                        color="info"
                        error={
                          formik.touched.selectVerification &&
                          Boolean(formik.errors.selectVerification)
                        }
                        helperText={
                          formik.touched.selectVerification &&
                          formik.errors.selectVerification
                        }
                      />
                    )}
                  />
                </Grid>
              )}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="defaultValue"
                  name="defaultValue"
                  label="Default Value"
                  color="info"
                  inputProps={{ readOnly: viewField }}
                  value={formik.values.defaultValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.defaultValue &&
                    Boolean(formik.errors.defaultValue)
                  }
                  helperText={
                    formik.touched.defaultValue && formik.errors.defaultValue
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <FormControl required disabled={viewField} color="grey">
                  <FormLabel>Is field mandatory?</FormLabel>
                  <RadioGroup
                    row
                    value={formik.values.isMandatory}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "isMandatory",
                        event.target.value === "true"
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="info" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="info" />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item md={6} xs={12}>
                <FormControl required disabled={viewField} color="grey">
                  <FormLabel>Is field readonly?</FormLabel>
                  <RadioGroup
                    row
                    value={formik.values.isReadonly}
                    onChange={(event) => {
                      formik.setFieldValue(
                        "isReadonly",
                        event.target.value === "true"
                      );
                    }}
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="info" />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="info" />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <AddFieldValidations
                  setCustomFieldValidation={setCustomFieldValidation}
                  currentField={formik.values}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Button
                onClick={handleCloseCustomFieldDialog}
                color="info"
                variant="outlined"
                sx={{ mt: 4, borderRadius: 30 }}
              >
                Cancel
              </Button>
              {!viewField && (
                <Button
                  color="info"
                  variant="contained"
                  type="submit"
                  sx={{ mt: 4, borderRadius: 30 }}
                  disabled={loadingAddCustomField}
                >
                  {loadingAddCustomField ? (
                    <CircularProgress size={20} color="info" />
                  ) : (
                    title
                  )}
                </Button>
              )}
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AddCustomFieldDialog;
