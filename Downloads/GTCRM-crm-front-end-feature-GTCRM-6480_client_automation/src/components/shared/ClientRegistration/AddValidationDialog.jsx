import { Close } from "@mui/icons-material";
import * as Yup from "yup";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import SharedTextField from "../forms/ClientOnboardingForms/SharedTextField";
import FormDetailsFieldLogic from "../forms/ClientOnboardingForms/FormDetailsFieldLogic";
import {
  getValidationTypeOfCurrentValidation,
  returnValidationOptions,
  validationSchemas,
} from "../../../utils/FormErrorValidationSchema";
import useToasterHook from "../../../hooks/useToasterHook";

const AddValidationDialog = ({
  open,
  setOpen,
  setValidations,
  currentField,
  validations,
  editIndex,
  editValidation,
}) => {
  const [validationOptions, setValidationOptions] = useState([]);
  const [validationSchema, setValidationSchema] = useState(null);
  const pushNotification = useToasterHook();

  const formik = useFormik({
    initialValues: editValidation
      ? editValidation
      : { type: null, value: "", error_message: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (editValidation) {
        values.type = values.type.value;
        const prevValidations = structuredClone(validations);
        prevValidations[editIndex] = values;
        setValidations(prevValidations);
        formik.handleReset();
        pushNotification("success", "Validation is updated!");
        setOpen(false);
      } else {
        const prevFound = validations.find(
          (validation) => validation.type === values.type.value
        );
        if (prevFound) {
          pushNotification(
            "warning",
            `${values.type.label} validation already exists!. You can edit.`
          );
        } else {
          values.type = values.type.value;
          setValidations((prev) => [...prev, values]);
          formik.handleReset();
          pushNotification("success", "Validation is added!");
          setOpen(false);
        }
      }
    },
  });

  const { handleChange, setFieldValue, handleBlur, values } = formik;

  useEffect(() => {
    const options = returnValidationOptions?.[currentField?.field_type] || [];
    setValidationOptions(options);
  }, [currentField]);

  useEffect(() => {
    if (values["type"]?.validationValueField) {
      const field = {
        label: "Validation Value",
        validationType: values["type"]?.validationValueField?.validationType,
      };
      const validation = validationSchemas(field)[field.validationType];
      const fieldSchema = Yup.object({ value: validation });
      setValidationSchema(fieldSchema);
    } else {
      setValidationSchema(null);
    }

    formik.setFieldTouched("value", false);
  }, [values["type"]]);

  useEffect(() => {
    if (editValidation) {
      const gotValidationType = getValidationTypeOfCurrentValidation(
        currentField,
        editValidation
      );
      setFieldValue("type", gotValidationType);
    }
  }, [editValidation]);

  return (
    <Dialog
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
    >
      <FormikProvider value={formik}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
        >
          <DialogTitle>
            <Box className="configure-dependent-field-header">
              <Typography variant="h6">Add Field Validation</Typography>
              <IconButton onClick={() => setOpen(false)}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ my: 1 }}>
              <Grid container spacing={2}>
                <Grid item md={4} sm={12}>
                  <Autocomplete
                    value={values["type"]}
                    options={validationOptions}
                    fullWidth
                    onChange={(_, newValue) => {
                      setFieldValue("type", newValue);
                      // if the user change the prev selected option
                      if (values["type"]?.value !== newValue?.value) {
                        // reset the value and error message field
                        setFieldValue("value", "");
                        setFieldValue("error_message", "");
                      }
                      if (newValue?.validationValue) {
                        setFieldValue("value", newValue.validationValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        {...params}
                        label="Validation Type"
                        color="info"
                      />
                    )}
                  />
                </Grid>
                {values["type"]?.validationValueField && (
                  <FormDetailsFieldLogic
                    field={{
                      md: 4,
                      name: "value",
                      required: true,
                      label: "Validation Value",
                      type: values["type"]?.validationValueField?.type,
                    }}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    formikValue={values["value"]}
                    isFieldTouched={formik.touched["value"]}
                    isFieldError={formik.errors["value"]}
                  />
                )}
                <Grid item md={4} sm={12}>
                  <SharedTextField
                    field={{
                      name: "error_message",
                      required: true,
                      label: "Error Message",
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values["error_message"]}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box sx={{ px: 1.5, pb: 2 }}>
              <Button
                onClick={() => setOpen(false)}
                sx={{ mr: 1.2 }}
                className="common-outlined-button"
              >
                Cancel
              </Button>
              <Button type="submit" className="common-contained-button">
                {editValidation ? "Update" : "Add"}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddValidationDialog;
