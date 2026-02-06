import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

function WhatsappDetailsTable({ data }) {
  return (
    <TableContainer className="custom-scrollbar automation-manager-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Template Name</TableCell>
            <TableCell>Tag</TableCell>
            <TableCell>Content</TableCell>
            <TableCell>Sent</TableCell>
            <TableCell>Delivered</TableCell>
            <TableCell>Click Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((details) => (
            <TableRow key={details.id}>
              <TableCell>{details.template_name || "--"}</TableCell>
              <TableCell>
                {" "}
                {details?.tag?.length ? (
                  <>
                    {details.tag?.map((list) => (
                      <span>{list}</span>
                    ))}
                  </>
                ) : (
                  "--"
                )}
              </TableCell>
              <TableCell className="template-content">
                {details.content || "--"}
              </TableCell>
              <TableCell>{details.sent || "--"}</TableCell>
              <TableCell>
                {" "}
                {typeof details.delivered !== "object"
                  ? details.delivered || "--"
                  : "--"}
              </TableCell>
              <TableCell>{details.click_rate || "--"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WhatsappDetailsTable;
