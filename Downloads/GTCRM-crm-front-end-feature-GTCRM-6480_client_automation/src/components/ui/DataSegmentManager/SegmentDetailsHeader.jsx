import {
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import FilterHeaderIcon from "../application-manager/FilterHeaderIcon";
import AddColumnIcon from "../../../../src/icons/add-column-icon.svg";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { defaultHeader } from "../../../constants/LeadStageList";
import SearchBox from "../../shared/SearchBox/SearchBox";
import SearchIcon from "../../../icons/search-icon.svg";
import FilterIcon from "../../../icons/filter-icon.svg";
import "../../../styles/ApplicationManagerTable.css";
import CustomTooltip from "../../shared/Popover/Tooltip";
import CreateDataSegmentDrawer from "./CreateDataSegmentDrawer";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Cookies from "js-cookie";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";
function SegmentDetailsHeader({
  addedColumn,
  setSearchText,
  searchText,
  setTableHeadList,
  setShowAddLeadPage,
  showAddLeadButton,
  setPageNumber,
  token,
  segmentId,
  collegeID,
  setApiResponseChangeMessage,
  setIsSomethingWentWrong,
  setIsInternalServerError,
  showFilterOption,
  setShowFilterOption,
  setShouldShowAddColumn,
  shouldShowAddColumn,
}) {
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [openDataSegmentDrawer, setOpenDataSegmentDrawer] = useState(false);
  const [dataSegmentDetailsLoading, setDataSegmentDetailsLoading] =
    useState(false);
  const [selectedDataSegment, setSelectedDataSegment] = useState({});
  const pushNotification = useToasterHook();
  const accessToken = Cookies.get("jwtTokenCredentialsAccessToken");
  useEffect(() => {
    setTableHeadList([...defaultHeader, ...addedColumn]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedColumn]);

  const handleGetDataSegmentDetails = () => {
    if (Object.keys(selectedDataSegment)?.length) {
      setOpenDataSegmentDrawer(true);
    } else {
      setDataSegmentDetailsLoading(true);
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/data_segment/get_by_name_or_id/?data_segment_id=${segmentId}${
          collegeID ? "&college_id=" + collegeID : ""
        }`,
        ApiCallHeaderAndBody(accessToken, "GET")
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.detail) {
            pushNotification("error", data.detail);
          } else if (data?.data) {
            const dataSegment = data?.data;
            try {
              if (typeof dataSegment === "object") {
                setSelectedDataSegment(dataSegment);
                setOpenDataSegmentDrawer(true);
              } else {
                throw new Error(
                  "data_segment/get_by_name_or_id API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(setIsSomethingWentWrong, "", 10000);
            }
          }
        })
        .catch(() => {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        })
        .finally(() => {
          setDataSegmentDetailsLoading(false);
        });
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Box className="segment-details-header">
        <Box className="segment-details-search-and-add-column">
          <ClickAwayListener onClickAway={() => setSearchFieldToggle(false)}>
            <Box>
              {!searchFieldToggle ? (
                <Box sx={{ cursor: "pointer" }}>
                  <img
                    onClick={() => setSearchFieldToggle(true)}
                    src={SearchIcon}
                    alt="search"
                  />
                </Box>
              ) : (
                <Box>
                  <SearchBox
                    setSearchText={setSearchText}
                    searchText={searchText}
                    setPageNumber={setPageNumber}
                    setAllDataFetched={() => {}}
                    maxWidth={250}
                    className="data-segment-details-search-box"
                    searchBoxColor="info"
                  />
                </Box>
              )}
            </Box>
          </ClickAwayListener>

          <Box
            onClick={() => {
              setShowFilterOption((prev) => !prev);
            }}
            className={`${
              showFilterOption
                ? "filter-header-items-active"
                : "filter-header-items-inactive"
            } filter-header-items`}
          >
            Filter
            <img src={FilterIcon} alt="all-column-icon" />
          </Box>

          <FilterHeaderIcon
            icon={AddColumnIcon}
            condition={shouldShowAddColumn}
            action={() => setShouldShowAddColumn((prev) => !prev)}
            sx={{ p: "5px 12px" }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {token ? (
            <>
              {showAddLeadButton && (
                <Box>
                  <Button
                    onClick={() => setShowAddLeadPage(true)}
                    className="common-contained-button"
                    endIcon={<AddIcon />}
                  >
                    Add Lead{" "}
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <>
              {showAddLeadButton && (
                <Box>
                  <Button
                    onClick={() => setShowAddLeadPage(true)}
                    className="common-contained-button"
                    endIcon={<AddIcon />}
                  >
                    Add Lead{" "}
                  </Button>
                </Box>
              )}
            </>
          )}
          {dataSegmentDetailsLoading ? (
            <CircularProgress color="info" size={30} />
          ) : (
            <CustomTooltip
              component={
                <Box
                  onClick={handleGetDataSegmentDetails}
                  className="data-segment-details-preview"
                >
                  <VisibilityIcon color="info" />
                </Box>
              }
              description="Click to see the preview of this data segment."
              title="Preview"
            />
          )}
        </Box>
      </Box>

      <CreateDataSegmentDrawer
        openCreateDataSegmentDrawer={openDataSegmentDrawer}
        setOpenCreateDataSegmentDrawer={setOpenDataSegmentDrawer}
        selectedDataSegment={selectedDataSegment}
      />
    </Box>
  );
}

export default SegmentDetailsHeader;
