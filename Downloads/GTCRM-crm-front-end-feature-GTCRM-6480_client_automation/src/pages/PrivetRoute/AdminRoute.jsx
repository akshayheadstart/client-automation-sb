import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { setFeatureKeyInCookie } from "../StudentTotalQueries/helperFunction";

const AdminRoute = ({ featureKey, children }) => {
  const authToken = Cookies.get("jwtTokenCredentialsRefreshToken");
  let location = useLocation();

  if (authToken) {
    setFeatureKeyInCookie(featureKey);
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} />;
};

export default AdminRoute;
