import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
  generateHourListForAutomation,
  returnTimerOverlayWidth,
} from "../../../helperFunctions/generateHoursList";
import { Box } from "@mui/system";
import "../../../styles/AutomationCreationTimer.css";
import { Divider } from "rsuite";
import { Typography } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const AutomationCreationTimer = ({ time }) => {
  const [timerList, setTimerList] = useState([]);
  const [rightSideGap, setRightSideGap] = useState(0);
  const [leftSideGap, setLeftSideGap] = useState(0);
  const [totalOverlayWidth, setTotalOverlayWidth] = useState(0);

  useEffect(() => {
    const automationTimerElem = document.getElementById("automation-timer");
    if (automationTimerElem) {
      const rightSideDuration = new Date(time.end_time).getMinutes();
      const leftSideDuration = new Date(time.start_time).getMinutes();
      const totalWidth = automationTimerElem.clientWidth;
      // Calculate the percentage
      const rightSidePercentage = (rightSideDuration / 60) * 100;
      const leftSidePercentage = (leftSideDuration / 60) * 100;

      // Calculate the value of seconds in terms of total width
      const leftSideGap = (leftSidePercentage / 100) * totalWidth;
      const rightSideGap = (rightSidePercentage / 100) * totalWidth;
      setLeftSideGap(leftSideGap - (leftSideDuration > 0 ? 4 : 0));
      setRightSideGap(rightSideGap ? totalWidth - rightSideGap : rightSideGap);
      setTotalOverlayWidth(totalWidth);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time, timerList]);

  useEffect(() => {
    const theEndDate = new Date(time?.end_time);
    const theStartDate = new Date(time?.start_time);
    if (theEndDate.getMinutes() > 0) {
      theEndDate.setHours(theEndDate.getHours() + 1);
    } else {
    }
    const listOfHours = generateHourListForAutomation(theStartDate, theEndDate);

    setTimerList(listOfHours);
  }, [time]);

  return (
    <Box sx={{ m: 2 }}>
      <Box className="automation-timer-container">
        {timerList.map((timer, index) => (
          <Box
            sx={{ flex: timerList.length - 1 === index ? 0 : 1 }}
            key={index}
            id={index === 0 ? "automation-timer" : ""}
          >
            <Divider
              style={{ left: "-12px" }}
              className="timer-indicator"
              vertical
            />
            <Box sx={{ position: "relative", zIndex: 10 }}>
              {" "}
              <Typography className="hour">{timer.hour}</Typography>
              <Typography className="type">{timer.type}</Typography>{" "}
            </Box>
            {index !== timerList?.length - 1 && (
              <Box
                sx={{
                  width: returnTimerOverlayWidth({
                    index,
                    timerList,
                    rightSideGap,
                    leftSideGap,
                    totalOverlayWidth,
                  }),
                  borderLeft: index === 0 ? "1px solid #b3d2e2" : "",
                  borderRight:
                    timerList.length - 2 === index ? "1px solid #b3d2e2" : "",
                  borderTopLeftRadius: index === 0 ? "8px" : "",
                  borderBottomLeftRadius: index === 0 ? "8px" : "",
                  borderTopRightRadius:
                    timerList.length - 2 === index ? "8px" : "",
                  borderBottomRightRadius:
                    timerList.length - 2 === index ? "8px" : "",
                  marginLeft: index === 0 ? `${leftSideGap}px` : "",
                  marginRight:
                    timerList.length - 2 === index ? `${rightSideGap}px` : "",
                  right:
                    timerList.length - 2 === index && timerList.length > 2
                      ? `0px`
                      : "",
                }}
                className="timer-overlay"
              >
                <Box>
                  {index === 0 && <ArrowLeftIcon className="arrow-left-icon" />}

                  {<ArrowRightIcon className="arrow-right-icon" />}
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AutomationCreationTimer;
