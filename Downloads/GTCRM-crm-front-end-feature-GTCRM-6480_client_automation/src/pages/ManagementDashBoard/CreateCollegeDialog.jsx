import * as React from "react";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/managementDashboard.css";
import AdditionalDetailsForm from "../../components/ui/client-onboarding/AdditionalDetails/AdditionalDetailsForm";
import CourseDetailsForm from "../../components/ui/client-onboarding/CourseDetails/CourseDetailsForm";
import ClientDefaultForm from "../../components/ui/client-onboarding/ClientDefaultForm";
import ModuleSubscriptionTable from "../../components/ui/client-onboarding/ModuleSubscriptionTable/ModuleSubscriptionTable";
import ColorThemesForm from "../ColorThemesForm/ColorThemesForm";
import ClientOnboarding from "../ClientOnboarding/ClientOnboarding";

export default function CreateCollegeDialog({
  viewCollegeDialogOpen,
  handleViewCollegeDialogClose,
  selectedApplication,
  setCreateCollageToggle,
  createCollageToggle,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));

  const [additionalPreferenceFields, setAdditionalPreferenceFields] =
    React.useState();

  return (
    <React.Fragment>
      <Dialog
        PaperProps={{ sx: { borderRadius: "20px" } }}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        open={viewCollegeDialogOpen}
        onClose={() => {
          handleViewCollegeDialogClose();
          setCreateCollageToggle(false);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent sx={{ p: 0 }}>
          <Box className="management-create-college-dialog-close-box-new">
            <IconButton
              onClick={() => {
                handleViewCollegeDialogClose();
                setCreateCollageToggle(false);
              }}
            >
              <CloseIcon color="info" />
            </IconButton>
          </Box>

          {createCollageToggle ? (
            <ClientOnboarding />
          ) : (
            <>
              {[
                "student_registration_form",
                "client_registration_data",
                "college_registration_data",
                "college_student_registration_form",
                "client_student_registration_form",
              ].includes(selectedApplication?.approval_type) && (
                <ClientDefaultForm
                  collegeId={selectedApplication?.college_id}
                  currentSectionIndex={2}
                  apiCallingStepValue={2}
                  clientId={selectedApplication?.clientId}
                  approverId={selectedApplication?._id}
                  from="requestView"
                  hideBackBtn={true}
                />
              )}
              {[
                "college_form_data",
                "student_dashboard",
                "college_student_application_form",
                "client_student_application_form",
              ].includes(selectedApplication?.approval_type) && (
                <ClientDefaultForm
                  collegeId={selectedApplication?.college_id}
                  currentSectionIndex={2}
                  apiCallingStepValue={2}
                  clientId={selectedApplication?.clientId}
                  hideBackBtn={true}
                  approverId={selectedApplication?._id}
                  from="requestView"
                />
              )}

              {[
                "college_additional_details",
                "additional_details_form",
              ].includes(selectedApplication?.approval_type) && (
                <AdditionalDetailsForm
                  collegeId={selectedApplication?.college_id}
                  approverId={selectedApplication?._id}
                  hideBackBtn={true}
                />
              )}

              {["course_Details_form", "college_course_details"].includes(
                selectedApplication?.approval_type
              ) && (
                <CourseDetailsForm
                  collegeId={selectedApplication?.college_id}
                  approverId={selectedApplication?._id}
                  additionalPreferenceFields={additionalPreferenceFields}
                  setAdditionalPreferenceFields={setAdditionalPreferenceFields}
                  hideBackBtn={true}
                />
              )}
              {["college_color_theme"].includes(
                selectedApplication?.approval_type
              ) && (
                <ColorThemesForm
                  hideBackBtn={true}
                  // hideNextBtn={true}
                  collegeId={selectedApplication?.college_id}
                  viewCollegeDialogOpen={viewCollegeDialogOpen}
                  approverId={selectedApplication?._id}
                />
              )}
              {[
                "college_subscription_details",
                "client_subscription_details",
                "admin_screen",
              ].includes(selectedApplication?.approval_type) && (
                <ModuleSubscriptionTable
                  hideBackBtn={true}
                  hideNextBtn={true}
                  collegeId={selectedApplication?.college_id}
                  approverId={selectedApplication?._id}
                  from="requestView"
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
