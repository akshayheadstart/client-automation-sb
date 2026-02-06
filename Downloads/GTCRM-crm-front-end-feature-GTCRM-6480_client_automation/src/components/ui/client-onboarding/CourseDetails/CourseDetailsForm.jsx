import {
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { schoolNamesField } from "../../../../utils/FormErrorValidationSchema";
import SharedAutocomplete from "../../../shared/forms/ClientOnboardingForms/SharedAutocomplete";
import CourseAdditionSection from "./CourseAdditionSection";
import PreferenceManagementForm from "./PreferenceManagementForm";
import { useGetApprovalRequestByIdQuery } from "../../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";

function CourseDetailsForm({
  currentSectionIndex,
  setCurrentSectionIndex,
  additionalPreferenceFields,
  setAdditionalPreferenceFields,
  collegeId,
  approverId,
  hideBackBtn,
}) {
  const pushNotification = useToasterHook();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const [addedCourses, setAddedCourses] = useState([]);
  const [schoolNames, setSchoolNames] = useState([]);
  const [preferenceDetails, setPreferenceDetails] = useState({});

  const FORM_CATEGORY = "category_wise";
  const FORM_COURSE = "course_wise";

  const [differentFormAccordingTo, setDifferentFormAccordingTo] =
    useState(null);

  const { data, isSuccess, error, isError, isFetching } =
    useGetApprovalRequestByIdQuery(
      {
        approverId: approverId,
      },
      {
        skip: !approverId,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = data;
        if (expectedData) {
          setPreferenceDetails(expectedData?.payload?.preference_details);
          setAddedCourses(expectedData?.payload?.course_lists);
          setSchoolNames(expectedData?.payload?.school_names);

          const fetchFormDataThrough =
            expectedData?.payload?.fetch_form_data_through;
          if ([FORM_CATEGORY, FORM_COURSE].includes(fetchFormDataThrough)) {
            setDifferentFormAccordingTo(fetchFormDataThrough);
          } else {
            setDifferentFormAccordingTo(null);
          }
        } else {
          throw new Error(
            "get approval request data by id API response has changed"
          );
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, [error, isError, isSuccess, data]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(
        `${userId}createCollegeAddedCourses`,
        JSON.stringify(addedCourses)
      );
    }
  }, [addedCourses, userId]);

  return (
    <Card className="common-box-shadow client-onboarding-form-card-container">
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5">Course Details</Typography>
      </Box>

      {isFetching ? (
        <>
          <Box className="loading-animation">
            <LeefLottieAnimationLoader
              height={200}
              width={180}
            ></LeefLottieAnimationLoader>
          </Box>
        </>
      ) : (
        <>
          <Box>
            <Typography sx={{ mb: 3 }} variant="h6">
              Add School Names
            </Typography>
            <SharedAutocomplete
              value={schoolNames}
              setFieldValue={(_, value) => setSchoolNames(value)}
              field={schoolNamesField}
            />
          </Box>
          <Divider sx={{ my: 3 }} />
          <CourseAdditionSection
            addedCourses={addedCourses}
            setAddedCourses={setAddedCourses}
            schoolNames={schoolNames}
          />

          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              <FormControl color="grey">
                <FormLabel>Do you want different application form?</FormLabel>
                <RadioGroup
                  value={differentFormAccordingTo}
                  onChange={(event) => {
                    const selectedValue = event.target.value;
                    setDifferentFormAccordingTo(selectedValue);
                    localStorage.setItem(
                      `${userId}createCollegeDifferentForm`,
                      selectedValue
                    );
                  }}
                >
                  <FormControlLabel
                    value={FORM_CATEGORY}
                    control={<Radio color="info" />}
                    label="Category Wise"
                  />
                  <FormControlLabel
                    value={FORM_COURSE}
                    control={<Radio color="info" />}
                    label="Course Wise"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          <PreferenceManagementForm
            addedCourses={addedCourses}
            schoolNames={schoolNames}
            setSchoolNames={setSchoolNames}
            setAddedCourses={setAddedCourses}
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            additionalPreferenceFields={additionalPreferenceFields}
            setAdditionalPreferenceFields={setAdditionalPreferenceFields}
            collegeId={collegeId}
            editPreferenceDetails={preferenceDetails}
            hideBackBtn={hideBackBtn}
            differentFormAccordingTo={differentFormAccordingTo}
            approverId={approverId}
          />
        </>
      )}
    </Card>
  );
}

export default CourseDetailsForm;
