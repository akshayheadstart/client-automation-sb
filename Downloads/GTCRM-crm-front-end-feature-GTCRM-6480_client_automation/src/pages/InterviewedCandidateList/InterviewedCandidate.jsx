/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import InterviewedCandidateHeader from "./InterviewedCandidateHeader";
import InterviewedCandidateBody from "./InterviewedCandidateBody";
import { Box, Card} from "@mui/material";
import "../../styles/interviewedCandidate.css";
import ReviewedCandidates from "./ReviewedCandidates";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
function InterviewedCandidate() {
  const {
    setHeadTitle,
    headTitle
  } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(()=>{
    setHeadTitle('Interviewed Candidates')
    document.title = 'Interviewed Candidates';
  },[headTitle])
  return (
    <Card sx={{ mx: 3, my: '50px', p: { md: 3, xs: 2 },borderRadius:'20px' }}>
      <Box>
        <InterviewedCandidateHeader />
        <InterviewedCandidateBody />
        <ReviewedCandidates />
      </Box>
    </Card>
  );
}

export default InterviewedCandidate;
