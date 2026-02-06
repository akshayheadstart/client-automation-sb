import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import FormFields from "../../../shared/ClientRegistration/FormFields";
import { Button } from "rsuite";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";

const UploadDocumentFieldShared = ({
  title,
  uploadDocumentFields,
  setUploadDocumentFields,
  hideSaveBtn,
  collegeId,
  isFetchingDefaultForm,
  clientId,
  handleEditField,
  handleDeleteField,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ mt: 2 }} variant="h6">
        {title}
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
            {uploadDocumentFields?.length > 0 ? (
              <>
                <FormFields
                  heading={"Student Registration Form"}
                  fieldDetails={uploadDocumentFields}
                  setFieldDetails={setUploadDocumentFields}
                  preview={false}
                  handleAddCustomField={handleEditField}
                  handleDeleteField={handleDeleteField}
                  collegeId={collegeId}
                  clientId={clientId}
                  hideAddFieldButton={true}
                />
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

export default UploadDocumentFieldShared;
