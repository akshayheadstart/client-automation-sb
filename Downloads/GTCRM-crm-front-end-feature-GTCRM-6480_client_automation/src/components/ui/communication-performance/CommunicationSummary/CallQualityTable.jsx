import { Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CallQualityTableFilters from "./CallQualityTableFilters";
import CallQualityTableDetails from "./CallQualityTableDetails";
import { Box } from "@mui/system";
import { handleChangePage } from "../../../../helperFunctions/pagination";
import AutoCompletePagination from "../../../shared/forms/AutoCompletePagination";
import Pagination from "../../../shared/Pagination/Pagination";
import DateRangeShowcase from "../../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../../hooks/getDayMonthYear";
import {
  useGetCallQualityDetailsQuery,
  usePrefetch,
} from "../../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useCommonErrorHandling from "../../../../hooks/useCommonErrorHandling";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../shared/Loader/BaseNotFoundLottieLoader";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { useSelector } from "react-redux";
import { apiCallFrontAndBackPage } from "../../../../helperFunctions/apiCallFrontAndBackPage";

const CallQualityTable = () => {
  const [indicator, setIndicator] = useState("last_7_days");
  const [dateRange, setDateRange] = useState([]);

  const [callQualityDetails, setCallQualityDetails] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalCallQuality, setTotalCallQuality] = useState(0);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([
    "6",
    "10",
    "20",
    "50",
  ]);
  const [hideCallQualityTable, setHideCallQualityTable] = useState(false);
  const { isInternalServerError, setIsInternalServerError } = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [sumOfCallQualityDetails, setSumOfCallQualityDetails] = useState({});

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleError = useCommonErrorHandling();

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { data, isError, error, isFetching, isSuccess } =
    useGetCallQualityDetailsQuery({
      pageNumber,
      rowsPerPage,
      collegeId,
      payload: JSON.parse(GetJsonDate(dateRange)),
      indicator,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setTotalCallQuality(data?.total);
          setCallQualityDetails(data?.data);
          setSumOfCallQualityDetails(data?.total_data);
        } else {
          throw new Error("Call quality details api response is changed.");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setIsInternalServerError,
          setHide: setHideCallQualityTable,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSomethingWentWrong,
        setHideCallQualityTable,
        5000
      );
    }
  }, [isSuccess, isError, error, data]);

  const prefetchCallDetails = usePrefetch("getCallQualityDetails");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchCallDetails,
      {
        payload: JSON.parse(GetJsonDate(dateRange)),
        indicator,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, rowsPerPage, pageNumber, dateRange, indicator]);

  const rowCount = Math.ceil(totalCallQuality / rowsPerPage);
  return (
    <Card
      sx={{ display: hideCallQualityTable ? "none" : "block" }}
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
          <CallQualityTableFilters
            indicator={indicator}
            setIndicator={setIndicator}
            dateRange={dateRange}
            setDateRange={setDateRange}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
            rowsPerPage={rowsPerPage}
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
              {callQualityDetails?.length > 0 ? (
                <>
                  <CallQualityTableDetails
                    callQualityDetails={callQualityDetails}
                    indicator={indicator}
                    sumOfCallQualityDetails={sumOfCallQualityDetails}
                  />
                  <Box className="common-pagination-container">
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      totalCount={totalCallQuality}
                      pageSize={rowsPerPage}
                      onPageChange={(page) =>
                        handleChangePage(page, "", setPageNumber)
                      }
                      count={rowCount}
                    />
                    <AutoCompletePagination
                      rowsPerPage={rowsPerPage}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={totalCallQuality}
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

export default CallQualityTable;
