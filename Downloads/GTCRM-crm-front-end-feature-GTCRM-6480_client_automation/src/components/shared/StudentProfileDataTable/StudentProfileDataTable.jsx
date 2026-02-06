import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React from "react";
import {
  handleOverAllRatingToFixed,
  removeUnderlineAndJoin,
} from "../../../helperFunctions/calendarHelperfunction";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#DCF8F",
    color: "black",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "white",
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const StudentProfileDataTable = ({ data, markingSchema }) => {
  return (
    <TableContainer component={Paper} className="custom-scrollbar">
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead sx={{ bgcolor: "#DCF8FF" }}>
          <TableRow>
            <StyledTableCell>Parameters</StyledTableCell>
            {data && (
              <>
                {Object.keys(data).map((panelist) => {
                  return (
                    <StyledTableCell align="center">
                      {removeUnderlineAndJoin(panelist)}
                    </StyledTableCell>
                  );
                })}
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data)
            ?.slice(0, 1)
            .map((row) => (
              <>
                {data[row]
                  .filter((info) => info.name !== "comments")
                  .map((item, index) => {
                    return (
                      <>
                        <StyledTableRow
                          sx={{
                            cursor: "pointer",
                            bgcolor:
                              index % 2 === 0 ? " " : "rgba(240, 252, 255, 1)",
                          }}
                          key={item.name}
                        >
                          <StyledTableCell component="th" scope="row">
                            {removeUnderlineAndJoin(item?.name)}
                          </StyledTableCell>

                          {Object.values(data)?.map((user, inx) => {
                            return (
                              <>
                                <StyledTableCell align="center">
                                  {handleOverAllRatingToFixed(
                                    user?.filter(
                                      (info) => info.name !== "comments"
                                    )[index].point
                                  )}
                                </StyledTableCell>
                              </>
                            );
                          })}
                        </StyledTableRow>
                      </>
                    );
                  })}
              </>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentProfileDataTable;
