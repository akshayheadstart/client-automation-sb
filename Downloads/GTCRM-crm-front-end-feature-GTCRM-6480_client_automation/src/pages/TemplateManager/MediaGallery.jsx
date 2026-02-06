import React, { useEffect, useRef, useContext, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import uploadIcon from "../../images/Upload.svg";
import "../../styles/mediaGallery.css";
import { Box, Grid, Typography } from "@mui/material";
import useToasterHook from "../../hooks/useToasterHook";
import useFileDrop from "../../helperFunctions/useFileDrop";
import ViewMediaGallery from "./ViewMediaGallery";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";
import useDebounce from "../../hooks/useDebounce";
import {
  useGetAllMediaFilesQuery,
  useUploadMediaFilesMutation,
} from "../../Redux/Slices/mediaGallery";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";

const MediaGallery = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const pushNotification = useToasterHook();
  const [uploadloading, setUploadLoading] = useState(false);
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const inputRef = useRef(null);
  const [mediaFilesData, setMediaFilesData] = useState([]);
  const [totalMediaFiles, setTotalMediaFiles] = useState();
  const [hideMediaFiles, setHideMediaFiles] = useState(false);

  const [
    mediaFilesListSomethingWentWrong,
    setMediaFilesListSomethingWentWrong,
  ] = useState(false);

  const [
    mediaFilesListInternalServerError,
    setMediaFilesListInternalServerError,
  ] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [filterParams, setFilterParams] = useState({
    media_type: [],
    uploaded_by: [],
    date_range: {},
    search: "",
  });

  const debouncedSearchText = useDebounce(filterParams, 500);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const {
    data: mediaFiles,
    isError,
    error,
    isSuccess,
    isFetching,
    refetch,
  } = useGetAllMediaFilesQuery({
    collegeId,
    debouncedSearchText,
    page_num: pageNumber,
    page_size: pageSize,
  });

  const [uploadMediaFiles] = useUploadMediaFilesMutation();

  useEffect(() => {
    setHeadTitle("Media Gallery");
    document.title = "Media Gallery";
  }, [headTitle]);
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(mediaFiles?.data)) {
          setMediaFilesData(mediaFiles?.data);
          setTotalMediaFiles(mediaFiles?.total);
        } else {
          throw new Error("get all media files API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setMediaFilesListInternalServerError,
            setHideMediaFiles,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setMediaFilesListSomethingWentWrong,
        setHideMediaFiles,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaFiles, error, isError, isSuccess]);

  //handle File Input through select
  const handleFileInputChange = (event) => {
    setUploadLoading(true);
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const fileSize = files[0].size;
      const totalFileSize = fileSize / (1024 * 1024); // Convert file size to MB
      const maxSize = 100; // 100MB
      if (totalFileSize > maxSize) {
        pushNotification(
          "error",
          "File size exceeds 100MB. Please select a smaller file."
        );
        // Clear the file input (optional)
        inputRef.current.value = null;
        return;
      }
      const file = files[0];
      uploadMediaFiles({ collegeId, file })
        .unwrap()
        .then((res) => {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          } else if (res?.message) {
            pushNotification("success", res?.message);
          }
        })
        .catch((error) => {
          pushNotification("error", error?.data?.detail);
        })
        .finally(() => setUploadLoading(false));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  //handle media upload though drag and drop
  const handleDragnDrop = (collegeId, file) => {
    uploadMediaFiles({ collegeId, file })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          pushNotification("success", res?.message);
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => setLoading(false));
  };

  const { handleDrop, setRef } = useFileDrop(
    100,
    pushNotification,
    handleDragnDrop,
    collegeId
  );

  const handleFilterChange = (newFilters) => {
    setFilterParams(newFilters);
  };

  return (
    <Box sx={{ mx: 3 }} className="media-gallery-view-container">
      <Grid container spacing={1}>
        <Grid
          className="media-gallery-upload-section"
          item
          sm={12}
          md={12}
          xs={12}
        >
          <input
            id="file-input"
            style={{ display: "none" }}
            ref={(ref) => {
              setRef(ref);
              inputRef.current = ref;
            }}
            type="file"
            accept={
              ".jpg,.jpeg,.png,.gif,.zip,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
            }
            multiple={false}
            onChange={(e) => handleFileInputChange(e)}
          />
          {uploadloading ? (
            <Box className="loading-animation-for-media-files">
              <LeefLottieAnimationLoader
                height={100}
                width={100}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <label htmlFor="file-input">
              <Box
                id="drop-area"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e)}
                display="flex"
                justifyContent="center"
                sx={{
                  cursor: "pointer",
                }}
                alignItems="center"
                flexDirection="column"
                gap={0}
                width="100%"
              >
                <img src={uploadIcon} width="45px" />
                <Typography className="media-gallery-text-upload">
                  Drop Files to upload
                </Typography>

                <div className="media-gallery-file-upload-separator">
                  <div className="line"></div>
                  <span className="line-text">OR</span>
                  <div className="line"></div>
                </div>

                <Typography className="media-gallery-select-text">
                  Select a file
                </Typography>
                <Typography
                  variant="caption"
                  className="media-gallery-text-info-bottom"
                  fontWeight="bold"
                  mt={1}
                >
                  Maximum upload size 100mb
                </Typography>
                <Typography
                  variant="caption"
                  className="media-gallery-text-info-bottom"
                  fontWeight="bold"
                >
                  File accepted videos, photos, zip, Doc/Docx, Xlx/xlsx,
                  ppt/pptx, pdf
                </Typography>
              </Box>
            </label>
          )}
        </Grid>
        <Grid item sm={12} md={12} xs={12} className="View-Media-section">
          <ViewMediaGallery
            filesData={mediaFilesData}
            hideMediaFiles={hideMediaFiles}
            setPageSize={setPageSize}
            pageSize={pageSize}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            mediaFilesListInternalServerError={
              mediaFilesListInternalServerError
            }
            mediaFilesListSomethingWentWrong={mediaFilesListSomethingWentWrong}
            isFetching={isFetching}
            filterParams={filterParams}
            refetch={refetch}
            totalMediaFiles={totalMediaFiles}
            onFilterChange={handleFilterChange}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MediaGallery;
