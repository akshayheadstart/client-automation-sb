import React, { useContext, useState } from "react";
import { Drawer } from "rsuite";
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import InputAdornment from "@mui/material/InputAdornment";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { Document, Page } from "react-pdf";
import { useSelector } from "react-redux";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { extensionWithIcon } from "../../utils/MediaFilters";
import ArrowBackIosNewOutlined from "@mui/icons-material/ArrowBackIosNewOutlined";
import ArrowForwardIosOutlined from "@mui/icons-material/ArrowForwardIosOutlined";
import FileDownloadOutlined from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { useDeleteMediaFilesMutation } from "../../Redux/Slices/mediaGallery";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import useToasterHook from "../../hooks/useToasterHook";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const MediaGalleryFileInfoDrawer = ({
  fileInfo,
  fileDrawerOpener,
  Isopen,
  isFetching,
  onNext,
  isFirstFile,
  isLastFile,
  onPrev,
  setFilePreviewInDrawer,
}) => {
  const pushNotification = useToasterHook();
  const [textCopied, setTextCopied] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [deleteMediaFiles] = useDeleteMediaFilesMutation();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [openMediaDeleteModal, setOpenMediaDeleteModal] = useState(false);
  const [mediaDeleteSomethingWentWrong, setMediaDeleteSomethingWentWrong] =
    useState(false);
  const [downloading, setDownloading] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [deleteFileInternalServerError, setDeleteFileInternalServerError] =
    useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const changePage = (offset) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };
  const handleUrlCopy = () => {
    navigator.clipboard.writeText(fileInfo?.media_url);
    setTextCopied(true);
    setTimeout(() => {
      setTextCopied(false);
    }, 1500);
  };

  const handleDeleteMediaFiles = () => {
    const media_ids = [fileInfo.id];
    setDeleteLoading(true);
    try {
      deleteMediaFiles({ collegeId, media_ids })
        .unwrap()
        .then((res) => {
          try {
            if (res?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (res?.detail) {
              pushNotification("error", res?.detail);
            } else if (res?.message) {
              pushNotification("success", res?.message);
              setOpenMediaDeleteModal(false);
              if (!isLastFile) {
                onNext();
              } else if (!isFirstFile) {
                onPrev();
              } else {
                fileDrawerOpener(false);
                setFilePreviewInDrawer([]);
              }
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setMediaDeleteSomethingWentWrong,
              "",
              5000
            );
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setDeleteLoading(false));
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleInternalServerError(setDeleteFileInternalServerError, "", 5000);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenMediaDeleteModal(false);
  };
  const handleDownload = () => {
    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = fileInfo.media_url;
      link.download = fileInfo.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      pushNotification("error", "somethingWentWrong");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Drawer
      open={Isopen}
      onClose={() => {
        fileDrawerOpener(false), setFilePreviewInDrawer([]);
      }}
      size={"lg"}
    >
      <Box sx={{ p: 3 }}>
        <Box className="file-preview-top-header">
          <Typography variant="h6">
            {`Attachment Details | ${fileInfo?.uploaded_by}`}
          </Typography>
          <IconButton>
            <CloseIcon
              onClick={() => {
                fileDrawerOpener(), setFilePreviewInDrawer([]);
              }}
            />
          </IconButton>
        </Box>
        {isFetching ? (
          <>
            <Box className="loading-animation">
              <LeefLottieAnimationLoader
                height={250}
                width={250}
              ></LeefLottieAnimationLoader>
            </Box>
          </>
        ) : (
          <Grid container spacing={2} sx={{ height: "92vh" }}>
            <Grid item xs={12} md={6} sx={{ height: "100%" }}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {fileInfo?.file_extension === ".pdf" ? (
                  <>
                    <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                      <Document
                        file={fileInfo?.media_url}
                        renderMode="canvas"
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page
                          width={
                            window.innerWidth > 960
                              ? undefined
                              : window.innerWidth
                          }
                          height={window.innerHeight - 100}
                          pageNumber={pageNumber}
                        />
                      </Document>
                      <Document
                        file={fileInfo?.media_url}
                        renderMode="canvas"
                        onLoadSuccess={onDocumentLoadSuccess}
                      >
                        <Page
                          width={
                            window.innerWidth > 960
                              ? undefined
                              : window.innerWidth
                          }
                          height={window.innerHeight - 100}
                          pageNumber={pageNumber}
                        />
                      </Document>
                    </Box>
                    {numPages && (
                      <Box sx={{ p: 2 }}>
                        <Typography>
                          Page {pageNumber} of {numPages}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 1,
                          }}
                        >
                          <Button
                            onClick={() => changePage(-1)}
                            disabled={pageNumber <= 1}
                            sx={{ mr: 1 }}
                          >
                            <ArrowBackIosNewOutlinedIcon />
                          </Button>
                          <Button
                            onClick={() => changePage(1)}
                            disabled={pageNumber >= numPages}
                          >
                            <ArrowForwardIosOutlinedIcon />
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </>
                ) : fileInfo?.file_extension === ".mp4" ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <video
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                      controls
                    >
                      <source src={fileInfo.media_url} type="video/mp4" />
                    </video>
                  </Box>
                ) : [".jpeg", ".jpg", ".png"].includes(
                    fileInfo.file_extension
                  ) ? (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      src={
                        extensionWithIcon[fileInfo?.file_extension] ||
                        fileInfo?.media_url
                      }
                      alt={fileInfo?.file_name}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      src={
                        extensionWithIcon[fileInfo?.file_extension] ||
                        fileInfo?.media_url
                      }
                      alt={fileInfo?.file_name}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Box
                sx={{ flexGrow: 1, overflow: "auto", p: 2 }}
                className="file-preview-info-section"
              >
                <Typography>Uploaded On: {fileInfo?.uploaded_on}</Typography>
                <Typography>Uploaded By: {fileInfo?.uploaded_by}</Typography>
                <Typography>File name: {fileInfo?.file_name}</Typography>
                <Typography>File type: {fileInfo?.file_type}</Typography>
                <Typography>File size: {fileInfo?.file_size}</Typography>
                <Typography>Dimensions: {fileInfo?.dimensions}</Typography>
                <FormControl
                  focused={true}
                  variant="outlined"
                  color="info"
                  sx={{ mt: 2 }}
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    File URL
                  </InputLabel>
                  <OutlinedInput
                    info="true"
                    type="text"
                    style={{ color: "#008BE2" }}
                    size="xs"
                    value={fileInfo?.media_url || ""}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="copy url" edge="end">
                          {!textCopied ? (
                            <ContentPasteOutlinedIcon
                              color="info"
                              sx={{ fontSize: 20 }}
                              onClick={handleUrlCopy}
                            />
                          ) : (
                            <CheckOutlinedIcon
                              sx={{ fontSize: 20 }}
                              color="info"
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Box>
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton
                  className="media-info-action-button"
                  style={{
                    background: isFirstFile ? "#eee" : "#cceeff",
                  }}
                  disabled={isFirstFile}
                >
                  <ArrowBackIosNewOutlined
                    sx={{
                      color: isFirstFile ? "#fff" : "#008be2",
                      fontSize: 20,
                    }}
                    color="info"
                    onClick={onPrev}
                  />
                </IconButton>
                <Button
                  variant="contained"
                  className="bottom-action-button-blue "
                  color="info"
                  onClick={handleDownload}
                >
                  {downloading ? (
                    <CircularProgress size={25} />
                  ) : (
                    <>
                      <FileDownloadOutlined /> Download
                    </>
                  )}
                </Button>
                <Button
                  variant="outlined"
                  className="bottom-action-button"
                  color="info"
                  onClick={() => setOpenMediaDeleteModal(true)}
                >
                  <DeleteOutlineOutlined /> Delete
                </Button>
                <IconButton
                  size="sm"
                  disabled={isLastFile}
                  className="media-info-action-button"
                  style={{
                    background: isLastFile ? "#eee" : "#cceeff",
                  }}
                >
                  <ArrowForwardIosOutlined
                    sx={{
                      color: isLastFile ? "#fff" : "#008be2",
                      fontSize: 20,
                    }}
                    color="info"
                    onClick={onNext}
                  />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>

      <DeleteDialogue
        openDeleteModal={openMediaDeleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteSingleTemplate={handleDeleteMediaFiles}
        internalServerError={deleteFileInternalServerError}
        loading={deleteLoading}
        somethingWentWrong={mediaDeleteSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </Drawer>
  );
};

export default MediaGalleryFileInfoDrawer;
