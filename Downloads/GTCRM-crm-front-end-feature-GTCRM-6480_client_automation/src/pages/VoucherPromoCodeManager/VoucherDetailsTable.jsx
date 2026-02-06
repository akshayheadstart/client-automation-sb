/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Button,
  Card,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { useSelector } from "react-redux";
import {
  useDeletePromoCodeInfoMutation,
  useGetVoucherDetailsTableQuery,
  usePrefetch,
  useUpdateVoucherInfoMutation,
} from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/ApplicationManagerTable.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import PromoCodeHeader from "./PromoCodeHeader";
import VoucherDrawerCard from "./VoucherDrawerCard";
import VoucherTable from "./VoucherTable";
import EditIcon from "@mui/icons-material/Edit";
import VoucherDetailsPreview from "./VoucherDetailsPreview";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const VoucherDetailsTable = ({ handlePromoCodeVoucherOpen }) => {
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const [filterDateValue, setFilterDateValue] = useState([]);
  const voucherPageNumber = localStorage.getItem(
    `${Cookies.get("userId")}voucherSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}voucherSavePageNo`)
      )
    : 1;

  const voucherRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}voucherRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}voucherRowPerPage`)
      )
    : 5;
  const [pageNumber, setPageNumber] = useState(voucherPageNumber);
  const [pageSize, setPageSize] = useState(voucherRowsPerPage);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [openConfirmStatusDialog, setOpenConfirmStatusDialog] = useState(false);
  const [voucherDrawerOpen, setVoucherDrawerOpen] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState({});

  //get voucher table data API implementation
  const [
    somethingWentWrongInVoucherDetails,
    setSomethingWentWrongInVoucherDetails,
  ] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [isSkipCallApi, setIsSkipCallApi] = useState(false);
  useEffect(() => {
    if (isSkipCallApi) {
      setSelectedCourseIds(selectedCourseId);
    }
  }, [isSkipCallApi]);
  const [
    voucherDetailsInternalServerError,
    setVoucherDetailsInternalServerError,
  ] = useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [voucherData, setVoucherData] = useState([]);
  const pushNotification = useToasterHook();
  const [selectedVoucherId, setSelectedVoucherId] = useState([]);
  const [selectedVoucherList, setSelectedVoucherList] = useState([]);
  const voucherTablePayload = {
    date_range:
      filterDateValue?.length > 0 ? GetFormatDate(filterDateValue) : null,
    program_name: selectedCourseIds,
  };
  const { data, isSuccess, isFetching, error, isError } =
    useGetVoucherDetailsTableQuery({
      pageNumber: pageNumber,
      rowsPerPage: pageSize,
      payload: voucherTablePayload,
      collegeId: collegeId,
      featureKey: "2bf8b3f2",
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setVoucherData(data?.data);
          setSelectedVoucherList([]);
          setSelectedVoucherId([]);
        } else {
          throw new Error("get voucher API response has changed");
        }
      }
      if (isError) {
        setVoucherData([]);
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
    } finally {
      setIsSkipCallApi(false);
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
  const prefetchVoucherDataDetailsData = usePrefetch("getVoucherDetailsTable");
  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      pageSize,
      pageNumber,
      collegeId,
      prefetchVoucherDataDetailsData,
      {
        payload: voucherTablePayload,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, pageNumber, pageSize, collegeId]);
  const [selectedVoucherInfo, setSelectedVoucherInfo] = useState({});
  //{Voucher Status update}
  const [
    updateVoucherInternalServerError,
    setUpdateVoucherInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInUpdateVoucher,
    setSomethingWentWrongInUpdateVoucher,
  ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateVoucherInfo] = useUpdateVoucherInfoMutation();
  const handleUpdatePromoCodeStatus = () => {
    setLoading(true);
    updateVoucherInfo({
      collegeId: collegeId,
      voucherId: selectedVoucherInfo?._id,
      payload: {
        status: true,
        status_value:
          selectedVoucherInfo?.status === "Active" ? "Inactive" : "Active",
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
              pushNotification("success", "Voucher Status Update Successful");
              setOpenConfirmStatusDialog(false);
            } else {
              throw new Error("Updated voucher API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdateVoucher,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdateVoucherInternalServerError,
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
      }/promocode_vouchers/get_vouchers/?page_num=1&page_size=5&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify({ download: true }))
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

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;
  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);
  const [openPreviewVoucher, setPreviewVoucher] = React.useState(false);
  const handleVoucherPreviewOpen = () => {
    setPreviewVoucher(true);
  };

  const handleVoucherPreviewClose = () => {
    setPreviewVoucher(false);
  };

  const [allUpcoming, setAllUpcoming] = useState(false);
  useEffect(() => {
    if (selectedVoucherList?.length > 0) {
      const upcoming = selectedVoucherList?.every(
        (item) => item.status === "Upcoming"
      );
      setAllUpcoming(upcoming);
    }
  }, [selectedVoucherList]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  //delete Voucher
  const [deleteVoucherInfo] = useDeletePromoCodeInfoMutation();
  const handleDeleteVoucherInfo = () => {
    setLoading(true);
    deleteVoucherInfo({
      collegeId: collegeId,
      promoCode: false,
      payload: selectedVoucherId,
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
              pushNotification("success", "Deleted Voucher Success");
              setSelectedVoucherList([]);
              setSelectedVoucherId([]);
            } else {
              throw new Error("Deleted Voucher API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUpdateVoucher,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setUpdateVoucherInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(false);
        setOpenConfirmDeleteDialog(false);
      });
  };

  return (
    <Box className="promoCode-details-table-box">
      <PromoCodeHeader
        filterDateValue={filterDateValue}
        setFilterDateValue={setFilterDateValue}
        title={"Voucher Details"}
        handlePromoCodeVoucherOpen={() => handlePromoCodeVoucherOpen("Voucher")}
        programDisabled={false}
        setSelectedCourseId={setSelectedCourseId}
        selectedCourseId={selectedCourseId}
        createButtonText={"Create Voucher"}
        createButtonShow={true}
        setIsSkipCallApi={setIsSkipCallApi}
        handleDownloadData={() => handleChartDownload()}
        setPageNumber={setPageNumber}
        downloadLoading={downloadLoading}
      />
      <Box className="voucher-promoCode-table-box-container">
        {somethingWentWrongInVoucherDetails ||
        voucherDetailsInternalServerError ||
        somethingWentWrongInUpdateVoucher ||
        updateVoucherInternalServerError ||
        downloadInternalServerError ||
        somethingWentWrongInDownload ? (
          <Box>
            {(voucherDetailsInternalServerError ||
              updateVoucherInternalServerError ||
              downloadInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInVoucherDetails ||
              somethingWentWrongInUpdateVoucher ||
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
                {voucherData?.length > 0 ? (
                  <>
                    <VoucherTable
                      voucherData={voucherData}
                      setVoucherDrawerOpen={setVoucherDrawerOpen}
                      setSelectedVoucherCode={setSelectedVoucherCode}
                      setOpenConfirmStatusDialog={setOpenConfirmStatusDialog}
                      setSelectedVoucherInfo={setSelectedVoucherInfo}
                      selectedVoucherId={selectedVoucherId}
                      setSelectedVoucherId={setSelectedVoucherId}
                      selectedVoucherList={selectedVoucherList}
                      setSelectedVoucherList={setSelectedVoucherList}
                    />
                    <Box
                      className="pagination-container-promoCode"
                      ref={paginationRef}
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
                            `voucherSavePageNo`,
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
                        localStorageChangeRowPerPage={`voucherRowPerPage`}
                        localStorageChangePage={`voucherSavePageNo`}
                        setRowsPerPage={setPageSize}
                      ></AutoCompletePagination>
                    </Box>
                    {selectedVoucherId?.length > 0 && (
                      <Box className="lead-action-container">
                        <Box className="lead-action-wrapper">
                          <Card
                            className={`lead-action-card ${
                              isScrolledToPagination ? "move-up" : "move-down"
                            }`}
                          >
                            <Box className="lead-action-content-container">
                              <Box className="lead-action-content">
                                <Typography variant="subtitle1">
                                  {selectedVoucherId?.length} selected
                                </Typography>
                              </Box>
                              <Box className="voucher-action-content">
                                <Button
                                  onClick={() => {
                                    setOpenConfirmDeleteDialog(true);
                                  }}
                                  className="voucher-action-button-box"
                                  variant="text"
                                  startIcon={
                                    <DeleteOutlineIcon
                                      color="info"
                                      sx={{
                                        fontSize: "18px",
                                        color: !allUpcoming
                                          ? "rgba(55, 65, 81, 0.26)"
                                          : "#008BE2",
                                      }}
                                    />
                                  }
                                  disabled={!allUpcoming}
                                >
                                  Delete
                                </Button>
                              </Box>
                              <Box className="voucher-action-content">
                                <Button
                                  onClick={() => {
                                    handleVoucherPreviewOpen();
                                  }}
                                  className="voucher-action-button-box"
                                  variant="text"
                                  startIcon={
                                    <EditIcon
                                      sx={{
                                        fontSize: "18px",
                                        color:
                                          selectedVoucherId?.length > 1
                                            ? "rgba(55, 65, 81, 0.26)"
                                            : "#008BE2",
                                      }}
                                    />
                                  }
                                  disabled={selectedVoucherId?.length > 1}
                                >
                                  Edit
                                </Button>
                              </Box>
                            </Box>
                          </Card>
                        </Box>
                      </Box>
                    )}
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
      {/* dreawer voucher */}
      <Drawer
        anchor={"right"}
        open={voucherDrawerOpen}
        disableEnforceFocus={true}
        onClose={() => {
          setVoucherDrawerOpen(false);
        }}
        className="vertical-scrollbar-drawer"
      >
        <Box className="voucher-drawer-box-container">
          <Box className="voucher-drawer-box-top">
            <Typography className="voucher-drawer-headline-text">
              Voucher Details | {selectedVoucherCode?.name}
            </Typography>
            <IconButton>
              <CloseIcon
                sx={{ cursor: "pointer" }}
                onClick={() => setVoucherDrawerOpen(false)}
              />
            </IconButton>
          </Box>
          <Box>
            <VoucherDrawerCard
              userProfileShow={true}
              selectedVoucherCode={selectedVoucherCode}
            />
          </Box>

          <Box sx={{ my: "15px", display: "grid", placeItems: "center" }}>
            <Button
              sx={{ borderRadius: 50 }}
              variant="contained"
              size="medium"
              color="info"
              className={"view-profile-button"}
              onClick={() => setVoucherDrawerOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
      <DeleteDialogue
        title={"Are you sure , you want to Update Status?"}
        openDeleteModal={openConfirmStatusDialog}
        handleDeleteSingleTemplate={() => handleUpdatePromoCodeStatus()}
        handleCloseDeleteModal={() => setOpenConfirmStatusDialog(false)}
        loading={loading}
      />
      {openPreviewVoucher && (
        <VoucherDetailsPreview
          openPreviewVoucher={openPreviewVoucher}
          handleVoucherPreviewClose={handleVoucherPreviewClose}
          selectedVoucherList={
            selectedVoucherList.length > 0 ? selectedVoucherList[0] : {}
          }
          setSelectedVoucherId={setSelectedVoucherId}
          setSelectedVoucherList={setSelectedVoucherList}
          selectedVoucherId={selectedVoucherId}
        />
      )}
      <DeleteDialogue
        title={"Are you sure , you want to Delete Voucher?"}
        openDeleteModal={openConfirmDeleteDialog}
        handleDeleteSingleTemplate={() => handleDeleteVoucherInfo()}
        handleCloseDeleteModal={() => setOpenConfirmDeleteDialog(false)}
        loading={loading}
      />
    </Box>
  );
};

export default VoucherDetailsTable;
