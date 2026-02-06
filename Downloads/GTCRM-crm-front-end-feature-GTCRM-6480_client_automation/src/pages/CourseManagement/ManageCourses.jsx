/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  Snackbar,
} from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import AddCourseForm from "./AddCourseForm";
import CourseList from "./CourseList";
import SpecializationList from "./SpecializationList";
import {
  useGetAllCoursesQuery,
  useAddCourseMutation,
  useEditExsitingCourseMutation,
  useAddCourseSpecializationMutation,
  useUpdateCourseSpecializationMutation,
  useUpdateCourseStatusMutation,
} from "../../Redux/Slices/courseDataApiSlice";
import ManageCourseDialog from "../../components/shared/Dialogs/ManageCourseDialog";
import SpecializationForm from "./SpecializationForm";

import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";

import "../../styles/ManageCourses.css";

const ManageCourses = (props) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [courses, setCourses] = React.useState([]);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [selectedCourseData, setSelectedCourseData] = React.useState(null);
  const [openScrollMsg, setOpenScrollMsg] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [isEditCourse, setIsEditCourse] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [specData, setSpecData] = React.useState(null);
  const [openSpecDialog, setOpenSpecDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [courseListInternalServerError, setCourseListInternalServerError] =
    React.useState("");
  const [courseListSomethingWentWrong, setCourseListSomethingWentWrong] =
    React.useState("");
  const [hideCourseList, setHideCourseList] = React.useState(false);

  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);
  const {
    data: courseListData,
    isSuccess,
    isError,
    isFetching,
    error,
  } = useGetAllCoursesQuery({ collegeId });
  const [addNewCourse] = useAddCourseMutation();
  const [editExsitingCourse] = useEditExsitingCourseMutation();
  const [addSpecialization] = useAddCourseSpecializationMutation();
  const [updateSpecialization] = useUpdateCourseSpecializationMutation();
  const [updateCourseStatus] = useUpdateCourseStatusMutation();

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(courseListData?.data[0])) {
          setCourses(courseListData?.data[0]);
        } else {
          throw new Error("get course list API response has changed");
        }
      } else if (isError) {
        if (courseListData?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (courseListData?.detail) {
          pushNotification("error", courseListData.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setCourseListInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      handleCatchError(error);
    }
  }, [courseListData, isSuccess, isError, error,hideCourseList]);

  const handleCatchError = (error) => {
    setApiResponseChangeMessage(error);
    handleSomethingWentWrong(
      setCourseListSomethingWentWrong,
      setHideCourseList,
      10000
    );
  };

  const handleCourseClick = (courseObj) => {
    setSelectedCourse(courseObj._id);
    setSelectedCourseData(courseObj);
    setOpenScrollMsg(true);
  };

  const handleAddCourseClick = () => {
    setOpenDialog(true);
    setIsEditCourse(false);
  };

  const handleEditBtnClick = (courseData) => {
    setData(courseData);
    setOpenDialog(true);
    setIsEditCourse(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSpecDialogClose = () => {
    setOpenSpecDialog(false);
  };

  const handleSpecEditBtnClick = (specItem) => {
    setSpecData(specItem);
    setOpenSpecDialog(true);
  };
  const handleAddSpecClick = () => {
    setSpecData(null);
    setOpenSpecDialog(true);
  };

  const handleOnFormSubmit = (payload, editMode = false) => {
    setLoading(true);
    if (isEditCourse || editMode) {
      editExsitingCourse({ collegeId, payload })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            setOpenDialog(false);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setLoading(false));
    } else {
      addNewCourse({ collegeId, payload })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            setOpenDialog(false);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setLoading(false));
    }
  };

  React.useEffect(() => {
    if (selectedCourse) {
      setSelectedCourseData(
        courses.find((item) => item._id === selectedCourse)
      );
    }
  }, [courses, selectedCourse]);

  const handleSpecSubmit = (courseInfo, payload) => {
    setLoading(true);
    if (specData) {
      updateSpecialization({
        courseId: courseInfo._id,
        courseName: courseInfo.course_name,
        collegeId,
        payload,
      })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            setOpenSpecDialog(false);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setLoading(false));
    } else {
      addSpecialization({
        courseId: courseInfo._id,
        courseName: courseInfo.course_name,
        collegeId,
        payload,
      })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            setOpenSpecDialog(false);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setLoading(false));
    }
  };

  const onSubmitSpecialization = (courseInfo, payload, disableCourse) => {
    if (disableCourse) {
      setLoading(true);
      updateCourseStatus({
        collegeId,
        courseId: courseInfo._id,
        payload: {
          is_activated: false,
        },
      })
        .unwrap()
        .then((res) => {
          setOpenSpecDialog(false);
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setLoading(false));
    } else {
      handleSpecSubmit(courseInfo, payload);
    }
  };

  return (
    <Box component="main" className="manage-course-page">
      <Container maxWidth={false}>
        {courseListSomethingWentWrong || courseListInternalServerError ? (
          <Box className="loading-animation-for-notification">
            {courseListInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {courseListSomethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <Grid container>
            <Grid item md={12} sm={12} xs={12}>
              <Box className="application-main">
                <Box className="application-content">
                  <Typography variant="h4">Manage Courses</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item md={4} sm={5} xs={12}>
              <Box className="left-section">
                <Box>
                  <Typography variant="h6" className="courses-label">
                    Courses
                  </Typography>
                </Box>
                <Box>
                  <CourseList
                    courses={courses}
                    handleEditCourse={handleEditBtnClick}
                    handleAddCourseClick={handleAddCourseClick}
                    handleCourseClick={handleCourseClick}
                    selectedCourse={selectedCourse}
                    loading={isFetching || loading}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item md={8} sm={7} xs={12}>
              <Box className={`right-section ${isMatch ? 'sticky-specialization' : ''}`}>
                <Box className="center-align-items justify-space-between specialization-label-container">
                  <Typography variant="h6" className="specialization-label">
                    Specializations
                  </Typography>
                  {selectedCourse ? (
                    <IconButton onClick={handleAddSpecClick}>
                      <AddIcon className="add-icon" />
                    </IconButton>
                  ) : null}
                </Box>
                <Box>
                  {selectedCourse ? (
                    <SpecializationList
                      handleEditBtnClick={handleSpecEditBtnClick}
                      courseData={selectedCourseData}
                      loading={isFetching || loading}
                    />
                  ) : null}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openScrollMsg}
        onClose={() => setOpenScrollMsg(false)}
        message="Scroll down for more info"
        autoHideDuration={2000}
        sx={{
          display: {
            xs: "block",
            lg: "none",
            xl: "none",
            md: "none",
            sm: "none",
          },
        }}
      />

      <ManageCourseDialog
        open={openDialog}
        onClose={handleDialogClose}
        title={isEditCourse ? "Edit Course" : "Add Course"}
      >
        <AddCourseForm
          data={isEditCourse ? data : {}}
          isEditMode={isEditCourse}
          onCancel={handleDialogClose}
          onSubmit={handleOnFormSubmit}
        />
      </ManageCourseDialog>

      <ManageCourseDialog
        open={openSpecDialog}
        onClose={handleSpecDialogClose}
        title={specData ? "Edit specialization" : "Add specialization"}
      >
        <SpecializationForm
          onCancel={handleSpecDialogClose}
          onSubmit={onSubmitSpecialization}
          data={selectedCourseData}
          editSpecData={specData}
        />
      </ManageCourseDialog>
    </Box>
  );
};

export default ManageCourses;
