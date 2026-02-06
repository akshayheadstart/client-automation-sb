/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Button, Card, Typography } from "@mui/material";
import Grid from "@mui/system/Unstable_Grid/Grid";
import React, { useEffect, useState } from "react";
import "../../../styles/documentLockerDrawer.css";
import DocumentLockerInfoTable from "./DocumentLockerInfoTable";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import "../../../styles/documentLocker.css";
import "../../../styles/sharedStyles.css";
import { Document, Page } from "react-pdf";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "../../../styles/sharedStyles.css";
import CustomTooltip from "../Popover/Tooltip";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DocumentLockerDrawerDetails = ({
  setOpenDocumentDrawer,
  documentToggle,
  setDocumentToggle,
  handleClickCommentDialogOpen,
  dataSetData,
  setIsScrolledComment,
  setApplicationOrOther,
  setClickData,
  setStatus,
  status,
  handleUpdateDocumentStatus,
  handleToSendMail,
  totalDoc,
  setInfoDocumentData,
  setSkipAPICallDocumentLockerData,
  handleGetDocumentLockerInfoData,
  handleGetCommentData,
  studentUploadedDocuments,
}) => {
  const [listOfDocumentKeys, setListOfDocumentKeys] = useState([]);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    const keyList = Object.keys(studentUploadedDocuments);
    setListOfDocumentKeys(keyList);
  }, [studentUploadedDocuments]);

  const handlePrevAndNext = (index) => {
    const keyName = listOfDocumentKeys[index];
    handleGetDocumentLockerInfoData(keyName, index);
    setInfoDocumentData([]);
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };
  const fileFormat = ["jpg", "jpeg", "png", "gif"];
  const renderFile = (fileUrl, fileName) => {
    const getFileExtensionData = getFileExtension(fileUrl);

    if (fileUrl) {
      if (getFileExtensionData === "pdf") {
        return (
          <div>
            <Document file={fileName} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
            {numPages && (
              <Box className="document-locker-pdf-box">
                <Typography>
                  Page {pageNumber} of {numPages}
                </Typography>
                <Box className="document-locker-pdf-box-button prev-next-button-container">
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
        return <img src={fileName} alt="Image" width="100%" height="400px" />;
      } else {
        return (
          <a href={fileName} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        );
      }
    }
    return null;
  };
  const getFileExtension = (file_name) => {
    return file_name.split(".").pop().toLowerCase();
  };

  return (
    <>
      {dataSetData?.map((document, index) => {
        return (
          <Box className="vertical-scrollbar" key={document?.doc_name}>
            <Box className="document-drawer-headline-box-container">
              <Typography className="document-drawer-headline-text">
                {removeUnderlineAndJoin(document?.label_name)}
              </Typography>
              <CloseIcon
                onClick={() => {
                  setOpenDocumentDrawer();
                  setInfoDocumentData([]);
                }}
                className="document-locker-close-icon"
              />
            </Box>
            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={12} md={6}>
                  <Box>
                    <Box className="document-locker-drawer-box-container">
                      {document?.doc_name !== "application" && (
                        <>
                          <FormControl sx={{ minWidth: 110 }} size="small">
                            <InputLabel id="demo-select-small-label">
                              Status
                            </InputLabel>
                            <Select
                              labelId="demo-select-small-label"
                              id="demo-select-small"
                              // value={age}
                              label="Status"
                              onChange={(event) => {
                                handleUpdateDocumentStatus(
                                  event.target.value,
                                  document?.doc_name,
                                  document?.doc_name
                                );
                              }}
                              sx={{ height: "38px" }}
                            >
                              <MenuItem value={"Accepted"}>Accepted</MenuItem>
                              <MenuItem value={"Rejected"}>Rejected</MenuItem>
                              <MenuItem value={"Under_Review"}>
                                Under Review
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <Box>
                            <Button
                              onClick={() => {
                                handleClickCommentDialogOpen();
                                handleGetCommentData(
                                  document?.doc_name,
                                  document?.doc_name
                                );
                              }}
                              sx={{ whiteSpace: "nowrap" }}
                              variant="outlined"
                              size="small"
                              color="info"
                            >
                              Add Comment
                            </Button>
                          </Box>
                        </>
                      )}
                      {(document?.doc_name === "tenth" ||
                        document?.doc_name === "inter") && (
                        <>
                          <Box>
                            <Button
                              disabled={!document?.external_link}
                              sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                              variant="outlined"
                              size="small"
                              color="info"
                              onClick={() => {
                                if (document?.external_link) {
                                  window.open(document?.external_link);
                                }
                              }}
                            >
                              Dv portal
                            </Button>
                          </Box>
                          <Box>
                            {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                              <CustomTooltip
                                description={<div>Will not work in demo</div>}
                                component={
                                  <Button
                                    onClick={() =>
                                      handleToSendMail(
                                        document.doc_name,
                                        document.doc_name
                                      )
                                    }
                                    sx={{
                                      borderRadius: 50,
                                      whiteSpace: "nowrap",
                                    }}
                                    variant="outlined"
                                    size="small"
                                    color="info"
                                  >
                                    Mail Board
                                  </Button>
                                }
                                color={true}
                                placement={"top"}
                                accountType={
                                  import.meta.env.VITE_ACCOUNT_TYPE === "demo"
                                    ? true
                                    : false
                                }
                              />
                            ) : (
                              <Button
                                onClick={() =>
                                  handleToSendMail(
                                    document.doc_name,
                                    document.doc_name
                                  )
                                }
                                sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                                variant="outlined"
                                size="small"
                                color="info"
                              >
                                Mail Board
                              </Button>
                            )}
                          </Box>
                        </>
                      )}
                    </Box>
                    <Card className="document-card-container custom-scrollbar ">
                      {renderFile(document?.doc_link, document?.download_url)}
                    </Card>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Box sx={{ mt: "-10px", ml: "20px" }}>
                    <DocumentLockerInfoTable
                      documentToggle={documentToggle}
                      document={document}
                    ></DocumentLockerInfoTable>
                  </Box>

                  <Box className="document-locker-save-button-box">
                    <Box>
                      {documentToggle > 0 && (
                        <Box
                          onClick={() => {
                            // handleGetDocumentLockerInfoData(documentToggle - 1);
                            // setInfoDocumentData([]);
                            handlePrevAndNext(documentToggle - 1);
                          }}
                          className="document-drawer-arrow-box"
                        >
                          <KeyboardArrowLeftIcon sx={{ color: "#008BE2" }} />
                        </Box>
                      )}
                    </Box>
                    <Button
                      onClick={() => {
                        if (document?.download_url) {
                          window.open(document?.download_url);
                        }
                      }}
                      sx={{ borderRadius: 50 }}
                      variant="contained"
                      size="small"
                      color="info"
                      disabled={!document?.download_url}
                    >
                      Download
                    </Button>
                    <Box>
                      {totalDoc !== documentToggle && (
                        <Box
                          onClick={() => {
                            // handleGetDocumentLockerInfoData(, documentToggle + 1);
                            // setInfoDocumentData([]);
                            handlePrevAndNext(documentToggle + 1);
                          }}
                          className="document-drawer-arrow-box"
                        >
                          <KeyboardArrowRightIcon sx={{ color: "#008BE2" }} />
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        );
      })}
    </>
  );
};

export default DocumentLockerDrawerDetails;
