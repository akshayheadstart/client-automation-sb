import { CircularProgress, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import IconDateRangePicker from "../../../shared/filters/IconDateRangePicker";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import IndicatorDropDown from "../../../shared/DropDownButton/IndicatorDropDown";
import IndicatorImage from "../../../../images/indicatorImage.svg";
import { indicatorValue } from "../../../../constants/LeadStageList";
import TableHeadingAndDate from "./TableHeadingAndDate";
import { useDownloadCallQualityDetailsMutation } from "../../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import useToasterHook from "../../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
const CallQualityTableFilters = ({
  indicator,
  setIndicator,
  dateRange,
  setDateRange,
  setPageNumber,
  pageNumber,
  rowsPerPage,
}) => {
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [downloadCallQualityDetails] = useDownloadCallQualityDetailsMutation();
  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const handleDownloadCallQualityDetails = () => {
    setIsDownloadLoading(true);
    downloadCallQualityDetails({
      collegeId,
      indicator,
      pageNumber,
      rowsPerPage,
      payload: JSON.parse(GetJsonDate(dateRange)),
    })
      .unwrap()
      .then((response) => {
        try {
          if (
            response?.download_url.message &&
            response?.download_url?.file_url
          ) {
            pushNotification("success", response?.download_url.message);
            window.open(response?.download_url?.file_url);
          } else {
            throw new Error(
              "Call quality details download API response has been changed."
            );
          }
        } catch (error) {
          pushNotification("error", error?.message);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
      })
      .finally(() => {
        setIsDownloadLoading(false);
      });
  };
  return (
    <Box className="call-quality-filter-container">
      <Box>
        <TableHeadingAndDate title="Call Quality" dateRange={dateRange} />
      </Box>
      <Box>
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setPageNumber(1);
          }}
        />
        <IndicatorDropDown
          indicator={indicator}
          image={IndicatorImage}
          indicatorValue={indicatorValue}
          setIndicator={setIndicator}
        ></IndicatorDropDown>
        {isDownloadLoading ? (
          <CircularProgress color="info" size={25} />
        ) : (
          <IconButton
            onClick={handleDownloadCallQualityDetails}
            className="download-button-dashboard"
          >
            <FileDownloadOutlinedIcon color="info" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CallQualityTableFilters;
