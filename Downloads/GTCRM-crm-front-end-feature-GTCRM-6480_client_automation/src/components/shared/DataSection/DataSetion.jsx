import React from "react";
import { Box, Typography, Divider, Skeleton } from "@mui/material";

import "../../../styles/DataSection.css";

const DataSection = ({
  title = "0",
  value = "0",
  hideDivider = false,
  loading = false,
}) => {
  return (
    <Box data-testid="data-section">
      <Typography variant="p" className="data-label">
        {title}
      </Typography>
      {loading ? (
        <Skeleton variant="rectangular" className="skeleton" />
      ) : (
        <Typography variant="h6" className="data-count">
          {value}
        </Typography>
      )}
      {!hideDivider ? (
        <Divider
          data-testid="section-divider"
          className="data-section-divider"
        />
      ) : null}
    </Box>
  );
};

export default DataSection;
