import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import DeliveredCountAndRate from "./DeliveredCountAndRate";

function EmailDetailsTable({ data }) {
  return (
    <TableContainer className="custom-scrollbar automation-manager-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Template Name</TableCell>
            <TableCell>Sent</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>Opened</TableCell>
            <TableCell>Clicked</TableCell>
            <TableCell>Complaint Rate</TableCell>
            <TableCell>Bounce Rate</TableCell>
            <TableCell>Unsubscribe Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((details) => (
            <TableRow key={details.id}>
              <TableCell>{details.template_name || "--"}</TableCell>
              <TableCell>{details.sent || "--"}</TableCell>
              <TableCell>
                <DeliveredCountAndRate data={details?.delivered} />
              </TableCell>
              <TableCell>
                <DeliveredCountAndRate data={details?.opened} />
              </TableCell>
              <TableCell>
                <DeliveredCountAndRate data={details?.opened} />
              </TableCell>
              <TableCell>{details.complaint_rate || "--"}</TableCell>
              <TableCell>{details.bounce_rate || "--"}</TableCell>
              <TableCell>{details.unsubscribe_rate || "--"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EmailDetailsTable;
