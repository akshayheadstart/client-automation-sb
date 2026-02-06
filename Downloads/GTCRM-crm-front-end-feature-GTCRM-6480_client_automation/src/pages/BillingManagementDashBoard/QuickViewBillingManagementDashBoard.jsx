import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../styles/CampaignManager.css";
import "../../styles/sharedStyles.css";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import { SelectPicker } from "rsuite";
import { useGetListCollegeQuery } from "../../Redux/Slices/clientOnboardingSlice";
const QuickViewBillingManagementDashBoard = ({
  headerDetailsData,
  isFetching,
  somethingWentWrongInBilling,
  billingInternalServerError,
  apiResponseChangeMessage,
}) => {
  const [billingQuickViewData, setBillingQuickViewData] = useState([]);
  useEffect(() => {
    setBillingQuickViewData([
      {
        title: "Lead Count",
        value: `${
          headerDetailsData?.lead_count ? headerDetailsData?.lead_count : 0
        }/${headerDetailsData?.lead_limit ? headerDetailsData?.lead_limit : 0}`,
      },
      {
        title: "SMS Sent Count",
        value: headerDetailsData?.sms_count ? headerDetailsData?.sms_count : 0,
      },
      {
        title: "What's App Sent Count",
        value: headerDetailsData?.whatsapp_count
          ? headerDetailsData?.whatsapp_count
          : 0,
      },
      {
        title: "Email Sent Count",
        value: headerDetailsData?.email_cost
          ? headerDetailsData?.email_cost
          : 0,
      },
    ]);
  }, [headerDetailsData]);
  return (
    <Box className="campaign-manager-dashboard-box" sx={{ mt: 1 }}>
      {isFetching ? (
        <Box
          className="loading-animation-box"
          data-testid="loading-animation-container"
        >
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>
        </Box>
      ) : (
        <>
          {billingInternalServerError || somethingWentWrongInBilling ? (
            <Box>
              {billingInternalServerError && (
                <Error500Animation height={200} width={200}></Error500Animation>
              )}
              {somethingWentWrongInBilling && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ p: 0 }} className="score-board-card-content">
              <Box className="score-board-card-content-inside">
                <Box sx={{ px: 0, pt: 0 }} className="scoreboard-list-wrapper">
                  {billingQuickViewData?.map((data, index) => (
                    <>
                      <Box className={"campaign-quick-header-box"}>
                        <Box>
                          <Typography className="scoreboard-title-design">
                            {data?.title}
                          </Typography>
                        </Box>
                        <Box className={"scoreboard"}>
                          <Box className="indicator-text-box">
                            <Typography
                              color="#333333"
                              className="scoreboard-value-text"
                              mr={0.5}
                            >
                              {data?.value ? data?.value : 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {index === billingQuickViewData?.length - 1 || (
                        <Box className="scoreboard-header-vertical-line"></Box>
                      )}
                    </>
                  ))}
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default QuickViewBillingManagementDashBoard;
