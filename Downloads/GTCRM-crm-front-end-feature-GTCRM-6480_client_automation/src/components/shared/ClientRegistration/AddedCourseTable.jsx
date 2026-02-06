import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import AddedCourseAction from "./AddedCourseAction";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import TagPicker from "./TagPicker";
import AddIcon from "@mui/icons-material/Add";
import NextAndBackButton from "./NextAndBackButton";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DropDownButton from "../DropDownButton/DropDownButton";
import TagPickerObject from "./TagPickerObject";
import { updateFees } from "../../../helperFunctions/UpdatePreferenceAndFeesCalculation";

const AddedCourseTable = ({
  addedCourseTableFunctions,
  preview,
  setOpenDeleteDialog,
  setDeleteIndex,
}) => {
  const {
    setClickedSpecialization,
    setOpenSpecializationDialog,
    handleCourseEdit,
    allCourses,
    editIndex,
    handleAddCourse,
    setCourseName,
    courseName,
    courseSpecializations,
    setCourseSpecializations,
    school,
    setSchool,
    setAllSchools,
    allSchools,
    needDifferentForm,
    setNeedDifferentForm,
    setFormStep,
    setTitleOfDialog,
    courseActivationDate,
    setCourseActivationDate,
    courseDeactivationDate,
    setCourseDeactivationDate,
    isCoursePg,
    setIsCoursePg,
    setPreferenceAndFeesCalculation,
    preferenceAndFeesCalculation,
  } = addedCourseTableFunctions;

  useEffect(() => {
    setPreferenceAndFeesCalculation(
      updateFees(allCourses, preferenceAndFeesCalculation)
    );
  }, [allCourses]);

  return (
    <>
      {allCourses?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Added {allCourses?.length} Courses
            </Typography>
          </Box>
          <TableContainer component={Paper} className="custom-scrollbar">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course name</TableCell>
                  <TableCell align="center">Is PG</TableCell>
                  <TableCell align="center">School</TableCell>
                  <TableCell align="center">Activation Date</TableCell>
                  <TableCell align="center">Deactivation Date</TableCell>

                  {!preview && <TableCell align="center">Actions</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {allCourses.map((course, index) => (
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {course.courseName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {course.isCoursePg ? "Yes" : "No"}
                    </TableCell>
                    <TableCell align="center">
                      {course.school ? course.school : "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {course.courseActivationDate
                        ? new Date(course.courseActivationDate).toDateString()
                        : "- -"}
                    </TableCell>
                    <TableCell align="center">
                      {course.courseDeactivationDate
                        ? new Date(course.courseDeactivationDate).toDateString()
                        : "- -"}
                    </TableCell>

                    {!preview && (
                      <TableCell align="center">
                        <AddedCourseAction
                          Icon={VisibilityIcon}
                          style={{ color: "#3498ff" }}
                          helpText="View specialization"
                          handleAction={() => {
                            setTitleOfDialog("Specializations");
                            setClickedSpecialization(
                              course?.courseSpecializations
                            );
                            setOpenSpecializationDialog(true);
                          }}
                        />
                        <AddedCourseAction
                          Icon={BorderColorIcon}
                          helpText="Edit"
                          handleAction={() => handleCourseEdit(course, index)}
                          style={{ color: "#3498ff" }}
                        />
                        <AddedCourseAction
                          Icon={DeleteIcon}
                          helpText="Delete"
                          style={{ color: "#D10000" }}
                          handleAction={() => {
                            setDeleteIndex(index);
                            setOpenDeleteDialog(true);
                          }}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {!preview && (
        <Box>
          {(allCourses?.length < 50 || editIndex !== null) && (
            <form onSubmit={handleAddCourse}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6">Add Schools</Typography>
              </Box>
              <TagPicker
                options={allSchools}
                setOptions={setAllSchools}
                preventLimit={10}
                helpText="After writing Schools, please press enter button. You can add maximum 10 schools"
                label="Add Schools"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Add Course</Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} sx={{ mt: 0 }}>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      required
                      sx={{ width: "100%" }}
                      label="Course Name"
                      variant="outlined"
                      onChange={(event) => setCourseName(event.target.value)}
                      value={courseName}
                      color="info"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={6}>
                    <DropDownButton
                      buttonName="Select School"
                      options={allSchools}
                      setSchool={setSchool}
                      school={school}
                    ></DropDownButton>
                  </Grid>

                  <TagPickerObject
                    options={courseSpecializations}
                    setOptions={setCourseSpecializations}
                    helpText="After writing specialization, please press enter button. You can add maximum 20 specializations."
                    label="Add Specializations"
                  />

                  <Grid item md={2} sm={12} xs={12}>
                    <FormControl disabled={preview}>
                      <FormLabel>Is course PG?</FormLabel>
                      <RadioGroup
                        row
                        value={isCoursePg}
                        onChange={(e) =>
                          setIsCoursePg(
                            e.target.value === "true" ? true : false
                          )
                        }
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item md={5} sm={6} xs={12}>
                    <DesktopDatePicker
                      label="Course Activation Date"
                      inputFormat="MM/dd/yyyy"
                      sx={{ width: "100%" }}
                      value={courseActivationDate}
                      onChange={(date) => setCourseActivationDate(date)}
                      renderInput={(params) => (
                        <TextField
                          onKeyDown={(e) => e.preventDefault()}
                          fullWidth
                          required
                          {...params}
                          color="info"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item md={5} sm={6} xs={12}>
                    <DesktopDatePicker
                      label="Course Deactivation Date"
                      inputFormat="MM/dd/yyyy"
                      sx={{ width: "100%" }}
                      value={courseDeactivationDate}
                      onChange={(date) => setCourseDeactivationDate(date)}
                      renderInput={(params) => (
                        <TextField
                          onKeyDown={(e) => e.preventDefault()}
                          fullWidth
                          required
                          {...params}
                          color="info"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item>
                    <Button
                      endIcon={<AddIcon />}
                      type="submit"
                      sx={{ width: "100%" }}
                      variant="outlined"
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </LocalizationProvider>
            </form>
          )}
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <FormControl disabled={preview}>
          <FormLabel>
            Do you want different form for each Specialization?
          </FormLabel>
          <RadioGroup
            row
            value={needDifferentForm}
            onChange={(e) =>
              setNeedDifferentForm(e.target.value === "true" ? true : false)
            }
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Box>

      {!preview && (
        <NextAndBackButton
          handleNext={() => setFormStep(4)}
          handleBack={() => setFormStep(2)}
          disableNext={!allCourses?.length ? true : false}
        />
      )}
    </>
  );
};

export default AddedCourseTable;
