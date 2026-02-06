import { Box, Button, Dialog, FormHelperText, Typography } from "@mui/material";
import React, { useState } from "react";
import { Handle, Position, useNodeId, useReactFlow } from "reactflow";
import {
  DateRangePicker,
  Input,
  InputGroup,
  Popover,
  Radio,
  RadioGroup,
  SelectPicker,
  Whisper,
} from "rsuite";
import TimeRoundIcon from "@rsuite/icons/TimeRound";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsImage from "../../../images/settings.svg";
import CloseSVG from "../../../icons/close.svg";
import ResetIcon from "../../../icons/reset-icon.svg";
import BorderLineText from "./AutomationHelperComponent/BorderLineText";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import GetJsonDate, {
  calculatePanelAndSlotMaxStartTime,
  calculatePanelAndSlotMinEndTime,
  convertToCustomFormat,
  convertToSingleCustomFormat,
} from "../../../hooks/GetJsonDate";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterHeaderIcon from "../application-manager/FilterHeaderIcon";
import CheckBoxGroupWeeks from "./AutomationHelperComponent/CheckBoxGroup";
import AutomationCreationTimer from "./AutomationCreationTimer";
import useRemoveNodesAutomation from "../../../hooks/automations/useRemoveNodesAutomation";
const { allowedRange } = DateRangePicker;

const AutomationDelayNode = ({ id: sourceId }) => {
  const { removeTreeOfOutGoersOfNurturing } = useRemoveNodesAutomation();
  const nodeId = useNodeId();
  const { setNodes, getNode } = useReactFlow();
  const nodesDetails = getNode(nodeId);
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );
  const [triggerBy, setTriggerBy] = useState(
    nodesDetails?.delay_data?.trigger_by
      ? nodesDetails?.delay_data?.trigger_by
      : "Hour"
  );
  const [triggerByRecurrent, setTriggerByRecurrent] = useState(
    nodesDetails?.delay_data?.trigger_by
      ? nodesDetails?.delay_data?.trigger_by
      : "Hour"
  );
  const [showSelectTriggerByError, setShowSelectTriggerByError] =
    useState(false);
  const [interval, setInterval] = useState(
    nodesDetails?.delay_data?.interval_value
      ? nodesDetails?.delay_data?.interval_value
      : 0
  );
  const [isRecurrentNode, setIsRecurrentNode] = useState(false);
  const [recurrentDialogue, setRecurrentDialogue] = useState(false);
  const [showSelectReleaseWindowError, setShowSelectReleaseWindowError] =
    useState(false);
  const [showSelectDateError, setShowSelectDateError] = useState(false);
  const [showSelectDaysError, setShowSelectDaysError] = useState(false);

  const defaultMinTime = dayjs(
    nestedAutomationPayload?.automation_details?.releaseWindow?.start_time
  );

  const defaultMaxTime = dayjs(
    nestedAutomationPayload?.automation_details?.releaseWindow?.end_time
  );

  const [startAndEndDate, setStartAndEndDate] = useState(
    nodesDetails?.delay_data?.date?.start_date
      ? [
          new Date(nodesDetails?.delay_data?.date?.start_date),
          new Date(nodesDetails?.delay_data?.date?.end_date),
        ]
      : [
          new Date(
            nestedAutomationPayload?.automation_details?.date?.start_date
          ),
          new Date(nestedAutomationPayload?.automation_details?.date?.end_date),
        ]
  );

  const [startTime, setStartTime] = useState(
    nodesDetails?.delay_data?.releaseWindow?.start_time
      ? nodesDetails?.delay_data?.releaseWindow?.start_time
      : ""
  );
  const [endTime, setEndTime] = useState(
    nodesDetails?.delay_data?.releaseWindow?.end_time
      ? nodesDetails?.delay_data?.releaseWindow?.end_time
      : ""
  );

  const [maxStartTime, setMaxStartTime] = useState(null);
  const [minEndTime, setMinEndTime] = useState(null);

  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const dateArray = [dayjs(startTime), dayjs(endTime)];
  const customFormat = convertToCustomFormat(dateArray);

  const [panelDurationBoxClicked, setPanelDurationBoxClicked] = useState(false);
  const [weekDays, setWeekdays] = useState(
    nodesDetails?.delay_data?.days
      ? nodesDetails?.delay_data?.days
      : nestedAutomationPayload?.automation_details?.days
  );

  const handleWeekDays = (value) => {
    setWeekdays(value);
    setShowSelectDaysError(false);
  };

  const updateInterval = (value) => {
    if (value < 0 && interval === 0) {
      return;
    }
    setInterval((preState) => preState + value);

    setNodes((nds) =>
      nds.map((node) => {
        if (node?.id === nodeId) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.delay_data = {
            trigger_by: triggerBy,
            interval_value: interval,
            delay_type: "nurturing",
          };
        }

        return node;
      })
    );
  };
  return (
    <Box className="automation-delay-node">
      <Handle type="target" position={Position.Top}></Handle>
      <Box>
        <Whisper
          placement="left"
          trigger="click"
          speaker={
            <Popover
              style={{ display: isRecurrentNode ? "none" : "block" }}
              className="delay-popover"
              arrow={false}
            >
              <Box>
                <RadioGroup
                  inline
                  name="radio-name"
                  value={triggerBy}
                  onChange={(value) => {
                    setTriggerBy(value);
                    setNodes((nds) =>
                      nds.map((node) => {
                        if (node?.id === nodeId) {
                          // it's important that you create a new object here
                          // in order to notify react flow about the change
                          node.delay_data = {
                            trigger_by: value,
                            interval_value: interval,
                            delay_type: "nurturing",
                          };
                        }

                        return node;
                      })
                    );
                  }}
                >
                  <Radio value="hour">Hour</Radio>
                  <Radio value="day">Day</Radio>
                </RadioGroup>

                <Box className="automation-delay-interval-manage">
                  <Box>
                    {" "}
                    <span
                      style={{ fontWeight: "bold" }}
                    >{`${interval} `}</span>{" "}
                    {`${triggerBy}`}{" "}
                  </Box>
                  <Box>
                    <Box>
                      <ArrowDropUpIcon
                        onClick={() => updateInterval(+1)}
                        style={{
                          color: "#008BE2",
                          marginBottom: "-18px",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box>
                      <ArrowDropDownIcon
                        onClick={() =>
                          interval === 1
                            ? updateInterval(0)
                            : updateInterval(-1)
                        }
                        style={{ color: "#008BE2", cursor: "pointer" }}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box
                  onClick={() => {
                    setIsRecurrentNode(true);
                    setRecurrentDialogue(true);
                  }}
                  className="automation-settings-image"
                >
                  <img
                    src={SettingsImage}
                    alt="settingsImage"
                    style={{ width: "100%" }}
                  />
                </Box>
              </Box>
            </Popover>
          }
        >
          <Box style={{ cursor: "pointer" }}>
            {isRecurrentNode ? (
              <Box
                onClick={() => setRecurrentDialogue(true)}
                className="delay-node-showcasing"
              >
                Recurring
              </Box>
            ) : (
              <Box className="delay-node-showcasing">{`${interval} ${triggerBy}`}</Box>
            )}
          </Box>
        </Whisper>
        <Dialog
          maxWidth={"sm"}
          open={recurrentDialogue}
          onClose={(event, reason) => {
            if (reason === "backdropClick") {
              return;
            } else {
              setRecurrentDialogue(false);
            }
          }}
          // disableBackdropClick={true}
        >
          <Box sx={{ width: "530px", padding: "30px 30px 10px 30px" }}>
            <Box className="automation-main-recurrent-dialog-header ">
              <Box className="automation-main-dialog-title ">
                {" "}
                Recurrent Release Configuration
              </Box>
              <Box
                onClick={() => {
                  // setIsRecurrentNode(true);
                  setRecurrentDialogue(false);
                }}
                className="automation-drawer-close-icon"
              >
                <img
                  src={CloseSVG}
                  alt="settingsImage"
                  style={{ width: "100%" }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                columnGap: 1,
                rowGap: 2.5,
              }}
            >
              <Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <SelectPicker
                    className="create-automation-picker"
                    placeholder="Trigger by*"
                    // defaultValue="Lead"
                    data={[
                      {
                        label: "Day",
                        value: "day",
                      },
                      {
                        label: "Hour",
                        value: "hour",
                      },
                      {
                        label: "Week",
                        value: "week",
                      },
                      {
                        label: "Month",
                        value: "month",
                      },
                    ]}
                    value={triggerByRecurrent}
                    onChange={(value) => {
                      setTriggerByRecurrent(value);
                      setShowSelectTriggerByError(false);
                    }}
                  />

                  {triggerByRecurrent && (
                    <BorderLineText
                      text={"Trigger by*"}
                      width={50}
                    ></BorderLineText>
                  )}
                </Box>{" "}
                {showSelectTriggerByError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "36px",
                }}
              >
                <Box className="automation-delay-recurrent-interval-manage">
                  <Box>
                    {" "}
                    <span
                      style={{
                        fontWeight: "bold",
                        marginLeft: "8px",
                        color: "#3185e4",
                      }}
                    >{`${interval} `}</span>{" "}
                  </Box>
                  <Box>
                    <Box>
                      <ArrowDropUpIcon
                        onClick={() => updateInterval(+1)}
                        style={{
                          color: "#008BE2",
                          marginBottom: "-18px",
                          cursor: "pointer",
                        }}
                      />
                    </Box>
                    <Box>
                      <ArrowDropDownIcon
                        onClick={() => updateInterval(-1)}
                        style={{ color: "#008BE2", cursor: "pointer" }}
                      />
                    </Box>
                  </Box>
                </Box>

                <BorderLineText text={"Interval*"} width={40}></BorderLineText>
              </Box>
              <Box>
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
                        if (!startTimeError && !endTimeError) {
                          setPanelDurationBoxClicked((prev) => !prev);
                        }
                      }}
                    >
                      <Input
                        className="create-automation-input"
                        placeholder="Release window*"
                        style={{ pointerEvents: "none" }}
                        value={`${
                          startTime && endTime
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
                          position: "relatives",

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
                                value={startTime ? dayjs(startTime) : null}
                                minTime={defaultMinTime}
                                maxTime={maxStartTime}
                                onChange={(value) => {
                                  // setStartTime(value);

                                  const convertDate =
                                    convertToSingleCustomFormat(value);

                                  setStartTime(
                                    `${convertDate.date} ${convertDate.time}`
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
                                value={endTime ? dayjs(endTime) : null}
                                minTime={minEndTime}
                                maxTime={defaultMaxTime}
                                onChange={(value) => {
                                  // setEndTime(value);
                                  const convertDate =
                                    convertToSingleCustomFormat(value);

                                  setEndTime(
                                    `${convertDate.date} ${convertDate.time}`
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
                              setStartTime("");

                              setEndTime("");
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
              </Box>
              <Box>
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "36px",
                  }}
                >
                  <DateRangePicker
                    appearance="subtle"
                    placeholder="Start Date & End Date*"
                    value={startAndEndDate}
                    onChange={(value) => {
                      setStartAndEndDate(value);
                      setShowSelectDateError(false);
                    }}
                    placement="bottomEnd"
                    style={{}}
                    className="date-range-btn-automation"
                    shouldDisableDate={allowedRange(
                      new Date(),
                      new Date(
                        nestedAutomationPayload?.automation_details?.date?.end_date
                      )
                    )}
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
              </Box>
              <Box>
                <Box>
                  <CheckBoxGroupWeeks
                    handleSetData={handleWeekDays}
                    readOnlyBoxes={false}
                    daysRange={weekDays}
                    validation={true}
                    allowedDays={
                      nestedAutomationPayload?.automation_details?.days
                    }
                  ></CheckBoxGroupWeeks>
                </Box>
                {showSelectDaysError && (
                  <FormHelperText sx={{ color: "#fea21b", fontSize: "10px" }}>
                    *Required
                  </FormHelperText>
                )}
              </Box>
              {startTime && endTime && (
                <Box style={{ width: "100%" }}>
                  <AutomationCreationTimer
                    time={{
                      start_time: `${customFormat?.start_time?.date} ${customFormat?.start_time?.time}`,
                      end_time: `${customFormat?.end_time?.date} ${customFormat?.end_time?.time}`,
                    }}
                  />
                </Box>
              )}

              <Box
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  width: "100%",
                }}
              >
                {" "}
                You cannot add actions after Configuring this action as a
                Recurring.
              </Box>
              <Box
                style={{ width: "100%", marginBottom: "20px" }}
                className="automation-window-buttons"
              >
                <Box
                  onClick={() => {
                    setRecurrentDialogue(false);
                    setIsRecurrentNode(false);
                    setNodes((nds) =>
                      nds.map((node) => {
                        if (node?.id === nodeId) {
                          // it's important that you create a new object here
                          // in order to notify react flow about the change
                          node.delay_data = {
                            trigger_by: triggerBy,
                            interval_value: interval,
                            delay_type: "nurturing",
                          };
                        }

                        return node;
                      })
                    );
                  }}
                  className="automation-back-button"
                >
                  Back
                </Box>
                <Box
                  onClick={async () => {
                    startAndEndDate.length > 0 || setShowSelectDateError(true);
                    weekDays.length > 0 || setShowSelectDaysError(true);
                    !startTime &&
                      !endTime &&
                      setShowSelectReleaseWindowError(true);

                    triggerByRecurrent || setShowSelectTriggerByError(true);

                    if (
                      startAndEndDate.length > 0 &&
                      weekDays.length > 0 &&
                      startTime &&
                      endTime &&
                      triggerByRecurrent
                    ) {
                      // checkAutomationName();
                      const dates = JSON.parse(GetJsonDate(startAndEndDate));
                      await setNodes((nds) =>
                        nds.map((node) => {
                          if (node?.id === nodeId) {
                            // it's important that you create a new object here
                            // in order to notify react flow about the change
                            node.delay_data = {
                              trigger_by: triggerByRecurrent,
                              interval_value: interval,
                              delay_type: "recurring",
                              releaseWindow: {
                                start_time: `${customFormat?.start_time?.date} ${customFormat?.start_time?.time}`,
                                end_time: `${customFormat?.end_time?.date} ${customFormat?.end_time?.time}`,
                              },
                              date: {
                                start_date: dates.start_date,
                                end_date: dates.end_date,
                              },
                              days: weekDays,
                            };
                          }

                          return node;
                        })
                      );

                      await removeTreeOfOutGoersOfNurturing(sourceId);
                      setIsRecurrentNode(true);

                      setRecurrentDialogue(false);
                    }
                  }}
                  className="automation-Continue-button"
                >
                  Continue
                </Box>
              </Box>
            </Box>
          </Box>
        </Dialog>
      </Box>
      <Handle type="source" position={Position.Bottom}></Handle>
    </Box>
  );
};

export default AutomationDelayNode;
