import { TableCell, TableRow } from "@mui/material";
import React from "react";

const TableDetailsRow = ({ details, extraTableHeader }) => {
  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>{details?.raw_data_mandatory_field?.email || "--"}</TableCell>
      <TableCell>{details?.imported_by || "--"}</TableCell>
      <TableCell>
        {details?.raw_data_mandatory_field?.mobile_number || "--"}
      </TableCell>
      <TableCell>{details?.imported_time || "--"}</TableCell>
      {extraTableHeader?.map((header) => (
        <TableCell>{details?.raw_data_other_field[header] || "--"}</TableCell>
      ))}
    </TableRow>
  );
};

export default TableDetailsRow;
