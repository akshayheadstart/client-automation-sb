import { Box, Typography } from "@mui/material";
import React from "react";
// import { DateRangePicker } from "rsuite";

const ReviewedCandidateHeader = () => {
  return (
    <Box className="reviewed-candidate-header">
      <Box>
        <Typography variant="h5">Reviewed Candidates</Typography>
        {/* <Typography variant="body1">(04 Feb 2023 - 24 Feb 2023)</Typography> */}
      </Box>
      {/* <Box>
                <DateRangePicker
                    placement="auto"
                    placeholder="Date Range" />
            </Box> */}
    </Box>
  );
};

export default ReviewedCandidateHeader;
