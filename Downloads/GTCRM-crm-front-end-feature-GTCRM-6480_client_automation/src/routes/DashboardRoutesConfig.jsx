import { lazy } from "react";
const AccountManagerDashBoard = lazy(() =>
  import("../pages/AccountManagerDashBoard/AccountManagerDashBoard")
);
const AdminDashboard = lazy(() => import("../pages/Dashboard/AdminDashboard"));
const CounsellorDashboard = lazy(() =>
  import("../pages/Dashboard/CounsellorDashboard")
);
const PublisherDashboard = lazy(() =>
  import("../pages/Dashboard/PublisherDashboard")
);

const MODDesignPage = lazy(() =>
  import("../pages/Interview/MODDesignPage/MODDesignPage")
);
const PanelistDesignPage = lazy(() =>
  import("../pages/Interview/PanelistDesignPage/PanelistDesignPage")
);
const InterviewedCandidate = lazy(() =>
  import("../pages/InterviewedCandidateList/InterviewedCandidate")
);
const ManagementDashBoard = lazy(() =>
  import("../pages/ManagementDashBoard/ManagementDashBoard")
);
const CallList = lazy(() => import("../pages/QA_Manager/CallList"));

export default {
  college_super_admin: <AdminDashboard />,
  college_head_counselor: <CounsellorDashboard />,
  college_counselor: <CounsellorDashboard />,
  college_publisher_console: <PublisherDashboard />,
  college_admin: <AdminDashboard />,
  account_manager: <ManagementDashBoard />,
  super_account_manager: <AccountManagerDashBoard />,
  super_admin: <ManagementDashBoard />,
  admin: <ManagementDashBoard />,
  client_manager: <ManagementDashBoard />,
  client_admin: <ManagementDashBoard />,
  authorized_approver: <InterviewedCandidate />,
  panelist: <PanelistDesignPage />,
  qa: <CallList route={"qaManager"} />,
  head_qa: <CallList route={"qaManager"} />,
  moderator: <MODDesignPage />,
};
export const dashboardFeatureKeys = {
  college_super_admin: "e7d559dc",
  college_head_counselor: "c2a62998",
  college_counselor: "c2a62998",
  college_publisher_console: "747bc08f",
  college_admin: "e7d559dc",
  account_manager: "86942672",
  super_account_manager: "0e01b24b",
  super_admin: "86942672",
  admin: "86942672",
  client_manager: "86942672",
  client_admin: "86942672",
  authorized_approver: "b7f40769",
  panelist: "f093f963",
  qa: <CallList route={"qaManager"} />,
  head_qa: <CallList route={"qaManager"} />,
  moderator: <MODDesignPage />,
};
