import React, { useState } from "react";
import { handleChangePage } from "../../../helperFunctions/pagination";
import Pagination from "./Pagination";
import AutoCompletePagination from "../forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
import { Box } from "@mui/material";

function SharedPaginationAndRowsPerPage({
  pageNumber,
  setPageNumber,
  totalDataCount,
  rowsPerPage,
  setRowsPerPage,
}) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  return (
    <Box className="common-pagination-container">
      <Pagination
        className="pagination-bar"
        currentPage={pageNumber}
        totalCount={totalDataCount}
        pageSize={rowsPerPage}
        onPageChange={(page) => handleChangePage(page, "", setPageNumber)}
        count={Math.ceil(totalDataCount / rowsPerPage)}
      />
      <AutoCompletePagination
        rowsPerPage={rowsPerPage}
        rowPerPageOptions={rowPerPageOptions}
        setRowsPerPageOptions={setRowsPerPageOptions}
        rowCount={totalDataCount}
        page={pageNumber}
        setPage={setPageNumber}
        setRowsPerPage={setRowsPerPage}
      ></AutoCompletePagination>
    </Box>
  );
}

export default React.memo(SharedPaginationAndRowsPerPage);
