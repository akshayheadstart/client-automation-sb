/* eslint-disable jsx-a11y/img-redundant-alt */
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React, { useContext, useState } from "react";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/documentLocker.css";
import "../../styles/sharedStyles.css";
import DocumentLockerCommentDialog from "../DocumentLockerCommentDialog/DocumentLockerCommentDialog";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import Cookies from "js-cookie";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useSelector } from "react-redux";
import {
  tableSlice,
  useGetStudentCommentDataMutation,
  useUpdateStudentDocumentGetCommentMutation,
  useUpdateStudentDocumentStatusMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import DocumentLockerTable from "./DocumentLockerTable";
import CustomTooltip from "../shared/Popover/Tooltip";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import { useDispatch } from "react-redux";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const DocumentLocker = (props) => {
  const [isDownloadAllDocLoading, setIsDownloadAllDocLoading] = useState(false);

  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const { studentUploadedDocuments } = props?.studentUploadedDocumentData;
  const [isScrolledComment, setIsScrolledComment] = useState(false);
  //getting data form context
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  let other = [];
  // setting other document and other document name
  for (let doc in studentUploadedDocuments) {
    if (
      doc !== "tenth" &&
      doc !== "inter" &&
      doc !== "graduation" &&
      doc !== "recent_photo" &&
      doc !== "application" &&
      doc !== "ug_consolidated_mark_sheet"
    ) {
      const otherInfo = {
        doc: studentUploadedDocuments[doc],
        docName: doc,
      };
      other.push(otherInfo);
    }
  }

  const handleClickCommentDialogOpen = () => {
    setOpen(true);
  };

  const handleClickCommentDialogClose = () => {
    setOpen(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [commentDescription, setCommentDescription] = useState("");
  const [clickData, setClickData] = useState("");
  const [applicationOrOther, setApplicationOrOther] = useState("");
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const [somethingWentWrongInStudent, setSomethingWentWrongInStudent] =
    useState(false);
  const [updateApiInternalServerError, setUpdateApiInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInStudentStatus,
    setSomethingWentWrongInStudentStatus,
  ] = useState(false);
  const [statusInternalServerError, setStatusInternalServerError] =
    useState(false);
  //Document ADD comment API implementation here
  const [addComment] = useUpdateStudentDocumentGetCommentMutation();
  const handleUpdateDocumentComment = () => {
    addComment({
      studentId: props?.studentId,
      commentDescription: commentDescription,
      clickData: clickData,
      applicationOrOther: applicationOrOther,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Add Comment Successful");
              setIsScrolledComment(true);
              setCommentDescription("");
              props?.setShouldCallStudentDocumentAPI((prv) => !prv);
              // window.location.reload();
            } else {
              throw new Error("update Comment API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInStudent, "", 5000);
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setUpdateApiInternalServerError, "", 5000);
      });
  };
  const [updateDocumentStatus] = useUpdateStudentDocumentStatusMutation();
  const [status, setStatus] = useState("");
  const handleUpdateDocumentStatus = (
    valueStatus,
    applicationOrOthers,
    clicksData
  ) => {
    updateDocumentStatus({
      documentStatus: valueStatus,
      applicationId: props?.applicationId,
      selectedStatusClickData: clicksData,
      applicationOrOtherStatus: applicationOrOthers,
      collegeId: collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "Updated status Success");
              // window.location.reload();
              props?.setShouldCallStudentDocumentAPI((prv) => !prv);
            } else {
              throw new Error("update Status API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInStudentStatus,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setStatusInternalServerError, "", 5000);
      });
  };
  const [somethingWentWrongInSendmail, setSomethingWentWrongInSendmail] =
    useState(false);
  const [sendMailInternalServerError, setSendMailInternalServerError] =
    useState(false);
  const handleToSendMail = (sendMailClickData, applicationOrOther) => {
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully Send Mail to Board");
    } else {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/admin/send_student_document_to_board/?application_id=${
          props?.applicationId
        }&recent_photo=${
          sendMailClickData === "recent_photo" ? true : false
        }&tenth=${sendMailClickData === "tenth" ? true : false}&inter=${
          sendMailClickData === "inter" ? true : false
        }&graduation=${
          sendMailClickData === "graduation" ? true : false
        }&ug_consolidated_mark_sheet=${
          sendMailClickData === "ug_consolidated_mark_sheet" ? true : false
        }&title=${
          sendMailClickData === "application" || sendMailClickData === "other"
            ? applicationOrOther
            : ""
        }&college_id=${collegeId}`,
        ApiCallHeaderAndBody(token, "POST")
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result.detail) {
            pushNotification("error", result.detail);
          } else {
            try {
              pushNotification("success", "Successfully Send Mail to Board");

              // window.location.reload();
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInSendmail,
                "",
                5000
              );
            }
          }
        })
        .catch((error) => {
          handleInternalServerError(setSendMailInternalServerError, "", 5000);
        });
    }
  };

  const [somethingWentWrongComments, setSomethingWentWrongInCommentsApi] =
    useState(false);
  const [commentsApiInternalServerError, setCommentsApiInternalServerError] =
    useState(false);
  const [allComment, setAllComment] = useState([]);
  const [getStudentCommentDataData] = useGetStudentCommentDataMutation();
  const handleGetCommentData = (applicationOrOtherData, clickInfoData) => {
    setApplicationOrOther(applicationOrOtherData);
    setClickData(clickInfoData);
    setIsScrolledComment(true);
    getStudentCommentDataData({
      applicationOrOther: applicationOrOtherData,
      clickData: clickInfoData,
      studentId: props?.studentId,
      collegeId: collegeId,
    })
      .unwrap()
      .then((result) => {
        try {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.document_comments) {
            setAllComment(result?.document_comments);
          } else if (result?.message) {
            pushNotification("warning", result?.message);
            setAllComment([]);
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
            setAllComment([]);
          } else {
            throw new Error(
              "Get Comment details API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInCommentsApi,
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
          setAllComment([]);
        } else if (error?.status === 500) {
          handleInternalServerError(
            setCommentsApiInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => setIsScrolledComment(false));
  };

  const [somethingWentWrongInRetry, setSomethingWentWrongInRetry] =
    useState(false);
  const [retryInternalServerError, setRetryInternalServerError] =
    useState(false);
  const [retryLoader, setRetryLoader] = useState(false);
  const handleRetry = (retryStatus) => {
    setRetryLoader(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/student/documents/retry_extraction/?student_id=${
        props?.studentId
      }&doc_type=${retryStatus}&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", result.message);
            // props?.setShouldCallStudentDocumentAPI((prv) => !prv);
            dispatch(
              tableSlice.util.invalidateTags(["UserProfileLeadDocument"])
            );
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInRetry, "", 5000);
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setRetryInternalServerError, "", 5000);
      })
      .finally(() => {
        setRetryLoader(false);
      });
  };

  const [documentToggle, setDocumentToggle] = useState(0);

  const [
    somethingWentWrongInDownloadAllDocuments,
    setSomethingWentWrongInDownloadAllDocuments,
  ] = useState(false);
  const [
    downloadAllDocumentsInternalServerError,
    setDownloadAllDocumentsInternalServerError,
  ] = useState(false);
  const handleDownloadAllDocuments = () => {
    setIsDownloadAllDocLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/download_documents/${
        props?.studentId
      }/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          const expectedData = result?.data[0]?.zip_url;
          pushNotification("success", result?.message);
          try {
            if (typeof expectedData === "string") {
              window.open(expectedData);
            } else {
              throw new Error(
                "download_applications_data API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInDownloadAllDocuments,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setDownloadAllDocumentsInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setIsDownloadAllDocLoading(false));
  };
  //demo setup notify student
  const [
    somethingWentWrongInNotifyStudent,
    setSomethingWentWrongInNotifyStudent,
  ] = useState(false);
  const [
    notifyStudentInternalServerError,
    setNotifyStudentInternalServerError,
  ] = useState(false);
  const [notifyStudentLoading, setNotifyStudentLoading] = useState(false);
  const handleNotifyStudent = () => {
    setNotifyStudentLoading(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", "Successfully sent Notify Mail !");
      setNotifyStudentLoading(false);
    } else {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/student/email/comments_and_status/?student_id=${
          props?.studentId
        }&college_id=${collegeId}`,
        ApiCallHeaderAndBody(token, "POST")
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result.detail) {
            pushNotification("error", result.detail);
          } else {
            try {
              if (result?.message) {
                pushNotification("success", result?.message);
              } else {
                throw new Error(
                  "download_applications_data API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInNotifyStudent,
                "",
                5000
              );
            }
          }
        })
        .catch((error) => {
          handleInternalServerError(
            setNotifyStudentInternalServerError,
            "",
            5000
          );
        })
        .finally(() => {
          setNotifyStudentLoading(false);
        });
    }
  };
  return (
    <>
      {props?.isFetchingLeadDocument ? (
        <Box
          className="leef-lottie-animation-box"
          data-testid="loading-animation-container"
        >
          {" "}
          <LeefLottieAnimationLoader
            height={150}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Box>
      ) : (
        <>
          {props?.documentLockerInternalServerError ||
          props?.somethingWentWrongInDocuentLocker ? (
            <Box>
              {props?.documentLockerInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {props?.somethingWentWrongInDocuentLocker && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ display: props?.hideDocumentLocker ? "none" : "block" }}>
              <Box sx={{ pl: 2, mt: 2, pr: 2 }}>
                <Grid
                  sx={{ ml: 2 }}
                  rowSpacing={{ xs: 1, sm: 2, md: 3 }}
                  container
                  columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
                >
                  <Grid item xs={10} sm={10} md={12} lg={12}>
                    {somethingWentWrongInSendmail ||
                    sendMailInternalServerError ||
                    somethingWentWrongInStudentStatus ||
                    statusInternalServerError ||
                    downloadAllDocumentsInternalServerError ||
                    somethingWentWrongInDownloadAllDocuments ||
                    retryInternalServerError ||
                    somethingWentWrongInRetry ||
                    somethingWentWrongInNotifyStudent ||
                    notifyStudentInternalServerError ? (
                      <>
                        {(sendMailInternalServerError ||
                          statusInternalServerError ||
                          downloadAllDocumentsInternalServerError ||
                          retryInternalServerError ||
                          notifyStudentInternalServerError) && (
                          <Error500Animation
                            height={400}
                            width={400}
                          ></Error500Animation>
                        )}
                        {(somethingWentWrongInSendmail ||
                          somethingWentWrongInStudentStatus ||
                          somethingWentWrongInDownloadAllDocuments ||
                          somethingWentWrongInRetry ||
                          somethingWentWrongInNotifyStudent) && (
                          <ErrorFallback
                            error={apiResponseChangeMessage}
                            resetErrorBoundary={() => window.location.reload()}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Box sx={{ mr: "30px", mb: "30px" }}>
                          {Object.keys(studentUploadedDocuments)?.length >
                            0 && (
                            <Box className="document-locker-new-design-button-box">
                              {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                                <CustomTooltip
                                  description={<div>Will not work in demo</div>}
                                  component={
                                    <Button
                                      onClick={() => {
                                        if (!props?.leadProfileAction) {
                                          handleNotifyStudent();
                                        }
                                      }}
                                      sx={{
                                        borderRadius: 50,
                                        whiteSpace: "nowrap",
                                      }}
                                      variant="outlined"
                                      size="medium"
                                      color="info"
                                      className="notify-student-button"
                                    >
                                      Notify Student
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
                                  onClick={() => {
                                    if (!props?.leadProfileAction) {
                                      handleNotifyStudent();
                                    }
                                  }}
                                  sx={{
                                    borderRadius: 50,
                                    whiteSpace: "nowrap",
                                  }}
                                  variant="outlined"
                                  size="medium"
                                  color="info"
                                  className="notify-student-button"
                                  disabled={notifyStudentLoading}
                                  endIcon={
                                    notifyStudentLoading && (
                                      <CircularProgress
                                        color="info"
                                        size={20}
                                      />
                                    )
                                  }
                                >
                                  Notify Student
                                </Button>
                              )}
                              <Button
                                onClick={() => {
                                  if (!props?.leadProfileAction) {
                                    handleDownloadAllDocuments();
                                  }
                                }}
                                sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                                variant="contained"
                                size="medium"
                                color="info"
                                className="download-all-document-button"
                                disabled={isDownloadAllDocLoading}
                                endIcon={
                                  isDownloadAllDocLoading && (
                                    <CircularProgress
                                      size={20}
                                      sx={{ color: "white" }}
                                    />
                                  )
                                }
                              >
                                Download All
                              </Button>
                            </Box>
                          )}
                          <Box className="document-locker-table-box">
                            <DocumentLockerTable
                              documentToggle={documentToggle}
                              setDocumentToggle={setDocumentToggle}
                              handleClickCommentDialogOpen={
                                handleClickCommentDialogOpen
                              }
                              setApplicationOrOther={setApplicationOrOther}
                              setClickData={setClickData}
                              setIsScrolledComment={setIsScrolledComment}
                              studentUploadedDocuments={
                                studentUploadedDocuments
                              }
                              setStatus={setStatus}
                              status={status}
                              handleUpdateDocumentStatus={
                                handleUpdateDocumentStatus
                              }
                              handleToSendMail={handleToSendMail}
                              studentId={props?.studentId}
                              handleRetry={handleRetry}
                              retryLoader={retryLoader}
                              handleGetCommentData={handleGetCommentData}
                              leadProfileAction={props?.leadProfileAction}
                            ></DocumentLockerTable>
                          </Box>
                        </Box>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {open && (
                <DocumentLockerCommentDialog
                  handleClickCommentDialogClose={handleClickCommentDialogClose}
                  handleClickCommentDialogOpen={handleClickCommentDialogOpen}
                  open={open}
                  commentDescription={commentDescription}
                  setCommentDescription={setCommentDescription}
                  somethingWentWrongInStudent={somethingWentWrongInStudent}
                  updateApiInternalServerError={updateApiInternalServerError}
                  apiResponseChangeMessage={apiResponseChangeMessage}
                  studentId={props?.studentId}
                  clickData={clickData}
                  applicationOrOther={applicationOrOther}
                  setApiResponseChangeMessage={setApiResponseChangeMessage}
                  isScrolledComment={isScrolledComment}
                  allComment={allComment}
                  commentsApiInternalServerError={
                    commentsApiInternalServerError
                  }
                  somethingWentWrongComments={somethingWentWrongComments}
                  handleUpdateDocumentComment={handleUpdateDocumentComment}
                  setAllComment={setAllComment}
                ></DocumentLockerCommentDialog>
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default DocumentLocker;
