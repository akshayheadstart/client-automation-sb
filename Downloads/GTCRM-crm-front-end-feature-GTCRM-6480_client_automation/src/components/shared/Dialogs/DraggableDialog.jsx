import { Box, Card, Typography } from "@mui/material";
import React from "react";
import Draggable from "react-draggable";
import TelephonyIcon from "../../../icons/TelephonyIcon";
import { secondsToMMSS } from "../../../helperFunctions/telephonyHelperFunction";

const DraggableDialog = ({
  setShowTelephonyDialog,
  setActiveCallDetails,
  minimizedCalls,
  setMinimizedCalls,
}) => {
  const handleMaximizeCall = (index) => {
    setActiveCallDetails(minimizedCalls[index]);
    setShowTelephonyDialog(true);
    const previousMinimizedCalls = [...minimizedCalls];
    previousMinimizedCalls.splice(index, 1);
    setMinimizedCalls(previousMinimizedCalls);
  };
  return (
    <Box className="telephony-draggable-container">
      <Box>
        <Box>
          <Box>
            {minimizedCalls.map((call, index) => (
              <Draggable>
                <Card elevation={12} className="telephony-minimized-chip">
                  <Box>
                    <Typography>{call?.student_name}</Typography>
                    <Typography>+91-{call?.student_phone}</Typography>
                  </Box>
                  <Box
                    onTouchEnd={() => handleMaximizeCall(index)}
                    onClick={() => handleMaximizeCall(index)}
                  >
                    <TelephonyIcon />
                    <Typography>{secondsToMMSS(call?.duration)}</Typography>
                  </Box>
                </Card>
              </Draggable>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DraggableDialog;
