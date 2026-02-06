import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import SharedPaginationAndRowsPerPage from "../../components/shared/Pagination/SharedPaginationAndRowsPerPage";
import { useGetAllClientsDataQuery } from "../../Redux/Slices/clientOnboardingSlice";
import useCommonErrorHandling from "../../hooks/useCommonErrorHandling";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../components/shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import AddClientCredentialDialog from "../../components/ui/client-onboarding/ConfigurationDetails/AddClientCredentialDialog";
import OnboardingStatusDialog from "../../components/ui/client-onboarding/OnboardingStatusDialog";
import CustomTooltip from "../../components/shared/Popover/Tooltip";

// Sample data
const clients = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 987 654 321",
  },
];

const ViewClientsTable = () => {
  const [rowCount, setRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allClients, setAllClients] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [openAddCredentialDialog, setOpenAddCredentialDialog] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");

  const [openOnboardingStatusDialog, setOpenOnboardingStatusDialog] =
    useState(false);

  const handleError = useCommonErrorHandling();

  const { data, isError, error, isFetching, isSuccess } =
    useGetAllClientsDataQuery({ pageNumber, rowsPerPage });

  useEffect(() => {
    if (isSuccess) {
      setAllClients(data?.data);
      setRowCount(data?.total);
    } else if (isError) {
      handleError({ error, setIsInternalServerError });
    }
  }, [data, isError, error, isSuccess]);

  const handleAddCredentials = (clientId) => {
    setSelectedClientId(clientId);
    setOpenAddCredentialDialog(true);
    // You can open a modal or navigate to another page here
  };

  return (
    <Box>
      {isFetching ? (
        <Box className="common-not-found-container">
          <LeefLottieAnimationLoader width={150} height={150} />
        </Box>
      ) : (
        <>
          {isInternalServerError ? (
            <ErrorAndSomethingWentWrong
              isInternalServerError={isInternalServerError}
            />
          ) : (
            <>
              <Box
                sx={{
                  my: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <TableDataCount
                  totalCount={rowCount}
                  currentPageShowingCount={allClients?.length}
                  pageNumber={pageNumber}
                  rowsPerPage={rowsPerPage}
                />

                <TableTopPagination
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  rowsPerPage={rowsPerPage}
                  totalCount={rowCount}
                />
              </Box>
              {allClients?.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Client Name</TableCell>
                          <TableCell>Client Email</TableCell>
                          <TableCell>Client Phone</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allClients.map((client) => (
                          <TableRow key={client._id}>
                            <TableCell>{client.client_name || "--"}</TableCell>
                            <TableCell>{client.client_email || "--"}</TableCell>
                            <TableCell>{client.client_phone || "--"}</TableCell>
                            <TableCell>
                              <CustomTooltip
                                description={
                                  <div>Click here to show detailed status</div>
                                }
                                component={
                                  <Box
                                    className={
                                      "view-all-college-resolved-action"
                                    }
                                    onClick={() => {
                                      setOpenOnboardingStatusDialog(true);
                                      setSelectedClientId(client._id);
                                    }}
                                  >
                                    {client?.onboarding_status || "--"}
                                  </Box>
                                }
                              ></CustomTooltip>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="info"
                                onClick={() => handleAddCredentials(client._id)}
                              >
                                Add Credentials
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ my: 1 }}>
                    <SharedPaginationAndRowsPerPage
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      totalDataCount={rowCount}
                    />
                  </Box>
                </>
              ) : (
                <Box className="common-not-found-container">
                  <BaseNotFoundLottieLoader width={200} height={200} />
                </Box>
              )}
            </>
          )}
        </>
      )}
      {openAddCredentialDialog && (
        <AddClientCredentialDialog
          selectedClient={selectedClientId}
          open={openAddCredentialDialog}
          setOpen={setOpenAddCredentialDialog}
        />
      )}

      {openOnboardingStatusDialog && (
        <OnboardingStatusDialog
          selectedClientId={selectedClientId}
          open={openOnboardingStatusDialog}
          setOpen={setOpenOnboardingStatusDialog}
        />
      )}
    </Box>
  );
};

export default ViewClientsTable;
