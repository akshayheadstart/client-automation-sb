import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { Slider } from "rsuite";
import "../../../styles/PanellistDesignPage.css";
import "../../../styles/ZoomPage.css";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";

const StudentMarksSlider = ({
  marksData,
  handleSliderChange,
  setScores,
  scores,
  marking_scheme,
}) => {
  const maxValue = 10;
  const minValue = 0;
  const stepValue = 0.5;
  const handleChange = (index, newValue) => {
    const updatedScores = [...scores];
    updatedScores[index].point = newValue;
    setScores(updatedScores);
  };

  return (
    <>
      {marking_scheme?.map((marks, index) => {
        return (
          <Box sx={{ p: 2, position: "relative" }}>
            <Box>
              <Typography
                sx={{ right: 25, mt: -1.1 }}
                className="zoom-page-weightage-text"
              >
                {marks?.weight}%
              </Typography>
            </Box>
            <Card className="card-maxWidth-container-zoomPage">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography className="zoom-page-slider-data">
                  <Typography sx={{ fontSize: "13px" }}>
                    {removeUnderlineAndJoin(marks?.name)}
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {scores[index].point}
                  </Typography>
                </Typography>
              </Box>
              <Slider
                progress
                value={scores[index]?.point}
                max={maxValue}
                min={minValue}
                step={stepValue}
                onChange={(value) => {
                  handleChange(index, value)
                }}
              />
            </Card>
          </Box>
        );
      })}
    </>
  );
};

export default StudentMarksSlider;
