import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo, useState } from "react";
import Pagination from "../../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import AutoCompletePagination from "../../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../../components/Calendar/utils";
import { showCheckboxAndIndeterminate } from "../../../helperFunctions/checkboxHandleFunction";

function AutomationManagerTableDetails({
  totalCount,
  pageNumber,
  rowsPerPage,
  setPageNumber,
  setRowsPerPage,
  automationList,
  hideTable,
  paginationRef,
  setSelectedAutomation,
  selectedAutomation,
  setDetailsId,
  setShowDetailsPage,
}) {
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const allIds = useMemo(
    () => automationList.map((list) => list._id),
    [automationList]
  );
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      allIds,
      selectedAutomation,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [allIds, selectedAutomation]);

  const count = Math.ceil(totalCount / rowsPerPage);

  const handleRemoveSelectedItems = (selectedData, deleteData, setData) => {
    const prevData = [...selectedData];
    prevData.splice(prevData.indexOf(deleteData), 1);
    setData(prevData);
  };

  const handleCheckBoxOnChange = (checked, data) => {
    if (checked) {
      setSelectedAutomation((prev) => [...prev, data._id]);
    } else {
      handleRemoveSelectedItems(
        selectedAutomation,
        data._id,
        setSelectedAutomation
      );
    }
  };

  return (
    <Box sx={{ display: hideTable ? "none" : "" }}>
      <TableContainer className="custom-scrollbar automation-manager-table">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="5%">
                <Checkbox
                  indeterminate={showIndeterminate}
                  checked={selectTopCheckbox}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAutomation(allIds);
                    } else {
                      setSelectedAutomation([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Communication Action</TableCell>
              <TableCell>Next Trigger Date</TableCell>
              <TableCell align="center">Communications</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {automationList.map((details) => (
              <TableRow key={details._id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAutomation.includes(details._id)}
                    onChange={(e) =>
                      handleCheckBoxOnChange(e.target.checked, details)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{ cursor: "pointer", display: "inline-flex" }}
                    onClick={() => {
                      setDetailsId(details._id);
                      setShowDetailsPage(true);
                    }}
                  >
                    {details.rule_name || "--"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {details?.action_type?.length ? (
                    <>
                      {details.action_type.map((action) => (
                        <Typography className="status active">
                          {action}
                        </Typography>
                      ))}
                    </>
                  ) : (
                    "--"
                  )}
                </TableCell>
                <TableCell>{details.next_execute || "--"}</TableCell>
                <TableCell align="center">
                  {details.communication || "--"}
                </TableCell>
                <TableCell align="center">
                  {details?.status ? (
                    <Typography
                      className={`${details?.status?.toLowerCase()} status`}
                    >
                      {details.status}
                    </Typography>
                  ) : (
                    "--"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        ref={paginationRef}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Pagination
          className="pagination-bar"
          currentPage={pageNumber}
          totalCount={totalCount}
          pageSize={rowsPerPage}
          onPageChange={(page) => handleChangePage(page, "", setPageNumber)}
          count={count}
        />
        <AutoCompletePagination
          rowsPerPage={rowsPerPage}
          rowPerPageOptions={rowPerPageOptions}
          setRowsPerPageOptions={setRowsPerPageOptions}
          rowCount={totalCount}
          page={pageNumber}
          setPage={setPageNumber}
          setRowsPerPage={setRowsPerPage}
        ></AutoCompletePagination>
      </Box>
    </Box>
  );
}

export default AutomationManagerTableDetails;
