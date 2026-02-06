import { Card } from "@mui/material";
import React, { useEffect, useState } from "react";
import CallSummaryTableFilters from "./CallSummaryTableFilters";
import DateRangeShowcase from "../../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../../hooks/getDayMonthYear";
import CallSummaryTable from "./CallSummaryTable";
import { Box } from "@mui/system";
import Pagination from "../../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../../helperFunctions/pagination";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import {
  useGetInboundOutboundCallLogsQuery,
  usePrefetch,
} from "../../../../Redux/Slices/telephonySlice";
import useToasterHook from "../../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import useDebounce from "../../../../hooks/useDebounce";
import { apiCallFrontAndBackPage } from "../../../../helperFunctions/apiCallFrontAndBackPage";

const CallSummaryTableAndFilter = ({ callLogDashboard }) => {
  const [outboundDateRange, setOutboundDateRange] = useState([]);
  const [inboundDateRange, setInboundDateRange] = useState([]);
  const [outboundCallStatus, setOutboundCallStatus] = useState("");
  const [inboundCallStatus, setInboundCallStatus] = useState("");
  const [dialedBy, setDialedBy] = useState([]);
  const [answeredBy, setAnsweredBy] = useState([]);
  const [inboundSearchText, setInboundSearchText] = useState("");
  const [outboundSearchText, setOutboundSearchText] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [inboundRowPerPageOptions, setInboundRowsPerPageOptions] = useState([
    "4",
    "10",
    "20",
  ]);
  const [outboundRowPerPageOptions, setOutboundRowsPerPageOptions] = useState([
    "4",
    "10",
    "20",
  ]);
  const [totalCallDetails, setTotalCallDetails] = useState(0);
  const [outboundCallDetails, setOutboundCallDetails] = useState([]);
  const [inboundCallDetails, setInboundCallDetails] = useState([]);

  const [inboundPageNumber, setInboundPageNumber] = useState(1);
  const [inboundRowsPerPage, setInboundRowsPerPage] = useState(4);

  const [outboundPageNumber, setOutboundPageNumber] = useState(1);
  const [outboundRowsPerPage, setOutboundRowsPerPage] = useState(4);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const [outboundSortingColumn, setOutboundSortingColumn] = useState("");
  const [outboundSortingType, setOutboundSortingType] = useState(null);

  const [inboundSortingColumn, setInboundSortingColumn] = useState("");
  const [inboundSortingType, setInboundSortingType] = useState(null);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const debouncedSearchText = useDebounce(
    tabValue === 0 ? outboundSearchText : inboundSearchText,
    500
  );

  const inboundOutboundPayload = {
    sort:
      tabValue === 0
        ? outboundSortingType?.length > 0
        : inboundSortingType?.length > 0,
    sort_name: tabValue === 0 ? outboundSortingColumn : inboundSortingColumn,
    sort_type: tabValue === 0 ? outboundSortingType : inboundSortingType,
    search: debouncedSearchText,
    date_range:
      outboundDateRange?.length || inboundDateRange?.length
        ? JSON.parse(
            GetJsonDate(tabValue === 0 ? outboundDateRange : inboundDateRange)
          )
        : {},
  };

  if (tabValue === 0) {
    inboundOutboundPayload.dialed_by = dialedBy;
  } else {
    inboundOutboundPayload.answered_by = answeredBy;
  }

  const { data, error, isError, isSuccess, isFetching } =
    useGetInboundOutboundCallLogsQuery({
      collegeId,
      pageNumber: tabValue === 0 ? outboundPageNumber : inboundPageNumber,
      rowsPerPage: tabValue === 0 ? outboundRowsPerPage : inboundRowsPerPage,
      payload: inboundOutboundPayload,
      tabValue,
      callStatus: tabValue === 0 ? outboundCallStatus : inboundCallStatus,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          if (tabValue === 0) {
            setOutboundCallDetails(data?.data);
          } else {
            setInboundCallDetails(data?.data);
          }
          setTotalCallDetails(data?.total);
        } else {
          throw new Error(
            `${
              tabValue === 0 ? "Outbound" : "Inbound"
            } call details API response has changed`
          );
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, data, isSuccess]);

  const prefetchCallDetails = usePrefetch("getInboundOutboundCallLogs");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      tabValue === 0 ? outboundRowsPerPage : inboundRowsPerPage,
      tabValue === 0 ? outboundPageNumber : inboundPageNumber,
      collegeId,
      prefetchCallDetails,
      {
        payload: {
          ...inboundOutboundPayload,
        },
        tabValue,
        callStatus: tabValue === 0 ? outboundCallStatus : inboundCallStatus,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    prefetchCallDetails,
    inboundPageNumber,
    outboundPageNumber,
    inboundRowsPerPage,
    outboundRowsPerPage,
    collegeId,
    outboundCallStatus,
    inboundCallStatus,
    tabValue,
  ]);

  const totalCount = Math.ceil(
    totalCallDetails / tabValue === 0 ? outboundRowsPerPage : inboundRowsPerPage
  );

  return (
    <Card
      className="common-box-shadow"
      sx={{
        p: 3,
        borderRadius: 2.5,
        overflow: "visible",
        position: "relative",
      }}
    >
      {(tabValue === 0
        ? outboundDateRange.length > 1
        : inboundDateRange?.length > 1) && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(
            tabValue === 0 ? outboundDateRange[0] : inboundDateRange[0]
          )}
          endDateRange={getDateMonthYear(
            tabValue === 0 ? outboundDateRange[1] : inboundDateRange[0]
          )}
          triggeredFunction={() =>
            tabValue === 0 ? setOutboundDateRange([]) : setInboundDateRange([])
          }
        />
      )}
      <CallSummaryTableFilters
        dateRange={tabValue === 0 ? outboundDateRange : inboundDateRange}
        setDateRange={
          tabValue === 0 ? setOutboundDateRange : setInboundDateRange
        }
        dialedBy={dialedBy}
        setDialedBy={setDialedBy}
        answeredBy={answeredBy}
        setPageNumber={
          tabValue === 0 ? setOutboundPageNumber : setInboundPageNumber
        }
        setAnsweredBy={setAnsweredBy}
        searchText={tabValue === 0 ? outboundSearchText : inboundSearchText}
        setSearchText={
          tabValue === 0 ? setOutboundSearchText : setInboundSearchText
        }
        callStatus={tabValue === 0 ? outboundCallStatus : inboundCallStatus}
        setCallStatus={
          tabValue === 0 ? setOutboundCallStatus : setInboundCallStatus
        }
        tabValue={tabValue}
        setTabValue={setTabValue}
        callLogDashboard={callLogDashboard}
      />
      <CallSummaryTable
        callLogDashboard={callLogDashboard}
        tabValue={tabValue}
        tableData={tabValue === 0 ? outboundCallDetails : inboundCallDetails}
        isLoading={isFetching}
        isInternalServerError={isInternalServerError}
        isSomethingWentWrong={isSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
        sortingColumn={
          tabValue === 0 ? outboundSortingColumn : inboundSortingColumn
        }
        setSortingColumn={
          tabValue === 0 ? setOutboundSortingColumn : setInboundSortingColumn
        }
        sortingType={tabValue === 0 ? outboundSortingType : inboundSortingType}
        setSortingType={
          tabValue === 0 ? setOutboundSortingType : setInboundSortingType
        }
      />
      {!isFetching && (
        <>
          {(tabValue === 0
            ? outboundCallDetails?.length !== 0
            : inboundCallDetails?.length !== 0) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Pagination
                className="pagination-bar"
                currentPage={
                  tabValue === 0 ? outboundPageNumber : inboundPageNumber
                }
                totalCount={totalCallDetails}
                pageSize={
                  tabValue === 0 ? outboundRowsPerPage : inboundRowsPerPage
                }
                onPageChange={(page) =>
                  handleChangePage(
                    page,
                    "",
                    tabValue === 0
                      ? setOutboundPageNumber
                      : setInboundPageNumber
                  )
                }
                count={totalCount}
              />
              <AutoCompletePagination
                rowsPerPage={
                  tabValue === 0 ? outboundRowsPerPage : inboundRowsPerPage
                }
                rowPerPageOptions={
                  tabValue === 0
                    ? outboundRowPerPageOptions
                    : inboundRowPerPageOptions
                }
                setRowsPerPageOptions={
                  tabValue === 0
                    ? setOutboundRowsPerPageOptions
                    : setInboundRowsPerPageOptions
                }
                rowCount={totalCallDetails}
                page={tabValue === 0 ? outboundPageNumber : inboundPageNumber}
                setPage={
                  tabValue === 0 ? setOutboundPageNumber : setInboundPageNumber
                }
                setRowsPerPage={
                  tabValue === 0
                    ? setOutboundRowsPerPage
                    : setInboundRowsPerPage
                }
              ></AutoCompletePagination>
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

export default CallSummaryTableAndFilter;
