/* eslint-disable jsx-a11y/img-redundant-alt */
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import "react-funnel-pipeline/dist/index.css";
import Grid from "@mui/system/Unstable_Grid/Grid";
import ReactApexChart from "react-apexcharts";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import EventTimeline from "../../EventTimeline/EventTimeline";
import DialogEvent from "../../EventMappingDialog/DialogEvent";
import { useCreateEventMappingMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../../hooks/useToasterHook";
import { GetFormatDate, handleFormatDate } from "../../../hooks/GetJsonDate";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/EventMapping.css";
import "../../../styles/sharedStyles.css";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";

import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import "../../../styles/AdminDashboard.css";
import { handleDataFilterOption } from "../../../helperFunctions/handleDataFilterOption";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import { useGetAllSourceListQuery } from "../../../Redux/Slices/filterDataSlice";
import { organizeSourceFilterOption } from "../../../helperFunctions/filterHelperFunction";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../hooks/getDayMonthYear";
import { getDefaultDateRange } from "../../../pages/StudentTotalQueries/helperFunction";
import { useSelector } from "react-redux";

function LeadsApplications({
  chartsState,
  setLeadsVsApplicationApiCall,
  leadGraphDate,
  handleDownloadFile,
  collegeId,
  counsellorList,
  hideCounsellorList,
  selectedSeason,
  loadingCounselorList,
  setSkipCounselorApiCall,
  isScrolledLeadVsApplication,
  isLeadVsApplicationDataLoading,
  setCounselorDateRange,
  counselorDateRange,
  setSelectedCounselor,
  selectedCounselor,
  setSelectedSource,
  selectedSource,
  setCallAPIleadsVsApplication,
  dashboardFeatures,
}) {
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const pushNotification = useToasterHook();
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [event_description, setEventDescription] = useState("");
  const [somethingWentWrongInCreateEvent, setSomethingWentWrongInCreateEvent] =
    useState(false);
  const [createEventInternalServerError, setCreateUserInternalServerError] =
    useState(false);
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const handleDialogOpen = useCallback(() => {
    setDialogOpen(true);
  }, []);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["d92a32d8"]
        ?.features
    );
  }, [permissions]);


  useEffect(() => {
    // three month back date calculation
    if (leadGraphDate?.length > 1) {
      const startDate = new Date(leadGraphDate[0]);
      const endDate = new Date(leadGraphDate[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(
        selectedSeason,
        setStartDateRange,
        setEndDateRange,
        28
      );
    }
  }, [leadGraphDate, selectedSeason]);
  const [createEvent] = useCreateEventMappingMutation();
  const handleCreateEvent = (e) => {
    setLoading(true);
    e.preventDefault();

    const fromData = {
      event_name: eventName,
      event_start_date: handleFormatDate(eventStartDate),
      event_end_date: handleFormatDate(eventEndDate),
      event_type: eventType,
      event_description: event_description,
      learning: null,
    };
    createEvent({ eventData: fromData, collegeId })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              handleDialogClose();
              pushNotification("success", res?.message);
            } else {
              throw new Error("Create event API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInCreateEvent,
              handleDialogClose,
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setCreateUserInternalServerError,
          handleDialogClose,
          5000
        );
      })
      .finally(() => {
        setLoading(false);
        setLeadsVsApplicationApiCall((prv) => !prv);
        setEventName("");
        setEventType("");
        setEventStartDate("");
        setEventEndDate("");
        setEventDescription("");
      });
  };

  const handleFilterOption = (value) => {
    handleDataFilterOption(value, "leadsApplicationDataFilter");
  };

  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
  });
  const [hideSourceList, setHideSourceList] = useState(false);
  const [sourceList, setSourceList] = useState([]);
  const { handleFilterListApiCall } = useCommonApiCalls();
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId },
    { skip: callFilterOptionApi.skipSourceApiCall }
  );
  //get source list
  useEffect(() => {
    if (!callFilterOptionApi.skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo]);
  const [showDate, setShowDate] = useState("");
  useEffect(() => {
    if (counselorDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(counselorDateRange[0]));
      setEndDateRange(getDateMonthYear(counselorDateRange[1]));
    } else {
      setShowDate(getDefaultDateRange());
    }
  }, [counselorDateRange, showDate]);
  return (
    <Box sx={{ position: "relative" }}>
      {counselorDateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={startDateRange}
          endDateRange={endDateRange}
          triggeredFunction={() => {
            setCounselorDateRange([]);
            setCallAPIleadsVsApplication((prev) => !prev);
          }}
        ></DateRangeShowcase>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={8}>
          {isLeadVsApplicationDataLoading ? (
            <Card className="loader-wrapper-leadApplication">
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>{" "}
            </Card>
          ) : (
            <>
              {dashboardFeatures?.["d92a32d8"]?.visibility && (
                <Card
                  sx={{
                    minHeight: "488px",
                    px: "30px",
                    pt: "30px",
                    borderRadius: "20px",
                    boxShadow:
                      "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
                  }}
                >
                  <Box className="lead-application-header-design">
                    <Box className="title-box-hover">
                      <Typography className="top-section-title">
                        Leads vs Paid Applications
                      </Typography>
                      <Typography className="top-section-date">
                        {showDate}
                      </Typography>
                    </Box>
                    <Box
                      className="admin-dashboard-application-filter"
                      sx={{ pt: 1.2 }}
                    >
                      {features?.["1d2aca44"]?.visibility && (
                        <>
                          {hideSourceList || (
                            <MultipleFilterSelectPicker
                              onChange={(value) => {
                                setSelectedSource(value);
                              }}
                              setSelectedPicker={setSelectedSource}
                              pickerData={sourceList}
                              className="dashboard-select-picker"
                              placeholder="Select Source"
                              placement="bottomEnd"
                              pickerValue={selectedSource}
                              loading={sourceListInfo.isFetching}
                              style={{ width: "150px" }}
                              onOpen={() =>
                                setCallFilterOptionApi((prev) => ({
                                  ...prev,
                                  skipSourceApiCall: false,
                                }))
                              }
                              callAPIAgain={() =>
                                setCallAPIleadsVsApplication((prev) => !prev)
                              }
                              onClean={() =>
                                setCallAPIleadsVsApplication((prev) => !prev)
                              }
                            />
                          )}
                        </>
                      )}
                      {features?.["3b07394d"]?.visibility && (
                        <>
                          {hideCounsellorList || (
                            <MultipleFilterSelectPicker
                              handleFilterOption={handleFilterOption}
                              filterOptionParams={[
                                "value",
                                "counselor_id",
                                { value: {} },
                              ]}
                              style={{ width: "150px" }}
                              className="dashboard-select-picker"
                              setSelectedPicker={setSelectedCounselor}
                              pickerData={counsellorList}
                              placeholder="Select Counselor"
                              pickerValue={selectedCounselor}
                              loading={loadingCounselorList}
                              onOpen={() => setSkipCounselorApiCall(false)}
                              callAPIAgain={() =>
                                setCallAPIleadsVsApplication((prev) => !prev)
                              }
                              onClean={() =>
                                setCallAPIleadsVsApplication((prev) => !prev)
                              }
                            />
                          )}
                        </>
                      )}
                      <IconDateRangePicker
                        dateRange={counselorDateRange}
                        onChange={(value) => {
                          setCounselorDateRange(value ? value : {});
                          if (value?.length > 0) {
                            handleFilterOption({
                              date_range: {
                                start_date: value[0],
                                end_date: value[1],
                              },
                            });
                            setCallAPIleadsVsApplication((prev) => !prev);
                          } else {
                            handleFilterOption({
                              date_range: { start_date: "", end_date: "" },
                            });
                          }
                        }}
                      ></IconDateRangePicker>

                      {features?.["c0d93174"]?.visibility && (
                        <IconButton
                          disabled={
                            selectedSeason?.length
                              ? JSON.parse(selectedSeason)?.current_season
                                ? false
                                : true
                              : false
                          }
                          className="download-button-dashboard"
                          onClick={() => {
                            if (JSON.parse(selectedSeason)?.current_season) {
                              handleDownloadFile(
                                `${
                                  import.meta.env.VITE_API_BASE_URL
                                }/admin/download_lead_application_graph_data/${collegeId}`,
                                JSON.stringify({
                                  counselor_id:
                                    selectedCounselor.length > 0
                                      ? selectedCounselor
                                      : null,
                                  date_range:
                                    counselorDateRange?.length > 0
                                      ? GetFormatDate(counselorDateRange)
                                      : {},
                                  season: JSON.parse(selectedSeason)?.season_id,
                                }),
                                "leads-applications"
                              );
                            }
                          }}
                          aria-label="Download"
                        >
                          <FileDownloadOutlinedIcon sx={{ color: "#39A1D1" }} />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                  <CardContent
                    sx={{ p: 0 }}
                    className="leads-applications-card-content"
                  >
                    <Box sx={{ height: "200px", position: "relative" }}>
                      <ReactApexChart
                        options={chartsState.leadOptions}
                        series={chartsState.leadSeries}
                        type="area"
                        height={190}
                      />
                    </Box>
                    <Box sx={{ height: "200px", position: "relative" }}>
                      <ReactApexChart
                        options={chartsState.paidApplicationOptions}
                        series={chartsState.paidApplicationSeries}
                        type="area"
                        height={190}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Grid>
        {dashboardFeatures?.["22deddf4"]?.visibility && (
          <Grid item xs={12} sm={12} md={4}>
            <EventTimeline
              handleDialogOpen={handleDialogOpen}
              isScrolledLeadVsApplication={isScrolledLeadVsApplication}
              selectedSeason={selectedSeason}
            ></EventTimeline>
            {dialogOpen && (
              <DialogEvent
                handleFromFunction={handleCreateEvent}
                dialogOpen={dialogOpen}
                handleDialogOpen={handleDialogOpen}
                setDialogOpen={setDialogOpen}
                handleDialogClose={handleDialogClose}
                setToggle={setToggle}
                toggle={toggle}
                setEventName={setEventName}
                setEventType={setEventType}
                setEventStartDate={setEventStartDate}
                setEventEndDate={setEventEndDate}
                setEventDescription={setEventDescription}
                eventEndDate={eventEndDate}
                eventStartDate={eventStartDate}
                createEventInternalServerError={createEventInternalServerError}
                somethingWentWrongInCreateEvent={
                  somethingWentWrongInCreateEvent
                }
                loading={loading}
                eventName={eventName}
                eventType={eventType}
                event_description={event_description}
                //   deleteIcon={deleteIcon}
              ></DialogEvent>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default React.memo(LeadsApplications);
