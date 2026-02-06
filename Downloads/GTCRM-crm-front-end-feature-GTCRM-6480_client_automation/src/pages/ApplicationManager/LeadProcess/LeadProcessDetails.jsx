import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";

import LeadProcessTable from "./LeadProcessTable";
import LeadProcessHeaderAndFilter from "./LeadProcessHeaderAndFilter";
import { Card } from "@mui/material";
import "../../../styles/leadProcess.css";
import Pagination from "../../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import AutoCompletePagination from "../../../components/shared/forms/AutoCompletePagination";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import DateRangeShowcase from "../../../components/shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { useLocation } from "react-router-dom";
import {
  useGetLeadProcessedDetailsQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import ErrorAndSomethingWentWrong from "../../../components/shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../../components/shared/Loader/BaseNotFoundLottieLoader";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
const LeadProcessDetails = () => {
  const { state } = useLocation();
  if (!state?.id) {
    window.history.back();
  }
  const [dateRange, setDateRange] = useState([]);
  const [processedLead, setProcessedLead] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState([6, 15, 20, 50]);
  const [totalProcessedCount, setTotalProcessedCount] = useState(0);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [extraTableHeaders, setExtraTableHeaders] = useState([]);

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const handleError = useCommonErrorHandling();

  const { data, error, isError, isFetching, isSuccess } =
    useGetLeadProcessedDetailsQuery({
      collegeId,
      offlineId: state?.id,
      pageNumber,
      rowsPerPage,
      payload: JSON.parse(GetJsonDate(dateRange)),
      isApplication: state?.isApplication,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setProcessedLead(data?.data);
          setTotalProcessedCount(data?.total);

          const headerOfTheTable = [];
          /* 
          here in this loop we are extracting the dynamic key name to be used as the dynamic header of the table in UI
          */
          data?.data.forEach((record) => {
            const keysOfOtherField = Object.keys(record.raw_data_other_field);
            keysOfOtherField.forEach((key) => {
              if (!headerOfTheTable.includes(key)) {
                headerOfTheTable.push(key);
              }
            });
          });
          setExtraTableHeaders(headerOfTheTable);
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        } else {
          throw new Error("Lead processed API response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError,
          setHide: setHideTable,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideTable, 5000);
    }
  }, [data, isError, error, isSuccess]);

  const prefetchLeadProcessedDetails = usePrefetch("getLeadProcessedDetails");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchLeadProcessedDetails,
      {
        payload: JSON.parse(GetJsonDate(dateRange)),
        isApplication: state?.isApplication,
        offlineId: state?.id,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, rowsPerPage, collegeId]);

  useEffect(() => {
    setHeadTitle("Upload History");
    document.title = "Upload History";
  }, [headTitle]);

  if (hideTable) {
    return null;
  }

  return (
    <Card className="common-box-shadow lead-process-details-container">
      {isFetching ? (
        <>
          <Box className="common-not-found-container">
            <LeefLottieAnimationLoader
              height={100}
              width={100}
            ></LeefLottieAnimationLoader>
          </Box>
        </>
      ) : (
        <>
          {dateRange?.length > 0 && (
            <DateRangeShowcase
              startDateRange={getDateMonthYear(dateRange[0])}
              endDateRange={getDateMonthYear(dateRange[1])}
              triggeredFunction={() => setDateRange([])}
            />
          )}
          <LeadProcessHeaderAndFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          {isInternalServerError || isSomethingWentWrong ? (
            <ErrorAndSomethingWentWrong
              containerHeight="25vh"
              isInternalServerError={isInternalServerError}
              isSomethingWentWrong={isSomethingWentWrong}
            />
          ) : (
            <>
              {processedLead?.length > 0 ? (
                <LeadProcessTable
                  tableDetails={processedLead}
                  extraTableHeader={extraTableHeaders}
                />
              ) : (
                <Box className="common-not-found-container">
                  <BaseNotFoundLottieLoader width={200} height={200} />
                </Box>
              )}
            </>
          )}
          {processedLead?.length > 0 && (
            <Box className="common-pagination-container">
              <Pagination
                className="pagination-bar"
                currentPage={pageNumber}
                totalCount={totalProcessedCount}
                pageSize={rowsPerPage}
                onPageChange={(page) =>
                  handleChangePage(page, "", setPageNumber)
                }
                count={Math.ceil(totalProcessedCount / rowsPerPage)}
              />
              <AutoCompletePagination
                rowsPerPage={rowsPerPage}
                rowPerPageOptions={rowPerPageOptions}
                setRowsPerPageOptions={setRowsPerPageOptions}
                rowCount={totalProcessedCount}
                page={pageNumber}
                setPage={setPageNumber}
                setRowsPerPage={setRowsPerPage}
              ></AutoCompletePagination>
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

export default LeadProcessDetails;
