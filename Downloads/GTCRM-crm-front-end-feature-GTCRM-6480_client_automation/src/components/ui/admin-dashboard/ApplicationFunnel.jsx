import React, { useContext, useEffect, useState } from "react";
import { Box, Card, Typography } from "@mui/material";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";

import FunnelDesignV2 from "./FunnelDesign";
import { startAndEndDateSelect } from "../../../utils/adminDashboardDateRangeSelect";
import DateRangeShowcase from "../../shared/CalendarTimeData/DateRangeShowcase";

// import "react-funnel-pipeline/dist/index.css";
import "../../../styles/FunnelDesign.css";
import { useSelector } from "react-redux";
import { useGetApplicationFunnelDetailsQuery } from "../../../Redux/Slices/adminDashboardSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { adminDashboardApiPayload } from "../../../utils/AdminDashboardApiPayload";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";

function ApplicationFunnel({
  collegeId,
  hideSourceList,
  sourceList,
  sourceListInfo,
  setSkipSourceApiCall,
  isScrolledToApplicationFunnel,
  apiCallingConditions,
  featureKey,
  sourceFilterFeature,
  dateRangeFilterFeature,
}) {
  const [applicationFunnelData, setApplicationFunnelData] = useState({});
  const [applicationFunnelDateRange, setApplicationFunnelDateRange] = useState(
    []
  );
  const [selectedSource, setSelectedSource] = useState([]);
  const [appliedSource, setAppliedSource] = useState([]);
  const [hideApplicationFunnel, setHideApplicationFunnel] = useState(false);

  const [startDateRange, setStartDateRange] = useState("");
  const [endDateRange, setEndDateRange] = useState("");

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const handleError = useCommonErrorHandling();
  const {
    setApiResponseChangeMessage,
    applicationFunnelInternalServerError,
    setApplicationFunnelInternalServerError,
    somethingWentWrongInApplicationFunnel,
    setSomethingWentWrongInApplicationFunnel,
  } = useContext(DashboradDataContext);

  const { data, isFetching, isError, error, isSuccess } =
    useGetApplicationFunnelDetailsQuery(
      {
        collegeId,
        featureKey,
        payload: {
          ...JSON.parse(
            adminDashboardApiPayload({
              dateRange: applicationFunnelDateRange,
              selectedSeason,
              source: appliedSource,
            })
          ),
        },
      },
      {
        skip:
          apiCallingConditions && isScrolledToApplicationFunnel ? false : true,
      }
    );

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data[0] === "object") {
          setApplicationFunnelData(data?.data[0]);
        } else {
          throw new Error("Application funnel API response has been changed");
        }
      } else if (isError) {
        handleError({
          error,
          setIsInternalServerError: setApplicationFunnelInternalServerError,
          setHide: setHideApplicationFunnel,
        });
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInApplicationFunnel,
        setHideApplicationFunnel,
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  useEffect(() => {
    if (applicationFunnelDateRange?.length > 1) {
      const startDate = new Date(applicationFunnelDateRange[0]);
      const endDate = new Date(applicationFunnelDateRange[1]);
      setStartDateRange(startDate.toDateString());
      setEndDateRange(endDate.toDateString());
    } else {
      startAndEndDateSelect(selectedSeason, setStartDateRange, setEndDateRange);
    }
  }, [applicationFunnelDateRange, selectedSeason]);

  if (hideApplicationFunnel) {
    return null;
  }

  return (
    <>
      {isFetching ? (
        <Card className="loader-wrapper full-height">
          <LeefLottieAnimationLoader
            height={100}
            width={150}
          ></LeefLottieAnimationLoader>{" "}
        </Card>
      ) : (
        <>
          {applicationFunnelInternalServerError ||
          somethingWentWrongInApplicationFunnel ? (
            <Card>
              <ErrorAndSomethingWentWrong
                isInternalServerError={applicationFunnelInternalServerError}
                isSomethingWentWrong={somethingWentWrongInApplicationFunnel}
                containerHeight="20vh"
              />
            </Card>
          ) : (
            <Box
              className="application-funnel-box"
              sx={{ pb: 0, display: "flex", flexDirection: "column" }}
            >
              {applicationFunnelDateRange?.length > 1 && (
                <DateRangeShowcase
                  startDateRange={startDateRange}
                  endDateRange={endDateRange}
                  triggeredFunction={() => setApplicationFunnelDateRange([])}
                ></DateRangeShowcase>
              )}
              <Box className="top-dashboard-header-and-application-funnel-section">
                <Box className="title-box-hover">
                  <Typography className="top-section-title">
                    Application Funnel
                  </Typography>
                  <Typography className="top-section-date">
                    {startDateRange} - {endDateRange}
                  </Typography>
                </Box>
                <Box className="top-dashboard-section-filters-box">
                  {sourceFilterFeature && (
                    <>
                      {hideSourceList || (
                        <MultipleFilterSelectPicker
                          style={{ width: "130px" }}
                          placement="bottomEnd"
                          placeholder="Source Name"
                          onChange={(value) => {
                            setSelectedSource(value);
                          }}
                          pickerData={sourceList}
                          setSelectedPicker={setSelectedSource}
                          pickerValue={selectedSource}
                          loading={sourceListInfo?.isFetching}
                          onOpen={() => setSkipSourceApiCall(false)}
                          className="key-select-picker"
                          callAPIAgain={() => setAppliedSource(selectedSource)}
                          onClean={() => setAppliedSource([])}
                        />
                      )}
                    </>
                  )}
                  {dateRangeFilterFeature && (
                    <IconDateRangePicker
                      onChange={(value) => {
                        setApplicationFunnelDateRange(value);
                      }}
                      dateRange={applicationFunnelDateRange}
                    />
                  )}
                </Box>
              </Box>
              <Box className="app-funnel-container">
                <FunnelDesignV2 funnelData={applicationFunnelData} />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}

export default React.memo(ApplicationFunnel);
