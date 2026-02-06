import React, { useState } from "react";
import AddedCourseAction from "../../../shared/ClientRegistration/AddedCourseAction";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { Box } from "@mui/system";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CourseEditDialog from "./CourseEditDialog";
const CourseDetailsTable = ({ addedCourses, setAddedCourses, schoolNames }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editCourse, setEditCourse] = useState({});

  const handleDeleteCourseAction = (index) => {
    const updatedCourses = [...addedCourses];
    updatedCourses.splice(index, 1);
    setAddedCourses(updatedCourses);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <TableContainer
          sx={{ maxHeight: 400, whiteSpace: "nowrap" }}
          className="custom-scrollbar vertical-scrollbar"
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Course name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">School</TableCell>
                <TableCell align="center">Fees</TableCell>
                <TableCell align="center">Specializations</TableCell>
                <TableCell align="center">Activation Date</TableCell>
                <TableCell align="center">Deactivation Date</TableCell>
                {/* <TableCell align="center">
                  Need Separate Form Per Specialization
                </TableCell> */}
                <TableCell align="center">Banner </TableCell>
                <TableCell align="center">Description</TableCell>

                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addedCourses?.map((course, index) => (
                <TableRow sx={{ "&:last-child td": { border: 0 } }}>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {course.course_name}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{course.course_type}</TableCell>
                  <TableCell align="center">
                    {course.school_name || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {course?.course_fees || course?.fees}
                  </TableCell>
                  <TableCell align="center">
                    {course?.specialization_names?.length > 0
                      ? course?.specialization_names?.map((specialization) => (
                          <Typography>{specialization?.spec_name}</Typography>
                        ))
                      : course?.course_specialization?.length > 0
                      ? course?.course_specialization?.map((specialization) => (
                          <Typography>{specialization?.spec_name}</Typography>
                        ))
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {course?.course_activation_date || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {course?.course_deactivation_date || "N/A"}
                  </TableCell>
                  {/* <TableCell align="center">
                    {course?.do_you_want_different_form_for_each_specialization ||
                      "N/A"}
                  </TableCell> */}
                  <TableCell align="center">
                    {course?.course_banner_url || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {course?.course_description || "N/A"}
                  </TableCell>

                  <TableCell align="center">
                    <AddedCourseAction
                      Icon={BorderColorIcon}
                      helpText="Click to View and Edit"
                      handleAction={() => {
                        setEditCourse({
                          courseDetails: course,
                          index,
                        });
                        setOpenEditDialog(true);
                      }}
                      color="info"
                    />
                    <AddedCourseAction
                      Icon={DeleteIcon}
                      helpText="Click to Delete"
                      color="error"
                      handleAction={() => {
                        handleDeleteCourseAction(index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {openEditDialog && (
          <CourseEditDialog
            open={openEditDialog}
            setOpen={setOpenEditDialog}
            course={editCourse}
            schoolNames={schoolNames}
            setAddedCourses={setAddedCourses}
            addedCourses={addedCourses}
          />
        )}
      </Box>
    </>
  );
};

export default React.memo(CourseDetailsTable);
