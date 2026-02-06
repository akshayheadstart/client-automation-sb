import { Box } from "@mui/material";
import React, { useCallback } from "react";
import LeadStagesAndSubStages from "./LeadStagesAndSubStages";
import AddLeadStageBtn from "./AddLeadStageBtn";

function LeadStagesMemoization({
  arrayHelpers,
  formikValues,
  handleChange,
  setFieldValue,
  handleBlur,
  isFieldError,
  isFieldTouched,
}) {
  const handleAddNewLeadStage = useCallback(
    () =>
      arrayHelpers.push({
        stage_name: "",
        sub_lead_stage: [],
      }),
    []
  );
  const handleRemoveLeadStage = useCallback(
    (index) => arrayHelpers.remove(index),
    []
  );

  return (
    <Box>
      <AddLeadStageBtn
        handleAdd={handleAddNewLeadStage}
        btnText="Add Lead Stage"
        title="Lead Stages & Sub Stages Details"
      />

      {formikValues?.lead_stages?.map((stage, index) => (
        <LeadStagesAndSubStages
          key={index}
          leadStageValue={stage.stage_name}
          leadSubStageValue={stage.sub_lead_stage}
          index={index}
          setFieldValue={setFieldValue}
          handleChange={handleChange}
          handleRemoveLeadStage={handleRemoveLeadStage}
          handleBlur={handleBlur}
          isFieldTouched={isFieldTouched?.[index]?.stage_name}
          isFieldError={isFieldError?.[index]?.stage_name}
        />
      ))}
    </Box>
  );
}

export default LeadStagesMemoization;
