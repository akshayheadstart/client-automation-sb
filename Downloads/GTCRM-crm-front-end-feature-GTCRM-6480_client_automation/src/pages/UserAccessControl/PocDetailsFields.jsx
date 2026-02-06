import { Box } from "@mui/system";
import React, { useCallback } from "react";
import AddLeadStageBtn from "../../components/ui/client-onboarding/AdditionalDetails/AddLeadStageBtn";
import { Grid } from "@mui/material";
import SharedTextField from "../../components/shared/forms/ClientOnboardingForms/SharedTextField";
import RemovePocField from "./RemovePocField";

function PocDetailsFields({
  arrayHelpers,
  formikValues,
  handleChange,
  handleBlur,
  isFieldError,
  isFieldTouched,
}) {
  const handleAddNewPoc = useCallback(
    () =>
      arrayHelpers.push({
        name: "",
        email: "",
        mobile_number: "",
      }),
    []
  );
  const handleRemovePoc = useCallback(
    (index) => arrayHelpers.remove(index),
    []
  );

  return (
    <Box>
      <AddLeadStageBtn
        handleAdd={handleAddNewPoc}
        title="POC Details"
        btnText="Add POC"
      />
      <Grid container spacing={3}>
        {formikValues.POCs.map((poc, index) => (
          <>
            <Grid item md={3} sm={6} xs={12}>
              <SharedTextField
                field={{
                  name: `POCs.${index}.name`,
                  label: "POC's Name",
                  required: true,
                }}
                value={poc.name}
                onChange={handleChange}
                handleBlur={handleBlur}
                isFieldError={isFieldError?.[index]?.name}
                isFieldTouched={isFieldTouched?.[index]?.name}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SharedTextField
                field={{
                  name: `POCs.${index}.email`,
                  label: "POC's Email",
                  required: true,
                }}
                value={poc.email}
                onChange={handleChange}
                handleBlur={handleBlur}
                isFieldError={isFieldError?.[index]?.email}
                isFieldTouched={isFieldTouched?.[index]?.email}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <SharedTextField
                field={{
                  name: `POCs.${index}.mobile_number`,
                  label: "POC's Mobile Number",
                  required: true,
                }}
                value={poc.mobile_number}
                onChange={handleChange}
                handleBlur={handleBlur}
                isFieldError={isFieldError?.[index]?.mobile_number}
                isFieldTouched={isFieldTouched?.[index]?.mobile_number}
              />
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <RemovePocField handleRemovePoc={handleRemovePoc} index={index} />
            </Grid>
          </>
        ))}
      </Grid>
    </Box>
  );
}

export default PocDetailsFields;
