import { Box, Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CounsellorCallActivityHeader from "./CounsellorCallActivityHeader";
import CounsellorCallActivityTable from "./CounsellorCallActivityTable";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import { useGetCounsellorActivityDetailsQuery } from "../../../Redux/Slices/telephonySlice";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";

function TelephonyDashboardBody() {
  const [activityStatus, setActivityStatus] = useState([]);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState("");
  const [callActivityDateRange, setCallActivityDateRange] = useState([]);
  const [sortingColumn, setSortingColumn] = useState("");
  const [sortingType, setSortingType] = useState(null);
  const [counsellorCallActivityList, setCounsellorCallActivityList] = useState(
    []
  );
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);
  const [selectedCounsellorID, setSelectedCounsellorID] = useState([]);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();

  const payload = {
    activity_status: activityStatus,

    sort: sortingColumn.length ? true : false,
    sort_name: sortingColumn,
    sort_type: sortingType,
  };
  if (callActivityDateRange?.length) {
    payload.date_range = JSON.parse(GetJsonDate(callActivityDateRange));
  }

  const { data, error, isError, isSuccess, isFetching } =
    useGetCounsellorActivityDetailsQuery({
      collegeId,
      selectedQuickFilter,
      payload,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setCounsellorCallActivityList(data?.data);
        } else {
          throw new Error(
            "Counsellor call activity details API response has changed"
          );
        }
      } else if (isError) {
        if ("detail" === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideTable,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideTable, 5000);
    } finally {
      setSelectedCounsellorID([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  return (
    <Card
      sx={{ p: { sm: 3, md: 4 } }}
      className="common-box-shadow counsellor-call-activity-table-container"
    >
      {callActivityDateRange.length > 1 && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(callActivityDateRange[0])}
          endDateRange={getDateMonthYear(callActivityDateRange[1])}
          triggeredFunction={() => setCallActivityDateRange([])}
        />
      )}
      <CounsellorCallActivityHeader
        activityStatus={activityStatus}
        setActivityStatus={setActivityStatus}
        callActivityDateRange={callActivityDateRange}
        setCallActivityDateRange={setCallActivityDateRange}
        selectedQuickFilter={selectedQuickFilter}
        setSelectedQuickFilter={setSelectedQuickFilter}
      />
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {!hideTable && (
            <CounsellorCallActivityTable
              sortingType={sortingType}
              setSortingType={setSortingType}
              sortingColumn={sortingColumn}
              setSortingColumn={setSortingColumn}
              counsellorCallActivityList={counsellorCallActivityList}
              selectedQuickFilter={selectedQuickFilter}
              setSelectedQuickFilter={setSelectedQuickFilter}
              loading={isFetching}
              selectedCounsellorID={selectedCounsellorID}
              setSelectedCounsellorID={setSelectedCounsellorID}
              callActivityDateRange={callActivityDateRange}
            />
          )}
        </>
      )}
    </Card>
  );
}

export default TelephonyDashboardBody;
