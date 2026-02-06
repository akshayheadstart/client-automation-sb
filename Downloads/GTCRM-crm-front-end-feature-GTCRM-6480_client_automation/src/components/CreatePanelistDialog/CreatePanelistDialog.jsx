import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/createPanelistDialog.css";
import { nameValidation } from "../../utils/validation";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useGetAllSchoolListQuery } from "../../Redux/Slices/filterDataSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { organizeCourseFilterInterViewOption } from "../../helperFunctions/filterHelperFunction";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
const CreatePanelistDialog = ({
  openCreateDialog,
  handleClose,
  setUpdateLoading,
  setPageNumber,
  setFirstEnterPageLoading,
  setCreateUserState,
  setAllDataFetched,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [errorDesignation, setErrorDesignation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [listOfCourses, setListOfCourses] = React.useState([]);

  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);

  const dataObjectPayload = {
    full_name: name,
    email,
    designation,
    school_name: schoolName,
    selected_programs: selectedCourse?.map((item) => ({
      course_name: item.value.course_name,
      specialization_name: item.value.course_specialization,
    })),
    associated_colleges: [collegeId],
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const [
    somethingWentWrongInCreatePanelist,
    setSomethingWentWrongCreatePanelist,
  ] = useState(false);
  const [updateApiInternalServerError, setUpdateApiInternalServerError] =
    useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const handleCreatePanelist = () => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/create_new_user/?user_type=panelist&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(dataObjectPayload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", "Successfully Create Panelist");
            handleClose();
            setPageNumber(1);
            setCreateUserState(true);
            setAllDataFetched(false);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongCreatePanelist,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setUpdateApiInternalServerError, "", 5000);
      })
      .finally(() => {
        setUpdateLoading((prev) => !prev);
        setLoading(false);
        setFirstEnterPageLoading(true);
      });
  };
  const [listOfSchool, setListOfSchool] = React.useState([]);
  const [listOfSchoolObject, setListOfSchoolObject] = React.useState({});
  const [callSchoolFilterOptionApi, setCallSchoolFilterOptionApi] = useState({
    skipSchoolListApiCall: true,
  });
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
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={openCreateDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {somethingWentWrongInCreatePanelist || updateApiInternalServerError ? (
          <Box>
            {updateApiInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrongInCreatePanelist && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            <DialogContent component="form">
              <Box className="header-box-container">
                <Typography className="create-text-data">
                  Create Panelist
                </Typography>
                {loading && (
                  <CircularProgress sx={{ marginLeft: -15 }} color="info" />
                )}

                <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
              </Box>
              <Box className="input-box-container">
                <TextField
                  color="info"
                  required
                  defaultValue={name}
                  fullWidth="50%"
                  label="Full Name"
                  id="filled-size-normal"
                  helperText={errorName}
                  error={errorName}
                  onChange={(e) => {
                    const isCharValid = nameValidation(e.target.value);
                    if (e.target.value.length < 2) {
                      setErrorName("At least 2 characters ");
                      setName(e.target.value);
                    } else if (isCharValid) {
                      setErrorName("");
                      setName(e.target.value);
                    } else {
                      setName(e.target.value);
                      setErrorName(
                        "Numbers and Special characters aren't allowed"
                      );
                    }
                  }}
                />
                <TextField
                  color="info"
                  required
                  fullWidth="50%"
                  id="filled-size-normal"
                  helperText={errorEmail}
                  label="Email"
                  error={errorEmail}
                  onChange={(e) => {
                    const email = e.target.value;
                    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      email
                    );

                    if (isEmailValid) {
                      setErrorEmail("");
                      setEmail(email);
                      setEmailValid(true);
                    } else {
                      setEmail(email);
                      setEmailValid(false);
                      setErrorEmail("Please enter a valid email");
                    }
                  }}
                  defaultValue={email}
                />
              </Box>
              <Box sx={{}} className="input-box-container">
                <TextField
                  color="info"
                  sx={{ width: "50%" }}
                  label="Designation"
                  id="filled-size-normal"
                  helperText={errorDesignation}
                  error={errorDesignation}
                  onChange={(e) => {
                    const isCharValid = nameValidation(e.target.value);
                    if (e.target.value.length === 1) {
                      setErrorDesignation("At least 2 characters ");
                    } else if (isCharValid) {
                      setErrorDesignation("");
                      setDesignation(e.target.value);
                    } else if (e.target.value.length === 0) {
                      setErrorDesignation("");
                    } else {
                      setErrorDesignation(
                        "Numbers and Special characters aren't allowed"
                      );
                    }
                  }}
                  defaultValue={designation}
                />
                <Box style={{ width: "50%" }} className="school-select-picker">
                  <Autocomplete
                    value={schoolName}
                    size="large"
                    getOptionLabel={(option) => option}
                    options={listOfSchool}
                    onChange={(event, newValue) => {
                      setSchoolName(newValue);
                      setSelectedCourse([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        color="info"
                        required
                        fullWidth
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
                  />
                </Box>
              </Box>
              <Box className="school-select-picker">
                <Autocomplete
                  // defaultValue={collegeID ? collegeID : [{ name: "" }]}
                  value={selectedCourse}
                  multiple
                  required
                  size="large"
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
                      fullWidth
                      color="info"
                      label="Select Program"
                      name="programs"
                      {...params}
                    />
                  )}
                  disabled={!schoolName}
                />
                {/* <CheckPicker
                  style={{ width: 450, maxHeight:'180px'}}
                  size="lg"
                  
                  ref={programRef}
                  loading={
                    schoolNameList.isFetching
                      ? schoolNameList.isFetching
                      : false
                  }
                  placeholder="Select Program"
                  // className="select-picker"
                  data={dataCourse}
                  value={selectedCourse}
                  onChange={(value) => {
                    setSelectedCourse(value);
                  }}
                  placement="bottomStart"
                 
                  renderExtraFooter={() => (
                    <div style={footerStyles}>
                      <Checkbox
                        indeterminate={
                          selectedCourse?.length > 0 &&
                          selectedCourse?.length < allValue?.length
                        }
                        checked={selectedCourse?.length === allValue?.length}
                        onChange={handleCheckAll}
                      >
                        Check all
                      </Checkbox>
                      {selectedCourse?.length > 0 ? (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef.current.close();
                          }}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          style={footerButtonStyle}
                          appearance="primary"
                          size="sm"
                          onClick={() => {
                            programRef.current.close();
                          }}
                        >
                          Ok
                        </Button>
                      )}
                    </div>
                  )}
                  disabled={!schoolName}
                 
                /> */}
              </Box>
              <Box className="button-box-container">
                <Button
                  sx={{ borderRadius: 50, marginY: 5 }}
                  color="info"
                  variant="contained"
                  onClick={() => {
                    handleCreatePanelist();
                  }}
                  disabled={!emailValid || !name || name?.length === 1}
                >
                  Create
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default CreatePanelistDialog;
