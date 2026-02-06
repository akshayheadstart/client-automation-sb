import React, { useState, useEffect } from "react";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  useMediaQuery,
  SvgIcon,
} from "@mui/material";
import {
  Engineering as EngineeringIcon,
  LibraryBooks,
  DvrOutlined,
  StackedBarChartOutlined,
  QueryStatsOutlined,
} from "@mui/icons-material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import ExpandLess from "@mui/icons-material/ExpandLess";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SimpleBar from "simplebar-react";
import { useNavigate, useLocation } from "react-router-dom";
import CallLogsIcon from "../../../icons/calling.svg";
import SidebarLink from "../../shared/SIdebarLink/SidebarLink";
import { checkMenu } from "../../../helperFunctions/checkMenu";
import headStartLogo from "../../../images/head-start-logo.jpg";
import Logo from "../../../images/updated-apollo-logo.png";
import { sidebarIcons } from "./sidebarIcons";
import { forEach } from "lodash";

import "./Sidebar.css";
import "simplebar-react/dist/simplebar.min.css";
import CallLogIcon from "../../../icons/CallLogIcon";

const SidebarV2 = (props) => {
  const { open, onClose, width, fixed, permissions, isActionDisable } = props;
  const [dashboardOpened, setDashboardOpened] = React.useState(false);
  const [leadManager, setLeadManager] = React.useState(false);
  const [clientManager, setClientManager] = React.useState(false);
  const [offlineData, setOfflineData] = useState(false);
  const [applicationFormOpened, setApplicationFormOpened] =
    React.useState(false);
  const [callLogsOpened, setCallLogsOpened] = React.useState(false);
  const [campManager, setCampManager] = React.useState(false);
  const [userControlAccess, setUserControlAccess] = React.useState(false);
  const [formDeskOpen, setFormDeskOpen] = React.useState(false);
  const [applicationManagerOpen, setApplicationManagerOpen] =
    React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  const [queryManagerOpen, setQueryManagerOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [templateOpen, setTemplateOpen] = React.useState(false);
  const [automationOpen, setAutomationOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [campaignPerformanceOpen, setCampaignPerformanceOpen] = useState(false);
  const [interviewManagerOpen, setInterviewManagerOpen] = useState(false);

  const [courseManagementOpen, setCourseManagementOpen] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState(
    localStorage.getItem("selectedMenu") || "dashboard"
  );
  const [callManagerOpen, setCallManagerOpen] = React.useState(false);
  const [dataSegmentManagerOpen, setDataSegmentManagerOpen] =
    React.useState(false);
  const [resourcesOpen, setResourcesOpen] = React.useState(false);
  const [voucherManagerOpen, setVoucherManagerOpen] = React.useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  React.useEffect(() => {
    if (location?.pathname) {
      const menuPaths = {
        dashboard: [
          "/",
          "/traffic-dashboard",
          "/feature-configuration-dashboard",
          "/publisher-dashboard",
          "/counselor-dashboard",
          "/authorized-approver-dashboard",
          "/panelist-dashboard",
          "/benchmarking-dashboard",
          "/trend-analysis",
          "/student-quality-index",
          "/qa-manager",
          "/management-dashboard",
          "/account-manager-dashboard",
          "/billing-manager-dashboard",
        ],
        dataSegmentManager: ["/data-segment-manager"],
        callManager: ["/qcd-calls", "/qcd-rejected-calls"],
        applicationForm: ["/in-app-call-logs", "/communicationPerformance"],
        clientManager: ["/pendingApproval", "/listOfColleges", "/billing"],
        courseManagement: ["/manage-courses"],
        leadManager: [
          "/lead-manager",
          "/form-manager",
          "/scoring",
          "/leadGenerateForm",
          "/leadUpload",
        ],
        applicationManager: [
          "/application-manager",
          "/paid-applications",
          "/scoring",
          "/leadGenerateForm",
          "/leadUpload",
        ],
        campManager: ["/campaign-manager", "/event-mapping"],
        interviewManager: [
          "/interview-list",
          "/planner",
          "/panelist-manager",
          "/selection-procedure",
        ],
        userControlAccess: [
          "/users/user-manager",
          "/create-feature-and-permission",
          "/view-feature-and-permission",
          "/view-grouped-feature-and-permission",
          "/reports/download-request-list",
          "/users/manage-sessions",
          "/users/activity",
          "/client-registration",
          "/client-onboarding",
          "/create-user",
          "/add-configuration-details",
          "/create-client",
          "/view-all-clients",
          "/view-all-colleges",
          "/user-permission",
          "/features",
          "/counsellor-manager",
          "/create-account",
          "/create-super-account-manager",
          "/form-management",
          "/create-college",
          "/users/user-manager-permission",
          "/role-management",
        ],
        formDesk: [
          "/form-manager",
          "/manage-forms",
          "/manage-documents",
          "/manage-exam",
        ],
        marketing: ["/marketing"],
        queryManager: ["/query-manager"],
        report: ["/reports-analytics"],
        automation: ["/createCampaign", "/automation", "/automationBeta"],
        template: [
          "/widget",
          "/create-script",
          "/basic-layout",
          "/basic-layout",
          "/basic-layout",
          "/manage-communication-template",
          "/create-view-template",
        ],
        offlineData: [
          "/rawDataUpload",
          "/view-raw-data",
          "/raw-data-upload-history",
        ],
        campaignPerformance: ["/all-source-leads"],
        settings: ["/settings", "/voucher-promoCode-manager"],
        resources: ["/resources"],
        voucherManager: ["/voucher-manager"],
      };
      let currMenu = "";
      // require lodash forEach to break the loop when we got the value.
      forEach(Object.keys(menuPaths), (key) => {
        if (menuPaths[key]?.includes(location?.pathname)) {
          currMenu = key;
          return false;
        }
      });
      setSelectedMenu(currMenu);
      localStorage.setItem("selectedMenu", currMenu);
    }
  }, [location]);

  const collapseHandle = (name) => {
    if (selectedMenu) {
      name === "dashboard"
        ? setDashboardOpened(!dashboardOpened)
        : setDashboardOpened(false);
      name === "leadManager"
        ? setLeadManager(!leadManager)
        : setLeadManager(false);
      name === "clientManager"
        ? setClientManager(!clientManager)
        : setClientManager(false);
      name === "offlineData"
        ? setOfflineData(!offlineData)
        : setOfflineData(false);
      name === "applicationForm"
        ? setApplicationFormOpened(!applicationFormOpened)
        : setApplicationFormOpened(false);
      name === "callLogs"
        ? setCallLogsOpened((prev) => !prev)
        : setCallLogsOpened(false);
      name === "campManager"
        ? setCampManager(!campManager)
        : setCampManager(false);
      name === "userControlAccess"
        ? setUserControlAccess(!userControlAccess)
        : setUserControlAccess(false);
      name === "formDesk"
        ? setFormDeskOpen(!formDeskOpen)
        : setFormDeskOpen(false);
      name === "applicationManager"
        ? setApplicationManagerOpen(!applicationManagerOpen)
        : setApplicationManagerOpen(false);
      name === "marketing" ? setMarketing(!marketing) : setMarketing(false);
      name === "queryManager"
        ? setQueryManagerOpen(!queryManagerOpen)
        : setQueryManagerOpen(false);
      name === "report" ? setReportOpen(!reportOpen) : setReportOpen(false);
      name === "template"
        ? setTemplateOpen(!templateOpen)
        : setTemplateOpen(false);
      name === "automation"
        ? setAutomationOpen(!automationOpen)
        : setAutomationOpen(false);
      name === "settings"
        ? setSettingsOpen(!settingsOpen)
        : setSettingsOpen(false);
      name === "campaignPerformance"
        ? setCampaignPerformanceOpen(!campaignPerformanceOpen)
        : setCampaignPerformanceOpen(false);
      name === "interviewManager"
        ? setInterviewManagerOpen(!interviewManagerOpen)
        : setInterviewManagerOpen(false);
      name === "courseManagement"
        ? setCourseManagementOpen(!courseManagementOpen)
        : setCourseManagementOpen(false);
      name === "callManager"
        ? setCallManagerOpen(!callManagerOpen)
        : setCallManagerOpen(false);
      name === "dataSegmentManager"
        ? setDataSegmentManagerOpen(!dataSegmentManagerOpen)
        : setDataSegmentManagerOpen(false);
      name === "resources"
        ? setResourcesOpen(!resourcesOpen)
        : setResourcesOpen(false);
      name === "voucherManager"
        ? setVoucherManagerOpen(!voucherManagerOpen)
        : setVoucherManagerOpen(false);
    }

    setSelectedMenu(name ? name : selectedMenu);
  };

  useEffect(() => {
    if (open) {
      return onClose?.();
    }
  });

  const appIcon = (
    <Box>
      <img
        onClick={() => {
          localStorage.setItem("selectedMenu", "dashboard");
          setSelectedMenu("dashboard");
          navigate("/");
        }}
        width="50px"
        style={{
          margin: "26px 16px 16px",
          cursor: "pointer",
        }}
        src={headStartLogo}
        data-testid="app-logo"
        alt="logo"
      />
    </Box>
  );

  const content = (
    <SimpleBar style={{ maxHeight: "100%", overflowX: "hidden" }}>
      {permissions && (
        <Box className="sidebar-wrapper" sx={{ height: "100%" }}>
          <div>
            {/* -------- Dashboard -------- */}
            {permissions?.["aefd607c"]?.visibility && (
              <List>
                <ListItemButton
                  data-testid="sidebar-dashboard"
                  onClick={() => collapseHandle("dashboard")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "dashboard" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "dashboard" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon viewBox="0 0 20 20">
                        {sidebarIcons.dashboard}
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["aefd607c"]?.name}
                    />
                    {selectedMenu === "dashboard" && !dashboardOpened ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {dashboardOpened ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse in={dashboardOpened} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {/* e7d559dc - Admin Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["e7d559dc"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/admin-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["e7d559dc"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 1d802b76 - Feature Configuration Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["1d802b76"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/feature-configuration-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["1d802b76"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 747bc08f - Publisher Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["747bc08f"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/publisher-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["747bc08f"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* c2a62998 - Counsellor Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["c2a62998"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/counselor-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["c2a62998"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* b7f40769 - Authorized Approver Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["b7f40769"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/authorized-approver-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["b7f40769"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* f093f963 - Panelist Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["f093f963"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/panelist-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["f093f963"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* b27012fd - Communication Performance */}
                        {permissions?.["aefd607c"]?.features?.["b27012fd"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/communication-summary"
                            content={
                              permissions?.["aefd607c"]?.features?.["b27012fd"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 1c1c9ffe - Telephony */}
                        {permissions?.["aefd607c"]?.features?.["1c1c9ffe"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/telephony-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["1c1c9ffe"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 72a10913 - QA Manager */}
                        {permissions?.["aefd607c"]?.features?.["72a10913"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/qa-manager"
                            content={
                              permissions?.["aefd607c"]?.features?.["72a10913"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 86942672 - Request Management Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["86942672"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/management-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["86942672"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 0e01b24b - Account Manager Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["0e01b24b"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/account-manager-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["0e01b24b"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* ee598d8b - Billing Manager Dashboard */}
                        {permissions?.["aefd607c"]?.features?.["ee598d8b"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/billing-manager-dashboard"
                            content={
                              permissions?.["aefd607c"]?.features?.["ee598d8b"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>
                <Divider light />
              </List>
            )}

            {/* --Data Segment Manager-- */}
            {permissions?.["4e968cbd"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-campaign-manger"
                  onClick={() => collapseHandle("dataSegmentManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "dataSegmentManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "dataSegmentManager"
                          ? "menu-active"
                          : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.dataSegmentManager}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["4e968cbd"]?.name}
                    />
                    {selectedMenu === "dataSegmentManager" &&
                    !dataSegmentManagerOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {dataSegmentManagerOpen ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : dataSegmentManagerOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {/* 4cbd834b - Data Segment */}
                        {permissions?.["4e968cbd"]?.features?.["4cbd834b"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/data-segment-manager"
                            content={
                              permissions?.["4e968cbd"]?.features?.["4cbd834b"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/*-------- Call Manager ------*/}
            {permissions?.["fe305f26"]?.visibility && (
              <List>
                <ListItemButton
                  data-testid="call-manager"
                  onClick={() => collapseHandle("callManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "callManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "callManager" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.callManager}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["fe305f26"]?.name}
                    />
                    {selectedMenu === "callManager" && !callManagerOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {callManagerOpen ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse in={callManagerOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {permissions?.["fe305f26"]?.features?.["fb818b74"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/qcd-calls"
                            content={
                              permissions?.["fe305f26"]?.features?.["fb818b74"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["fe305f26"]?.features?.["39b0bee8"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/qcd-rejected-calls"
                            content={
                              permissions?.["fe305f26"]?.features?.["39b0bee8"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>
              </List>
            )}

            {/* -------- Application form -------- */}
            {permissions?.["650dffa2"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-application-forms"
                  onClick={() => collapseHandle("applicationForm")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "applicationForm" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "applicationForm" ? "menu-active" : ""
                      }`}
                    >
                      {sidebarIcons.applicationForm}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["650dffa2"]?.name}
                    />
                    {selectedMenu === "applicationForm" &&
                    !applicationFormOpened ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {applicationFormOpened ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : applicationFormOpened}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {permissions?.["650dffa2"]?.features?.["204eba2f"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/in-app-call-logs"
                            content={
                              permissions?.["650dffa2"]?.features?.["204eba2f"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["650dffa2"]?.features?.["6bd553f2"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/communicationPerformance"
                            content={
                              permissions?.["650dffa2"]?.features?.["6bd553f2"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -------- Call logs -------- */}
            {permissions?.["3725c151"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-application-forms"
                  onClick={() => collapseHandle("callLogs")}
                  className={`sidebar-menu-item sidebar-call-log-menu flex-col ${
                    selectedMenu === "callLogs" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "callLogs" ? "menu-active" : ""
                      } call-logs`}
                    >
                      <CallLogIcon isActive={selectedMenu === "callLogs"} />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["3725c151"]?.name}
                    />
                    {selectedMenu === "callLogs" && !callLogsOpened ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {callLogsOpened ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : callLogsOpened}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {permissions?.["3725c151"]?.features?.["38094f31"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/call-logs"
                            content={
                              permissions?.["3725c151"]?.features?.["38094f31"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/*-------Client Manager----- */}
            {/* duplicated by the new development on client automation */}
            {/* <List>
              <ListItemButton
                disabled={isActionDisable}
                data-testid="sidebar application form"
                onClick={() => collapseHandle("clientManager")}
                className={`sidebar-menu-item  flex-col ${
                  selectedMenu === "clientManager" ? "menu-active" : ""
                }`}
              >
                <Box className="center-align">
                  <ListItemIcon
                    className={`center-align-row list-item-icon ${
                      selectedMenu === "clientManager" ? "menu-active" : ""
                    }`}
                  >
                    <EngineeringIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: "sidebar-label-text",
                    }}
                    primary="Client Manager"
                  />
                  {selectedMenu === "clientManager" && !clientManager ? (
                    <KeyboardArrowRightIcon />
                  ) : null}
                  {clientManager ? <ExpandLess /> : null}
                </Box>
                <Box className="full-width">
                  <Collapse
                    in={isActionDisable ? false : clientManager}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <>
                        {!isActionDisable && (
                          <SidebarLink
                            onClose={onClose}
                            link="/pendingApproval"
                            content="Pending Approval"
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </>

                      <>
                        {!isActionDisable && (
                          <SidebarLink
                            onClose={onClose}
                            link="/listOfColleges"
                            content="Manage Client"
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </>

                      <>
                        {!isActionDisable && (
                          <SidebarLink
                            onClose={onClose}
                            link="/billing"
                            content="Billing"
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </>
                    </List>
                  </Collapse>
                </Box>
              </ListItemButton>

              <Divider light />
            </List> */}

            {/*-------Course Management----- */}
            {/* Functionality is not implemented yet  */}
            {/* <List>
              <ListItemButton
                disabled={isActionDisable}
                data-testid="sidebar-couse-management"
                onClick={() => collapseHandle("courseManagement")}
                className={`sidebar-menu-item  flex-col ${
                  selectedMenu === "courseManagement" ? "menu-active" : ""
                }`}
              >
                <Box className="center-align">
                  <ListItemIcon>
                    <LibraryBooks />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: "sidebar-label-text",
                    }}
                    primary="Couse Management"
                  />
                  {selectedMenu === "courseManagement" &&
                  !courseManagementOpen ? (
                    <KeyboardArrowRightIcon />
                  ) : null}
                  {courseManagementOpen ? <ExpandLess /> : null}
                </Box>
                <Box className="full-width">
                  <Collapse
                    in={isActionDisable ? false : courseManagementOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <SidebarLink
                        onClose={onClose}
                        link="/manage-courses"
                        content="Manage Courses"
                        contentClass="sidebar-sublabel-text"
                        linkClass="no-text-decoration"
                        selectedMenu={selectedMenu}
                      />
                    </List>
                  </Collapse>
                </Box>
              </ListItemButton>
            </List> */}

            {/*-------Lead Manager----- */}
            {permissions?.["2c7f9a8e"]?.visibility && (
              <List>
                <ListItemButton
                  data-testid="sidebar-lead-manager"
                  onClick={() => collapseHandle("leadManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "leadManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "leadManager" ? "menu-active" : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        className="sidebar-svg-icons"
                      >
                        <path d="M7.63399 10.3033C7.60898 10.3033 7.59232 10.3033 7.56732 10.3033C7.52565 10.295 7.46732 10.295 7.41732 10.3033C5.00065 10.2283 3.17565 8.32829 3.17565 5.98662C3.17565 3.60329 5.11732 1.66162 7.50065 1.66162C9.88399 1.66162 11.8257 3.60329 11.8257 5.98662C11.8173 8.32829 9.98398 10.2283 7.65898 10.3033C7.65065 10.3033 7.64232 10.3033 7.63399 10.3033ZM7.50065 2.91162C5.80898 2.91162 4.42565 4.29495 4.42565 5.98662C4.42565 7.65329 5.72565 8.99496 7.38399 9.05329C7.43399 9.04495 7.54232 9.04495 7.65065 9.05329C9.28399 8.97829 10.5673 7.63662 10.5757 5.98662C10.5757 4.29495 9.19232 2.91162 7.50065 2.91162Z" />
                        <path d="M7.64232 19.4116C6.00899 19.4116 4.36732 18.995 3.12565 18.1616C1.96732 17.395 1.33398 16.345 1.33398 15.2033C1.33398 14.0616 1.96732 13.0033 3.12565 12.2283C5.62565 10.57 9.67565 10.57 12.159 12.2283C13.309 12.995 13.9507 14.045 13.9507 15.1866C13.9507 16.3283 13.3173 17.3866 12.159 18.1616C10.909 18.995 9.27565 19.4116 7.64232 19.4116ZM3.81732 13.2783C3.01732 13.8116 2.58398 14.495 2.58398 15.2116C2.58398 15.92 3.02565 16.6033 3.81732 17.1283C5.89232 18.52 9.39232 18.52 11.4673 17.1283C12.2673 16.595 12.7007 15.9116 12.7007 15.195C12.7007 14.4866 12.259 13.8033 11.4673 13.2783C9.39232 11.895 5.89232 11.895 3.81732 13.2783Z" />
                        <path d="M15.2844 17.9118C14.9928 17.9118 14.7344 17.7118 14.6761 17.4118C14.6094 17.0701 14.8261 16.7451 15.1594 16.6701C15.6844 16.5618 16.1678 16.3535 16.5428 16.0618C17.0178 15.7035 17.2761 15.2535 17.2761 14.7785C17.2761 14.3035 17.0178 13.8535 16.5511 13.5035C16.1844 13.2201 15.7261 13.0201 15.1844 12.8951C14.8511 12.8201 14.6344 12.4868 14.7094 12.1451C14.7844 11.8118 15.1178 11.5951 15.4594 11.6701C16.1761 11.8285 16.8011 12.1118 17.3094 12.5035C18.0844 13.0868 18.5261 13.9118 18.5261 14.7785C18.5261 15.6451 18.0761 16.4701 17.3011 17.0618C16.7844 17.4618 16.1344 17.7535 15.4178 17.8951C15.3678 17.9118 15.3261 17.9118 15.2844 17.9118Z" />
                        <path d="M13.784 10.4115C13.759 10.4115 13.734 10.4115 13.709 10.4031C13.3673 10.4365 13.0173 10.1948 12.984 9.85312C12.9506 9.51146 13.159 9.20313 13.5006 9.16146C13.6006 9.15313 13.709 9.15312 13.8006 9.15312C15.0173 9.08646 15.9673 8.08646 15.9673 6.86146C15.9673 5.59479 14.9423 4.56979 13.6756 4.56979C13.334 4.57812 13.0506 4.29479 13.0506 3.95312C13.0506 3.61146 13.334 3.32812 13.6756 3.32812C15.6256 3.32812 17.2173 4.91979 17.2173 6.86979C17.2173 8.78646 15.7173 10.3365 13.809 10.4115C13.8006 10.4115 13.7923 10.4115 13.784 10.4115Z" />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["2c7f9a8e"]?.name}
                    />
                    {selectedMenu === "leadManager" && !leadManager ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {leadManager ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse in={leadManager} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {permissions["2c7f9a8e"]?.features?.["4f90cda0"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/lead-manager"
                            content={
                              permissions["2c7f9a8e"]?.features?.["4f90cda0"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions["2c7f9a8e"]?.features?.["12d3cafc"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/form-manager"
                            content={
                              permissions["2c7f9a8e"]?.features?.["12d3cafc"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions["2c7f9a8e"]?.features?.["695f1b55"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/leadGenerateForm"
                            content={
                              permissions["2c7f9a8e"]?.features?.["695f1b55"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions["2c7f9a8e"]?.features?.["bc192ec0"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/leadUpload"
                            content={
                              permissions["2c7f9a8e"]?.features?.["bc192ec0"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions["2c7f9a8e"]?.features?.["6c6b5527"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/pending-leads"
                            content={
                              permissions["2c7f9a8e"]?.features?.["6c6b5527"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>
                <Divider light />
              </List>
            )}

            {/* --Application Manager-- */}
            {permissions?.["9c53d75c"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-application-manager"
                  onClick={() => collapseHandle("applicationManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "applicationManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "applicationManager"
                          ? "menu-active"
                          : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.applicationManager}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["9c53d75c"]?.name}
                    />
                    {selectedMenu === "applicationManager" &&
                    !applicationManagerOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {applicationManagerOpen ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : applicationManagerOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {/* 79e29279 - View All Applications */}
                        {permissions?.["9c53d75c"]?.features?.["79e29279"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/application-manager"
                            content={
                              permissions?.["9c53d75c"]?.features?.["79e29279"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* 2faa8dc6 - Paid Applications */}
                        {permissions?.["9c53d75c"]?.features?.["2faa8dc6"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/paid-applications"
                            content={
                              permissions?.["9c53d75c"]?.features?.["2faa8dc6"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* afebac24 - Create a Lead */}
                        {permissions?.["9c53d75c"]?.features?.["afebac24"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/leadGenerateForm"
                            content={
                              permissions?.["9c53d75c"]?.features?.["afebac24"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* a2c27c7c - Upload Leads */}
                        {permissions?.["9c53d75c"]?.features?.["a2c27c7c"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/leadUpload"
                            content={
                              permissions?.["9c53d75c"]?.features?.["a2c27c7c"]
                                ?.name
                            }
                            selectedMenu={selectedMenu}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                          />
                        )}

                        {/* Commented scoring - not in permissions */}
                        {/*
              <SidebarLink
                onClose={onClose}
                link="/scoring"
                content="Scoring"
                selectedMenu={selectedMenu}
                contentClass="sidebar-sublabel-text"
                linkClass="no-text-decoration"
              />
            */}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* --Campaign Manager---- */}
            {permissions?.["480501f4"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-campaign-manger"
                  onClick={() => collapseHandle("campManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "campManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "campManager" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.campManager}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["480501f4"]?.name}
                    />
                    {selectedMenu === "campManager" && !campManager ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {campManager ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : campManager}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {permissions?.["480501f4"]?.features?.["4a8e33fb"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/campaign-manager"
                            content={
                              permissions?.["480501f4"]?.features?.["4a8e33fb"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["480501f4"]?.features?.["5ea710e6"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/event-mapping"
                            content={
                              permissions?.["480501f4"]?.features?.["5ea710e6"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* {Interview manager} */}
            {permissions?.["7ac6047b"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-campaign-manger"
                  onClick={() => collapseHandle("interviewManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "interviewManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "interviewManager" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.interviewModule}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["7ac6047b"]?.name}
                    />
                    {selectedMenu === "interviewManager" &&
                    !interviewManagerOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {interviewManagerOpen ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : interviewManagerOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {permissions?.["7ac6047b"]?.features?.["cc9c2686"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/interview-list"
                            content={
                              permissions?.["7ac6047b"]?.features?.["cc9c2686"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["7ac6047b"]?.features?.["4db85868"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/planner"
                            content={
                              permissions?.["7ac6047b"]?.features?.["4db85868"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["7ac6047b"]?.features?.["593cba15"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/panelist-manager"
                            content={
                              permissions?.["7ac6047b"]?.features?.["593cba15"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["7ac6047b"]?.features?.["5e7d7061"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/selection-procedure"
                            content={
                              permissions?.["7ac6047b"]?.features?.["5e7d7061"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----User Access Control----- */}
            {permissions?.["817c5d6d"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-user-access-control"
                  onClick={() => collapseHandle("userControlAccess")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "userControlAccess" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "userControlAccess"
                          ? "menu-active"
                          : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.userAccessControl}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["817c5d6d"]?.name}
                    />
                    {selectedMenu === "userControlAccess" &&
                    !userControlAccess ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {userControlAccess ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : userControlAccess}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {permissions["817c5d6d"].features?.["f8c83200"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/users/user-manager"
                            content={
                              permissions["817c5d6d"].features?.["f8c83200"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["0e1802d2"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-feature-and-permission"
                            content={
                              permissions["817c5d6d"].features?.["0e1802d2"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["b6b5e453"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/view-feature-and-permission"
                            content={
                              permissions["817c5d6d"].features?.["b6b5e453"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                            state={{ selectedFeatures: [] }}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["c4631809"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/view-grouped-feature-and-permission"
                            content={
                              permissions["817c5d6d"].features?.["c4631809"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["ed0d4368"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/reports/download-request-list"
                            content={
                              permissions["817c5d6d"].features?.["ed0d4368"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["a8e8b88f"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/users/manage-sessions"
                            content={
                              permissions["817c5d6d"].features?.["a8e8b88f"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["540cfdd0"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/client-registration"
                            content={
                              permissions["817c5d6d"].features?.["540cfdd0"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["eb8f5ddb"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-college"
                            content={
                              permissions["817c5d6d"].features?.["eb8f5ddb"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["6b155205"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/form-management"
                            content={
                              permissions["817c5d6d"].features?.["6b155205"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["c3486702"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-client"
                            content={
                              permissions["817c5d6d"].features?.["c3486702"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["14d6046b"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/view-all-clients"
                            content={
                              permissions["817c5d6d"].features?.["14d6046b"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["0a330fee"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/view-all-colleges"
                            content={"View All Colleges"}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["f86d5ad2"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/client-onboarding-status"
                            content={"Client Onboarding Status"}
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions["817c5d6d"].features?.["85ac2dfe"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-user"
                            content={
                              permissions["817c5d6d"].features?.["85ac2dfe"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["86d1298b"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-account"
                            content={
                              permissions["817c5d6d"].features?.["86d1298b"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["96f85315"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/create-super-account-manager"
                            content={
                              permissions["817c5d6d"].features?.["96f85315"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {/* {permissions["817c5d6d"].features?.["1d279536"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/user-permission"
                            content={
                              permissions["817c5d6d"].features?.["1d279536"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )} */}
                        {permissions["817c5d6d"].features?.["0d9a0866"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/users/user-manager-permission"
                            content={
                              permissions["817c5d6d"].features?.["0d9a0866"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {permissions["817c5d6d"].features?.["a82a95b6"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/role-management"
                            content={
                              permissions["817c5d6d"].features?.["a82a95b6"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                        {/* {permissions["817c5d6d"].features?.["45d79063"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/features"
                            content={
                              permissions["817c5d6d"].features?.["45d79063"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )} */}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>
                <Divider light />
              </List>
            )}

            {/* ----Form Desk----- */}
            {/* Functionality is not implemented yet */}
            {/* <List>
              <ListItemButton
                disabled={isActionDisable}
                data-testid="sidebar-form-desk"
                onClick={() => collapseHandle("formDesk")}
                className={`sidebar-menu-item flex-col ${
                  selectedMenu === "formDesk" ? "menu-active" : ""
                }`}
              >
                <Box className="center-align">
                  <ListItemIcon
                    className={`center-align-row list-item-icon ${
                      selectedMenu === "formDesk" ? "menu-active" : ""
                    }`}
                  >
                    <DvrOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: "sidebar-label-text",
                    }}
                    primary="Form Desk"
                  />
                  {selectedMenu === "formDesk" && !formDeskOpen ? (
                    <KeyboardArrowRightIcon />
                  ) : null}
                  {formDeskOpen ? <ExpandLess /> : null}
                </Box>

                <Box className="full-width">
                  <Collapse
                    in={isActionDisable ? false : formDeskOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <>
                        {!isActionDisable && (
                          <SidebarLink
                            onClose={onClose}
                            link="/form-manager"
                            content="Document Listing"
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </>

                      <SidebarLink
                        onClose={onClose}
                        link="/manage-forms"
                        content="Manage Forms"
                        contentClass="sidebar-sublabel-text"
                        linkClass="no-text-decoration"
                        selectedMenu={selectedMenu}
                      />

                      <SidebarLink
                        onClose={onClose}
                        link="/manage-documents"
                        content="Manage Documents"
                        contentClass="sidebar-sublabel-text"
                        linkClass="no-text-decoration"
                        selectedMenu={selectedMenu}
                      />

                      <SidebarLink
                        onClose={onClose}
                        link="/manage-exam"
                        content="Manage Exam"
                        contentClass="sidebar-sublabel-text"
                        linkClass="no-text-decoration"
                        selectedMenu={selectedMenu}
                      />
                    </List>
                  </Collapse>
                </Box>
              </ListItemButton>
              <Divider light />
            </List> */}

            {/* -----Marketing------ */}
            {/* {permissions?.menus?.marketing?.marketing?.menu && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  onClick={() => collapseHandle("marketing")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "marketing" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "marketing" ? "menu-active" : ""
                      }`}
                    >
                      <StackedBarChartOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary="Marketing"
                    />
                    {selectedMenu === "marketing" && !marketing ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {marketing ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : marketing}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <SidebarLink
                          onClose={onClose}
                          link="/marketing"
                          content="Marketing"
                          contentClass="sidebar-sublabel-text"
                          linkClass="no-text-decoration"
                          selectedMenu={selectedMenu}
                        />
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>
                <Divider light />
              </List>
            )} */}

            {/* -----Query manager------ */}
            {/* duplicated by our query manager on admin dashboard */}
            {/* <List>
              <ListItemButton
                disabled={isActionDisable}
                data-testid="sidebar-query-manager"
                onClick={() => collapseHandle("queryManager")}
                className={`sidebar-menu-item flex-col ${
                  selectedMenu === "queryManager" ? "menu-active" : ""
                }`}
              >
                <Box className="center-align">
                  <ListItemIcon
                    className={`center-align-row list-item-icon ${
                      selectedMenu === "queryManager" ? "menu-active" : ""
                    }`}
                  >
                    <QueryStatsOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: "sidebar-label-text",
                    }}
                    primary="Query manager"
                  />
                  {selectedMenu === "queryManager" && !queryManagerOpen ? (
                    <KeyboardArrowRightIcon />
                  ) : null}
                  {queryManagerOpen ? <ExpandLess /> : null}
                </Box>

                <Box className="full-width">
                  <Collapse
                    in={isActionDisable ? false : queryManagerOpen}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List
                      data-testid="sidebar-query-manager-item"
                      component="div"
                      disablePadding
                    >
                      <SidebarLink
                        onClose={onClose}
                        link="/query-manager"
                        content="Query manager"
                        contentClass="sidebar-sublabel-text"
                        linkClass="no-text-decoration"
                        selectedMenu={selectedMenu}
                      />
                    </List>
                  </Collapse>
                </Box>
              </ListItemButton>

              <Divider light />
            </List> */}

            {/* -----Reports and Analytics------ */}
            {permissions?.["4be9770f"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  onClick={() => collapseHandle("report")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "report" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "report" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.reportsAndAnalytics}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["4be9770f"]?.name}
                    />
                    {selectedMenu === "report" && !reportOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {reportOpen ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : reportOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        <>
                          {!isActionDisable &&
                            permissions?.["4be9770f"]?.features?.["98a5f78c"]
                              ?.visibility && (
                              <SidebarLink
                                onClose={onClose}
                                link="/reports-analytics"
                                content={
                                  permissions?.["4be9770f"]?.features?.[
                                    "98a5f78c"
                                  ]?.name
                                }
                                contentClass="sidebar-sublabel-text"
                                linkClass="no-text-decoration"
                                selectedMenu={selectedMenu}
                              />
                            )}
                        </>
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----Automation------ */}
            {permissions?.["b495f3bb"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  onClick={() => collapseHandle("automation")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "automation" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "automation" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.automationIcon}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["b495f3bb"]?.name}
                    />
                    {selectedMenu === "automation" && !automationOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {automationOpen ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : automationOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {!isActionDisable &&
                          permissions?.["b495f3bb"]?.features?.["4fbf747f"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/automationBeta"
                              content={
                                permissions?.["b495f3bb"]?.features?.[
                                  "4fbf747f"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["b495f3bb"]?.features?.["ca8ed51b"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/automation-manager?redirect=create-automation"
                              content={
                                permissions?.["b495f3bb"]?.features?.[
                                  "ca8ed51b"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["b495f3bb"]?.features?.["2c7f9a8w"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/automation-manager"
                              content={
                                permissions?.["b495f3bb"]?.features?.[
                                  "2c7f9a8w"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* {Template Manager} */}

            {permissions?.["4d5eb330"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  data-testid="sidebar-template-manager"
                  onClick={() => collapseHandle("template")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "template" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "template" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.templateManager}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["4d5eb330"]?.name}
                    />
                    {selectedMenu === "template" && !templateOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {templateOpen ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : templateOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {!isActionDisable &&
                          permissions?.["4d5eb330"]?.features?.["d30abcb1"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/widget"
                              content={
                                permissions?.["4d5eb330"]?.features?.[
                                  "d30abcb1"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["4d5eb330"]?.features?.["d2c99ca3"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/create-view-template"
                              content={
                                permissions?.["4d5eb330"]?.features?.[
                                  "d2c99ca3"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["4d5eb330"]?.features?.["5b95f3f3"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/media-gallery"
                              content={
                                permissions?.["4d5eb330"]?.features?.[
                                  "5b95f3f3"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["4d5eb330"]?.features?.["3dbd1628"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/manage-communication-template"
                              content={
                                permissions?.["4d5eb330"]?.features?.[
                                  "3dbd1628"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----Offline Data------ */}
            {permissions?.["71a5cca0"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  onClick={() => collapseHandle("offlineData")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "offlineData" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "offlineData" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.offlineData}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["71a5cca0"]?.name}
                    />

                    {selectedMenu === "offlineData" && !offlineData ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {offlineData ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : offlineData}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {!isActionDisable &&
                          permissions?.["71a5cca0"]?.features?.["e8f3ead9"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/rawDataUpload"
                              content={
                                permissions?.["71a5cca0"]?.features?.[
                                  "e8f3ead9"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["71a5cca0"]?.features?.["331ecdde"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/view-raw-data"
                              content={
                                permissions?.["71a5cca0"]?.features?.[
                                  "331ecdde"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}

                        {!isActionDisable &&
                          permissions?.["71a5cca0"]?.features?.["fb75d814"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/raw-data-upload-history"
                              content={
                                permissions?.["71a5cca0"]?.features?.[
                                  "fb75d814"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----Resources----- */}
            {permissions?.["6e9fc9f1"]?.visibility && (
              <List>
                <ListItemButton
                  disabled={isActionDisable}
                  onClick={() => collapseHandle("resources")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "resources" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "resources" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.resources}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["6e9fc9f1"]?.name}
                    />

                    {selectedMenu === "resources" && !resourcesOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {resourcesOpen ? <ExpandLess /> : null}
                  </Box>

                  <Box className="full-width">
                    <Collapse
                      in={isActionDisable ? false : resourcesOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {!isActionDisable &&
                          permissions?.["6e9fc9f1"]?.features?.["44ef4e3c"]
                            ?.visibility && (
                            <SidebarLink
                              onClose={onClose}
                              link="/resources"
                              content={
                                permissions?.["6e9fc9f1"]?.features?.[
                                  "44ef4e3c"
                                ]?.name
                              }
                              contentClass="sidebar-sublabel-text"
                              linkClass="no-text-decoration"
                              selectedMenu={selectedMenu}
                            />
                          )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----Campaign Performance------ */}
            {/* This was replaced by campaign manager, no need of this for now */}
            {/* <List>
              <ListItemButton
                disabled={isActionDisable}
                onClick={() => collapseHandle("campaignPerformance")}
                className={`sidebar-menu-item flex-col ${
                  selectedMenu === "campaignPerformance" ? "menu-active" : ""
                }`}
              >
                <Box className="center-align">
                  <ListItemIcon
                    className={`center-align-row list-item-icon ${
                      selectedMenu === "campaignPerformance"
                        ? "menu-active"
                        : ""
                    }`}
                  >
                    <TrendingUpIcon />
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{
                      className: "sidebar-label-text",
                    }}
                    primary="Campaign Performance"
                  />
                  {selectedMenu === "campaignPerformance" &&
                  !campaignPerformanceOpen ? (
                    <KeyboardArrowRightIcon />
                  ) : null}
                  {campaignPerformanceOpen ? <ExpandLess /> : null}
                </Box>
              </ListItemButton>
              <Box className="full-width">
                <Collapse
                  in={isActionDisable ? false : campaignPerformanceOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <SidebarLink
                      onClose={onClose}
                      link="/all-source-leads"
                      content="All Source Leads"
                      contentClass="sidebar-sublabel-text"
                      linkClass="no-text-decoration"
                      selectedMenu={selectedMenu}
                    />
                  </List>
                </Collapse>
              </Box>
              <Divider light />
            </List> */}

            {/* -----Setting------ */}
            {permissions?.["ce7a1154"]?.visibility && (
              <List>
                <ListItemButton
                  data-testid="sidebar-setting"
                  onClick={() => collapseHandle("settings")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "settings" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "settings" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.settingsIcon}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["ce7a1154"]?.name}
                    />
                    {selectedMenu === "settings" && !settingsOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {settingsOpen ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                      <List
                        data-testid="sidebar-setting-item"
                        component="div"
                        disablePadding
                      >
                        {permissions?.["ce7a1154"]?.features?.["a47ced47"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/settings"
                            content={
                              permissions?.["ce7a1154"]?.features?.["a47ced47"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}

                        {permissions?.["ce7a1154"]?.features?.["2bf8b3f2"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/voucher-promoCode-manager"
                            content={
                              permissions?.["ce7a1154"]?.features?.["2bf8b3f2"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}

            {/* -----Voucher Publisher------ */}
            {permissions?.["b8d19da5"]?.visibility && (
              <List>
                <ListItemButton
                  data-testid="sidebar-setting"
                  onClick={() => collapseHandle("voucherManager")}
                  className={`sidebar-menu-item flex-col ${
                    selectedMenu === "voucherManager" ? "menu-active" : ""
                  }`}
                >
                  <Box className="center-align">
                    <ListItemIcon
                      className={`center-align-row list-item-icon ${
                        selectedMenu === "voucherManager" ? "menu-active" : ""
                      }`}
                    >
                      <SvgIcon>{sidebarIcons.voucherManagerIcon}</SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        className: "sidebar-label-text",
                      }}
                      primary={permissions?.["b8d19da5"]?.name}
                    />
                    {selectedMenu === "voucherManager" &&
                    !voucherManagerOpen ? (
                      <KeyboardArrowRightIcon />
                    ) : null}
                    {voucherManagerOpen ? <ExpandLess /> : null}
                  </Box>
                  <Box className="full-width">
                    <Collapse
                      in={voucherManagerOpen}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List
                        data-testid="sidebar-setting-item"
                        component="div"
                        disablePadding
                      >
                        {permissions?.["b8d19da5"]?.features?.["ccbb2d7a"]
                          ?.visibility && (
                          <SidebarLink
                            onClose={onClose}
                            link="/voucher-manager"
                            content={
                              permissions?.["b8d19da5"]?.features?.["ccbb2d7a"]
                                ?.name
                            }
                            contentClass="sidebar-sublabel-text"
                            linkClass="no-text-decoration"
                            selectedMenu={selectedMenu}
                          />
                        )}
                      </List>
                    </Collapse>
                  </Box>
                </ListItemButton>

                <Divider light />
              </List>
            )}
          </div>
        </Box>
      )}
    </SimpleBar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        onMouseLeave={() => collapseHandle()}
        PaperProps={{
          sx: {
            transition: "all 0.2s",
            width: fixed ? width : 80,
            overflow: "hidden",
            "&:hover": {
              width: 282,
            },
            pb: 0,
          },
        }}
        variant="permanent"
        className="sidebar-scroll"
      >
        {appIcon}
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      onMouseLeave={() => collapseHandle()}
      PaperProps={{
        sx: {
          transition: "all 0.2s",
          width: fixed ? width : 0,
          "&:hover": {
            width: 282,
          },
          pb: 0,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="permanent"
      className="sidebar-scroll"
    >
      {appIcon}
      {content}
    </Drawer>
  );
};

export default SidebarV2;
