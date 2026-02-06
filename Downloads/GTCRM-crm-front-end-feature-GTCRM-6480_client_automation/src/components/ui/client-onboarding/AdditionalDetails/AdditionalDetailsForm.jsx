import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import {
  additionalFields,
  additionalFieldsInitialValues,
  additionalFieldsValidationSchema,
} from "../../../../utils/FormErrorValidationSchema.jsx";
import LeadStagesMemoization from "./LeadStagesMemoization";
import FormDetailsFieldLogic from "../../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic.jsx";
import TermsAndConditionField from "./TermsAndConditionField.jsx";
import useToasterHook from "../../../../hooks/useToasterHook.jsx";
import { useSelector } from "react-redux";
import {
  useGetApprovalRequestByIdQuery,
  useSaveCollegeAdditionalDetailsMutation,
} from "../../../../Redux/Slices/clientOnboardingSlice.js";
import NavigationButtons from "../NavigationButtons.jsx";
import { useNavigate } from "react-router-dom";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader.jsx";

function AdditionalDetailsForm({
  currentSectionIndex,
  setCurrentSectionIndex,
  collegeId,
  approverId,
  hideBackBtn,
}) {
  const [loadingSaveAdditionalDetails, setLoadingAdditionalDetails] =
    useState(false);

  const [savedAdditionalDetails, setSavedAdditionalDetails] = useState({});

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  const [saveCollegeAdditionalDetails] =
    useSaveCollegeAdditionalDetailsMutation();

  const {
    generalDetailsFields,
    paymentGateway,
    termsAndConditionAndDeclarationText,
  } = additionalFields;

  const formik = useFormik({
    initialValues: savedAdditionalDetails?.student_dashboard_project_title
      ? savedAdditionalDetails
      : additionalFieldsInitialValues,
    validationSchema: additionalFieldsValidationSchema,
    onSubmit: (values) => {
      // form submission

      setLoadingAdditionalDetails(true);
      saveCollegeAdditionalDetails({
        payload: values,
        collegeId: collegeId,
        approverId: approverId,
      })
        .unwrap()
        .then((response) => {
          if (response.message) {
            pushNotification("success", response.message);
            formik.handleReset();
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
        .finally(() => setLoadingAdditionalDetails(false));
    },
  });

  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  const {
    data,
    isSuccess,
    isFetching: isFetchingApprovalRequest,
    error,
    isError,
  } = useGetApprovalRequestByIdQuery(
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
          setSavedAdditionalDetails(expectedData?.payload);
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
    if (savedAdditionalDetails?.student_dashboard_project_title) {
      formik.setValues(savedAdditionalDetails);
    }
  }, [savedAdditionalDetails?.student_dashboard_project_title]);

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      localStorage.setItem(
        `${userId}createCollegeSectionIndex`,
        (currentSectionIndex - 1).toString()
      );
    }
  };

  const handleNext = () => {
    formik.handleSubmit();
  };

  return (
    <Card className="common-box-shadow client-onboarding-form-card-container">
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5">Additional Details</Typography>
      </Box>

      {isFetchingApprovalRequest ? (
        <Box className="loading-animation">
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6">General Details</Typography>
            </Box>
            <Grid container spacing={3}>
              {generalDetailsFields.map((field) => (
                <FormDetailsFieldLogic
                  key={field.name}
                  field={field}
                  formikValue={
                    formikValues[field?.name]?.name || formikValues[field?.name]
                  }
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  isFieldTouched={formik.touched[field?.name]}
                  isFieldError={formik.errors[field?.name]}
                />
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />

            <Box>
              <FieldArray
                name="lead_stages"
                render={(arrayHelpers) => (
                  <LeadStagesMemoization
                    arrayHelpers={arrayHelpers}
                    formikValues={formikValues}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    isFieldTouched={formik.touched?.lead_stages}
                    isFieldError={formik.errors?.lead_stages}
                  />
                )}
              />
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6">Payment Gateway Details</Typography>
            </Box>
            <Grid container spacing={3}>
              {paymentGateway.map((field) => (
                <FormDetailsFieldLogic
                  key={field.name}
                  field={field}
                  formikValue={formikValues[field?.name]}
                  handleChange={handleChange}
                  setFieldValue={setFieldValue}
                  handleBlur={handleBlur}
                  isFieldTouched={formik.touched[field?.name]}
                  isFieldError={formik.errors[field?.name]}
                />
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h6">
                Terms & Conditions and Declaration Text
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {termsAndConditionAndDeclarationText.map((field) => (
                <TermsAndConditionField
                  key={field.name}
                  placeholder={field.label}
                  fieldName={field.name}
                  formikValue={formikValues[field?.name]}
                  setFieldValue={setFieldValue}
                />
              ))}
            </Grid>
            <Divider sx={{ my: 3 }} />

            {/* Navigation Buttons */}
            <NavigationButtons
              currentSectionIndex={currentSectionIndex}
              handleBack={handleBack}
              handleNext={handleNext}
              loading={loadingSaveAdditionalDetails}
              hideBackBtn={hideBackBtn}
            />
          </form>
        </FormikProvider>
      )}
    </Card>
  );
}

export default AdditionalDetailsForm;
