import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../../styles/CampaignManager.css";
import "../../styles/sharedStyles.css";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import EditPricingDialog from "./EditPricingDialog";
import { useSelector } from "react-redux";

const BillingFeaturesPricing = ({
  headerDetailsData,
  isFetching,
  somethingWentWrongInBilling,
  billingInternalServerError,
  apiResponseChangeMessage,
  permissions,
}) => {
  const [billingQuickViewData, setBillingQuickViewData] = useState([]);
  const [openAddPricingDialog, setOpenAddPricingDialog] = useState(false);
  useEffect(() => {
    setBillingQuickViewData([
      {
        title: "Lead Cost",
        value: headerDetailsData?.lead_cost
          ? headerDetailsData?.lead_cost.toFixed(2)
          : 0,
      },
      {
        title: "SMS Cost",
        value: headerDetailsData?.sms_cost
          ? headerDetailsData?.sms_cost.toFixed(2)
          : 0,
      },
      {
        title: "What's App Cost",
        value: headerDetailsData?.whatsapp_cost
          ? headerDetailsData?.whatsapp_cost.toFixed(2)
          : 0,
      },
      {
        title: "Email Cost",
        value: headerDetailsData?.email_cost
          ? headerDetailsData?.email_cost.toFixed(2)
          : 0,
      },
      // {
      //   title: "Total Cost(Email+SMS+Whats App+lead",
      //   value: headerDetailsData?.grand_total
      //     ? headerDetailsData?.grand_total.toFixed(2)
      //     : 0,
      // },
      {
        title: "Total Feature Cost",
        value: headerDetailsData?.feature_grand_total
          ? headerDetailsData?.feature_grand_total.toFixed(2)
          : 0,
      },
    ]);
  }, [headerDetailsData]);
  const [createdCollegeId, setCreatedCollegeId] = useState();
  const userId = useSelector((state) => state.authentication.token?.user_id);
  useEffect(() => {
    if (!createdCollegeId) {
      const storedCollegeId = localStorage.getItem(`${userId}createdCollegeId`);
      if (storedCollegeId) {
        setCreatedCollegeId(storedCollegeId);
      }
    }
  }, [createdCollegeId]);
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
                  {permissions?.["aefd607c"]?.features?.["ee598d8b"]
                    ?.features?.["8909688a"]?.visibility && (
                    <Box className="scoreboard-filter-box">
                      <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={() => {
                          setOpenAddPricingDialog(true);
                        }}
                      >
                        Edit Pricing
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
      {openAddPricingDialog && (
        <EditPricingDialog
          open={openAddPricingDialog}
          setOpen={setOpenAddPricingDialog}
          collegeId={createdCollegeId}
          clientId={userId}
        />
      )}
    </Box>
  );
};

export default BillingFeaturesPricing;
