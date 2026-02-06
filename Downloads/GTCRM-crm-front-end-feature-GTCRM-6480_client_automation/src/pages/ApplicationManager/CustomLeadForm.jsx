/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToasterHook from "../../hooks/useToasterHook";
import {
  fetchCities,
  fetchStates,
  setSelectedCity,
  setSelectedState,
} from "../../Redux/Slices/countrySlice";
import {
  conventionCheck,
  nameValidation,
  phoneNumberValidation,
} from "../../utils/validation";
import "../../styles/CustomLeadForm.css";
import { customLeadSource } from "../../constants/LeadStageList";
import Cookies from "js-cookie";
import { LoadingButton } from "@mui/lab";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { tableSlice } from "../../Redux/Slices/applicationDataApiSlice";
import { CloseOutlined } from "@mui/icons-material";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const CustomLeadForm = ({
  showingInDialog,
  setOpenDialog,
  hideTitle,
  callSource,
  utmMedium,
  phoneNumber,
}) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const navigate = useNavigate();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const dispatch = useDispatch();
  const [errorTextName, setErrorTextName] = useState();
  const [errorTextEmailRegistration, setErrorTextEmailRegistration] =
    useState("");
  const [errorTextMobileNumber, setErrorTextMobileNumber] = React.useState("");
  const [courses, setCourses] = useState([]);
  const { currentUserDetails } = useFetchCommonApi();
  const country = "India";
  const singleState = useSelector((state) => state.country.selectedState);
  const singleCity = useSelector((state) => state.country.selectedCity);
  const [selectedStateValue, setSelectedStateValue] = useState(null);
  const [cityResetValue, setCityResetValue] = React.useState({ name: "" });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [singleCourse, setSingleCourse] = useState("");
  const [source, setSource] = useState(callSource);
  const [singleCourseSpecialization, setSingleCourseSpecialization] =
    useState(null);
  //states of user Informations
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  //states of api response status informations and snackbar alert
  const [isLoading, setIsLoading] = useState(false);
  const courseUrl = `${import.meta.env.VITE_API_BASE_URL}/course/list/${
    collegeId ? "?college_id=" + collegeId : ""
  }`;
  const signUpUrl = `${import.meta.env.VITE_API_BASE_URL}/admin/add_student/${
    collegeId ? "?college_id=" + collegeId : ""
  }`;
  const pushNotification = useToasterHook();
  //something went wrong states
  const [somethingWentWrongInCreateUser, setSomethingWentWrongInCreateUser] =
    useState(false);
  const [createUserInternalServerError, setCreateUserInternalServerError] =
    useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  useEffect(() => {
    if (phoneNumber) {
      setMobileNumber(phoneNumber);
    }
  }, [phoneNumber]);

  //  Ftech states
  useEffect(() => {
    dispatch(fetchStates("IN"));
  }, [dispatch]);
  const states = useSelector((state) => state?.country?.states);

  // cities
  useEffect(() => {
    if (singleState?.iso2) {
      dispatch(
        fetchCities({
          countryIso: "IN",
          stateIso: singleState?.iso2,
        })
      );
    }
  }, [singleState, dispatch]);
  const cities = useSelector((state) => state?.country?.cities);

  // courses
  useEffect(() => {
    customFetch(courseUrl, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const allCoursesWithSpecializations = [];
        const masterAndBachelorCourseTypes = { master: 1, bachelor: 1 };
        data?.data[0].forEach((course) => {
          let index;
          const updatedSpecializations = [...course?.course_specialization];

          const specializationLength = updatedSpecializations?.length
            ? updatedSpecializations?.length
            : 1;
          for (index = 0; index < specializationLength; index++) {
            if (Array.isArray(updatedSpecializations)) {
              allCoursesWithSpecializations.push({
                coursePlusSpecializations: `${course?.course_name}  ${
                  updatedSpecializations[index]?.spec_name
                    ? course?.course_name?.toLowerCase() in
                      masterAndBachelorCourseTypes
                      ? "of"
                      : "in"
                    : ""
                } ${updatedSpecializations[index]?.spec_name || ""}`,
                courseName: course?.course_name,
                specializationName: updatedSpecializations[index]?.spec_name,
              });
            } else {
              allCoursesWithSpecializations.push({
                coursePlusSpecializations: `${course?.course_name} Program`,
                courseName: course?.course_name,
              });
            }
          }
        });
        setCourses(allCoursesWithSpecializations);
      });
  }, [courseUrl]);

  //  course specializations
  const handleSpecialization = (newValue) => {
    setSingleCourse(newValue);
    if (newValue !== null) {
      setSingleCourse(newValue?.courseName);
      setSingleCourseSpecialization(newValue?.specializationName || null);
    }
  };

  //student signup informations
  const createUserInfo = {
    full_name: fullName,
    email: email,
    mobile_number: mobileNumber,
    country_code: "IN",
    state_code: singleState?.iso2,
    city: singleCity?.name,
    course: singleCourse,
    main_specialization: singleCourseSpecialization,
    utm_source: source,
    college_id: collegeId ? collegeId : "",
    utm_medium: utmMedium || "",
  };
  const resetField = () => {
    setFullName("");
    setEmail("");
    setMobileNumber("");
    setSingleCourseSpecialization("");
    setSource(null);
    setCityResetValue({ name: "" });
    setSelectedCourse(null);
    setSelectedStateValue(null);
  };

  const handleCreateLead = (e) => {
    e.preventDefault();

    if (fullName.trim().length === 0) {
      pushNotification("warning", "Please enter a valid name");
    } else {
      if (
        errorTextEmailRegistration.length === 0 &&
        errorTextMobileNumber.length === 0 &&
        errorTextName.length === 0
      ) {
        setIsLoading(true);
        customFetch(signUpUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(createUserInfo),
        })
          .then((res) => res.json())
          .then((result) => {
            setIsLoading(false);
            //if signup successful
            if (result.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (result?.data) {
              try {
                if (typeof result?.data === "object") {
                  if (result?.data?.application_id === "None") {
                    if (showingInDialog) {
                      resetField();
                      setOpenDialog(false);
                      pushNotification(
                        "success",
                        "Account has been created successfully"
                      );
                    } else if (!callSource) {
                      resetField();
                      pushNotification(
                        "success",
                        "Account has been created successfully"
                      );
                    } else {
                      pushNotification(
                        "warning",
                        "Account has been created successfully, but due to some technical issues, you cannot be redirected to the user profile page"
                      );
                      navigate("/lead-manager");
                    }
                  } else {
                    navigate("/userProfile", {
                      state: {
                        applicationId: result?.data?.application_id,
                        studentId: result?.data?.student_id,
                        courseName: result?.data?.course_name,
                        eventType: "demo",
                      },
                    });
                  }
                  //clear all cache of RTK query
                  dispatch(tableSlice.util.resetApiState());
                } else {
                  throw new Error("list_college API response has changed");
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(
                  setSomethingWentWrongInCreateUser,
                  "",
                  10000
                );
              }
            } //show the error message
            else if (result.detail) {
              pushNotification("error", result.detail);
            }
          })
          .catch((error) => {
            if (error.message) {
              handleInternalServerError(
                setCreateUserInternalServerError,
                "",
                10000
              );
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Lead manager Head Title add
  useEffect(() => {
    if (!showingInDialog) {
      setHeadTitle("Create Lead");
      document.title = "Create Lead";
    }
  }, [headTitle]);
  return (
    <Box className={showingInDialog ? "" : "custom-lead-box"}>
      <Card
        sx={{
          backgroundColor: "background.paper",
          minHeight: "100%",
          p: hideTitle ? "5px 0px 0px 0px" : 3,
          maxWidth: "1200px",
          boxShadow: hideTitle ? "none" : "",
        }}
        className="Custom-lead-from-container"
      >
        {showingInDialog && !hideTitle ? (
          <Box sx={{ px: 3 }}>
            <Box className="lead-stage-details-drawer-header">
              <Typography
                sx={{ color: "#092C4C", fontSize: "20px" }}
                variant="h6"
              >
                Create Lead
              </Typography>

              <IconButton onClick={() => setOpenDialog(false)}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </Box>
        ) : (
          ""
        )}

        {somethingWentWrongInCreateUser || createUserInternalServerError ? (
          <>
            {createUserInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInCreateUser && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <form
            onSubmit={handleCreateLead}
            action=""
            className="common-authentication-fields"
          >
            <CardContent
              sx={{
                pt: showingInDialog ? 2 : 3,
                p: hideTitle ? "0 0 0 0" : "",
              }}
            >
              {/*
                TO DO : for now we are commenting this code, once this functionality will be introduced, we will uncomment it.
              <Box className="create-lead-primary-key">
                <Typography>Primary Key</Typography>
                <RadioGroup row>
                  <FormControlLabel
                    sx={{ fontSize: "12px" }}
                    value="email"
                    control={<Radio color="info" />}
                    label="Email"
                  />
                  <FormControlLabel
                    value="mobile"
                    control={<Radio color="info" />}
                    label="Mobile No"
                  />
                </RadioGroup>
              </Box> */}
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    value={fullName}
                    required
                    fullWidth
                    size="small"
                    type="text"
                    color="info"
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    helperText={errorTextName}
                    error={errorTextName}
                    onChange={(e) => {
                      const isCharValid = nameValidation(e.target.value);
                      if (e.target.value.length < 2) {
                        setFullName(e.target.value);
                        setErrorTextName("At least 2 characters ");
                      } else if (isCharValid) {
                        setErrorTextName("");
                        setFullName(e.target.value);
                      } else {
                        setFullName(e.target.value);
                        setErrorTextName(
                          "Numbers and Special characters aren't allowed"
                        );
                      }
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    value={email}
                    fullWidth
                    required
                    color="info"
                    onChange={(e) => {
                      if (conventionCheck(e, "emailRegex")) {
                        setErrorTextEmailRegistration("");
                        setEmail(e.target.value);
                      } else {
                        setEmail(e.target.value);
                        setErrorTextEmailRegistration("Invalid Email");
                      }
                    }}
                    helperText={errorTextEmailRegistration}
                    error={errorTextEmailRegistration}
                    size="small"
                    type="email"
                    id="outlined-basicEmail"
                    label="Email"
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    value={mobileNumber}
                    fullWidth
                    required
                    size="small"
                    color="info"
                    type="number"
                    id="outlined-basicNumber"
                    onKeyDown={phoneNumberValidation}
                    label="Mobile No"
                    variant="outlined"
                    helperText={errorTextMobileNumber}
                    error={errorTextMobileNumber}
                    onChange={(e) => {
                      if (e.target.value.length < 11) {
                        setMobileNumber(e.target.value);
                      }
                      if (e.target.value.length < 10) {
                        setErrorTextMobileNumber("Must be 10 digit");
                      } else {
                        setErrorTextMobileNumber("");
                      }
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    fullWidth
                    required
                    size="small"
                    type="text"
                    color="info"
                    id="outlined-basicCountry"
                    label="Country"
                    variant="outlined"
                    defaultValue={country}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    getOptionLabel={(option) => option?.name}
                    options={states.detail ? [{ name: "No Options" }] : states}
                    onChange={(event, newValue) => {
                      dispatch(setSelectedState(newValue));
                      setCityResetValue({ name: "" });
                      setSelectedStateValue(newValue);
                    }}
                    value={selectedStateValue}
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="State"
                        color="info"
                        name="state"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    size="small"
                    fullWidth
                    value={cityResetValue}
                    getOptionLabel={(option) => option?.name}
                    options={
                      cities.detail || singleState === null
                        ? [{ name: "No Options" }]
                        : cities
                    }
                    onChange={(event, newValue) => {
                      dispatch(setSelectedCity(newValue));
                      setCityResetValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        size="small"
                        label="City"
                        color="info"
                        name="city"
                        placeholder="City"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <Autocomplete
                    size="small"
                    getOptionLabel={(option) =>
                      option?.coursePlusSpecializations
                    }
                    options={courses}
                    onChange={(event, newValue) => {
                      handleSpecialization(newValue);
                      setSelectedCourse(newValue);
                    }}
                    value={selectedCourse}
                    renderInput={(params) => (
                      <TextField
                        required
                        fullWidth
                        label="Program Name"
                        color="info"
                        name="course"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                {currentUserDetails?.role_name !==
                  "college_publisher_console" && (
                  <Grid item md={6} xs={12}>
                    <Autocomplete
                      disabled={callSource?.length > 0}
                      size="small"
                      value={source}
                      getOptionLabel={(option) => option}
                      options={customLeadSource}
                      onChange={(event, newValue) => {
                        setSource(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          required
                          fullWidth
                          label="Source"
                          color="info"
                          name="source"
                          {...params}
                        />
                      )}
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <CardActions
              sx={{
                justifyContent: showingInDialog ? "center" : "flex-end",
                p: hideTitle ? "16px 16px 0px 16px" : 2,
                gap: showingInDialog ? 2 : 0,
              }}
            >
              {showingInDialog && (
                <Button
                  className="common-outlined-button"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
              )}
              <LoadingButton
                className="common-contained-button"
                type="submit"
                loading={isLoading}
                loadingIndicator={
                  <CircularProgress size={25} sx={{ color: "white" }} />
                }
              >
                {isLoading ? "" : "Create"}
              </LoadingButton>
            </CardActions>
          </form>
        )}
      </Card>
    </Box>
  );
};

export default CustomLeadForm;
