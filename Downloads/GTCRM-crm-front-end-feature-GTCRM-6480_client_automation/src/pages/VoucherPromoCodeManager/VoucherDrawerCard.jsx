import {
  Box,
  Drawer,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { voucherDrawerTableHead } from "../../constants/LeadStageList";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import "../../styles/voucherPromocodeManager.css";
import "../../styles/sharedStyles.css";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useToasterHook from "../../hooks/useToasterHook";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import ApplicationHeader from "../../components/userProfile/ApplicationHeader";
import Cookies from "js-cookie";
import {
  useGetVoucherDetailsDataQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const VoucherDrawerCard = ({ userProfileShow, selectedVoucherCode }) => {
  const StyledTableCell = useTableCellDesign();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const [sortColumn, setSortColumn] = useState("");
  const [voucherSortObj, setVoucherSortObj] = useState({});
  const [sortType, setSortType] = useState(null); // asc or dsc or null
  const handleSortColumn = (columnName, arrowActionIcon) => {
    let sort = "";
    let sort_type = "";
    if (sortColumn === columnName) {
      if (sortType === arrowActionIcon) {
        sort = "";
        sort_type = "";
      } else {
        sort = columnName;
        sort_type = arrowActionIcon;
      }
    } else {
      sort = columnName;
      sort_type = arrowActionIcon;
    }
    setSortType(sort_type);
    setSortColumn(sort);
    setVoucherSortObj({
      sort: sort ? true : false,
      sort_name: sort,
      sort_type,
    });
  };

  const copyToClipboard = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      pushNotification("success", "Code copied!");
    } catch (error) {
      pushNotification("error", "Failed to copy");
    }
  };
  const voucherDrawerPageNumber = localStorage.getItem(
    `${Cookies.get("userId")}voucherDrawerSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}voucherDrawerSavePageNo`)
      )
    : 1;

  const voucherDrawerRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}voucherDrawerRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}voucherDrawerRowPerPage`)
      )
    : 5;
  const [pageNumber, setPageNumber] = useState(voucherDrawerPageNumber);
  const [pageSize, setPageSize] = useState(voucherDrawerRowsPerPage);
  const [rowCount, setRowCount] = useState(4);
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  //new Code
  const [userProfileOpen, setUserProfileOpen] = React.useState(false);
  const handleOpenUserProfileDrawer = (key) => {
    setUserProfileOpen(true);
  };
  const [userDetailsStateData, setUserDetailsStateData] = useState({});
  const [voucherLeadData, setVoucherLeadData] = useState([]);
  const [
    voucherDetailsInternalServerError,
    setVoucherDetailsInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInVoucherDetails,
    setSomethingWentWrongInVoucherDetails,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const { data, isSuccess, isFetching, error, isError } =
    useGetVoucherDetailsDataQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      collegeId: collegeId,
      voucherId: selectedVoucherCode?._id,
      payload: Object.keys(voucherSortObj).length > 0 ? voucherSortObj : {},
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setVoucherLeadData(data?.data);
          setRowCount(data?.total);
        } else {
          throw new Error(
            "get all voucher details Data API response has changed"
          );
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setVoucherDetailsInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInVoucherDetails,
        "",
        10000
      );
    }
    // finally{
    //   setIsSkipCallApi(false)
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, data, voucherSortObj]);
  // use react hook for prefetch data
  const prefetchVoucherDataDetailsData = usePrefetch("getVoucherDetailsData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchVoucherDataDetailsData,
      {
        voucherId: selectedVoucherCode?._id,
        payload: Object.keys(voucherSortObj).length > 0 ? voucherSortObj : {},
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, collegeId, voucherSortObj]);
  return (
    <Box className="voucher-drawer-content-box">
      {somethingWentWrongInVoucherDetails ||
      voucherDetailsInternalServerError ? (
        <Box>
          {voucherDetailsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInVoucherDetails && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box
              data-testid="voucher-loader"
              className="voucher-promoCode-loader-container"
            >
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <>
              {voucherLeadData?.length > 0 ? (
                <>
                  <TableContainer
                    sx={{ boxShadow: 0 }}
                    component={Paper}
                    className="custom-scrollbar"
                  >
                    <Table sx={{ minWidth: 360 }} aria-label="customized table">
                      <TableHead>
                        <TableRow
                          sx={{
                            borderBottom: "1px solid rgba(238, 238, 238, 1)",
                          }}
                        >
                          {voucherDrawerTableHead?.map((item, index) => {
                            return (
                              <StyledTableCell
                                key={index}
                                sx={{ whiteSpace: "nowrap" }}
                              >
                                <Box className="voucher-option-with-header-content">
                                  {item?.label}{" "}
                                  {item?.sort && (
                                    <>
                                      {sortColumn === item.value ? (
                                        <SortIndicatorWithTooltip
                                          sortType={sortType}
                                          value={item?.value}
                                          sortColumn={sortColumn}
                                          setSortType={setSortType}
                                          setSortColumn={setSortColumn}
                                          setSortObj={setVoucherSortObj}
                                          addCustomFunction={true}
                                          handleSortCustom={handleSortColumn}
                                        />
                                      ) : (
                                        <SortIndicatorWithTooltip
                                          sortColumn={sortColumn}
                                          setSortType={setSortType}
                                          setSortColumn={setSortColumn}
                                          setSortObj={setVoucherSortObj}
                                          value={item?.value}
                                          addCustomFunction={true}
                                          handleSortCustom={handleSortColumn}
                                        />
                                      )}
                                    </>
                                  )}
                                </Box>
                              </StyledTableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {voucherLeadData?.map((row, index) => (
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                            key={index}
                          >
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Box className="voucher-drawer-code-container">
                                <Typography className="promoCode-value-text-size">
                                  {`${row.code ? row.code : "---"}`}
                                </Typography>
                                {row.code && (
                                  <ContentCopyIcon
                                    onClick={() => copyToClipboard(row.code)}
                                    className="voucher-code-copy-text"
                                    sx={{ fontSize: "16px" }}
                                  />
                                )}
                              </Box>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Typography
                                className={
                                  userProfileShow
                                    ? "promoCode-value-text-size"
                                    : "promoCode-value-text-size"
                                }
                                sx={{
                                  cursor:
                                    userProfileShow &&
                                    row?.application_id !== "NA"
                                      ? "pointer"
                                      : "",
                                  textDecoration:
                                    userProfileShow &&
                                    row?.application_id !== "NA"
                                      ? "underline"
                                      : "",
                                }}
                                onClick={() => {
                                  if (
                                    userProfileShow &&
                                    row?.application_id !== "NA"
                                  ) {
                                    handleOpenUserProfileDrawer();
                                    setUserDetailsStateData({
                                      applicationId: row?.application_id,
                                      studentId: row?.student_id,
                                      eventType: "applied-voucher",
                                    });
                                  }
                                }}
                              >{`${
                                row.student_name ? row.student_name : "---"
                              }`}</Typography>
                              <Typography className="voucher-value-text-size-applicant">{`${
                                row.custom_application_id
                                  ? row.custom_application_id
                                  : "---"
                              }`}</Typography>
                            </StyledTableCell>
                            <StyledTableCell
                              bodyCellPadding={"16px 10px !important"}
                              sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                              align="left"
                            >
                              <Box
                                className={
                                  row.status === "used"
                                    ? "promoCode-unResolved-action"
                                    : "promoCode-resolved-action"
                                }
                              >
                                <Typography className="status-text-promoCode">
                                  <Typography className="status-text-promoCode-text-size">
                                    {row.status}
                                  </Typography>
                                </Typography>
                              </Box>
                            </StyledTableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box
                    className="pagination-container-promoCode"
                    sx={{ mr: "-30px" }}
                  >
                    <Pagination
                      className="pagination-bar"
                      currentPage={pageNumber}
                      page={pageNumber}
                      totalCount={rowCount}
                      pageSize={pageSize}
                      onPageChange={(page) =>
                        handleChangePage(
                          page,
                          `voucherDrawerSavePageNo`,
                          setPageNumber
                        )
                      }
                      count={count}
                    />
                    <AutoCompletePagination
                      rowsPerPage={pageSize}
                      rowPerPageOptions={rowPerPageOptions}
                      setRowsPerPageOptions={setRowsPerPageOptions}
                      rowCount={rowCount}
                      page={pageNumber}
                      setPage={setPageNumber}
                      localStorageChangeRowPerPage={`voucherDrawerRowPerPage`}
                      localStorageChangePage={`voucherDrawerSavePageNo`}
                      setRowsPerPage={setPageSize}
                    ></AutoCompletePagination>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "30vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={250}
                    width={250}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
        </>
      )}

      {/* dreawer user profile */}
      <Drawer
        anchor={"right"}
        open={userProfileOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setUserProfileOpen(false);
        }}
        className="vertical-scrollbar-drawer"
        sx={{ zIndex: 1300 }}
      >
        <Box className="user-profile-control-drawer-box-container">
          <ApplicationHeader
            userDetailsStateData={userDetailsStateData}
            viewProfileButton={true}
            setUserProfileOpen={setUserProfileOpen}
          ></ApplicationHeader>
        </Box>
      </Drawer>
    </Box>
  );
};

export default VoucherDrawerCard;
