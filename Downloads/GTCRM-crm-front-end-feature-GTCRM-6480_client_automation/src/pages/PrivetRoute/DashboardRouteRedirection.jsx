import React from "react";
import { useSelector } from "react-redux";
import DashboardRoutesConfig from "../../routes/DashboardRoutesConfig";

const DashboardRouteRedirection = () => {
  const userRole = useSelector(
    (state) => state.authentication.token?.scopes?.[0]
  );

  return DashboardRoutesConfig[userRole];
};

export default DashboardRouteRedirection;
