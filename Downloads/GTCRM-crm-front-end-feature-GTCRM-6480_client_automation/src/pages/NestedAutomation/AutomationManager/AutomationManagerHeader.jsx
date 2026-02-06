import { Button, Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import HorizontalCharts from "../../../components/CustomCharts/HorizontalCharts";
import { SelectPicker } from "rsuite";
import {
  automationDataTypeFilter,
  automationStatusFilter,
} from "../../../constants/LeadStageList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetAutomationManagerHeaderDataQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";

function AutomationManagerHeader() {
  const [headerDetails, setHeaderDetails] = useState([]);
  const [automationStatus, setAutomationStatus] = useState("");
  const [automationDataType, setAutomationDataType] = useState("");

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const theme = useTheme();
  const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();

  const { data, isError, error, isFetching, isSuccess } =
    useGetAutomationManagerHeaderDataQuery({
      collegeId,
      automationDataType,
      automationStatus,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object") {
          const headerData = [
            {
              title: "Total Automation",
              value: data?.data?.total_automation || 0,
              chartsData: [
                {
                  plotName: "Saved",
                  value: data?.data?.saved_automation || 0,
                  color: "#11BED2",
                },
                {
                  plotName: "Active",
                  value: data?.data?.active_automation || 0,
                  color: "#008BE2",
                },
                {
                  plotName: "Stopped",
                  value: data?.data?.stopped_automation || 0,
                  color: "#00465F",
                },
              ],
            },
            {
              title: "Total Communication",
              value: data?.data?.total_communication || 0,
              chartsData: [
                {
                  plotName: "Whatsapp",
                  value: data?.data?.whatsapp_communication || 0,
                  color: "#11BED2",
                },
                {
                  plotName: "Email",
                  value: data?.data?.email_communication || 0,
                  color: "#008BE2",
                },
                {
                  plotName: "SMS",
                  value: data?.data?.sms_communication || 0,
                  color: "#00465F",
                },
              ],
            },
            {
              title: "SMS Delivery Rate",
              value: `${data?.data?.sms_delivery_rate}%`,
            },
            {
              title: "Whatsapp Delivery Rate",
              value: `${data?.data?.whatsapp_delivery_rate}%`,
            },
            {
              title: "Email Delivery Rate",
              value: `${data?.data?.email_delivery_rate}%`,
            },
          ];
          setHeaderDetails(headerData);
        } else {
          throw new Error("Tag list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideHeader,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideHeader, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, error, isSuccess]);

  return (
    <Card
      sx={{ display: hideHeader ? "none" : "" }}
      className="common-box-shadow automation-header-card"
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "25vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <>
              <Box
                sx={{ minHeight: "10vh" }}
                className="common-not-found-container"
              >
                <LeefLottieAnimationLoader
                  height={100}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                flexDirection: mediumScreen ? "column" : "row",
                alignItems: mediumScreen ? "flex-start" : "center",
              }}
              className="automation-manager-header-container"
            >
              {headerDetails.map((details, index) => (
                <>
                  <Box sx={{ flex: 200, width: "100%" }}>
                    <Typography className="top-stripe-header-title">
                      {details.title.split(" ")[0]} <br />
                      {details.title.split(" ").slice(1).join(" ")}
                    </Typography>
                    <Typography className="top-stripe-header-count">
                      {details.value}
                    </Typography>

                    {details.chartsData?.some((data) => data?.value > 0) && (
                      <Box>
                        <HorizontalCharts
                          data={details?.chartsData}
                        ></HorizontalCharts>
                      </Box>
                    )}
                  </Box>
                  {index === headerDetails.length - 1 || mediumScreen || (
                    <Box
                      sx={{ flex: 1 }}
                      className="top-stripe-header-vertical-line"
                    ></Box>
                  )}
                </>
              ))}
              <Box
                sx={{ width: mediumScreen ? "100%" : "auto" }}
                className="automation-manager-header-filter"
              >
                <Box>
                  {" "}
                  <SelectPicker
                    value={automationStatus}
                    onChange={setAutomationStatus}
                    style={{ width: "100%" }}
                    searchable={false}
                    placeholder="Status"
                    data={automationStatusFilter}
                  />
                </Box>
                <Box>
                  <SelectPicker
                    value={automationDataType}
                    onChange={setAutomationDataType}
                    style={{ width: "100%" }}
                    placeholder="Data Type"
                    data={automationDataTypeFilter}
                    searchable={false}
                  />
                </Box>
                <Box>
                  {" "}
                  <Button
                    sx={{ width: mediumScreen ? "100%" : "auto" }}
                    onClick={() => navigate("/data-segment-manager")}
                    className="automation-manager-btn"
                  >
                    View Data Segment
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Card>
  );
}

export default AutomationManagerHeader;
