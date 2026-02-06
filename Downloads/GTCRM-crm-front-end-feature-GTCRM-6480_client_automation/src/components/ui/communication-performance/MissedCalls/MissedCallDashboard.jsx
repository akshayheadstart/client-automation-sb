import React from "react";
import MissedCallDashboardHeader from "./MissedCallDashboardHeader";
import MissedCallDashboardTable from "./MissedCallDashboardTable";

const MissedCallDashboard = ({ featurePermission }) => {
  return (
    <>
      {featurePermission?.["c82a04b6"]?.visibility && (
        <MissedCallDashboardHeader />
      )}
      {featurePermission?.["0baf7cef"]?.visibility && (
        <MissedCallDashboardTable />
      )}
    </>
  );
};

export default MissedCallDashboard;
