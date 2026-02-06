import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Checkbox, Drawer } from "rsuite";
import CloseIcon from "@mui/icons-material/Close";
import DateWisePanelAndSlotCount from "../../../components/shared/CreateSlotAndPanel/DateWisePanelAndSlotCount";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect } from "react";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import useToasterHook from "../../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import {
  calculatePanelAndSlotMaxStartTime,
  calculatePanelAndSlotMinEndTime,
  convertToCustomFormat,
  dateInStringFormat,
  formattedCurrentDate,
} from "../../../hooks/GetJsonDate";
import { useCreateSlotMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { customFetch } from "../../StudentTotalQueries/helperFunction";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CreateSlotDrawer({
  openCreateSlotDrawer,
  setOpenCreateSlotDrawer,
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
}) {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [selectedSlotType, setSelectedSlotType] = useState("");
  const [selectedInterviewMode, setSelectedInterviewMode] = useState("");

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();

  const handleCloseDrawer = () => {
    setOpenCreateSlotDrawer(false);
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
    setSelectedPanel(null);
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

  const [listOfPanelists, setListOfPanelists] = useState([]);
  const [selectedPanelist, setSelectedPanelist] = useState([]);

  const [selectedCity, setSelectedCity] = useState("");

  const [selectedList, setSelectedList] = useState(null);
  const [userLimit, setUserLimit] = useState(null);
  const [userLimitWarning, setUserLimitWarning] = useState(false);

  const [panelDurationBoxClicked, setPanelDurationBoxClicked] = useState(false);

  const [interviewModeWarning, setInterviewModeWarning] = useState(false);

  const [listOfPanels, setListOfPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState(null);

  const eightAM = dayjs().set("hour", 8).startOf("hour");
  const sixPM = dayjs().set("hour", 18).startOf("hour");

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [maxStartTime, setMaxStartTime] = useState(sixPM);
  const [minEndTime, setMinEndTime] = useState(eightAM);

  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

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
                throw new Error("list of users API response has changed");
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

  useEffect(() => {
    if (selectedList && startTime && endTime && selectedSlotType) {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/planner/get_panel_names/?college_id=${collegeId}`,
        ApiCallHeaderAndBody(token, "POST", JSON.stringify(getPanelPayload))
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

                setListOfPanels(listOfUsers);
              } else {
                throw new Error("list of panels API response has changed");
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
  }, [token, selectedList, startTime, endTime, collegeId, selectedSlotType]);

  const createSlotPayload = {
    slot_type: selectedSlotType,
    interview_mode: selectedInterviewMode,
    panelists: selectedPanelist?.map((panelist) => panelist?.value),
    interview_list_id: selectedList?.value,
    status: "Draft",
  };

  const startDateString = `${formattedCurrentDate(convertedDate)} ${
    customFormat?.start_time?.time
  }`;
  const endDateString = `${formattedCurrentDate(convertedDate)} ${
    customFormat?.end_time?.time
  }`;

  if (startTime && endTime) {
    panelistPayload.start_time = startDateString;
    panelistPayload.end_time = endDateString;

    createSlotPayload.time = startDateString;
    createSlotPayload.end_time = endDateString;

    getPanelPayload.start_time = startDateString;
    getPanelPayload.end_time = endDateString;
  }

  if (userLimit) {
    createSlotPayload.user_limit = parseInt(userLimit);
  }

  if (selectedPanel) {
    createSlotPayload.panel_id = selectedPanel?.value;
  }

  if (selectedState && selectedCity) {
    createSlotPayload.state = selectedState;
    createSlotPayload.city = selectedCity?.name;
  }

  const [loadingCreateSlot, setLoadingCreateSlot] = useState(false);
  const [createSlot] = useCreateSlotMutation();

  const handleCreateSlot = (event) => {
    event.preventDefault();
    if (!selectedInterviewMode) {
      setInterviewModeWarning("Please select interview mode");
    } else if (!userLimitWarning && !startTimeError && !endTimeError) {
      setLoadingCreateSlot(true);
      createSlot({
        collegeId,
        payload: createSlotPayload,
      })
        .unwrap()
        .then((data) => {
          try {
            if (data?.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data?.message) {
              pushNotification("success", data?.message);
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
        .finally(() => setLoadingCreateSlot(false));
    }
  };

  return (
    <Drawer open={openCreateSlotDrawer} onClose={handleCloseDrawer} size="md">
      <Box sx={{ px: { md: 4, xs: 2 }, py: 2 }} className="create-slot-drawer">
        {loadingCreateSlot && (
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
          <Typography variant="h6">Create Slot</Typography>
          <Typography variant="h5">
            {dateInStringFormat(currentDate)}
          </Typography>
        </Box>

        {internalServerError || somethingWentWrong ? (
          <>
            {internalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <form onSubmit={(event) => handleCreateSlot(event)}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Box className="create-slot-flex-box">
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

                <Box sx={{ my: "20px" }}>
                  <Box className="create-slot-flex-box">
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
                  </Box>
                  {interviewModeWarning && (
                    <FormHelperText
                      sx={{ color: "#ffa117" }}
                      variant="subtitle1"
                    >
                      {interviewModeWarning}
                    </FormHelperText>
                  )}
                </Box>
                <Box>
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
                    style={{ width: 330 }}
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
                {selectedInterviewMode === "Offline" && (
                  <Box>
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
                      sx={{ width: 330, marginTop: "25px" }}
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
              </Grid>
              <Grid item md={6}>
                {selectedSlotType === "gd" && (
                  <Box sx={{ marginBottom: "22px" }}>
                    <TextField
                      color="info"
                      required
                      size="small"
                      type="number"
                      id="outlined-basic"
                      label="User Limit"
                      variant="outlined"
                      sx={{
                        width: 330,
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
                <Box sx={{ marginBottom: "22px" }}>
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
                      setSelectedPanel(null);
                    }}
                    sx={{ width: 330 }}
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
                    disabled={
                      selectedList && startTime && endTime && selectedSlotType
                        ? false
                        : true
                    }
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option?.label}
                    options={listOfPanels}
                    value={selectedPanel || null}
                    onChange={(_, newValue) => {
                      setSelectedPanel(newValue);
                    }}
                    sx={{ width: 330, marginBottom: "22px" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Panel Name" color="info" />
                    )}
                  />
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
                      sx={{ width: 330 }}
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

                <FormControl
                  size="small"
                  required
                  sx={{ width: 330 }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Time
                  </InputLabel>
                  <OutlinedInput
                    required
                    size="small"
                    id="outlined-adornment-password"
                    type="text"
                    value={`${
                      startTime && endTime
                        ? `${customFormat?.start_time?.time} - ${customFormat?.end_time?.time}`
                        : ""
                    }`}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="select time" edge="end">
                          <AccessTimeIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Time"
                    onClick={() => {
                      if (!startTimeError && !endTimeError) {
                        setPanelDurationBoxClicked((prev) => !prev);
                      }
                    }}
                  />
                </FormControl>

                {panelDurationBoxClicked && (
                  <Box
                    className="panel-duration-time-selection-box"
                    sx={{
                      top: "278px !important",
                      minWidth: "330px !important",
                    }}
                  >
                    <Box className="panel-duration-time-selection-inner-box">
                      <Box>
                        <Typography variant="subtitle1">Start Time:</Typography>
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
                              setSelectedPanelist([]);
                              setSelectedPanel(null);
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
                              setSelectedPanelist([]);
                              setSelectedPanel(null);
                            }}
                            slotProps={{ textField: { size: "small" } }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Box>

                    <Box className="time-picker-error-box" sx={{ px: 2 }}>
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
                        disabled={startTimeError || endTimeError ? true : false}
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
              </Grid>
            </Grid>

            <Box className="create-slot-drawer-button-box">
              <button type="submit" className="create-slot-drawer-button">
                Create Slot
              </button>
            </Box>
          </form>
        )}
        <DateWisePanelAndSlotCount
          dateWiseSlotPanelCount={dateWiseSlotPanelCount}
          isSlotPanelStatusFetching={isSlotPanelStatusFetching}
        />
      </Box>
    </Drawer>
  );
}
