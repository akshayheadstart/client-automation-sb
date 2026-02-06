/* eslint-disable array-callback-return */
/* eslint-disable no-self-compare */
import "../../styles/PanelAndStudentListDetails.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Box, Card, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import {
  calculateTotalDurationInMinutes,
  dateCompare,
  handleDataMatching,
  handleMarginTopFunction,
  timeDurationFunction,
} from "../../helperFunctions/calendarHelperfunction";
import "../../styles/CalendarMOD.css";
import { format, addDays, subDays, isAfter, isBefore } from "date-fns";
import { useGetAllPanelAndSlotDataQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import PanelAndStudentLIstDetailsDrawer from "../../pages/PanelAndStudentListDetails/PanelAndStudentLIstDetailsDrawer";
import CustomTooltip from "../shared/Popover/Tooltip";
import { timeDataArray } from "../Calendar/utils";
import CalendarTimeData from "../shared/CalendarTimeData/CalendarTimeData";

const CalendarMOD = ({
  time,
  checkBoxPanelIndex,
  setCheckBoxPanelIndex,
  checkBoxSlotIndex,
  setCheckBoxSlotIndex,
  setPanelOrSlot,
  panelOrSlot,
  checkboxShow,
  role,
  handleClickOpen,
  setStudentLength,
  reschedule,
  handlePublishClickOpen,
  setSelectedSlotAndPanel,
  setSelectedDate,
  currentDate,
  setCurrentDate,
  formatDateToFilter,
  date,
  setReschedule,
  setTakeSlotId,
  setSelectedStudentsApplicationId,
  setSelectedDateWisePublish,
  setSlotId,
  filterDataPayload,
  setSlotDetails,
  setCompareDate,
  calendarFilterPayload,
  handleGetViewStudentInfoData,
  setCalendarFilterPayload,
}) => {
  // states of the drawer, panel, gd and pi
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerSize, setDrawerSize] = useState("lg");
  const [headerDetails, setHeaderDetails] = useState({});
  const [typeOfPanel, setTypeOfPanel] = useState("");
  const [openReschedule, setOpenReschedule] = useState(false);
  const [slotOrPanelId, setSlotOrPanelId] = useState("");

  // function to configure panel, gd and pi
  const handleDrawerSize = (size, headerDetails, panelType) => {
    setDrawerSize(size);
    setOpenDrawer(true);
    setHeaderDetails(headerDetails);
    setTypeOfPanel(panelType);
  };
  const panelData = {
    heading: "Panel Name",
    list_name: "List Name",
    type: "GD",
    date: "08 June 2023",
  };

  const gdData = {
    heading: "Slot Time",
    list_name: "List Name",
    type: "GD",
    date: "08 June 2023",
  };
  const piData = {
    heading: "Slot Time",
    list_name: "List Name",
    type: "PI",
    date: "08 June 2023",
  };

  const BpIcon = styled("span")(({ theme }) => ({
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 0 0 1px rgb(16 22 26 / 40%)"
        : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
    backgroundImage:
      theme.palette.mode === "dark"
        ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
        : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    ".Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background:
        theme.palette.mode === "dark"
          ? "rgba(57,75,89,.5)"
          : "rgba(206,217,224,.5)",
    },
  }));

  const BpCheckedIcon = styled(BpIcon)({
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  });
  function BpCheckbox(props) {
    return (
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        sx={{
          "&:hover": { bgcolor: "transparent" },
          width: "35px",
          height: "30px",
        }}
        // disableRipple
        color="default"
        checkedIcon={<BpCheckedIcon />}
        icon={<BpIcon />}
        inputProps={{ "aria-label": "Checkbox demo" }}
        {...props}
      />
    );
  }
  const handleGrid = () => {
    setPanelOrSlot(true);
  };
  const formattedDate = currentDate?.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const dateSplit = formattedDate?.split(" ");
  const handleCardPanel = (card, time, id, date) => {
    let marginTop = 0;
    let updatedHeightToPanelString;
    const startTimeSplit = time.split("-");
    const startTimeSplitAgain = startTimeSplit[0].split(":");
    const joinStartTimeSplit = `${startTimeSplitAgain[0]}.${startTimeSplitAgain[1]}`;
    const joinStartTimeToFixed = parseFloat(joinStartTimeSplit).toFixed(2);
    const startTimeToParseFloat = parseFloat(joinStartTimeToFixed);
    const endTimeSplit = time.split("-");
    const endTImeSplitIndex = endTimeSplit[1];
    marginTop = handleMarginTopFunction(marginTop, startTimeToParseFloat);

    const totalTimeDuration = calculateTotalDurationInMinutes(
      startTimeSplit[0],
      endTImeSplitIndex.slice(1)
    );
    updatedHeightToPanelString = timeDurationFunction(
      totalTimeDuration,
      updatedHeightToPanelString
    );

    const handleChangeCheckbox = (id, event) => {
      setCheckBoxSlotIndex((prevCheckboxValues) => ({
        ...prevCheckboxValues,
        [id]: event.target.checked,
      }));
      setOpenDrawer(false);
    };
    return (
      <CustomTooltip
        title={`${card?.name}`}
        description={
          <div>
            {" "}
            <ul>
              {" "}
              <li>Duration: {card?.time}</li>
              <li>Type: {card?.pi ? "PI" : "GD"}</li>
              <li>Status : {card.publish ? "Published" : "Unpublished"}</li>
            </ul>{" "}
            <div>
              If you want to get more details about this Panel. please click on
              it.
            </div>
          </div>
        }
        component={
          <Card
            sx={{
              height: `${updatedHeightToPanelString}px`,
              width: "100%",
              bgcolor: "#09BBD0",
              position: "relative",
              mt: `${marginTop}px`,
              border: "0.5px solid white",
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              if (role === "panelist") {
                if (card?.can_delete === false) {
                  handleGetViewStudentInfoData(id);
                  setPanelOrSlot(true);
                  setSlotId(id);
                } else {
                  pushNotification(
                    "warning",
                    "Student has not taken this slot."
                  );
                }
              } else {
                handleDrawerSize("lg", panelData);
                if (reschedule) {
                  setOpenReschedule(true);
                }
              }
              handleDefaultDate(date);
              setStudentLength(true);
              // setPanelOrSlot(false);
              setCompareDate(currentDate);
              setSlotOrPanelId(id);
            }}
          >
            {role === "panelist" ? (
              <Typography className="text-data-container">
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  {reschedule ? (
                    <Box
                      sx={{
                        borderRadius: 50,
                        mt: `${reschedule ? "10px" : ""}`,
                        ml: "23px",
                        bgcolor: card.publish ? "#00DC80" : "#D3D3D3",
                      }}
                      className="active-box-data"
                    ></Box>
                  ) : (
                    <Box
                      sx={{
                        borderRadius: 50,
                        mt: `${reschedule ? "10px" : ""}`,
                        ml: "23px",
                        bgcolor: card.publish ? "#00DC80" : "#D3D3D3",
                      }}
                      className="active-box-data"
                    ></Box>
                  )}
                  {/* <Box sx={{height:'10px', width:'30px',bgcolor:'white'}}></Box> */}
                  {reschedule === false && (
                    <>
                      {card.can_delete && (
                        <BpCheckbox
                          checked={checkBoxSlotIndex[card.id] || false}
                          onChange={(event) => {
                            handleChangeCheckbox(card.id, event);
                          }}
                        />
                      )}
                    </>
                  )}
                </Typography>
              </Typography>
            ) : (
              <Typography className="text-data-container">
                {reschedule ? (
                  <Box
                    sx={{
                      borderRadius: 50,
                      mt: `${reschedule ? "10px" : ""}`,
                      ml: "23px",
                      bgcolor: card.publish ? "#00DC80" : "#D3D3D3",
                    }}
                    className="active-box-data"
                  ></Box>
                ) : (
                  <Box className="calendar_mod_name_panel_container">
                    <Box
                      sx={{
                        borderRadius: 50,
                        mt: `${reschedule ? "10px" : ""}`,
                        ml: "23px",
                        bgcolor: card.publish ? "#00DC80" : "#D3D3D3",
                      }}
                      className="active-box-data"
                    ></Box>
                    {card?.name ? (
                      <Typography className="calendar_mod_name_text">
                        {card?.name
                          ? card?.name?.toUpperCase()?.slice(0, 2)
                          : "N/A"}
                      </Typography>
                    ) : (
                      <Typography className="calendar_mod_name_text">
                        N/A
                      </Typography>
                    )}
                  </Box>
                )}

                {reschedule === false && (
                  <>
                    {card?.can_delete && (
                      <BpCheckbox
                        checked={checkBoxSlotIndex[card.id] || false}
                        onChange={(event) => {
                          handleChangeCheckbox(card.id, event);
                        }}
                      />
                    )}
                  </>
                )}
              </Typography>
            )}
          </Card>
        }
      />
    );
  };

  const handleSlot = (slot, time, id, date) => {
    let marginTop = 0;
    let updatedHeightToString;

    const startTimeSplit = time.split("-");
    const startTimeSplitAgain = startTimeSplit[0].split(":");
    const joinStartTimeSplit = `${startTimeSplitAgain[0]}.${startTimeSplitAgain[1]}`;
    const joinStartTimeToFixed = parseFloat(joinStartTimeSplit).toFixed(2);
    const startTimeToParseFloat = parseFloat(joinStartTimeToFixed);

    const endTimeSplit = time.split("-");
    const endTImeSplitIndex = endTimeSplit[1];
    marginTop = handleMarginTopFunction(marginTop, startTimeToParseFloat);
    const totalTimeDuration = calculateTotalDurationInMinutes(
      startTimeSplit[0],
      endTImeSplitIndex.slice(1)
    );
    updatedHeightToString = timeDurationFunction(
      totalTimeDuration,
      updatedHeightToString
    );
    const handleChangeCheckbox = (id, event) => {
      setCheckBoxSlotIndex((prevCheckboxValues) => ({
        ...prevCheckboxValues,
        [id]: event.target.checked,
      }));
      setOpenDrawer(false);
    };

    return (
      <CustomTooltip
        description={
          <div>
            {" "}
            <ul>
              {" "}
              <li>Duration: {slot?.time}</li>
              <li>Type: {slot?.pi ? "PI" : "GD"}</li>
              <li>Status : {slot.publish ? "Published" : "Unpublished"}</li>
            </ul>{" "}
            <div>
              If you want to get more details about this slot. please click on
              it.
            </div>
          </div>
        }
        component={
          <Card
            sx={{
              height: `${updatedHeightToString}px`,
              width: "100%",
              bgcolor: slot.pi ? "#039BDC" : "#0055C2",
              mt: `${marginTop}px`,
              border: "0.5px solid white",
              zIndex: 1,
              cursor: "pointer",
            }}
            onClick={() => {
              if (role === "panelist") {
                if (slot?.can_delete === false) {
                  handleGetViewStudentInfoData(id);
                  setPanelOrSlot(true);
                  setSlotId(id);
                } else {
                  pushNotification(
                    "warning",
                    "Student has not taken this slot."
                  );
                }
              } else {
                handleDrawerSize(
                  "md",
                  slot.pi ? piData : gdData,
                  slot.pi ? "pi" : "gd"
                );
                if (reschedule) {
                  setOpenReschedule(true);
                }
              }

              handleDefaultDate(date);
              setStudentLength(slot.pi);
              // setPanelOrSlot(false);
              setCompareDate(currentDate);
              setSlotOrPanelId(id);
            }}
          >
            {role === "panelist" ? (
              <Typography className="text-data-container">
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  {reschedule ? (
                    <Box
                      sx={{
                        borderRadius: 50,
                        mt: `${reschedule ? "10px" : ""}`,
                        bgcolor: slot.publish ? "#00DC80" : "#D3D3D3",
                      }}
                      className="active-box-data"
                    ></Box>
                  ) : (
                    <Box
                      sx={{
                        borderRadius: 50,
                        mt: `${reschedule ? "10px" : "3px"}`,
                        bgcolor: slot.publish ? "#00DC80" : "#D3D3D3",
                      }}
                      className="active-box-data"
                      onClick={() => {
                        handleGrid();
                        setStudentLength(slot.pi);
                      }}
                    ></Box>
                  )}
                  {reschedule === false && (
                    <>
                      {slot?.can_delete && (
                        <BpCheckbox
                          checked={checkBoxSlotIndex[slot.id] || false}
                          onChange={(event) => {
                            handleChangeCheckbox(slot.id, event);
                          }}
                        />
                      )}
                    </>
                  )}
                </Typography>
                {!dateCompare(todayActiveDate, currentDate) ? (
                  ""
                ) : (
                  <>
                    {slot.is_available ? (
                      <Typography
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickOpen();
                          setTakeSlotId(slot.id);
                          setSlotDetails(slot);
                        }}
                        className="take-slot-button-text"
                      >
                        Take Slot
                      </Typography>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </Typography>
            ) : (
              <Typography className="text-data-container">
                {reschedule ? (
                  <Box
                    sx={{
                      borderRadius: 50,
                      mt: `${reschedule ? "10px" : ""}`,
                      bgcolor: slot.publish ? "#00DC80" : "#D3D3D3",
                    }}
                    className="active-box-data"
                  ></Box>
                ) : (
                  <Box
                    sx={{
                      borderRadius: 50,
                      mt: `${reschedule ? "10px" : "5px"}`,
                      bgcolor: slot.publish ? "#00DC80" : "#D3D3D3",
                    }}
                    className="active-box-data"
                    onClick={() => {
                      handleGrid();
                      setStudentLength(slot.pi);
                    }}
                  ></Box>
                )}

                {reschedule === false && (
                  <>
                    {slot?.can_delete && (
                      <BpCheckbox
                        checked={checkBoxSlotIndex[slot.id] || false}
                        onChange={(event) => {
                          handleChangeCheckbox(slot.id, event);
                        }}
                      />
                    )}
                  </>
                )}
              </Typography>
            )}
          </Card>
        }
      />
    );
  };
  const handleDefaultDate = (date) => {
    setSelectedDate(date);
  };
  const startDate = new Date("Jan 01 2000");
  const endDate = new Date("Dec 30 2099");

  const handleNext = () => {
    const nextDate = addDays(currentDate, 1);
    if (!isAfter(nextDate, endDate)) {
      setCurrentDate(nextDate);
    }
  };

  const handlePrevious = () => {
    const previousDate = subDays(currentDate, 1);
    if (!isBefore(previousDate, startDate)) {
      setCurrentDate(previousDate);
    }
  };
  const addLeadingZero = (number) => {
    return number < 10 ? "0" + number : number;
  };
  const todayActiveDate = new Date();
  const [dateWiseData, setDateWiseData] = useState([]);
  const nextDate = addDays(currentDate, 1);
  const previousDate = subDays(currentDate, 1);
  const currentDateData = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const currentDateMatching = handleDataMatching(currentDateData);
  const nextDateData = nextDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const nextDateMatching = handleDataMatching(nextDateData);
  const previousDateData = previousDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const currentDateFormat = `${format(
    currentDate,
    "EEE",
    "MMM"
  )} ${addLeadingZero(currentDate.getDate())}, ${currentDate.getFullYear()}`;
  const nextDateFormat = `${format(nextDate, "EEE", "MMM")} ${addLeadingZero(
    nextDate.getDate()
  )}, ${nextDate.getFullYear()}`;

  const currentData = dateWiseData?.find(
    (item) => item.date === currentDateMatching
  );
  const nextData = dateWiseData?.find((item) => item.date === nextDateMatching);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    getPanelAndSlotInternalServerError,
    setGetPanelAndSlotInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInGetPanelAndSlot,
    setSomethingWentWrongInGetPanelAndSlot,
  ] = useState(false);
  //Get All Panel and Slot in particular date Wise API Implementation setup done
  const { data, isSuccess, isFetching, error, isError } =
    useGetAllPanelAndSlotDataQuery(
      {
        filterDataPayload: calendarFilterPayload,
        date: date,
        collegeId: collegeId,
      },
      { skip: false }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setDateWiseData(data?.data);
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
          handleInternalServerError(
            setGetPanelAndSlotInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInGetPanelAndSlot, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    error?.status,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
  ]);
  return (
    <Box sx={{ position: "relative", minWidth: "500px" }}>
      <Box
        sx={{ width: "100%", position: "absolute", alignItems: "start" }}
        className="carousel-slider"
      >
        <ArrowBackIosIcon
          sx={{
            cursor: "pointer",
            fontSize: 40,
            pt: 10,
            position: "relative",
            height: "0%",
          }}
          onClick={() => {
            handlePrevious();
            formatDateToFilter(previousDateData);
            setPanelOrSlot(false);
            setCheckBoxSlotIndex({});
          }}
        ></ArrowBackIosIcon>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            paddingX: 2,
            gap: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(217, 253, 255, 0.60)",
              mt: 4,
              p: 3,
              ml: 3,
              height: "830px",
              borderRadius: "8px",
              width: "100%",
            }}
            // alt={`Slide ${currentIndex}`}
          >
            <Box
              sx={{ width: "200px", display: "flex", flexDirection: "column" }}
            >
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  justifyContent: "start",
                }}
              >
                <Typography sx={{ fontSize: 50, fontWeight: 800 }}>
                  {" "}
                  {currentDateFormat?.slice(4, 6)}
                </Typography>
                {/* {role === "panelist" ? (
                  ""
                ) : (
                  <Button
                    onClick={() => {
                      handlePublishClickOpen();
                      handleDefaultDate(currentDateFormat);
                      setSelectedDateWisePublish(true);
                    }}
                    color="info"
                    sx={{ borderRadius: 50, paddingX: 3, mt: 2 }}
                    variant="contained"
                    size="small"
                    disabled={
                      !dateCompare(todayActiveDate, currentDate) ||
                      (currentData?.totalPI === 0 && currentData?.totalGD === 0)
                    }
                  >
                    Publish
                  </Button>
                )} */}
              </Typography>
              <Typography sx={{ fontWeight: 500, ml: "-140px" }}>
                {currentDateFormat?.slice(0, 3)}
              </Typography>
            </Box>
            <Typography className="calendar-Mod-Month-show">
              {dateSplit[0]}
            </Typography>

            {getPanelAndSlotInternalServerError ||
            somethingWentWrongInGetPanelAndSlot ? (
              <>
                {getPanelAndSlotInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInGetPanelAndSlot && (
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
                        height={250}
                        width={250}
                      ></LeefLottieAnimationLoader>
                    </Box>
                  </>
                ) : (
                  <>
                    {currentData ? (
                      <Box sx={{ mt: "141px", position: "relative" }}>
                        {currentData?.allTime?.map((time, inx) => {
                          return (
                            <Box sx={{ position: "absolute", width: "100%" }}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "start",
                                  justifyContent: "space-between",
                                  gap: 0,
                                }}
                              >
                                {reschedule ? (
                                  ""
                                ) : (
                                  <>
                                    {currentData?.allTime[inx]?.allPanel?.map(
                                      (card, index) => {
                                        return handleCardPanel(
                                          card,
                                          card.time,
                                          card.id,
                                          currentData?.date
                                        );
                                      }
                                    )}
                                  </>
                                )}
                                {currentData?.allTime[inx]?.allSlot?.map(
                                  (slot, index) => {
                                    return handleSlot(
                                      slot,
                                      slot.time,
                                      slot.id,
                                      currentData?.date
                                    );
                                  }
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </>
            )}
          </Box>

          <Box
            sx={{
              mt: 4,
              backgroundColor: "rgba(236, 236, 236, 0.60)",
              paddingX: 3,
              borderRadius: "8px",
            }}
            className="nextDate-Data-box-container"
            // alt={`Slide ${currentIndex + 1}`}
          >
            <Typography
              sx={{ fontSize: 50, fontWeight: 800, color: "gray", mt: 4 }}
            >
              {nextDateFormat?.slice(4, 6)}
            </Typography>
            <Typography sx={{ color: "gray" }}>
              {nextDateFormat?.slice(0, 3)}
            </Typography>
            {nextData ? (
              <Box sx={{ mt: 13 }}>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "20px", fontWeight: 800 }}>
                    PI-
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 800, color: "#0055C2" }}
                  >
                    {`${nextData?.activePI}/${nextData?.totalPI}`}
                  </Typography>
                </Typography>
                <Typography
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "20px", fontWeight: 800 }}>
                    GD-
                  </Typography>
                  <Typography
                    sx={{ fontSize: "20px", fontWeight: 800, color: "#0055C2" }}
                  >
                    {`${nextData?.activeGD}/${nextData?.totalGD}`}
                  </Typography>
                </Typography>
              </Box>
            ) : (
              ""
            )}
          </Box>
        </Box>
        <ArrowForwardIosIcon
          sx={{ cursor: "pointer", fontSize: 40, pt: 10, height: "0%" }}
          className="arrow-forward-icon"
          onClick={() => {
            handleNext();
            formatDateToFilter(nextDateData);
            setPanelOrSlot(false);
            setCheckBoxSlotIndex({});
          }}
        >
          Next
        </ArrowForwardIosIcon>
      </Box>
      <Box sx={{ pt: 30 }}>
        <Typography sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            sx={{ whiteSpace: "nowrap", fontSize: "15px", fontWeight: 600 }}
          >
            8 am
          </Typography>
          <Typography sx={{ width: "100%" }}>
            <hr className="hr-container" />
          </Typography>
        </Typography>
        {timeDataArray?.map((data) => {
          return (
            <CalendarTimeData
              key={data.id}
              time={data?.time}
            ></CalendarTimeData>
          );
        })}
      </Box>
      {openDrawer && (
        <PanelAndStudentLIstDetailsDrawer
          setCalendarFilterPayload={setCalendarFilterPayload}
          openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
          size={drawerSize}
          data={headerDetails}
          typeOfPanel={typeOfPanel}
          openReschedule={openReschedule}
          setOpenReschedule={setOpenReschedule}
          setReschedule={setReschedule}
          setPanelOrSlot={setPanelOrSlot}
          setSelectedStudentsApplicationId={setSelectedStudentsApplicationId}
          handleGetViewStudentInfoData={handleGetViewStudentInfoData}
          setSlotId={setSlotId}
          slotOrPanelId={slotOrPanelId}
        />
      )}
    </Box>
  );
};

export default CalendarMOD;
