import { Add } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CourseEditDialog from "./CourseEditDialog";
import CourseDetailsTable from "./CourseDetailsTable";

const CourseAdditionSection = ({
  addedCourses,
  setAddedCourses,
  schoolNames,
}) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  return (
    <Box>
      <Box className="edit-course-header">
        <Typography variant="h6">
          Added {addedCourses?.length} Courses
        </Typography>
        <Button
          onClick={() => setOpenEditDialog(true)}
          endIcon={<Add />}
          variant="contained"
          color="info"
        >
          Add Course
        </Button>
      </Box>

      {addedCourses?.length > 0 && (
        <Box sx={{ my: 2.5 }}>
          <CourseDetailsTable
            addedCourses={addedCourses}
            setAddedCourses={setAddedCourses}
            schoolNames={schoolNames}
          />
        </Box>
      )}
      {openEditDialog && (
        <CourseEditDialog
          open={openEditDialog}
          setOpen={setOpenEditDialog}
          schoolNames={schoolNames}
          setAddedCourses={setAddedCourses}
          addedCourses={addedCourses}
        />
      )}
    </Box>
  );
};

export default CourseAdditionSection;
