import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../../../store/contexts/LayoutSetting";
import { Box } from "@mui/material";
import MultipleTabs from "../../../shared/tab-panel/MultipleTabs";
import { communicationPerformanceTab } from "../../../../constants/LeadStageList";
import CallingSummaryHeader from "./CallingSummaryHeader";
import CallSummaryTableAndFilter from "./CallSummaryTableAndFilter";
import "../../../../styles/communicationSummary.css";
import MissedCallDashboard from "../MissedCalls/MissedCallDashboard";
import CallQualityTable from "./CallQualityTable";
import CallInfoTable from "./CallInfoTable/CallInfoTable";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { handleSetSectionVisibility } from "../../../../pages/StudentTotalQueries/helperFunction";
import FollowupSummaryDetails from "./FollowupSummary/FollowupSummaryDetails";
import CommunicationSummaryDetails from "./SummaryDetails/CommunicationSummaryDetails";
import "../../../../styles/sharedStyles.css";
import { useSelector } from "react-redux";
function CommunicationSummaryDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const [isScrolledToCallQuality, setIsScrolledToCallQuality] = useState(false);
  const [isScrolledToCallInfo, setIsScrolledToCallInfo] = useState(false);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(permissions?.["aefd607c"]?.features?.["b27012fd"]?.features);
  }, [permissions]);

  const [callQualityRef, { entry: callQualityEntry }] =
    useIntersectionObserver();
  const [callInfoRef, { entry: callInfoEntry }] = useIntersectionObserver();

  const isCallInfoSectionVisible =
    callInfoEntry && callInfoEntry?.isIntersecting;
  const isCallQualitySectionVisible =
    callQualityEntry && callQualityEntry?.isIntersecting;

  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Communication Summary");
    document.title = "Communication Summary";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headTitle]);

  // setting true if call quality section is visible
  useEffect(() => {
    handleSetSectionVisibility(
      isCallQualitySectionVisible,
      isScrolledToCallQuality,
      setIsScrolledToCallQuality
    );
  }, [isCallQualitySectionVisible]);

  // setting true if call info section is visible
  useEffect(() => {
    handleSetSectionVisibility(
      isCallInfoSectionVisible,
      isScrolledToCallInfo,
      setIsScrolledToCallInfo
    );
  }, [isCallInfoSectionVisible]);

  return (
    <Box
      className="shared-dashboard-box-container"
      sx={{ mt: 6, mb: 3, mx: 3.5, overflow: "hidden" }}
    >
      <MultipleTabs
        tabArray={communicationPerformanceTab}
        mapTabValue={tabValue}
        setMapTabValue={setTabValue}
        boxWidth="700px !important"
      />
      {tabValue === 0 && (
        <>
          {features?.["4e2190cd"]?.visibility && (
            <CommunicationSummaryDetails
              featurePermission={features?.["4e2190cd"]?.features}
            />
          )}
        </>
      )}
      {tabValue === 1 && (
        <>
          {features?.["acb2bb76"]?.visibility && (
            <FollowupSummaryDetails
              featurePermission={features?.["acb2bb76"]?.features}
            />
          )}
        </>
      )}
      {tabValue === 2 && (
        <>
          {features?.["8653c643"]?.visibility && (
            <>
              {features?.["8653c643"]?.features?.["466d688e"]?.visibility && (
                <CallingSummaryHeader />
              )}
              {features?.["8653c643"]?.features?.["d01e1b86"]?.visibility && (
                <CallSummaryTableAndFilter />
              )}
              <Box ref={callQualityRef}>
                {isScrolledToCallQuality && (
                  <>
                    {features?.["8653c643"]?.features?.["4fd79d6a"]
                      ?.visibility && <CallQualityTable />}
                  </>
                )}
              </Box>
              <Box ref={callInfoRef}>
                {isScrolledToCallInfo && (
                  <>
                    {features?.["8653c643"]?.features?.["ab5b5755"]
                      ?.visibility && (
                      <CallInfoTable
                        features={
                          features?.["8653c643"]?.features?.["ab5b5755"]
                            ?.features
                        }
                      />
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </>
      )}
      {tabValue === 3 && (
        <>
          {features?.["daa93fdf"]?.visibility && (
            <MissedCallDashboard
              featurePermission={features?.["daa93fdf"]?.features}
            />
          )}
        </>
      )}
    </Box>
  );
}

export default CommunicationSummaryDashboard;
