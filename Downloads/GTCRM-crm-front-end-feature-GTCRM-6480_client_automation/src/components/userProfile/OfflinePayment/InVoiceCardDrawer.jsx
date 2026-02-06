import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import "../../../styles/leadDetails.css";
import "../../../styles/leadofflinePayment.css";
import "../../../styles/sharedStyles.css";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useManualAddPaymentSendMailMutation } from "../../../Redux/Slices/filterDataSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import PdfNextButton from "../../PdfNextButton/PdfNextButton";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const InVoiceCardDrawer = ({ setInVoiceOpen,applicationId,paymentDetailsInfo }) => {
  const pushNotification = useToasterHook();
  const [sendMailLoading, setSendMailLoading] = useState(false);
  const {
    setApiResponseChangeMessage,
    apiResponseChangeMessage,
  } = useContext(DashboradDataContext);
  const [
    somethingWentWrongInSendMail,
    setSomethingWentWrongInSendMail,
  ] = useState(false);
  const [
    sendMailInternalServerError,
    setSendMailServerError,
  ] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [addManualPaymentSendMail] = useManualAddPaymentSendMailMutation();
const handleSendVerificationMail = () => {
  setSendMailLoading(true);
  addManualPaymentSendMail({
  applicationId,
     collegeId,
  })
    .unwrap()
    .then((res) => {
      try {
        if (res?.message) {
          if (typeof res?.message === "string") {
            pushNotification("success", res?.message);
            setInVoiceOpen(false)
          } else {
            throw new Error("send mail API response changed");
          }
        }
      } catch (error) {
        setApiResponseChangeMessage(error);
        handleSomethingWentWrong( setSomethingWentWrongInSendMail, "", 5000);
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
          setSendMailServerError,
          "",
          10000
        );
      }
    })
    .finally(() => {
      setSendMailLoading(false);
    });
};
//pdf show code here
const [numPages, setNumPages] = useState(null);
const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
  setNumPages(numPages);
}
   const changePage = (offset) => {
  setPageNumber((prevPageNumber) => prevPageNumber + offset);
}
const fileFormat = ["jpg", "jpeg", "png", "gif"];
const renderFile = (fileUrl,fileName) => {
  const getFileExtensionData = getFileExtension(fileUrl);
  if (fileUrl) {
    if (getFileExtensionData === "pdf") {
      return (
        <div>
          <Document file={fileName} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
          {
            numPages &&
          <Box className='document-locker-pdf-box'>
          <Typography>
            Page {pageNumber} of {numPages}
          </Typography>
          <Box className='document-locker-pdf-box-button'
            >
              <PdfNextButton
                onClick={() => changePage(-1)}
                startIcon={
                  <ArrowBackIosNewOutlinedIcon
                    sx={{ height: 15, mb: "1px" }}
                  />
                }
                disabled={pageNumber <= 1}
              >
              </PdfNextButton>
              <PdfNextButton
                onClick={() => {
                  changePage(1)
                }}
                endIcon={
                  <ArrowForwardIosOutlinedIcon
                    sx={{ height: 15, mb: "1px" }}
                  />
                }
                disabled={
                  pageNumber >= numPages
                }
              >
              </PdfNextButton>
            </Box>
          </Box>
          }
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
      <Box className="in-voice-drawer-box-top">
        <Typography className="in-voice-drawer-headline-text">
          Invoice Document
        </Typography>
        <IconButton>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setInVoiceOpen(false)}
          />
        </IconButton>
      </Box>
      {
         sendMailInternalServerError ||
         somethingWentWrongInSendMail ? (
           <>
             {sendMailInternalServerError && (
               <Error500Animation
                 height={400}
                 width={400}
               ></Error500Animation>
             )}
             {somethingWentWrongInSendMail && (
               <ErrorFallback
                 error={apiResponseChangeMessage}
                 resetErrorBoundary={() => window.location.reload()}
               />
             )}
           </>
         ):
         <>
      <Box className="in-voice-view-drawer-box-container">
      {
                renderFile(paymentDetailsInfo?.invoice_document
                  ,paymentDetailsInfo?.invoice_document)
              }
      </Box>
      <Box className="in-voice-view-drawer-button-box">
      <IconButton
            className="download-button-dashboard"
            aria-label="Download"
            onClick={()=>{
              if(paymentDetailsInfo?.invoice_document){
                window.open(paymentDetailsInfo?.invoice_document)
              }
            }}
          >
            <FileDownloadOutlinedIcon sx={{ color: "#39A1D1" }} />
          </IconButton>
          <Button
          sx={{ borderRadius: 50 }}
          variant="contained"
          size="medium"
          color="info"
          className={"in-voice-send-mail-button"}
          onClick={() => {
            handleSendVerificationMail()
          }}
        >
            {
                     sendMailLoading?
                      <CircularProgress size={20} sx={{color:"white !important"}} />
                      :
                      "Send Over mail"
                    }
        </Button>
      </Box>
         </>
      }
    </>
  );
};

export default InVoiceCardDrawer;
