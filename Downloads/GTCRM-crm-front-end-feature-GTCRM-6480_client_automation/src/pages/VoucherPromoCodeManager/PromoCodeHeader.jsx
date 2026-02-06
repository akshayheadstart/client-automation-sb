/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import { startAndEndDateSelect } from "../../utils/adminDashboardDateRangeSelect";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { useSelector } from "react-redux";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { useGetAllCourseListQuery } from "../../Redux/Slices/filterDataSlice";
import { organizeCourseFilterCourseSpecializationOption } from "../../helperFunctions/filterHelperFunction";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
const PromoCodeHeader = ({
  filterDateValue,
  setFilterDateValue,
  title,
  handlePromoCodeVoucherOpen,
  programDisabled,
  selectedCourseId,
  setSelectedCourseId,
  createButtonShow,
  createButtonText,
  handleDownloadData,
  renderSection,
  setIsSkipCallApi,
  setPageNumber,
  downloadLoading
}) => {
  const [courseDetails, setCourseDetails] = useState([]);
  const [skipCourseApiCall, setSkipCourseApiCall] = useState(true);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);
  //get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: skipCourseApiCall }
  );
  useEffect(() => {
    if (!skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setCourseDetails,
        setHideCourseList,
        organizeCourseFilterCourseSpecializationOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, skipCourseApiCall]);
  const { selectedSeason } = useContext(LayoutSettingContext);
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(() => {
    if (filterDateValue?.length > 1) {
      setStartDateRange(getDateMonthYear(filterDateValue[0]));
      setEndDateRange(getDateMonthYear(filterDateValue[1]));
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [filterDateValue]);
  return (
    <>
      {filterDateValue?.length > 0 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => {
            setFilterDateValue([]);
            // setIsSkipCallApi(true);
          }}
        ></DateRangeShowcase>
      )}
      <Box className="promoCode-header-box-container">
        <Typography className="promoCode-section-title">{title}</Typography>
        <Box className="promoCode-filter-download-box">
          {createButtonShow && (
            <Button
              color="info"
              sx={{ borderRadius: 50 }}
              variant="outlined"
              className="create-promoCode-voucher-button"
              onClick={handlePromoCodeVoucherOpen}
            >
              {createButtonText}
            </Button>
          )}
          {hideCourseList || (
            <MultipleFilterSelectPicker
              style={{ width: "150px" }}
              placement="bottomEnd"
              placeholder="Program Name"
              className="dashboard-select-picker"
              onChange={(value) => {
                setSelectedCourseId(value);
              }}
              disableField={programDisabled}
              pickerData={courseDetails}
              setSelectedPicker={setSelectedCourseId}
              pickerValue={selectedCourseId}
              loading={courseListInfo.isFetching}
              onOpen={() => setSkipCourseApiCall(false)}
              callAPIAgain={() => {setIsSkipCallApi((prev) => !prev);setPageNumber(1) }}
              onClean={() => {setIsSkipCallApi((prev) => !prev); setPageNumber(1)}}
            />
          )}
          <IconDateRangePicker
            onChange={(value) => {
              setFilterDateValue(value);
              setPageNumber(1)
            }}
            dateRange={filterDateValue}
          ></IconDateRangePicker>
          <IconButton
            className="download-button-dashboard"
            aria-label="Download"
            onClick={handleDownloadData}
          >
            {
              downloadLoading?
              <CircularProgress size={22} color="info" />
              :
            <FileDownloadOutlinedIcon sx={{ color: "#39A1D1" }} />
            }
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default PromoCodeHeader;
