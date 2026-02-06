import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import SortIndicatorWithTooltip from "../../../../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import CommonTableName from "../CommonTableName";
import MessageNotDeliveredDetails from "./MessageNotDeliveredDetails";

const SMSReleaseDetailsTable = ({
  sortingColumn,
  setSortingColumn,
  setSortingType,
  sortingType,
  releaseDetails,
  tabValue,
  communicationDetails,
  tableHeader,
}) => {
  return (
    <TableContainer className="custom-scrollbar">
      <Table className="common-communication-table">
        <TableHead>
          <TableRow>
            {tableHeader?.map((head) => (
              <>
                <TableCell key={head.name}>
                  <Box
                    sx={{
                      justifyContent: head?.align ? "flex-start" : "center",
                    }}
                    className="sorting-option-with-header-content"
                  >
                    {head?.name}
                    {head?.sort && (
                      <>
                        <SortIndicatorWithTooltip
                          sortType={
                            sortingColumn === head?.name ? sortingType : ""
                          }
                          value={head?.name}
                          sortColumn={sortingColumn}
                          setSortType={setSortingType}
                          setSortColumn={setSortingColumn}
                        />
                      </>
                    )}
                  </Box>
                </TableCell>
              </>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {releaseDetails?.map((details) => (
            <TableRow
              key={details?.type}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                {" "}
                <CommonTableName
                  communicationDetails={communicationDetails}
                  tabValue={tabValue}
                  name={
                    communicationDetails ? details?.channel_name : details?.type
                  }
                />
              </TableCell>
              <TableCell align="center">{details?.sent}</TableCell>
              <TableCell align="center">{details?.delivered}</TableCell>
              <TableCell align="center">
                <MessageNotDeliveredDetails count={details?.not_delivered} />{" "}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SMSReleaseDetailsTable;
