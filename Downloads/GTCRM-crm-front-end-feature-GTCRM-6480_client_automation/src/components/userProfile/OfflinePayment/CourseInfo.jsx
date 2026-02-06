import { Box, Typography } from '@mui/material';
import React from 'react';
import courseFeeIcon from "../../../images/course-fee-icon.svg";
import courseNameIcon from "../../../images/course-name-icon.svg";
import applicationIcon from "../../../images/application-icon.svg";
const CourseInfo = ({studentInfoDetails}) => {
    return (
        <>
            <Box
                className={ "course-info-new-design"}
            >
                    <img src={courseNameIcon} alt="course name icon" />
          
                <Typography variant="body2">Course Name :</Typography>
                <Typography
                    variant="caption"
                    // className={from === "dashboard" && "course-info-list"}
                >
                    {studentInfoDetails?.courseName?.toUpperCase()}
                </Typography>
            </Box>
            <Box
                className={ "course-info-new-design"}
            >
                    <img src={courseFeeIcon} alt="course fee icon" />
                <Typography variant="body2">Course Fees :</Typography>
                <Typography className="discount-box-container">
                    <Typography
                        variant="caption"
                        className={"course-info-list"}
                    >
                        {studentInfoDetails?.amount?studentInfoDetails?.amount:"---"}
                    </Typography>
                </Typography>
            </Box>
            <Box
                className={ "course-info-new-design"}
            >
                    <img src={applicationIcon} alt="application icon" />
                <Typography variant="body2">
                    Application Id :{" "}
                  
                </Typography>
                <Typography
                    variant="caption"
                    className={"course-info-list"}
                >
                    {studentInfoDetails?.customApplicationId || "- -"}
                </Typography>
            </Box>
        </>
    );
};

export default CourseInfo;