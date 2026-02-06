import { Box } from "@mui/material";
import React from "react";
import "../../../styles/documentLockerDrawer.css";
import DocumentLockerDrawerDetails from "./DocumentLockerDrawerDetails";
import LeefLottieAnimationLoader from "../Loader/LeefLottieAnimationLoader";
import Error500Animation from "../ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";

const DocumentLockerDrawer = ({
  setOpenDocumentDrawer,
  documentToggle,
  setDocumentToggle,
  handleClickCommentDialogOpen,
  setIsScrolledComment,
  setApplicationOrOther,
  setClickData,
  setStatus,
  status,
  handleUpdateDocumentStatus,
  handleToSendMail,
  infoDocumentData,
  apiResponseChangeMessage,
  infoDocumentInternalServerError,
  somethingWentWrongInInfoDocument,
  totalDoc,
  setInfoDocumentData,
  setSkipAPICallDocumentLockerData,
  skipAPICallDocumentLockerData,
  handleGetDocumentLockerInfoData,
  handleGetCommentData,
  studentUploadedDocuments,
}) => {
  return (
    <Box className="document-drawer-box-container">
      {infoDocumentInternalServerError || somethingWentWrongInInfoDocument ? (
        <Box>
          {infoDocumentInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInInfoDocument && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {skipAPICallDocumentLockerData ? (
            <Box
              className="leef-lottie-animation-box"
              data-testid="loading-animation-container"
            >
              {" "}
              <LeefLottieAnimationLoader
                height={200}
                width={250}
              ></LeefLottieAnimationLoader>{" "}
            </Box>
          ) : (
            <DocumentLockerDrawerDetails
              studentUploadedDocuments={studentUploadedDocuments}
              setOpenDocumentDrawer={setOpenDocumentDrawer}
              documentToggle={documentToggle}
              setDocumentToggle={setDocumentToggle}
              handleClickCommentDialogOpen={handleClickCommentDialogOpen}
              dataSetData={infoDocumentData}
              setIsScrolledComment={setIsScrolledComment}
              setApplicationOrOther={setApplicationOrOther}
              setClickData={setClickData}
              setStatus={setStatus}
              status={status}
              handleUpdateDocumentStatus={handleUpdateDocumentStatus}
              handleToSendMail={handleToSendMail}
              totalDoc={totalDoc}
              setInfoDocumentData={setInfoDocumentData}
              setSkipAPICallDocumentLockerData={
                setSkipAPICallDocumentLockerData
              }
              handleGetDocumentLockerInfoData={handleGetDocumentLockerInfoData}
              handleGetCommentData={handleGetCommentData}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default DocumentLockerDrawer;
