/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { removeCookies } from "../../Redux/Slices/authSlice";
import {
  useGetAllSchoolListQuery,
  useGetEmailTemplateUserRoleQuery,
} from "../../Redux/Slices/filterDataSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { organizeCourseFilterInterViewOption } from "../../helperFunctions/filterHelperFunction";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/createUser.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import {
  conventionCheck,
  nameValidation,
  phoneNumberValidation,
} from "../../utils/validation";
import CloseIcon from "@mui/icons-material/Close";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { useGetAssociatedPermissionsRoleQuery } from "../../Redux/Slices/clientOnboardingSlice";
import {
  customFetch,
  formatLabel,
} from "../StudentTotalQueries/helperFunction";
const SharedTextField = ({
  id,
  label,
  defaultValue,
  onChange,
  size = "small",
  type = "text",
  color = "info",
  ...props
}) => {
  return (
    <TextField
      id={id}
      label={label}
      defaultValue={defaultValue}
      onChange={onChange}
      size={size}
      type={type}
      color={color}
      variant="outlined"
      fullWidth
      required
      {...props}
    />
  );
};
const CreateUser = (props) => {
  const pushNotification = useToasterHook();
  const [colleges, setColleges] = useState([
    { id: "", name: "No College Found" },
  ]);
  const [collegeID, setCollegeId] = useState([]);
  const [user, setUser] = useState({ label: "", value: "", _id: "" });
  const [errorTextName, setErrorTextName] = React.useState();
  const [errorTextEmailRegistration, setErrorTextEmailRegistration] =
    React.useState("");
  const [errorTextMobileNumber, setErrorTextMobileNumber] = React.useState("");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //states of user Informations
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [sourceValue, setSourceValue] = useState("");
  const [dailyLimit, setDailyLimit] = useState(500);
  const [bulkLimit, setBulkLimit] = useState(200);
  const state = useSelector((state) => state.authentication.token);
  if (state.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }

  const [userTypeList, setUserTypeList] = useState([]);
  const permission = useSelector(
    (state) => state?.authentication?.permissions?.permission
  );
  //something went wrong states
  const [somethingWentWrongInCreateUser, setSomethingWentWrongInCreateUser] =
    useState(false);
  const [hideCreateUser, setHideCreateUser] = useState(false);
  const [createUserInternalServerError, setCreateUserInternalServerError] =
    useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  //User Role List API implementation here
  const { data, isSuccess, isError, error } =
    useGetAssociatedPermissionsRoleQuery({ featureKey: "85ac2dfe" });

  useEffect(() => {
    if (isSuccess) {
      const updatedUserList = data?.data?.map((user) => {
        return {
          label: formatLabel(user?.name),
          value: user?.name,
        };
      });
      setUserTypeList(updatedUserList);
    } else if (isError) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
    }
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/college/list_college/`,
      ApiCallHeaderAndBody(token, "GET"),
      true
    )
      .then((res1) => res1.json())
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.message) {
          try {
            if (Array.isArray(res?.data)) {
              setColleges(res?.data);
            } else {
              throw new Error("list_college API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreateUser,
              setHideCreateUser,
              10000
            );
          }
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((err) => {
        handleInternalServerError(
          setCreateUserInternalServerError,
          setHideCreateUser,
          10000
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [schoolName, setSchoolName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [listOfCourses, setListOfCourses] = React.useState([]);
  const [designation, setDesignation] = useState("");
  const [createUser] = useCreateUserMutation();
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const handleCreateUser = (e) => {
    setCreateUserLoading(true);
    const userInfo = {
      email: email,
      full_name: fullName,
      mobile_number: mobileNumber,
      associated_colleges: collegeID?.map((college) => college.id),
      associated_source_value: sourceValue,
      designation: designation,
      school_name: schoolName,
      daily_limit: dailyLimit,
      bulk_limit: bulkLimit,
      selected_programs: selectedCourse?.map((item) => ({
        course_name: item.value.course_name,
        specialization_name: item.value.course_specialization,
      })),
    };

    if (
      errorTextEmailRegistration.length === 0 &&
      errorTextMobileNumber.length === 0 &&
      errorTextName.length === 0
    ) {
      createUser({
        userType: user?.value,
        payloadOfUser: userInfo,
        collegeId: collegeId,
      })
        .unwrap()
        .then((res) => {
          if (res?.data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.data.detail) {
            pushNotification("error", res?.data.detail);
          } else if (res?.message) {
            try {
              if (typeof res?.message === "string") {
                pushNotification(
                  "success",
                  `User Created Successfully and Login credentials have been sent on this account(${email})`
                );

                if (props?.handleDialogClose) {
                  props?.handleDialogClose();
                }
              } else {
                throw new Error("enable_or_disable API response changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInCreateUser,
                "",
                5000
              );
            }
          }
        })
        .catch((error) => {
          if (error?.data?.detail) {
            pushNotification("warning", error?.data?.detail);
          } else {
            handleInternalServerError(
              setCreateUserInternalServerError,
              "",
              5000
            );
          }
        })
        .finally(() => {
          e.target.reset();
          setSourceValue("");
          setCollegeId([]);
          setUser({ label: "", value: "", _id: "" });
          setSelectedCourse([]);
          setSchoolName("");
          setDesignation("");
          setCreateUserLoading(false);
          setDailyLimit();
          setBulkLimit();
        });
    } else {
      pushNotification("error", "Fix errors");
    }
  };

  const [listOfSchool, setListOfSchool] = React.useState([]);
  const [listOfSchoolObject, setListOfSchoolObject] = React.useState({});
  const [hideCourseList, setHideCourseList] = useState(false);
  const [errorDesignation, setErrorDesignation] = useState("");
  const [callSchoolFilterOptionApi, setCallSchoolFilterOptionApi] = useState({
    skipSchoolListApiCall: true,
  });
  const { handleFilterListApiCall } = useCommonApiCalls();
  const schoolNameList = useGetAllSchoolListQuery(
    { collegeId: collegeId },
    { skip: callSchoolFilterOptionApi.skipSchoolListApiCall }
  );
  useEffect(() => {
    if (!callSchoolFilterOptionApi.skipSchoolListApiCall) {
      const courseList = schoolNameList?.data?.data;
      if (typeof courseList === "object" && courseList !== null) {
        setListOfSchoolObject(courseList);
        const parentKeys = Object?.keys(courseList);
        if (parentKeys) {
          setListOfSchool(parentKeys);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    schoolNameList,
    callSchoolFilterOptionApi.skipSchoolListApiCall,
    callSchoolFilterOptionApi,
  ]);
  useEffect(() => {
    if (schoolName) {
      const courseList = listOfSchoolObject[schoolName];
      handleFilterListApiCall(
        courseList,
        schoolNameList,
        setListOfCourses,
        setHideCourseList,
        organizeCourseFilterInterViewOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolName, hideCourseList]);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //InterView list Head Title add
  useEffect(() => {
    setHeadTitle("");
    document.title = "Create User";
  }, [headTitle]);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, py: 2 }}
      className={props.mid === 12 ? "" : "create-user-header-box-container"}
    >
      <Container maxWidth={false} sx={{ pt: 2 }}>
        <Grid container sx={{ justifyContent: "center" }}>
          <Grid item md={props?.mid ? props.mid : 10} xs={12}>
            <Card elevation={16} sx={{ px: 3, boxShadow: 0, pt: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">Create User</Typography>
                {props.mid === 12 && (
                  <IconButton onClick={() => props.handleDialogClose()}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
              {createUserLoading && (
                <Box sx={{ display: "grid", placeItems: "center" }}>
                  <CircularProgress color="info" />
                </Box>
              )}
              {somethingWentWrongInCreateUser ||
              createUserInternalServerError ? (
                <>
                  {createUserInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInCreateUser && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </>
              ) : (
                <Box
                  sx={{
                    backgroundColor: "background.paper",
                    minHeight: "100%",
                    width: { md: "96%", sm: "98%", xs: "98%" },
                    mx: "auto",
                    borderRadius: "8px",
                    visibility: hideCreateUser ? "hidden" : "visible",
                  }}
                >
                  {/* */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCreateUser(e);
                    }}
                  >
                    <CardContent sx={{ px: 0 }}>
                      <Box className="create-user-input-field-box">
                        <SharedTextField
                          id="outlined-basic"
                          label="Full Name"
                          helperText={errorTextName}
                          error={errorTextName}
                          onChange={(e) => {
                            if (e.target.value.length < 2) {
                              setErrorTextName("At least 2 characters ");
                            } else if (conventionCheck(e, "alphabetRegex")) {
                              setErrorTextName("");
                              setFullName(e.target.value);
                            } else {
                              setErrorTextName(
                                "Numbers and Special characters aren't allowed"
                              );
                            }
                          }}
                          type="text"
                        />
                        <SharedTextField
                          id="outlined-basic"
                          label="Enter email address"
                          onChange={(e) => {
                            if (conventionCheck(e, "emailRegex")) {
                              setErrorTextEmailRegistration("");
                              setEmail(e.target.value);
                            } else {
                              setErrorTextEmailRegistration("Invalid Email");
                            }
                          }}
                          helperText={errorTextEmailRegistration}
                          error={errorTextEmailRegistration}
                          type="email"
                        />
                        <SharedTextField
                          id="outlined-basic"
                          label="Enter mobile Number"
                          type="number"
                          onKeyDown={phoneNumberValidation}
                          helperText={errorTextMobileNumber}
                          error={errorTextMobileNumber}
                          onChange={(e) => {
                            if (
                              e.target.value.length < 11 &&
                              e.target.value.length > 9
                            ) {
                              setErrorTextMobileNumber("");
                              setMobileNumber(e.target.value);
                            } else {
                              setErrorTextMobileNumber("Must be 10 digit");
                            }
                          }}
                        />

                        <Box>
                          <Autocomplete
                            // defaultValue={collegeID ? collegeID : [{ name: "" }]}
                            value={collegeID}
                            multiple
                            required
                            size="small"
                            getOptionLabel={(option) => option?.name}
                            options={colleges}
                            onChange={(event, newValue) => {
                              // const ids = []
                              // newValue.forEach(college => {
                              //     ids.push(college?.id)
                              // })
                              setSelectedCourse([]);
                              setSchoolName("");
                              setDesignation("");
                              setCollegeId(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                required={collegeID ? false : true}
                                fullWidth
                                color="info"
                                label="Select Colleges"
                                name="colleges"
                                {...params}
                              />
                            )}
                          />
                        </Box>

                        <Autocomplete
                          value={user}
                          size="small"
                          getOptionLabel={(option) => option?.label}
                          options={userTypeList}
                          onChange={(event, newValue) => {
                            setUser(newValue);
                            setSourceValue("");
                          }}
                          renderInput={(params) => (
                            <TextField
                              required
                              fullWidth
                              color="info"
                              label="Select User Type"
                              name="userType"
                              {...params}
                            />
                          )}
                        />

                        {(user?.name === "Panelist" ||
                          user?.name === "Moderator" ||
                          user?.name === "Authorized Approver") && (
                          <>
                            {(user?.name === "Panelist" ||
                              user?.name === "Moderator" ||
                              user?.name === "Authorized Approver") && (
                              <Autocomplete
                                value={schoolName}
                                size="small"
                                getOptionLabel={(option) => option}
                                options={listOfSchool}
                                onChange={(event, newValue) => {
                                  setSchoolName(newValue);
                                  setSelectedCourse([]);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    required
                                    fullWidth
                                    color="info"
                                    label="Select School"
                                    name="School"
                                    {...params}
                                  />
                                )}
                                loading={
                                  schoolNameList.isFetching
                                    ? schoolNameList.isFetching
                                    : false
                                }
                                onOpen={() => {
                                  setCallSchoolFilterOptionApi &&
                                    setCallSchoolFilterOptionApi((prev) => ({
                                      ...prev,
                                      skipSchoolListApiCall: false,
                                    }));
                                }}
                                disabled={!collegeID.length > 0}
                              />
                            )}

                            {(user?.name === "Panelist" ||
                              user?.name === "Moderator" ||
                              user?.name === "Authorized Approver") && (
                              <Autocomplete
                                // defaultValue={collegeID ? collegeID : [{ name: "" }]}
                                value={selectedCourse}
                                multiple
                                required
                                size="small"
                                getOptionLabel={(option) => option.label}
                                options={listOfCourses}
                                onChange={(event, newValue) => {
                                  // const ids = []
                                  // newValue.forEach(college => {
                                  //     ids.push(college?.id)
                                  // })
                                  setSelectedCourse(newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    // required={collegeID ? false : true}
                                    label="Select Program"
                                    name="programs"
                                    color="info"
                                    {...params}
                                    sx={{
                                      width:
                                        props?.mid === 12 ? "250px" : "100%",
                                    }}
                                  />
                                )}
                                disabled={!schoolName || !collegeID.length > 0}
                              />
                            )}

                            {(user?.name === "Panelist" ||
                              user?.name === "Moderator" ||
                              user?.name === "Authorized Approver") && (
                              <SharedTextField
                                id="outlined-basic"
                                label="Designation"
                                type="text"
                                helperText={errorDesignation}
                                error={errorDesignation}
                                onChange={(e) => {
                                  const isCharValid = nameValidation(
                                    e.target.value
                                  );
                                  if (e.target.value.length < 2) {
                                    setDesignation(e.target.value);
                                    setErrorDesignation(
                                      "At least 2 characters "
                                    );
                                  } else if (isCharValid) {
                                    setErrorDesignation("");
                                    setDesignation(e.target.value);
                                  } else {
                                    setErrorDesignation(
                                      "Numbers and Special characters aren't allowed"
                                    );
                                  }
                                }}
                                value={designation}
                                disabled={!collegeID.length > 0}
                                className="create_user_input_data_field_width"
                              />
                            )}
                          </>
                        )}

                        {user?.name === "College Publisher" && (
                          <>
                            {user?.name === "College Publisher" && (
                              <>
                                <SharedTextField
                                  id="outlined-basic"
                                  label="Source"
                                  onChange={(e) =>
                                    setSourceValue(e.target.value)
                                  }
                                  type="text"
                                />
                                <SharedTextField
                                  id="daily-limit"
                                  label="Daily Limit"
                                  defaultValue={dailyLimit}
                                  onChange={(e) =>
                                    setDailyLimit(e.target.value)
                                  }
                                  type="number"
                                />
                                <SharedTextField
                                  id="bulk-limit"
                                  label="Bulk Limit"
                                  defaultValue={bulkLimit}
                                  onChange={(e) => setBulkLimit(e.target.value)}
                                  type="number"
                                />
                              </>
                            )}
                          </>
                        )}
                      </Box>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: "center",
                        p: 2,
                      }}
                    >
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {props.mid === 12 && (
                          <Button
                            size="small"
                            sx={{
                              ml: 1,
                              borderRadius: 50,
                              //   cursor: errorInInputFields ? "not-allowed" : "pointer",
                            }}
                            type="button"
                            variant="outlined"
                            color="info"
                            onClick={() => {
                              if (props.mid === 12) {
                                props.handleDialogClose();
                              }
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          size="small"
                          sx={{
                            ml: 1,
                            borderRadius: 50,
                            //   cursor: errorInInputFields ? "not-allowed" : "pointer",
                          }}
                          type="submit"
                          variant="contained"
                          color="info"
                        >
                          Create user
                        </Button>
                      </Box>
                    </CardActions>
                  </form>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateUser;
export { SharedTextField };
