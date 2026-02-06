/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  Button,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetEventMappingDataQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { useEffect } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import { filterEvents, isDateSameOrFuture } from "../../hooks/GetJsonDate";
import { useSelector } from "react-redux";
import { Input } from "rsuite";
import "../../styles/EventMapping.css";
import "../../styles/sharedStyles.css";
import studentQueriesSearchIcon from "../../images/searchIcon.png";
import addEventIcon from "../../images/addEventIcon.png";
import CustomTooltip from "../shared/Popover/Tooltip";

const EventTimeline = ({
  handleDialogOpen,
  isScrolledLeadVsApplication,
  selectedSeason,
}) => {
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [eventMappingInternalServerError, setEventMappingInternalServerError] =
    useState(false);
  const [somethingWentWrongInEventMapping, setSomethingWentWrongInUserManager] =
    useState(false);
  const [eventToggle, setEventToggle] = useState(false);
  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const [allEvent, setAllEvent] = useState([]);
  const [search, setSearch] = useState("");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["e7d559dc"]?.features?.["22deddf4"]
        ?.features
    );
  }, [permissions]);

  const fromData = {
    season: selectedSeason?.length
      ? JSON?.parse(selectedSeason)?.season_id
      : "",
    event_filter: {
      event_name: search ? [search] : [],
    },
  };

  const { data, isSuccess, isFetching, error, isError } =
    useGetEventMappingDataQuery(
      { fromDataValue: search ? fromData : {}, collegeId: collegeId },
      { skip: isScrolledLeadVsApplication ? false : true }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          // setAllEvent((allEvent)=>[...allEvent,...data?.data])
          setAllEvent(data?.data);
        } else {
          throw new Error("get_details API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setEventMappingInternalServerError, 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInUserManager, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    error?.status,
    isError,
    isSuccess,
    navigate,
    setApiResponseChangeMessage,
  ]);
  const scrollContainerRef = useRef();
  // Function to filter events for the last two months and next month
  const [filterNextAndPreviousEvent, setFilterNextAndPreviousEvent] = useState(
    []
  );
  useEffect(() => {
    if (allEvent) {
      const filterEventData = filterEvents(allEvent);
      if (filterEventData) {
        setFilterNextAndPreviousEvent(filterEventData);
      }
    }
  }, [allEvent]);
  const backendApiSortingData = [...filterNextAndPreviousEvent];
  backendApiSortingData?.sort((a, b) => {
    const dateA = new Date(a.event_end_date);
    const dateB = new Date(b.event_end_date);
    return dateA - dateB;
  });
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Find the upcoming events with the current date
      const upcomingEvents = backendApiSortingData.filter((event) =>
        isDateSameOrFuture(event.event_end_date)
      );
      if (upcomingEvents.length > 0) {
        const lastIndex = backendApiSortingData.indexOf(
          upcomingEvents[upcomingEvents.length - 2]
        );
        if (
          lastIndex !== -1 &&
          container.children &&
          container.children[lastIndex]
        ) {
          container.scrollTop = container.children[lastIndex].offsetTop;
        }
      } else {
        container.scrollTop = 0;
      }
    }
  }, [backendApiSortingData]);

  return (
    <>
      <Card
        sx={{
          height: "100%",
          borderRadius: "20px",
          padding: "0px 30px 0px 30px !important",
          boxShadow: "0px 10px 60px rgba(226, 236, 249, 0.5) !important",
        }}
      >
        <Box className="eventTimeline-header-text">
          <Typography
            data-testid="eventHeadline"
            className="heading-event-timeline"
            variant="h5"
            sx={{ fontSize: "16px" }}
          >
            Event Timeline
          </Typography>
          <Box className="event-search-add-container">
            {features?.["5be16c1d"]?.visibility && (
              <Box sx={{ mb: 1 }}>
                <ClickAwayListener onClickAway={() => setEventToggle(false)}>
                  <Box>
                    {!eventToggle ? (
                      <Box
                        data-testid="search-toggle"
                        onClick={() => setEventToggle(true)}
                        sx={{ cursor: "pointer" }}
                      >
                        <img
                          src={studentQueriesSearchIcon}
                          width={"40px"}
                          height={"39px"}
                        />
                      </Box>
                    ) : (
                      <Input
                        style={{ width: "150px" }}
                        placeholder="Search"
                        onChange={(value, event) => {
                          setSearch(value);
                        }}
                      />
                    )}
                  </Box>
                </ClickAwayListener>
              </Box>
            )}

            {features?.["2b527256"]?.visibility && (
              <Box
                disabled={
                  selectedSeason?.length
                    ? JSON?.parse(selectedSeason)?.current_season
                      ? false
                      : true
                    : false
                }
                onClick={handleDialogOpen}
                sx={{ cursor: "pointer" }}
              >
                <img src={addEventIcon} width={"40px"} height={"38px"} />
              </Box>
            )}
          </Box>
        </Box>
        <Box
          className="eventTimeLine-container-design vertical-scrollbar"
          ref={scrollContainerRef}
        >
          {eventMappingInternalServerError ||
          somethingWentWrongInEventMapping ? (
            <>
              {eventMappingInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInEventMapping && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </>
          ) : (
            <>
              {isFetching ? (
                <>
                  <Box className="loading-animation">
                    <LeefLottieAnimationLoader
                      height={200}
                      width={180}
                    ></LeefLottieAnimationLoader>
                  </Box>
                </>
              ) : backendApiSortingData?.length > 0 ? (
                <>
                  {/* <Box> */}
                  {backendApiSortingData?.map((event, index) => {
                    return (
                      <>
                        {isDateSameOrFuture(event?.event_end_date) ? (
                          <Box
                            sx={{ display: "flex", gap: "14px" }}
                            key={event?._id}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ position: "relative" }}>
                                <Box className="event-time-line-active-line-design"></Box>
                                <Box className="event-time-line-active-line-right-design"></Box>
                                <Box className="event-time-line-active-event-card-design"></Box>
                                <Box
                                  id="event-Time-line-dot-container"
                                  sx={{
                                    margin: 0,
                                    border:
                                      "2px solid rgba(12, 124, 213, 0.85)",
                                    backgroundColor: "white",
                                    color: "black",
                                    fontWeight: 800,
                                  }}
                                >
                                  <Typography
                                    sx={{ fontSize: "17px", fontWeight: 700 }}
                                  >{`${new Date(event?.event_end_date)
                                    .toDateString()
                                    .slice(8, 10)}`}</Typography>
                                  <Typography
                                    sx={{ fontSize: "17px", fontWeight: 700 }}
                                  >{`${new Date(event?.event_end_date)
                                    .toDateString()
                                    .slice(4, 7)}`}</Typography>
                                </Box>
                              </Box>
                              {backendApiSortingData?.length - 1 !== index && (
                                <Box
                                  sx={{
                                    height: 55,
                                    width: "2px",
                                    bgcolor: "rgba(12, 124, 213, 0.85)",
                                  }}
                                />
                              )}
                            </Box>
                            <Box className="event-timeLine-div-width-full-container">
                              <Typography
                                className="event-timeLine-active-text-color-set"
                                sx={{ fontSize: "12px" }}
                              >
                                {event?.event_name}
                              </Typography>
                              <Box className="event-timeline-description-large">
                                {event?.event_description.length > 50 ? (
                                  <>
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <div>{event?.event_description}</div>
                                        </div>
                                      }
                                      component={
                                        <Box className="event-timeline-description-active-box">
                                          {event?.event_description?.slice(
                                            0,
                                            50
                                          ) + "..."}
                                        </Box>
                                      }
                                    />
                                  </>
                                ) : (
                                  <Box className="event-timeline-description-active-box">
                                    {event?.event_description}
                                  </Box>
                                )}
                              </Box>
                              <Box className="event-timeline-description-small">
                                {event?.event_description.length > 20 ? (
                                  <>
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <div>{event?.event_description}</div>
                                        </div>
                                      }
                                      component={
                                        <Box className="event-timeline-description-active-box">
                                          {event?.event_description?.slice(
                                            0,
                                            20
                                          ) + "..."}
                                        </Box>
                                      }
                                    />
                                  </>
                                ) : (
                                  <Box className="event-timeline-description-active-box">
                                    {event?.event_description}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            sx={{ display: "flex", gap: "14px" }}
                            key={event?._id}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box sx={{ position: "relative" }}>
                                <Box className="event-time-line-line-design"></Box>
                                <Box className="event-time-line-line-right-design"></Box>
                                <Box className="event-time-line-card-design"></Box>
                                <Box
                                  id="event-Time-line-dot-container"
                                  sx={{
                                    margin: 0,
                                    border: "2px solid #B5B7C0",
                                    backgroundColor: "white",
                                    color: "#B5B7C0",
                                    fontWeight: 800,
                                  }}
                                >
                                  <Typography
                                    sx={{ fontSize: "17px", fontWeight: 700 }}
                                  >{`${new Date(event?.event_end_date)
                                    .toDateString()
                                    .slice(8, 10)}`}</Typography>
                                  <Typography
                                    sx={{ fontSize: "17px", fontWeight: 700 }}
                                  >{`${new Date(event?.event_end_date)
                                    .toDateString()
                                    .slice(4, 7)}`}</Typography>
                                </Box>
                              </Box>
                              {backendApiSortingData?.length - 1 !== index && (
                                <Box
                                  sx={{
                                    height: 55,
                                    width: "2px",
                                    bgcolor: "rgba(12, 124, 213, 0.85)",
                                  }}
                                />
                              )}
                            </Box>
                            <Box className="event-timeLine-div-width-full-container">
                              <Typography
                                sx={{ fontSize: "12px", color: "gray" }}
                              >
                                {event?.event_name}
                              </Typography>
                              <Box className="event-timeline-description-large">
                                {event?.event_description.length > 50 ? (
                                  <>
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <div>{event?.event_description}</div>
                                        </div>
                                      }
                                      component={
                                        <Box className="event-timeline-description-deActive-box">
                                          {event?.event_description?.slice(
                                            0,
                                            50
                                          ) + "..."}
                                        </Box>
                                      }
                                    />
                                  </>
                                ) : (
                                  <Box className="event-timeline-description-deActive-box">
                                    {event?.event_description}
                                  </Box>
                                )}
                              </Box>
                              <Box className="event-timeline-description-small">
                                {event?.event_description.length > 10 ? (
                                  <>
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <div>{event?.event_description}</div>
                                        </div>
                                      }
                                      component={
                                        <Box className="event-timeline-description-deActive-box">
                                          {event?.event_description?.slice(
                                            0,
                                            10
                                          ) + "..."}
                                        </Box>
                                      }
                                    />
                                  </>
                                ) : (
                                  <Box className="event-timeline-description-deActive-box">
                                    {event?.event_description}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </>
                    );
                  })}
                  {/* </Box> */}
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "32vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
          {/* </Timeline> */}
        </Box>
        {features?.["f1215505"]?.visibility && (
          <Box className="eventTime-viewAll-btn">
            <Button
              disabled={
                selectedSeason?.length
                  ? JSON?.parse(selectedSeason)?.current_season
                    ? false
                    : true
                  : false
              }
              data-testid="eventTimeline-viewAll-btn"
              sx={{ borderRadius: 50 }}
              variant="contained"
              size="small"
              onClick={() => navigate("/event-mapping")}
              color="info"
              className="view-all-button-event-timeline-design"
            >
              View All
            </Button>
          </Box>
        )}
      </Card>
    </>
  );
};

export default React.memo(EventTimeline);
