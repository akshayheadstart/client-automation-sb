/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Button,
} from "@mui/material";
import {
  DateCalendar,
  LocalizationProvider,
  DayCalendarSkeleton,
  PickersCalendarHeader,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CounselorFollowUpCalendarDay from "./CounselorFollowUpCalendarDay";
import DataSection from "../../components/shared/DataSection/DataSetion";
import { useGetCounselorFollowUpCalendarDataQuery } from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import CounsellorHourlyChart from "./CounsellorHourlyChart";
import "../../styles/CounselorFollowUpCalendar.css";
dayjs.extend(advancedFormat);

const CounselorFollowUpCalendar = ({
  hideFollowupCalendar,
  setHideFollowupCalendar,
}) => {
  const [value, setValue] = React.useState(dayjs());
  const [month, setMonth] = React.useState(dayjs().month());
  const [year, setYear] = React.useState(dayjs().year());
  const [currentView, setCurrentView] = React.useState("day");
  const [selectedDateInfo, setSelectedDateInfo] = React.useState({});
  const [calendarResponse, setCalendarResponse] = React.useState([]);
  const isResetToCurrDate = React.useRef(false);
  const isYearOpen = React.useRef(false);
  const [togglebarChart, setToggleBarChart] = React.useState(false);

  const [calendarInternalServerError, setCalendarInternalServerError] =
    React.useState("");
  const [
    followupCalendarSomethingWentWrong,
    setFollowupCalendarSomethingWentWrong,
  ] = React.useState("");

  const calenderRef = React.useRef(null);
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    React.useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const {
    data: calendarData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetCounselorFollowUpCalendarDataQuery({
    date: value.date(),
    month: month + 1,
    year: year,
    collegeId,
  });

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["14332d8b"]
        ?.features
    );
  }, [permissions]);

  const handleClickDate = () => {
    if (features?.["e63b7d84"]?.visibility) {
      setToggleBarChart(!togglebarChart);
    }
  };

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(calendarData?.data)) {
          setCalendarResponse(calendarData?.data);
        } else {
          throw new Error("get calendar info API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setCalendarInternalServerError,
            setHideFollowupCalendar,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setFollowupCalendarSomethingWentWrong,
        setHideFollowupCalendar,
        10000
      );
    }
  }, [calendarData, isSuccess, error, isError]);

  useEffect(() => {
    const response = calendarResponse;
    setSelectedDateInfo(
      response?.find((item) => item.date === value.date()) || {}
    );
  }, [calendarResponse, value]);

  const onDateChange = (date) => {
    setValue(date);
  };

  const handleMonthChange = (date) => {
    setMonth(date.month());
    if (!isResetToCurrDate.current) {
      setValue(date);
    }
    setCurrentView("day");
    setYear(date.year());
    isResetToCurrDate.current = false;
  };

  const handleYearChange = (date) => {
    setYear(date.year());
    setCurrentView("day");
  };

  const resetToCurrentDate = () => {
    setValue(dayjs());
    isResetToCurrDate.current = true;
  };

  const openYearView = () => {
    if (isYearOpen.current) {
      setCurrentView("day");
    } else {
      setCurrentView("year");
    }
    isYearOpen.current = !isYearOpen.current;
  };

  useEffect(() => {
    if (calenderRef.current) {
      calenderRef.current.querySelector(".month-label").innerText =
        calenderRef.current
          .querySelector(".month-label")
          .textContent.substring(0, 3);
    }
  });

  const CustomHeader = React.useCallback(
    (props) => {
      return (
        <Box className="header-align-row ">
          <PickersCalendarHeader {...props} ref={calenderRef} />
          <Button variant="text" className="year-button" onClick={openYearView}>
            {year} <ArrowDropDownIcon className="up-down-arrow" />
          </Button>
          <Button
            variant="text"
            className="current-date-button"
            onClick={resetToCurrentDate}
          >
            Today
          </Button>
        </Box>
      );
    },
    [calenderRef, year, currentView]
  );

  return (
    <Card
      sx={{
        visibility: hideFollowupCalendar ? "hidden" : "visible",
      }}
    >
      <CardContent className="counselor-followup-conainer">
        {calendarInternalServerError || followupCalendarSomethingWentWrong ? (
          <Box className="loading-animation-for-notification">
            {calendarInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {followupCalendarSomethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : togglebarChart ? (
          <CounsellorHourlyChart
            selectedValue={value}
            onClickDate={handleClickDate}
            collegeId={collegeId}
            setHideFollowupCalendar={setHideFollowupCalendar}
            setApiResponseChangeMessage={setApiResponseChangeMessage}
          />
        ) : (
          <Grid container spacing={1}>
            <Grid item lg={4} md={5} sm={4} xs={12} className="left-section">
              <>
                <Box
                  className="displayed-date-wrapper"
                  onClick={() => handleClickDate()}
                >
                  <Typography variant="h6" className="selected-date-label">
                    {dayjs(value).format("DD MMMM YYYY")}
                  </Typography>
                </Box>
                <DataSection
                  title="Lead Assigned"
                  value={selectedDateInfo.leadAssigned}
                  loading={isFetching}
                />
                <DataSection
                  title="Paid Applications"
                  value={selectedDateInfo.paidApplications}
                  loading={isFetching}
                />
                <DataSection
                  title="Follow-ups"
                  value={`${selectedDateInfo.followUpCount || 0}/${
                    selectedDateInfo.totalFollowUpCount || 0
                  }`}
                  loading={isFetching}
                />
                <DataSection
                  title="Admission Confirmed"
                  value={selectedDateInfo.admissionConfirmed}
                  hideDivider
                  loading={isFetching}
                />
              </>
            </Grid>
            <Grid item lg={8} md={7} sm={8} xs={12} className="right-section">
              <LocalizationProvider disableReactTree dateAdapter={AdapterDayjs}>
                <DateCalendar
                  // ref={calenderRef}
                  className="followup-calendar"
                  value={value}
                  loading={isFetching}
                  views={["day", "month", "year"]}
                  onChange={onDateChange}
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                  slots={{
                    day: CounselorFollowUpCalendarDay,
                    calendarHeader: CustomHeader,
                    switchViewIcon: () => (
                      <ArrowDropDownIcon className="up-down-arrow" />
                    ),
                  }}
                  slotProps={{
                    day: {
                      highlightedDays: calendarResponse || [],
                      selectedValue: value,
                    },
                    calendarHeader: {
                      // ref: calenderRef,
                      classes: {
                        root: "header-root",
                        labelContainer: "header-label-container",
                        label: "month-label",
                      },
                    },
                    previousIconButton: {
                      className: "previos-month-arrow-btn",
                    },
                    nextIconButton: {
                      className: "next-month-arrow-btn",
                    },
                  }}
                  view={currentView}
                  renderLoading={() => <DayCalendarSkeleton />}
                  onViewChange={(view) => {
                    setCurrentView(view);
                  }}
                  minDate={dayjs()?.subtract(1, "year")?.startOf("year") || ""}
                  maxDate={dayjs()?.add(1, "year")?.endOf("year") || ""}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(CounselorFollowUpCalendar);
