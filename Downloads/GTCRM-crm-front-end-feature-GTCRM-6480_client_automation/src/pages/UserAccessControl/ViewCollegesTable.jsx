import React, { useEffect, useState } from "react";
import { useGetAllCollegesListQuery } from "../../Redux/Slices/clientOnboardingSlice";
import useCommonErrorHandling from "../../hooks/useCommonErrorHandling";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../components/shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import TableTopPagination from "../../components/ui/application-manager/TableTopPagination";
import SharedPaginationAndRowsPerPage from "../../components/shared/Pagination/SharedPaginationAndRowsPerPage";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import SettingsIcon from "@mui/icons-material/Settings";
import "../../styles/clientOnboardingStyles.css";
import AddCollegeConfigurationDialog from "../../components/ui/client-onboarding/ConfigurationDetails/AddCollegeConfigurationDialog";
import OnboardingStatusDialog from "../../components/ui/client-onboarding/OnboardingStatusDialog";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import { useSelector } from "react-redux";
const ViewCollegesTable = () => {
  const permissions = useSelector((state) => state.authentication.permissions);
  const [rowCount, setRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [allColleges, setAllColleges] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [openOnboardingStatusDialog, setOpenOnboardingStatusDialog] =
    useState(false);

  const handleError = useCommonErrorHandling();

  const { data, isError, error, isFetching, isSuccess } =
    useGetAllCollegesListQuery({ pageNumber, rowsPerPage });

  useEffect(() => {
    if (isSuccess) {
      setAllColleges(data?.data);
      setRowCount(data?.total);
    } else if (isError) {
      handleError({ error, setIsInternalServerError });
    }
  }, [data, isError, error, isSuccess]);

  const handleAddConfig = (collegeId) => {
    setSelectedCollegeId(collegeId);
    setOpenConfigDialog(true);
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
                  currentPageShowingCount={allColleges?.length}
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
              {allColleges?.length > 0 ? (
                <>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">College Name</TableCell>
                          <TableCell align="left">College Email</TableCell>
                          <TableCell align="left">College Phone</TableCell>
                          <TableCell align="left">Status</TableCell>
                          {permissions?.["817c5d6d"]?.features?.["0a330fee"]
                            ?.features?.["3b2055aa"]?.visibility && (
                            <TableCell align="center">Action</TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allColleges?.map((college) => (
                          <TableRow key={college?.college_id}>
                            <TableCell align="left">
                              {college?.name || "--"}
                            </TableCell>
                            <TableCell align="left">
                              {college?.college_email
                                ? college?.college_email
                                : "--"}
                            </TableCell>
                            <TableCell align="left">
                              {college?.mobile_number
                                ? college?.mobile_number
                                : "--"}
                            </TableCell>
                            <TableCell align="left">
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
                                      setSelectedCollegeId(college?.college_id);
                                    }}
                                  >
                                    {college?.onboarding_status || "--"}
                                  </Box>
                                }
                              ></CustomTooltip>
                            </TableCell>
                            {permissions?.["817c5d6d"]?.features?.["0a330fee"]
                              ?.features?.["3b2055aa"]?.visibility && (
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  color="info"
                                  onClick={() =>
                                    handleAddConfig(college?.college_id)
                                  }
                                >
                                  <SettingsIcon />
                                </Button>
                              </TableCell>
                            )}
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
      {openConfigDialog && (
        <AddCollegeConfigurationDialog
          selectedCollegeId={selectedCollegeId}
          open={openConfigDialog}
          setOpen={setOpenConfigDialog}
        />
      )}

      {openOnboardingStatusDialog && (
        <OnboardingStatusDialog
          selectedCollegeId={selectedCollegeId}
          open={openOnboardingStatusDialog}
          setOpen={setOpenOnboardingStatusDialog}
        />
      )}
    </Box>
  );
};

export default ViewCollegesTable;
