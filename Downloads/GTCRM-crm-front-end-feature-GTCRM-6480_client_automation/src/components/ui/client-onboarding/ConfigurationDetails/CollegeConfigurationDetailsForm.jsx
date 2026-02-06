import React, { useEffect, useMemo, useState } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import useCommonErrorHandling from "../../../../hooks/useCommonErrorHandling";
import {
  useCollegeConfigUpdateMutation,
  useGetCollegeConfigurationDetailsQuery,
} from "../../../../Redux/Slices/clientOnboardingSlice";
import { Box, Button, CircularProgress, Divider, Grid } from "@mui/material";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import ConfigurationFormLogic from "./ConfigurationFormLogic";
import {
  cacheRadisFields,
  chargesPerReleaseFields,
  easyBuzzFields,
  eazyPayFields,
  emailConfigurationsFields,
  emailCredentialsFields,
  enforcementsFields,
  formValidationSchema,
  hdfcFields,
  junoErpFirstUrlFields,
  junoErpSecondUrlFields,
  junoProgRefFields,
  mcube2Fields,
  mcubeFields,
  otherConfigFields,
  payuFields,
  publisherBulkLeadPushLimitFields,
  razorpayForCollegeFields,
  universityDetailsFields,
  validationSchemas,
} from "../../../../utils/FormErrorValidationSchema";
import * as Yup from "yup";
import SharedPaymentGateWay from "./SharedPaymentGateWay";
import {
  junoErpOption,
  paymentGateways,
} from "../../../../constants/LeadStageList";
import SharedRadioGroup from "./SharedRadioGroup";
import useToasterHook from "../../../../hooks/useToasterHook";
import SeasonMemoization from "./SeasonMemoization";
import PaymentMemoization from "./PaymentMemoization";
import {
  convertBooleansToStrings,
  convertStringBooleans,
} from "../../../../pages/StudentTotalQueries/helperFunction";
const getValidationSchemaNew = (fields) => {
  const validationFields = [];
  fields.forEach((field) => {
    if (field?.name) {
      let fieldKey = field.name?.split(".");
      validationFields.push([
        fieldKey[fieldKey?.length - 1],
        validationSchemas(field)[field?.validationType || ""],
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
        const parts = field.name.split(".");
        const lastKey = parts[parts.length - 1];
        if (lastKey === "payment_gateway") {
          values[lastKey] = [];
        } else {
          values[lastKey] = "";
        }
      }
    }
  });

  return values;
};

const CollegeConfigurationDetailsForm = ({ selectedCollegeId, setOpen }) => {
  const [loadingSaveConfiguration, setLoadingSaveConfiguration] =
    useState(false);
  const [selectedPayment, setSelectedPayment] = useState({
    eazypay: false,
    razorpay: true,
    payu: false,
    easy_buzz: false,
    hdfc: false,
  });
  const getEnabledGateways = () =>
    Object.entries(selectedPayment)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);
  const updatedOtherConfigFieldsFields = otherConfigFields?.map((field) => {
    if (field.name === "preferred_payment_gateway") {
      return {
        ...field,
        options: getEnabledGateways(),
      };
    }
    return field;
  });
  const [junoOption, setJunoOption] = useState("yes");
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const pushNotification = useToasterHook();
  const [collegeConfigUpdate] = useCollegeConfigUpdateMutation();
  const defaultValues = useMemo(() => {
    const easyBuzzValues = getDefaultValues(easyBuzzFields);
    const eazyPayValues = getDefaultValues(eazyPayFields);
    const hdfcValues = getDefaultValues(hdfcFields);
    const payuValues = getDefaultValues(payuFields);
    const razorpayValues = getDefaultValues(razorpayForCollegeFields);
    const cacheRadisValues = getDefaultValues(cacheRadisFields);
    const enforcementsValues = getDefaultValues(enforcementsFields);
    const chargesPerReleaseValues = getDefaultValues(chargesPerReleaseFields);
    const publisherBulkLeadPushLimitValues = getDefaultValues(
      publisherBulkLeadPushLimitFields
    );
    const mcubeValues = getDefaultValues(mcubeFields);
    const mcube2Values = getDefaultValues(mcube2Fields);
    let otherConfigValues = getDefaultValues(updatedOtherConfigFieldsFields);
    const junoErpFirstUrlValues = getDefaultValues(junoErpFirstUrlFields);
    const junoErpSecondUrlValues = getDefaultValues(junoErpSecondUrlFields);
    const junoProgRefValues = getDefaultValues(junoProgRefFields);
    const emailCredentialsValues = getDefaultValues(emailCredentialsFields);
    const emailConfigurationsValues = getDefaultValues(
      emailConfigurationsFields
    );
    const universityDetailsValues = getDefaultValues(universityDetailsFields);
    return {
      payment_gateways: {
        easy_buzz: easyBuzzValues,
        eazypay: eazyPayValues,
        hdfc: hdfcValues,
        payu: payuValues,
        razorpay: razorpayValues,
      },
      cache_redis: cacheRadisValues,
      enforcements: enforcementsValues,
      charges_per_release: chargesPerReleaseValues,
      publisher_bulk_lead_push_limit: publisherBulkLeadPushLimitValues,
      telephony_cred: {
        mcube: mcubeValues,
        mcube2: mcube2Values,
      },
      juno_erp: {
        first_url: junoErpFirstUrlValues,
        ...junoProgRefValues,
        second_url: junoErpSecondUrlValues,
      },
      email_credentials: emailCredentialsValues,
      email_configurations: emailConfigurationsValues,
      payment_configurations: [
        {
          allow_payment: "",
          application_wise: "",
          apply_promo_voucher: "",
          apply_scholarship: "",
          payment_gateway: [],
          payment_key: "",
          payment_mode: {
            offline: "",
            online: "",
          },
          payment_name: "",
          show_status: "",
        },
      ],
      seasons: [
        {
          season_name: "",
          start_date: "",
          end_date: "",
          database: {
            username: "",
            password: "",
            url: "",
            db_name: "",
          },
        },
      ],
      university_details: universityDetailsValues,
      ...otherConfigValues,
    };
  }, [selectedPayment]);
  const validationSchema = useMemo(() => {
    const easyBuzzValidation = getValidationSchemaNew(easyBuzzFields);
    const eazyPayValidation = getValidationSchemaNew(eazyPayFields);
    const hdfcValidation = getValidationSchemaNew(hdfcFields);
    const payuValidation = getValidationSchemaNew(payuFields);
    const razorpayValidation = getValidationSchemaNew(razorpayForCollegeFields);
    const cacheRadisValidation = getValidationSchemaNew(cacheRadisFields);
    const enforcementsValidation = getValidationSchemaNew(enforcementsFields);
    const chargesPerReleaseValidation = getValidationSchemaNew(
      chargesPerReleaseFields
    );
    const publisherBulkLeadPushLimitValidation = getValidationSchemaNew(
      publisherBulkLeadPushLimitFields
    );
    const mcubeValidation = getValidationSchemaNew(mcubeFields);
    const mcube2Validation = getValidationSchemaNew(mcube2Fields);
    const otherConfigValidation = formValidationSchema(
      updatedOtherConfigFieldsFields,
      null,
      true
    );
    const junoErpFirstUrlValidation = getValidationSchemaNew(
      junoErpFirstUrlFields
    );
    const junoErpSecondUrlValidation = getValidationSchemaNew(
      junoErpSecondUrlFields
    );
    const junoProgRefValidation = getValidationSchemaNew(junoProgRefFields);
    const emailCredentialsValidation = getValidationSchemaNew(
      emailCredentialsFields
    );
    const emailConfigurationsValidation = getValidationSchemaNew(
      emailConfigurationsFields
    );
    const universityDetailsValidation = getValidationSchemaNew(
      universityDetailsFields
    );
    return Yup.object().shape({
      payment_gateways: Yup.object().shape({
        easy_buzz: easyBuzzValidation,
        eazypay: eazyPayValidation,
        hdfc: hdfcValidation,
        payu: payuValidation,
        razorpay: razorpayValidation,
      }),
      cache_redis: cacheRadisValidation,
      enforcements: enforcementsValidation,
      charges_per_release: chargesPerReleaseValidation,
      publisher_bulk_lead_push_limit: publisherBulkLeadPushLimitValidation,
      telephony_cred: Yup.object().shape({
        mcube: mcubeValidation,
        mcube2: mcube2Validation,
      }),
      juno_erp: Yup.object().shape({
        first_url: junoErpFirstUrlValidation,
        prog_ref: junoProgRefValidation.fields?.prog_ref || Yup.string(),
        second_url: junoErpSecondUrlValidation,
      }),
      email_credentials: emailCredentialsValidation,
      email_configurations: emailConfigurationsValidation,
      payment_configurations: Yup.array().of(
        Yup.object().shape({
          payment_name: Yup.string().required("payment name is required"),
          payment_key: Yup.string().required("payment key is required"),
          allow_payment: Yup.boolean().required("Allow payment is required"),
          application_wise: Yup.boolean().required(
            "Application wise is required"
          ),
          apply_promo_voucher: Yup.boolean().required(
            "Promo voucher is required"
          ),
          apply_scholarship: Yup.boolean().required("Scholarship is required"),
          show_status: Yup.boolean().required("Show status is required"),
          payment_gateway: Yup.array().of(Yup.string()),
          payment_mode: Yup.object().shape({
            offline: Yup.boolean().required("offline is required"),
            online: Yup.boolean().required("Online is required"),
          }),
        })
      ),
      seasons: Yup.array().of(
        Yup.object().shape({
          season_name: Yup.string().required("Season name is required"),
          start_date: Yup.date().required("Date is required"),
          end_date: Yup.date().required("Date is required"),
          database: Yup.object().shape({
            username: Yup.string().required("Username name is required"),
            password: Yup.string().required("password is required"),
            db_name: Yup.string().required("Url is required"),
          }),
        })
      ),
      university_details: universityDetailsValidation,
      ...Object.fromEntries(otherConfigValidation),
    });
  }, [selectedPayment]);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setLoadingSaveConfiguration(true);
      const updatedValues = convertStringBooleans(values);
      collegeConfigUpdate({
        payload: updatedValues,
        collegeId: selectedCollegeId,
      })
        .unwrap()
        .then((response) => {
          if (response.message) {
            pushNotification("success", response.message);
            formik.handleReset();
            setOpen(false);
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          }
        })
        .finally(() => {
          setLoadingSaveConfiguration(false);
        });
    },
  });
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => {
    return (field, value) => {
      let finalValue = value;

      if (value === "true") finalValue = "true";
      else if (value === "false") finalValue = "false";

      formik.setFieldValue(field, finalValue);
    };
  }, [formik]);

  const handleBlur = useMemo(() => formik.handleBlur, []);
  const { data, isError, error, isFetching, isSuccess } =
    useGetCollegeConfigurationDetailsQuery({
      collegeId: selectedCollegeId,
    });

  const handleError = useCommonErrorHandling();

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        const updatedValue = convertBooleansToStrings(data);
        formik.setValues(updatedValue);
        const selectedEasyBuzzPaymentGateway =
          data?.payment_gateways?.easy_buzz?.base_url;
        const selectedEazyPayPaymentGateway =
          data?.payment_gateways?.eazypay.encryption_key;
        const selectedHdfcPaymentGateway =
          data?.payment_gateways?.hdfc.base_url;
        const selectedPayuPaymentGateway =
          data?.payment_gateways?.payu.merchant_key;
        const selectedRazorpayPaymentGateway =
          data?.payment_gateways?.razorpay.razorpay_api_key;
        const selectedJunoErp = data?.juno_erp?.first_url?.authorization;
        setSelectedPayment((prev) => ({
          ...prev,
          easy_buzz: !!selectedEasyBuzzPaymentGateway,
          eazypay: !!selectedEazyPayPaymentGateway,
          hdfc: !!selectedHdfcPaymentGateway,
          payu: !!selectedPayuPaymentGateway,
          razorpay: !!selectedRazorpayPaymentGateway,
        }));
        setJunoOption(selectedJunoErp ? "yes" : "no");
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
                  {emailCredentialsFields?.map((field, index) => (
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
                  {emailConfigurationsFields?.map((field, index) => (
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
                  <Grid item md={12}>
                    <FieldArray
                      name="seasons"
                      render={(arrayHelpers) => (
                        <SeasonMemoization
                          arrayHelpers={arrayHelpers}
                          formikValues={formikValues}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          isFieldTouched={formik.touched?.seasons}
                          isFieldError={formik.errors?.seasons}
                          formik={formik}
                        />
                      )}
                    />
                  </Grid>

                  {universityDetailsFields?.map((field, index) => (
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
                  <SharedPaymentGateWay
                    state={selectedPayment}
                    setState={setSelectedPayment}
                    paymentGateways={paymentGateways}
                    sectionTitle={"Payment Gateway"}
                    formik={formik}
                  />
                  {selectedPayment?.easy_buzz &&
                    easyBuzzFields?.map((field, index) => (
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
                  {selectedPayment?.eazypay &&
                    eazyPayFields?.map((field, index) => (
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
                  {selectedPayment?.hdfc &&
                    hdfcFields?.map((field, index) => (
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
                  {selectedPayment?.payu &&
                    payuFields?.map((field, index) => (
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
                  {selectedPayment?.razorpay &&
                    razorpayForCollegeFields?.map((field, index) => (
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
                  <Grid item md={12}>
                    <FieldArray
                      name="payment_configurations"
                      render={(arrayHelpers) => (
                        <PaymentMemoization
                          arrayHelpers={arrayHelpers}
                          formikValues={formikValues}
                          handleChange={handleChange}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          isFieldTouched={
                            formik.touched?.payment_configurations
                          }
                          isFieldError={formik.errors?.payment_configurations}
                          getEnabledGateways={getEnabledGateways}
                          formik={formik}
                        />
                      )}
                    />
                  </Grid>
                  <SharedRadioGroup
                    setState={setSelectedPayment}
                    paymentGateways={paymentGateways}
                    label={"Do you want to Add Juno ERP Details?"}
                    name={"junoErpOption"}
                    options={junoErpOption}
                    setJunoOption={setJunoOption}
                    junoOption={junoOption}
                    formik={formik}
                  />
                  {junoOption === "yes" &&
                    junoErpFirstUrlFields?.map((field, index) => (
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
                  {junoOption === "yes" &&
                    junoProgRefFields?.map((field, index) => (
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
                  {junoOption === "yes" &&
                    junoErpSecondUrlFields?.map((field, index) => (
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

                  {cacheRadisFields?.map((field, index) => (
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
                  {enforcementsFields?.map((field, index) => (
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
                  {chargesPerReleaseFields?.map((field, index) => (
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
                  {publisherBulkLeadPushLimitFields?.map((field, index) => (
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
                  {mcubeFields?.map((field, index) => (
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
                  {mcube2Fields?.map((field, index) => (
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
                  {updatedOtherConfigFieldsFields?.map((field, index) => (
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

export default CollegeConfigurationDetailsForm;
