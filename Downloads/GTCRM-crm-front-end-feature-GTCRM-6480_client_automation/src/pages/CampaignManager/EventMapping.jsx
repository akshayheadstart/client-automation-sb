/* eslint-disable react-hooks/exhaustive-deps */
import AddIcon from "@mui/icons-material/Add";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "rsuite";
import {
  useCreateEventMappingMutation,
  useGetEventMappingDataQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useGetEventTypesDataQuery } from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import DialogEvent from "../../components/EventMappingDialog/DialogEvent";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate, handleFormatDate } from "../../hooks/GetJsonDate";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/EventMapping.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import { getDateMonthYear } from "../../hooks/getDayMonthYear";
import DateRangeShowcase from "../../components/shared/CalendarTimeData/DateRangeShowcase";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import Pagination from "../../components/shared/Pagination/Pagination";
import { customFetch } from "../StudentTotalQueries/helperFunction";

const EventMapping = () => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const { selectedSeason } = useContext(LayoutSettingContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [eventMappingInternalServerError, setEventMappingInternalServerError] =
    useState(false);
  const [somethingWentWrongInEventMapping, setSomethingWentWrongInUserManager] =
    useState(false);
  const [toggle, setToggle] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rowCount, setRowCount] = useState();
  const [allEvent, setAllEvent] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({
    event_name: "",
    event_type: "",
    event_start_date: "",
    event_end_date: "",
    event_description: "",
  });
  const [pageNumber, setPageNumber] = useState(1);
  const pushNotification = useToasterHook();
  const navigate = useNavigate();
  const count = Math.ceil(rowCount / rowsPerPage);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventTypes, setEventTypes] = useState([]);
  const [eventMappingDateRange, setEventMappingDateRange] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState([]);
  const [hideEventMapping, setHideEventMapping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payloadOfEventMapping, setPayloadOfEventMapping] = useState({});
  const [searchEvent, setSearchEvent] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [event_description, setEventDescription] = useState("");
  const [somethingWentWrongInCreateEvent, setSomethingWentWrongInCreateEvent] =
    useState(false);
  const [createEventInternalServerError, setCreateUserInternalServerError] =
    useState(false);
  const [deleteIcon, setDeleteIcon] = useState(false);

  const addFilterToLocalStorage = (value) => {
    const previousFilterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}eventMappingFilter`)
    );
    if (previousFilterOptions) {
      const newFilterOptions = { ...previousFilterOptions, ...value };
      localStorage.setItem(
        `${Cookies.get("userId")}eventMappingFilter`,
        JSON.stringify(newFilterOptions)
      );
    } else {
      localStorage.setItem(
        `${Cookies.get("userId")}eventMappingFilter`,
        JSON.stringify(value)
      );
    }
  };
  useEffect(() => {
    const filterOptions = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}eventMappingFilter`)
    );
    if (filterOptions) {
      if (filterOptions?.event_type) {
        setSelectedEventType(filterOptions?.event_type);
      }
      if (filterOptions.date_range) {
        if (filterOptions.date_range.start_date) {
          setEventMappingDateRange([
            new Date(filterOptions.date_range.start_date),
            new Date(filterOptions.date_range.end_date),
          ]);
        }
      } else {
        setEventMappingDateRange([]);
        addFilterToLocalStorage({
          date_range: { start_date: "", end_date: "" },
        });
      }

      if (
        filterOptions?.event_type?.length ||
        filterOptions?.date_range?.end_date
      ) {
      }
    }
  }, []);

  const [skipEventTypesCall, setSkipEventTypesCall] = useState(true);
  const allEventTypesInfo = useGetEventTypesDataQuery(
    { collegeId: collegeId },
    { skip: skipEventTypesCall }
  );
  useEffect(() => {
    if (!skipEventTypesCall) {
      const eventTypesList = allEventTypesInfo?.data;
      if (eventTypesList) {
        const eventtypeList = eventTypesList?.data?.map((item) => ({
          label: item,
          value: item,
        }));
        setEventTypes(eventtypeList);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEventTypesInfo, skipEventTypesCall]);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const payloadOfEventsMapping = {
    season: selectedSeason ? JSON.parse(selectedSeason)?.season_id : "",
    event_filter: {
      event_type: selectedEventType,
      date_range:
        eventMappingDateRange?.length > 0
          ? GetFormatDate(eventMappingDateRange)
          : {},
      event_name: searchEvent ? [searchEvent] : [],
    },
  };
  const [apiCallAgain, setAPICallAgain] = useState(false);
  useEffect(() => {
    if (
      selectedEventType.length > 0 ||
      eventMappingDateRange?.length > 0 ||
      searchEvent
    ) {
      setPayloadOfEventMapping(payloadOfEventsMapping);
    } else {
      setPayloadOfEventMapping({});
    }
  }, [apiCallAgain, searchEvent]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetEventMappingDataQuery({
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      fromDataValue: payloadOfEventMapping,
      collegeId: collegeId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setAllEvent(data?.data);
          setAPICallAgain(false);
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        setAllEvent([]);
        setAPICallAgain(false);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          setAPICallAgain(false);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setEventMappingInternalServerError,
            setHideEventMapping,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUserManager,
        setHideEventMapping,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data, error, isError, navigate]);
  // use react hook for prefetch data
  const prefetchEventMappingData = usePrefetch("getEventMappingData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchEventMappingData,
      { fromDataValue: payloadOfEventMapping }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, prefetchEventMappingData, rowsPerPage]);

  const [createEvent] = useCreateEventMappingMutation();
  const handleUpdateEvent = (e) => {
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
        // setLeadsVsApplicationApiCall((prv)=> !prv)
      });
  };

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [
    somethingWentWrongInDownloadList,
    setSomethingWentWrongInDownloadList,
  ] = useState(false);
  const [downloadListInternalServerError, setDownloadListInternalServerError] =
    useState(false);
  const handleDownloadEventList = () => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/events/?download_data=true&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          const expectedData = result?.file_url;
          pushNotification("success", result?.message);
          try {
            if (typeof expectedData === "string") {
              window.open(result?.file_url);
            } else {
              throw new Error(
                "download_applications_data API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInDownloadList,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(setDownloadListInternalServerError, "", 5000);
      });
  };
  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");
  useEffect(() => {
    if (eventMappingDateRange?.length > 1) {
      setStartDateRange(getDateMonthYear(eventMappingDateRange[0]));
      setEndDateRange(getDateMonthYear(eventMappingDateRange[1]));
    }
  }, [eventMappingDateRange]);
  const StyledTableCell = useTableCellDesign();
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Campaign manager Head Title add
  useEffect(() => {
    setHeadTitle("Event Mapping");
    document.title = "Event Mapping";
  }, [headTitle]);
  return (
    <Box className="Event-mapping-box-container">
      <Box sx={{ m: "32px" }}></Box>
      <Box className="event-mapping-box-container-head">
        {eventMappingDateRange?.length > 1 && (
          <DateRangeShowcase
            startDateRange={startDateRange}
            endDateRange={endDateRange}
            triggeredFunction={() => {
              setEventMappingDateRange([]);
              setAPICallAgain((prev) => !prev);
            }}
          ></DateRangeShowcase>
        )}
        <Box
          sx={{
            mb: "5px",
          }}
          className="event-mapping-search-box-container"
        >
          <Box>
            <Button
              data-testid="addEvent-plus-btn"
              onClick={() => {
                handleDialogOpen();
                setToggle(false);

                setEventName("");
                setEventType("");
                setEventStartDate(null);
                setEventEndDate(null);
                setEventDescription("");
                setDeleteIcon(false);
              }}
              sx={{
                whiteSpace: "nowrap",
                borderRadius: 50,
                backgroundColor: "#008CE0 !important",
              }}
              size="small"
              variant="contained"
              startIcon={<AddIcon />}
              color="info"
            >
              Add Event
            </Button>
          </Box>
          <Box className="event-mapping-event-search-container">
            <Box>
              <Input
                size="md"
                width="130px"
                value={searchEvent}
                placeholder="Event Name"
                onChange={(e) => {
                  setSearchEvent(e);
                  setAPICallAgain((prev) => !prev);
                }}
                style={{ border: "1px solid #A8C9E5", height: "36px" }}
              />
            </Box>
            <MultipleFilterSelectPicker
              style={{ width: "150px" }}
              placement="bottomEnd"
              placeholder="Event type"
              onChange={(value) => {
                setSelectedEventType(value);
              }}
              pickerData={eventTypes}
              className="dashboard-select-picker"
              setSelectedPicker={setSelectedEventType}
              pickerValue={selectedEventType}
              loading={allEventTypesInfo.isFetching}
              onOpen={() => setSkipEventTypesCall(false)}
              callAPIAgain={() => setAPICallAgain((prev) => !prev)}
              onClean={() => setAPICallAgain((prev) => !prev)}
            />
            <Box>
              <IconDateRangePicker
                dateRange={eventMappingDateRange}
                onChange={(value) => {
                  setEventMappingDateRange(value ? value : {});
                  setAPICallAgain((prev) => !prev);
                }}
              ></IconDateRangePicker>
            </Box>
            <IconButton
              className="download-button-dashboard"
              onClick={() => {
                handleDownloadEventList();
              }}
              disabled={
                selectedSeason
                  ? JSON?.parse(selectedSeason)?.current_season
                    ? false
                    : true
                  : false
              }
              aria-label="Download"
            >
              <FileDownloadOutlinedIcon sx={{ color: "#39A1D1" }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography sx={{ fontSize: "14px", fontWeight: 400 }}>
            Showing <span style={{ fontWeight: 700 }}>{allEvent?.length}</span>{" "}
            of <span style={{ fontWeight: 700 }}>{rowCount}</span> results
          </Typography>
        </Box>

        {eventMappingInternalServerError ||
        somethingWentWrongInEventMapping ||
        downloadListInternalServerError ||
        somethingWentWrongInDownloadList ? (
          <>
            {(eventMappingInternalServerError ||
              downloadListInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInEventMapping ||
              somethingWentWrongInDownloadList) && (
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
            ) : allEvent.length > 0 ? (
              <>
                <Box
                  sx={{ visibility: hideEventMapping ? "hidden" : "visible" }}
                >
                  <TableContainer
                    className="custom-scrollbar"
                    component={Paper}
                    sx={{ boxShadow: 0 }}
                  >
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                      <TableHead>
                        <TableRow
                          sx={{
                            borderBottom: "1px solid #EEE",
                            fontWeight: 500,
                          }}
                        >
                          <StyledTableCell className="event-mapping-table-head-text">
                            Event Name
                          </StyledTableCell>
                          <StyledTableCell
                            className="event-mapping-table-head-text"
                            align="center"
                          >
                            Start Date
                          </StyledTableCell>
                          <StyledTableCell
                            className="event-mapping-table-head-text"
                            align="center"
                          >
                            End Date
                          </StyledTableCell>
                          <StyledTableCell
                            className="event-mapping-table-head-text"
                            align="center"
                          >
                            Event Type
                          </StyledTableCell>
                          <StyledTableCell
                            className="event-mapping-table-head-text"
                            align="center"
                          >
                            Description
                          </StyledTableCell>
                          <StyledTableCell
                            className="event-mapping-table-head-text"
                            align="left"
                          >
                            Actions
                          </StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allEvent?.map((row) => (
                          <TableRow
                            sx={{ borderBottom: "1px solid #EEE" }}
                            key={row._id}
                          >
                            <StyledTableCell component="th" scope="row">
                              {row?.event_name}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row?.event_start_date}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row?.event_end_date}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {row?.event_type}
                            </StyledTableCell>
                            {row?.event_description.length > 10 ? (
                              <StyledTableCell align="center">
                                <Button className="event-mapping-value-text-size">
                                  {row?.event_description.length > 10 ? (
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <div>{row?.event_description}</div>
                                        </div>
                                      }
                                      component={
                                        <Typography className="event-mapping-value-text-size">
                                          {row?.event_description.slice(0, 10) +
                                            "..."}
                                        </Typography>
                                      }
                                    />
                                  ) : (
                                    row?.event_description
                                  )}
                                </Button>
                              </StyledTableCell>
                            ) : (
                              <StyledTableCell align="center">
                                <Button className="event-mapping-value-text-size">
                                  {row?.event_description
                                    ? row?.event_description
                                    : "---"}
                                </Button>
                              </StyledTableCell>
                            )}
                            <StyledTableCell align="left">
                              <VisibilityOutlinedIcon
                                onClick={() => {
                                  setToggle(true);
                                  handleDialogOpen();
                                  setCurrentEvent(row);
                                }}
                                sx={{ color: "#39A1D1", cursor: "pointer" }}
                              />
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {data?.data.length > 0 && (
                    <Box className="pagination-container-eventMapping">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `eventMappingSavePageNo`,
                            setPageNumber
                          )
                        }
                        count={count}
                      />
                      <AutoCompletePagination
                        rowsPerPage={rowsPerPage}
                        rowPerPageOptions={rowPerPageOptions}
                        setRowsPerPageOptions={setRowsPerPageOptions}
                        rowCount={rowCount}
                        page={pageNumber}
                        setPage={setPageNumber}
                        localStorageChangeRowPerPage={`eventMappingRowPerPage`}
                        localStorageChangePage={`eventMappingSavePageNo`}
                        setRowsPerPage={setRowsPerPage}
                      ></AutoCompletePagination>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "55vh",
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

        {dialogOpen && (
          <DialogEvent
            handleFromFunction={handleUpdateEvent}
            dialogOpen={dialogOpen}
            handleDialogOpen={handleDialogOpen}
            setDialogOpen={setDialogOpen}
            handleDialogClose={handleDialogClose}
            event={currentEvent}
            toggle={toggle}
            setEventName={setEventName}
            setEventType={setEventType}
            setEventStartDate={setEventStartDate}
            setEventEndDate={setEventEndDate}
            setEventDescription={setEventDescription}
            eventEndDate={eventEndDate}
            eventStartDate={eventStartDate}
            createEventInternalServerError={createEventInternalServerError}
            somethingWentWrongInCreateEvent={somethingWentWrongInCreateEvent}
            loading={loading}
            eventName={eventName}
            eventType={eventType}
            event_description={event_description}
            deleteIcon={deleteIcon}
          ></DialogEvent>
        )}
      </Box>
    </Box>
  );
};

export default EventMapping;
