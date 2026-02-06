import { Box, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { SelectPicker } from "rsuite";
import { nameValidation } from "../../../utils/validation";
import "../../../styles/PanellistDesignPage.css";
import "../../../styles/ZoomPage.css";
import StudentMarksSlider from "../StudentMarksSlider/StudentMarksSlider";

const SubmitStudentMarks = ({
  studentInfo,
  data,
  setStatus,
  setStudentInfo,
  setRemarks,
  w_value,
  setScores,
  scores,
  getScores,
  marking_scheme,
  remarks,
  status
}) => {
  const [errorName, setErrorName] = useState("");
  const handleSliderChange = (newMarksData) => {
    setStudentInfo(newMarksData);
  };
  // if(getScores){
  //   setScores(getScores)
  // }
  return (
    <>
      <Box sx={{ p: 2 }}>
        <SelectPicker
          data={data}
          value={status}
          searchable={false}
          style={{
            width: 170,
            border: "1px solid #008CE0",
            borderRadius: "8px",
            color: "#008CE0",
          }}
          onChange={(event) => setStatus(event)}
        />
      </Box>
      <Box sx={{ paddingX: 2 }} className="zoom-page-flex-box">
        <Typography sx={{ fontSize: "11px", fontWeight: 500 }}>
          Rating Parameter
        </Typography>
        <Typography
          sx={{
            fontSize: "11px",
            fontWeight: 500,
            color: "#008CE0",
          }}
        >
          Weightage
        </Typography>
      </Box>

      
      <StudentMarksSlider marksData={w_value} scores={scores} setScores={setScores}  handleSliderChange={handleSliderChange} marking_scheme={marking_scheme}></StudentMarksSlider>
      <Box sx={{ p: 2 }}>
        <TextField
        color="info"
          required
          fullWidth="50%"
          placeholder="Remarks"
          id="filled-size-normal"
          helperText={errorName}
          error={errorName}
          multiline
          maxRows={4}
          value={remarks}
          onChange={(e) => {
            const isCharValid = nameValidation(e.target.value);
            if (e.target.value.length < 2) {
              setRemarks(e.target.value)
              setErrorName("At least 2 characters ");
            } else if (isCharValid) {
              setErrorName("");
              setRemarks(e.target.value);
            } else {
              setErrorName("Numbers and Special characters aren't allowed");
            }
          }}
        />
      </Box>
    </>
  );
};

export default SubmitStudentMarks;
