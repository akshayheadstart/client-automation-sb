import React, { useState, createContext, useEffect } from "react";

export const LayoutSettingContext = createContext();

export const LayoutSettingProvider = (props) => {
  // Our state to store fetched cache data
  const [showTopNavbar, setShowTopNavbar] = useState(false);
  const [showScoreBoard, setShowScoreBoard] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [showApplicationFunnel, setShowApplicationFunnel] = useState(true);
  const [showApplicationSteps, setShowApplicationSteps] = useState(true);
  const [showKeyIndicatorIndicator, setShowKeyIndicatorIndicator] =
    useState(true);
  const [showPerformingFunnel, setShowPerformingFunnel] = useState(true);
  const [showLeadVsApplications, setShowLeadVsApplications] = useState(true);
  const [showFormWiseApplication, setShowFormWiseApplications] = useState(true);
  const [showPreferenceWiseApplication, setShowPreferenceWiseApplications] =
    useState(true);

  const [showSourceWiseLeadDetail, setShowSourceWiseLeadDetail] =
    useState(true);
  const [showCounsellorPerformanceReport, setShowCounsellorPerformanceReport] =
    useState(true);
  const [showHeadCounselorList, setShowHeadCounselorList] = useState(true);

  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [headTitle, setHeadTitle] = useState("");
  const [scriptPayload, setScriptPayload] = useState({});
  const [studentInfoDetails, setStudentInfoDetails] = useState({});

  useEffect(() => {
    // Function to get single cache data
    const getSingleCacheData = async (cacheName, url) => {
      if (typeof caches === "undefined") return false;

      const cacheStorage = await caches.open(cacheName);
      const cachedResponse = await cacheStorage.match(url);

      // If no cache exists
      if (!cachedResponse || !cachedResponse.ok) {
      }

      return cachedResponse?.json()?.then((item) => {
        setShowTopNavbar(item.showTopNavbar);
        setShowScoreBoard(item.showScoreBoard);
        setShowMap(item.showMap);
        setShowApplicationFunnel(item.showApplicationFunnel);
        setShowApplicationSteps(item.showApplicationSteps);
        setShowLeadVsApplications(item.showLeadVsApplications);
        setShowPerformingFunnel(item.showPerformingFunnel);
        setShowFormWiseApplications(item.showFormWiseApplication);
        setShowSourceWiseLeadDetail(item.showSourceWiseLeadDetail);
        setShowCounsellorPerformanceReport(
          item.showCounsellorPerformanceReport
        );
        setShowHeadCounselorList(item.showHeadCounselorList);
        setShowKeyIndicatorIndicator(item.showKeyIndicatorIndicator);
        setShowPreferenceWiseApplications(item.showPreferenceWiseApplication);
      });
    };
    getSingleCacheData("settingsCache", window.location.origin);
  }, []);

  const data = {
    showTopNavbar,
    setShowTopNavbar,
    showScoreBoard,
    setShowScoreBoard,
    showMap,
    setShowMap,
    showApplicationSteps,
    setShowApplicationSteps,
    showApplicationFunnel,
    showKeyIndicatorIndicator,
    setShowKeyIndicatorIndicator,
    setShowApplicationFunnel,
    showLeadVsApplications,
    setShowLeadVsApplications,
    showPerformingFunnel,
    setShowPerformingFunnel,
    showFormWiseApplication,
    setShowFormWiseApplications,
    showSourceWiseLeadDetail,
    setShowSourceWiseLeadDetail,
    showCounsellorPerformanceReport,
    setShowCounsellorPerformanceReport,
    showHeadCounselorList,
    setShowHeadCounselorList,
    selectedCollegeId,
    setSelectedCollegeId,
    setHeadTitle,
    headTitle,
    setScriptPayload,
    scriptPayload,
    setShowPreferenceWiseApplications,
    showPreferenceWiseApplication,
    studentInfoDetails,
    setStudentInfoDetails,
  };

  return (
    <LayoutSettingContext.Provider value={data}>
      {props.children}
    </LayoutSettingContext.Provider>
  );
};
