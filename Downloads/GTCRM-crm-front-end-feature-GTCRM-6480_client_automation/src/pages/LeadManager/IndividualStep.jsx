import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Divider } from "rsuite";

function IndividualStep({
  isDisable,
  handleClickPopper,
  stepData,
  title,
  last,
  currentLabel,
  handleSetOverlayWidth,
}) {
  useEffect(() => {
    const individualStep = document.getElementById(`individualStep`);
    if (!isDisable) {
      if (individualStep && handleSetOverlayWidth) {
        handleSetOverlayWidth(individualStep.offsetWidth);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLabel]);

  return (
    <Box
      id={`individualStep`}
      sx={{
        color: isDisable ? "#092C4C" : "white",
        flex: 1,
      }}
    >
      <Box className="individual-step-container">
        <Typography
          align="center"
          sx={{
            fontWeight: "600",
            fontSize: "11px",
            ml: currentLabel === 1 ? 1.5 : 0,
          }}
        >
          {title}
          {handleClickPopper && (
            <span
              style={{ cursor: "pointer" }}
              onClick={handleClickPopper}
              className={"user-profile-application-stages-span-notification"}
            >
              {stepData ? stepData : 0}
            </span>
          )}
        </Typography>
        {!last && <Divider style={{ backgroundColor: "#A8C9E5" }} vertical />}
      </Box>
    </Box>
  );
}

export default IndividualStep;
