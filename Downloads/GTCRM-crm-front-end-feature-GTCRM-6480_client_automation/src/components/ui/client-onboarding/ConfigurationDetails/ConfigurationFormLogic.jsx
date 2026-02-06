import { Divider, Grid, Typography } from "@mui/material";
import React from "react";
import FormDetailsFieldLogic from "../../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";

const ConfigurationFormLogic = ({
  field,
  formikValues,
  handleChange,
  setFieldValue,
  handleBlur,
  formik,
  hideDivider,
  handleApiCall,
}) => {
  const fieldName = field?.name?.split(".");
  let fieldValue = formikValues;
  let fieldTouched = formik?.touched;
  let fieldError = formik?.errors;
  fieldName?.forEach((element, index) => {
    fieldValue = fieldValue?.[element];
    fieldTouched = fieldTouched?.[element];
    fieldError = fieldError?.[element];
  });
  return (
    <>
      {field?.sectionTitle ? (
        <Grid item md={12}>
          {!hideDivider && <Divider sx={{ mb: 3, mt: 2 }} />}

          <Typography variant="h6">{field.sectionTitle}</Typography>
        </Grid>
      ) : (
        <FormDetailsFieldLogic
          field={field}
          formikValue={fieldValue}
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          isFieldTouched={fieldTouched}
          isFieldError={fieldError}
          handleApiCall={handleApiCall}
        />
      )}
    </>
  );
};

export default ConfigurationFormLogic;
