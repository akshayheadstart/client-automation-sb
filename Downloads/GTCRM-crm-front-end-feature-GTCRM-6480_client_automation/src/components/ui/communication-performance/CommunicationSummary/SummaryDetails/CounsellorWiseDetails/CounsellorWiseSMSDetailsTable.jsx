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
import MessageNotDeliveredDetails from "../ReleaseDetails/MessageNotDeliveredDetails";

const CounsellorWiseSMSDetailsTable = ({
  sortingColumn,
  setSortingColumn,
  setSortingType,
  sortingType,
  tableDetails,
  tabValue,
  isTemplateManager,
  tableHeader,
  dataSegment,
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
          {tableDetails?.map((details) => (
            <TableRow
              key={details?.type}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                {" "}
                <CommonTableName
                  communicationDetails={false}
                  tabValue={tabValue}
                  name={
                    dataSegment
                      ? details?.segment_name
                      : isTemplateManager
                      ? details?.template_name
                      : details?.counsellor_name
                  }
                />
              </TableCell>
              <TableCell align="center">{details?.sent}</TableCell>
              <TableCell align="center">{details?.delivered}</TableCell>
              <TableCell align="center">
                <MessageNotDeliveredDetails count={details?.not_delivered} />
              </TableCell>
              {dataSegment && (
                <>
                  <TableCell align="center">{details?.data_type}</TableCell>
                  <TableCell align="center">{details?.segment_type}</TableCell>
                </>
              )}
              <TableCell align="center">{details?.channel_1}</TableCell>
              <TableCell align="center">{details?.channel_1}</TableCell>
              <TableCell align="center">{details?.channel_3}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CounsellorWiseSMSDetailsTable;
