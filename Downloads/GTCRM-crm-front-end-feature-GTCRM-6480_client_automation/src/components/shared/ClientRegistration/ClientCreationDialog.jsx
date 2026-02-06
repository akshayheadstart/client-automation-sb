import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ClientMainInfoPage from "./ClientMainInfoPage";
import FormFields from "./FormFields";
import AddedCourseTable from "./AddedCourseTable";
import AllApplicationForm from "../../../pages/UserAccessControl/AllApplicationForm";
import DifferentFormForEachCourse from "./DifferentFormForEachCourse";
import UploadLogoAndBg from "./UploadLogoAndBg";
import CoursePreferenceAndFeesRules from "./CoursePreferenceAndFeesRules";
const ClientCreationDialog = ({
  open,
  handleClose,
  list,
  titleOfDialog,
  clientMainPageInfoPageFieldState,
  addedCourseTableFunctions,
  formFieldsStates,
  regFromFields,
  needDifferentForm,
  logoAndBg,
  htmlTemplateURL,
  brochureURL,
  campusTourYoutubeURL,
  thankyouPageURL,
  googleTagManagerID,
  projectTitle,
  metaDescription,
  setNeedCoursePreference,
  needCoursePreference,
  setPreferenceCount,
  preferenceCount,
  preferenceAndFeesCalculation,
  setPreferenceAndFeesCalculation,
  setAdditionalFeesRules,
  additionalFeesRules,
  feeLimit,
  setFeeLimit,
  multipleApplicationMode,
  setMultipleApplicationMode,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      maxWidth="md"
    >
      <DialogTitle>
        <Typography variant="h5">{titleOfDialog}</Typography>
      </DialogTitle>
      <DialogContent sx={{ minWidth: 250 }}>
        {titleOfDialog === "Preview" ? (
          <Box className="client-registration-dialog client-registration">
            <Box>
              <Typography variant="h6">Client Basic Information</Typography>
              <ClientMainInfoPage
                clientMainPageInfoPageFieldState={
                  clientMainPageInfoPageFieldState
                }
                preview={true}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <UploadLogoAndBg
              logoAndBg={logoAndBg}
              preview={true}
              htmlTemplateURL={htmlTemplateURL}
              brochureURL={brochureURL}
              campusTourYoutubeURL={campusTourYoutubeURL}
              thankyouPageURL={thankyouPageURL}
              googleTagManagerID={googleTagManagerID}
              projectTitle={projectTitle}
              metaDescription={metaDescription}
            />
            <Divider sx={{ my: 3 }} />
            <Box>
              <FormFields
                heading={"Student Registration Form"}
                formFieldsStates={formFieldsStates}
                fieldDetails={regFromFields}
                preview={true}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <AddedCourseTable
                addedCourseTableFunctions={addedCourseTableFunctions}
                preview={true}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              {needDifferentForm ? (
                <DifferentFormForEachCourse
                  allCourses={formFieldsStates?.differentCourseFormFields}
                  formFieldsStates={formFieldsStates}
                  preview={true}
                />
              ) : (
                <AllApplicationForm
                  heading="All"
                  formFieldsStates={formFieldsStates}
                  preview={true}
                />
              )}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <CoursePreferenceAndFeesRules
                preview={true}
                setNeedCoursePreference={setNeedCoursePreference}
                needCoursePreference={needCoursePreference}
                setPreferenceCount={setPreferenceCount}
                preferenceCount={preferenceCount}
                preferenceAndFeesCalculation={preferenceAndFeesCalculation}
                setPreferenceAndFeesCalculation={
                  setPreferenceAndFeesCalculation
                }
                setAdditionalFeesRules={setAdditionalFeesRules}
                additionalFeesRules={additionalFeesRules}
                feeLimit={feeLimit}
                setFeeLimit={setFeeLimit}
                multipleApplicationMode={multipleApplicationMode}
                setMultipleApplicationMode={setMultipleApplicationMode}
              />
            </Box>
          </Box>
        ) : (
          <Box>
            {list.length
              ? list.map((specialization) => (
                  <Chip
                    label={specialization?.spec_name}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              : "No specialization is added."}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus variant="outlined" size="small">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(ClientCreationDialog);
