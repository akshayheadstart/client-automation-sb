import {
  Card,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Box,
} from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";

const CampaignManagerTable = ({
  heading,
  helpText,
  tableHead,
  tableBody,
  loading,
  somethingWentWrong,
  internalServerError,
  hideCampaignDetailsTable,
  name,
}) => {
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  const dataInDescendingOrder = React.useMemo(() => {
    return tableBody?.sort((firstElement, secondElement) => {
      return secondElement.leads - firstElement.leads;
    });
  }, [tableBody]);

  // calculate total
  const totalLead = React.useMemo(
    () => tableBody.reduce((total, lead) => lead.leads + total, 0),
    [tableBody]
  );
  const totalVerifiedOrPrimary = React.useMemo(
    () => tableBody.reduce((total, lead) => lead.verified_leads + total, 0),
    [tableBody]
  );
  const totalPaidOrSecondary = React.useMemo(
    () => tableBody.reduce((total, lead) => lead.paid_applications + total, 0),
    [tableBody]
  );
  const unpaidOrTertiary = React.useMemo(
    () =>
      tableBody.reduce((total, lead) => lead.unpaid_applications + total, 0),
    [tableBody]
  );
  const totalApplications = React.useMemo(
    () =>
      tableBody.reduce(
        (total, applications) =>
          applications.total_applications &&
          applications.total_applications + total,
        0
      ),
    [tableBody]
  );

  return (
    <Card
      sx={{ p: 2, mt: 2, display: hideCampaignDetailsTable ? "none" : "block" }}
    >
      {somethingWentWrong || internalServerError ? (
        <Box>
          {internalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box>
          {loading ? (
            <Box className="campaign-manager-loader-container">
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <Box>
              <Typography variant="h6">
                {heading}
                <Tooltip title={helpText} placement="top" arrow>
                  <IconButton>
                    <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                  </IconButton>
                </Tooltip>
              </Typography>

              <TableContainer
                component={Paper}
                sx={{ mt: 2 }}
                className="custom-scrollbar"
              >
                <Table>
                  <TableHead className="campaign-manager-table">
                    <TableRow>
                      <TableCell
                        width="15%"
                        className="campaign-manager-table-name"
                      >
                        {name}
                      </TableCell>
                      {tableHead.map((head) => (
                        <TableCell
                          align="center"
                          className="campaign-manager-table-head"
                        >
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataInDescendingOrder?.map((row) => (
                      <TableRow>
                        <TableCell className="campaign-manager-table-content-name">
                          {row.name || row.source_name
                            ? row.name
                              ? row.name
                              : row.source_name
                            : "N/A"}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderColor: "#d3d4d7" }}
                        >
                          <Typography
                            color={"success.main"}
                            variant="subtitle2"
                          >
                            {row.leads ? row.leads : 0}
                          </Typography>
                        </TableCell>
                        {row?.total_applications && (
                          <TableCell
                            align="center"
                            sx={{ borderColor: "#d3d4d7" }}
                          >
                            <Typography
                              sx={{ color: "green" }}
                              variant="subtitle2"
                            >
                              {row?.total_applications
                                ? row?.total_applications
                                : 0}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell
                          align="center"
                          sx={{ borderColor: "#d3d4d7" }}
                        >
                          <Typography
                            color={"warning.main"}
                            variant="subtitle2"
                          >
                            {row?.verified_leads
                              ? row?.verified_leads
                              : row?.primary_leads
                              ? row?.primary_leads
                              : 0}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderColor: "#d3d4d7" }}
                        >
                          <Typography color={"info.main"} variant="subtitle2">
                            {row.paid_applications
                              ? row.paid_applications
                              : row.secondary_leads
                              ? row.secondary_leads
                              : 0}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ borderColor: "#d3d4d7" }}
                        >
                          <Typography color={"error.main"} variant="subtitle2">
                            {row.unpaid_applications
                              ? row.unpaid_applications
                              : row.tertiary_leads
                              ? row.tertiary_leads
                              : 0}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="campaign-manager-table-content-name">
                        Total
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
                        <Typography color={"success.main"} variant="subtitle2">
                          {totalLead ? totalLead : 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
                        <Typography sx={{ color: "green" }} variant="subtitle2">
                          {totalApplications ? totalApplications : 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
                        <Typography color={"warning.main"} variant="subtitle2">
                          {totalVerifiedOrPrimary ? totalVerifiedOrPrimary : 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
                        <Typography color={"info.main"} variant="subtitle2">
                          {totalPaidOrSecondary ? totalPaidOrSecondary : 0}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
                        <Typography color={"error.main"} variant="subtitle2">
                          {unpaidOrTertiary ? unpaidOrTertiary : 0}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default React.memo(CampaignManagerTable);
