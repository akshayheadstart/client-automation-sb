import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import MultipleTabs from "../../../shared/tab-panel/MultipleTabs";
import {
  callStatusFilterList,
  inboundOutboundCallTab,
} from "../../../../constants/LeadStageList";
import IconDateRangePicker from "../../../shared/filters/IconDateRangePicker";
import FilterSelectPicker from "../../../shared/filters/FilterSelectPicker";
import MultipleFilterSelectPicker from "../../../shared/filters/MultipleFilterSelectPicker";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { ClickAwayListener } from "@mui/material";
import SearchBox from "../../../shared/SearchBox/SearchBox";
import {
  useGetAnsweredByUsersQuery,
  useGetDialedByUsersQuery,
} from "../../../../Redux/Slices/telephonySlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../../hooks/useToasterHook";
const CallSummaryTableFilters = ({
  dateRange,
  setDateRange,
  setDialedBy,
  searchText,
  setSearchText,
  setCallStatus,
  callStatus,
  tabValue,
  setTabValue,
  setAnsweredBy,
  setPageNumber,
  callLogDashboard,
}) => {
  const [showSearchTextField, setShowSearchTextField] = useState(false);
  const [dialedByUserList, setDialedByUserList] = useState([]);
  const [skipDialedByApi, setSkipDialedByApi] = useState(true);

  const [answeredByUserList, setAnsweredByUserList] = useState([]);
  const [skipAnsweredByApi, setSkipAnsweredByApi] = useState(true);
  const [hideDialedByFilter, setHideDialedByFilter] = useState(false);
  const [hideAnsweredByFilter, setHideAnsweredByFilter] = useState(false);

  const [dialedByValue, setDialedByValue] = useState([]);
  const [answeredByValue, setAnsweredByValue] = useState([]);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const commonFilterErrorHandling = ({
    isSuccess,
    data,
    setList,
    isError,
    error,
    setHideFilter,
  }) => {
    try {
      if (isSuccess) {
        if (Array.isArray(data)) {
          const modifiedDialedByData = data?.map((user) => {
            return { label: user?.name, value: user?.id };
          });
          setList(modifiedDialedByData);
        } else {
          throw new Error("Get dialed by user API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          setHideFilter(true);
        }
      }
    } catch {
      setHideFilter(true);
    }
  };

  const {
    data: dialedByData,
    error: dialedByError,
    isError: isDialedByError,
    isSuccess: isDialedBySuccess,
    isFetching: isDialedByFetching,
  } = useGetDialedByUsersQuery({ collegeId }, { skip: skipDialedByApi });

  useEffect(() => {
    commonFilterErrorHandling({
      data: dialedByData?.data[0],
      error: dialedByError,
      isError: isDialedByError,
      isSuccess: isDialedBySuccess,
      setList: setDialedByUserList,
      setHideFilter: setHideDialedByFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDialedBySuccess, isDialedByError, dialedByError, dialedByData]);

  const { data, error, isError, isSuccess, isFetching } =
    useGetAnsweredByUsersQuery({ collegeId }, { skip: skipAnsweredByApi });

  useEffect(() => {
    commonFilterErrorHandling({
      data: data?.data[0],
      error,
      isError,
      isSuccess,
      setList: setAnsweredByUserList,
      hideFilter: setHideAnsweredByFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, error, isSuccess]);

  return (
    <Box className="call-summary-filter-container">
      <Box>
        <MultipleTabs
          tabArray={inboundOutboundCallTab}
          setMapTabValue={setTabValue}
          mapTabValue={tabValue}
          boxWidth="200px !important"
        />
      </Box>
      <Box className="call-summary-search-and-filter">
        <ClickAwayListener onClickAway={() => setShowSearchTextField(false)}>
          <Box>
            {showSearchTextField ? (
              <Box>
                <SearchBox
                  setSearchText={setSearchText}
                  searchText={searchText}
                  setPageNumber={setPageNumber}
                  setAllDataFetched={() => {}}
                  maxWidth={200}
                  className="call-summary-search-box-text-field"
                  searchBoxColor="info"
                />
              </Box>
            ) : (
              <SearchOutlinedIcon
                color="info"
                sx={{ cursor: "pointer", display: "flex" }}
                onClick={() => setShowSearchTextField(true)}
              />
            )}
          </Box>
        </ClickAwayListener>
        {!callLogDashboard && (
          <>
            {(tabValue === 0 ? !hideDialedByFilter : !hideAnsweredByFilter) && (
              <MultipleFilterSelectPicker
                style={{ width: "140px" }}
                onChange={(value) => {
                  tabValue === 0
                    ? setDialedByValue(value)
                    : setAnsweredByValue(value);
                }}
                setSelectedPicker={
                  tabValue === 0 ? setDialedByValue : setAnsweredByValue
                }
                pickerData={
                  tabValue === 0 ? dialedByUserList : answeredByUserList
                }
                placeholder={tabValue === 0 ? "Dialed By" : "Answered By"}
                pickerValue={tabValue === 0 ? dialedByValue : answeredByValue}
                loading={tabValue === 0 ? isDialedByFetching : isFetching}
                className="select-picker"
                onOpen={() => {
                  tabValue === 0
                    ? setSkipDialedByApi(false)
                    : setSkipAnsweredByApi(false);
                }}
                callAPIAgain={() => {
                  tabValue === 0
                    ? setDialedBy(dialedByValue)
                    : setAnsweredBy(answeredByValue);
                  setPageNumber(1);
                }}
                onClean={() => {
                  tabValue === 0 ? setDialedBy([]) : setAnsweredBy([]);
                  setPageNumber(1);
                }}
              />
            )}
          </>
        )}

        <FilterSelectPicker
          setSelectedPicker={setCallStatus}
          pickerData={callStatusFilterList}
          placeholder="Call Status"
          pickerValue={callStatus}
          style={{ width: "140px" }}
          placement="bottomEnd"
        />
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(value) => setDateRange(value)}
          customWidthHeight={37}
        />
      </Box>
    </Box>
  );
};

export default CallSummaryTableFilters;
