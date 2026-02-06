import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { leadProcessedTableHeader } from "../../../constants/LeadStageList";
import TableDetailsRow from "./TableDetailsRow";
import "../../../styles/communicationSummary.css";
const LeadProcessTable = ({ tableDetails, extraTableHeader }) => {
  return (
    <TableContainer className="custom-scrollbar">
      <Table className="call-summary-details-table">
        <TableHead>
          <TableRow>
            {leadProcessedTableHeader.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
            {extraTableHeader.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableDetails.map((details) => (
            <TableDetailsRow
              key={details}
              details={details}
              extraTableHeader={extraTableHeader}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeadProcessTable;
