import React, { useMemo } from "react";
import FormDetailsFieldLogic from "../../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";
import { Divider, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";

function CourseDetailsFormField({
  field,
  formikValues,
  handleChange,
  setFieldValue,
  handleBlur,
  isFieldTouched,
  isFieldError,
  schoolNames,
}) {
  const updatedField = useMemo(() => {
    if (field.name === "school_name") {
      return {
        ...field,
        options: schoolNames || [],
      };
    }
    return field;
  }, [formikValues]);

  return (
    <>
      <FormDetailsFieldLogic
        field={updatedField}
        formikValue={
          formikValues[field?.name]?.name || formikValues[field?.name]
        }
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        handleBlur={handleBlur}
        isFieldTouched={isFieldTouched}
        isFieldError={isFieldError}
      />
    </>
  );
}

export default React.memo(CourseDetailsFormField);
