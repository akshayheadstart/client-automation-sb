/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Drawer, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetVoucherDetailsTableQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";

import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import PromoCodeHeader from "../VoucherPromoCodeManager/PromoCodeHeader";
import VoucherDrawerCard from "../VoucherPromoCodeManager/VoucherDrawerCard";
import VoucherTable from "../VoucherPromoCodeManager/VoucherTable";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const VoucherManagerForPublisher = () => {
  const [selectedCourseId, setSelectedCourseId] = useState([]);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Voucher Manager Head Title add
  useEffect(() => {
    setHeadTitle("Voucher Manager");
    document.title = "Voucher Manager";
  }, [headTitle]);

  const [filterDateValue, setFilterDateValue] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [rowCount, setRowCount] = useState(4);
  const count = Math.ceil(rowCount / pageSize);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
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
      featureKey: "ccbb2d7a",
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setRowCount(data?.total);
          setVoucherData(data?.data);
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
  //download promoCode
  const [somethingWentWrongInDownload, setSomethingWentWrongInDownload] =
    useState(false);
  const [downloadInternalServerError, setDownloadInternalServerError] =
    useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
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
  return (
    <Box sx={{ mx: 3, mb: 3 }} className="custom-component-container-box">
      <Box className="promoCode-details-table-box">
        <PromoCodeHeader
          filterDateValue={filterDateValue}
          setFilterDateValue={setFilterDateValue}
          title={"Voucher Details"}
          createButtonShow={false}
          setSelectedCourseId={setSelectedCourseId}
          selectedCourseId={selectedCourseId}
          handleDownloadData={() => handleChartDownload()}
          setIsSkipCallApi={setIsSkipCallApi}
          setPageNumber={setPageNumber}
          downloadLoading={downloadLoading}
        />
        <Box className="voucher-promoCode-table-box-container">
          {somethingWentWrongInVoucherDetails ||
          voucherDetailsInternalServerError ||
          downloadInternalServerError ||
          somethingWentWrongInDownload ? (
            <Box>
              {(voucherDetailsInternalServerError ||
                downloadInternalServerError) && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {(somethingWentWrongInVoucherDetails ||
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
                        voucher={true}
                      />
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
              <VoucherDrawerCard selectedVoucherCode={selectedVoucherCode} />
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
      </Box>
    </Box>
  );
};

export default VoucherManagerForPublisher;
