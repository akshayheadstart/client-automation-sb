import { Box, Typography } from "@mui/material";
import React from "react";
import SchoolIcon from "../../../icons/InterviewCandidate/school-cap.svg";
import ScoreDetails from "./ScoreDetails";
import { useNavigate } from "react-router-dom";
const BodyDetails = ({
  data,
  setOpenConfirmationDialog,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();
  return (
    <Box className="interviewed-candidate-card-container">
      <Typography variant="h6">{data?.student_name}</Typography>
      <Typography variant="body2" className="interviewed-course">
        <img src={SchoolIcon} alt="school icon" />
        {data?.interview_list_name}
      </Typography>
      <ScoreDetails
        title1=" 10th Score"
        title2="12th Score"
        score1={data.tenth_score}
        score2={data.twelve_marks}
      />
      <ScoreDetails
        title1="UG Score"
        title2="Interview Score"
        score1={data.ug_marks}
        score2={data.interview_marks}
      />
      <Box className="interviewed-candidate-action">
        <button onClick={() => navigate("/view-application", { state: data })}>
          View Application
        </button>
        <button
          style={{ backgroundColor: "transparent" }}
          onClick={() => {
            setOpenConfirmationDialog(true);
            setSelectedStudent(data);
          }}
        >
          Send Offer Letter
        </button>
      </Box>
    </Box>
  );
};

export default BodyDetails;
