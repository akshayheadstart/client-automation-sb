import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DataSection from "../../../../shared/DataSection/DataSetion";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { months } from "../../../../../pages/StudentTotalQueries/helperFunction";
import CalendarHeaderContent from "./CalendarHeaderContent";
import MultipleFilterSelectPicker from "../../../../shared/filters/MultipleFilterSelectPicker";
import CounselorFollowUpCalendarDay from "../../../../../pages/Dashboard/CounselorFollowUpCalendarDay";
import { formatDateAndTime } from "../../../../../helperFunctions/formatDateAndTime";
import { getJsonDateToShowFollowUpReport } from "../../../../../hooks/GetJsonDate";
import { useCommonApiCalls } from "../../../../../hooks/apiCalls/useCommonApiCalls";
import { useSelector } from "react-redux";
import { useGetCounselorListQuery } from "../../../../../Redux/Slices/applicationDataApiSlice";
import { organizeCounselorFilterOption } from "../../../../../helperFunctions/filterHelperFunction";

const FollowupSummaryDetailsCalendar = ({
  followupDetails,
  setAppliedCounsellor,
  singleDateValue,
  setSingleDateValue,
  month,
  setMonth,
  year,
  setYear,
  setSelectedCounsellor,
  selectedCounsellor,
  skipCallCounsellorAPI,
  setSkipCallCounsellorAPI,
  setSelectedHeadCounsellor,
}) => {
  const [currentView, setCurrentView] = useState("day");
  const [counsellors, setCounsellors] = useState([]);

  const onDateChange = (date) => {
    setSingleDateValue(date);
  };

  const handleMonthChange = (date) => {
    setMonth(date.month());
    setCurrentView("day");
    setYear(date.year());
  };

  const handleYearChange = (date) => {
    setYear(date.year());
    setCurrentView("day");
  };
  const openYearView = () => {
    setCurrentView((prev) => (prev === "year" ? "day" : "year"));
  };

  const resetToCurrentDate = () => {
    setSingleDateValue(dayjs());
  };
  const getSelectedDate = (date) => {
    return new Date(dayjs(date).toDate());
  };

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

  const CustomHeader = React.useCallback(() => {
    return (
      <Box className="calendar-header-container">
        <CalendarHeaderContent
          handleView={() =>
            setCurrentView((prev) => (prev === "month" ? "day" : "month"))
          }
          handleArrowLeft={() => {
            setSingleDateValue((prev) =>
              dayjs(
                new Date(getSelectedDate(prev)).setMonth(
                  new Date(getSelectedDate(prev)).getMonth() - 1
                )
              )
            );
          }}
          handleArrowRight={() => {
            setSingleDateValue((prev) =>
              dayjs(
                new Date(getSelectedDate(prev)).setMonth(
                  new Date(getSelectedDate(prev)).getMonth() + 1
                )
              )
            );
          }}
          value={months[month]}
          disableArrow={{
            right: dayjs().year() + 1 === year && month === 11,
            left: dayjs().year() - 1 === year && month === 0,
          }}
        />
        <CalendarHeaderContent
          disableArrow={{
            right: dayjs().year() + 1 === year,
            left: dayjs().year() - 1 === year,
          }}
          handleView={openYearView}
          handleArrowLeft={() => {
            setSingleDateValue((prev) =>
              dayjs(
                new Date(getSelectedDate(prev)).setYear(
                  new Date(getSelectedDate(prev)).getFullYear() - 1
                )
              )
            );
          }}
          handleArrowRight={() => {
            setSingleDateValue((prev) =>
              dayjs(
                new Date(getSelectedDate(prev)).setYear(
                  new Date(getSelectedDate(prev)).getFullYear() + 1
                )
              )
            );
          }}
          value={year}
        />
      </Box>
    );
  }, [year, currentView, singleDateValue, month]);
  return (
    <Box className="followup-details-calendar-container">
      <Grid container spacing={4}>
        <Grid item md={3.5} sm={12} xs={12}>
          <Typography className="followup-selected-date" variant="h6">
            {formatDateAndTime(dayjs(singleDateValue)?.format())?.formattedDate}
          </Typography>
          <Box>
            <DataSection
              title="Total Over Due"
              value={followupDetails?.overdue_followups || 0}
            />
            <DataSection
              title="Completed / Total"
              value={`${followupDetails?.completed_followups || 0}/${
                followupDetails?.total_followups || 0
              }`}
            />
            <DataSection
              title="1st Follow up"
              value={`${followupDetails?.first_followup?.pending || 0}/${
                followupDetails?.first_followup?.total || 0
              }`}
            />
            <DataSection
              title="2nd Follow up"
              value={`${followupDetails?.second_followup?.pending || 0}/${
                followupDetails?.second_followup?.total || 0
              }`}
            />
            <DataSection
              title="3rd Follow up"
              value={`${followupDetails?.third_followup?.pending || 0}/${
                followupDetails?.third_followup?.total || 0
              }`}
              hideDivider={true}
            />
          </Box>
        </Grid>
        <Grid item md={8.5} sm={12} xs={12}>
          <Box className="followup-details-calendar-filter">
            <MultipleFilterSelectPicker
              onChange={(value) => {
                setSelectedCounsellor(value);
              }}
              setSelectedPicker={setSelectedCounsellor}
              pickerData={counsellors}
              placeholder="Select Counsellor"
              placement="bottomStart"
              pickerValue={selectedCounsellor}
              style={{ width: "150px" }}
              className="select-picker"
              onOpen={() => setSkipCallCounsellorAPI(false)}
              onClean={() => {
                setAppliedCounsellor([]);
                setSelectedHeadCounsellor({});
              }}
              callAPIAgain={() => {
                setAppliedCounsellor(selectedCounsellor);
                setSelectedHeadCounsellor({});
              }}
              loading={counselorListApiCallInfo?.isFetching}
            />
            <Typography onClick={resetToCurrentDate}>Today</Typography>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={singleDateValue}
              loading={false}
              views={["day", "month", "year"]}
              onChange={onDateChange}
              onMonthChange={handleMonthChange}
              onYearChange={handleYearChange}
              slots={{
                day: CounselorFollowUpCalendarDay,
                calendarHeader: CustomHeader,
              }}
              view={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
              }}
              minDate={dayjs()?.subtract(1, "year")?.startOf("year") || ""}
              maxDate={dayjs()?.add(1, "year")?.endOf("year") || ""}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FollowupSummaryDetailsCalendar;
