import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { callInfoTableHeaders } from "../../../../../constants/LeadStageList";
import SortIndicatorWithTooltip from "../../../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { CallInfoTableBody } from "./CallInfoTableBody";

const CallInfoTableDetails = ({
  sortingColumn,
  setSortingColumn,
  sortingType,
  setSortingType,
  tabValue,
  callInfoDetails,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer className="custom-scrollbar">
        <Table>
          <TableHead>
            <TableRow>
              {callInfoTableHeaders.map((header, index) => (
                <>
                  {header.tabs.includes(tabValue) && (
                    <TableCell key={header.label}>
                      <Box
                        sx={{ justifyContent: index ? "center" : "flex-start" }}
                        className="call-info-table-header"
                      >
                        {header.label}
                        <SortIndicatorWithTooltip
                          sortType={
                            sortingColumn === header?.value ? sortingType : ""
                          }
                          value={header?.value}
                          sortColumn={sortingColumn}
                          setSortType={setSortingType}
                          setSortColumn={setSortingColumn}
                        />
                      </Box>
                    </TableCell>
                  )}
                </>
              ))}
            </TableRow>
          </TableHead>
          <CallInfoTableBody
            callInfoDetails={callInfoDetails}
            tabValue={tabValue}
          />
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CallInfoTableDetails;
