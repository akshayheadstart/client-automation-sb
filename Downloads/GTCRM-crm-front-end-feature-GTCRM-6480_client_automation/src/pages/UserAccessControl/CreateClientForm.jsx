import { FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import {
  createClientFormFields,
  createClientFormInitialValues,
  formValidationSchema,
} from "../../utils/FormErrorValidationSchema";
import { getValidationSchema } from "../../components/ui/client-onboarding/ConfigurationDetails/ConfigurationDetailsForm";
import { Box } from "@mui/system";
import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import ConfigurationFormLogic from "../../components/ui/client-onboarding/ConfigurationDetails/ConfigurationFormLogic";
import FormDetailsFieldLogic from "../../components/shared/forms/ClientOnboardingForms/FormDetailsFieldLogic";
import PocDetailsFields from "./PocDetailsFields";
import {
  fetchAccountManagers,
  fetchCities,
  fetchCountries,
  fetchStates,
} from "../../Redux/Slices/countrySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { useCreateClientMutation } from "../../Redux/Slices/clientOnboardingSlice";

function CreateClientForm() {
  const { pocDetailsFields } = createClientFormFields;
  const [addressDetailsFields, setAddressDetailsFields] = useState(
    createClientFormFields.addressDetailsFields
  );
  const [generalDetailsFields, setGeneralDetailsFields] = useState(
    createClientFormFields.generalDetailsFields
  );
  const [openedFieldDetails, setOpenFieldDetails] = useState(null);
  const [createClientLoading, setCreateClientLoading] = useState(false);

  // Fetch data from Redux store
  const { countries, states, cities, accountManagers, isLoading } = useSelector(
    (state) => ({
      countries: state.country.countries,
      states: state.country.states,
      cities: state.country.cities,
      accountManagers: state.country.accountManagers,
      isLoading: state.country.isLoading,
    })
  );

  const apiCallingFunctions = {
    fetchCities,
    fetchCountries,
    fetchStates,
    fetchAccountManagers,
  };
  const apiReturnedData = {
    fetchCountries: countries,
    fetchStates: states,
    fetchCities: cities,
    fetchAccountManagers: accountManagers,
  };

  const dispatch = useDispatch();
  const pushNotification = useToasterHook();
  const [createClient] = useCreateClientMutation();

  const validationSchema = useMemo(() => {
    const generalValidation = formValidationSchema(generalDetailsFields);
    const addressValidation = getValidationSchema(addressDetailsFields);
    const pocValidation = formValidationSchema(pocDetailsFields);

    return Yup.object().shape({
      address: addressValidation,
      POCs: Yup.array().of(pocValidation),
      ...generalValidation.fields,
    });
  }, []);

  const formik = useFormik({
    initialValues: createClientFormInitialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const payload = structuredClone(values);
      payload.address.country_code = values.address.country_code.iso2;
      payload.address.state_code = values.address.state_code.iso2;
      payload.address.city_name = values.address.city_name.name;
      payload.client_phone = payload.client_phone?.toString();
      payload.assigned_account_managers = values.assigned_account_managers.map(
        (manager) => manager._id
      );

      setCreateClientLoading(true);
      createClient({
        payload,
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
        .finally(() => setCreateClientLoading(false));
    },
  });
  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  const handleApiCall = ({ apiKey, index, setFields, fields }) => {
    const dependsOnApiParams = fields[index]?.dependsOnApiParams;
    let dependentFieldValue = {};

    // configuring the dependent fields values and api query param
    if (fields[index]?.dependsOn) {
      fields[index]?.dependsOn.map((depend, index) => {
        if (formikValues.address[depend]) {
          if (dependsOnApiParams) {
            const apiParam = dependsOnApiParams[index];
            dependentFieldValue[apiParam] =
              formikValues.address?.[depend]?.iso2;
          } else {
            dependentFieldValue = formikValues.address?.[depend]?.iso2;
          }
        } else {
          pushNotification("warning", `Please select the field (${depend})`);
        }
      });
    } else {
      if (fields[index]?.options?.length) {
        return;
      }
    }

    // start passing value in the api
    dispatch(apiCallingFunctions[apiKey](dependentFieldValue));

    setOpenFieldDetails({ index, fields, setFields, apiKey });
  };

  useEffect(() => {
    if (openedFieldDetails) {
      const { index, fields, setFields, apiKey } = openedFieldDetails;
      const updatedFields = [...fields];
      fields[index].loading = isLoading;

      updatedFields[index].options = apiReturnedData[apiKey];

      setFields(updatedFields);
    }
  }, [countries, states, cities, isLoading, openedFieldDetails]);

  const handleSetValueAndResetDependentFieldValues = (
    newValue,
    currentField
  ) => {
    setFieldValue(currentField.name, newValue);
    if (currentField.resetFields) {
      currentField.resetFields?.map((field) => setFieldValue(field, null));
    }
  };
  return (
    <Box>
      <FormikProvider value={formik}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <>
              <Grid item md={12}>
                <Typography variant="h6">General Details</Typography>
              </Grid>
              {generalDetailsFields?.map((field, index) => (
                <>
                  <FormDetailsFieldLogic
                    key={field.name}
                    field={field}
                    formikValue={formikValues[field?.name]}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                    isFieldTouched={formik.touched[field?.name]}
                    isFieldError={formik.errors[field?.name]}
                    handleApiCall={() =>
                      handleApiCall({
                        apiKey: field?.apiCallFunction,
                        index,
                        setFields: setGeneralDetailsFields,
                        fields: generalDetailsFields,
                      })
                    }
                  />
                </>
              ))}
              {addressDetailsFields?.map((field, index) => (
                <>
                  <ConfigurationFormLogic
                    key={index}
                    field={field}
                    formikValues={formikValues}
                    handleChange={handleChange}
                    setFieldValue={(_, newValue) =>
                      handleSetValueAndResetDependentFieldValues(
                        newValue,
                        field
                      )
                    }
                    handleBlur={handleBlur}
                    formik={formik}
                    hideDivider={true}
                    handleApiCall={() =>
                      handleApiCall({
                        apiKey: field?.apiCallFunction,
                        index,
                        setFields: setAddressDetailsFields,
                        fields: addressDetailsFields,
                      })
                    }
                  />
                </>
              ))}
              <Grid md={12} item>
                <FieldArray
                  name="POCs"
                  render={(arrayHelpers) => (
                    <PocDetailsFields
                      arrayHelpers={arrayHelpers}
                      formikValues={formikValues}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      isFieldTouched={formik.touched?.POCs}
                      isFieldError={formik.errors?.POCs}
                    />
                  )}
                />
              </Grid>
              <Grid sx={{ textAlign: "right" }} item md={12}>
                {createClientLoading ? (
                  <CircularProgress size={30} color="info" />
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    color="info"
                    type="submit"
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </>
          </Grid>
        </form>
      </FormikProvider>
    </Box>
  );
}

export default CreateClientForm;
