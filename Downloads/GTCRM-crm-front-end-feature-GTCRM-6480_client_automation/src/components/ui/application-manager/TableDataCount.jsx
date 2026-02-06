import { Box, Typography } from "@mui/material";
import React from "react";

const TableDataCount = ({
  currentPageShowingCount,
  totalCount,
  pageNumber,
  rowsPerPage,
  className = "",
  showPaginationInfo,
}) => {
  const startToCurrentCount = rowsPerPage * (pageNumber - 1);
  return (
    <Box className={`table-data-count-container ${className}`}>
      Showing{" "}
      <Typography variant="h6">
        {startToCurrentCount}-{startToCurrentCount + currentPageShowingCount}
      </Typography>{" "}
      out of <Typography variant="h6">{totalCount}</Typography> Results
    </Box>
  );
};

export default React.memo(TableDataCount);
