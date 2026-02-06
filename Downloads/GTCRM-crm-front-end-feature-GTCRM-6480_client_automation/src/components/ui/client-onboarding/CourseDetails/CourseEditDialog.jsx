import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo } from "react";
import { FieldArray, FormikProvider, useFormik } from "formik";
import CourseDetailsFormField from "./CourseDetailsFormField";
import {
  courseDetailsFields,
  formValidationSchema,
  specializationSchema,
} from "../../../../utils/FormErrorValidationSchema";
import CourseSpecializationAddAndEdit from "./CourseSpecializationAddAndEdit";

const CourseEditDialog = ({
  open,
  setOpen,
  course,
  schoolNames,
  setAddedCourses,
  addedCourses,
}) => {
  const specializationLists =
    course?.courseDetails?.specialization_names ||
    course?.courseDetails?.course_specialization;

  const defaultValues = course?.courseDetails
    ? {
        ...course.courseDetails,
        course_fees:
          course?.courseDetails?.course_fees ||
          course?.courseDetails?.fees?.toString()?.split(".")[1],
        specialization_names: specializationLists,
      }
    : useMemo(() => {
        const initialValues = { specialization_names: [] };
        courseDetailsFields.forEach((field) => {
          if (field?.name) {
            if (field.type === "date") {
              initialValues[field.name] = null;
            } else {
              initialValues[field.name] = field?.defaultValue || "";
            }
          }
        });
        return initialValues;
      }, []);

  const validationSchema = useMemo(() => {
    const courseValidation = formValidationSchema(courseDetailsFields);
    return courseValidation.concat(specializationSchema);
  }, []);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema,
    onSubmit: (values) => {
      const newCourse = { ...values };
      delete newCourse.add_school_names;

      const updatedCourses = [...addedCourses];
      if (course) {
        updatedCourses[course.index] = newCourse;
        setAddedCourses(updatedCourses);
      } else {
        updatedCourses.push(newCourse);
        setAddedCourses(updatedCourses);
      }

      formik.handleReset();
      setOpen(false);
    },
  });
  // memoizing the values and functions to prevent unnecessary re-renderings
  const formikValues = useMemo(() => formik.values, [formik.values]);
  const handleChange = useMemo(() => formik.handleChange, []);
  const setFieldValue = useMemo(() => formik.setFieldValue, []);
  const handleBlur = useMemo(() => formik.handleBlur, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const errorFields = await formik.validateForm();
    const invalidKeys = Object.keys(errorFields);

    if (invalidKeys.length === 0) {
      formik.handleSubmit(); // Submit if no errors
    } else {
      const touchedFields = {};
      invalidKeys.forEach((key) => {
        touchedFields[key] = true;
      });
      formik.setTouched(touchedFields);
    }
  };

  useEffect(() => {
    const schoolName = formikValues.school_name;
    if (schoolNames.indexOf(schoolName) === -1) {
      formik.setFieldValue("school_name", "");
    }
  }, [schoolNames]);

  return (
    <Dialog
      PaperProps={{ sx: { borderRadius: "20px" } }}
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="lg"
    >
      <DialogContent>
        <Box className="edit-course-header">
          <Typography variant="h6">{course ? "Edit" : "Add"} Course</Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </Box>

        <FormikProvider value={formik}>
          <form onSubmit={handleAddCourse}>
            <Grid container spacing={3}>
              <>
                {courseDetailsFields?.map((field, index) => (
                  <CourseDetailsFormField
                    key={index}
                    schoolNames={schoolNames}
                    field={field}
                    formikValues={formikValues}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                  />
                ))}
              </>
            </Grid>
            <Box>
              <FieldArray
                name="specialization_names"
                render={(arrayHelpers) => (
                  <CourseSpecializationAddAndEdit
                    arrayHelpers={arrayHelpers}
                    formikValues={formikValues}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    isFieldTouched={formik.touched}
                    isFieldError={formik.errors}
                  />
                )}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 3,
                justifyContent: "center",
              }}
            >
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                className="common-outlined-button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="common-contained-button"
              >
                Save
              </Button>
            </Box>
          </form>
        </FormikProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;
