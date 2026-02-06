import { Box } from "@mui/material";
import React from "react";
import ReviewedCandidateHeader from "./ReviewedCandidateHeader";
import ReviewedCandidateTable from "./ReviewedCandidateTable";

const ReviewedCandidates = () => {
  return (
    <Box sx={{ p: { md: 4, xs: 2 } }} className="reviewed-candidates-container">
      <ReviewedCandidateHeader />
      <ReviewedCandidateTable />
    </Box>
  );
};

export default ReviewedCandidates;
