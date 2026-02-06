import React from "react";
import {
  ListItemText,
  ListItemButton,
  List,
  ListItem,
  IconButton,
  Box,
  Typography,
  Skeleton,
} from "@mui/material";
import EditIcon from "../../icons/edit-icon.svg";
import AddIcon from "@mui/icons-material/Add";

import "../../styles/ManageCourses.css";

const CourseList = ({
  courses = [],
  handleEditCourse = () => {},
  handleCourseClick = () => {},
  handleAddCourseClick = () => {},
  selectedCourse = "",
  loading,
}) => {
  return (
    <List>
      {courses.map((item) =>
        loading ? (
          <Skeleton variant="rectangular" className="course-item-skeleton" />
        ) : (
          <ListItem
            secondaryAction={
              <Box className="center-align-items">
                <IconButton
                  onClick={() => handleEditCourse(item)}
                  className="edit-btn"
                >
                  <img src={EditIcon} alt="edit specialization" />
                </IconButton>
                <Box className="specialization-count-circle">
                  <Typography
                    className="specialization-count-text"
                    variant="span"
                  >
                    {item.course_specialization
                      ? item.course_specialization.length
                      : 0}
                  </Typography>
                </Box>
              </Box>
            }
            key={item._id}
            className={`course-item ${
              selectedCourse === item._id ? "selected" : ""
            } ${item.is_activated ? '' : 'inactivated'}`}
          >
            <ListItemButton
              className="list-btn"
              onClick={() => handleCourseClick(item)}
            >
              <ListItemText primary={item.course_name} />
            </ListItemButton>
          </ListItem>
        )
      )}

      {loading ? (
        <Skeleton variant="rectangular" className="course-item-skeleton" />
      ) : (
        <ListItem key={"add_course"} className={`course-item add-course-item`}>
          <ListItemButton onClick={() => handleAddCourseClick()}>
            <ListItemText
              className="add-btn"
              primary={
                <Box className="center-align-items add-course-text">
                  Add Course <AddIcon className="add-icon" />
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      )}
    </List>
  );
};

export default CourseList;
