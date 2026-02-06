/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Container, Grid, Typography, Card } from "@mui/material";
import "../../styles/AdminDashboard.css";
import PropTypes from "prop-types";
import FollowUpTask from "../../components/ui/counsellor-dashboard/FollowUpTask";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import GetJsonDate from "../../hooks/GetJsonDate";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import useToasterHook from "../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import {
  ApplicationFunnel,
  FormWiseApplications,
} from "../../components/ui/admin-dashboard";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BackDrop from "../../components/shared/Backdrop/Backdrop";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useGetCounselorListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import {
  organizeCounselorFilterOption,
  organizeSourceFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import CounselorFollowUpCalendar from "./CounselorFollowUpCalendar";
import CounsellorPerformanceReport from "../../components/ui/counsellor-dashboard/CounsellorPerformanceReport";
import CounsellorQuickView from "../../components/ui/counsellor-dashboard/CounsellorQuickView";
import LeadStageDetails from "../../components/ui/counsellor-dashboard/LeadStageDetails";
import CounsellorDashboardKeyIndicators from "../../components/ui/counsellor-dashboard/CounsellorDashboardKeyIndicators";
import {
  useGetAllSourceListQuery,
  useGetListOfSchoolsQuery,
} from "../../Redux/Slices/filterDataSlice";

import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import StateWisePerformance from "../../components/ui/admin-dashboard/StateWisePerformance";
import ErrorAndSomethingWentWrong from "../../components/shared/ErrorAnimation/ErrorAndSomethingWentWrong";

function CounsellorDashboard() {
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);

  const [counsellorList, setCounsellorList] = useState([]);
  const [hideCounsellorList, setHideCounsellorList] = useState(false);
  const pushNotification = useToasterHook();

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [hideFollowupCalendar, setHideFollowupCalendar] = React.useState(false);

  const [
    somethingWentWrongInPerformanceReport,
    setSomethingWentWrongInPerformanceReport,
  ] = useState(false);
  const [
    performanceReportInternalServerError,
    setPerformanceReportInternalServerError,
  ] = useState(false);
  const [hidePerformanceReport, setHidePerformanceReport] = useState(false);

  //getting data form context
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { selectedSeason, setHeadTitle, headTitle } =
    useContext(LayoutSettingContext);

  useEffect(() => {
    localStorage.setItem(`${Cookies.get("userId")}followupTaskSavePageNo`, 1);
  }, []);

  // state for checking if user scrolled to the element or not
  const [isScrolledToApplicationFunnel, setIsScrolledToApplicationFunnel] =
    useState(false);
  const [isScrolledFormWiseApplication, setIsScrolledFormWiseApplication] =
    useState(false);
  const [isScrolledLeadStageDetails, setIsScrolledLeadStageDetails] =
    useState(false);
  const [isScrolledMapData, setIsScrolledMapData] = useState(false);
  const [isScrolledPerformanceReport, setIsScrolledPerformanceReport] =
    useState(false);
  const [isScrolledFollowupTask, setIsScrolledFollowupTask] = useState(false);

  // elements observer
  const [applicationFunnelRef, { entry: applicationFunnelEntry }] =
    useIntersectionObserver();
  const [formWiseApplicationRef, { entry: formWiseApplicationEntry }] =
    useIntersectionObserver();
  const [leadStageDetailsRef, { entry: leadStageDetailsEntry }] =
    useIntersectionObserver();
  const [mapDataRef, { entry: mapDataEntry }] = useIntersectionObserver();
  const [performanceReportRef, { entry: performanceReportEntry }] =
    useIntersectionObserver();
  const [followupTaskRef, { entry: followupTaskEntry }] =
    useIntersectionObserver();

  // checking if user reached to the element or not
  const isApplicationFunnelVisible =
    applicationFunnelEntry && applicationFunnelEntry?.isIntersecting;
  const isFormWiseApplicationVisible =
    formWiseApplicationEntry && formWiseApplicationEntry?.isIntersecting;
  const isLeadStageDetailsVisible =
    leadStageDetailsEntry && leadStageDetailsEntry?.isIntersecting;
  const isMapDataVisible = mapDataEntry && mapDataEntry?.isIntersecting;
  const isPerformanceReportVisible =
    performanceReportEntry && performanceReportEntry?.isIntersecting;
  const isFollowupTaskVisible =
    followupTaskEntry && followupTaskEntry?.isIntersecting;

  // setting true if application funnel is visible
  useEffect(() => {
    if (isApplicationFunnelVisible) {
      if (!isScrolledToApplicationFunnel) {
        setIsScrolledToApplicationFunnel(true);
      }
    }
  }, [isApplicationFunnelVisible, isScrolledToApplicationFunnel]);

  // setting true if form wise application is visible
  useEffect(() => {
    if (isFormWiseApplicationVisible) {
      if (!isScrolledFormWiseApplication) {
        setIsScrolledFormWiseApplication(true);
      }
    }
  }, [isFormWiseApplicationVisible, isScrolledFormWiseApplication]);

  // setting true if lead stage details is visible
  useEffect(() => {
    if (isLeadStageDetailsVisible) {
      if (!isScrolledLeadStageDetails) {
        setIsScrolledLeadStageDetails(true);
      }
    }
  }, [isLeadStageDetailsVisible, isScrolledLeadStageDetails]);

  // setting true if state wise performances is visible
  useEffect(() => {
    if (isMapDataVisible) {
      if (!isScrolledMapData) {
        setIsScrolledMapData(true);
      }
    }
  }, [isMapDataVisible, isScrolledMapData]);

  // setting true if performances report is visible
  useEffect(() => {
    if (isPerformanceReportVisible) {
      if (!isScrolledPerformanceReport) {
        setIsScrolledPerformanceReport(true);
      }
    }
  }, [isPerformanceReportVisible, isScrolledPerformanceReport]);

  useEffect(() => {
    if (isFollowupTaskVisible) {
      if (!isScrolledFollowupTask) {
        setIsScrolledFollowupTask(true);
      }
    }
  }, [isFollowupTaskVisible, isScrolledFollowupTask]);

  const handleDownloadFile = useMemo(() => {
    return (
      fileDownloadUrl,
      payload,
      componentName,
      somethingWentWrongState,
      internalServerErrorState
    ) => {
      setOpenBackdrop(true);
      customFetch(
        fileDownloadUrl,
        {
          method: componentName === "Performance report" ? "PUT" : "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: payload,
        },
        fileDownloadUrl?.includes("?") ? false : true
      )
        .then((res) =>
          res.json().then((data) => {
            if (data?.file_url) {
              const expectedData = data?.file_url;
              try {
                if (typeof expectedData === "string") {
                  window.open(data?.file_url);
                } else {
                  throw new Error(
                    `${componentName} download API response has changed`
                  );
                }
              } catch (error) {
                setApiResponseChangeMessage(error);
                handleSomethingWentWrong(somethingWentWrongState, "", 5000);
              }
            } else if (data.detail === "Could not validate credentials") {
              window.location.reload();
            } else if (data.detail) {
              pushNotification("error", data.detail);
            }
          })
        )
        .catch(() => {
          handleInternalServerError(internalServerErrorState, "", 5000);
        })
        .finally(() => setOpenBackdrop(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  const { handleFilterListApiCall } = useCommonApiCalls();

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        organizeCounselorFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  const [hideKeyIndicators, setHideKeyIndicators] = useState(false);

  const [hideLeadStageDetails, setHideLeadStageDetails] = useState(false);

  const [hideSourceList, setHideSourceList] = useState(false);
  const [sourceList, setSourceList] = useState([]);

  const [callSourceListApi, setCallSourceListApi] = useState(true);

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: collegeId },
    { skip: callSourceListApi }
  );

  // get source list
  useEffect(() => {
    if (!callSourceListApi) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callSourceListApi, sourceListInfo]);

  const [skipSchoolApiCall, setSkipSchoolApiCall] = useState(true);
  const [schoolList, setSchoolList] = useState([]);
  const [hideSchoolList, setHideSchoolList] = useState(false);
  const schoolListInfo = useGetListOfSchoolsQuery(
    { collegeId },
    { skip: skipSchoolApiCall }
  );

  useEffect(() => {
    try {
      if (schoolListInfo?.isSuccess) {
        if (schoolListInfo?.data?.data) {
          const formatedSchoolList = organizeSourceFilterOption(
            Object.keys(schoolListInfo?.data?.data)
          );
          setSchoolList(formatedSchoolList);
        } else {
          throw new Error("List of school API's response has been changed.");
        }
      } else if (schoolListInfo?.isError) {
        setHideSchoolList(true);
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      setHideSchoolList(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    schoolListInfo?.data,
    schoolListInfo?.error,
    schoolListInfo?.isError,
    schoolListInfo?.isSuccess,
    skipSchoolApiCall,
  ]);

  useEffect(() => {
    setHeadTitle("Counsellor Dashboard");
    document.title = "Counsellor Dashboard";
  }, [headTitle]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [counselorDashboardFeatures, setCounselorDashboardFeatures] = useState(
    {}
  );

  useEffect(() => {
    setCounselorDashboardFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features
    );
  }, [permissions]);

  return (
    <Box
      sx={{ flexGrow: 1, pb: 2 }}
      className="counsellor-dashboard-header-box-container"
    >
      <BackDrop openBackdrop={openBackdrop} />
      <Container maxWidth={false}>
        <Grid container spacing={2}>
          {counselorDashboardFeatures?.["345e082b"]?.visibility && (
            <Grid item lg={12} sm={12} xs={12}>
              <CounsellorQuickView collegeId={collegeId} />
            </Grid>
          )}

          {counselorDashboardFeatures?.["a1ccd630"]?.visibility && (
            <Grid
              item
              xs={12}
              md={hideFollowupCalendar ? 12 : 5}
              sx={{ display: hideKeyIndicators ? "none" : "block" }}
            >
              <CounsellorDashboardKeyIndicators
                collegeId={collegeId}
                setHideKeyIndicators={setHideKeyIndicators}
              />
            </Grid>
          )}

          {counselorDashboardFeatures?.["14332d8b"]?.visibility && (
            <Grid
              item
              lg={hideKeyIndicators ? 12 : 7}
              md={hideKeyIndicators ? 12 : 7}
              sm={12}
              xs={12}
            >
              <CounselorFollowUpCalendar
                hideFollowupCalendar={hideFollowupCalendar}
                setHideFollowupCalendar={setHideFollowupCalendar}
              />
            </Grid>
          )}

          {counselorDashboardFeatures?.["24c09f26"]?.visibility && (
            <Grid
              ref={leadStageDetailsRef}
              item
              xs={12}
              md={7}
              sx={{ display: hideLeadStageDetails ? "none" : "block" }}
            >
              <LeadStageDetails
                setHideLeadStageDetails={setHideLeadStageDetails}
                isScrolledLeadStageDetails={isScrolledLeadStageDetails}
                handleDownloadFile={handleDownloadFile}
                hideSourceList={hideSourceList}
                sourceList={sourceList}
                sourceListInfo={sourceListInfo}
                setCallSourceListApi={setCallSourceListApi}
                selectedSeason={selectedSeason}
              />
            </Grid>
          )}

          {counselorDashboardFeatures?.["336940af"]?.visibility && (
            <>
              <Grid
                ref={applicationFunnelRef}
                item
                md={hideLeadStageDetails ? 12 : 5}
                sm={12}
                xs={12}
              >
                <ApplicationFunnel
                  sourceFilterFeature={
                    counselorDashboardFeatures?.["336940af"]?.features?.[
                      "24c4768a"
                    ]?.visibility
                  }
                  dateRangeFilterFeature={
                    counselorDashboardFeatures?.["336940af"]?.features?.[
                      "ef9b0295"
                    ]?.visibility
                  }
                  collegeId={collegeId}
                  hideSourceList={hideSourceList}
                  sourceList={sourceList}
                  sourceListInfo={sourceListInfo}
                  setSkipSourceApiCall={setCallSourceListApi}
                  apiCallingConditions={collegeId?.length > 0}
                  isScrolledToApplicationFunnel={isScrolledToApplicationFunnel}
                  featureKey="336940af"
                />
              </Grid>
            </>
          )}

          {counselorDashboardFeatures?.["81ff3c88"]?.visibility && (
            <>
              <Grid ref={mapDataRef} item md={12} sm={12} xs={12}>
                <StateWisePerformance
                  featureKey="81ff3c88"
                  sourceFilterFeature={
                    counselorDashboardFeatures?.["81ff3c88"]?.features?.[
                      "ea92854f"
                    ]?.visibility
                  }
                  dateRangeFilterFeature={
                    counselorDashboardFeatures?.["81ff3c88"]?.features?.[
                      "00b49419"
                    ]?.visibility
                  }
                  changeIndicatorFilterFeature={
                    counselorDashboardFeatures?.["81ff3c88"]?.features?.[
                      "c420ba17"
                    ]?.visibility
                  }
                  hideSourceList={hideSourceList}
                  sourceList={sourceList}
                  sourceListInfo={sourceListInfo}
                  setSkipSourceApiCall={setCallSourceListApi}
                  apiCallingConditions={collegeId?.length > 0}
                  isScrolledToMapData={isScrolledMapData}
                  collegeId={collegeId}
                />
              </Grid>
            </>
          )}

          {counselorDashboardFeatures?.["58771803"]?.visibility && (
            <>
              <Grid ref={formWiseApplicationRef} item md={12} sm={12} xs={12}>
                <FormWiseApplications
                  featureKey="58771803"
                  sourceFilterFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "f56fd65c"
                    ]?.visibility
                  }
                  dateRangeFilterFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "7f5294a9"
                    ]?.visibility
                  }
                  changeIndicatorFilterFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "67cc807c"
                    ]?.visibility
                  }
                  schoolFilterFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "39596c1d"
                    ]?.visibility
                  }
                  counselorFilterFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "d5db6228"
                    ]?.visibility
                  }
                  downloadFeature={
                    counselorDashboardFeatures?.["58771803"]?.features?.[
                      "99b70213"
                    ]?.visibility
                  }
                  apiCallingConditions={collegeId?.length > 0}
                  isScrolledFormWiseApplication={isScrolledFormWiseApplication}
                  handleDownloadFile={handleDownloadFile}
                  collegeId={collegeId}
                  counsellorList={counsellorList}
                  hideCounsellorList={hideCounsellorList}
                  selectedSeason={selectedSeason}
                  loadingCounselorList={counselorListApiCallInfo.isFetching}
                  setSkipCounselorApiCall={setSkipCounselorApiCall}
                  schoolList={schoolList}
                  hideSchoolList={hideSchoolList}
                  loadingSchoolList={schoolListInfo.isFetching}
                  setSkipSchoolApiCall={setSkipSchoolApiCall}
                  hideSourceList={hideSourceList}
                  sourceList={sourceList}
                  sourceListInfo={sourceListInfo}
                  setSkipSourceApiCall={setCallSourceListApi}
                />
              </Grid>
            </>
          )}

          {counselorDashboardFeatures?.["4406dd1f"]?.visibility && (
            <Grid
              ref={performanceReportRef}
              item
              xs={12}
              md={4}
              sx={{
                display: hidePerformanceReport ? "none" : "block",
              }}
            >
              {somethingWentWrongInPerformanceReport ||
              performanceReportInternalServerError ? (
                <Card>
                  <ErrorAndSomethingWentWrong
                    isInternalServerError={performanceReportInternalServerError}
                    isSomethingWentWrong={somethingWentWrongInPerformanceReport}
                    containerHeight="20vh"
                  />
                </Card>
              ) : (
                <>
                  <CounsellorPerformanceReport
                    handleDownloadFile={handleDownloadFile}
                    collegeId={collegeId}
                    setSomethingWentWrong={
                      setSomethingWentWrongInPerformanceReport
                    }
                    setInternalServerError={
                      setPerformanceReportInternalServerError
                    }
                    selectedSeason={selectedSeason}
                    isScrolledPerformanceReport={isScrolledPerformanceReport}
                    setHidePerformanceReport={setHidePerformanceReport}
                  />
                </>
              )}
            </Grid>
          )}

          {counselorDashboardFeatures?.["a5168b10"]?.visibility && (
            <Grid ref={followupTaskRef} item xs={12} md={8}>
              <FollowUpTask
                counsellorDashboard={true}
                skipApiCall={!isScrolledFollowupTask}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default CounsellorDashboard;
