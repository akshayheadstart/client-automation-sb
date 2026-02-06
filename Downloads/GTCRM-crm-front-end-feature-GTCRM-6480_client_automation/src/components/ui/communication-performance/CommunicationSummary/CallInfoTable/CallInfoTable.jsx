import { Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import DateRangeShowcase from "../../../../shared/CalendarTimeData/DateRangeShowcase";
import { Box } from "@mui/system";
import Pagination from "../../../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../../../helperFunctions/pagination";
import CallInfoTableFilters from "./CallInfoTableFilters";
import { getDateMonthYear } from "../../../../../hooks/getDayMonthYear";
import CallInfoTableDetails from "./CallInfoTableDetails";
import { useSelector } from "react-redux";
import useCommonErrorHandling from "../../../../../hooks/useCommonErrorHandling";
import { DashboradDataContext } from "../../../../../store/contexts/DashboardDataContext";
import {
  useGetCallInfoQuery,
  usePrefetch,
} from "../../../../../Redux/Slices/telephonySlice";
import { handleSomethingWentWrong } from "../../../../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../../../../helperFunctions/apiCallFrontAndBackPage";
import GetJsonDate from "../../../../../hooks/GetJsonDate";
import ErrorAndSomethingWentWrong from "../../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import BaseNotFoundLottieLoader from "../../../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../../../shared/Loader/LeefLottieAnimationLoader";

const CallInfoTable = ({ features }) => {
  const [dateRange, setDateRange] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [appliedCounsellor, setAppliedCounsellor] = useState([]);
  const [sortingType, setSortingType] = useState("");
  const [sortingColumn, setSortingColumn] = useState("");

  const [callInfoDetails, setCallInfoDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalCallInfo, setTotalCallInfo] = useState(0);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "6",
    "10",
    "20",
    "50",
  ]);
  const [hideCallInfoTable, setHideCallInfoTable] = useState(false);
  const { isInternalServerError, setIsInternalServerError } = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleError = useCommonErrorHandling();

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { data, isError, error, isFetching, isSuccess } = useGetCallInfoQuery({
    pageNumber,
    rowsPerPage,
    collegeId,
    payload: {
      date_range: JSON.parse(GetJsonDate(dateRange)),
      sort: sortingType?.length ? true : false,
      sort_name: sortingColumn,
      sort_type: sortingType,
      counsellors: appliedCounsellor,
    },
    callType: tabValue === 0 ? "Outbound" : "Inbound",
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTotalCallInfo(data?.total);
          setCallInfoDetails(data?.data);
        } else {
          throw new Error("Call info details api response is changed.");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setIsInternalServerError,
          setHide: setHideCallInfoTable,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSomethingWentWrong,
        setHideCallInfoTable,
        5000
      );
    }
  }, [isSuccess, isError, error, data]);

  const prefetchCallDetails = usePrefetch("getCallInfo");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchCallDetails,
      {
        payload: {
          date_range: JSON.parse(GetJsonDate(dateRange)),
          sort: sortingType?.length ? true : false,
          sort_name: sortingColumn,
          sort_type: sortingType,
          counsellors: appliedCounsellor,
        },
        callType: tabValue === 0 ? "Outbound" : "Inbound",
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rowsPerPage, pageNumber, dateRange, tabValue]);

  const count = Math.ceil(totalCallInfo / rowsPerPage);

  return (
    <Card
      sx={{ display: hideCallInfoTable ? "none" : "block" }}
      className="common-box-shadow communication-summary-table-container"
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <ErrorAndSomethingWentWrong
          isInternalServerError={isInternalServerError}
          isSomethingWentWrong={isSomethingWentWrong}
          containerHeight="20vh"
        />
      ) : (
        <>
          {dateRange?.length > 0 && (
            <DateRangeShowcase
              startDateRange={getDateMonthYear(dateRange[0])}
              endDateRange={getDateMonthYear(dateRange[1])}
              triggeredFunction={() => setDateRange([])}
            />
          )}
          <CallInfoTableFilters
            dateRange={dateRange}
            tabValue={tabValue}
            setTabValue={setTabValue}
            setAppliedCounsellor={setAppliedCounsellor}
            setPageNumber={setPageNumber}
            setDateRange={setDateRange}
            setSortingType={setSortingType}
            setSortingColumn={setSortingColumn}
          />
          {isFetching ? (
            <>
              <Box
                data-testid="loading-container"
                className="common-not-found-container "
              >
                <LeefLottieAnimationLoader width={130} height={130} />
              </Box>
            </>
          ) : (
            <>
              {callInfoDetails?.length > 0 ? (
                <>
                  <CallInfoTableDetails
                    sortingColumn={sortingColumn}
                    setSortingColumn={setSortingColumn}
                    sortingType={sortingType}
                    setSortingType={setSortingType}
                    tabValue={tabValue}
                    callInfoDetails={callInfoDetails}
                  />
                  <Box className="common-pagination-container">
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      totalCount={totalCallInfo}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(page, "", setPageNumber)
                      }
                      count={count}
                    />
                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={totalCallInfo}
                      page={pageNumber}
                      setPage={setPageNumber}
                      setRowsPerPage={setRowsPerPage}
                    ></AutoCompletePagination>
                  </Box>
                </>
              ) : (
                <>
                  <Box className="common-not-found-container">
                    <BaseNotFoundLottieLoader width={200} height={200} />
                  </Box>
                </>
              )}
            </>
          )}
        </>
      )}
    </Card>
  );
};

export default CallInfoTable;
