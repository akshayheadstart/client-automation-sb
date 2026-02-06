import React, { useEffect, useState } from "react";
import BorderLineText from "../AutomationHelperComponent/BorderLineText";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormHelperText,
  Grid,
  Typography,
} from "@mui/material";
import CloseSVG from "../../../../icons/close.svg";

import ResetIcon from "../../../../icons/reset-icon.svg";
import {
  DateRangePicker,
  Input,
  InputGroup,
  Radio,
  RadioGroup,
  SelectPicker,
} from "rsuite";
import CheckBoxGroupWeeks from "../AutomationHelperComponent/CheckBoxGroup";
import AutomationCreationTimer from "../AutomationCreationTimer";

import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  calculatePanelAndSlotMaxStartTime,
  calculatePanelAndSlotMinEndTime,
  convertToCustomFormat,
  convertToSingleCustomFormat,
} from "../../../../hooks/GetJsonDate";
import FilterHeaderIcon from "../../application-manager/FilterHeaderIcon";
import { useDispatch } from "react-redux";
import {
  setAutomationDataType,
  setAutomationDateType,
  setAutomationDaysSetup,
  setAutomationEndTime,
  setAutomationNameValue,
  setAutomationStartTime,
  setNestedAutomationInitialPayload,
} from "../../../../Redux/Slices/authSlice";
import { useSelector } from "react-redux";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../../../hooks/ApiCallHeaderAndBody";
import LeefLottieAnimationLoader from "../../../shared/Loader/LeefLottieAnimationLoader";
import useToasterHook from "../../../../hooks/useToasterHook";
import { customFetch } from "../../../../pages/StudentTotalQueries/helperFunction";

const AutomationCReateWindowDialog = ({
  open,
  handleManageCreateAutomationDialogue,
  readOnlyBoxes,
  selectedOptionInWIndowTwo,
  setSelectedOptionInWIndowTwo,
  setOpenCreateAutomationDrawer,
  setOpenSelectDataSegmentDrawer,
  setOpenCreateDataSegmentDrawer,
  from,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [showSelectNameError, setShowSelectNameError] = useState(false);
  const [showSelectDataTypeError, setShowSelectDataTypeError] = useState(false);
  const [showSelectDateError, setShowSelectDateError] = useState(false);
  const [showSelectDaysError, setShowSelectDaysError] = useState(false);
  const [showSelectReleaseWindowError, setShowSelectReleaseWindowError] =
    useState(false);

  const [firstContinueClicked, setFirstContinueClicked] = useState(false);

  // const [defaultMinTime, setDefaultEndTime] = useState(
  //   dayjs("03/12/2024 03:25 PM")
  // );
  // const [defaultMaxTime, setDefaultMaxTime] = useState(
  //   dayjs("03/12/2024 04:25 PM")
  // );

  const [maxStartTime, setMaxStartTime] = useState(null);
  const [minEndTime, setMinEndTime] = useState(null);

  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const dateArray = [
    dayjs(
      nestedAutomationPayload?.automation_details?.releaseWindow?.start_time
    ),
    dayjs(nestedAutomationPayload?.automation_details?.releaseWindow?.end_time),
  ];
  const customFormat = convertToCustomFormat(dateArray);

  const [panelDurationBoxClicked, setPanelDurationBoxClicked] = useState(false);

  const handleWeekDays = (value) => {
    dispatch(setAutomationDaysSetup(value));
    setShowSelectDaysError(false);
  };

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [isLoading, setIsLoading] = useState(false);
  const [nameErrorText, setNameErrorText] = useState("Required");

  const checkAutomationName = () => {
    setIsLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/campaign/check_rule_name_exist_or_not/?rule_name=${
        nestedAutomationPayload?.automation_details?.automation_name
      }${collegeId ? "&college_id=" + collegeId : ""}`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((result) => {
        if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.message) {
          try {
            if (typeof result?.message === "string") {
              setFirstContinueClicked(true);
              setNameErrorText("Required");
            } else {
              throw new Error(
                "check_campaign_name_exists_or_not API response has changed"
              );
            }
          } catch (error) {
            pushNotification(
              "warning",
              "something went wrong with automation name"
            );
          }
        } else if (result?.detail) {
          setNameErrorText("Name already exists");
          setShowSelectNameError(true);
        }
      })
      .catch(() => {
        pushNotification(
          "warning",
          "something went wrong with automation name"
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    dispatch(setNestedAutomationInitialPayload({}));
  }, [dispatch]);

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        } else {
          handleManageCreateAutomationDialogue(false);
        }
      }}
      // disableBackdropClick={true}
      // sx={{ zIndex: 0 }}
    >
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
          <LeefLottieAnimationLoader
            height={50}
            width={50}
          ></LeefLottieAnimationLoader>
        </Box>
      )}
      <Box className="automation-main-dialog-header ">
        <Box className="automation-main-dialog-title ">Create Automation</Box>
        <Box
          onClick={() => handleManageCreateAutomationDialogue(false)}
          className="automation-drawer-close-icon"
        >
          <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
        </Box>
      </Box>
      <DialogContent>
        <Box className="create-automation-window-fields">
          {firstContinueClicked || (
            <Grid
              rowGap={2.5}
              width={480}
              container
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              <Grid item xs={12} sm={12} md={6}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <Input
                    readOnly={readOnlyBoxes}
                    className="create-automation-input"
                    placeholder="Name*"
                    // defaultValue="Lead"
                    value={
                      nestedAutomationPayload?.automation_details
                        ?.automation_name
                    }
                    onChange={(value) => {
                      dispatch(setAutomationNameValue(value));
                      setShowSelectNameError(false);
                    }}
                  />
                  {nestedAutomationPayload?.automation_details
                    ?.automation_name && (
                    <BorderLineText text={"Name*"} width={32}></BorderLineText>
                  )}
                </Box>{" "}
                {showSelectNameError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *{nameErrorText}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <SelectPicker
                    readOnly={readOnlyBoxes}
                    className="create-automation-picker"
                    placeholder="Select Data Type*"
                    // defaultValue="Lead"
                    data={[
                      {
                        label: "Lead",
                        value: "Lead",
                      },
                      {
                        label: "Application",
                        value: "Application",
                      },
                      {
                        label: "Raw Data",
                        value: "Raw Data",
                      },
                    ]}
                    value={
                      nestedAutomationPayload?.automation_details?.data_type
                    }
                    onChange={(value) => {
                      dispatch(setAutomationDataType(value));
                      setShowSelectDataTypeError(false);
                    }}
                  />

                  {nestedAutomationPayload?.automation_details?.data_type && (
                    <BorderLineText
                      text={"Select Data Type*"}
                      width={80}
                    ></BorderLineText>
                  )}
                </Box>{" "}
                {showSelectDataTypeError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={6}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <Box>
                    <InputGroup
                      className="create-automation-input"
                      inside
                      style={{ width: "230px" }}
                      onClick={() => {
                        if (
                          !startTimeError &&
                          !endTimeError &&
                          !readOnlyBoxes
                        ) {
                          setPanelDurationBoxClicked((prev) => !prev);
                        }
                      }}
                    >
                      <Input
                        readOnly={readOnlyBoxes}
                        className="create-automation-input"
                        placeholder="Release window*"
                        style={{ pointerEvents: "none" }}
                        value={`${
                          nestedAutomationPayload?.automation_details
                            ?.releaseWindow?.start_time &&
                          nestedAutomationPayload?.automation_details
                            ?.releaseWindow?.end_time
                            ? `${customFormat?.start_time?.time} to ${customFormat?.end_time?.time}`
                            : ""
                        }`}
                      />
                      <InputGroup.Addon>
                        <TimeRoundIcon className="communication-release-window-icon" />
                      </InputGroup.Addon>
                    </InputGroup>

                    {panelDurationBoxClicked && (
                      <Box
                        className="panel-duration-time-selection-box"
                        sx={{
                          top: "170px !important",
                          minWidth: "330px !important",
                          zIndex: 12,
                          paddingTop: "6px !important",
                          paddingBottom: "6px !important",
                        }}
                      >
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
                                    setStartTimeError(
                                      "Start time is not valid"
                                    );
                                  } else {
                                    setStartTimeError("");
                                  }
                                }}
                                sx={{ width: 130 }}
                                value={
                                  nestedAutomationPayload?.automation_details
                                    ?.releaseWindow?.start_time
                                    ? dayjs(
                                        nestedAutomationPayload
                                          ?.automation_details?.releaseWindow
                                          ?.start_time
                                      )
                                    : null
                                }
                                // minTime={defaultMinTime}
                                maxTime={maxStartTime}
                                onChange={(value) => {
                                  // setStartTime(value);

                                  const convertDate =
                                    convertToSingleCustomFormat(value);
                                  dispatch(
                                    setAutomationStartTime(
                                      `${convertDate.date} ${convertDate.time}`
                                    )
                                  );

                                  const remainingMinTime =
                                    calculatePanelAndSlotMinEndTime(value);
                                  setMinEndTime(remainingMinTime);
                                  setShowSelectReleaseWindowError(false);
                                }}
                                slotProps={{ textField: { size: "small" } }}
                              />
                            </LocalizationProvider>
                          </Box>
                          <Box>
                            <Typography variant="subtitle1">
                              End Time:
                            </Typography>
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
                                value={
                                  nestedAutomationPayload?.automation_details
                                    ?.releaseWindow?.end_time
                                    ? dayjs(
                                        nestedAutomationPayload
                                          ?.automation_details?.releaseWindow
                                          ?.end_time
                                      )
                                    : null
                                }
                                minTime={minEndTime}
                                // maxTime={defaultMaxTime}
                                onChange={(value) => {
                                  // setEndTime(value);
                                  const convertDate =
                                    convertToSingleCustomFormat(value);
                                  dispatch(
                                    setAutomationEndTime(
                                      `${convertDate.date} ${convertDate.time}`
                                    )
                                  );
                                  const remainingMaxTime =
                                    calculatePanelAndSlotMaxStartTime(value);
                                  setMaxStartTime(remainingMaxTime);
                                  setShowSelectReleaseWindowError(false);
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
                          <FilterHeaderIcon
                            icon={ResetIcon}
                            action={() => {
                              setPanelDurationBoxClicked(false);
                              setShowSelectReleaseWindowError(false);
                              dispatch(setAutomationStartTime(""));
                              dispatch(setAutomationEndTime(""));
                            }}
                          />

                          <Button
                            disabled={
                              startTimeError || endTimeError ? true : false
                            }
                            size="sm"
                            variant="contained"
                            color="info"
                            onClick={() => setPanelDurationBoxClicked(false)}
                            sx={{ ml: 2 }}
                          >
                            Ok
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  {nestedAutomationPayload?.automation_details?.releaseWindow
                    ?.start_time &&
                    nestedAutomationPayload?.automation_details?.releaseWindow
                      ?.end_time && (
                      <BorderLineText
                        text={"Communication Release window*"}
                        width={150}
                      ></BorderLineText>
                    )}
                </Box>{" "}
                {showSelectReleaseWindowError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <DateRangePicker
                    readOnly={readOnlyBoxes}
                    appearance="subtle"
                    placeholder="Start Date & End Date*"
                    value={
                      nestedAutomationPayload?.automation_details?.date
                        ?.start_date
                        ? [
                            new Date(
                              nestedAutomationPayload?.automation_details?.date?.start_date
                            ),
                            new Date(
                              nestedAutomationPayload?.automation_details?.date?.end_date
                            ),
                          ]
                        : []
                    }
                    onChange={(value) => {
                      dispatch(setAutomationDateType(value));
                      setShowSelectDateError(false);
                    }}
                    placement="bottomEnd"
                    style={{}}
                    className="date-range-btn-automation"
                    //   shouldDisableDate={allowedRange(
                    //     new Date("12-11-2023"),
                    //     new Date("12-20-2023")
                    //   )}
                  />
                  {nestedAutomationPayload?.automation_details?.date?.start_date
                    ?.length > 0 &&
                    nestedAutomationPayload?.automation_details?.date?.end_date
                      ?.length > 0 && (
                      <BorderLineText
                        text={"Start Date & End Date*"}
                        width={105}
                      ></BorderLineText>
                    )}
                </Box>{" "}
                {showSelectDateError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Grid>
              {nestedAutomationPayload?.automation_details?.releaseWindow
                ?.start_time &&
                nestedAutomationPayload?.automation_details?.releaseWindow
                  ?.end_time && (
                  <Grid item xs={12} sm={12} md={12}>
                    <Box>
                      <AutomationCreationTimer
                        time={{
                          start_time: `${customFormat?.start_time?.date} ${customFormat?.start_time?.time}`,
                          end_time: `${customFormat?.end_time?.date} ${customFormat?.end_time?.time}`,
                        }}
                      />
                    </Box>
                  </Grid>
                )}
              <Grid item xs={12} sm={12} md={12}>
                <Box>
                  <Typography id="daysSelection"> Days</Typography>
                  <CheckBoxGroupWeeks
                    handleSetData={handleWeekDays}
                    readOnlyBoxes={readOnlyBoxes}
                    daysRange={
                      nestedAutomationPayload?.automation_details?.days
                    }
                  ></CheckBoxGroupWeeks>
                </Box>
                {showSelectDaysError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Box className="automation-window-buttons">
                  <Box
                    onClick={() => handleManageCreateAutomationDialogue(false)}
                    className="automation-back-button"
                  >
                    Back
                  </Box>
                  <Box
                    onClick={() => {
                      if (from === "select-automation-drawer") {
                        navigate("/create-automation", {
                          state: {
                            template: false,
                            automationPayload: nestedAutomationPayload,
                          },
                        });
                      } else {
                        nestedAutomationPayload?.automation_details
                          ?.automation_name || setShowSelectNameError(true);
                        nestedAutomationPayload?.automation_details
                          ?.data_type || setShowSelectDataTypeError(true);
                        nestedAutomationPayload?.automation_details?.date
                          ?.start_date || setShowSelectDateError(true);
                        nestedAutomationPayload?.automation_details?.days
                          ?.length > 0 || setShowSelectDaysError(true);
                        !nestedAutomationPayload?.automation_details
                          ?.releaseWindow?.start_time &&
                          !nestedAutomationPayload?.automation_details
                            ?.releaseWindow?.end_time &&
                          setShowSelectReleaseWindowError(true);

                        if (
                          nestedAutomationPayload?.automation_details
                            ?.automation_name &&
                          nestedAutomationPayload?.automation_details
                            ?.data_type &&
                          nestedAutomationPayload?.automation_details?.date
                            ?.start_date &&
                          nestedAutomationPayload?.automation_details?.days
                            ?.length > 0 &&
                          nestedAutomationPayload?.automation_details
                            ?.releaseWindow?.start_time &&
                          nestedAutomationPayload?.automation_details
                            ?.releaseWindow?.end_time
                        ) {
                          checkAutomationName();
                        }
                      }
                    }}
                    className="automation-Continue-button"
                  >
                    Continue
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
          {firstContinueClicked && (
            <Box>
              <Box sx={{ display: "flex", gap: "10px", minWidth: "400px" }}>
                <Box className="second-window-automation">
                  <Typography id="second-window-title">Data</Typography>
                  <Box
                    className="data-segment-button"
                    onClick={() => {
                      setOpenSelectDataSegmentDrawer(true);
                      handleManageCreateAutomationDialogue(false);
                    }}
                  >
                    Select Data segment
                  </Box>

                  <Box
                    className="data-segment-button"
                    onClick={() => {
                      setOpenCreateDataSegmentDrawer(true);
                      handleManageCreateAutomationDialogue(false);
                    }}
                  >
                    Create Data segment
                  </Box>
                </Box>
                {nestedAutomationPayload?.automation_details?.data_type !==
                  "Raw Data" && (
                  <Divider
                    sx={{
                      "&::before, &::after": {
                        borderColor: "#008BE2",
                      },
                      fontSize: "12px",
                      color: "black",
                    }}
                    orientation="vertical"
                    variant="middle"
                    flexItem
                  >
                    OR
                  </Divider>
                )}
                {nestedAutomationPayload?.automation_details?.data_type !==
                  "Raw Data" && (
                  <Box className="second-window-automation">
                    <Typography id="second-window-title">Condition</Typography>
                    <RadioGroup
                      name="radio-name-automation"
                      value={selectedOptionInWIndowTwo}
                      onChange={(value) => {
                        setSelectedOptionInWIndowTwo(value);
                      }}
                      style={{ fontSize: "12px" }}
                    >
                      {nestedAutomationPayload?.automation_details
                        ?.data_type === "Lead" && (
                        <Radio value="Origin">Origin</Radio>
                      )}
                      {nestedAutomationPayload?.automation_details
                        ?.data_type === "Lead" && (
                        <Radio value="Change in lead stage">
                          Change in lead stage
                        </Radio>
                      )}
                      {nestedAutomationPayload?.automation_details
                        ?.data_type === "Application" && (
                        <Radio value="Change in application stage">
                          Change in application stage
                        </Radio>
                      )}
                    </RadioGroup>
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 4 }} className="automation-window-buttons">
                <Box
                  onClick={() => {
                    navigate("/create-automation", {
                      state: {
                        template: true,
                        automationPayload: nestedAutomationPayload,
                      },
                    });
                  }}
                  className="automation-create-template-button"
                >
                  Create Template
                </Box>
                <Box
                  onClick={() => {
                    if (selectedOptionInWIndowTwo) {
                      setOpenCreateAutomationDrawer(true);
                      handleManageCreateAutomationDialogue(false);
                    }
                  }}
                  className="automation-Continue-button"
                >
                  Continue
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AutomationCReateWindowDialog;
