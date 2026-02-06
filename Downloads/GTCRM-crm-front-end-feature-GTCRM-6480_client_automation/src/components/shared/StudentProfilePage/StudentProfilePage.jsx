/* eslint-disable jsx-a11y/img-redundant-alt */
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, Card, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Input, SelectPicker } from "rsuite";
import { interViewStudentProfileUpdateStatus } from "../../../constants/LeadStageList";
import "../../../styles/StudentProfilePageDesign.css";
import StudentProfileReviewDialog from "../../StudentProfileReviewDialog/StudentProfileReviewDialog";
import StudentProfileDataTable from "../StudentProfileDataTable/StudentProfileDataTable";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import photoProfile from "../../../images/profilePhotoIcon.png";
import { useSelector } from "react-redux";
//Student profile for MOD
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const StudentProfilePage = ({
  role,
  handleUpdateStatus,
  studentInfoData,
  loading,
}) => {
  const [tabState, setTabState] = useState(1);
  const [fileUrl, setFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [fileName, setFileName] = useState(null);
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const handleButtonClick = (url, file) => {
    setFileUrl(url);
    setFileName(file);
    handleClickOpen();
  };
  const fileFormat = ["jpg", "jpeg", "png", "gif"];

  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };
  const renderFile = () => {
    const getFileExtensionData = getFileExtension(fileName);

    if (fileName) {
      if (getFileExtensionData === "pdf") {
        return (
          <div>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && (
              <Box className="student-profile-pdf-box">
                <Typography>
                  Page {pageNumber} of {numPages}
                </Typography>
                <Box className="student-profile-pdf-box-button">
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
                  ></Button>
                  <Button
                    sx={{
                      boxShadow: "0 5px 5px #3c3c3c42",
                      backgroundColor: "white",
                      borderRadius: 50,
                      height: 20,
                      fontSize: 13,
                    }}
                    onClick={() => {
                      changePage(1);
                    }}
                    size="small"
                    color="info"
                    variant="outlined"
                    endIcon={
                      <ArrowForwardIosOutlinedIcon
                        sx={{ height: 15, mb: "1px" }}
                      />
                    }
                    disabled={pageNumber >= numPages}
                  ></Button>
                </Box>
              </Box>
            )}
          </div>
        );
      } else if (fileFormat?.includes(getFileExtensionData)) {
        return <img src={fileUrl} alt="Image" width="100%" height="400px" />;
      } else {
        return <img src={fileUrl} alt="Image" width="100%" height="400px" />;
      }
    }
    return null;
  };
  function getFileExtension(url) {
    const lastDotIndex = url.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const fileExtension = url.substring(lastDotIndex);
      return fileExtension?.slice(1, 4).toLowerCase();
    }
    return null;
  }

  const gdOverAllRating = studentInfoData?.overall_rating?.gd;
  const gDtoFixedGd = gdOverAllRating?.toFixed(2);
  const piOverAllRating = studentInfoData?.overall_rating?.pi;
  const piToFixedGd = piOverAllRating?.toFixed(2);
  const tokenState = useSelector((state) => state.authentication.token);
  return (
    <>
      <Box sx={{ mt: 7 }}>
        <Box className="box-photo-data-container">
          <Box
            className="photo-box-container"
            sx={{ position: "absolute", mt: 15, borderRadius: 10 }}
          >
            <img
              src={
                studentInfoData?.attachments?.recent_photo
                  ? studentInfoData?.attachments?.recent_photo
                  : `${photoProfile}`
              }
              alt="Profile Photo"
              style={{ borderRadius: "40px", width: "150px", height: "150px" }}
              className="profile-photo-design"
            />
          </Box>
          <CheckCircleIcon
            className="checkCircleIcon"
            sx={{
              mt: 31,
              fontSize: 30,
              ml: 13,
            }}
          />
          {studentInfoData?.download_application && (
            <Typography
              className="download-application-text"
              onClick={() => {
                if (studentInfoData?.download_application) {
                  window.open(studentInfoData?.download_application);
                }
              }}
            >
              <Typography sx={{ color: "white" }}>
                Download Application
              </Typography>
              <FileDownloadOutlinedIcon sx={{ color: "white" }} />
            </Typography>
          )}
        </Box>
        <Box sx={{ m: 3, p: 4 }} className="profile-text-data-container">
          <Box className="student-name-text">
            <Typography sx={{ fontSize: "15px" }}>Student Name</Typography>
            <Typography sx={{ fontSize: "22px", fontWeight: 600 }}>
              {studentInfoData?.student_name}
            </Typography>
            {studentInfoData?.overall_rating && (
              <>
                {Object.keys(studentInfoData?.overall_rating).length === 1 && (
                  <>
                    {studentInfoData?.overall_rating?.gd >= 0 ? (
                      <Typography className="interview-scores">
                        {`${gDtoFixedGd}/10`}
                      </Typography>
                    ) : (
                      <Typography className="interview-scores">
                        {`${piToFixedGd}/10`}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
            {!studentInfoData?.overall_rating && (
              <>
                <Typography className="interview-scores">N/A</Typography>
              </>
            )}
            {studentInfoData?.overall_rating && (
              <>
                {Object.keys(studentInfoData?.overall_rating).length > 1 && (
                  <>
                    {tabState === 1 && (
                      <Typography className="interview-scores">
                        {studentInfoData?.overall_rating
                          ? `${gDtoFixedGd}/10`
                          : "N/A"}
                      </Typography>
                    )}
                    {tabState === 2 && (
                      <Typography className="interview-scores">
                        {studentInfoData?.overall_rating
                          ? `${piToFixedGd}/10`
                          : "N/A"}
                      </Typography>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
          <Box
            className="input-box-container-student-profile"
            sx={{ textAlign: "end" }}
          >
            <Box>
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    paddingBottom: "5px",
                  }}
                >
                  <CircularProgress value={30} color="info" />
                </Box>
              )}
              {tokenState?.scopes?.[0] === "college_super_admin" ||
              tokenState?.scopes?.[0] === "moderator" ? (
                <SelectPicker
                  data={interViewStudentProfileUpdateStatus}
                  searchable={false}
                  style={{ width: 215 }}
                  className="student-profile-Select-picker-box"
                  onChange={(event) => handleUpdateStatus(event)}
                  defaultValue={studentInfoData?.status}
                />
              ) : (
                ""
              )}
            </Box>
            <Typography className="program-level-text">
              <PhoneIcon />
              <Typography sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                <Typography
                  sx={{ fontSize: "13px", textDecoration: "underline" }}
                >
                  {studentInfoData?.phone_number
                    ? studentInfoData?.phone_number
                    : "0000000000"}
                </Typography>
              </Typography>
            </Typography>
            <Typography className="program-level-text">
              <ForwardToInboxOutlinedIcon />
              <Typography sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                <Typography
                  sx={{ fontSize: "13px", textDecoration: "underline" }}
                >
                  {studentInfoData?.email ? studentInfoData?.email : "N/A"}
                </Typography>
              </Typography>
            </Typography>
            <Typography className="program-level-text">
              <AddTaskOutlinedIcon />
              <Typography sx={{ display: "flex", alignItems: "end", gap: 1 }}>
                <Typography sx={{ fontSize: "13px" }}>
                  Programme Level: {studentInfoData?.programme_level}
                </Typography>
              </Typography>
            </Typography>
            <Typography className="student-course-container">
              <Typography
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography sx={{ fontSize: "13px" }}>
                  Course: {studentInfoData?.course}{" "}
                </Typography>
              </Typography>
            </Typography>
            {studentInfoData?.download_application && (
              <Typography
                className="download-application-small-screen"
                onClick={() => {
                  if (studentInfoData?.download_application) {
                    window.open(studentInfoData?.download_application);
                  }
                }}
              >
                <Typography sx={{ color: "white" }}>
                  Download Application
                </Typography>
                <FileDownloadOutlinedIcon sx={{ color: "white" }} />
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ m: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={4}>
            <Card className="card-maxWidth-container-info">
              <Box className="icon-container">
                <Box className="supportAgentIncon-box">
                  <SupportAgentIcon sx={{ color: "#008BE2" }} />
                </Box>
                {studentInfoData?.attachments?.grad_url ? (
                  <VisibilityOutlinedIcon
                    onClick={() => {
                      handleClickOpen();
                      handleButtonClick(
                        studentInfoData.attachments?.grad_url,
                        studentInfoData.attachments?.grad_url
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
              </Box>
              <Typography sx={{ color: "#088395", fontSize: "16px", mt: 1 }}>
                UG Details:
              </Typography>
              <Typography className="text-font-size">
                Program Name:{" "}
                {studentInfoData?.ug_info?.program_name
                  ? studentInfoData?.ug_info?.program_name
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                College Name:{" "}
                {studentInfoData?.ug_info?.college_name
                  ? studentInfoData?.ug_info?.college_name
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Year:{" "}
                {studentInfoData?.ug_info?.year
                  ? studentInfoData?.ug_info?.year
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Marks:{" "}
                {studentInfoData?.ug_info?.marks
                  ? studentInfoData?.ug_info?.marks
                  : "0"}
                %
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card className="card-maxWidth-container-info">
              <Box className="icon-container">
                <Box className="supportAgentIncon-box">
                  <SupportAgentIcon sx={{ color: "#008BE2" }} />
                </Box>
                {studentInfoData?.attachments?.twelth_url ? (
                  <VisibilityOutlinedIcon
                    onClick={() => {
                      handleClickOpen();
                      handleButtonClick(
                        studentInfoData?.attachments?.twelth_url,
                        studentInfoData?.attachments?.twelth_url
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
              </Box>
              <Typography sx={{ color: "#088395", fontSize: "16px", mt: 1 }}>
                12th Details:
              </Typography>
              <Typography className="text-font-size">
                Board:{" "}
                {studentInfoData?.inter_info?.board
                  ? studentInfoData?.inter_info?.board
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                School Name:{" "}
                {studentInfoData?.inter_info?.school_name
                  ? studentInfoData?.inter_info?.school_name
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Year:{" "}
                {studentInfoData?.inter_info?.year
                  ? studentInfoData?.inter_info?.year
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Marks:{" "}
                {studentInfoData?.inter_info?.marks
                  ? studentInfoData?.inter_info?.marks
                  : "0"}
                %
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card className="card-maxWidth-container-info">
              <Box className="icon-container">
                <Box className="supportAgentIncon-box">
                  <SupportAgentIcon sx={{ color: "#008BE2" }} />
                </Box>
                {studentInfoData?.attachments?.tenth_url ? (
                  <VisibilityOutlinedIcon
                    onClick={() => {
                      handleClickOpen();
                      handleButtonClick(
                        studentInfoData?.attachments?.tenth_url,
                        studentInfoData?.attachments?.tenth_url
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
              </Box>
              <Typography sx={{ color: "#088395", fontSize: "16px", mt: 1 }}>
                10th Details:
              </Typography>
              <Typography className="text-font-size">
                Board:{" "}
                {studentInfoData?.tenth_info?.board
                  ? studentInfoData?.tenth_info?.board
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                School Name:{" "}
                {studentInfoData?.tenth_info?.school_name
                  ? studentInfoData?.tenth_info?.school_name
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Year:{" "}
                {studentInfoData?.tenth_info?.year
                  ? studentInfoData?.tenth_info?.year
                  : "N/A"}
              </Typography>
              <Typography className="text-font-size">
                Marks:{" "}
                {studentInfoData?.tenth_info?.marks
                  ? studentInfoData?.tenth_info?.marks
                  : "0"}
                %
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ m: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Box className="student-profile-table-tab-design-right-side-right-item">
              {studentInfoData?.scores?.gd && studentInfoData?.scores?.pi && (
                <>
                  <Box
                    onClick={() => setTabState(1)}
                    className={
                      tabState === 1
                        ? "student-profile-left-Tab-design-active "
                        : "student-profile-left-Tab-design-inactive"
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: tabState === 1 ? "white" : "#bcbec0",
                      }}
                    >
                      GD Marking
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => setTabState(2)}
                    className={
                      tabState === 2
                        ? "student-profile-right-Tab-design-active"
                        : "student-profile-right-Tab-design-inactive"
                    }
                  >
                    <Typography
                      sx={{
                        fontSize: "15px",
                        fontWeight: 500,
                        color: tabState === 2 ? "white" : "#bcbec0",
                      }}
                    >
                      PI Marking
                    </Typography>
                  </Box>
                </>
              )}
              {studentInfoData?.scores && (
                <>
                  {Object.keys(studentInfoData?.scores).length === 1 && (
                    <>
                      <Box className="student-profile-left-Tab-design-active ">
                        <Typography
                          sx={{
                            fontSize: "15px",
                            fontWeight: 500,
                            color: "white",
                          }}
                        >
                          {studentInfoData?.scores?.gd
                            ? "GD Marking"
                            : "PI Marking"}
                        </Typography>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
            {studentInfoData?.scores?.gd && (
              <>
                {Object.keys(studentInfoData?.scores).length === 1 && (
                  <StudentProfileDataTable
                    data={studentInfoData?.scores?.gd}
                  ></StudentProfileDataTable>
                )}
              </>
            )}
            {studentInfoData?.scores?.pi && (
              <>
                {Object.keys(studentInfoData?.scores).length === 1 && (
                  <StudentProfileDataTable
                    data={studentInfoData?.scores.pi}
                  ></StudentProfileDataTable>
                )}
              </>
            )}
            {studentInfoData?.scores?.gd && studentInfoData?.scores?.pi && (
              <>
                {tabState === 1 && (
                  <StudentProfileDataTable
                    data={studentInfoData?.scores?.gd}
                  ></StudentProfileDataTable>
                )}
                {tabState === 2 && (
                  <StudentProfileDataTable
                    data={studentInfoData?.scores?.pi}
                  ></StudentProfileDataTable>
                )}
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            {studentInfoData?.scores?.gd && (
              <>
                {Object.keys(studentInfoData?.scores).length === 1 && (
                  <>
                    {Object.keys(studentInfoData?.scores?.gd).map(
                      (panelist) => (
                        <Box sx={{ position: "relative" }}>
                          <Typography
                            sx={{ position: "absolute", left: 9, mt: -1.2 }}
                            className="student-profile-panelist-remarks"
                          >
                            {removeUnderlineAndJoin(panelist)}
                          </Typography>
                          <Input
                            style={{
                              height: 90,
                              marginBottom: "20px",
                              paddingTop: "15px",
                            }}
                            as="textarea"
                            rows={3}
                            defaultValue={
                              studentInfoData.scores.gd[panelist]?.find(
                                (item) => item.name === "comments"
                              )?.point
                            }
                            readOnly
                          />
                        </Box>
                      )
                    )}
                  </>
                )}
              </>
            )}
            {studentInfoData?.scores?.pi && (
              <>
                {Object.keys(studentInfoData?.scores).length === 1 && (
                  <>
                    {Object.keys(studentInfoData?.scores?.pi).map(
                      (panelist) => (
                        <Box sx={{ position: "relative" }}>
                          <Typography
                            sx={{ position: "absolute", left: 9, mt: -1.2 }}
                            className="student-profile-panelist-remarks"
                          >
                            {removeUnderlineAndJoin(panelist)}
                          </Typography>
                          <Input
                            style={{
                              height: 90,
                              marginBottom: "20px",
                              paddingTop: "15px",
                            }}
                            as="textarea"
                            rows={3}
                            defaultValue={
                              studentInfoData.scores.pi[panelist]?.find(
                                (item) => item.name === "comments"
                              )?.point
                            }
                            readOnly
                          />
                        </Box>
                      )
                    )}
                  </>
                )}
              </>
            )}
            {studentInfoData?.scores?.gd && studentInfoData?.scores?.pi && (
              <>
                {tabState === 1 && (
                  <>
                    {studentInfoData?.scores && studentInfoData?.scores?.gd && (
                      <>
                        {Object.keys(studentInfoData?.scores?.gd).map(
                          (panelist) => (
                            <Box sx={{ position: "relative" }}>
                              <Typography
                                sx={{ position: "absolute", left: 9, mt: -1.2 }}
                                className="student-profile-panelist-remarks"
                              >
                                {removeUnderlineAndJoin(panelist)}
                              </Typography>
                              <Input
                                style={{
                                  height: 90,
                                  marginBottom: "20px",
                                  paddingTop: "15px",
                                }}
                                as="textarea"
                                rows={3}
                                defaultValue={
                                  studentInfoData?.scores?.gd[panelist]?.find(
                                    (item) => item.name === "comments"
                                  )?.point
                                }
                                readOnly
                              />
                            </Box>
                          )
                        )}
                      </>
                    )}
                  </>
                )}
                {tabState === 2 && (
                  <>
                    {studentInfoData.scores && studentInfoData?.scores?.pi && (
                      <>
                        {Object.keys(studentInfoData.scores.pi).map(
                          (panelist) => (
                            <Box sx={{ position: "relative" }}>
                              <Typography
                                sx={{ position: "absolute", left: 9, mt: -1.2 }}
                                className="student-profile-panelist-remarks"
                              >
                                {removeUnderlineAndJoin(panelist)}
                              </Typography>
                              <Input
                                style={{
                                  height: 90,
                                  marginBottom: "20px",
                                  paddingTop: "15px",
                                }}
                                as="textarea"
                                rows={4}
                                defaultValue={
                                  studentInfoData?.scores.pi[panelist]?.find(
                                    (item) => item.name === "comments"
                                  )?.point
                                }
                                readOnly
                              />
                            </Box>
                          )
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
        {open && (
          <StudentProfileReviewDialog
            open={open}
            handleClose={handleClose}
            renderFile={renderFile}
            setFileUrl={setFileUrl}
            setFileName={setFileName}
            setNumPages={setNumPages}
            setPageNumber={setPageNumber}
          ></StudentProfileReviewDialog>
        )}
      </Box>
    </>
  );
};

export default StudentProfilePage;
