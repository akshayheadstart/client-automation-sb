import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navigations/navbar/Navbar";
import SidebarV2 from "../components/navigations/sidebar/SidebarV2";
import {
  fetchPermission,
  removeCookies,
  setDashboardLayout,
} from "../Redux/Slices/authSlice";

const SideBarNavbarLayout = () => {
  const [isSideOpen, setSidebarOpen] = useState(true);
  const [width] = useState(240);
  const dispatch = useDispatch();
  const authToken = Cookies.get("jwtTokenCredentialsAccessToken");
  const refreshToken = Cookies.get("jwtTokenCredentialsRefreshToken");

  const isActionDisable = useSelector(
    (state) => state.authentication.isActionDisable
  );
  const fixed = useSelector((state) => state.authentication.sidebarFixed);
  const permissions = useSelector((state) => state.authentication.permissions); // user permissions objects
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const userEmail = useSelector((state) => state.authentication.userEmail);

  useEffect(() => {
    if (authToken && refreshToken) {
      dispatch(fetchPermission({ token: authToken, collegeId: collegeId }));
    }
  }, [authToken, collegeId, dispatch, refreshToken]);

  useEffect(() => {
    dispatch(setDashboardLayout());
  }, []);

  const navigate = useNavigate();
  const tokenState = useSelector((state) => state.authentication.token);
  if (tokenState.detail) {
    Cookies.remove("account_added_access_token");
    dispatch(removeCookies());
    navigate("/page401");
  }

  return (
    authToken &&
    refreshToken &&
    userEmail && (
      <>
        <SidebarV2
          width={width}
          fixed={fixed}
          open={isSideOpen}
          onClose={() => setSidebarOpen(false)}
          permissions={permissions}
          isActionDisable={isActionDisable}
        />{" "}
        <Navbar
          fixed={fixed}
          onSidebarOpen={() => setSidebarOpen(true)}
          permissions={permissions}
        />
      </>
    )
  );
};

export default SideBarNavbarLayout;
