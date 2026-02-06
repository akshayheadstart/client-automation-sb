import {
  Autocomplete,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import * as Yup from "yup";
import React, { useContext, useEffect, useMemo, useState } from "react";
import "../../../../styles/clientOnboardingStyles.css";
import {
  s3DetailsFields,
  validationSchemas,
  collPollFields,
  meilisearchFields,
  awsTextractFields,
  rabbitMQFields,
  razorpayFields,
  cacheRedisFields,
  zoomCredentialsFields,
  whatsappCredentialsFields,
  smsFields,
  otherConfigurationFields,
  formValidationSchema,
} from "../../../../utils/FormErrorValidationSchema";
import { FormikProvider, useFormik } from "formik";
import ConfigurationFormLogic from "./ConfigurationFormLogic";
import FormDetailsFieldLogic from "../../../shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";
import {
  useGetClientConfigurationDetailsQuery,
  useSaveClientConfigurationDetailsMutation,
} from "../../../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../../../hooks/useToasterHook";
import { LayoutSettingContext } from "../../../../store/contexts/LayoutSetting";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import useCommonErrorHandling from "../../../../hooks/useCommonErrorHandling";

export const getValidationSchema = (fields) => {
  const validationFields = [];
  fields.forEach((field) => {
    if (field?.name) {
      let fieldKey = field.name?.split(".");
      validationFields.push([
        fieldKey[fieldKey?.length - 1],
        validationSchemas(field)[field?.validationType || "requiredText"],
      ]);
    }
  });
  return Yup.object().shape(Object.fromEntries(validationFields));
};

const getDefaultValues = (fields, notNested) => {
  const values = {};
  fields.forEach((field) => {
    if (field?.name) {
      if (notNested) {
        values[field.name] = "";
      } else {
        values[field.name?.split(".")[1]] = "";
      }
    }
  });
  return values;
};

const ConfigurationDetailsForm = ({ selectedClient, setOpen }) => {
  const [loadingSaveConfiguration, setLoadingSaveConfiguration] =
    useState(false);

  const [isInternalServerError, setIsInternalServerError] = useState(false);

  const pushNotification = useToasterHook();

  const [saveClientConfigurationDetails] =
    useSaveClientConfigurationDetailsMutation();

  const defaultValues = useMemo(() => {
    const s3Values = getDefaultValues(s3DetailsFields);
    const collPollValues = getDefaultValues(collPollFields);
    const meilisearchValues = getDefaultValues(meilisearchFields);
    const awsTextractValues = getDefaultValues(awsTextractFields);
    const rabbitMQValues = getDefaultValues(rabbitMQFields);
    // const razorpayValues = getDefaultValues(razorpayFields);
    // const cacheRedisValues = getDefaultValues(cacheRedisFields);
    const zoomCredentialsValues = getDefaultValues(zoomCredentialsFields);
    const whatsappCredentialsValues = getDefaultValues(
      whatsappCredentialsFields
    );
    const smsValues = getDefaultValues(smsFields);
    // const otherFieldValues = getDefaultValues(otherConfigurationFields, true);

    return {
      s3: s3Values,
      collpoll: collPollValues,
      meilisearch: meilisearchValues,
      aws_textract: awsTextractValues,
      rabbit_mq_credential: rabbitMQValues,
      // razorpay: razorpayValues,
      // cache_redis: cacheRedisValues,
      zoom_credentials: zoomCredentialsValues,
      whatsapp_credential: whatsappCredentialsValues,
      sms: smsValues,
      // ...otherFieldValues,
    };
  }, []);

  const validationSchema = useMemo(() => {
    const s3Validation = getValidationSchema(s3DetailsFields);
    const collPollValidation = getValidationSchema(collPollFields);
    const meilisearchValidation = getValidationSchema(meilisearchFields);
    const awsTextractValidation = getValidationSchema(awsTextractFields);
    const rabbitMQValidation = getValidationSchema(rabbitMQFields);
    // const razorpayValidation = getValidationSchema(razorpayFields);
    // const cacheRedisValidation = getValidationSchema(cacheRedisFields);
    const zoomCredentialsValidation = getValidationSchema(
      zoomCredentialsFields
    );
    const whatsappCredentialsValidation = getValidationSchema(
      whatsappCredentialsFields
    );
    const smsValidation = getValidationSchema(smsFields);
    // const otherConfigurationValidation = formValidationSchema(
    //   otherConfigurationFields,
    //   null,
    //   true
    // );

    return Yup.object().shape({
      s3: s3Validation,
      collpoll: collPollValidation,
      meilisearch: meilisearchValidation,
      aws_textract: awsTextractValidation,
      rabbit_mq_credential: rabbitMQValidation,
      // razorpay: razorpayValidation,
      // cache_redis: cacheRedisValidation,
      zoom_credentials: zoomCredentialsValidation,
      whatsapp_credential: whatsappCredentialsValidation,
      sms: smsValidation,
      // ...Object.fromEntries(otherConfigurationValidation),
    });
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadingSaveConfiguration(true);
      saveClientConfigurationDetails({
        payload: values,
        clientId: selectedClient,
      })
        .unwrap()
        .then((response) => {
          if (response.message) {
            pushNotification("success", response.message);
            formik.handleReset();
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          }
        })
        .finally(() => setLoadingSaveConfiguration(false));
    },
  });

  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  const { data, isError, error, isFetching, isSuccess } =
    useGetClientConfigurationDetailsQuery({ clientId: selectedClient });

  const handleError = useCommonErrorHandling();

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        formik.setValues(data);
      }
    } else if (isError) {
      handleError({ error, setIsInternalServerError });
    }
  }, [data, isError, error, isSuccess]);

  return (
    <Box>
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
            <FormikProvider value={formik}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                  <>
                    {s3DetailsFields?.map((field, index) => (
                      <>
                        <ConfigurationFormLogic
                          key={index}
                          field={field}
                          formikValues={formikValues}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          formik={formik}
                          hideDivider={true}
                        />
                      </>
                    ))}
                    {collPollFields?.map((field, index) => (
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
                    {meilisearchFields?.map((field, index) => (
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
                    {awsTextractFields?.map((field, index) => (
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
                    {rabbitMQFields?.map((field, index) => (
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
                    {/* {razorpayFields?.map((field, index) => (
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
                    ))} */}
                    {/* {cacheRedisFields?.map((field, index) => (
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
                    ))} */}
                    {zoomCredentialsFields?.map((field, index) => (
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
                    {whatsappCredentialsFields?.map((field, index) => (
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
                    {smsFields?.map((field, index) => (
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
                    {/* {otherConfigurationFields?.map((field, index) => (
                      <>
                        {field?.sectionTitle ? (
                          <Grid key={index} item md={12}>
                            <Divider sx={{ mb: 3, mt: 2 }} />

                            <Typography variant="h6">
                              {field.sectionTitle}
                            </Typography>
                          </Grid>
                        ) : (
                          <FormDetailsFieldLogic
                            key={index}
                            field={field}
                            formikValue={formikValues[field?.name]}
                            handleChange={handleChange}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                            isFieldTouched={formik.touched[field?.name]}
                            isFieldError={formik.errors[field?.name]}
                          />
                        )}
                      </>
                    ))} */}
                  </>
                </Grid>
                <Divider sx={{ my: 4 }} />

                <Box sx={{ textAlign: "right" }}>
                  <Button
                    onClick={() => setOpen(false)}
                    sx={{ mr: 1.5 }}
                    color="info"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  {loadingSaveConfiguration ? (
                    <CircularProgress color="info" size={30} />
                  ) : (
                    <Button type="submit" color="info" variant="contained">
                      Submit
                    </Button>
                  )}
                </Box>
              </form>
            </FormikProvider>
          )}
        </>
      )}
    </Box>
  );
};

export default ConfigurationDetailsForm;
