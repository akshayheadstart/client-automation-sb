import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import IndicatorComponent from "./IndicatorComponent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import "../../../styles/sharedStyles.css";

const ChoropleteMapApplications = (props) => {
  const StyledTableCell = useTableCellDesign();

  const { leadData, stateWiseIndicator } = props;
  const navigate = useNavigate();

  // leadData[0]?.map?.sort(compare).slice(0, 9)
  let rows = [...leadData[0]?.map];

  if (rows?.length <= 8) {
    rows.sort((a, b) => b.application_percentage - a.application_percentage);
  } else {
    rows.sort((a, b) => b?.application_percentage - a?.application_percentage);
    rows = rows?.slice(0, 8);
  }
  // const permissions = useSelector((state) => state.authentication.permissions);
  // const hyperLinkPermission =
  //   permissions?.menus?.dashboard?.admin_dashboard?.features?.hyper_link;
  // const hyperLinkCounselorPermission = useSelector(
  //   (state) =>
  //     state.authentication.permissions.menus?.dashboard?.counselor_dashboard
  //       ?.features?.hyper_link
  // );

  return (
    <TableContainer
      sx={{ height: "400px", width: "auto" }}
      className="topPerformingTable vertical-scrollbar"
    >
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>State</StyledTableCell>
            <StyledTableCell align="center">
              % of PAID Applications{" "}
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRow key={row?.name}>
              <StyledTableCell>
                <Typography
                  onClick={() =>
                    // (hyperLinkPermission || hyperLinkCounselorPermission) &&
                    navigate(
                      "/paid-applications#paid-application-manager-container",
                      {
                        state: {
                          admin_dashboard: true,
                          filters: {
                            state: {
                              state_code: [row?.state_code],
                              state_b: true,
                            },
                            source: {
                              source_name: props?.selectedMapSourceId,
                            },
                            addColumn: ["State"],
                          },
                        },
                      }
                    )
                  }
                  sx={{
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                  variant="body2"
                >
                  {row?.state_name}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center" size="small">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.3,
                  }}
                >
                  <Typography
                    color={"text.primary"}
                    variant="subtitle2 "
                    sx={{ fontSize: "14px" }}
                  >
                    {Number(row?.application_count)}
                  </Typography>
                  <Typography
                    color={"text.primary"}
                    variant="subtitle1"
                    sx={{ fontSize: "11px" }}
                  >
                    ({Number(row?.application_percentage).toFixed(2)}%)
                  </Typography>
                  <Box>
                    <IndicatorComponent
                      indicator={stateWiseIndicator}
                      indicatorSize="15"
                      fontSize="12"
                      title="Application State Wise"
                      performance={row?.application_percentage_position}
                      percentage={parseFloat(
                        row?.application_percentage_difference
                          ? row?.application_percentage_difference
                          : 0
                      ).toFixed(2)}
                      tooltipPosition="right"
                    ></IndicatorComponent>
                  </Box>
                </Box>
              </StyledTableCell>
            </TableRow>
          ))}
          <TableRow>
            <StyledTableCell>Other</StyledTableCell>
            <StyledTableCell align="center">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 0.3,
                }}
              >
                <Typography
                  color={"text.primary"}
                  variant="subtitle2"
                  sx={{ fontSize: "14px" }}
                >
                  {Number(leadData[0]?.Other?.application_count || 0)}
                </Typography>
                <Typography
                  color={"text.primary"}
                  variant="subtitle1"
                  sx={{ fontSize: "11px" }}
                >
                  (
                  {Number(
                    leadData[0]?.Other?.application_percentage || 0
                  ).toFixed(2)}
                  ) %
                </Typography>
                <Box>
                  <IndicatorComponent
                    indicator={stateWiseIndicator}
                    indicatorSize="15"
                    fontSize="12"
                    title="Application State Wise"
                    performance={
                      leadData[0]?.Other
                        ?.other_application_percentage_position || "equal"
                    }
                    percentage={parseFloat(
                      leadData[0]?.Other
                        ?.other_application_percentage_difference
                        ? leadData[0]?.Other
                            ?.other_application_percentage_difference
                        : 0
                    ).toFixed(2)}
                    tooltipPosition="right"
                  ></IndicatorComponent>
                </Box>
              </Box>
            </StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default React.memo(ChoropleteMapApplications);
