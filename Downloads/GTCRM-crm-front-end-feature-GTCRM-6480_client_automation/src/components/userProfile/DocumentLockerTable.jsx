import LoopIcon from "@mui/icons-material/Loop";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { useGetDocumentLockerUserDataMutation } from "../../Redux/Slices/applicationDataApiSlice";
import { removeUnderlineAndJoin } from "../../helperFunctions/calendarHelperfunction";
import { isNumberOrStringCompare } from "../../helperFunctions/filterHelperFunction";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/EventMapping.css";
import "../../styles/documentLocker.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import DocumentLockerDrawer from "../shared/DocumentLockerDrawer/DocumentLockerDrawer";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import CustomTooltip from "../shared/Popover/Tooltip";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/sharedStyles.css";

const DocumentLockerTable = ({
  documentToggle,
  setDocumentToggle,
  handleClickCommentDialogOpen,
  setClickData,
  setApplicationOrOther,
  setIsScrolledComment,
  setStatus,
  status,
  handleUpdateDocumentStatus,
  handleToSendMail,
  studentUploadedDocuments,
  studentId,
  handleRetry,
  retryLoader,
  handleGetCommentData,
  leadProfileAction,
}) => {
  const StyledTableCell = useTableCellDesign();
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [openDocumentDrawer, setOpenDocumentDrawer] = React.useState(false);
  const [skipAPICallDocumentLockerData, setSkipAPICallDocumentLockerData] =
    useState(false);
  const [
    somethingWentWrongInInfoDocument,
    setSomethingWentWrongInInfoDocument,
  ] = useState(false);
  const [infoDocumentInternalServerError, setInfoDocumentInternalServerError] =
    useState(false);
  //getting data form context
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [infoDocumentData, setInfoDocumentData] = useState([]);
  const [totalDoc, setTotalDoc] = useState(0);
  const [getDocumentLockerInfoData] = useGetDocumentLockerUserDataMutation();

  const handleGetDocumentLockerInfoData = (docName, index) => {
    setDocumentToggle(index);
    setSkipAPICallDocumentLockerData(true);
    getDocumentLockerInfoData({
      index: docName,
      studentId: studentId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((result) => {
        try {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.data) {
            setInfoDocumentData(result?.data);
            setTotalDoc(result?.total_doc);
          } else if (result?.message) {
            pushNotification("warning", result?.message);
            setInfoDocumentData([]);
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
            setInfoDocumentData([]);
          } else {
            throw new Error("Get User Document API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInInfoDocument,
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
          setInfoDocumentData([]);
        } else {
          handleInternalServerError(
            setInfoDocumentInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setSkipAPICallDocumentLockerData(false));
  };
  return (
    <Box>
      {Object.keys(studentUploadedDocuments)?.length > 0 ? (
        <TableContainer
          sx={{ boxShadow: 0, height: "430px" }}
          component={Paper}
          className="custom-scrollbar vertical-scrollbar"
        >
          {retryLoader && <LinearProgress sx={{ minWidth: "515px" }} />}
          <Table
            sx={{ minWidth: 200, overflowX: "scroll" }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "15px !important",
                    fontWeight: " !important",
                  }}
                >
                  Document Name
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "15px !important",
                    fontWeight: " !important",
                  }}
                  align="left"
                >
                  Status
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "15px !important",
                    fontWeight: " !important",
                  }}
                  align="center"
                >
                  OCR Accuracy
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    whiteSpace: "nowrap",
                    fontSize: "15px !important",
                    fontWeight: " !important",
                  }}
                  align="left"
                >
                  Comments
                </StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.keys(studentUploadedDocuments)?.map((document, index) => {
                return (
                  <TableRow sx={{ borderBottom: "1px solid #EEE" }} key={index}>
                    <StyledTableCell
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        if (!leadProfileAction) {
                          if (studentUploadedDocuments[document]?.file_s3_url) {
                            setClickData(document);
                            setApplicationOrOther(document);
                            setOpenDocumentDrawer(true);
                            setSkipAPICallDocumentLockerData(true);
                            setInfoDocumentData([]);
                            handleGetDocumentLockerInfoData(document, index);
                          }
                        }
                      }}
                      // onClick={toggleDrawer('right', true)}

                      component="th"
                      scope="row"
                    >
                      <Box>
                        <Typography
                          sx={{ fontWeight: 600 }}
                          className="document-file-name-text"
                        >
                          {removeUnderlineAndJoin(document)}
                        </Typography>
                        <Typography sx={{ fontSize: "11px", color: "#7E92A2" }}>
                          {`${
                            studentUploadedDocuments[document]?.file_name ||
                            "Empty"
                          }`}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Box
                        sx={{ borderRadius: 50 }}
                        className={
                          studentUploadedDocuments[document]?.status ===
                          "Rejected"
                            ? "document-locker-status-table-text"
                            : studentUploadedDocuments[document]?.status ===
                              "Accepted"
                            ? "document-locker-status-table-text-accepted"
                            : studentUploadedDocuments[document]?.status ===
                              "Under_Review"
                            ? "document-locker-status-table-text-under-review"
                            : "document-locker-status-table-text-na"
                        }
                      >
                        <Typography sx={{ fontSize: "11px" }}>
                          {" "}
                          {studentUploadedDocuments[document]?.status || "N/A"}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      className="document-locker-ocr-table-data"
                    >{`${
                      isNumberOrStringCompare(
                        studentUploadedDocuments[document]?.ocr_accuracy
                      )
                        ? `${studentUploadedDocuments[document]?.ocr_accuracy}%`
                        : studentUploadedDocuments[document]?.ocr_accuracy ||
                          "N/A"
                    }`}</StyledTableCell>
                    <StyledTableCell align="left">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {studentUploadedDocuments[document]?.comments?.length >
                          0 &&
                        studentUploadedDocuments[document]?.comments[0]?.message
                          ?.length > 20 ? (
                          <CustomTooltip
                            description={
                              <div>
                                {" "}
                                <div>
                                  {
                                    studentUploadedDocuments[document]
                                      ?.comments[0]?.message
                                  }
                                </div>
                              </div>
                            }
                            component={
                              <Button
                                disabled={
                                  !studentUploadedDocuments[document]
                                    ?.file_s3_url || document === "application"
                                }
                                variant="outlined"
                                size="small"
                                className="document-locker-table-button"
                                onClick={() => {
                                  if (!leadProfileAction) {
                                    handleClickCommentDialogOpen();
                                    setIsScrolledComment(true);
                                    handleGetCommentData(document, document);
                                  }
                                }}
                              >
                                {studentUploadedDocuments[document]?.comments
                                  ?.length > 0 ? (
                                  <>
                                    {studentUploadedDocuments[document]
                                      ?.comments[0]?.message?.length > 20 ? (
                                      <>
                                        {studentUploadedDocuments[
                                          document
                                        ]?.comments[0]?.message?.slice(0, 20) +
                                          "..."}
                                      </>
                                    ) : (
                                      <>
                                        {
                                          studentUploadedDocuments[document]
                                            ?.comments[0]?.message
                                        }
                                      </>
                                    )}
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </Button>
                            }
                          />
                        ) : (
                          <Button
                            disabled={
                              !studentUploadedDocuments[document]
                                ?.file_s3_url || document === "application"
                            }
                            variant="outlined"
                            size="small"
                            className="document-locker-table-button"
                            color="info"
                            onClick={() => {
                              if (!leadProfileAction) {
                                handleClickCommentDialogOpen();
                                setIsScrolledComment(true);
                                handleGetCommentData(document, document);
                              }
                            }}
                          >
                            {studentUploadedDocuments[document]?.comments
                              ?.length > 0 ? (
                              <>
                                {
                                  studentUploadedDocuments[document]
                                    ?.comments[0]?.message
                                }
                              </>
                            ) : (
                              "N/A"
                            )}
                          </Button>
                        )}
                        {studentUploadedDocuments[document]?.file_s3_url && (
                          <>
                            {(document === "tenth" || document === "inter") && (
                              <>
                                {isNumberOrStringCompare(
                                  studentUploadedDocuments[document]
                                    ?.ocr_accuracy
                                ) ? (
                                  <Box
                                    sx={{
                                      width: "26px",
                                      height: "26px",
                                      borderRadius: 50,
                                      backgroundColor: "#E8E9EB",
                                      p: "3px",
                                    }}
                                  >
                                    <LoopIcon
                                      sx={{
                                        color: "gray",
                                      }}
                                      className="retry-button-design"
                                    />
                                  </Box>
                                ) : (
                                  <>
                                    {studentUploadedDocuments[document]
                                      ?.count === 3 ? (
                                      <>
                                        <CustomTooltip
                                          title="Maximum 3 times Retry has been Completed"
                                          description={
                                            <div>
                                              {" "}
                                              <ul>
                                                {" "}
                                                <li>Maximum Retry: 3</li>
                                                <li>
                                                  Remaining Retry:{" "}
                                                  {3 -
                                                    studentUploadedDocuments[
                                                      document
                                                    ]?.count}
                                                </li>
                                              </ul>{" "}
                                            </div>
                                          }
                                          component={
                                            <Box
                                              sx={{
                                                width: "26px",
                                                height: "26px",
                                                borderRadius: 50,
                                                backgroundColor: "#E8E9EB",
                                                p: "3px",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <LoopIcon
                                                sx={{
                                                  color: "gray",
                                                }}
                                                className="retry-button-design"
                                              />
                                            </Box>
                                          }
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <CustomTooltip
                                          title={
                                            "User can Maximum 3 times Retry to update Document."
                                          }
                                          description={
                                            <div>
                                              {" "}
                                              <ul>
                                                {" "}
                                                <li>Maximum Retry: 3</li>
                                                <li>
                                                  Remaining Retry:{" "}
                                                  {3 -
                                                    studentUploadedDocuments[
                                                      document
                                                    ]?.count}
                                                </li>
                                              </ul>{" "}
                                            </div>
                                          }
                                          component={
                                            <Box
                                              sx={{
                                                width: "26px",
                                                height: "26px",
                                                borderRadius: 50,
                                                backgroundColor: "#0B79D0",
                                                p: "3px",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <LoopIcon
                                                onClick={() =>
                                                  handleRetry(document)
                                                }
                                                sx={{
                                                  color: "white",
                                                }}
                                                className="retry-button-design"
                                              />
                                            </Box>
                                          }
                                        />
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </Box>
                    </StyledTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: "25vh",
            alignItems: "center",
          }}
          data-testid="not-found-animation-container"
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}
      {/* drawer document */}

      <Box>
        <>
          <Drawer
            anchor={"right"}
            open={openDocumentDrawer}
            onClose={() => {
              setOpenDocumentDrawer(false);
              setInfoDocumentData([]);
            }}
            className="vertical-scrollbar-drawer"
          >
            <DocumentLockerDrawer
              studentUploadedDocuments={studentUploadedDocuments}
              documentToggle={documentToggle}
              setOpenDocumentDrawer={setOpenDocumentDrawer}
              setDocumentToggle={setDocumentToggle}
              handleClickCommentDialogOpen={handleClickCommentDialogOpen}
              setIsScrolledComment={setIsScrolledComment}
              setClickData={setClickData}
              setApplicationOrOther={setApplicationOrOther}
              setStatus={setStatus}
              status={status}
              handleUpdateDocumentStatus={handleUpdateDocumentStatus}
              handleToSendMail={handleToSendMail}
              skipAPICallDocumentLockerData={skipAPICallDocumentLockerData}
              infoDocumentData={infoDocumentData}
              apiResponseChangeMessage={apiResponseChangeMessage}
              infoDocumentInternalServerError={infoDocumentInternalServerError}
              somethingWentWrongInInfoDocument={
                somethingWentWrongInInfoDocument
              }
              totalDoc={totalDoc}
              setInfoDocumentData={setInfoDocumentData}
              setSkipAPICallDocumentLockerData={
                setSkipAPICallDocumentLockerData
              }
              handleGetDocumentLockerInfoData={handleGetDocumentLockerInfoData}
              handleGetCommentData={handleGetCommentData}
            />
          </Drawer>
        </>
      </Box>
    </Box>
  );
};

export default DocumentLockerTable;
