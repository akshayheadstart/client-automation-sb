import { Grid } from "@mui/material";
import React from "react";
import FormDetailsFieldLogic from "../../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";

const PreferenceManagementFormField = ({
  field,
  formikValues,
  handleBlur,
  handleChange,
  formik,
  setFieldValue,
}) => {
  return (
    <>
      <FormDetailsFieldLogic
        field={field}
        formikValue={formikValues[field?.name]}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        isFieldTouched={formik.touched[field?.name]}
        isFieldError={formik.errors[field?.name]}
      />

      {field?.dependentField &&
        field?.dependentField[formikValues[field?.name]]?.map((field) => (
          <FormDetailsFieldLogic
            field={field}
            formikValue={formikValues[field?.name]}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            handleBlur={handleBlur}
            isFieldTouched={formik.touched[field?.name]}
            isFieldError={formik.errors[field?.name]}
          />
        ))}
    </>
  );
};

export default PreferenceManagementFormField;
