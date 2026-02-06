import {
  Box,
  Card,
  CardHeader,
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
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useState } from "react";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import "../../styles/ClientManager.css";
import "../../styles/sharedStyles.css"
import VisibilityIcon from "@mui/icons-material/Visibility";
import BillingDialog from "./BillingDialog";
import useToasterHook from "../../hooks/useToasterHook";
import {
  useGetBillingListQuery,
  usePrefetch,
} from "../../Redux/Slices/applicationDataApiSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

const Billing = () => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  // states for pagination
  const applicationPageNo = localStorage.getItem(
    `${Cookies.get("userId")}formBillingPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}formBillingPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}formBillingRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}formBillingRowPerPage`)
      )
    : 25;
  const [pageNumber, setPageNumber] = useState(applicationPageNo);
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const [rowCount, setRowCount] = useState();
  const [selectedBilling, setSelectedBilling] = useState({});
  const [openBillingDialog, setOpenBillingDialog] = useState(false);
  const [allBilling, setAllBilling] = useState([]);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideBilling, setHideBilling] = useState(false);
  const [totalBilling, setTotalBilling] = useState(0);
  const pushNotification = useToasterHook();
  const count = Math.ceil(rowCount / rowsPerPage);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const {
    data: billingList,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetBillingListQuery({ pageNumber, rowsPerPage });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(billingList?.data)) {
          setAllBilling(billingList.data);
          setTotalBilling(billingList.total);
          setRowCount(billingList.total);
        } else {
          throw new Error("get billing API response has changed");
        }
      }

      if (isError) {
        setTotalBilling(0);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideBilling,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideBilling, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, isError, isSuccess, navigate, billingList]);

  // use react hook for prefetch data
  const prefetchBillingList = usePrefetch("getBillingList");
  useEffect(() => {
    apiCallFrontAndBackPage(
      billingList,
      rowsPerPage,
      pageNumber,
      prefetchBillingList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingList, pageNumber, prefetchBillingList, rowsPerPage]);

  const tableHeader = [
    "Lead Charge",
    "Raw data module charge",
    "Lead management charge",
    "App management charge",
    "View Details",
  ];
  const { setHeadTitle, headTitle } =
  useContext(LayoutSettingContext);
  useEffect(() => {
      setHeadTitle("Billing of All Forms");
      document.title = "Billing of All Forms";
    }, [headTitle]);
  return (
    <Box sx={{ mx: 2 }} className="client-manager-container custom-component-container-box">
      {isInternalServerError || isSomethingWentWrong ? (
        <Box>
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ display: hideBilling ? "none" : "block" }}>
          {isFetching ? (
            <Box className="loader-container">
              <LeefLottieAnimationLoader width={150} height={150} />
            </Box>
          ) : (
            <Card sx={{ p: 2, mt: 2 }}>
              <CardHeader sx={{ p: 0 }} title={`Total ${totalBilling} List`} />

              <TableContainer
                sx={{ mt: 1 }}
                className="custom-scrollbar"
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>College Name</TableCell>
                      {tableHeader.map((header) => (
                        <TableCell key={header} align="center">
                          {" "}
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allBilling.map((college) => (
                      <TableRow key={college.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {college.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {college.charges_details.lead}
                        </TableCell>
                        <TableCell align="center">
                          {college.charges_details.raw_data_module}
                        </TableCell>
                        <TableCell align="center">
                          {college.charges_details.lead_management_system}
                        </TableCell>
                        <TableCell align="center">
                          {college.charges_details.app_management_system}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => {
                              setSelectedBilling(college.charges_details);
                              setOpenBillingDialog(true);
                            }}
                          >
                            <Tooltip
                              title="View all details"
                              placement="left"
                              arrow
                            >
                              <VisibilityIcon sx={{ color: "#3498ff" }} />
                            </Tooltip>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box className="pagination-container-client-manager">
                <Pagination
                  className="pagination-bar"
                  currentPage={pageNumber}
                  totalCount={rowCount}
                  pageSize={rowsPerPage}
                  onPageChange={(page) =>
                    handleChangePage(page, `formBillingPageNo`, setPageNumber)
                  }
                  count={count}
                />

                <AutoCompletePagination
                  rowsPerPage={rowsPerPage}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={rowCount}
                  page={pageNumber}
                  setPage={setPageNumber}
                  localStorageChangeRowPerPage={`formBillingRowPerPage`}
                  localStorageChangePage={`formBillingPageNo`}
                  setRowsPerPage={setRowsPerPage}
                ></AutoCompletePagination>
              </Box>
            </Card>
          )}
        </Box>
      )}

      <BillingDialog
        open={openBillingDialog}
        selectedBilling={selectedBilling}
        handleClose={() => setOpenBillingDialog(false)}
      />
    </Box>
  );
};

export default Billing;
