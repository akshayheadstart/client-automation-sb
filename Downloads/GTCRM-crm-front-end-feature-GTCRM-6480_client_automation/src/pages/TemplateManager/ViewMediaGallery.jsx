import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  TextField,
  ClickAwayListener,
  InputAdornment,
} from "@mui/material";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import NewSearchIcon from "../../icons/search-icon.svg";
import SearchIcon from "@mui/icons-material/Search";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useGetAllUserDataQuery } from "../../Redux/Slices/filterDataSlice";
import { mediaTypeFilters } from "../../utils/MediaFilters";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import AllMediaGalleryFileSection from "./AllMediaGalleryFileSection";
import GetJsonDate from "../../hooks/GetJsonDate";

const ViewMediaGallery = ({
  filesData,
  hideMediaFiles,
  isFetching,
  totalMediaFiles,
  onFilterChange,
  pageSize,
  setPageSize,
  setPageNumber,
  pageNumber,
  filterParams,
  mediaFilesListSomethingWentWrong,
  mediaFilesListInternalServerError,
}) => {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [fileUploadDataRange, setFileUploadDataRange] = useState([]);
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);
  const [skipUserListAPICall, setSkipUserListAPICall] = useState(true);
  const [allUserInfoData, setAllUserInfoData] = useState([]);
  const [mediaTypeValue, setMediaTypeValue] = useState(filterParams.media_type);
  const [uploadedByValue, setUploadedByValue] = useState(
    filterParams.uploaded_by
  );

  const { data: allUserList, isLoading } = useGetAllUserDataQuery(
    {},
    { skip: skipUserListAPICall }
  );
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);
  useEffect(() => {
    if (!skipUserListAPICall) {
      const allUserData = allUserList?.data[0];

      if (allUserData) {
        const FilterFieldData = allUserData?.map((user) => ({
          label: user.user_name,
          value: user.user_email,
        }));
        setAllUserInfoData(FilterFieldData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUserList, skipUserListAPICall]);

  // =========================Handle Change Function For Filters======================
  const handleMediaTypeChange = (value) => {
    onFilterChange((prevBody) => ({
      ...prevBody,
      ...(value ? { media_type: value } : {}),
    }));
  };

  const handleUploadedByChange = (value) => {
    setUploadedByValue(value);
    onFilterChange((prevBody) => ({
      ...prevBody,
      uploaded_by: value,
    }));
  };

  const handleSearchTextChange = (value) => {
    onFilterChange((prevBody) => ({
      ...prevBody,
      search: value,
    }));
  };

  const handleDateRangeChange = (value) => {
    const payloadData = JSON.parse(GetJsonDate(value));
    onFilterChange((prevBody) => ({
      ...prevBody,
      date_range: payloadData,
    }));
    setFileUploadDataRange(value);
  };
  return (
    <>
      {mediaFilesListSomethingWentWrong || mediaFilesListInternalServerError ? (
        <Box className="loading-animation-for-notification">
          {mediaFilesListInternalServerError && (
            <Error500Animation height={300} width={300}></Error500Animation>
          )}
          {mediaFilesListSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            padding: "20px",
            width: "100%",
            visibility: hideMediaFiles ? "hidden" : "visible",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <MultipleFilterSelectPicker
                setSelectedPicker={setMediaTypeValue}
                pickerData={mediaTypeFilters}
                placeholder="Media Type"
                callAPIAgain={() => {
                  handleMediaTypeChange(mediaTypeValue);
                }}
                onClean={() => {
                  setMediaTypeValue([]);
                  handleMediaTypeChange([]);
                }}
                placement="bottom"
                style={{ width: "150px" }}
                value={mediaTypeValue}
                pickerValue={mediaTypeValue}
              />
              <MultipleFilterSelectPicker
                loading={isLoading}
                setSelectedPicker={setUploadedByValue}
                pickerData={allUserInfoData}
                placeholder="Uploaded By"
                callAPIAgain={() => {
                  handleUploadedByChange(uploadedByValue);
                }}
                onClean={() => {
                  setUploadedByValue([]);
                  handleUploadedByChange([]);
                }}
                onOpen={() => {
                  setSkipUserListAPICall(false);
                }}
                placement="bottom"
                style={{ width: "150px" }}
                value={uploadedByValue}
                pickerValue={uploadedByValue}
              />
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <ClickAwayListener
                onClickAway={() => {
                  if (
                    filterParams.search === "" ||
                    filterParams.search === "undefined"
                  ) {
                    setShowSearchBox(false);
                    handleSearchTextChange("");
                  }
                }}
              >
                {(!showSearchBox && filterParams.search === "") ||
                filterParams.search === "undefined" ? (
                  <IconButton
                    className="Navbar-search-Icon"
                    onClick={() => setShowSearchBox(true)}
                    aria-label="search"
                  >
                    <img className="Navbar-search-Icon" src={NewSearchIcon} />
                  </IconButton>
                ) : (
                  <Box>
                    <TextField
                      value={filterParams.search}
                      data-testid="Search-Text"
                      onChange={(event) => {
                        handleSearchTextChange(event.target.value);
                        setShowSearchBox(true);
                      }}
                      placeholder="Search"
                      size="small"
                      color="info"
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            {filterParams.search?.length > 0 ? (
                              <CloseIcon
                                className="search-box-close-icon"
                                onClick={() => {
                                  handleSearchTextChange("");
                                  setShowSearchBox(false);
                                }}
                              />
                            ) : (
                              <SearchIcon className="search-box-search-icon" />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </ClickAwayListener>

              <IconDateRangePicker
                onChange={(value) => {
                  handleDateRangeChange(value);
                }}
                dateRange={fileUploadDataRange}
              />
            </Box>
          </Box>

          <Box className="Media-Gallery-all-files-section">
            <AllMediaGalleryFileSection
              allfiles={filesData}
              paginationRef={paginationRef}
              isFetching={isFetching}
              totalMediaFiles={totalMediaFiles}
              setPageSize={setPageSize}
              pageSize={pageSize}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default ViewMediaGallery;
