import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { useEffect } from "react";
import { useState } from "react";
import { handleChangePage } from "../../helperFunctions/pagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";

const LeadsViewDialog = ({
  openDialog,
  setOpenDialog,
  title,
  leads,
  state,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pageNumber, setPageNumber] = useState(1);

  const count = Math.ceil(rowCount / rowsPerPage);

  const [headerColumn, setHeaderColumn] = useState([]);

  const handleClose = () => {
    setOpenDialog(false);
    setRowsPerPage(25);
    setPageNumber(1);
  };

  useEffect(() => {
    const headerOfTheTable = [];
    /* 
        here in this loop we are extracting the dynamic key name to be used as the dynamic header of the table in UI
        */
    leads?.forEach((lead) => {
      const keysOfField = Object.keys(lead);
      keysOfField.forEach((key) => {
        if (!headerOfTheTable.includes(key)) {
          headerOfTheTable.push(key);
        }
      });
    });
    setHeaderColumn(headerOfTheTable);
    setRowCount(leads?.length);
  }, [leads]);

  // Get current leads
  const indexOfLastLead = pageNumber * rowsPerPage;
  const indexOfFirstLead = indexOfLastLead - rowsPerPage;
  const currentLeads = leads.slice(indexOfFirstLead, indexOfLastLead);
  return (
    <Dialog
      sx={{
        zIndex: 2001,
      }}
      maxWidth={"xl"}
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "space-between" }}
        variant="h5"
        id="alert-dialog-title"
      >
        <Box>{title}</Box>
        <IconButton data-testid="cancel-button" onClick={handleClose}>
          <CancelIcon></CancelIcon>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ px: 3 }} id="alert-dialog-description">
          <TableContainer className="custom-scrollbar">
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  {headerColumn?.map((column) => (
                    <TableCell>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentLeads?.map((data) => (
                  <TableRow hover key={data?.id}>
                    {headerColumn?.map((header) => (
                      <TableCell key={data[header]}>
                        {data[header] ? data[header] : `– –`}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              mt: 2,
            }}
          >
            <Pagination
              className="pagination-bar"
              currentPage={pageNumber}
              totalCount={rowCount}
              pageSize={rowsPerPage}
              onPageChange={(page) =>
                handleChangePage(
                  page,
                  `${
                    state?.from === "leadUpload"
                      ? "leadViewDialog"
                      : "rawViewDialog"
                  }`,
                  setPageNumber
                )
              }
              count={count}
            />

            <AutoCompletePagination
              rowsPerPage={rowsPerPage}
              rowPerPageOptions={rowPerPageOptions}
              setRowsPerPageOptions={setRowsPerPageOptions}
              rowCount={rowCount}
              page={pageNumber}
              setPage={setPageNumber}
              setRowsPerPage={setRowsPerPage}
            ></AutoCompletePagination>
          </Box>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default LeadsViewDialog;
