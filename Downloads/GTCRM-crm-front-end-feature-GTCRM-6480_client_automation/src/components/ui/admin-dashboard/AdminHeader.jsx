import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  Tooltip,
  Fab,
  Divider,
  Drawer,
} from "@mui/material";
import adjustment from "../../../images/adjustment.svg";
import CloseIcon from "@mui/icons-material/Close";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeCookies } from "../../../Redux/Slices/authSlice";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../hooks/useToasterHook";
import RestrictedAlert from "./RestrictedAlert";
import { useGetCollegeListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { removeLocalStorageKeys } from "../../Calendar/utils";
import DashletOption from "./DashletOption";

function AdminHeader({
  setCollegeId,
  setSomethingWentWrongInColleges,
  selectedSeason,
  dashboardFeatures,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  const state = useSelector((state) => state.authentication.token);
  const [openWithHeader, setOpenWithHeader] = useState(false);
  if (state.detail) {
    dispatch(removeCookies());
    navigate("/page401");
  }

  //getting data form context
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const {
    data: listOfColleges,
    isSuccess,
    isError,
    error: getCollegeListError,
  } = useGetCollegeListQuery();
  useEffect(() => {
    /// Note : this api need to call in RTK query and invalidated by create client API

    try {
      if (isSuccess) {
        if (Array.isArray(listOfColleges?.data)) {
          const collegeList = [];
          listOfColleges?.data.forEach((college) => {
            collegeList.push({
              label: college.name,
              value: college.id,
            });
          });

          setCollegeId(collegeList[0]?.value);
          Cookies.set("collegeId", collegeList[0]?.value, {
            expires: 30,
          });

          // setColleges(collegeList);
        } else {
          throw new Error("All application manager API response has changed");
        }
      } else if (isError) {
        if (
          getCollegeListError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (getCollegeListError?.data?.detail) {
          pushNotification("error", getCollegeListError?.data?.detail);
        }
        if (getCollegeListError?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      setSomethingWentWrongInColleges(true);
      setTimeout(() => {
        navigate("/");
      }, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfColleges, isSuccess, isError, getCollegeListError]);

  const label = { inputProps: { "aria-label": "Switch demo" } };

  // show/hide navbar
  const {
    showTopNavbar,
    setShowTopNavbar,
    showScoreBoard,
    setShowScoreBoard,
    showMap,
    setShowMap,
    showApplicationSteps,
    setShowApplicationSteps,
    showApplicationFunnel,
    setShowApplicationFunnel,
    showPerformingFunnel,
    setShowPerformingFunnel,
    showLeadVsApplications,
    setShowLeadVsApplications,
    showFormWiseApplication,
    setShowFormWiseApplications,
    showKeyIndicatorIndicator,
    setShowKeyIndicatorIndicator,
    showSourceWiseLeadDetail,
    setShowSourceWiseLeadDetail,
    showCounsellorPerformanceReport,
    setShowCounsellorPerformanceReport,
    showHeadCounselorList,
    setShowHeadCounselorList,
    setShowPreferenceWiseApplications,
    showPreferenceWiseApplication,
  } = useContext(LayoutSettingContext);

  const settingsCacheData = {
    showTopNavbar: showTopNavbar,
    showScoreBoard: showScoreBoard,
    showMap: showMap,
    showApplicationFunnel: showApplicationFunnel,
    showApplicationSteps: showApplicationSteps,
    showPerformingFunnel: showPerformingFunnel,
    showKeyIndicatorIndicator: showKeyIndicatorIndicator,
    showFormWiseApplication: showFormWiseApplication,
    showLeadVsApplications: showLeadVsApplications,
    showSourceWiseLeadDetail: showSourceWiseLeadDetail,
    showCounsellorPerformanceReport: showCounsellorPerformanceReport,
    showHeadCounselorList: showHeadCounselorList,
    showPreferenceWiseApplication: showPreferenceWiseApplication,
  };

  // Function to add our give data into cache
  const addDataIntoCache = (cacheName, url, response) => {
    // Converting our response into Actual Response form
    const data = new Response(JSON.stringify(response));

    if ("caches" in window) {
      // Opening given cache and putting our data into it
      caches.open(cacheName).then((cache) => {
        cache.put(url, data);
      });
    }
  };

  const isActionDisable = useSelector(
    (state) => state.authentication.isActionDisable
  );
  useEffect(() => {
    // when season changes, the page number is removed.
    const savePageNumberKeys = [
      "adminApplicationSavePageNo",
      "paidApplicationSavePageNo",
      "adminFormSavePageNo",
      "adminLeadSavePageNo",
    ];
    removeLocalStorageKeys(savePageNumberKeys);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeason]);
  const systemPreference = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.system_preference
  );
  return (
    <>
      <Box className="main-header">
        {isActionDisable && (
          <Box sx={{ mb: 1 }}>
            <RestrictedAlert />
          </Box>
        )}
        {/* <Box className="admin-header">
            <Box>
              <Typography color="textPrimary" variant="h5">
                Admin Dashboard
              </Typography>
            </Box> */}

        <Box className="admin-bottom">
          <Box
            position=""
            sx={{
              position: "absolute",
            }}
          >
            <Tooltip arrow placement="top" title="Edit Layout">
              <Fab
                data-testid="edit-layout-button"
                onClick={() => setOpenWithHeader(true)}
                color="info"
                size="medium"
                sx={{
                  bottom: "15px",
                  position: "fixed",
                  right: "10px",
                }}
              >
                <img className="adjustment-icon" src={adjustment} alt="icon" />
              </Fab>
            </Tooltip>
          </Box>
        </Box>
        {/* </Box> */}

        <Drawer
          variant="persistent"
          anchor="right"
          open={openWithHeader}
          onClose={() => setOpenWithHeader(false)}
          ModalProps={{ sx: { zIndex: 2000 } }}
          PaperProps={{ sx: { maxwidth: 600 } }}
        >
          <Box
            sx={{
              alignItems: "center",
              color: "primary.contrastText",
              display: "flex",
              justifyContent: "space-between",
              px: 3,
              py: 2,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "20px",
                color: "#008be2",
                flexGrow: 0,
                mt: "6px",
              }}
            >
              Add Dashlets
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => setOpenWithHeader(false)}
            >
              <CloseIcon color="info" />
            </Button>
          </Box>
          <Divider />
          {/* ------ Top Navbar show/hide-----  */}

          <Box className="drawer-body">
            {/* <Box className="drawer-item">
              <Box className="drawer-item-left">
                <Typography color="textPrimary" variant="subtitle2">
                  Top Navbar
                </Typography>
                <Typography color="textPrimary" variant="body2">
                  Please click on switch to view Top Navbar in header.
                </Typography>
              </Box>
              <Box className="drawer-item-right">
                <Switch
                  disabled={isActionDisable}
                  {...label}
                  checked={showTopNavbar}
                  onChange={() => setShowTopNavbar(!showTopNavbar)}
                />
              </Box>
            </Box> */}

            {dashboardFeatures?.["e7cb13a0"]?.visibility && (
              <DashletOption
                value={showScoreBoard}
                setValue={setShowScoreBoard}
                title="Score Board"
              />
            )}
            {dashboardFeatures?.["b45a67ff"]?.visibility && (
              <DashletOption
                value={showPerformingFunnel}
                setValue={setShowPerformingFunnel}
                title="Channel Wise Performance"
              />
            )}
            {dashboardFeatures?.["b45a67ff"]?.visibility && (
              <DashletOption
                value={showApplicationFunnel}
                setValue={setShowApplicationFunnel}
                title="Application Funnel"
              />
            )}
            {dashboardFeatures?.["52db5592"]?.visibility && (
              <DashletOption
                value={showMap}
                setValue={setShowMap}
                title="State wise Performance"
              />
            )}
            {dashboardFeatures?.["acdbd75a"]?.visibility && (
              <DashletOption
                value={showKeyIndicatorIndicator}
                setValue={setShowKeyIndicatorIndicator}
                title="Key Indicator"
              />
            )}
            {dashboardFeatures?.["cff4944d"]?.visibility && (
              <DashletOption
                value={showApplicationSteps}
                setValue={setShowApplicationSteps}
                title="Application Steps"
              />
            )}
            {dashboardFeatures?.["d92a32d8"]?.visibility && (
              <DashletOption
                value={showLeadVsApplications}
                setValue={setShowLeadVsApplications}
                title="Lead Vs Paid Applications"
              />
            )}
            {dashboardFeatures?.["f89aaf25"]?.visibility && (
              <DashletOption
                value={showFormWiseApplication}
                setValue={setShowFormWiseApplications}
                title="Program Wise Performance"
              />
            )}

            {systemPreference && systemPreference?.preference && (
              <DashletOption
                value={showPreferenceWiseApplication}
                setValue={setShowPreferenceWiseApplications}
                title="Preference Wise Performance"
              />
            )}
            {dashboardFeatures?.["20c9aaa4"]?.visibility && (
              <DashletOption
                value={showSourceWiseLeadDetail}
                setValue={setShowSourceWiseLeadDetail}
                title="Source Wise Lead"
              />
            )}

            {dashboardFeatures?.["9398042e"]?.visibility && (
              <DashletOption
                value={showHeadCounselorList}
                setValue={setShowHeadCounselorList}
                title="Pending Followup"
              />
            )}

            <Button
              size="small"
              color="info"
              onClick={() => {
                addDataIntoCache(
                  "settingsCache",
                  window.location.origin,
                  settingsCacheData
                );
                setOpenWithHeader(false);
              }}
              variant="outlined"
            >
              Save
            </Button>
          </Box>
        </Drawer>
      </Box>
    </>
  );
}

export default React.memo(AdminHeader);
