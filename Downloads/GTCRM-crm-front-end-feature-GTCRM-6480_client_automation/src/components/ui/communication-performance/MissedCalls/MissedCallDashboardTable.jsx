import { Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import MissedCallTableFilters from "./MissedCallTableFilters";
import MissedCallTableDetails from "./MissedCallTableDetails";
import {
  useGetMissedCallListsQuery,
  usePrefetch,
} from "../../../../Redux/Slices/telephonySlice";
import { useSelector } from "react-redux";
import GetJsonDate from "../../../../hooks/GetJsonDate";
import useDebounce from "../../../../hooks/useDebounce";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import ErrorAndSomethingWentWrong from "../../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../../../helperFunctions/apiCallFrontAndBackPage";
import DateRangeShowcase from "../../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../../hooks/getDayMonthYear";

function MissedCallDashboardTable() {
  const [selectedLandingNumber, setSelectedLandingNumber] = useState("");
  const [selectedCounsellors, setSelectedCounsellors] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [searchedPhoneNumber, setSearchedPhoneNumber] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortingColumn, setSortingColumn] = useState("");
  const [sortingType, setSortingType] = useState(null);
  const [totalMissedCallCount, setTotalMissedCallCount] = useState(0);
  const [hideMissedCallTable, setHideMissedCallTable] = useState(false);

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [selectedStudentMobile, setSelectedStudentMobile] = useState([]);

  const [missedCallList, setMissedCallList] = useState([]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const pushNotification = useToasterHook();

  const debouncedSearchText = useDebounce(searchedPhoneNumber, 500);
  const payload = {
    counsellors: selectedCounsellors,
    search: debouncedSearchText,
    sort: sortingColumn?.length ? true : false,
    sort_name: sortingColumn,
    sort_type: sortingType,
  };

  if (dateRange.length) {
    payload.date_range = JSON.parse(GetJsonDate(dateRange));
  }
  const { data, isFetching, isError, error, isSuccess } =
    useGetMissedCallListsQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
      selectedLandingNumber,
      payload,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setMissedCallList(data?.data);
          setTotalMissedCallCount(data?.total);
        } else {
          throw new Error("Missed call details table API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideMissedCallTable,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSomethingWentWrong,
        setHideMissedCallTable,
        5000
      );
    } finally {
      setSelectedStudentMobile([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  const prefetchCallDetails = usePrefetch("getMissedCallLists");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchCallDetails,
      {
        payload,
        selectedLandingNumber,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, prefetchCallDetails, pageNumber, rowsPerPage, collegeId]);

  return (
    <Card className="missed-call-details-container common-box-shadow">
      {dateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(dateRange[0])}
          endDateRange={getDateMonthYear(dateRange[1])}
          triggeredFunction={() => setDateRange([])}
        ></DateRangeShowcase>
      )}
      <MissedCallTableFilters
        selectedLandingNumbers={selectedLandingNumber}
        setSelectedLandingNumbers={setSelectedLandingNumber}
        selectedCounsellors={selectedCounsellors}
        setSelectedCounsellors={setSelectedCounsellors}
        dateRange={dateRange}
        setDateRange={setDateRange}
        searchValue={searchedPhoneNumber}
        setSearchValue={setSearchedPhoneNumber}
        setPageNumber={setPageNumber}
      />
      {isInternalServerError || isSomethingWentWrong ? (
        <ErrorAndSomethingWentWrong
          containerHeight="35vh"
          isInternalServerError={isInternalServerError}
          isSomethingWentWrong={isSomethingWentWrong}
        />
      ) : (
        <>
          {!hideMissedCallTable && (
            <MissedCallTableDetails
              sortingColumn={sortingColumn}
              setSortingColumn={setSortingColumn}
              sortingType={sortingType}
              setSortingType={setSortingType}
              missedCallList={missedCallList}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalMissedCallCount={totalMissedCallCount}
              loading={isFetching}
              setSelectedStudentMobile={setSelectedStudentMobile}
              selectedStudentMobile={selectedStudentMobile}
            />
          )}
        </>
      )}
    </Card>
  );
}

export default MissedCallDashboardTable;
