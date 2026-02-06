import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppRoutes from "../routes/AppRoutes";

import Cookies from "js-cookie";

import SideBarNavbarLayout from "./SideBarNavbarLayout";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setSidebarFixed } from "../Redux/Slices/authSlice";
import { WithTokenValidation } from "../components/HOC/TokenValidationComponent";

function DashboardLayout() {
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.authentication.userEmail);
  const size = useSelector((state) => state.authentication.dashboardLayout);
  const authToken = Cookies.get("jwtTokenCredentialsAccessToken");
  const refreshToken = Cookies.get("jwtTokenCredentialsRefreshToken");
  const DashboardLayoutRoot = styled("div")(({ theme }) => ({
    flex: "1 1 auto",
    maxWidth: "100%",
    paddingTop: authToken && refreshToken && size?.paddingTop,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: authToken && refreshToken && size?.paddingLeft,
    },
  }));

  return (
    <>
      <>
        <div onClick={() => dispatch(setSidebarFixed(false))}>
          <DashboardLayoutRoot>
            <AppRoutes />
          </DashboardLayoutRoot>
          <WithTokenValidation>
            <SideBarNavbarLayout></SideBarNavbarLayout>
          </WithTokenValidation>
        </div>
      </>
    </>
  );
}

export default DashboardLayout;
