import { Box, Divider, Typography } from "@mui/material";

const CounsellorPerformanceBlock = ({ fieldName, fieldValue }) => {
  return (
    <>
      <Box className="counsellor-performance-block-box">
        <Typography className="counsellor-performance-field">
          {fieldName}
        </Typography>
        <Typography className="counsellor-performance-field-value">
          {fieldValue ? fieldValue : 0}
        </Typography>
      </Box>
      <Divider />
    </>
  );
};

export default CounsellorPerformanceBlock;
