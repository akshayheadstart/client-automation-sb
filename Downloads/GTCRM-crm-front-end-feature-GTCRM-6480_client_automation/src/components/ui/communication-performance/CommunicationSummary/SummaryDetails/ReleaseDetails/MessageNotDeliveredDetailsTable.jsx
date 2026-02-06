import React from "react";
import { messageNotDeliveredTableHeader } from "../../../../../../constants/LeadStageList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";

const MessageNotDeliveredDetailsTable = ({ notDeliveredDetails }) => {
  return (
    <TableContainer className="custom-scrollbar">
      <Table className="common-communication-table">
        <TableHead>
          <TableRow>
            {messageNotDeliveredTableHeader?.map((head) => (
              <>
                <TableCell key={head.name}>
                  <Box
                    sx={{
                      justifyContent: head?.align ? "flex-start" : "center",
                    }}
                    className="sorting-option-with-header-content"
                  >
                    {head?.name}
                  </Box>
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {notDeliveredDetails?.map((details) => (
            <TableRow
              key={details?.type}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              className="message-not-delivered-table-row"
            >
              <TableCell align="center">{details?.message_count}</TableCell>
              <TableCell align="center">{details?.error_code}</TableCell>
              <TableCell align="left">{details?.error_description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MessageNotDeliveredDetailsTable;
