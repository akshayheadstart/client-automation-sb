import React, { useState } from "react";
import FormFields from "../../shared/ClientRegistration/FormFields";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import useToasterHook from "../../../hooks/useToasterHook";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useValidateRequestFormCaller } from "../../../hooks/apiCalls/useValidateRequestFormApiCall";

const RegistrationForm = ({
  regFormFields,
  setRegFormFields,
  collegeId,
  isFetchingDefaultForm,
  clientId,
  title,
  handleDeleteField,
  hideSaveBtn,
  approverId,
}) => {
  const pushNotification = useToasterHook();

  // Handle adding fields with validation
  const handleAddFields = (_, selectedRows) => {
    setRegFormFields(selectedRows);
  };

  const handleEditField = (updatedField, editingIndex) => {
    setRegFormFields((prevFields) => {
      if (editingIndex !== null) {
        // Update existing field
        const updatedFields = [...prevFields];
        updatedFields[editingIndex] = updatedField;
        return updatedFields;
      }
    });
  };

  const { callValidateRequestForm, result: validateRequestResult } =
    useValidateRequestFormCaller();

  const handleValidateRequest = async (regFormFields) => {
    const queries = {
      url: "/master/validate_registration_form",
      payload: { student_registration_form_fields: regFormFields },
      approverId: approverId,
    };

    if (collegeId) {
      queries.collegeId = collegeId;
    } else {
      queries.clientId = clientId ? clientId : !collegeId ? userId : "";
    }

    try {
      const res = await callValidateRequestForm(queries);

      if (res.message) {
        pushNotification("success", res.message);
      }
    } catch (error) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mt: 2 }} variant="h6">
        {title ? title : "Registration Form Fields"}
      </Typography>

      <>
        {isFetchingDefaultForm ? (
          <Box className="loading-animation">
            <LeefLottieAnimationLoader
              height={120}
              width={120}
            ></LeefLottieAnimationLoader>
          </Box>
        ) : (
          <>
            {regFormFields?.length > 0 ? (
              <>
                <FormFields
                  heading={"Student Registration Form"}
                  fieldDetails={regFormFields}
                  setFieldDetails={setRegFormFields}
                  preview={false}
                  handleAddFields={handleAddFields}
                  handleAddCustomField={handleEditField}
                  handleDeleteField={handleDeleteField}
                  collegeId={collegeId}
                  clientId={clientId}
                  showActions={true}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  {!hideSaveBtn && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="info"
                      onClick={() => handleValidateRequest(regFormFields)}
                      disabled={validateRequestResult?.isLoading}
                    >
                      {validateRequestResult?.isLoading ? (
                        <CircularProgress size={20} color="info" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "30vh",
                  alignItems: "center",
                }}
              >
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              </Box>
            )}
          </>
        )}
      </>
    </Box>
  );
};

export default RegistrationForm;
