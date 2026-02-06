import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import IndicatorComponent from "../../components/ui/admin-dashboard/IndicatorComponent";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/sharedStyles.css";

const SourcePerformanceTable = ({
  sourceWiseDetailsTableData,
  sourceWiseIndicator,
}) => {
  const tableHead = [
    "Source Name",
    "Total Leads",
    "Verified",
    "Form Initiated",
    "Application",
    "Admission",
    "Primary",
    "Secondary",
    "Tertiary",
  ];

  const StyledTableCell = useTableCellDesign();
  return (
    <Box sx={{ mt: "15px" }}>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 0 }}
          className="custom-scrollbar"
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {tableHead?.map((head) => (
                  <StyledTableCell align="left">{head}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sourceWiseDetailsTableData?.map((row) => (
                <TableRow>
                  <StyledTableCell align="left" sx={{ fontWeight: 600, p: 1 }}>
                    {row?.name ? row?.name : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.leads ? row?.leads : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Total Lead "
                          performance={row?.leads_pos || "equal"}
                          percentage={parseFloat(
                            row?.leads_perc ? row?.leads_perc : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.verified_leads ? row?.verified_leads : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Verified Lead "
                          performance={row?.verified_leads_pos || "equal"}
                          percentage={parseFloat(
                            row?.verified_leads_perc
                              ? row?.verified_leads_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.form_initiated ? row?.form_initiated : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Form Initiated"
                          performance={row?.form_initiated_pos || "equal"}
                          percentage={parseFloat(
                            row?.form_initiated_perc
                              ? row?.form_initiated_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.submitted_applications
                          ? row?.submitted_applications
                          : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Applications"
                          performance={
                            row?.submitted_applications_pos || "equal"
                          }
                          percentage={parseFloat(
                            row?.submitted_applications_perc
                              ? row?.submitted_applications_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.admission ? row?.admission : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Admission"
                          performance={row?.admission_pos || "equal"}
                          percentage={parseFloat(
                            row?.admission_perc ? row?.admission_perc : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.primary_leads ? row?.primary_leads : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Primary Lead "
                          performance={row?.primary_leads_pos || "equal"}
                          percentage={parseFloat(
                            row?.primary_leads_perc
                              ? row?.primary_leads_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.secondary_leads ? row?.secondary_leads : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Secondary Lead "
                          performance={row?.secondary_leads_pos || "equal"}
                          percentage={parseFloat(
                            row?.secondary_leads_perc
                              ? row?.secondary_leads_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell sx={{ p: 1 }} align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "left",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        fontSize={15}
                      >
                        {row?.tertiary_leads ? row?.tertiary_leads : 0}
                      </Typography>
                      <Box>
                        <IndicatorComponent
                          indicator={sourceWiseIndicator}
                          indicatorSize="15"
                          fontSize="12"
                          title="Tertiary Lead "
                          performance={row?.tertiary_leads_pos || "equal"}
                          percentage={parseFloat(
                            row?.tertiary_leads_perc
                              ? row?.tertiary_leads_perc
                              : 0
                          ).toFixed(2)}
                          tooltipPosition="right"
                        ></IndicatorComponent>
                      </Box>
                    </Box>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </Box>
  );
};
export default React.memo(SourcePerformanceTable);
