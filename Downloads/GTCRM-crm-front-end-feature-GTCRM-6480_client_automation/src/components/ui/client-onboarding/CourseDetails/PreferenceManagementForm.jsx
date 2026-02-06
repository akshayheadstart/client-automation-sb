import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import {
  additionalPreferenceFeesFields,
  formValidationSchema,
  preferenceDetailsFields,
  preferenceManagementFormInitialValues,
} from "../../../../utils/FormErrorValidationSchema";
import { FormikProvider, useFormik } from "formik";
import PreferenceManagementFormField from "./PreferenceManagementFormField";
import ConfigurationFormLogic from "../ConfigurationDetails/ConfigurationFormLogic";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useSaveCollegeCourseDetailsMutation } from "../../../../Redux/Slices/clientOnboardingSlice";
import { useSelector } from "react-redux";
import NavigationButtons from "../NavigationButtons";

const PreferenceManagementForm = ({
  addedCourses,
  schoolNames,
  setSchoolNames,
  setAddedCourses,
  currentSectionIndex,
  setCurrentSectionIndex,
  additionalPreferenceFields,
  setAdditionalPreferenceFields,
  collegeId,
  editPreferenceDetails,
  hideBackBtn,
  differentFormAccordingTo,
  approverId,
}) => {
  const [validations, setValidations] = useState({});

  const [loadingSaveCourse, setLoadingSaveCourse] = useState(false);

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const pushNotification = useToasterHook();
  const [saveClientConfigurationDetails] =
    useSaveCollegeCourseDetailsMutation();

  const formik = useFormik({
    initialValues: editPreferenceDetails?.maximum_fee_limit
      ? editPreferenceDetails
      : preferenceManagementFormInitialValues,
    validationSchema: validations,
    onSubmit: (values) => {
      const payload = {
        school_names: schoolNames,
        course_lists: addedCourses,
        preference_details: values,
        fetch_form_data_through: differentFormAccordingTo
          ? differentFormAccordingTo
          : "college_wise",
      };

      setLoadingSaveCourse(true);
      saveClientConfigurationDetails({
        payload: payload,
        collegeId: collegeId,
        approverId: approverId,
      })
        .unwrap()
        .then((response) => {
          if (response.message) {
            pushNotification("success", response.message);
            formik.handleReset();
            setSchoolNames([]);
            setAddedCourses([]);
            setCurrentSectionIndex((prev) => {
              const nextIndex = prev + 1;

              // Save to localStorage
              localStorage.setItem(
                `${userId}createCollegeSectionIndex`,
                nextIndex.toString()
              );

              return nextIndex;
            });
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          }
        })
        .finally(() => setLoadingSaveCourse(false));
    },
  });

  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  useEffect(() => {
    const fieldCount = formikValues["how_many_preference_do_you_want"] || 0;
    const fields = additionalPreferenceFeesFields(fieldCount);
    const validation = formValidationSchema(
      preferenceDetailsFields,
      formikValues,
      true
    );
    const combinedValidations = Yup.object().shape({
      fees_of_trigger: Yup.object().shape(
        Object.fromEntries(fields.validation)
      ),
      ...Object.fromEntries(validation),
    });

    setAdditionalPreferenceFields(fields.fields);
    setValidations(combinedValidations);
  }, [formikValues]);

  useEffect(() => {
    if (formikValues?.do_you_want_preference_based_system) {
      const {
        do_you_want_preference_based_system,
        will_student_able_to_create_multiple_application,
        maximum_fee_limit,
      } = formikValues;
      formik.setValues({
        do_you_want_preference_based_system,
        will_student_able_to_create_multiple_application,
        maximum_fee_limit,
      });
      formik.setFieldTouched("how_many_preference_do_you_want", false);
    }
  }, [formikValues?.do_you_want_preference_based_system]);

  useEffect(() => {
    if (formikValues.how_many_preference_do_you_want) {
      const additionalFieldCount = formikValues.how_many_preference_do_you_want;
      const resetTouchFields = { fees_of_trigger: {} };
      const updatedValues = { ...formikValues };
      // resetting all the existing touches
      for (let index = 1; index <= additionalFieldCount; index++) {
        resetTouchFields.fees_of_trigger[`trigger_${index}`] = false;
      }
      // deleting all the previous fields which are not in the UI
      if (formikValues.fees_of_trigger) {
        Object.keys(formikValues.fees_of_trigger).forEach((key) => {
          if (!resetTouchFields.fees_of_trigger.hasOwnProperty(key)) {
            delete updatedValues.fees_of_trigger[key];
          }
        });
      }

      formik.setTouched(resetTouchFields);
      formik.setValues(updatedValues);
    }
  }, [formikValues.how_many_preference_do_you_want]);

  useEffect(() => {
    if (editPreferenceDetails?.maximum_fee_limit) {
      const updated = {
        ...editPreferenceDetails,
        do_you_want_preference_based_system:
          editPreferenceDetails?.do_you_want_preference_based_system
            ? "Yes"
            : "No",
        will_student_able_to_create_multiple_application:
          editPreferenceDetails?.will_student_able_to_create_multiple_application
            ? "Yes"
            : "No",
      };
      formik.setValues(updated);
    }
  }, [editPreferenceDetails?.maximum_fee_limit]);

  const handleBack = () => {
    setCurrentSectionIndex(currentSectionIndex - 1);

    localStorage.setItem(
      `${userId}createCollegeSectionIndex`,
      (currentSectionIndex - 1).toString()
    );
  };

  const handleNext = () => {
    formik.handleSubmit();
  };

  return (
    <FormikProvider value={formik}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (addedCourses.length) {
            formik.handleSubmit();
          } else {
            pushNotification("warning", "Please add course");
          }
        }}
      >
        <Box>
          <Typography variant="h6">Manage Preference & Fee's</Typography>

          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            {preferenceDetailsFields.map((field) => (
              <PreferenceManagementFormField
                field={field}
                formikValues={formikValues}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
                formik={formik}
              />
            ))}
          </Grid>
        </Box>
        <Divider sx={{ my: 4 }} />
        {formikValues["how_many_preference_do_you_want"] > 0 && (
          <Box>
            <Typography variant="h6">Additional Preference Fee's</Typography>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={3}>
              {additionalPreferenceFields?.map((field, index) => (
                <>
                  <ConfigurationFormLogic
                    key={index}
                    field={field}
                    formikValues={formikValues}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    formik={formik}
                  />
                </>
              ))}
            </Grid>
          </Box>
        )}
        {/* Navigation Buttons */}
        <NavigationButtons
          currentSectionIndex={currentSectionIndex}
          handleBack={handleBack}
          handleNext={handleNext}
          loading={loadingSaveCourse}
          hideBackBtn={hideBackBtn}
        />
      </form>
    </FormikProvider>
  );
};

export default PreferenceManagementForm;
