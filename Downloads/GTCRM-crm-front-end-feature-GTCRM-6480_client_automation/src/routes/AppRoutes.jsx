import Cookies from "js-cookie";
import React, { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import InterviewList from "../pages/Interview/InterviewList";
import ViewStudentListPage from "../pages/StudentListPages/ViewStudentListPage";
import SelectedStudent from "../pages/SelectedStudent/SelectedStudent";
import SelectionProcedure from "../pages/Interview/SelectionProcedure/SelectionProcedure";
import CreateAndViewAutomation from "../pages/NestedAutomation/CreateAndViewAutomation";
import { LinearProgress } from "@mui/material";
import DashboardRouteRedirection from "../pages/PrivetRoute/DashboardRouteRedirection";
import { dashboardFeatureKeys } from "./DashboardRoutesConfig";
const CreateSuperAccountManager = lazy(() =>
  import("../pages/UserAccessControl/CreateSuperAccountManager")
);
const ClientOnboardingStatus = lazy(() =>
  import("../components/ui/client-onboarding/ClientOnboardingStatus")
);

const ViewFeatureAndPermission = lazy(() =>
  import("../pages/FeatureAndPermission/ViewFeatureAndPermission")
);

const ViewGroupedFeatureAndPermission = lazy(() =>
  import("../pages/FeatureAndPermission/ViewGroupedFeatureAndPermission")
);

const FormManagement = lazy(() =>
  import("../components/ui/client-onboarding/FormManagement/FormManagement")
);

const ConfigurationDetailsForm = lazy(() =>
  import(
    "../components/ui/client-onboarding/ConfigurationDetails/ConfigurationDetailsForm"
  )
);
const CreateClient = lazy(() =>
  import("../pages/UserAccessControl/CreateClient")
);

const FeaturePermissionConfigurationDashboard = lazy(() =>
  import(
    "../pages/FeatureAndPermission/FeaturePermissionConfigurationDashboard"
  )
);
const CreateFeatureAndPermission = lazy(() =>
  import("../pages/FeatureAndPermission/CreateFeatureAndPermission")
);

const LeadProcessDetails = lazy(() =>
  import("../pages/ApplicationManager/LeadProcess/LeadProcessDetails")
);
const CallLogs = lazy(() =>
  import("../components/ui/counsellor-dashboard/CallLogs/CallLogs")
);
const CommunicationSummaryDashboard = lazy(() =>
  import(
    "../components/ui/communication-performance/CommunicationSummary/CommunicationSummaryDashboard"
  )
);
const AutomationManager = lazy(() =>
  import("../pages/NestedAutomation/AutomationManager/AutomationManager")
);
const DataSegmentManager = lazy(() =>
  import("../pages/DataSegmentManager/DataSegmentManager")
);
const DataSegmentDetails = lazy(() =>
  import("../pages/DataSegmentManager/DataSegmentDetails")
);
const LeadDetailsExtendedTable = lazy(() =>
  import("../pages/ApplicationManager/LeadDetailsExtendedTable")
);
const FollowUpTask = lazy(() =>
  import("../components/ui/counsellor-dashboard/FollowUpTask")
);
const InterviewedCandidate = lazy(() =>
  import("../pages/InterviewedCandidateList/InterviewedCandidate")
);
const ManageCourses = lazy(() =>
  import("../pages/CourseManagement/ManageCourses")
);
const Resources = lazy(() => import("../pages/ResourceManagement/Resources"));

const CallList = lazy(() => import("../pages/QA_Manager/CallList"));
const QcdRejectedCalls = lazy(() =>
  import("../pages/QA_Manager/QcdRejectedCalls")
);

const FormManagerTable = lazy(() =>
  import("../pages/FormManager/FormManagerTable")
);
const LeadManagerTable = lazy(() =>
  import("../pages/LeadManager/LeadManagerTable")
);
const CustomLeadForm = lazy(() =>
  import("../pages/ApplicationManager/CustomLeadForm")
);
const LeadUpload = lazy(() => import("../pages/ApplicationManager/LeadUpload"));
const LeadUploadHistory = lazy(() =>
  import("../pages/ApplicationManager/LeadUploadHistory")
);

const BaseRouteNotFound = lazy(() =>
  import("../pages/ErrorPages/BaseRouteNotFound")
);
const VerifyPage = lazy(() => import("../pages/LoginForm/VerifyPage"));
const AdminRoute = lazy(() => import("../pages/PrivetRoute/AdminRoute"));
const CreateScript = lazy(() =>
  import("../pages/TemplateManager/CreateScript")
);
const CreateUser = lazy(() => import("../pages/UserAccessControl/CreateUser"));
const UserPermission = lazy(() =>
  import("../pages/UserAccessControl/UserPermission")
);
const ViewLeadsData = lazy(() => import("../pages/ViewRawData/ViewLeadsData"));
//code splitting
const TelephonyDashboard = lazy(() =>
  import("../pages/Dashboard/TelephonyDashboard")
);

const CounsellorDashboard = lazy(() =>
  import("../pages/Dashboard/CounsellorDashboard")
);

const PublisherDashboard = lazy(() =>
  import("../pages/Dashboard/PublisherDashboard")
);

// Query manager
const StudentQueryList = lazy(() =>
  import("../pages/Query_Manager/StudentQueryList")
);
const RawDataUploadHistory = lazy(() =>
  import("../pages/Query_Manager/RawDataUploadHistory")
);

// Application Forms
const InAppCallLogs = lazy(() =>
  import("../pages/ApplicationForms/InAppCallLogs")
);
// Lead Manager
const UserProfile = lazy(() => import("../pages/LeadManager/UserProfile"));

// Campaign Manager
const CampaignManager = lazy(() =>
  import("../pages/CampaignManager/CampaignManager")
);
const EventMapping = lazy(() =>
  import("../pages/CampaignManager/EventMapping")
);
//Student Profile view Page Design

const StudentProfilePageDesign = lazy(() =>
  import("../pages/StudentProfilePageDesign/StudentProfilePageDesign")
);
const StudentProfileViewHOD = lazy(() =>
  import("../pages/StudentProfileViewHOD/StudentProfileViewHOD")
);
// User Access Control
const UserManager = lazy(() =>
  import("../pages/UserAccessControl/UserManager")
);
const DownloadRequestList = lazy(() =>
  import("../pages/UserAccessControl/DownloadRequestList")
);
const UserSessions = lazy(() =>
  import("../pages/UserAccessControl/UserSessions")
);
const UserActivity = lazy(() =>
  import("../pages/UserAccessControl/UserActivity")
);
const CounsellorManager = lazy(() =>
  import("../pages/UserAccessControl/CounsellorManager")
);

// Application Manager
const PaidApplicationManagerTable = lazy(() =>
  import("../pages/ApplicationManager/PaidApplicationManagerTable")
);
const ApplicationManagerTable = lazy(() =>
  import("../pages/ApplicationManager/ApplicationManagerTable")
);
const CommunicationPerformance = lazy(() =>
  import("../pages/ApplicationManager/CommunicationPerformance")
);
const CommunicationLogDetails = lazy(() =>
  import("../pages/ApplicationManager/CommunicationLogDetails")
);
const ViewRawData = lazy(() => import("../pages/ViewRawData/ViewRawData"));

// Query manage

// Reports and Analytics
const ReportsAnalytics = lazy(() =>
  import("../pages/ReportsAnalytics/ReportsAnalytics")
);

const ManageCommunicationTemplate = lazy(() =>
  import("../pages/TemplateManager/ManageCommunicationTemplate")
);

const CreateViewTemplate = lazy(() =>
  import("../pages/TemplateManager/CreateViewTemplate")
);
const RapSmsTemplate = lazy(() =>
  import("../pages/TemplateManager/RapSmsTemplate")
);
const RapEmailTemplate = lazy(() =>
  import("../pages/TemplateManager/RapEmailTemplate")
);
const RapWhatsAppTemplate = lazy(() =>
  import("../pages/TemplateManager/RapWhatsAppTemplate")
);
const MediaGallery = lazy(() =>
  import("../pages/TemplateManager/MediaGallery")
);

const BasicLayout = lazy(() => import("../pages/TemplateManager/BasicLayout"));

// Settings
const Settings = lazy(() => import("../pages/Settings/Setting"));

// Login Form
const Login = lazy(() => import("../pages/LoginForm/Login"));
const ForgotPwd = lazy(() => import("../pages/LoginForm/ForgotPwd"));
const PasswordReset = lazy(() => import("../pages/LoginForm/PasswordReset"));

//Error pages
const Page404 = lazy(() => import("../pages/ErrorPages/Page404"));
const Page401 = lazy(() => import("../pages/ErrorPages/Page401"));
const Page500 = lazy(() => import("../pages/ErrorPages/Page500"));
const CommunicationPerformanceDetails = lazy(() =>
  import(
    "../pages/ApplicationForms/communicationPerformance/CommunicationPerformance"
  )
);
const ActivePanelistManager = lazy(() =>
  import("../pages/Interview/ActivePanelistManager/ActivePanelistManager")
);
//Panelist and MOD page
const PanelistDesignPage = lazy(() =>
  import("../pages/Interview/PanelistDesignPage/PanelistDesignPage")
);

const MODDesignPage = lazy(() =>
  import("../pages/Interview/MODDesignPage/MODDesignPage")
);
//StudentTotalQueries
const StudentTotalQueries = lazy(() =>
  import("../pages/StudentTotalQueries/StudentTotalQueries")
);
//Voucher/PromoCode Manager
const VoucherPromoCodeManager = lazy(() =>
  import("../pages/VoucherPromoCodeManager/VoucherPromoCode")
);
//Voucher Manager
const VoucherManager = lazy(() =>
  import("../pages/VoucherManager/VoucherManagerForPublisher")
);
//Management Dashboard
const ManagementDashboard = lazy(() =>
  import("../pages/ManagementDashBoard/ManagementDashBoard")
);
//Account Manager Dashboard
const AccountManagerDashboard = lazy(() =>
  import("../pages/AccountManagerDashBoard/AccountManagerDashBoard")
);
// Create Account Manager
const CreateManagerAccount = lazy(() =>
  import("../pages/UserAccessControl/CreateManagerAccount")
);
//Billing Manager Dashboard
const BillingManagerDashboard = lazy(() =>
  import("../pages/BillingManagementDashBoard/BillingManagementDashBoard")
);
//User Manager Permission
const UserManagerPermission = lazy(() =>
  import("../pages/UserAccessControl/UserManagerPermission")
);
//Role Management
const RoleManagement = lazy(() =>
  import("../pages/UserAccessControl/RoleManagement")
);
const PendingLeads = lazy(() => import("../pages/PendingLeads/PendingLeads"));
const ClientOnboarding = lazy(() =>
  import("../pages/ClientOnboarding/ClientOnboarding")
);
const AdminDashboard = lazy(() => import("../pages/Dashboard/AdminDashboard"));
const ViewAllColleges = lazy(() =>
  import("../pages/UserAccessControl/ViewAllColleges")
);
const ViewAllClients = lazy(() =>
  import("../pages/UserAccessControl/ViewAllClients")
);
function AppRoutes() {
  const permissions =
    useSelector((state) => state.authentication.permissions) || {}; // user permissions objects
  const authToken = Cookies.get("jwtTokenCredentialsAccessToken");
  const userRole = useSelector(
    (state) => state.authentication.token?.scopes?.[0]
  );

  return (
    <div>
      <Suspense
        fallback={
          <LinearProgress color="info" sx={{ mt: "-30px !important" }} />
        }
      >
        <Routes>
          {/* -------Dashboard---------- */}
          {
            <Route
              exact
              path="/"
              element={
                <AdminRoute featureKey={dashboardFeatureKeys[userRole]}>
                  <DashboardRouteRedirection />
                </AdminRoute>
              }
            />
          }
          {permissions?.["aefd607c"]?.features?.["c2a62998"]?.visibility && (
            <Route
              exact
              path="/counselor-dashboard"
              element={
                <AdminRoute featureKey="c2a62998">
                  {" "}
                  <CounsellorDashboard />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["e7d559dc"]?.visibility && (
            <Route
              exact
              path="/admin-dashboard"
              element={
                <AdminRoute featureKey="e7d559dc">
                  {" "}
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          )}
          {/* Management Dashboard */}
          {permissions?.["aefd607c"]?.features?.["86942672"]?.visibility && (
            <Route
              exact
              path="/management-dashboard"
              element={
                <AdminRoute featureKey="86942672">
                  {" "}
                  <ManagementDashboard />
                </AdminRoute>
              }
            />
          )}
          {/* Account Manager Dashboard */}
          {permissions?.["aefd607c"]?.features?.["0e01b24b"]?.visibility && (
            <Route
              exact
              path="/account-manager-dashboard"
              element={
                <AdminRoute featureKey="0e01b24b">
                  {" "}
                  <AccountManagerDashboard />
                </AdminRoute>
              }
            />
          )}
          {/* Create Account Manager */}
          {permissions?.["817c5d6d"]?.features?.["86d1298b"]?.visibility && (
            <Route
              exact
              path="/create-account"
              element={
                <AdminRoute featureKey="86d1298b">
                  {" "}
                  <CreateManagerAccount />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["96f85315"]?.visibility && (
            <Route
              exact
              path="/create-super-account-manager"
              element={
                <AdminRoute featureKey="96f85315">
                  {" "}
                  <CreateSuperAccountManager />
                </AdminRoute>
              }
            />
          )}
          {/* Billing Manager Dashboard */}
          {permissions?.["aefd607c"]?.features?.["ee598d8b"]?.visibility && (
            <Route
              exact
              path="/billing-manager-dashboard"
              element={
                <AdminRoute featureKey="ee598d8b">
                  {" "}
                  <BillingManagerDashboard />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["c2a62998"]?.visibility && (
            <Route
              exact
              path="/followup-task-details"
              element={
                <AdminRoute featureKey="c2a62998">
                  {" "}
                  <FollowUpTask />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["aefd607c"]?.features?.["747bc08f"]?.visibility && (
            <Route
              exact
              path="/publisher-dashboard"
              element={
                <AdminRoute featureKey="747bc08f">
                  {" "}
                  <PublisherDashboard />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["64994b54"]?.visibility && (
            <Route
              exact
              path="/student-queries"
              element={
                <AdminRoute featureKey="64994b54">
                  <StudentTotalQueries />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["7ac6047b"]?.visibility && (
            <Route
              exact
              path="/view-application"
              element={
                <AdminRoute featureKey="7ac6047b">
                  <StudentProfileViewHOD />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["b7f40769"]?.visibility && (
            <Route
              exact
              path="/authorized-approver-dashboard"
              element={
                <AdminRoute featureKey="b7f40769">
                  <InterviewedCandidate />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["72a10913"]?.visibility && (
            <Route
              exact
              path="/qa-manager"
              element={
                <AdminRoute featureKey="72a10913">
                  <CallList route={"qaManager"} />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["f093f963"]?.visibility && (
            <Route
              exact
              path="/panelist-dashboard"
              element={
                <AdminRoute featureKey="f093f963">
                  <PanelistDesignPage />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["aefd607c"]?.features?.["1d802b76"]?.visibility && (
            <Route
              exact
              path="/feature-configuration-dashboard"
              element={
                <AdminRoute featureKey="1d802b76">
                  {" "}
                  <FeaturePermissionConfigurationDashboard />{" "}
                </AdminRoute>
              }
            />
          )}

          {/* ---------Data Segment Manager-------- */}
          {permissions?.["4e968cbd"]?.features?.["4cbd834b"]?.visibility && (
            <Route
              exact
              path="/data-segment-manager"
              element={
                <AdminRoute featureKey="4cbd834b">
                  <DataSegmentManager />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["4e968cbd"]?.features?.["4cbd834b"]?.visibility && (
            <Route
              exact
              path="/data-segment-details"
              element={
                <AdminRoute featureKey="4cbd834b">
                  <DataSegmentDetails />
                </AdminRoute>
              }
            />
          )}

          <Route
            exact
            path="/data-segment-details/:optionalEncrypted"
            element={
              <AdminRoute featureKey="4cbd834b">
                <DataSegmentDetails />
              </AdminRoute>
            }
          />

          {/* ---------Application Forms-------- */}
          {permissions?.["650dffa2"]?.features?.["204eba2f"]?.visibility && (
            <Route
              exact
              path="/in-app-call-logs"
              element={
                <AdminRoute featureKey="204eba2f">
                  <InAppCallLogs />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["650dffa2"]?.features?.["6bd553f2"]?.visibility && (
            <Route
              exact
              path="/communicationPerformance"
              element={
                <AdminRoute featureKey="6bd553f2">
                  <CommunicationPerformanceDetails />
                </AdminRoute>
              }
            />
          )}

          {/* -------- Lead Manager -------- */}
          {permissions?.["3b5a8b33"]?.visibility && (
            <Route
              exact
              path="/userProfile"
              element={
                <AdminRoute featureKey="3b5a8b33">
                  <UserProfile />
                </AdminRoute>
              }
            />
          )}
          <Route
            exact
            path="/userProfile/:optionalEncrypted"
            element={
              <AdminRoute featureKey="3b5a8b33">
                <UserProfile />
              </AdminRoute>
            }
          />

          {/* ----------Campaign Manager --------*/}
          {permissions?.["480501f4"]?.features?.["4a8e33fb"]?.visibility && (
            <Route
              exact
              path="/campaign-manager"
              element={
                <AdminRoute featureKey="4a8e33fb">
                  <CampaignManager />
                </AdminRoute>
              }
            />
          )}
          {/* event Mapping */}
          {permissions?.["480501f4"]?.features?.["5ea710e6"]?.visibility && (
            <Route
              exact
              path="/event-mapping"
              element={
                <AdminRoute featureKey="5ea710e6">
                  <EventMapping />
                </AdminRoute>
              }
            />
          )}
          {/* Pending Leads */}
          {permissions?.["2c7f9a8e"]?.features?.["6c6b5527"]?.visibility && (
            <Route
              exact
              path="/pending-leads"
              element={
                <AdminRoute featureKey="6c6b5527">
                  <PendingLeads />
                </AdminRoute>
              }
            />
          )}
          {/* User access control */}
          {permissions?.["817c5d6d"]?.features?.["f8c83200"]?.visibility && (
            <Route
              exact
              path="/users/user-manager"
              element={
                <AdminRoute featureKey="f8c83200">
                  <UserManager />
                </AdminRoute>
              }
            />
          )}
          {/* user manager Permission */}
          {permissions?.["817c5d6d"]?.features?.["0d9a0866"]?.visibility && (
            <Route
              exact
              path="/users/user-manager-permission"
              element={
                <AdminRoute featureKey="0d9a0866">
                  <UserManagerPermission />
                </AdminRoute>
              }
            />
          )}
          {/* Role Management */}
          {permissions?.["817c5d6d"]?.features?.["a82a95b6"]?.visibility && (
            <Route
              exact
              path="/role-management"
              element={
                <AdminRoute featureKey="a82a95b6">
                  <RoleManagement />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["0e1802d2"]?.visibility && (
            <Route
              exact
              path="/create-feature-and-permission"
              element={
                <AdminRoute featureKey="0e1802d2">
                  <CreateFeatureAndPermission />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["b6b5e453"]?.visibility && (
            <Route
              exact
              path="/view-feature-and-permission"
              element={
                <AdminRoute featureKey="b6b5e453">
                  <ViewFeatureAndPermission />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["c4631809"]?.visibility && (
            <Route
              exact
              path="/view-grouped-feature-and-permission"
              element={
                <AdminRoute featureKey="c4631809">
                  <ViewGroupedFeatureAndPermission />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["a8e8b88f"]?.visibility && (
            <Route
              exact
              path="/users/manage-sessions"
              element={
                <AdminRoute featureKey="a8e8b88f">
                  <UserSessions />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["817c5d6d"]?.features?.["ed0d4368"]?.visibility && (
            <Route
              exact
              path="/reports/download-request-list"
              element={
                <AdminRoute featureKey="ed0d4368">
                  <DownloadRequestList />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["817c5d6d"]?.features?.["85ac2dfe"]?.visibility && (
            <Route
              exact
              path="/create-user"
              element={
                <AdminRoute featureKey="85ac2dfe">
                  <CreateUser />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["1d279536"]?.visibility && (
            <Route
              exact
              path="/user-permission"
              element={
                <AdminRoute featureKey="1d279536">
                  <UserPermission />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["c3486702"]?.visibility && (
            <Route
              exact
              path="/create-client"
              element={
                <AdminRoute featureKey="c3486702">
                  <CreateClient />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["540cfdd0"]?.visibility && (
            <Route
              exact
              path="/add-configuration-details"
              element={
                <AdminRoute featureKey="540cfdd0">
                  <ConfigurationDetailsForm />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["817c5d6d"]?.features?.["14d6046b"]?.visibility && (
            <Route
              exact
              path="/view-all-clients"
              element={
                <AdminRoute featureKey="14d6046b">
                  <ViewAllClients />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["0a330fee"]?.visibility && (
            <Route
              exact
              path="/view-all-colleges"
              element={
                <AdminRoute featureKey="0a330fee">
                  <ViewAllColleges />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["817c5d6d"]?.features?.["f86d5ad2"]?.visibility && (
            <Route
              exact
              path="/client-onboarding-status"
              element={
                <AdminRoute featureKey="f86d5ad2">
                  <ClientOnboardingStatus />
                </AdminRoute>
              }
            />
          )}

          {/* INTERVIEW MODULE */}
          <>
            {permissions?.["7ac6047b"]?.features?.["cc9c2686"]?.visibility && (
              <Route
                exact
                path="/interview-list"
                element={
                  <AdminRoute featureKey="cc9c2686">
                    <InterviewList />
                  </AdminRoute>
                }
              />
            )}
            {permissions?.["7ac6047b"]?.visibility && (
              <Route
                exact
                path="/view-interview-list"
                element={
                  <AdminRoute featureKey="7ac6047b">
                    <ViewStudentListPage />
                  </AdminRoute>
                }
              />
            )}
            {permissions?.["7ac6047b"]?.visibility && (
              <Route
                exact
                path="/selected-student"
                element={
                  <AdminRoute featureKey="7ac6047b">
                    <SelectedStudent />
                  </AdminRoute>
                }
              />
            )}
          </>
          {permissions?.["7ac6047b"]?.features?.["4db85868"]?.visibility && (
            <Route
              exact
              path="/planner"
              element={
                <AdminRoute featureKey="4db85868">
                  <MODDesignPage />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["7ac6047b"]?.visibility && (
            <Route
              exact
              path="/student-profile"
              element={
                <AdminRoute featureKey="7ac6047b">
                  <StudentProfilePageDesign />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["7ac6047b"]?.features?.["593cba15"]?.visibility && (
            <Route
              exact
              path="/panelist-manager"
              element={
                <AdminRoute featureKey="593cba15">
                  <ActivePanelistManager />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["7ac6047b"]?.features?.["5e7d7061"]?.visibility && (
            <Route
              exact
              path="/selection-procedure"
              element={
                <AdminRoute featureKey="5e7d7061">
                  <SelectionProcedure />
                </AdminRoute>
              }
            />
          )}

          {/*----------QA Manager--------*/}
          {permissions?.["fe305f26"]?.features?.["fb818b74"]?.visibility && (
            <Route
              exact
              path="/qcd-calls"
              element={
                <AdminRoute featureKey="fb818b74">
                  <CallList />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["fe305f26"]?.features?.["39b0bee8"]?.visibility && (
            <Route
              exact
              path="/qcd-rejected-calls"
              element={
                <AdminRoute featureKey="39b0bee8">
                  <QcdRejectedCalls />
                </AdminRoute>
              }
            />
          )}

          {/* ---------Lead Manager------ */}
          {permissions?.["2c7f9a8e"]?.features?.["4f90cda0"]?.visibility && (
            <Route
              exact
              path="/lead-manager"
              element={
                <AdminRoute featureKey="4f90cda0">
                  <LeadManagerTable />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["2c7f9a8e"]?.features?.["12d3cafc"]?.visibility && (
            <Route
              exact
              path="/form-manager"
              element={
                <AdminRoute featureKey="12d3cafc">
                  <FormManagerTable />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["2c7f9a8e"]?.features?.["695f1b55"]?.visibility && (
            <Route
              exact
              path="/leadGenerateForm"
              element={
                <AdminRoute featureKey="695f1b55">
                  <CustomLeadForm />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["2c7f9a8e"]?.features?.["bc192ec0"]?.visibility && (
            <Route
              exact
              path="/leadUpload"
              element={
                <AdminRoute featureKey="bc192ec0">
                  {" "}
                  <LeadUpload state={{ from: "leadUpload" }} />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["71a5cca0"]?.features?.["fb75d814"]?.visibility && (
            <Route
              exact
              path="/view-leads-data"
              element={
                <AdminRoute featureKey="fb75d814">
                  <ViewLeadsData />
                </AdminRoute>
              }
            />
          )}

          {/* ---------Application Manager------ */}
          {permissions?.["9c53d75c"]?.features?.["79e29279"]?.visibility && (
            <Route
              exact
              path="/application-manager"
              element={
                <AdminRoute featureKey="79e29279">
                  <ApplicationManagerTable />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["9c53d75c"]?.features?.["2faa8dc6"]?.visibility && (
            <Route
              exact
              path="/paid-applications"
              element={
                <AdminRoute featureKey="2faa8dc6">
                  <PaidApplicationManagerTable />
                </AdminRoute>
              }
            />
          )}

          {/* view-raw-data route setup */}
          {permissions?.["71a5cca0"]?.features?.["331ecdde"]?.visibility && (
            <Route
              exact
              path="/view-raw-data"
              element={
                <AdminRoute featureKey="331ecdde">
                  <ViewRawData />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["71a5cca0"]?.features?.["fb75d814"]?.visibility && (
            <Route
              exact
              path="/raw-data-upload-history"
              element={
                <AdminRoute featureKey="fb75d814">
                  <RawDataUploadHistory px={2} />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["6e9fc9f1"]?.features?.["44ef4e3c"]?.visibility && (
            <Route
              exact
              path="/resources"
              element={
                <AdminRoute featureKey="44ef4e3c">
                  <Resources />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["71a5cca0"]?.features?.["e8f3ead9"]?.visibility && (
            <Route
              exact
              path="/rawDataUpload"
              element={
                <AdminRoute featureKey="e8f3ead9">
                  <LeadUpload />
                </AdminRoute>
              }
            />
          )}
          {/* ----------Reports Analytics---------- */}
          {permissions?.["4be9770f"]?.features?.["98a5f78c"]?.visibility && (
            <Route
              exact
              path="/reports-analytics"
              element={
                <AdminRoute featureKey="98a5f78c">
                  <ReportsAnalytics />
                </AdminRoute>
              }
            />
          )}
          {/* ----------- Template Manager --------- */}
          {permissions?.["4d5eb330"]?.features?.["3dbd1628"]?.visibility && (
            <Route
              exact
              path="/manage-communication-template"
              element={
                <AdminRoute featureKey="3dbd1628">
                  <ManageCommunicationTemplate />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["4d5eb330"]?.features?.["d2c99ca3"]?.visibility && (
            <Route
              exact
              path="/create-view-template"
              element={
                <AdminRoute featureKey="d2c99ca3">
                  <CreateViewTemplate />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["4d5eb330"]?.features?.["3dbd1628"]?.visibility && (
            <Route
              exact
              path="/email-template"
              element={
                <AdminRoute featureKey="3dbd1628">
                  <RapEmailTemplate />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["4d5eb330"]?.features?.["3dbd1628"]?.visibility && (
            <Route
              exact
              path="/whatsApp-template"
              element={
                <AdminRoute featureKey="3dbd1628">
                  <RapWhatsAppTemplate />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["4d5eb330"]?.features?.["3dbd1628"]?.visibility && (
            <Route
              exact
              path="/sms-template"
              element={
                <AdminRoute featureKey="3dbd1628">
                  <RapSmsTemplate />
                </AdminRoute>
              }
            />
          )}

          {permissions?.["4d5eb330"]?.features?.["5b95f3f3"]?.visibility && (
            <Route
              exact
              path="/media-gallery"
              element={
                <AdminRoute featureKey="5b95f3f3">
                  <MediaGallery />
                </AdminRoute>
              }
            />
          )}
          {/* ----------- Settings---------- */}
          {permissions?.["ce7a1154"]?.features?.["a47ced47"]?.visibility && (
            <Route
              exact
              path="/settings"
              element={
                <AdminRoute featureKey="a47ced47">
                  <Settings />
                </AdminRoute>
              }
            />
          )}
          {/* voucher promoCode manager */}
          {permissions?.["ce7a1154"]?.features?.["2bf8b3f2"]?.visibility && (
            <Route
              exact
              path="/voucher-promoCode-manager"
              element={
                <AdminRoute featureKey="2bf8b3f2">
                  <VoucherPromoCodeManager />
                </AdminRoute>
              }
            />
          )}
          {/* Voucher manager */}
          {permissions?.["b8d19da5"]?.features?.["ccbb2d7a"]?.visibility && (
            <Route
              exact
              path="/voucher-manager"
              element={
                <AdminRoute featureKey="ccbb2d7a">
                  <VoucherManager />
                </AdminRoute>
              }
            />
          )}
          {/* ------Communication Performance-------- */}
          {/* <Route
            exact
            path="/communication-performance"
            element={
              <AdminRoute>
                <CommunicationPerformance />
              </AdminRoute>
            }
          />
          <Route
            path="/communication-logs-details-report"
            element={
              <AdminRoute>
                <CommunicationLogDetails />
              </AdminRoute>
            }
          /> */}
          {permissions?.["8b50953d"]?.visibility && (
            <Route
              path="/stageDetailsTable"
              element={
                <AdminRoute featureKey="8b50953d">
                  <LeadDetailsExtendedTable />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["b495f3bb"]?.features?.["2c7f9a8w"]?.visibility && (
            <Route
              path="/automation-manager"
              element={
                <AdminRoute featureKey="2c7f9a8w">
                  <AutomationManager></AutomationManager>
                </AdminRoute>
              }
            />
          )}
          {permissions?.["b495f3bb"]?.features?.["ca8ed51b"]?.visibility && (
            <Route
              path="/create-automation"
              element={
                <AdminRoute featureKey="ca8ed51b">
                  <CreateAndViewAutomation></CreateAndViewAutomation>
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["b27012fd"]?.visibility && (
            <Route
              path="/communication-summary"
              element={
                <AdminRoute featureKey="b27012fd">
                  <CommunicationSummaryDashboard />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["aefd607c"]?.features?.["1c1c9ffe"]?.visibility && (
            <Route
              path="/telephony-dashboard"
              element={
                <AdminRoute featureKey="1c1c9ffe">
                  <TelephonyDashboard />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["3725c151"]?.features?.["38094f31"]?.visibility && (
            <Route
              path="/call-logs"
              element={
                <AdminRoute featureKey="38094f31">
                  <CallLogs />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["71a5cca0"]?.features?.["fb75d814"]?.visibility && (
            <Route
              path="/lead-process"
              element={
                <AdminRoute featureKey="fb75d814">
                  <LeadProcessDetails />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["eb8f5ddb"]?.visibility && (
            <Route
              path="/create-college"
              element={
                <AdminRoute featureKey="eb8f5ddb">
                  <ClientOnboarding />
                </AdminRoute>
              }
            />
          )}
          {permissions?.["817c5d6d"]?.features?.["6b155205"]?.visibility && (
            <Route
              path="/form-management"
              element={
                <AdminRoute featureKey="6b155205">
                  <FormManagement />
                </AdminRoute>
              }
            />
          )}

          {/* -----------Auth Login Form---------- */}
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/user/dkper/user/:token" element={<ForgotPwd />} />
          <Route exact path="/passwordReset" element={<PasswordReset />} />
          <Route exact path="/verifyPage" element={<VerifyPage />} />

          {/* Error Pages */}
          <Route exact path="/page401" element={<Page401 />} />
          <Route exact path="/baseNotFound" element={<BaseRouteNotFound />} />
          <Route exact path="/page500" element={<Page500 />} />
          {Object.keys(permissions)?.length > 0 && (
            <Route exact path="*" element={<Page404 />} />
          )}
          {authToken || <Route exact path="*" element={<Page404 />} />}
        </Routes>
      </Suspense>
    </div>
  );
}

export default AppRoutes;
