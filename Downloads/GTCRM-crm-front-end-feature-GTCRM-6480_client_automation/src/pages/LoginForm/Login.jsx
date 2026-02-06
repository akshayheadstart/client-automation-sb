import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  CircularProgress,
  Grid,
} from "@mui/material";

import "../../styles/Login.css";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Page500 from "../ErrorPages/Page500";
import { TopContext } from "../../store/contexts/TopContext";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import {
  collegeIdToResentPassword,
  loginAPI,
  recaptchaApi,
  siteKey,
} from "../../constants/CommonApiUrls";
import {
  setLoadTokenVerify,
  setUserCollegeInfo,
  setUserEmail,
} from "../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import Logo from "../../images/updated-apollo-logo.png";
import headStartLogo from "../../images/headstart-logo.png";
import hintIcon from "../../images/hintIcon.png";
import linkedinLinkIcon from "../../images/linkdinLinkIcon.png";
import facebookLinkIcon from "../../images/facebookLinkIcon.png";
import websiteLinkIcon from "../../images/websiteLinkIcon.png";
import useToasterHook from "../../hooks/useToasterHook";
import {
  tableSlice,
  useFetchCollegeListMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import CollegeListDialogue from "../../components/ui/Login/collegeListDialogue";
import { filterOptionData } from "../../Redux/Slices/filterDataSlice";
import { telephonyData } from "../../Redux/Slices/telephonySlice";
import { adminDashboardSlice } from "../../Redux/Slices/adminDashboardSlice";
function Login() {
  const pushNotification = useToasterHook();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogCollege, setOpenDialogCollege] = useState(false);
  const [error, setError] = useState("");
  const { showLogin, setShowLogin } = useContext(TopContext);
  //state for login email and password field
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // setting forgot email
  const [forgotEmail, setForgotEmail] = useState("");
  const forgotPasswordApiUrl = `${
    import.meta.env.VITE_API_BASE_URL
  }/user/reset_password/?email=${forgotEmail}&college_id=${collegeIdToResentPassword}`;
  const [userColleges, setUserColleges] = useState([]);
  const [currentToken, setCurrentToken] = useState({});
  //api response loader state
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleClickOpenDialogCollege = () => {
    setOpenDialogCollege(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialogCollege = () => {
    setOpenDialogCollege(false);
  };

  //handle dialog form submit
  const handleDialogForm = () => {};

  const [fetchCollegeList] = useFetchCollegeListMutation();

  // ! initialize google recaptcha
  useEffect(() => {
    Cookies.remove("account_added_access_token");
    Cookies.remove("account_added_refresh_token");
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    // load the script by passing the URL
    loadScriptByURL(
      "recaptcha-key",
      `https://www.google.com/recaptcha/api.js?render=${siteKey}`,
      function () {}
    );
  }, []);

  //clear all cache of RTK query
  useEffect(() => {
    dispatch(tableSlice.util.resetApiState());
    dispatch(filterOptionData.util.resetApiState());
    dispatch(telephonyData.util.resetApiState());
    dispatch(adminDashboardSlice.util.resetApiState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const requestRoute = localStorage.getItem(`requestRoute`);
  const [requestLink, setRequestLink] = useState("");
  useEffect(() => {
    if (requestRoute) {
      const storedDataObject = JSON.parse(requestRoute);
      if (storedDataObject) {
        setRequestLink(storedDataObject);
      } else {
        setRequestLink(null);
      }
    }
  }, [requestRoute]);

  const submitDetails = (result, decoded) => {
    Cookies.set("userId", decoded.sub, {
      expires: 30,
    });
    Cookies.set("season", "");
    dispatch(setLoadTokenVerify(true));
    dispatch(
      setUserEmail({
        userId: decoded.sub,
        authenticated: true,
      })
    );
    Cookies.set("jwtTokenCredentialsRefreshToken", result?.refresh_token, {
      expires: 30,
    });
    Cookies.set("jwtTokenCredentialsAccessToken", result?.access_token, {
      expires: 30,
    });

    // localStorage.clear();
    // if (Cookies.get("locationFrom")) {
    //   navigate(`${Cookies.get("locationFrom")}`);
    // }
    navigate(requestLink ? `${requestLink}` : "/");
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const refreshToken = Cookies.get("jwtTokenCredentialsRefreshToken");
  useEffect(() => {
    if (token && refreshToken && !requestRoute) {
      navigate("/");
    }
  }, [navigate, token, refreshToken, requestRoute]);
  // recaptcha with login handler function
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(siteKey, { action: "submit" })
        .then((captchaToken) => {
          submitDataForLogin(captchaToken);
        });
    });
  };

  const submitDataForLogin = (captchaToken) => {
    //* call a backend API to verify reCAPTCHA response
    // !IMPORTANT TODO:- For testing purpose, we are disabling recaptcha, when we will merge, we will enable it
    // fetch(recaptchaApi, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     response: captchaToken,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((res) => {
    //     if (res?.message === "Human is found.") {
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    var urlencoded = new URLSearchParams();
    urlencoded.append("username", loginEmail);
    urlencoded.append("password", loginPassword);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };
    fetch(loginAPI, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        //if login successfull
        if (result.access_token) {
          const decoded = jwt_decode(result?.access_token);
          // submitDetails(result, decoded);
          try {
            fetchCollegeList({
              usingFor: "authentication",
              token: result?.access_token,
            })
              .unwrap()
              .then((response) => {
                if (Array.isArray(response?.data)) {
                  const collegeArray = response?.data;
                  setUserColleges(collegeArray);
                  if (collegeArray.length > 1) {
                    setIsLoading(false);
                    setCurrentToken({
                      token: result,
                      decoded: decoded,
                    });
                    handleClickOpenDialogCollege();
                  } else {
                    setIsLoading(false);
                    dispatch(
                      setUserCollegeInfo({
                        initialCollege:
                          collegeArray.length > 0 ? collegeArray[0] : {},
                        collegeList: collegeArray,
                      })
                    );
                    Cookies.set(
                      "COLLEGE_ID",
                      JSON.stringify(
                        collegeArray.length > 0 ? collegeArray[0] : {}
                      ),
                      {
                        expires: 30,
                      }
                    );
                    Cookies.set("COLLEGE_LIST", JSON.stringify(collegeArray), {
                      expires: 30,
                    });
                    submitDetails(result, decoded);
                  }
                } else {
                  throw new Error(
                    "College list api response has been changed."
                  );
                }
              })
              .catch((error) => {
                if (error?.status === 404) {
                  pushNotification("warning", error?.data?.detail);
                  submitDetails(result, decoded);
                } else if (error?.message) {
                  pushNotification("error", error?.message);
                } else if (error?.data?.detail) {
                  pushNotification("error", error?.data?.detail);
                }
              })
              .finally(() => {
                setIsLoading(false);
              });
          } catch (error) {
            setIsLoading(false);
            pushNotification("error", error?.message);
          }
        } //show the api status
        else if (result.detail === "Not Found") {
          setIsLoading(false);
          pushNotification("error", result?.detail);
        }
        //show the api status
        else if (result?.detail) {
          setIsLoading(false);
          pushNotification("error", result?.detail);
        }
      })
      .catch((error) => {
        if (error.message) {
          setError(error.message);
        }
      });
    //   } else {
    //     handleClickOpenDialog();
    //     setIsLoading(false);
    //   }
    // })
    // .catch((error) => {
    //   if (error.message) {
    //     setIsLoading(false);
    //     setError(error.message);
    //   }
    // });
  };

  // handle email submit to send email to user
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    fetch(forgotPasswordApiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          navigate("/verifyPage", {
            state: {
              name: "resetVerify",
              resetEmail: forgotEmail,
              title: "Reset Password Link Sent",
            },
          });
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((error) => {
        if (error.message) {
          setError(error.message);
        }
      });
  };
  const linkComponent = () => {
    return (
      <Box className="link-icon-box-container">
        <img
          width={28}
          height={28}
          src={hintIcon}
          alt="logo"
          className="link-icon-action"
        />
        <Box className="link-logo-icon-container">
          <a
            href="https://www.linkedin.com/company/go-headstart"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width={28}
              height={28}
              src={linkedinLinkIcon}
              alt="logo"
              className="link-icon-action"
            />
          </a>
          <a
            href="https://www.facebook.com/CRMHeadstart"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width={28}
              height={28}
              src={facebookLinkIcon}
              alt="logo"
              className="link-icon-action"
            />
          </a>
          <a
            href="https://www.headstart.biz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              width={28}
              height={28}
              src={websiteLinkIcon}
              alt="logo"
              className="link-icon-action"
            />
          </a>
        </Box>
      </Box>
    );
  };
  return (
    <>
      {error ? (
        <Page500 />
      ) : (
        <div className="authentication-container">
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={7} className="show-grid">
                <Box className="login-box-container-grid">
                  <Box>
                    <img
                      src={headStartLogo}
                      alt="logo"
                      className="logo-height-width"
                    />
                    <Typography className="simple-text">
                      SIMPLE. SECURE. FAST
                    </Typography>
                  </Box>
                </Box>
                {linkComponent()}
              </Grid>
              <Grid
                item
                xs={12}
                md={6}
                lg={5}
                className="login-background-container"
              >
                <Box className="login-box-container-grid">
                  <Box>
                    <Box className="login-logo-container">
                      <img
                        src={headStartLogo}
                        alt="logo"
                        className="logo-height-width"
                      />
                    </Box>
                    {/* login  */}
                    {showLogin === "login" && (
                      <Box className="common-authentication-form">
                        <form
                          onSubmit={handleLogin}
                          className="common-authentication-fields"
                        >
                          {isLoading && (
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <CircularProgress color="info" />
                            </Box>
                          )}
                          <Typography align="center" variant="h5">
                            LOGIN
                          </Typography>

                          <TextField
                            color="info"
                            required
                            sx={{ mt: 2 }}
                            size="small"
                            type="text"
                            id="outlined-basic"
                            label="Enter user ID"
                            variant="outlined"
                            onChange={(e) => setLoginEmail(e.target.value)}
                          />
                          <TextField
                            required
                            sx={{ mt: 3 }}
                            size="small"
                            type="password"
                            id="outlined-basic"
                            label="Enter password"
                            variant="outlined"
                            onChange={(e) => setLoginPassword(e.target.value)}
                            color="info"
                          />

                          <Button
                            sx={{ color: "white", mt: 3 }}
                            type="submit"
                            variant="contained"
                            color="info"
                          >
                            LOGIN
                          </Button>
                        </form>
                        <Box className="login-form-button-group">
                          <Button
                            color="info"
                            onClick={() => setShowLogin("forgot")}
                            type="text"
                          >
                            FORGOT PASSWORD?
                          </Button>
                        </Box>
                      </Box>
                    )}
                    {/* forgot */}
                    {showLogin === "forgot" && (
                      <Box className="common-authentication-form">
                        <Typography variant="h5" align="center" color="info">
                          Forgot Password?
                        </Typography>
                        <form onSubmit={handleEmailSubmit}>
                          <TextField
                            required
                            sx={{ mt: 2 }}
                            size="small"
                            type="email"
                            id="outlined-basic"
                            label="Enter email address"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => setForgotEmail(e.target.value)}
                            color="info"
                          />
                          <Button
                            sx={{ mt: 2 }}
                            size="small"
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="info"
                          >
                            SUBMIT
                          </Button>
                        </form>
                        <Box sx={{ mt: 1 }} className="login-form-button-group">
                          <Button
                            color="info"
                            onClick={() => setShowLogin("login")}
                            type="text"
                          >
                            LOGIN?
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box className="link-icon-box-container2">
                  <img
                    width={28}
                    height={28}
                    src={hintIcon}
                    alt="logo"
                    className="link-icon-action"
                  />
                  <Box className="link-logo-icon-container">
                    <a
                      href="https://www.linkedin.com/company/go-headstart"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        width={28}
                        height={28}
                        src={linkedinLinkIcon}
                        alt="logo"
                        className="link-icon-action"
                      />
                    </a>
                    <a
                      href="https://www.facebook.com/CRMHeadstart"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        width={28}
                        height={28}
                        src={facebookLinkIcon}
                        alt="logo"
                        className="link-icon-action"
                      />
                    </a>
                    <a
                      href="https://www.headstart.biz"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        width={28}
                        height={28}
                        src={websiteLinkIcon}
                        alt="logo"
                        className="link-icon-action"
                      />
                    </a>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* dialog to show when recaptcha verification is failed */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <Box sx={{ px: 2 }}>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <QuestionMarkIcon
                    sx={{
                      height: 40,
                      width: 40,
                      color: "red",
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  Recaptcha Verfication Failed
                </Typography>
                <DialogContent sx={{ textAlign: "right" }}>
                  <DialogContentText sx={{ textAlign: "center" }}>
                    If you receive this error consistently contact our support
                    team who will be able to help complete the changes you need
                    to make.
                  </DialogContentText>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleDialogForm();
                    }}
                  >
                    <TextField
                      required
                      sx={{ mt: 2 }}
                      fullWidth
                      size="small"
                      type="email"
                      id="outlined-basic"
                      label="Enter email address"
                      variant="outlined"
                      color="info"
                    />
                    <br />
                    <TextField
                      required
                      fullWidth
                      size="small"
                      id="outlined-multiline-static"
                      sx={{ mt: 2 }}
                      label="Message"
                      multiline
                      rows={4}
                      color="info"
                    />

                    <br />
                    <Button
                      size="small"
                      sx={{ mt: 2, mr: 2 }}
                      onClick={handleCloseDialog}
                      variant="contained"
                      color="info"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="small"
                      type="submit"
                      sx={{ mt: 2 }}
                      variant="contained"
                      color="info"
                    >
                      Send
                    </Button>
                  </form>
                </DialogContent>
              </Box>
            </Dialog>
            <CollegeListDialogue
              handleCloseDialog={handleCloseDialogCollege}
              openDialog={openDialogCollege}
              collegeDetails={userColleges}
              currentToken={currentToken}
              submitDetails={submitDetails}
            ></CollegeListDialogue>
          </Box>
        </div>
      )}
    </>
  );
}

export default Login;
