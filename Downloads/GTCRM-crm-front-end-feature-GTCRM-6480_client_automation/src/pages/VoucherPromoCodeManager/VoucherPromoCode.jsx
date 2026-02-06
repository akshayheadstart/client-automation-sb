/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import CreatePromoCodeVoucherDialog from "./CreatePromoCodeVoucherDialog";
import PromoCodeDetailsTable from "./PromoCodeDetailsTable";
import VoucherDetailsTable from "./VoucherDetailsTable";
import VoucherPromoCodeQuickView from "./VoucherPromoCodeQuickView";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { GetFormatDate } from "../../hooks/GetJsonDate";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { customFetch } from "../StudentTotalQueries/helperFunction";

const VoucherPromoCodeManager = () => {
  const [openCreatePromoCodeVoucher, setCreatePromoCodeVoucherOpen] =
    React.useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const { setHeadTitle, headTitle, selectedSeason } =
    useContext(LayoutSettingContext);
  //Voucher/PromoCode Manager Head Title add
  useEffect(() => {
    setHeadTitle("Voucher/PromoCode Manager");
    document.title = "Voucher/PromoCode Manager";
  }, [headTitle]);
  const [value, setValue] = React.useState("PromoCode");
  const handlePromoCodeVoucherOpen = (data) => {
    setCreatePromoCodeVoucherOpen(true);
    setValue(data);
  };

  const handlePromoCodeVoucherClose = () => {
    setCreatePromoCodeVoucherOpen(false);
    setValue("");
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [
    somethingWentWrongInHeaderDetails,
    setSomethingWentWrongInHeaderDetails,
  ] = useState(false);
  const [
    headerDetailsInternalServerError,
    setHeaderDetailsInternalServerError,
  ] = useState(false);
  const pushNotification = useToasterHook();
  const [voucherPromoCodeDate, setVoucherPromoCodeDate] = useState([]);
  const [headerDetailsData, setHeaderDetailsData] = useState({});
  const [voucherPromoCodeIndicator, setVoucherPromoCodeIndicator] =
    useState(null);
  const [headerLoading, setheaderLoading] = useState(false);
  const [hideHeaderDetails, setHideHeaderDetails] = useState(false);
  const dateHeaderRangeObject = {
    date_range:
      voucherPromoCodeDate?.length > 0
        ? GetFormatDate(voucherPromoCodeDate)
        : null,
    season: selectedSeason && JSON.parse(selectedSeason)?.season_id,
  };

  useEffect(() => {
    setheaderLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/promocode_vouchers/get_quick_view/?change_indicator=${
        voucherPromoCodeIndicator ? voucherPromoCodeIndicator : "last_7_days"
      }&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(dateHeaderRangeObject))
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data) {
          try {
            setHeaderDetailsData(data?.data);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInHeaderDetails,
              setHideHeaderDetails,
              10000
            );
          }
        } else if (data.detail) {
          pushNotification("error", data.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(
          setHeaderDetailsInternalServerError,
          setHideHeaderDetails,
          10000
        );
      })
      .finally(() => {
        setheaderLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucherPromoCodeDate, voucherPromoCodeIndicator]);
  return (
    <Box sx={{ mx: 3, mb: 3 }} className="custom-component-container-box">
      {headerLoading ? (
        <Box
          sx={{
            width: "100%",
            minHeight: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          data-testid="loading-animation-container"
        >
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <Box>
          {somethingWentWrongInHeaderDetails ||
          headerDetailsInternalServerError ? (
            <Box>
              {headerDetailsInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInHeaderDetails && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box
              sx={{
                visibility: hideHeaderDetails ? "hidden" : "visible",
              }}
            >
              {Object.keys(headerDetailsData).length > 0 ? (
                <VoucherPromoCodeQuickView
                  setVoucherPromoCodeDate={setVoucherPromoCodeDate}
                  voucherPromoCodeDate={voucherPromoCodeDate}
                  setVoucherPromoCodeIndicator={setVoucherPromoCodeIndicator}
                  voucherPromoCodeIndicator={voucherPromoCodeIndicator}
                  headerDetailsData={headerDetailsData}
                />
              ) : (
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              )}
            </Box>
          )}
        </Box>
      )}

      <PromoCodeDetailsTable
        handlePromoCodeVoucherOpen={handlePromoCodeVoucherOpen}
      />
      <VoucherDetailsTable
        handlePromoCodeVoucherOpen={handlePromoCodeVoucherOpen}
      />
      {openCreatePromoCodeVoucher && (
        <CreatePromoCodeVoucherDialog
          openCreatePromoCodeVoucher={openCreatePromoCodeVoucher}
          handlePromoCodeVoucherClose={handlePromoCodeVoucherClose}
          value={value}
          setValue={setValue}
        />
      )}
    </Box>
  );
};

export default VoucherPromoCodeManager;
