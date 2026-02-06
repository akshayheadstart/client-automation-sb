/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/img-redundant-alt */

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { TabList } from "@mui/lab";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { Box, Button, Card, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Grid from "@mui/system/Unstable_Grid/Grid";
import React, { useContext, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSelector } from "react-redux";
import { useInterviewStudentMarkSubmitMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { calculateOverallRating } from "../../../helperFunctions/calendarHelperfunction";
import useToasterHook from "../../../hooks/useToasterHook";
import interviewStudentProfile from "../../../images/interviewProfile.png";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/PanellistDesignPage.css";
import "../../../styles/ZoomPage.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import PanelistDialog from "../../PanelistDialog/PanelistDialog";
import StudentProfileReviewDialog from "../../StudentProfileReviewDialog/StudentProfileReviewDialog";
import SubmitStudentMarks from "../SubmitStudentMarks/SubmitStudentMarks";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const ZoomPage = ({ role, dataToStudentLength, dataSet, slotId }) => {
  const [open, setOpen] = React.useState(false);

  const data = ["Shortlisted", "Rejected", "Selected", "Hold"].map((item) => ({
    label: item,
    value: item,
  }));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [scores, setScores] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(
    dataSet?.student_profile[0]?.applicationId
  );
  const [findIndexInfo, setFindIndexInfo] = useState(
    dataSet?.student_profile[0]
  );
  const [photoDynamicWH, setPhotoDynamicWH] = useState();
  const handleClick = (inx, applicationId) => {
    setPhotoDynamicWH(inx);
    setSelectedApplicationId(applicationId);
    const findIndexData = dataSet.student_profile.find(
      (student) => student.applicationId === inx
    );
    setFindIndexInfo(findIndexData);
  };

  const [defaultPhoto, setDefaultPhoto] = useState(false);
  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const studentMarks = {
    scores: scores,
    status: status,
    comments: remarks,
    overall_rating: calculateOverallRating(scores, dataSet),
  };
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [somethingWentWrongInSubmitMarks, setSomethingWentWrongInSubmitMarks] =
    useState(false);
  const [submitMarksInternalServerError, setSubmitMarksInternalServerError] =
    useState(false);
  const handleScoresUpdate = () => {
    const updatedSkills = dataSet?.marking_scheme?.map((skill) => ({
      name: skill.name,
      point: 0.5,
    }));
    return setScores(updatedSkills);
  };
  //Submit particular student Marks API Setup
  const [submitLoading, setSubmitLoading] = useState(false);
  const [interViewStudentMarks] = useInterviewStudentMarkSubmitMutation();
  const handleMarksSubmit = () => {
    setSubmitLoading(true);
    interViewStudentMarks({
      selectedApplicationId: selectedApplicationId,
      slotId: slotId,
      collegeId: collegeId,
      studentMarks: studentMarks,
    })
      .unwrap()
      .then((res) => {
        try {
          if (res?.message) {
            if (typeof res?.message === "string") {
              pushNotification("success", "Successfully Submit Marks");
              setRemarks("");
              setStatus("");
              handleScoresUpdate();
            } else {
              throw new Error("update Status API response changed");
            }
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInSubmitMarks,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setSubmitMarksInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        handleClose();
        setSubmitLoading(false);
      });
  };
  useEffect(() => {
    const updatedSkills = dataSet?.marking_scheme?.map((skill) => ({
      name: skill.name,
      point: 0,
    }));
    return setScores(updatedSkills);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet]);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileName, setFileName] = useState(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const handleClickViewOpen = () => {
    setViewOpen(true);
  };

  const handleViewClose = () => {
    setViewOpen(false);
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const handleButtonClick = (url, file) => {
    setFileUrl(url);
    setFileName(file);
    handleClickViewOpen();
  };
  const fileFormat = ["jpg", "jpeg", "png", "gif"];
  
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }
  const renderFile = () => {
    const getFileExtensionData = getFileExtension(fileName);

    if (fileName) {
      if (getFileExtensionData === "pdf") {
        return (
          <div>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            {
              numPages &&
            <Box className='zoom-page-pdf-box'>
            <Typography>
              Page {pageNumber} of {numPages}
            </Typography>
            <Box className='zoom-page-pdf-box-button'
              >
                <Button
                  data-testid="button-back-items"
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 20,
                    fontSize: 13,
                  }}
                  onClick={() => changePage(-1)}
                  size="small"
                  color="info"
                  variant="outlined"
                  startIcon={
                    <ArrowBackIosNewOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                  disabled={pageNumber <= 1}
                >
                </Button>
                <Button
                  sx={{
                    boxShadow: "0 5px 5px #3c3c3c42",
                    backgroundColor: "white",
                    borderRadius: 50,
                    height: 20,
                    fontSize: 13,
                  }}
                  onClick={() => {
                    changePage(1)
                  }}
                  size="small"
                  color="info"
                  variant="outlined"
                  endIcon={
                    <ArrowForwardIosOutlinedIcon
                      sx={{ height: 15, mb: "1px" }}
                    />
                  }
                  disabled={
                    pageNumber >= numPages
                  }
                >
                </Button>
              </Box>
            </Box>
            }
          </div>
        );
      } else if (fileFormat?.includes(getFileExtensionData)) {
        return <img src={fileUrl} alt="Image" width="100%" height="400px" />;
      } else {
        return (
          <img src={fileUrl} alt="Image" width="100%" height="400px" />
        );
      }
    }
    return null;
  };
  function getFileExtension(url) {
    const lastDotIndex = url.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      const fileExtension = url.substring(lastDotIndex);
      return fileExtension?.slice(1,4).toLowerCase();
    }
    return null;
  }
  return (
    <>
      <Box sx={{ p: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card
              className="zoom-card-container"
              sx={{ height: "100%", maxwidth: "700px", bgcolor: "#B9D4EA" }}
            >
              <iframe
                className="responsive-iframe"
                allow="camera; microphone"
                src={dataSet?.join_link}
              ></iframe>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            {dataSet?.student_profile?.length > 1 ? (
              <Card
                sx={{
                  maxWidth: 650,
                  border: "1px solid #A8C9E5",
                  borderRadius: "13px",
                }}
              >
                <TabContext value={value}>
                  <Box sx={{ display: "grid", placeItems: "center" }}>
                    <TabList
                      onChange={handleChange}
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="primary tabs example"
                    >
                      <Tab label="Profile" value="1" />
                      <Tab label="Marking" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel sx={{ p: 0 }} value="1">
                    <Box
                      sx={{
                        p: "16px",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          mt: 1,
                          borderRadius: 10,
                        }}
                      >
                        <Box sx={{ display: "flex"}}
                        className={dataSet?.student_profile.length>5?'zoom-page-student-profile-photo-container':''}
                        >
                          {dataSet?.student_profile
                            ?.slice(0, 1)
                            .map((photo, inx) => {
                              return (
                                <img
                                  onClick={() =>
                                    handleClick(
                                      photo.applicationId,
                                      photo.applicationId
                                    )
                                  }
                                  src={photo?.attachments?.recent_photo? photo?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    width: `${
                                      !defaultPhoto
                                        ? "70px"
                                        : `${
                                            photo.applicationId ===
                                            photoDynamicWH
                                              ? "70px"
                                              : "50px"
                                          }`
                                    }`,
                                    height: `${
                                      !defaultPhoto
                                        ? "70px"
                                        : `${
                                            photo.applicationId ===
                                            photoDynamicWH
                                              ? "70px"
                                              : "50px"
                                          }`
                                    }`,
                                    display: "flex",
                                  }}
                                />
                              );
                            })}

                          {dataSet?.student_profile
                            ?.slice(1)
                            .map((photo, inx) => {
                              return (
                                <img
                                  onClick={() => {
                                    handleClick(
                                      photo.applicationId,
                                      photo.applicationId
                                    );
                                    setDefaultPhoto(true);
                                  }}
                                  src={photo?.attachments?.recent_photo? photo?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    width: `${
                                      photo.applicationId === photoDynamicWH
                                        ? "70px"
                                        : "50px"
                                    }`,
                                    height: `${
                                      photo.applicationId === photoDynamicWH
                                        ? "70px"
                                        : "50px"
                                    }`,
                                  }}
                                />
                              );
                            })}
                        </Box>
                      </Box>
                      <Box sx={{ mt: 7 }} className="student-info-container">
                        <Box
                          sx={{
                            display: "grid",
                            placeItems: "end",
                            pr: 1,
                            pt: 1,
                          }}
                        ></Box>
                        <Typography
                          sx={{ mt: 5 }}
                          className="zoom-page-info-data-container-many-student"
                        >
                          <Typography
                            sx={{ fontSize: "22px", fontWeight: 800, mt: 5 }}
                          >
                            {findIndexInfo?.name}
                          </Typography>
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }}>
                          Applied For: {dataSet?.course_Name} in{" "}
                          {dataSet?.specialization_name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 2, position: "relative" }}>
                      <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
                        UG Details
                      </Typography>
                      <Card className="ug-card-container">
                        <Typography className="ug-text-flex">
                          <Typography sx={{ fontSize: "12px", mt: 1 }}>
                            Program Name :{" "}
                            {findIndexInfo?.ug_info?.program_name
                              ? findIndexInfo?.ug_info?.program_name
                              : "N/A"}
                          </Typography>
                          {findIndexInfo?.attachments?.grad_url ? (
                            <VisibilityOutlinedIcon
                              onClick={() => {
                                handleClickViewOpen();
                                handleButtonClick(
                                  findIndexInfo.attachments?.grad_url,
                                  findIndexInfo.attachments?.grad_url
                                );
                              }}
                              sx={{ color: "#008BE2", cursor: "pointer" }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{
                                color: "gray",
                                cursor: "not-allowed",
                                opacity: "75%",
                              }}
                            />
                          )}
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }}>
                          College Name :{" "}
                          {findIndexInfo?.ug_info?.college_name
                            ? findIndexInfo?.ug_info?.college_name
                            : "N/A"}
                        </Typography>
                        <Typography className="ug-year-marks-container">
                          <Typography sx={{ fontSize: "12px" }}>
                            Year :{" "}
                            {findIndexInfo?.ug_info?.year
                              ? findIndexInfo?.ug_info?.year
                              : "N/A"}
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }}>
                            Marks :{" "}
                            {findIndexInfo?.ug_info?.marks
                              ? findIndexInfo?.ug_info?.marks
                              : "0"}
                            %
                          </Typography>
                        </Typography>
                      </Card>
                    </Box>
                    <Box sx={{ p: 2, position: "relative" }}>
                      <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
                        12th Details
                      </Typography>
                      <Card className="ug-card-container">
                        <Typography className="zoom-page-text-data">
                          <Typography sx={{ fontSize: "12px" }}>
                            Board :{" "}
                            {findIndexInfo?.inter_info.board
                              ? findIndexInfo?.inter_info.board
                              : "N/A"}
                          </Typography>
                          {findIndexInfo?.attachments?.twelth_url ? (
                            <VisibilityOutlinedIcon
                              onClick={() => {
                                handleClickViewOpen();
                                handleButtonClick(
                                  findIndexInfo.attachments?.twelth_url,
                                  findIndexInfo.attachments?.twelth_url
                                );
                              }}
                              sx={{ color: "#008BE2", cursor: "pointer" }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{
                                color: "gray",
                                cursor: "not-allowed",
                                opacity: "75%",
                              }}
                            />
                          )}
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }}>
                          School Name :{" "}
                          {findIndexInfo?.inter_info?.school_name
                            ? findIndexInfo?.inter_info?.school_name
                            : "N/A"}
                        </Typography>
                        <Typography className="ug-year-marks-container">
                          <Typography sx={{ fontSize: "12px" }}>
                            Year :{" "}
                            {findIndexInfo?.inter_info.year
                              ? findIndexInfo?.inter_info.year
                              : "N/A"}
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }}>
                            Marks :{" "}
                            {findIndexInfo?.inter_info?.marks
                              ? findIndexInfo?.inter_info?.marks
                              : "0"}
                            %
                          </Typography>
                        </Typography>
                      </Card>
                    </Box>
                    <Box sx={{ p: 2, position: "relative" }}>
                      <Typography sx={{ mt: -1.5, ml: 1 }} className="UG-text">
                        10th Details
                      </Typography>
                      <Card className="ug-card-container">
                        <Typography className="ug-text-flex">
                          <Typography sx={{ fontSize: "12px", mt: 1 }}>
                            Board :{" "}
                            {findIndexInfo?.tenth_info?.board
                              ? findIndexInfo?.tenth_info?.board
                              : "N/A"}
                          </Typography>
                          {findIndexInfo?.attachments?.tenth_url ? (
                            <VisibilityOutlinedIcon
                              onClick={() => {
                                // handleClickOpen();
                                handleButtonClick(
                                  findIndexInfo.attachments?.tenth_url,
                                  findIndexInfo.attachments?.tenth_url
                                );
                              }}
                              sx={{ color: "#008BE2", cursor: "pointer" }}
                            />
                          ) : (
                            <VisibilityOutlinedIcon
                              sx={{
                                color: "gray",
                                cursor: "not-allowed",
                                opacity: "75%",
                              }}
                            />
                          )}
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }}>
                          School Name :{" "}
                          {findIndexInfo?.tenth_info?.school_name
                            ? findIndexInfo?.tenth_info?.school_name
                            : "N/A"}
                        </Typography>
                        <Typography className="ug-year-marks-container">
                          <Typography sx={{ fontSize: "12px" }}>
                            Year :{" "}
                            {findIndexInfo?.tenth_info?.year
                              ? findIndexInfo?.tenth_info?.year
                              : "N/A"}
                          </Typography>
                          <Typography sx={{ fontSize: "12px" }}>
                            Marks :{" "}
                            {findIndexInfo?.tenth_info?.marks
                              ? findIndexInfo?.tenth_info?.marks
                              : "0"}
                            %
                          </Typography>
                        </Typography>
                      </Card>
                    </Box>
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value="2">
                    <Box
                      sx={{
                        p: "16px",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          mt: 1,
                          borderRadius: 10,
                        }}
                      >
                        <Box className={dataSet?.student_profile.length>5?'zoom-page-student-profile-photo-container':''} sx={{ display: "flex" }}>
                          {dataSet?.student_profile
                            ?.slice(0, 1)
                            .map((photo, inx) => {
                              return (
                                <img
                                  onClick={() => {
                                    handleClick(
                                      photo.applicationId,
                                      photo.applicationId
                                    );
                                  }}
                                  src={photo?.attachments?.recent_photo? photo?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    width: `${
                                      !defaultPhoto
                                        ? "70px"
                                        : `${
                                            photo.applicationId ===
                                            photoDynamicWH
                                              ? "70px"
                                              : "50px"
                                          }`
                                    }`,
                                    height: `${
                                      !defaultPhoto
                                        ? "70px"
                                        : `${
                                            photo.applicationId ===
                                            photoDynamicWH
                                              ? "70px"
                                              : "50px"
                                          }`
                                    }`,
                                    display: "flex",
                                  }}
                                />
                              );
                            })}

                          {dataSet?.student_profile
                            ?.slice(1)
                            .map((photo, inx) => {
                              return (
                                <img
                                  onClick={() => {
                                    handleClick(
                                      photo.applicationId,
                                      photo.applicationId
                                    );
                                    setDefaultPhoto(true);
                                  }}
                                  src={photo?.attachments?.recent_photo? photo?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    width: `${
                                      photo.applicationId === photoDynamicWH
                                        ? "70px"
                                        : "50px"
                                    }`,
                                    height: `${
                                      photo.applicationId === photoDynamicWH
                                        ? "70px"
                                        : "50px"
                                    }`,
                                  }}
                                />
                              );
                            })}
                        </Box>
                      </Box>
                      <Box sx={{ mt: 7 }} className="student-info-container">
                        <Box
                          sx={{
                            display: "grid",
                            placeItems: "end",
                            pr: 1,
                            pt: 1,
                          }}
                        ></Box>
                        <Typography
                          sx={{ mt: 1 }}
                          className="zoom-page-info-data-container"
                        >
                          <Typography
                            sx={{ fontSize: "22px", fontWeight: 800, mt: 5 }}
                          >
                            {findIndexInfo?.name}
                          </Typography>
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }}>
                          Applied For: {dataSet?.course_Name} in{" "}
                          {dataSet?.specialization_name}
                        </Typography>
                      </Box>
                    </Box>
                    <SubmitStudentMarks
                      data={data}
                      setStatus={setStatus}
                      setRemarks={setRemarks}
                      scores={scores}
                      setScores={setScores}
                      remarks={remarks}
                      marking_scheme={dataSet?.marking_scheme}
                      status={status}
                    ></SubmitStudentMarks>

                    <Box
                      sx={{ p: 2 }}
                      className="zoom-page-submit-button-container"
                    >
                      <Button
                        onClick={() => handleClickOpen()}
                        variant="contained"
                        size="small"
                        color="info"
                        sx={{ borderRadius: 50, paddingX: 6, color: "white" }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </TabPanel>
                </TabContext>
              </Card>
            ) : (
              <Card
                // className="card-container"
                sx={{
                  maxWidth: 650,
                  border: "1px solid #A8C9E5",
                  borderRadius: "13px",
                }}
              >
                <TabContext value={value}>
                  <Box sx={{ display: "grid", placeItems: "center" }}>
                    <TabList
                      onChange={handleChange}
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="primary tabs example"
                    >
                      <Tab label="Profile" value="1" />
                      <Tab label="Marking" value="2" />
                    </TabList>
                  </Box>
                  <TabPanel sx={{ p: 0 }} value="1">
                    {dataSet?.student_profile?.map((student) => {
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
                                  src={student?.attachments?.recent_photo? student?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "20px",
                                    width: "100px",
                                    height: "100px",
                                  }}
                                  // className="profile-photo-design"
                                />
                              </Box>
                              <CheckCircleIcon
                                className="checkCircleIcon"
                                sx={{ mt: 21, ml: 9 }}
                              />
                            </Box>
                            <Box
                              sx={{ mt: 6 }}
                              className="student-info-container"
                            >
                              <Box
                                sx={{
                                  display: "grid",
                                  placeItems: "end",
                                  pr: 1,
                                  pt: 1,
                                }}
                              ></Box>
                              <Typography
                                sx={{ mt: 7 }}
                                className="zoom-page-info-data-container"
                              >
                                <Typography
                                  sx={{ fontSize: "22px", fontWeight: 800 }}
                                >
                                  {student.name}
                                </Typography>
                              </Typography>
                              <Typography sx={{ fontSize: "12px" }}>
                                Applied For: {dataSet.course_Name}{" "}
                                {dataSet.specialization_name}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ p: 2, position: "relative" }}>
                            <Typography
                              sx={{ mt: -1.5, ml: 1 }}
                              className="UG-text"
                            >
                              UG Details
                            </Typography>
                            <Card className="ug-card-container">
                              <Typography className="ug-text-flex">
                                <Typography sx={{ fontSize: "12px", mt: 1 }}>
                                  Program Name :{" "}
                                  {student?.ug_info?.program_name
                                    ? student?.ug_info?.program_name
                                    : "N/A"}
                                </Typography>
                                {student?.attachments?.grad_url ? (
                                  <VisibilityOutlinedIcon
                                    onClick={() => {
                                      handleClickViewOpen();
                                      handleButtonClick(
                                        student?.attachments?.grad_url,
                                        student?.attachments?.grad_url
                                      );
                                    }}
                                    sx={{ color: "#008BE2", cursor: "pointer" }}
                                  />
                                ) : (
                                  <VisibilityOutlinedIcon
                                    sx={{
                                      color: "gray",
                                      cursor: "not-allowed",
                                      opacity: "75%",
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography sx={{ fontSize: "12px" }}>
                                College Name :{" "}
                                {student?.ug_info?.college_name
                                  ? student?.ug_info?.college_name
                                  : "N/A"}
                              </Typography>
                              <Typography className="ug-year-marks-container">
                                <Typography sx={{ fontSize: "12px" }}>
                                  Year :{" "}
                                  {student?.ug_info?.year
                                    ? student?.ug_info?.year
                                    : "N/A"}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }}>
                                  Marks :{" "}
                                  {student?.ug_info?.marks
                                    ? student?.ug_info?.marks
                                    : "0"}
                                  %
                                </Typography>
                              </Typography>
                            </Card>
                          </Box>
                          <Box sx={{ p: 2, position: "relative" }}>
                            <Typography
                              sx={{ mt: -1.5, ml: 1 }}
                              className="UG-text"
                            >
                              12th Details
                            </Typography>
                            <Card className="ug-card-container">
                              <Typography className="zoom-page-text-data">
                                <Typography sx={{ fontSize: "12px" }}>
                                  Board :{" "}
                                  {student?.inter_info?.board
                                    ? student?.inter_info.board
                                    : "N/A"}
                                </Typography>
                                {student?.attachments?.twelth_url ? (
                                  <VisibilityOutlinedIcon
                                    onClick={() => {
                                      handleClickViewOpen();
                                      handleButtonClick(
                                        student?.attachments?.twelth_url,
                                        student?.attachments?.twelth_url
                                      );
                                    }}
                                    sx={{ color: "#008BE2", cursor: "pointer" }}
                                  />
                                ) : (
                                  <VisibilityOutlinedIcon
                                    sx={{
                                      color: "gray",
                                      cursor: "not-allowed",
                                      opacity: "75%",
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography sx={{ fontSize: "12px" }}>
                                School Name :{" "}
                                {student?.inter_info?.school_name
                                  ? student?.inter_info?.school_name
                                  : "N/A"}
                              </Typography>
                              <Typography className="ug-year-marks-container">
                                <Typography sx={{ fontSize: "12px" }}>
                                  Year :{" "}
                                  {student?.inter_info?.year
                                    ? student?.inter_info.year
                                    : "N/A"}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }}>
                                  Marks :{" "}
                                  {student?.inter_info?.marks
                                    ? student?.inter_info?.marks
                                    : "0"}
                                  %
                                </Typography>
                              </Typography>
                            </Card>
                          </Box>
                          <Box sx={{ p: 2, position: "relative" }}>
                            <Typography
                              sx={{ mt: -1.5, ml: 1 }}
                              className="UG-text"
                            >
                              10th Details
                            </Typography>
                            <Card className="ug-card-container">
                              <Typography className="ug-text-flex">
                                <Typography sx={{ fontSize: "12px", mt: 1 }}>
                                  Board :{" "}
                                  {student?.tenth_info?.board
                                    ? student?.tenth_info?.board
                                    : "N/A"}
                                </Typography>
                                {student?.attachments?.tenth_url ? (
                                  <VisibilityOutlinedIcon
                                    onClick={() => {
                                      handleClickViewOpen();
                                      handleButtonClick(
                                        student?.attachments?.tenth_url,
                                        student?.attachments?.tenth_url
                                      );
                                    }}
                                    sx={{ color: "#008BE2", cursor: "pointer" }}
                                  />
                                ) : (
                                  <VisibilityOutlinedIcon
                                    sx={{
                                      color: "gray",
                                      cursor: "not-allowed",
                                      opacity: "75%",
                                    }}
                                  />
                                )}
                              </Typography>
                              <Typography sx={{ fontSize: "12px" }}>
                                School Name :{" "}
                                {student?.tenth_info?.school_name
                                  ? student?.tenth_info?.school_name
                                  : "N/A"}
                              </Typography>
                              <Typography className="ug-year-marks-container">
                                <Typography sx={{ fontSize: "12px" }}>
                                  Year :{" "}
                                  {student?.tenth_info?.year
                                    ? student?.tenth_info?.year
                                    : "N/A"}
                                </Typography>
                                <Typography sx={{ fontSize: "12px" }}>
                                  Marks :{" "}
                                  {student?.tenth_info?.marks
                                    ? student?.tenth_info?.marks
                                    : "0"}
                                  %
                                </Typography>
                              </Typography>
                            </Card>
                          </Box>
                        </>
                      );
                    })}
                  </TabPanel>
                  <TabPanel sx={{ p: 0 }} value="2">
                    {dataSet?.student_profile?.map((student) => {
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
                                  src={student?.attachments?.recent_photo? student?.attachments?.recent_photo:
                                    interviewStudentProfile}
                                  alt="Profile Photo"
                                  style={{
                                    borderRadius: "40px",
                                    width: "100px",
                                    height: "100px",
                                  }}
                                  // className="profile-photo-design"
                                />
                              </Box>
                              <CheckCircleIcon
                                className="checkCircleIcon"
                                sx={{ mt: 21, ml: 9 }}
                              />
                            </Box>
                            <Box
                              sx={{ mt: 6 }}
                              className="student-info-container"
                            >
                              <Box
                                sx={{
                                  display: "grid",
                                  placeItems: "end",
                                  pr: 1,
                                  pt: 1,
                                }}
                              ></Box>
                              <Typography
                                sx={{ mt: 7 }}
                                className="zoom-page-info-data-container"
                              >
                                <Typography
                                  sx={{ fontSize: "22px", fontWeight: 800 }}
                                >
                                  {student.name}
                                </Typography>
                              </Typography>
                              <Typography sx={{ fontSize: "12px" }}>
                                Applied For: {dataSet?.course_Name}{" "}
                                {dataSet?.specialization_name}
                              </Typography>
                            </Box>
                          </Box>
                          <SubmitStudentMarks
                            data={data}
                            setStatus={setStatus}
                            setRemarks={setRemarks}
                            remarks={remarks}
                            scores={scores}
                            setScores={setScores}
                            w_value={student.w_value}
                            marking_scheme={dataSet?.marking_scheme}
                            status={status}
                          ></SubmitStudentMarks>

                          <Box
                            sx={{ p: 2 }}
                            className="zoom-page-submit-button-container"
                          >
                            <Button
                              onClick={() => {
                                handleClickOpen();
                                setSelectedApplicationId(
                                  student?.applicationId
                                );
                              }}
                              variant="contained"
                              size="small"
                              color="info"
                              sx={{
                                borderRadius: 50,
                                paddingX: 6,
                                color: "white",
                              }}
                            >
                              Submit
                            </Button>
                          </Box>
                        </>
                      );
                    })}
                  </TabPanel>
                </TabContext>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
      {open && (
        <PanelistDialog
          open={open}
          handleClose={handleClose}
          scores={scores}
          // setStudentInfo={setStudentInfo}
          dataSet={dataSet}
          status={status}
          submitMarksInternalServerError={submitMarksInternalServerError}
          somethingWentWrongInSubmitMarks={somethingWentWrongInSubmitMarks}
          handleMarksSubmit={handleMarksSubmit}
          apiResponseChangeMessage={apiResponseChangeMessage}
          loading={submitLoading}
          findIndexInfo={findIndexInfo}
        ></PanelistDialog>
      )}
      {viewOpen && (
        <StudentProfileReviewDialog
          open={viewOpen}
          handleClose={handleViewClose}
          renderFile={renderFile}
          setFileUrl={setFileUrl}
          setFileName={setFileName}
          setNumPages={setNumPages}
          setPageNumber={setPageNumber}
        ></StudentProfileReviewDialog>
      )}
    </>
  );
};

export default ZoomPage;
