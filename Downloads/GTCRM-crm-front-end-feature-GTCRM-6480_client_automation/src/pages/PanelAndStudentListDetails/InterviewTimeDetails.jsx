import { Box, Grid, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import "../../styles/InterviewTImeDetails.css";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useEffect } from "react";
import { Resizable } from "re-resizable";
import {
  addMinutesToDateTime,
  convertDateTimeFormat,
  formatDateTime,
  generateHourList,
} from "../../helperFunctions/generateHoursList";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import PanelTypeAndModerator from "./PanelTypeAndModerator";

const InterviewTimeDetails = ({
  gapBetweenSlots,
  setSlotCountAndAvailableTime,
  panelOrSlotDetails,
  handleCreateNewSlot,
  slotCountAndAvailableTime,
  setScheduleData,
  scheduleData,
  handleSaveUpdatedSlots,
  preview,
}) => {
  const [timerList, setTimerList] = useState([]);

  const calculateSlotWidth = (duration) => {
    return (duration / panelOrSlotDetails?.panel_duration) * 100;
  };

  const createGapSlot = (duration, index) => (
    <div
      key={index}
      className="gap"
      style={{ flex: `0 0 ${calculateSlotWidth(duration)}%` }}
    >
      {`${duration} min`}
    </div>
  );

  // Calculate the remaining time (considering both interview and gap times)
  const remainingTime = useMemo(() => {
    const totalRemainingTime =
      panelOrSlotDetails?.panel_duration -
      scheduleData?.reduce((total, item) => {
        if (item.type === "blank") {
          return total + 0;
        } else {
          return total + item.duration;
        }
      }, 0);
    return totalRemainingTime;
  }, [panelOrSlotDetails, scheduleData]);

  useEffect(() => {
    const data = [];
    panelOrSlotDetails?.slots?.forEach((slot, index) => {
      data?.push({
        type: "interview",
        duration: slot?.slot_duration,
        id: slot?._id,
      });
      if (index !== panelOrSlotDetails?.slots?.length - 1) {
        data?.push({
          type: "gap",
          duration: gapBetweenSlots?.value ? gapBetweenSlots?.value : 30,
        });
      }
    });
    const theStartDate = new Date(panelOrSlotDetails?.time);
    if (theStartDate?.getMinutes() > 0) {
      data.unshift({
        type: "blank",
        duration: theStartDate?.getMinutes(),
      });
    }
    setScheduleData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gapBetweenSlots, panelOrSlotDetails]);

  // Function to handle adding a new interview slot with a dynamic duration
  const handleAddInterview = () => {
    const interviewDuration = Math.min(60, remainingTime);
    const addSlotStarting = {
      time: panelOrSlotDetails?.time,
      minute:
        slotCountAndAvailableTime?.gapMin +
        slotCountAndAvailableTime?.slotMin +
        gapBetweenSlots?.value,
    };
    const newStartingDateTime = addMinutesToDateTime(
      addSlotStarting?.time,
      addSlotStarting?.minute
    );
    const formattedStartingDateTime = formatDateTime(newStartingDateTime);

    const newEndingDateTime = addMinutesToDateTime(
      convertDateTimeFormat(formattedStartingDateTime),
      interviewDuration - gapBetweenSlots?.value
    );
    const formattedEndingDateTime = formatDateTime(newEndingDateTime);
    handleCreateNewSlot(formattedStartingDateTime, formattedEndingDateTime);
  };

  const handleSlotResize = (index, newWidth) => {
    const newWidthPercentage = parseFloat(newWidth);
    const newWidthClamped = Math.min(100, newWidthPercentage);
    const newDuration =
      (newWidthClamped / 100) * panelOrSlotDetails?.panel_duration;

    // Limit the duration to a maximum of 60 minutes and a minimum of 10 minutes
    const clampedDuration = Math.round(
      Math.min(newDuration + remainingTime, Math.max(10, newDuration))
    );

    const newScheduleData = scheduleData?.map((item, i) => {
      if (i === index) {
        return { ...item, duration: clampedDuration };
      }

      return item;
    });
    setScheduleData(newScheduleData);
  };

  const createInterviewSlot = (duration, index) => (
    <Resizable
      key={index}
      className="interview"
      style={{ flex: `0 0 ${calculateSlotWidth(duration)}%` }}
      size={{ width: `${calculateSlotWidth(duration)}%`, height: "100%" }}
      minWidth={`${calculateSlotWidth(10)}%`}
      maxWidth={`${calculateSlotWidth(duration + Math.max(0, duration))}%`}
      enable={{
        right: preview ? false : true, // Allow resizing from the right edge
      }}
      onResize={(e, direction, ref) => {
        handleSlotResize(index, ref.style.width);
      }}
    >
      {`${duration} min`}
    </Resizable>
  );

  useEffect(() => {
    const theEndDate = new Date(panelOrSlotDetails?.end_time);
    const theStartDate = new Date(panelOrSlotDetails?.time);
    if (theEndDate?.getMinutes() > 0 || theStartDate?.getMinutes() > 0) {
      theEndDate.setHours(theEndDate.getHours() + 1);
    }
    const listOfHours = generateHourList(
      60,
      panelOrSlotDetails?.time,
      theEndDate
    );

    setTimerList(listOfHours);
  }, [panelOrSlotDetails]);

  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prevPosition) => Math.max(prevPosition - 110, 0));
  };

  const scrollRight = () => {
    const container = document.getElementById("schedule");
    const lastItemPosition =
      container.scrollWidth + scrollPosition - container.clientWidth;
    setScrollPosition((prevPosition) =>
      Math.min(prevPosition + 110, lastItemPosition)
    );
  };

  const bookedSlotDetails = useMemo(() => {
    const data = {
      gapCount: 0,
      slotCount: 0,
      gapMin: 0,
      slotMin: 0,
      remainingTime: remainingTime,
      userLimit: panelOrSlotDetails?.user_limit,
    };
    scheduleData?.forEach((slot) => {
      if (slot.type !== "blank") {
        if (slot.type === "interview") {
          data.slotCount += 1;
          data.slotMin += slot.duration;
        } else {
          data.gapCount += 1;
          data.gapMin += slot.duration;
        }
      }
    });

    setSlotCountAndAvailableTime(data);
    return data;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleData]);

  return (
    <Box className="interview-time-details-container" sx={{ mt: 2 }}>
      <Grid container spacing={3} sx={{ alignItems: "center" }}>
        <Grid item md={1} sm={2} xs={12}>
          <Box className="interview-summarized-time">
            <CustomTooltip
              title="Total Panel Duration"
              description={`The ${panelOrSlotDetails?.panel_duration} min represents the total duration of the panel in minutes.`}
              component={<Box>{panelOrSlotDetails?.panel_duration} min</Box>}
            />
            <CustomTooltip
              title="Total Gap Duration"
              description={`The ${bookedSlotDetails.gapMin} min represents the total gap duration of the panel in minutes and on the top right ${bookedSlotDetails.gapCount} represents the count of gaps.`}
              component={
                <Box>
                  {bookedSlotDetails.gapMin} min{" "}
                  <span className="interview-time-badge">
                    {bookedSlotDetails.gapCount}
                  </span>
                </Box>
              }
            />

            <CustomTooltip
              title="Total Slot Duration"
              description={`The ${bookedSlotDetails.slotMin} min represents the total slot duration of the panel in minutes and on the top right ${bookedSlotDetails.slotCount} represents the count of slots.`}
              component={
                <Box>
                  {bookedSlotDetails.slotMin} min{" "}
                  <span className="interview-time-badge">
                    {bookedSlotDetails.slotCount}
                  </span>
                </Box>
              }
            />

            <CustomTooltip
              title="Total Remaining Minutes"
              description={`The ${bookedSlotDetails.remainingTime} min represents the total remaining time of the panel in minutes.`}
              component={<Box>{bookedSlotDetails.remainingTime} min</Box>}
            />
          </Box>
        </Grid>
        <Grid item md={11} sm={10} xs={12}>
          <Box className="schedule-container" sx={{ position: "relative" }}>
            <div id="schedule" className="schedule">
              <div
                style={{
                  transform: `translateX(-${scrollPosition}px)`,
                }}
                className="schedule-container"
              >
                <div
                  style={{ minWidth: `${timerList?.length * 150}px` }}
                  className="time-slots"
                >
                  {timerList?.map((time, index) => (
                    <div
                      style={{
                        flex: `0 0 ${calculateSlotWidth(60)}%`,
                      }}
                      className={`time-slot ${"time-slot-" + index}`}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {" "}
                          {time.hour}
                        </Typography>{" "}
                        <Typography variant="caption">{time.type}</Typography>
                      </Box>
                    </div>
                  ))}
                </div>
                <div
                  style={{ minWidth: `${timerList?.length * 150}px` }}
                  className="interviews-container"
                >
                  {scheduleData?.map((item, index) =>
                    item.type === "interview" ? (
                      createInterviewSlot(item.duration, index)
                    ) : item.type === "gap" ? (
                      createGapSlot(item.duration, index)
                    ) : (
                      <div
                        style={{
                          flex: `0 0 ${calculateSlotWidth(item.duration)}%`,
                        }}
                      ></div>
                    )
                  )}
                  {!preview &&
                    remainingTime >=
                      panelOrSlotDetails?.gap_between_slots + 10 && (
                      <div className="plus-button-container">
                        <button
                          className="plus-button"
                          onClick={() =>
                            handleSaveUpdatedSlots(handleAddInterview)
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>

            <ArrowRightIcon
              className="arrow-button right"
              onClick={scrollRight}
            />
            <ArrowLeftIcon className="arrow-button left" onClick={scrollLeft} />
          </Box>
          {!preview && (
            <Box
              className="panel-type-and-moderator-container"
              sx={{ mt: 1.5 }}
            >
              <PanelTypeAndModerator
                property="Type"
                value={panelOrSlotDetails.panel_type}
              />
              <PanelTypeAndModerator
                property="Moderator"
                value={panelOrSlotDetails.moderator_name || "N/A"}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterviewTimeDetails;
