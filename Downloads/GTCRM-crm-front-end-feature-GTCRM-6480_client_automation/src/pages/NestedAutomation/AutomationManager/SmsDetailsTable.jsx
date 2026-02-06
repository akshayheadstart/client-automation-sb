import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

function SmsDetailsTable({ data }) {
  return (
    <TableContainer className="custom-scrollbar automation-manager-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Template Name</TableCell>
            <TableCell>Sender ID</TableCell>
            <TableCell>SMS Type</TableCell>
            <TableCell>DLT ID</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Sent</TableCell>
            <TableCell>Delivered</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((details) => (
            <TableRow key={details.id}>
              <TableCell>{details.template_name || "--"}</TableCell>
              <TableCell>{details.sender_id || "--"}</TableCell>
              <TableCell>{details.sms_type || "--"}</TableCell>
              <TableCell>{details.dlt_id || "--"}</TableCell>
              <TableCell className="template-content">
                {details.content || "--"}
              </TableCell>
              <TableCell>{details.sent || "--"}</TableCell>
              <TableCell>
                {typeof details.delivered !== "object"
                  ? details.delivered || "--"
                  : "--"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default SmsDetailsTable;
