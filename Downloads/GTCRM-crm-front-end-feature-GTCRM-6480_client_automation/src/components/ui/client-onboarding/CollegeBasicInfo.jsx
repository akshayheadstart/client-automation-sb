import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import {
  fetchCountries,
  fetchStates,
  fetchCities,
} from "../../../Redux/Slices/countrySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import NavigationButtons from "./NavigationButtons";
import { useFormik } from "formik";
import {
  useCreateClientBasicInfoMutation,
  useGetAllClientsDataQuery,
} from "../../../Redux/Slices/clientOnboardingSlice";
import { clientBasicInfoValidationSchema } from "../../shared/forms/Validation";
import { useNavigate } from "react-router-dom";
import useToasterHook from "../../../hooks/useToasterHook";

const CollegeBasicInfo = ({
  currentSectionIndex,
  setCurrentSectionIndex,
  setCreatedCollegeId,
  hideBackBtn,
}) => {
  const viewField = false;
  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  const dispatch = useDispatch();
  const [loadingCreateClient, setLoadingCreateClient] = useState(false);

  const [skipCallClientApi, setSkipCallClientApi] = useState(true);
  const [clientLists, setClientLists] = useState([]);

  const userId = useSelector((state) => state.authentication.token?.user_id);
  const tokenState = useSelector((state) => state.authentication.token);

  const clientsApiCallInfo = useGetAllClientsDataQuery(
    {},
    {
      skip: skipCallClientApi,
    }
  );
  //get client list
  useEffect(() => {
    if (!skipCallClientApi) {
      const apiResponseList = clientsApiCallInfo?.data?.data;
      const modifyOptions = apiResponseList?.map((item) => ({
        label: item.client_name,
        value: item._id,
      }));
      if (modifyOptions?.length > 0) {
        setClientLists(modifyOptions);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallClientApi, clientsApiCallInfo]);

  // Fetch data from Redux store
  const { countries, states, cities, isLoading } = useSelector((state) => ({
    countries: state.country.countries,
    states: state.country.states,
    cities: state.country.cities,
    isLoading: state.country.isLoading,
  }));

  const handleCountryAPI = () => {
    dispatch(fetchCountries());
  };

  const handleCountryChange = (countryIsoCode) => {
    dispatch(fetchStates(countryIsoCode));
  };

  const handleStateChange = (countryIso, stateIso) => {
    dispatch(fetchCities({ countryIso, stateIso }));
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address_line_1: "",
      address_line_2: "",
      country: null,
      state: null,
      city: null,
      associated_client: "",
    },
    validationSchema: clientBasicInfoValidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const updatedField = {
        name: values.name,
        email: values.email,
        phone_number: values.phoneNumber,
        associated_client: values?.associated_client,
        address: {
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2,
          country_code: values.country.iso2,
          state_code: values.state.iso2,
          city_name: values.city.name,
        },
      };

      handleCreateClient(updatedField);
    },
  });

  const [createClientBasicInfo] = useCreateClientBasicInfoMutation();
  const handleCreateClient = (clientInfo) => {
    setLoadingCreateClient(true);
    createClientBasicInfo({ clientInfo })
      .unwrap()
      .then((response) => {
        if (response?.message) {
          pushNotification("success", response.message);
          setCreatedCollegeId(response.college_id);
          setCurrentSectionIndex((prev) => {
            const nextIndex = prev + 1;

            // Save to localStorage
            localStorage.setItem(
              `${userId}createCollegeSectionIndex`,
              nextIndex.toString()
            );

            return nextIndex;
          });
          localStorage.setItem(`${userId}createdCollegeId`, response.college_id);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          navigate("/page500");
        }
      })
      .finally(() => {
        setLoadingCreateClient(false);
      });
  };

  // Navigate to the next section
  const handleNext = () => {
    formik.handleSubmit();
  };

  return (
    <Box>
      <Typography sx={{ mt: 2 }} variant="h6">
        College Basic Information
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{ my: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="name"
              name="name"
              label="Name"
              color="info"
              inputProps={{ readOnly: viewField }}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="text"
              color="info"
              inputProps={{ readOnly: viewField }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="phoneNUmber"
              name="phoneNumber"
              label="Phone Number"
              type="text"
              color="info"
              inputProps={{ readOnly: viewField }}
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              id="address_line_1"
              name="address_line_1"
              label="Address Line 1"
              color="info"
              inputProps={{ readOnly: viewField }}
              value={formik.values.address_line_1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.address_line_1 &&
                Boolean(formik.errors.address_line_1)
              }
              helperText={
                formik.touched.address_line_1 && formik.errors.address_line_1
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="address_line_2"
              name="address_line_2"
              label="Address Line 2"
              color="info"
              inputProps={{ readOnly: viewField }}
              value={formik.values.address_line_2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.address_line_2 &&
                Boolean(formik.errors.address_line_2)
              }
              helperText={
                formik.touched.address_line_2 && formik.errors.address_line_2
              }
            />
          </Grid>

          <Grid item md={6} xs={12}>
            <Autocomplete
              onOpen={handleCountryAPI}
              disablePortal
              id="combo-box-demo"
              value={formik.values.country}
              options={countries}
              getOptionLabel={(option) => option?.name || ""}
              onChange={(_, newValue) => {
                formik.setFieldValue("country", newValue || null);
                formik.setFieldValue("state", null);
                formik.setFieldValue("city", null);
              }}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Country"
                  name="country"
                  color="info"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              onOpen={() => handleCountryChange(formik.values.country?.iso2)}
              disablePortal
              fullWidth
              options={states}
              getOptionLabel={(option) => option?.name || ""}
              value={formik.values.state}
              onChange={(_, newValue) => {
                // Manually update Formik state
                formik.setFieldValue("state", newValue || null);
                formik.setFieldValue("city", null);
              }}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="State"
                  name="state"
                  color="info"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              onOpen={() =>
                handleStateChange(
                  formik.values.country?.iso2,
                  formik.values.state?.iso2
                )
              }
              disablePortal
              fullWidth
              options={cities}
              getOptionLabel={(option) => option?.name || ""}
              value={formik.values.city}
              onChange={(_, newValue) => {
                // Manually update Formik state
                formik.setFieldValue("city", newValue || null);
              }}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="City"
                  name="city"
                  color="info"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          {tokenState?.scopes?.[0] !== "client_admin" && (
            <Grid item sx={12} md={6}>
              <Autocomplete
                onOpen={() => setSkipCallClientApi(false)}
                loading={clientsApiCallInfo?.isFetching}
                disablePortal
                options={clientLists}
                onChange={(_, newVal) =>
                  formik.setFieldValue("associated_client", newVal?.value)
                }
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    required
                    {...params}
                    label="Select Associated Client"
                    color="info"
                  />
                )}
              />
            </Grid>
          )}
        </Grid>

        {/* Navigation Buttons */}
        <NavigationButtons
          currentSectionIndex={currentSectionIndex}
          handleNext={handleNext}
          loading={loadingCreateClient}
          hideBackBtn={hideBackBtn}
        />
      </form>
    </Box>
  );
};

export default CollegeBasicInfo;
