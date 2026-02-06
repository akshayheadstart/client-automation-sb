import React, { useContext, useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { Card } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { useSelector } from "react-redux";
import MediaGalleryFileInfoDrawer from "./MediaGalleryFileInfoDrawer";
import { useGetMediaFileDetailQuery } from "../../Redux/Slices/mediaGallery";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { downloadFiles } from "../../helperFunctions/handleMultipleFileDownloads";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import {
  useDeleteMediaFilesMutation,
  useDownloadMediaFilesMutation,
} from "../../Redux/Slices/mediaGallery";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { handleChangePage } from "../../helperFunctions/pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { extensionWithIcon } from "../../utils/MediaFilters";
import Pagination from "../../components/shared/Pagination/Pagination";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";

const AllMediaGalleryFileSection = ({
  allfiles,
  isFetching: MediaFilesFetching,
  paginationRef,
  totalMediaFiles,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [openFileViewDrawer, setOpenFileViewDrawer] = useState(false);
  const [selectedFilesOpener, setSelectedFileOpener] = useState([]);
  const [openMediaDeleteModal, setOpenMediaDeleteModal] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [deleteMediaFiles] = useDeleteMediaFilesMutation();

  const [filePreviewInDrawer, setFilePreviewInDrawer] = useState([]);
  const [mediaDeleteSomethingWentWrong, setMediaDeleteSomethingWentWrong] =
    useState(false);
  const [deleteFileInternalServerError, setDeleteFileInternalServerError] =
    useState(false);
  const [downloadMediaFiles] = useDownloadMediaFilesMutation();

  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const onPrev = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        setFilePreviewInDrawer(allfiles[newIndex]);
        return newIndex;
      });
    }
  };

  const onNext = () => {
    if (currentFileIndex < allfiles.length - 1) {
      setCurrentFileIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        // Use filePreviewInDrawer to get the next file
        setFilePreviewInDrawer(allfiles[newIndex]);
        return newIndex;
      });
    }
  };
  const handleCheckBoxChange = (event, files) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedFileOpener([...selectedFilesOpener, files]);
    } else {
      const filteredFiles = selectedFilesOpener.filter(
        (item) => item.id !== files.id
      );
      setSelectedFileOpener(filteredFiles);
    }
  };

  const {
    data: filesData,
    error,
    isFetching,
    isLoading,
  } = useGetMediaFileDetailQuery(
    { collegeId, media_id: filePreviewInDrawer.id },
    { skip: !filePreviewInDrawer.id }
  );

  //Download Media Files
  const handleMediaFileDownload = () => {
    setDownloadLoading(true);
    const media_ids = selectedFilesOpener.map((file) => file.id);

    downloadMediaFiles({ collegeId, media_ids })
      .unwrap()
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.message) {
          const expectedData = result.media_links;
          if (typeof expectedData === "object") {
            downloadFiles(expectedData, pushNotification);
            // pushNotification("success", "Download Successful");
            setSelectedFileOpener([]); // Uncheck checkboxes
          } else {
            throw new Error("Unable to download media files");
          }
        } else if (result?.detail) {
          pushNotification("error", result.detail);
        }
      })
      .catch((error) => {
        setApiResponseChangeMessage(error);

        handleInternalServerError(
          setMediaDownloadInternalServerError,
          "",
          5000
        );
      })
      .finally(() => setDownloadLoading(false));
  };

  const handleCloseDeleteModal = () => {
    setOpenMediaDeleteModal(false);
  };

  //Delete Media Files
  const handleDeleteMediaFiles = () => {
    const media_ids = selectedFilesOpener.map((file) => file.id);
    setLoading(true);
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
              setSelectedFileOpener([]);
              setOpenMediaDeleteModal(false);
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
        .finally(() => setLoading(false));
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleInternalServerError(setDeleteFileInternalServerError, "", 5000);
    }
  };
  const count = Math.ceil(allfiles.length / pageSize);

  return (
    <>
      {MediaFilesFetching ? (
        <Box className="loading-animation-for-media-files">
          <LeefLottieAnimationLoader
            height={100}
            width={100}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Grid
          container
          spacing={3}
          sx={{
            paddingTop: "40px",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          {allfiles?.length > 0 && !MediaFilesFetching ? (
            allfiles?.map((media, index) => {
              return (
                <Grid
                  item
                  xs={6}
                  xl={2}
                  lg={2}
                  md={3}
                  sm={4}
                  spacing={6}
                  key={index}
                >
                  <Box className="media-gallery-file-preview">
                    <Checkbox
                      onChange={(e) => handleCheckBoxChange(e, media)}
                      color="info"
                      checked={selectedFilesOpener.includes(media)}
                      sx={{
                        position: "absolute",
                        right: "5px",
                        alignSelf: "center",
                        zIndex: 1,
                      }}
                    />
                    <Box
                      onClick={() => {
                        setOpenFileViewDrawer(true);
                        setFilePreviewInDrawer(media);
                        setCurrentFileIndex(index);
                      }}
                      className="media-gallery-image-container"
                    >
                      {media.file_extension === ".mp4" ? (
                        <video height={"100%"} width={400} controls>
                          <source src={media.media_url} type="video/mp4" />
                        </video>
                      ) : [".jpeg", ".jpg", ".png"].includes(
                          media.file_extension
                        ) ? (
                        <img
                          height="100%"
                          width="100%"
                          style={{
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                          src={
                            extensionWithIcon[media.file_extension] ||
                            media.media_url
                          }
                          alt={`Media ${index}`}
                        />
                      ) : (
                        <img
                          height="100%"
                          width="40%"
                          style={{
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                          src={
                            extensionWithIcon[media.file_extension] ||
                            media.media_url
                          }
                          alt={`Media ${index}`}
                        />
                      )}
                    </Box>
                    <Box className="media-name">
                      <p>{media.file_name}</p>
                    </Box>
                  </Box>
                </Grid>
              );
            })
          ) : (
            <Box
              className="media-not-found-error"
              data-testid="not-found-animation-container"
            >
              <BaseNotFoundLottieLoader
                height={200}
                width={200}
              ></BaseNotFoundLottieLoader>
            </Box>
          )}

          {
            <Box
              ref={paginationRef}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                className="pagination-bar"
                currentPage={pageNumber}
                page={pageNumber}
                totalCount={totalMediaFiles}
                pageSize={pageSize}
                onPageChange={(page) =>
                  handleChangePage(page, ``, setPageNumber)
                }
                count={count}
              />
              <AutoCompletePagination
                rowsPerPage={pageSize}
                rowPerPageOptions={rowPerPageOptions}
                setRowsPerPageOptions={setRowsPerPageOptions}
                rowCount={totalMediaFiles}
                page={pageNumber}
                setPage={setPageNumber}
                setRowsPerPage={setPageSize}
              ></AutoCompletePagination>
            </Box>
          }
        </Grid>
      )}

      {/* File Info Drawer */}
      {filePreviewInDrawer && (
        <MediaGalleryFileInfoDrawer
          fileInfo={openFileViewDrawer ? filesData?.data : []}
          Isopen={openFileViewDrawer}
          isFetching={isFetching}
          fileDrawerOpener={setOpenFileViewDrawer}
          setFilePreviewInDrawer={setFilePreviewInDrawer}
          onPrev={onPrev}
          onNext={onNext}
          isFirstFile={currentFileIndex === 0}
          isLastFile={currentFileIndex === allfiles.length - 1}
        />
      )}

      {/* Bottom Action Bar */}
      {selectedFilesOpener.length > 0 && (
        <Box className="media-gallery-action-container">
          <Box className="media-gallery-action-wrapper">
            <Card className="media-gallery-card move-up">
              <Box className="media-gallery-content-container">
                <Box className="media-gallery-content">
                  <Typography variant="subtitle1">
                    {selectedFilesOpener.length} selected
                  </Typography>
                  <Box
                    onClick={() => {
                      setOpenMediaDeleteModal(true);
                    }}
                    className="media-gallery-action-content"
                  >
                    <DeleteOutlineOutlinedIcon /> Delete
                  </Box>
                  <Box
                    onClick={handleMediaFileDownload}
                    className="media-gallery-action-content"
                  >
                    {downloadLoading ? (
                      <CircularProgress size={25} color="info" />
                    ) : (
                      <>
                        <FileDownloadOutlinedIcon /> Download
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      )}

      <DeleteDialogue
        openDeleteModal={openMediaDeleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        handleDeleteSingleTemplate={handleDeleteMediaFiles}
        internalServerError={deleteFileInternalServerError}
        loading={loading}
        somethingWentWrong={mediaDeleteSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </>
  );
};

export default AllMediaGalleryFileSection;
