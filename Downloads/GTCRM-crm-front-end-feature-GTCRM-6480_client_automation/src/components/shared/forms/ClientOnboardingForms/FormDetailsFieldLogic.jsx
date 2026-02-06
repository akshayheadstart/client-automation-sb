import { Grid } from "@mui/material";
import React from "react";
import SharedAutocomplete from "./SharedAutocomplete";
import SharedDatePicker from "./SharedDatePicker";
import SharedTextField from "./SharedTextField";
import SharedSwitch from "./SharedSwitch";

function FormDetailsFieldLogic({
  field,
  formikValue,
  handleChange,
  setFieldValue,
  handleBlur,
  isFieldError,
  isFieldTouched,
  handleApiCall,
}) {
  return (
    <Grid item md={field?.md || 3} sm={6} xs={12}>
      {field.type === "select" ? (
        <SharedAutocomplete
          field={field}
          value={formikValue}
          setFieldValue={setFieldValue}
          handleBlur={handleBlur}
          isFieldError={isFieldError}
          isFieldTouched={isFieldTouched}
          handleApiCall={handleApiCall}
        />
      ) : (
        <>
          {field?.type === "date" ? (
            <SharedDatePicker
              field={field}
              value={formikValue}
              setFieldValue={setFieldValue}
              onChange={handleChange}
              handleBlur={handleBlur}
              isFieldError={isFieldError}
              isFieldTouched={isFieldTouched}
            />
          ) : (
            <>
              {field.type === "switch" ? (
                <SharedSwitch
                  field={field}
                  value={formikValue}
                  setFieldValue={setFieldValue}
                />
              ) : (
                <SharedTextField
                  field={field}
                  value={formikValue}
                  onChange={handleChange}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  isFieldError={isFieldError}
                  isFieldTouched={isFieldTouched}
                />
              )}
            </>
          )}
        </>
      )}
    </Grid>
  );
}

export default FormDetailsFieldLogic;
