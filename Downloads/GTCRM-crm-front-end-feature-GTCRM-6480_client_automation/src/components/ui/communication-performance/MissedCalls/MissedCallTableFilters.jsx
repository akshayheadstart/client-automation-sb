import { ClickAwayListener, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import MultipleFilterSelectPicker from "../../../shared/filters/MultipleFilterSelectPicker";
import IconDateRangePicker from "../../../shared/filters/IconDateRangePicker";
import SearchIcon from "../../../../icons/search-icon.svg";
import SearchBox from "../../../shared/SearchBox/SearchBox";
import { handleFormatInputDate } from "../../../../hooks/GetJsonDate";
import { useGetCounselorListQuery } from "../../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { useCommonApiCalls } from "../../../../hooks/apiCalls/useCommonApiCalls";
import { organizeCounselorFilterOption } from "../../../../helperFunctions/filterHelperFunction";
import { useGetLandingNumbersQuery } from "../../../../Redux/Slices/telephonySlice";
import FilterSelectPicker from "../../../shared/filters/FilterSelectPicker";
import { generalNumberValidation } from "../../../shared/forms/Validation";

function MissedCallTableFilters({
  selectedLandingNumbers,
  setSelectedLandingNumbers,
  setSelectedCounsellors,
  dateRange,
  setDateRange,
  searchValue,
  setSearchValue,
  setPageNumber,
}) {
  const [landingNumbers, setLandingNumbers] = useState([]);
  const [skipCallLandingNumberAPI, setSkipCallLandingNumberAPI] =
    useState(true);
  const [counsellors, setCounsellors] = useState([]);
  const [skipCallCounsellorAPI, setSkipCallCounsellorAPI] = useState(true);
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [selectedCounsellorId, setSelectedCounsellorId] = useState([]);

  const { handleFilterListApiCall } = useCommonApiCalls();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId },
    {
      skip: skipCallCounsellorAPI,
    }
  );
  const landingNumberInfo = useGetLandingNumbersQuery(
    { collegeId },
    { skip: skipCallLandingNumberAPI }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCallCounsellorAPI) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellors,
        null,
        organizeCounselorFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallCounsellorAPI, counselorListApiCallInfo]);

  // get landing numbers
  useEffect(() => {
    if (!skipCallLandingNumberAPI) {
      const landingNumberList = landingNumberInfo.data?.data;
      const modifyLandingNumbers = (numbers) =>
        numbers.map((number) => ({ label: number, value: number }));
      handleFilterListApiCall(
        landingNumberList,
        landingNumberInfo,
        setLandingNumbers,
        null,
        modifyLandingNumbers
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCallLandingNumberAPI, landingNumberInfo]);

  return (
    <Box className="missed-call-table-filter-container common-flex-layout">
      <Box>
        <Typography>Missed Calls</Typography>
        <Typography>
          {dateRange?.length > 0 &&
            `${handleFormatInputDate(dateRange[0])} - ${handleFormatInputDate(
              dateRange[1]
            )}`}
        </Typography>
      </Box>
      <Box className="common-flex-layout">
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
                  setSearchText={setSearchValue}
                  searchText={searchValue}
                  setPageNumber={setPageNumber}
                  setAllDataFetched={() => {}}
                  maxWidth={250}
                  className="call-summary-search-box-text-field"
                  searchBoxColor="info"
                  type="number"
                  onKeyDown={generalNumberValidation}
                />
              </Box>
            )}
          </Box>
        </ClickAwayListener>

        <FilterSelectPicker
          style={{ width: "140px" }}
          placement="bottomEnd"
          setSelectedPicker={setSelectedLandingNumbers}
          pickerData={landingNumbers}
          placeholder="Landing Numbers"
          pickerValue={selectedLandingNumbers}
          setPageNumber={setPageNumber}
          className="select-picker"
          onOpen={() => setSkipCallLandingNumberAPI(false)}
        />
        <MultipleFilterSelectPicker
          style={{ width: "140px" }}
          placement="bottomEnd"
          placeholder="Counsellor"
          onChange={(value) => {
            setSelectedCounsellorId(value);
          }}
          pickerData={counsellors}
          setSelectedPicker={setSelectedCounsellorId}
          pickerValue={selectedCounsellorId}
          loading={counselorListApiCallInfo?.isFetching}
          onOpen={() => setSkipCallCounsellorAPI(false)}
          className="select-picker"
          callAPIAgain={() => {
            setSelectedCounsellors(selectedCounsellorId);
            setPageNumber(1);
          }}
          onClean={() => {
            setSelectedCounsellors([]);
            setPageNumber(1);
          }}
        />
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(value) => setDateRange(value)}
          customWidthHeight={38}
        />
      </Box>
    </Box>
  );
}

export default MissedCallTableFilters;
