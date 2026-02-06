import { Box, Dialog, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ClientDefaultForm from "./ClientDefaultForm";
import AdditionalDetailsForm from "./AdditionalDetails/AdditionalDetailsForm";
import CourseDetailsForm from "./CourseDetails/CourseDetailsForm";
import ColorThemesForm from "../../../pages/ColorThemesForm/ColorThemesForm";
import ModuleSubscriptionTable from "./ModuleSubscriptionTable/ModuleSubscriptionTable";
import { useGetOnboardingStatusQuery } from "../../../Redux/Slices/clientOnboardingSlice";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { Close } from "@mui/icons-material";

// Custom Step Icon component
function CustomStepIcon(props) {
  const { completed, status } = props;

  const icons = {
    completed: <CheckCircleIcon color="success" />,
    rejected: <CancelIcon color="error" />,
    pending: <RadioButtonUncheckedIcon color="disabled" />,
  };

  return (
    <div>
      {((completed && status?.toLowerCase() === "approved") ||
        status?.toLowerCase() === "done") &&
        icons.completed}
      {completed && status?.toLowerCase() === "rejected" && icons.rejected}
      {(status?.toLowerCase() === "in progress" ||
        status?.toLowerCase() === "pending") &&
        icons.pending}
    </div>
  );
}

const OnboardingStatusSteps = ({
  selectedClientId,
  selectedCollegeId,
  showCloseIcon,
  setOpen,
}) => {
  const [additionalPreferenceFields, setAdditionalPreferenceFields] =
    useState();
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [onboardingStatusDetails, setOnboardingStatusDetails] = useState([]);
  const [selectedStep, setSelectedStep] = useState();

  const { data, isError, error, isFetching, isSuccess } =
    useGetOnboardingStatusQuery(
      {
        clientId: selectedClientId,
        collegeId: selectedCollegeId,
      },
      { skip: selectedClientId || selectedCollegeId ? false : true }
    );

  const handleError = useCommonErrorHandling();

  useEffect(() => {
    if (isSuccess) {
      if (data?.data) {
        setOnboardingStatusDetails(data?.data?.steps_array);
      }
    } else if (isError) {
      handleError({ error, setIsInternalServerError });
    }
  }, [data, isError, error, isSuccess]);

  const handleStepClick = (stepIndex) => {
    setSelectedStep(onboardingStatusDetails?.[stepIndex]);
  };

  return (
    <Box sx={{ p: 3 }}>
      {showCloseIcon && (
        <Box className="edit-course-header">
          <Typography variant="h6">Onboarding Status Details</Typography>

          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>
      )}

      {isFetching ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader width={150} height={150} />
        </Box>
      ) : (
        <>
          {isInternalServerError ? (
            <ErrorAndSomethingWentWrong
              isInternalServerError={isInternalServerError}
            />
          ) : (
            <>
              {onboardingStatusDetails?.length > 0 ? (
                <Box sx={{ my: 2 }}>
                  <Stepper alternativeLabel>
                    {onboardingStatusDetails?.map((step, index) => (
                      <Step
                        key={step?.label}
                        completed={
                          step?.status?.toLowerCase() !== "in progress" ||
                          step?.status?.toLowerCase() !== "pending"
                        }
                        onClick={() => handleStepClick(index)}
                      >
                        <StepLabel
                          StepIconComponent={(props) => (
                            <CustomStepIcon {...props} status={step.status} />
                          )}
                          error={step?.status?.toLowerCase() === "rejected"}
                          sx={{ cursor: "pointer !important" }}
                        >
                          {step.label}
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {/* Display selected step details */}
                  {selectedStep && (
                    <Box
                      sx={{
                        mt: 4,
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        {selectedStep?.label}
                      </Typography>
                      <Typography>
                        <strong>Status:</strong> {selectedStep.status}
                      </Typography>

                      {selectedStep?.reason_of_reject && (
                        <Typography color="error">
                          <strong>Rejection Reason:</strong>{" "}
                          {selectedStep?.reason_of_reject}
                        </Typography>
                      )}

                      {[
                        "college_student_registration_form",
                        "client_student_registration_form",
                      ].includes(selectedStep?.request_of) && (
                        <ClientDefaultForm
                          collegeId={selectedCollegeId}
                          currentSectionIndex={2}
                          apiCallingStepValue={2}
                          clientId={selectedClientId}
                          approverId={selectedStep?.requested_id}
                          from="requestView"
                          hideBackBtn={true}
                        />
                      )}

                      {[
                        "college_student_application_form",
                        "client_student_application_form",
                      ].includes(selectedStep?.request_of) && (
                        <ClientDefaultForm
                          collegeId={selectedCollegeId}
                          currentSectionIndex={2}
                          apiCallingStepValue={2}
                          clientId={selectedClientId}
                          hideBackBtn={true}
                          approverId={selectedStep?.requested_id}
                          from="requestView"
                        />
                      )}

                      {[
                        "college_additional_details",
                        "additional_details_form",
                      ].includes(selectedStep?.request_of) && (
                        <AdditionalDetailsForm
                          collegeId={selectedCollegeId}
                          approverId={selectedStep?.requested_id}
                          hideBackBtn={true}
                        />
                      )}

                      {[
                        "course_Details_form",
                        "college_course_details",
                      ].includes(selectedStep?.request_of) && (
                        <CourseDetailsForm
                          approverId={selectedStep?.requested_id}
                          additionalPreferenceFields={
                            additionalPreferenceFields
                          }
                          setAdditionalPreferenceFields={
                            setAdditionalPreferenceFields
                          }
                          hideBackBtn={true}
                          collegeId={selectedCollegeId}
                        />
                      )}
                      {["college_color_theme"].includes(
                        selectedStep?.request_of
                      ) && (
                        <ColorThemesForm
                          hideBackBtn={true}
                          hideNextBtn={true}
                          collegeId={selectedCollegeId}
                        />
                      )}
                      {[
                        "college_subscription_details",
                        "client_subscription_details",
                        "admin_screen",
                      ].includes(selectedStep?.request_of) && (
                        <ModuleSubscriptionTable
                          hideBackBtn={true}
                          hideNextBtn={true}
                          collegeId={selectedCollegeId}
                          approverId={selectedStep?.requested_id}
                          from="requestView"
                          clientId={selectedClientId}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "32vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
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
      )}
    </Box>
  );
};

export default OnboardingStatusSteps;
