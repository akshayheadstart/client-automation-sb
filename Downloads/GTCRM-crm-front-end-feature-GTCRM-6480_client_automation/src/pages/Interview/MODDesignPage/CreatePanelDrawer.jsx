import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
  CircularProgress,
  Autocomplete,
  TextField,
  InputAdornment,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Drawer, Checkbox } from "rsuite";
import CloseIcon from "@mui/icons-material/Close";
import DateWisePanelAndSlotCount from "../../../components/shared/CreateSlotAndPanel/DateWisePanelAndSlotCount";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InterviewTimeDetails from "../../PanelAndStudentListDetails/InterviewTimeDetails";
import { gapBetweenSlotOptions } from "../../../constants/LeadStageList";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  calculatePanelAndSlotMaxStartTime,
  calculatePanelAndSlotMinEndTime,
  dateInStringFormat,
  eightAM,
  formattedCurrentDate,
  sixPM,
} from "../../../hooks/GetJsonDate";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { useCreatePanelMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { customFetch } from "../../StudentTotalQueries/helperFunction";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CreatePanelDrawer({
  openDrawer,
  setOpenDrawer,
  currentDate,
  stateList,
  selectedState,
  setSelectedState,
  citiesList,
  setCitiesList,
  interviewLists,
  isInterviewListFetching,
  somethingWentWrong,
  setSomethingWentWrong,
  internalServerError,
  setInternalServerError,
  dateWiseSlotPanelCount,
  isSlotPanelStatusFetching,
  setSkipSelectListApiCall,
  setCallStateListApi,
  setSlotType,
  setCreatedPanelDetails,
  setOpenViewPanelDialog,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();

  const [selectedSlotType, setSelectedSlotType] = useState("");
  const [selectedInterviewMode, setSelectedInterviewMode] = useState("");

  const [selectedGapBetweenSlot, setSelectedGapBetweenSlot] = useState({
    label: "30 min (default)",
    value: 30,
  });

  const [slotCountAndAvailableTime, setSlotCountAndAvailableTime] = useState(
    {}
  );

  const [panelDurationBoxClicked, setPanelDurationBoxClicked] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");

  const [selectedList, setSelectedList] = useState(null);
  const [userLimit, setUserLimit] = useState(null);
  const [userLimitWarning, setUserLimitWarning] = useState(false);

  const [interviewModeWarning, setInterviewModeWarning] = useState(false);

  const [selectedPanel, setSelectedPanel] = useState("");

  const [listOfPanelists, setListOfPanelists] = useState([]);
  const [selectedPanelist, setSelectedPanelist] = useState([]);

  const [slotDuration, setSlotDuration] = useState("");
  const [slotCount, setSlotCount] = useState("");

  const [scheduleData, setScheduleData] = useState([]);

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setCitiesList([]);
  };

  const handleSlotType = (e) => {
    if (e.target.value === "gd") {
      setSelectedSlotType("gd");
      setSlotType("gd");
    } else if (e.target.value === "pi") {
      setSelectedSlotType("pi");
      setSlotType("pi");
    }
    setSkipSelectListApiCall(false);
    setUserLimit(null);
    setSelectedList(null);
    setSelectedPanelist([]);
  };

  const handleInterviewMode = (e) => {
    if (e.target.value === "Online") {
      setSelectedInterviewMode("Online");
    } else if (e.target.value === "Offline") {
      setSelectedInterviewMode("Offline");
    }
    setInterviewModeWarning("");
    setSelectedState("");
    setSelectedCity("");
  };

  const [startTime, setStartTime] = useState(eightAM);
  const [endTime, setEndTime] = useState(sixPM);

  const [maxStartTime, setMaxStartTime] = useState(sixPM);
  const [minEndTime, setMinEndTime] = useState(eightAM);

  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleString("en-US", options);
    return formattedDate;
  }

  function convertToCustomFormat(dateArray) {
    const start_date = formatDate(dateArray[0]);
    const end_date = formatDate(dateArray[1]);

    const [start_date_part, start_time_part] = start_date.split(", ");
    const [end_date_part, end_time_part] = end_date.split(", ");

    return {
      start_time: { date: start_date_part, time: start_time_part },
      end_time: { date: end_date_part, time: end_time_part },
    };
  }

  const dateArray = [startTime, endTime];

  const customFormat = convertToCustomFormat(dateArray);

  //converted date like 10 August 2023
  const convertedDate = dateInStringFormat(currentDate);

  const panelistPayload = {
    interview_list_id: selectedList?.value,
  };

  const getPanelPayload = {
    slot_type: selectedSlotType,
    interview_list_id: selectedList?.value,
  };

  //get panelists and panel name
  useEffect(() => {
    if (selectedList && startTime && endTime) {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/user/panelists/?college_id=${collegeId}`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(panelistPayload))
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.detail) {
            pushNotification("error", data.detail);
          } else if (data?.data) {
            try {
              if (Array.isArray(data?.data)) {
                const listOfUsers = data?.data?.map((item) => {
                  return {
                    label: item.name,
                    value: item._id,
                  };
                });

                setListOfPanelists(listOfUsers);
              } else {
                throw new Error("list of panelists API response has changed");
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
            }
          }
        })
        .catch(() => {
          handleInternalServerError(setInternalServerError, "", 5000);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedList, startTime, endTime, collegeId]);

  const startDateString = `${formattedCurrentDate(convertedDate)} ${
    customFormat?.start_time?.time
  }`;
  const endDateString = `${formattedCurrentDate(convertedDate)} ${
    customFormat?.end_time?.time
  }`;

  const [panelDuration, setPanelDuration] = useState(null);
  const [slotDurationWarning, setSlotDurationWarning] = useState("");
  const [slotCountWarning, setSlotCountWarning] = useState("");

  useEffect(() => {
    // Given time strings
    const startTimeString = customFormat?.start_time?.time;
    const endTimeString = customFormat?.end_time?.time;

    // Function to convert time in "HH:MM AM/PM" format to minutes
    function convertToMinutes(timeString) {
      const [time, period] = timeString.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      let totalMinutes = hours * 60 + minutes;

      if (period === "PM" && hours !== 12) {
        totalMinutes += 12 * 60;
      }

      return totalMinutes;
    }

    // Convert start and end times to minutes
    const startTimeMinutes = convertToMinutes(startTimeString);
    const endTimeMinutes = convertToMinutes(endTimeString);

    // Calculate the duration in minutes
    const durationMinutes = endTimeMinutes - startTimeMinutes;

    setPanelDuration(durationMinutes);
  }, [customFormat?.end_time?.time, customFormat?.start_time?.time]);

  const handleSlotDuration = (
    panelDuration,
    slotCount,
    selectedGapBetweenSlot
  ) => {
    if (slotCount && panelDuration && selectedGapBetweenSlot) {
      const breakMinutes =
        (parseInt(slotCount) - 1) * parseInt(selectedGapBetweenSlot);
      const remainingTime = panelDuration - breakMinutes;

      const calculateSlotDuration = Math.floor(remainingTime / slotCount);

      if (calculateSlotDuration < 10) {
        setSlotDurationWarning("Min slot duration must be 10 min");
      } else {
        setSlotDurationWarning("");
      }
      setSlotDuration(calculateSlotDuration);
    } else {
      setSlotDuration("");
    }
  };

  const handleSlotCount = (
    panelDuration,
    slotDuration,
    selectedGapBetweenSlot
  ) => {
    if (panelDuration && slotDuration && selectedGapBetweenSlot) {
      const totalDuration = panelDuration;
      // Gap between each slot in minutes
      const gapDuration = parseInt(selectedGapBetweenSlot);

      // Calculate the effective duration of each slot (including the gap)
      const effectiveSlotDuration = parseInt(slotDuration) + gapDuration;

      // Calculate the number of complete slots that can be created
      const completeSlots = Math.floor(totalDuration / effectiveSlotDuration);

      // Calculate the remaining time after creating complete slots
      const remainingTime =
        totalDuration - completeSlots * effectiveSlotDuration;

      // Calculate the number of slots, considering the remaining time
      const numberOfSlots =
        completeSlots + (remainingTime >= parseInt(slotDuration) ? 1 : 0);
      if (numberOfSlots < 1) {
        setSlotCountWarning("Min slot count must be 1");
      } else {
        setSlotCountWarning("");
      }
      setSlotCount(numberOfSlots);
    } else {
      setSlotCount("");
    }
  };

  const createPanelPayload = {
    name: selectedPanel,
    slot_type: selectedSlotType,
    panel_type: selectedInterviewMode,
    interview_list_id: selectedList?.value,
    panelists: selectedPanelist?.map((panelist) => panelist?.value),
    panel_duration: panelDuration?.toString(),
    gap_between_slots: selectedGapBetweenSlot?.value?.toString(),
    slot_count: parseInt(slotCount),
    slot_duration: slotDuration?.toString(),
    status: "Draft",
  };

  if (startTime && endTime) {
    panelistPayload.start_time = startDateString;
    panelistPayload.end_time = endDateString;

    createPanelPayload.time = startDateString;
    createPanelPayload.end_time = endDateString;

    getPanelPayload.start_time = startDateString;
    getPanelPayload.end_time = endDateString;
  }

  if (userLimit) {
    createPanelPayload.user_limit = parseInt(userLimit);
  }

  if (selectedState && selectedCity) {
    createPanelPayload.state = selectedState;
    createPanelPayload.city = selectedCity?.name;
  }

  const [loadingCreatePanel, setLoadingCreatePanel] = useState(false);
  const [createPanel] = useCreatePanelMutation();

  const handleCreatePanel = (event) => {
    event.preventDefault();
    if (!selectedInterviewMode) {
      setInterviewModeWarning("Please select interview mode");
    } else if (
      !slotDurationWarning &&
      !slotCountWarning &&
      !userLimitWarning &&
      !startTimeError &&
      !endTimeError
    ) {
      setLoadingCreatePanel(true);
      createPanel({
        collegeId,
        payload: createPanelPayload,
      })
        .unwrap()
        .then((data) => {
          try {
            if (data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.message) {
              pushNotification("success", data?.message);
              setCreatedPanelDetails(data);
              setOpenViewPanelDialog(true);
              handleCloseDrawer();
            } else if (data?.detail) {
              pushNotification("error", data?.detail);
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          } else if (error?.status === 500) {
            handleInternalServerError(setInternalServerError, "", 5000);
          }
        })
        .finally(() => setLoadingCreatePanel(false));
    }
  };

  const [panelOrSlotDetails, setPanelOrSlotDetails] = useState({
    panel_duration: panelDuration,
    slots: [],
    time: `${convertedDate}  ${customFormat?.start_time?.time}`,
    end_time: `${convertedDate}  ${customFormat?.end_time?.time}`,
  });

  useEffect(() => {
    const slots = [];
    for (let i = 0; i < slotCount; i++) {
      slots.push({ slot_duration: parseInt(slotDuration), _id: i });
    }
    setPanelOrSlotDetails((prev) => ({
      ...prev,
      panel_duration: panelDuration,
      time: `${convertedDate}  ${customFormat?.start_time?.time}`,
      end_time: `${convertedDate}  ${customFormat?.end_time?.time}`,
      slots: slots,
    }));
  }, [
    convertedDate,
    customFormat?.end_time?.time,
    customFormat?.start_time?.time,
    panelDuration,
    slotCount,
    slotDuration,
  ]);

  const [gapBetweenSlots, setGapBetweenSlots] = useState({
    label: selectedGapBetweenSlot?.label,
    value: parseInt(selectedGapBetweenSlot?.value),
  });

  useEffect(() => {
    setGapBetweenSlots({
      label: selectedGapBetweenSlot?.label,
      value: parseInt(selectedGapBetweenSlot?.value),
    });
  }, [selectedGapBetweenSlot]);

  return (
    <Drawer
      open={openDrawer}
      onClose={handleCloseDrawer}
      size={fullScreen ? "md" : "lg"}
    >
      <Box sx={{ px: { md: 4, xs: 2 }, py: 2 }} className="create-slot-drawer">
        {loadingCreatePanel && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <CircularProgress color="info" />
          </Box>
        )}
        <Box className="create-slot-drawer-close-icon">
          <IconButton onClick={() => handleCloseDrawer()}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box className="create-slot-header">
          <Typography variant="h6">Create Panel</Typography>
          <Typography variant="h5">
            {dateInStringFormat(currentDate)}
          </Typography>
        </Box>

        {internalServerError || somethingWentWrong ? (
          <>
            {internalServerError && (
              <Error500Animation height={200} width={200}></Error500Animation>
            )}
            {somethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <form onSubmit={handleCreatePanel}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <Box sx={{ mb: "25px" }}>
                  <Typography variant="body1">Slot Type</Typography>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handleSlotType}
                    >
                      <FormControlLabel
                        value="gd"
                        control={<Radio required />}
                        label="GD"
                      />
                      <FormControlLabel
                        value="pi"
                        control={<Radio required />}
                        label="PI"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>

                {selectedInterviewMode === "Offline" && (
                  <Box sx={{ marginBottom: "25px" }}>
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      onOpen={() => setCallStateListApi(true)}
                      options={stateList}
                      getOptionLabel={(option) => option?.label}
                      onChange={(_, newValue) => {
                        setSelectedState(newValue?.value);
                        setSelectedCity("");
                      }}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="State"
                          color="info"
                        />
                      )}
                    />
                  </Box>
                )}

                <Box sx={{ marginBottom: "25px" }}>
                  <Autocomplete
                    disabled={selectedSlotType ? false : true}
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={selectedList}
                    options={interviewLists}
                    getOptionLabel={(option) => option?.label}
                    onChange={(_, newValue) => {
                      setSelectedList(newValue);
                      setSelectedPanelist([]);
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Select List"
                        color="info"
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Autocomplete
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    value={selectedGapBetweenSlot || null}
                    options={gapBetweenSlotOptions}
                    getOptionLabel={(option) => option?.label}
                    onChange={(_, newValue) => {
                      setSelectedGapBetweenSlot(newValue);
                      setSlotCount("");
                      setSlotDuration("");
                    }}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Gap Between Slots"
                        color="info"
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={4}>
                <Box sx={{ mb: "25px" }}>
                  <Typography variant="body1">Interview Mode</Typography>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      onChange={handleInterviewMode}
                    >
                      <FormControlLabel
                        value="Online"
                        control={<Radio required />}
                        label="Online"
                      />
                      <FormControlLabel
                        value="Offline"
                        control={<Radio required />}
                        label="Offline"
                      />
                    </RadioGroup>
                  </FormControl>
                  {interviewModeWarning && (
                    <FormHelperText
                      sx={{ color: "#ffa117" }}
                      variant="subtitle1"
                    >
                      {interviewModeWarning}
                    </FormHelperText>
                  )}
                </Box>
                {selectedInterviewMode === "Offline" && (
                  <Box sx={{ marginBottom: "25px" }}>
                    <Autocomplete
                      size="small"
                      disablePortal
                      id="combo-box-demo"
                      getOptionLabel={(option) => option?.name}
                      options={citiesList}
                      value={selectedCity || null}
                      onChange={(_, newValue) => {
                        setSelectedCity(newValue);
                      }}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          label="City"
                          color="info"
                        />
                      )}
                    />
                  </Box>
                )}
                <Box sx={{ marginBottom: "25px" }}>
                  <Autocomplete
                    disabled={
                      selectedList && startTime && endTime ? false : true
                    }
                    multiple
                    id="size-small-outlined-multi"
                    size="small"
                    options={listOfPanelists}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option?.label}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option?.label}
                      </li>
                    )}
                    style={{ width: "100%" }}
                    isOptionEqualToValue={(option, value) =>
                      option?.value === value?.value
                    }
                    value={selectedPanelist}
                    onChange={(_, newValue) => {
                      setSelectedPanelist(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        required={selectedPanelist?.length === 0 ? true : false}
                        {...params}
                        size="small"
                        label="Panelist Name"
                        color="info"
                      />
                    )}
                  />
                </Box>

                <TextField
                  color="info"
                  size="small"
                  type="number"
                  id="outlined-basic"
                  label="Slot Count"
                  variant="outlined"
                  sx={{
                    width: "100%",
                  }}
                  value={slotCount}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || (value >= 1 && value <= 100)) {
                      setSlotCount(value);
                      handleSlotDuration(
                        panelDuration,
                        value,
                        selectedGapBetweenSlot?.value
                      );
                      if (value === "") {
                        setSlotCountWarning("");
                      } else {
                        setSlotCountWarning("");
                      }
                    } else {
                      setSlotCountWarning(
                        "Minimum slot count must be 1 and the maximum is 100"
                      );
                    }
                  }}
                />
                {slotCountWarning && (
                  <FormHelperText sx={{ color: "#ffa117" }} variant="subtitle1">
                    {slotCountWarning}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={6} md={4}>
                <Box style={{ width: "100%", marginBottom: "30px" }} />
                {selectedSlotType === "gd" && (
                  <Box sx={{ marginBottom: "25px" }}>
                    <TextField
                      color="info"
                      required
                      size="small"
                      type="number"
                      id="outlined-basic"
                      label="User Limit"
                      variant="outlined"
                      sx={{
                        width: "100%",
                      }}
                      onWheel={(e) => e.target.blur()}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value > 0 && value <= 10) {
                          setUserLimit(value);
                          setUserLimitWarning("");
                        } else {
                          setUserLimitWarning(
                            "Min user limit is 1 and max user limit is 10"
                          );
                        }
                      }}
                    />

                    {userLimitWarning && (
                      <FormHelperText
                        sx={{ color: "#ffa117" }}
                        variant="subtitle1"
                      >
                        {userLimitWarning}
                      </FormHelperText>
                    )}
                  </Box>
                )}

                <>
                  <FormControl
                    size="small"
                    required
                    sx={{ mb: "20px", width: "100%" }}
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Panel Duration
                    </InputLabel>
                    <OutlinedInput
                      required
                      size="small"
                      id="outlined-adornment-password"
                      type="text"
                      value={`${
                        startTime && customFormat?.start_time?.time
                      } - ${
                        startTime && endTime && customFormat?.end_time?.time
                      }`}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton aria-label="select time" edge="end">
                            <AccessTimeIcon />
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Panel Duration"
                      onClick={() => {
                        if (!startTimeError && !endTimeError) {
                          setPanelDurationBoxClicked((prev) => !prev);
                        }
                      }}
                    />
                  </FormControl>

                  {panelDurationBoxClicked && (
                    <Box className="panel-duration-time-selection-box">
                      <Box className="panel-duration-time-selection-inner-box">
                        <Box>
                          <Typography variant="subtitle1">
                            Start Time:
                          </Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                              ampmInClock={true}
                              onError={(error) => {
                                if (error) {
                                  setStartTimeError("Start time is not valid");
                                } else {
                                  setStartTimeError("");
                                }
                              }}
                              sx={{ width: 130 }}
                              value={startTime}
                              minTime={eightAM}
                              maxTime={maxStartTime}
                              onChange={(value) => {
                                setStartTime(value);
                                const remainingMinTime =
                                  calculatePanelAndSlotMinEndTime(value);
                                setMinEndTime(remainingMinTime);
                                setSlotCount("");
                                setSlotDuration("");
                                setSelectedPanelist([]);
                              }}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </LocalizationProvider>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1">End Time:</Typography>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                              ampmInClock={true}
                              onError={(error) => {
                                if (error) {
                                  setEndTimeError("End time is not valid");
                                } else {
                                  setEndTimeError("");
                                }
                              }}
                              sx={{ width: 130 }}
                              value={endTime}
                              minTime={minEndTime}
                              maxTime={sixPM}
                              onChange={(value) => {
                                setEndTime(value);
                                const remainingMaxTime =
                                  calculatePanelAndSlotMaxStartTime(value);
                                setMaxStartTime(remainingMaxTime);
                                setSlotCount("");
                                setSlotDuration("");
                                setSelectedPanelist([]);
                              }}
                              slotProps={{ textField: { size: "small" } }}
                            />
                          </LocalizationProvider>
                        </Box>
                      </Box>

                      <Box className="time-picker-error-box">
                        {startTimeError && (
                          <FormHelperText
                            sx={{ color: "#ffa117" }}
                            variant="subtitle1"
                          >
                            {startTimeError}
                          </FormHelperText>
                        )}
                        {endTimeError && (
                          <FormHelperText
                            sx={{ color: "#ffa117" }}
                            variant="subtitle1"
                          >
                            {endTimeError}
                          </FormHelperText>
                        )}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Button
                          disabled={
                            startTimeError || endTimeError ? true : false
                          }
                          size="sm"
                          variant="contained"
                          color="info"
                          onClick={() => setPanelDurationBoxClicked(false)}
                        >
                          Ok
                        </Button>
                      </Box>
                    </Box>
                  )}
                </>

                <Box sx={{ marginBottom: "25px" }}>
                  <TextField
                    color="info"
                    required
                    size="small"
                    type="text"
                    id="outlined-basic"
                    label="Panel Name"
                    variant="outlined"
                    sx={{
                      width: "100%",
                    }}
                    onChange={(e) => {
                      setSelectedPanel(e.target.value);
                    }}
                  />
                </Box>

                <TextField
                  color="info"
                  required
                  size="small"
                  type="number"
                  id="outlined-basic"
                  label="Slot Duration in min"
                  variant="outlined"
                  sx={{
                    width: "100%",
                  }}
                  value={slotDuration}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSlotDuration(value);
                    handleSlotCount(
                      panelDuration,
                      value,
                      selectedGapBetweenSlot?.value
                    );
                    if (value < 10) {
                      setSlotDurationWarning(
                        "Min slot duration must be 10 min"
                      );
                    } else {
                      setSlotDurationWarning("");
                    }
                  }}
                />
                {slotDurationWarning && (
                  <FormHelperText sx={{ color: "#ffa117" }} variant="subtitle1">
                    {slotDurationWarning}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>

            <InterviewTimeDetails
              gapBetweenSlots={gapBetweenSlots}
              setSlotCountAndAvailableTime={setSlotCountAndAvailableTime}
              panelOrSlotDetails={panelOrSlotDetails}
              slotCountAndAvailableTime={slotCountAndAvailableTime}
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
              preview={true}
            />

            <Box className="create-slot-drawer-button-box">
              <button type="submit" className="create-slot-drawer-button">
                Create Panel
              </button>
            </Box>
          </form>
        )}
        <DateWisePanelAndSlotCount
          from="create-panel"
          dateWiseSlotPanelCount={dateWiseSlotPanelCount}
          isSlotPanelStatusFetching={isSlotPanelStatusFetching}
        />
      </Box>
    </Drawer>
  );
}
