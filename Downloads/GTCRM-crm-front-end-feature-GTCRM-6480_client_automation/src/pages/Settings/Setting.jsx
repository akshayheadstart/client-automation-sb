/* eslint-disable react-hooks/exhaustive-deps */
import { CheckBox } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "../../styles/Settings.css";
import PasswordVisibilityIcon from "../../components/shared/forms/PasswordVisibilityIcon";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import UserDetails from "./UserDetails";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";

function Setting() {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const navigate = useNavigate();
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const [userDetails, setUserDetails] = useState({});
  const [somethingWentWrongInUserDetails, setSomethingWentWrongInUserDetails] =
    useState(false);
  const [userDetailsInternalServerError, setUserDetailsInternalServerError] =
    useState(false);

  const [availablePermissions, setAvailablePermissions] = useState([]);
  const permissions = useSelector((state) => state.authentication.permissions); // user permissions objects
  // User permissions
  useEffect(() => {
    if (permissions) {
      const availablePermissions = [];
      if (permissions?.permission?.add_client === true) {
        availablePermissions.push("Add client");
      }
      if (permissions?.permission?.add_client_manager === true) {
        availablePermissions.push("Add client manager");
      }
      if (permissions?.permission?.add_college_admin === true) {
        availablePermissions.push("Add college admin");
      }
      if (permissions?.permission?.add_college_counselor === true) {
        availablePermissions.push("Add college counselor");
      }
      if (permissions?.permission?.add_college_head_counselor === true) {
        availablePermissions.push("Add college head counselor");
      }
      if (permissions?.permission?.add_college_publisher_console === true) {
        availablePermissions.push("Add college publisher counselor");
      }
      if (permissions?.permission?.add_college_super_admin === true) {
        availablePermissions.push("Add college super admin");
      }
      if (permissions?.permission?.create_enquiry_form === true) {
        availablePermissions.push("Create enquiry form");
      }
      if (permissions?.permission?.delete_client === true) {
        availablePermissions.push("Delete client");
      }
      if (permissions?.permission?.delete_client_manager === true) {
        availablePermissions.push("Delete client manager");
      }
      if (permissions?.permission?.delete_college_admin === true) {
        availablePermissions.push("Delete college admin");
      }
      if (permissions?.permission?.delete_college_counselor === true) {
        availablePermissions.push("Delete college counselor");
      }
      if (permissions?.permission?.delete_college_head_counselor === true) {
        availablePermissions.push("Delete college head counselor");
      }
      if (permissions?.permission?.delete_college_publisher_console === true) {
        availablePermissions.push("Delete college publisher counselor");
      }
      if (permissions?.permission?.delete_college_super_admin === true) {
        availablePermissions.push("Delete college super admin");
      }
      if (permissions?.permission?.purge_client_data === true) {
        availablePermissions.push("Purge client data");
      }
      if (permissions?.permission?.select_verification_type === true) {
        availablePermissions.push("Select verification type");
      }
      if (permissions?.permission?.update_enquiry_form === true) {
        availablePermissions.push("Update enquiry form");
      }
      setAvailablePermissions(availablePermissions);
    }
  }, [permissions]);

  const [isLoading, setIsLoading] = useState(false);
  const [userDetailsLoading, setUserDetailsLoading] = useState(false);
  const [passwordSubmitError, setPasswordSubmitError] = useState("");
  // Add User Dialog
  const [openChangePassword, setChangePasswordDialog] = React.useState(false);
  const handleOpenChangeUserDialog = () => {
    setChangePasswordDialog(true);
  };
  const handleCloseChangePasswordDialog = () => {
    setChangePasswordDialog(false);
  };
  //state for password fields
  const [values, setValues] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowCurrentPassword = () => {
    setValues({
      ...values,
      showCurrentPassword: !values.showCurrentPassword,
    });
  };

  const handleClickShowNewPassword = () => {
    setValues({
      ...values,
      showNewPassword: !values.showNewPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setValues({
      ...values,
      showConfirmPassword: !values.showConfirmPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //change password API
  const changePasswordApiUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/user/change_password/?current_password=${
    values?.currentPassword
  }&new_password=${values?.newPassword}&confirm_password=${
    values?.confirmPassword
  }`;

  const handleChangePassword = (event) => {
    event.preventDefault();
    setPasswordSubmitError("");
    if (values.newPassword.toString().length < 8) {
      setPasswordSubmitError("Password should be at least 8 characters");
    } else {
      setIsLoading(true);
      customFetch(changePasswordApiUrl, ApiCallHeaderAndBody(token, "PUT"))
        .then((res) => res.json())
        .then((result) => {
          setIsLoading(false);
          if (result.code === 200) {
            handleCloseChangePasswordDialog();
            pushNotification("success", "Password Changed Successfully");
          } //if user token is not valid redirect to page 401
          else if (result.detail === "Could not validate credentials") {
            window.location.reload();
          } //show the error message
          else if (result.detail) {
            setPasswordSubmitError(result.detail);
          }
        })
        .catch((error) => {
          navigate("/page500");
        });
    }
  };

  // User Details
  useEffect(() => {
    setUserDetailsLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/user/current_user_details/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data) {
          try {
            if (
              typeof data === "object" &&
              data !== null &&
              !Array.isArray(data)
            ) {
              setUserDetails(data);
            } else {
              throw new Error("User details api response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            setSomethingWentWrongInUserDetails(true);
            setTimeout(() => {
              setSomethingWentWrongInUserDetails(false);
            }, 5000);
          }
          setUserDetailsLoading(false);
        } else if (data?.detail) {
          setUserDetailsLoading(false);
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        setUserDetailsLoading(false);
        setUserDetailsInternalServerError(true);
        setTimeout(() => {
          setUserDetailsInternalServerError(false);
        }, 5000);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Setting Head Title add
  useEffect(() => {
    setHeadTitle("Settings");
    document.title = "Settings";
  }, [headTitle]);
  return (
    <Box className="settings-header-box-container">
      <Container maxWidth={false}>
        {userDetailsInternalServerError || somethingWentWrongInUserDetails ? (
          <Box>
            <Error500Animation height={400} width={400}></Error500Animation>
          </Box>
        ) : (
          <Box
            className="settings-container"
            sx={{ width: { sm: "full", md: "800px", lg: "1000px" } }}
          >
            {userDetailsLoading ? (
              <Box
                sx={{
                  width: "100%",
                  minHeight: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                data-testid="animation-container"
              >
                <LeefLottieAnimationLoader
                  height={150}
                  width={180}
                ></LeefLottieAnimationLoader>
              </Box>
            ) : (
              <Box sx={{ mt: "30px", pl: "40px" }}>
                <UserDetails
                  userDetails={userDetails}
                  handleOpenChangeUserDialog={handleOpenChangeUserDialog}
                />

                {availablePermissions.length > 0 && (
                  <>
                    <Divider />
                    <Box sx={{ mt: 5 }}>
                      <Typography
                        className="settings-user-data-key"
                        sx={{ mb: 2 }}
                      >
                        Permissions{" "}
                      </Typography>

                      <Grid container spacing={1}>
                        {availablePermissions.map((permission) => {
                          return (
                            <Grid item xs={12} sm={6} md={6} key={permission}>
                              <Typography
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {" "}
                                <CheckBox
                                  sx={{
                                    fontSize: "18px",
                                    color: "skyblue",
                                    mr: 1,
                                  }}
                                  defaultChecked
                                />{" "}
                                <span className="settings-user-data-value">
                                  {permission}
                                </span>
                              </Typography>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Box>
        )}
        {/* Dialog For change password */}
        <Dialog
          sx={{ p: 2 }}
          open={openChangePassword}
          onClose={handleCloseChangePasswordDialog}
        >
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <CircularProgress color="info" />
            </Box>
          )}
          <Typography
            sx={{ mt: 2, fontSize: "20px" }}
            align="center"
            variant="h5"
          >
            Change Password
          </Typography>
          <DialogContent>
            <form onSubmit={handleChangePassword}>
              <Box sx={{ mb: 2 }}>
                <FormControl
                  sx={{ width: { md: "400px", sm: "300px", xs: "220px" } }}
                  variant="outlined"
                  size="small"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Current Password
                  </InputLabel>
                  <OutlinedInput
                    label="Current Password"
                    required
                    id="outlined-adornment-password"
                    type={values.showCurrentPassword ? "text" : "password"}
                    onChange={handleChange("currentPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCurrentPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          <PasswordVisibilityIcon
                            value={values.showCurrentPassword}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControl
                  sx={{ width: { md: "400px", sm: "300px", xs: "220px" } }}
                  variant="outlined"
                  size="small"
                >
                  <InputLabel htmlFor="outlined-adornment-password2">
                    New Password
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="outlined-adornment-password2"
                    type={values.showNewPassword ? "text" : "password"}
                    onChange={handleChange("newPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          <PasswordVisibilityIcon
                            value={values.showNewPassword}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                    label="New Password"
                  />
                </FormControl>
              </Box>

              <Box sx={{ mb: 2 }}>
                <FormControl
                  sx={{ width: { md: "400px", sm: "300px", xs: "220px" } }}
                  variant="outlined"
                  size="small"
                >
                  <InputLabel htmlFor="outlined-adornment-password3">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    required
                    id="outlined-adornment-password3"
                    type={values.showConfirmPassword ? "text" : "password"}
                    onChange={handleChange("confirmPassword")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          <PasswordVisibilityIcon
                            value={values.showConfirmPassword}
                          />
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
                <Typography
                  variant="body2"
                  sx={{ color: "red", fontSize: "12px", mt: "2px" }}
                >
                  {passwordSubmitError}
                </Typography>
              </Box>
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Setting;
