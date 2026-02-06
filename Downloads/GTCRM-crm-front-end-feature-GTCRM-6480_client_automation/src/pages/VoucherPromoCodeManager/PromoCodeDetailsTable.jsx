/* eslint-disable react-hooks/exhaustive-deps */
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Button,
  Drawer,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetPromoCodeDetailsTableQuery,
  usePrefetch,
  useUpdatePromoCodeInfoMutation,
} from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { promoCodeTableHead } from "../../constants/LeadStageList";
import { handleChangePage } from "../../helperFunctions/pagination";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import AppliedPromoCodeDrawer from "./AppliedPromoCodeDrawer";
import PromoCodePreview from "./PromoCodePreview";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import {
  customFetch,
  dateWithOutTime,
} from "../StudentTotalQueries/helperFunction";
import PromoCodeHeader from "./PromoCodeHeader";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const PromoCodeDetailsTable = ({ handlePromoCodeVoucherOpen }) => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { selectedSeason } = useContext(LayoutSettingContext);
  const [filterDateValue, setFilterDateValue] = useState([]);

  const promoCodePageNumber = localStorage.getItem(
    `${Cookies.get("userId")}promoCodeSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}promoCodeSavePageNo`)
      )
    : 1;
  const promoCodeRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}promoCodeRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}promoCodeRowPerPage`)
      )
    : 5;
  const StyledTableCell = useTableCellDesign();
  const [pageNumber, setPageNumber] = useState(promoCodePageNumber);
  const [pageSize, setPageSize] = useState(promoCodeRowsPerPage);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [openConfirmStatusDialog, setOpenConfirmStatusDialog] = useState(false);
  const [openPreviewPromoCode, setPreviewPromoCodeOpen] = React.useState(false);
  const handlePromoCodePreviewOpen = () => {
    setPreviewPromoCodeOpen(true);
  };

  const handlePromoCodePreviewClose = () => {
    setPreviewPromoCodeOpen(false);
  };
  const [selectAppliedDrawerOpen, setSelectAppliedDrawerOpen] = useState(false);
  // promoCode details table get API implementation
  const [
    somethingWentWrongInPromoCodeDetails,
    setSomethingWentWrongInPromoCodeDetails,
  ] = useState(false);
  const [
    promoCodeDetailsInternalServerError,
    setPromoCodeDetailsInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [promoCodeData, setPromoCodeData] = useState([]);
  const pushNotification = useToasterHook();
  const promoCodeTablePayload = {
    date_range:
      filterDateValue?.length > 0 ? GetFormatDate(filterDateValue) : null,
    season: selectedSeason && JSON.parse(selectedSeason)?.season_id,
  };
  const { data, isSuccess, isFetching, error, isError } =
    useGetPromoCodeDetailsTableQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: promoCodeTablePayload,
      collegeId: collegeId,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setPromoCodeData(data?.data);
        } else {
          throw new Error("get all Event API response has changed");
        }
      }
      if (isError) {
        setPromoCodeData([]);
        // setAPICallAgain(false)
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
          // setAPICallAgain(false)
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setPromoCodeDetailsInternalServerError,
            "",
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInPromoCodeDetails,
        "",
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSuccess,
    data?.data,
    error,
    isError,
    error?.data?.detail,
    error?.status,
  ]);
  // use react hook for prefetch data
  const prefetchPromoCodeDataDetailsData = usePrefetch(
    "getPromoCodeDetailsTable"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchPromoCodeDataDetailsData,
      {
        payload: promoCodeTablePayload,
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, collegeId]);
  const [selectedPromoCodeInfo, setSelectedPromoCodeInfo] = useState({});
  //{Promocode Status update}
  const [
    updatePromoCodeInternalServerError,
    setUpdatePromoCodeInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInUpdatePromoCode,
    setSomethingWentWrongInUpdatePromoCode,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatePromoCodeInfo] = useUpdatePromoCodeInfoMutation();
  const handleUpdatePromoCodeStatus = () => {
    setLoading(true);
    updatePromoCodeInfo({
      collegeId: collegeId,
      promoCodeId: selectedPromoCodeInfo?._id,
      payload: {
        status: true,
        status_value:
          selectedPromoCodeInfo?.status === "Active" ? "Inactive" : "Active",
      },
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", "promoCode Status Update Successful");
              setOpenConfirmStatusDialog(false);
            } else {
              throw new Error("Updated promoCode API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdatePromoCode,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdatePromoCodeInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  //download promoCode
  const [somethingWentWrongInDownload, setSomethingWentWrongInDownload] =
    useState(false);
  const [downloadInternalServerError, setDownloadInternalServerError] =
    useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const handleChartDownload = () => {
    setDownloadLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/promocode_vouchers/get_promocodes/?page_num=1&page_size=5&college_id=${collegeId}`,
      ApiCallHeaderAndBody(
        token,
        "POST",
        JSON.stringify({
          download: true,
          season: selectedSeason?.season_id,
        })
      )
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.file_url) {
          const expectedData = data?.file_url;
          try {
            if (typeof expectedData === "string") {
              window.open(data?.file_url);
              pushNotification("success", data?.message);
            } else {
              throw new Error("download_data API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setSomethingWentWrongInDownload, "", 5000);
          }
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        handleInternalServerError(setDownloadInternalServerError, "", 5000);
      })
      .finally(() => {
        setDownloadLoading(false);
      });
  };
  return (
    <Box className="promoCode-details-table-box">
      <PromoCodeHeader
        filterDateValue={filterDateValue}
        setFilterDateValue={setFilterDateValue}
        title={"PromoCode Details"}
        handlePromoCodeVoucherOpen={() =>
          handlePromoCodeVoucherOpen("PromoCode")
        }
        programDisabled={true}
        createButtonText={"Create PromoCode"}
        createButtonShow={true}
        handleDownloadData={() => handleChartDownload()}
        setPageNumber={setPageNumber}
        downloadLoading={downloadLoading}
      />
      <Box className="voucher-promoCode-table-box-container">
        {somethingWentWrongInPromoCodeDetails ||
        promoCodeDetailsInternalServerError ||
        somethingWentWrongInUpdatePromoCode ||
        updatePromoCodeInternalServerError ||
        somethingWentWrongInDownload ||
        downloadInternalServerError ? (
          <Box>
            {(promoCodeDetailsInternalServerError ||
              updatePromoCodeInternalServerError ||
              downloadInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInPromoCodeDetails ||
              somethingWentWrongInUpdatePromoCode ||
              somethingWentWrongInDownload) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {isFetching ? (
              <Box className="voucher-promoCode-loader-container">
                <LeefLottieAnimationLoader width={100} height={100} />
              </Box>
            ) : (
              <>
                {promoCodeData?.length > 0 ? (
                  <>
                    <TableContainer
                      sx={{ boxShadow: 0 }}
                      component={Paper}
                      className="custom-scrollbar"
                    >
                      <Table
                        sx={{ minWidth: 700 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                          >
                            {promoCodeTableHead?.map((item, index) => {
                              return (
                                <StyledTableCell
                                  key={index}
                                  className={
                                    index === 0
                                      ? "table-cell-fixed student-queries-table-head-text"
                                      : "student-queries-table-head-text"
                                  }
                                  sx={{ whiteSpace: "nowrap" }}
                                  align={item?.align ? "center" : "left"}
                                >
                                  {item?.label}
                                </StyledTableCell>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {promoCodeData?.map((row, index) => (
                            <TableRow
                              sx={{
                                borderBottom:
                                  "1px solid rgba(238, 238, 238, 1)",
                              }}
                              key={index}
                            >
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                className="table-cell-fixed"
                                component="th"
                                scope="row"
                              >
                                {row?.code ? (
                                  <Box
                                    sx={{ minWidth: "50px" }}
                                    onClick={() => {
                                      handlePromoCodePreviewOpen();
                                      setSelectedPromoCodeInfo(row);
                                    }}
                                  >
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {`For ${row?.discount}% ${
                                            row?.name ? row?.name : "N/A"
                                          }`}
                                        </div>
                                      }
                                      component={
                                        <Button className="promoCode-value-text-size">
                                          {row?.code ? row?.code : "---"}
                                        </Button>
                                      }
                                      color={true}
                                      placement={"right"}
                                    />
                                  </Box>
                                ) : (
                                  <Button className="promoCode-value-text-size">
                                    {row?.code ? row?.code : "---"}
                                  </Button>
                                )}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="center"
                              >
                                <Typography className="promoCode-value-text-size">{`${
                                  row.discount ? row.discount : "0"
                                }%`}</Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="center"
                              >
                                <Typography
                                  className={
                                    row.applied_count > 0
                                      ? "promoCode-value-text-size promoCode-value-hover"
                                      : "promoCode-value-text-size"
                                  }
                                  onClick={() => {
                                    if (row.applied_count > 0) {
                                      setSelectAppliedDrawerOpen(true);
                                      setSelectedPromoCodeInfo(row);
                                    }
                                  }}
                                >
                                  {row.applied_count
                                    ? row.applied_count
                                    : "---"}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="center"
                              >
                                <Typography className="promoCode-value-text-size">
                                  {row.estimated_cost
                                    ? row.estimated_cost.toFixed(2)
                                    : "---"}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="center"
                              >
                                <Typography className="promoCode-value-text-size">{`${
                                  row?.available ? row?.available : "0"
                                } | ${
                                  row?.total_units ? row?.total_units : "---"
                                }`}</Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                {row.start_date
                                  ? `${dateWithOutTime(
                                      row?.start_date
                                    )} - ${dateWithOutTime(row?.end_date)}`
                                  : "---"}
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Box
                                  className={
                                    row.status === "Upcoming" ||
                                    row.status === "Active"
                                      ? "promoCode-resolved-action"
                                      : "promoCode-unResolved-action"
                                  }
                                  sx={{
                                    cursor:
                                      row.status === "Inactive" ||
                                      row.status === "Active"
                                        ? "pointer"
                                        : "",
                                  }}
                                  onClick={() => {
                                    if (
                                      row.status === "Inactive" ||
                                      row.status === "Active"
                                    ) {
                                      setOpenConfirmStatusDialog(true);
                                      setSelectedPromoCodeInfo(row);
                                    }
                                  }}
                                >
                                  <Typography className="status-text-promoCode">
                                    <Typography className="status-text-promoCode-text-size">
                                      {row.status}
                                    </Typography>
                                    {(row.status === "Inactive" ||
                                      row.status === "Active") && (
                                      <ArrowDropDownIcon
                                        sx={{ fontSize: "20px" }}
                                      />
                                    )}
                                  </Typography>
                                </Box>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box className="pagination-container-promoCode">
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        page={pageNumber}
                        totalCount={rowCount}
                        pageSize={pageSize}
                        onPageChange={(page) =>
                          handleChangePage(
                            page,
                            `promoCodeSavePageNo`,
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
                        localStorageChangeRowPerPage={`promoCodeRowPerPage`}
                        localStorageChangePage={`promoCodeSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "55vh",
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
      </Box>
      <DeleteDialogue
        title={"Are you sure , you want to Update Status?"}
        openDeleteModal={openConfirmStatusDialog}
        handleDeleteSingleTemplate={() => handleUpdatePromoCodeStatus()}
        handleCloseDeleteModal={() => setOpenConfirmStatusDialog(false)}
        loading={loading}
      />
      {openPreviewPromoCode && (
        <PromoCodePreview
          handlePromoCodePreviewClose={handlePromoCodePreviewClose}
          openPreviewPromoCode={openPreviewPromoCode}
          selectedPromoCodeInfo={selectedPromoCodeInfo}
          setSelectAppliedDrawerOpen={setSelectAppliedDrawerOpen}
          // selectedPreviewPromoCode={selectedPreviewPromoCode}
        />
      )}

      {/* drawer applied user */}
      <Drawer
        anchor={"right"}
        open={selectAppliedDrawerOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setSelectAppliedDrawerOpen(false);
        }}
        className="vertical-scrollbar-drawer"
      >
        <Box className="voucher-drawer-box-container">
          <Box>
            <AppliedPromoCodeDrawer
              setSelectAppliedDrawerOpen={setSelectAppliedDrawerOpen}
              selectedPromoCodeInfo={selectedPromoCodeInfo}
            />
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default PromoCodeDetailsTable;
