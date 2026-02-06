import { Box } from "@mui/system";
import React, { useCallback } from "react";
import AddLeadStageBtn from "../AdditionalDetails/AddLeadStageBtn";
import SpecializationAddFields from "./SpecializationAddFields";

const CourseSpecializationAddAndEdit = ({
  arrayHelpers,
  formikValues,
  handleChange,
  handleBlur,
  isFieldTouched,
  isFieldError,
}) => {
  const handleAddNewSpec = useCallback(
    () =>
      arrayHelpers.push({
        spec_name: null,
        is_activated: true,
        spec_custom_id: null,
        spec_fees: null,
      }),
    []
  );
  const handleRemoveSpec = useCallback(
    (index) => arrayHelpers.remove(index),
    []
  );

  return (
    <Box sx={{ mt: 3 }}>
      <AddLeadStageBtn
        title="Course Specializations"
        btnText="Add Specialization"
        handleAdd={handleAddNewSpec}
      />
      <Box>
        {formikValues?.specialization_names?.map((spec, index) => (
          <SpecializationAddFields
            key={index}
            spec={spec}
            index={index}
            handleChange={handleChange}
            handleRemoveSpec={handleRemoveSpec}
            handleBlur={handleBlur}
            isFieldTouched={isFieldTouched?.specialization_names?.[index]}
            isFieldError={isFieldError?.specialization_names?.[index]}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CourseSpecializationAddAndEdit;
