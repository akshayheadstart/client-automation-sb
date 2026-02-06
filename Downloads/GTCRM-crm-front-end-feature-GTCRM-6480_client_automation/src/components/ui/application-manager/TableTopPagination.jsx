import { IconButton, Typography } from "@mui/material";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { handleChangePage } from "../../../helperFunctions/pagination";
function TableTopPagination({
  pageNumber,
  setPageNumber,
  localStoragePageNumberKey,
  totalCount,
  rowsPerPage,
}) {
  const lastPage =
    Math.ceil((totalCount ? totalCount : 1) / rowsPerPage) === pageNumber;
  return (
    <Typography color="info.main">
      <IconButton
        disabled={pageNumber === 1}
        onClick={() =>
          handleChangePage(
            pageNumber - 1,
            localStoragePageNumberKey,
            setPageNumber
          )
        }
        sx={{ p: 0.3 }}
      >
        <KeyboardArrowLeftIcon sx={{ fontSize: "16px" }} />
      </IconButton>
      <Typography variant="caption"> {pageNumber}</Typography>
      <IconButton
        disabled={lastPage}
        onClick={() =>
          handleChangePage(
            pageNumber + 1,
            localStoragePageNumberKey,
            setPageNumber
          )
        }
        sx={{ p: 0.3 }}
      >
        <KeyboardArrowRightIcon sx={{ fontSize: "16px" }} />
      </IconButton>
    </Typography>
  );
}

export default React.memo(TableTopPagination);
