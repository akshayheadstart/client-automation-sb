/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
// import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import { interviewStudentProfilePhoto } from "../../../images/interviewAmajonS3Url";
const PanelistStudentInfoCard = ({info,dataSet}) => {
  return (
    <>
      <Box
        sx={{
          p: "16px",
          position: "relative",
        }}
      >
        <Box className="profile-photo-container-panelist">
          <Box
            sx={{
              position: "absolute",
              mt: 12,
              borderRadius: 10,
            }}
          >
            <img
              src={info?.attachments?.recent_photo? info?.attachments?.recent_photo:
                interviewStudentProfilePhoto}
              alt="Profile Photo"
              style={{
                borderRadius: "40px",
                width: "100px",
                height: "100px",
              }}
              // className="profile-photo-design"
            />
          </Box>
          <CheckCircleIcon className="checkCircleIcon" sx={{ mt: 21, ml: 9 }} />
        </Box>
        <Box sx={{ mt: 6 }} className="student-info-container">
          <Box
            sx={{
              display: "grid",
              placeItems: "end",
              pr: 1,
              pt: 1,
            }}
          >
            {/* <FileDownloadOutlinedIcon sx={{ cursor: "pointer" }} /> */}
          </Box>
          <Typography sx={{ mt: 5 }} className="student-name-data-container">
            <Typography sx={{ fontSize: "22px", fontWeight: 800 }}>
              {info?.name}
            </Typography>
          </Typography>
          <Typography sx={{ fontSize: "12px" ,paddingX:'5px'}}>
            Applied For: {dataSet?.course_Name} in {dataSet?.specialization_name}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
          UG Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px" }}>
              Program Name : {info?.ug_info?.program_name? info?.ug_info?.program_name:'N/A'}
            </Typography>
            {/* <ArticleOutlinedIcon sx={{ color: "#008CE0", cursor: "pointer" }} /> */}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            College Name : {info?.ug_info?.college_name?info?.ug_info?.college_name :'N/A'}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>Year : {info?.ug_info?.year? info?.ug_info?.year :'N/A'}</Typography>
            <Typography sx={{ fontSize: "12px" }}>Marks : {info?.ug_info?.marks? info?.ug_info?.marks:'0'}%</Typography>
          </Typography>
        </Card>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
          12th Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px" }}>Board : {info?.inter_info.board? info?.inter_info.board:'N/A'}</Typography>
            {/* <ArticleOutlinedIcon sx={{ color: "#008CE0", cursor: "pointer" }} /> */}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            School Name : {info?.inter_info?.school_name? info?.inter_info?.school_name :'N/A'}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>Year : {info?.inter_info.year?info?.inter_info.year :'N/A'}</Typography>
            <Typography sx={{ fontSize: "12px" }}>Marks : {info?.inter_info?.marks? info?.inter_info?.marks:'0'}%</Typography>
          </Typography>
        </Card>
      </Box>
      <Box sx={{ p: 2, position: "relative" }}>
        <Typography
          sx={{
            mt: -1.5,
            ml: 1,
          }}
          className="UG-text"
        >
          10th Details
        </Typography>
        <Card className="ug-card-container">
          <Typography className="ug-text-flex">
            <Typography sx={{ fontSize: "12px" }}>Board : {info?.tenth_info?.board? info?.tenth_info?.board:'N/A'}</Typography>
            {/* <ArticleOutlinedIcon sx={{ color: "#008CE0", cursor: "pointer" }} /> */}
          </Typography>
          <Typography sx={{ fontSize: "12px" }}>
            School Name : {info?.tenth_info?.school_name? info?.tenth_info?.school_name:'N/A'}
          </Typography>
          <Typography className="ug-year-marks-container">
            <Typography sx={{ fontSize: "12px" }}>Year : {info?.tenth_info?.year?info?.tenth_info?.year:'N/A'}</Typography>
            <Typography sx={{ fontSize: "12px" }}>Marks : {info?.tenth_info?.marks? info?.tenth_info?.marks:'0'}%</Typography>
          </Typography>
        </Card>
      </Box>
    </>
  );
};

export default PanelistStudentInfoCard;
