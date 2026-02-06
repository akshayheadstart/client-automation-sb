/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Avatar,
  Backdrop,
  // Container,
  // Grid,
  // IconButton,
  Badge,
  Box,
  Button,
  CircularProgress,
  // List,
  // ListItem,
  // ListItemText,
  // ListItemButton,
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import audioFile from "../../../constants/notification.mp3";
import silenceAudioFile from "../../../constants/silence.mp3";
// import Svg from "../../../icons/Vector.svg";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SelectPicker } from "rsuite";
import {
  useFetchCollegeListMutation,
  useGetCollegeListQuery,
  useGetSeasonListQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import {
  fetchLogout,
  removeCookies,
  setLiveApplicantCount,
  setLoadTokenVerify,
  setPermissions,
  setSelectedSeason,
  setSidebarFixed,
  setUserCollegeInfo,
  setUserEmail,
} from "../../../Redux/Slices/authSlice";
import {
  fetchNotifications,
  setApiResponseChangeMessageForNotification,
  setNotificationInternalServerError,
  setPageNumber,
  setSomethingWentWrongInNotification,
} from "../../../Redux/Slices/notificationSlice";
import { loginAPI } from "../../../constants/CommonApiUrls";
import { notificationIcons } from "../../../constants/notificationSvgIcons";
import { removeUnderlineAndJoin } from "../../../helperFunctions/calendarHelperfunction";
import useDebounce from "../../../hooks/useDebounce";
import useSetActionDisable from "../../../hooks/useSetActionDisable";
import useToasterHook from "../../../hooks/useToasterHook";
import NewSearchIcon from "../../../icons/search-icon.svg";
import notificationIcon from "../../../images/notificationIcon.svg";
import profilePhoto from "../../../images/profile.png";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import "../../../styles/AdminDashboard.css";
import "../../../styles/MODDesignPage.css";
import "../../../styles/PanellistDesignPage.css";
import "../../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import AcountSwitchDialogue from "../../shared/Dialogs/AcountSwitchDialogue";
import TelephonyDialog from "../../shared/Dialogs/TelephonyDialog";
import ErrorAndSomethingWentWrong from "../../shared/ErrorAnimation/ErrorAndSomethingWentWrong";
import CollegeListDialogue from "../../ui/Login/collegeListDialogue";
import CheckInOutBox from "./CheckInOutBox";
import "./Navbar.css";
import NotificationBox from "./NotificationBox";
import SearchBox from "./SearchBox";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";

export default function Navbar(props) {
  const pushNotification = useToasterHook();
  const tokenState = useSelector((state) => state.authentication.token);
  const user = tokenState?.sub;

  const {
    fixed,
    permissions,
    // showTopNavbar, isActionDisable
  } = props;
  const [navbarPermission, setNavbarPermission] = useState({});

  const authAccessToken = Cookies.get("jwtTokenCredentialsAccessToken");
  const authRefreshToken = Cookies.get("jwtTokenCredentialsRefreshToken");
  // const [hover, setHover] = useState(false);
  const [loadingCollege, setLoadingCollege] = useState(false);
  const dispatch = useDispatch();

  const [userColleges, setUserColleges] = useState(
    Cookies.get("COLLEGE_LIST") ? JSON.parse(Cookies.get("COLLEGE_LIST")) : []
  );
  const [currentToken, setCurrentToken] = useState({});
  const [openDialogCollege, setOpenDialogCollege] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [from, setFrom] = useState("");
  // const onHover = () => {
  //   setHover(true);
  // };
  // const onLeave = () => {
  //   setHover(false);
  // };

  //notification
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [sessionData, setSessionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openAccoundSwitch, setOpenAccoundSwitch] = React.useState(false);
  const [openSwitchToMainAccount, setSwitchToMainAccount] =
    React.useState(false);
  const [openRemoveAddedAccount, setOpenRemoveAddedAccount] =
    React.useState(false);
  const [openRemoveUserWhoAddedAccount, setRemoveUserWhoAddedAccount] =
    React.useState(false);

  useEffect(() => {
    setNavbarPermission(permissions?.["20423735"]?.features);
  }, [permissions]);

  const handleClickOpenAccountSwitchDialog = () => {
    setOpenAccoundSwitch(true);
  };
  const switchToMainAccount = () => {
    setSwitchToMainAccount(true);
  };
  const closeSwitchToMainAccount = () => {
    setSwitchToMainAccount(false);
  };

  const handleCloseAccountSwitchDialog = () => {
    setOpenAccoundSwitch(false);
  };

  const handleClickOpenAccountRemove = () => {
    setOpenRemoveAddedAccount(true);
  };
  const handleClickCloseAccountRemove = () => {
    setOpenRemoveAddedAccount(false);
  };
  const handleClickRemoveAddingUser = () => {
    setRemoveUserWhoAddedAccount(true);
  };
  const handleClickCloseAddingUserRemove = () => {
    setRemoveUserWhoAddedAccount(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { currentUserDetails } = useFetchCommonApi();
  const [addedUserEmail, setAddedUserEmail] = useState("");
  const [addingUserEmail, setAddingUserEmail] = useState("");
  const [multipleAccountAccessToken, setMultipleAccountAccessToken] = useState(
    []
  );
  const [multipleAccountRefreshToken, setMultipleAccountRefreshToken] =
    useState([]);
  //state for Add Accound email and password field
  const [addAccountEmail, setAddAccountEmail] = useState("");
  const [addAccountPassword, setAddAcountPassword] = useState("");
  // Add User Dialog
  const [openAddUserDialog, setOpenAddUserDialog] = React.useState(false);
  const handleClickOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };
  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  // Adding accound validation
  const [userValidationError, setUserValidationError] = useState("");

  // profile
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowNotificationBox(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  //Notifications API response
  const {
    hideNotification,
    pageNumber,
    pageSize,
    totalUnread,
    toggleNotifications,
  } = useSelector((state) => state?.notificationsData);

  useEffect(() => {
    if (tokenState?.sub && collegeId && !toggleNotifications) {
      const timer = setInterval(() => {
        dispatch(setPageNumber(1));
        if (localStorage.getItem("showUnread") === "true") {
          dispatch(
            fetchNotifications({
              userEmail: user,
              unReadNotification: true,
              page: pageNumber,
              pageSizeNumber: pageSize,
              collegeId: collegeId,
              pushNotification,
              handleSomethingWentWrong,
              handleInternalServerError,
              setSomethingWentWrongInNotification: dispatch(
                setSomethingWentWrongInNotification
              ),
              setNotificationInternalServerError: dispatch(
                setNotificationInternalServerError
              ),
              setApiResponseChangeMessageForNotification: dispatch(
                setApiResponseChangeMessageForNotification
              ),
            })
          );
        } else {
          dispatch(
            fetchNotifications({
              userEmail: user,
              page: pageNumber,
              pageSizeNumber: pageSize,
              collegeId: collegeId,
              pushNotification,
              handleSomethingWentWrong,
              handleInternalServerError,
              setSomethingWentWrongInNotification: dispatch(
                setSomethingWentWrongInNotification
              ),
              setNotificationInternalServerError: dispatch(
                setNotificationInternalServerError
              ),
              setApiResponseChangeMessageForNotification: dispatch(
                setApiResponseChangeMessageForNotification
              ),
            })
          );
        }
      }, 600000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, collegeId]);

  useEffect(() => {
    if (user?.length > 0 && collegeId && !toggleNotifications) {
      if (localStorage.getItem("showUnread") === "true") {
        dispatch(
          fetchNotifications({
            userEmail: user,
            unReadNotification: true,
            collegeId: collegeId,
            page: pageNumber,
            pageSizeNumber: pageSize,
            pushNotification,
            handleSomethingWentWrong,
            handleInternalServerError,
            setSomethingWentWrongInNotification: dispatch(
              setSomethingWentWrongInNotification
            ),
            setNotificationInternalServerError: dispatch(
              setNotificationInternalServerError
            ),
            setApiResponseChangeMessageForNotification: dispatch(
              setApiResponseChangeMessageForNotification
            ),
          })
        );
      } else {
        dispatch(
          fetchNotifications({
            userEmail: user,
            collegeId: collegeId,
            page: pageNumber,
            pageSizeNumber: pageSize,
            pushNotification,
            handleSomethingWentWrong,
            handleInternalServerError,
            setSomethingWentWrongInNotification: dispatch(
              setSomethingWentWrongInNotification
            ),
            setNotificationInternalServerError: dispatch(
              setNotificationInternalServerError
            ),
            setApiResponseChangeMessageForNotification: dispatch(
              setApiResponseChangeMessageForNotification
            ),
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, user, collegeId]);
  useEffect(() => {
    hideNotification && setShowNotificationBox(false);
  }, [hideNotification]);

  const userAddedAccessToken = Cookies.get("account_added_access_token");
  const userAddedRefreshToken = Cookies.get("account_added_refresh_token");
  useEffect(() => {
    if (userAddedAccessToken) {
      const userAccessToken = JSON.parse(userAddedAccessToken);
      setMultipleAccountAccessToken(userAccessToken);
      const userRefreshToken = JSON.parse(userAddedRefreshToken);
      setMultipleAccountRefreshToken(userRefreshToken);
      const addingUserEmail = jwt_decode(userAccessToken[0]);
      const addedUserEmail = jwt_decode(userAccessToken[1]);
      setAddedUserEmail(addedUserEmail.sub);
      setAddingUserEmail(addingUserEmail.sub);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, userAddedAccessToken]);

  // Data validation for adding a new account
  const submitDataForAddUser = (e) => {
    setUserValidationError("");
    e.preventDefault();
    if (user === addAccountEmail) {
      pushNotification(
        "warning",
        "This is your current account. Try to add another."
      );
    } else {
      var myHeaders = new Headers();
      myHeaders.append("Accept", "application/json");
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
      var urlencoded = new URLSearchParams();
      urlencoded.append("username", addAccountEmail);
      urlencoded.append("password", addAccountPassword);
      // urlencoded.append("scope", "student");
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
        redirect: "follow",
      };
      setIsLoading(true);
      fetch(loginAPI, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //if Adding user found successfull
          if (result.access_token) {
            const addingAccountAccessToken = [
              authAccessToken,
              result.access_token,
            ];
            const json_str_account_AccessToken = JSON.stringify(
              addingAccountAccessToken
            );
            Cookies.set(
              "account_added_access_token",
              json_str_account_AccessToken,
              { expires: 30 }
            );
            const addingAccountRefreshToken = [
              authRefreshToken,
              result.refresh_token,
            ];
            const json_str_account_RefreshToken = JSON.stringify(
              addingAccountRefreshToken
            );
            Cookies.set(
              "account_added_refresh_token",
              json_str_account_RefreshToken,
              { expires: 30 }
            );
            pushNotification("success", "Account Added Successfully");
            handleCloseAddUserDialog();
            setIsLoading(false);
          } else if (result?.detail) {
            setUserValidationError(result?.detail);
            setIsLoading(false);
          }
        });
    }
  };

  const handleClickOpenDialogCollege = () => {
    setOpenDialogCollege(true);
  };
  const handleCloseDialogCollege = () => {
    setOpenDialogCollege(false);
  };
  const submitDetails = (token, decoded) => {
    Cookies.set("jwtTokenCredentialsAccessToken", token.accessToken, {
      expires: 1,
    });
    Cookies.set("jwtTokenCredentialsRefreshToken", token.refreshToken, {
      expires: 30,
    });
    Cookies.set("userId", decoded.sub, {
      expires: 30,
    });
    dispatch(setLoadTokenVerify(true));
    dispatch(setUserEmail({ userId: decoded.sub, authenticated: true }));
    pushNotification("success", successMessage);
    setIsLoading(false);
    handleCloseAccountSwitchDialog();
    navigate("/");
    Cookies.set("season", "");
    window.location.reload();
  };

  const [fetchCollegeList] = useFetchCollegeListMutation();

  // Switch into another account
  const handleActiveAnotherUser = (token, successMessage) => {
    dispatch(setPageNumber(1));
    //if login successfull
    if (token) {
      const decoded = jwt_decode(token.accessToken);

      try {
        setLoadingCollege(true);
        fetchCollegeList({
          usingFor: "authentication",
          token: token?.accessToken,
        })
          .unwrap()
          .then((response) => {
            if (Array.isArray(response?.data)) {
              setSuccessMessage(successMessage);
              const collegeArray = response?.data;
              setUserColleges(collegeArray);

              if (collegeArray.length > 1) {
                setIsLoading(false);
                setCurrentToken({
                  token: token,
                  decoded: decoded,
                });
                handleClickOpenDialogCollege();
              } else {
                setIsLoading(false);
                dispatch(
                  setUserCollegeInfo({
                    initialCollege:
                      collegeArray.length > 0 ? collegeArray[0] : {},
                    collegeList: collegeArray ? collegeArray : [],
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
                Cookies.set(
                  "COLLEGE_LIST",
                  JSON.stringify(collegeArray ? collegeArray : []),
                  {
                    expires: 30,
                  }
                );
                submitDetails(token, decoded);
              }
            } else {
              throw new Error("College list api response has been changed.");
            }
          })
          .catch((error) => {
            if (error?.status === 404) {
              pushNotification("warning", error?.data?.detail);
              submitDetails(token, decoded);
            } else if (error?.status === 401) {
              closeSwitchToMainAccount();
              handleCloseAccountSwitchDialog();
              Cookies.remove("account_added_access_token");
              Cookies.remove("account_added_refresh_token");
              setAddedUserEmail("");
              setAddingUserEmail("");
              setIsLoading(false);
              pushNotification(
                "error",
                "This account credentials have become outdated, please add this account again"
              );
            } else if (error?.message) {
              pushNotification("error", error?.message);
            } else if (error?.data?.detail) {
              if (error?.data?.detail === "Could not validate credentials") {
                window.reload();
              }
              pushNotification("error", error?.data?.detail);
            }
          })
          .finally(() => {
            setLoadingCollege(false);
            setIsLoading(false);
          });
      } catch (error) {
        pushNotification("error", error?.message);
        setLoadingCollege(false);
        setIsLoading(false);
      }
    }
  };
  // Removing  account
  const removeAccount = (token) => {
    setIsLoading(true);
    handleCloseAccountSwitchDialog();
    Cookies.remove("account_added_access_token");
    Cookies.remove("account_added_refresh_token");
    setAddedUserEmail("");
    setAddingUserEmail("");
    setIsLoading(false);
    handleActiveAnotherUser(token, "Account Removed");
  };

  useEffect(() => {
    if (showNotificationBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showNotificationBox]);

  const [showSearchBox, setShowSearchBox] = useState(false);
  const [searchText, setSearchText] = useState("");

  // real Time notification
  // TODO:- Currently disabling this , In future We will Update this code
  const [receivedNotification, setReceivedNotification] = useState(null);
  const token = {
    access_token: authAccessToken,
  };

  // const collegeId = useSelector(
  //   (state) => state.authentication.currentUserInitialCollege?.id
  // );
  // TODO:- Currently disabling this , In future We will Update this code
  const updateNotificationStatus = (notificationId) => {
    fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/notifications/update/?mark_as_read=${true}${
        notificationId ? "&notification_id=" + notificationId : ""
      }&user_email=${tokenState?.sub}${
        collegeId ? "&college_id=" + collegeId : ""
      }&feature_key=a1474415`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
        },
      }
    ).then((res) =>
      res
        .json()
        .then((result) => {
          if (result?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result?.message) {
            const expectedData = result?.message;
            try {
              if (typeof expectedData === "string") {
                dispatch(
                  fetchNotifications({
                    userEmail: tokenState?.sub,
                    collegeId: collegeId,
                    page: pageNumber,
                    pageSizeNumber: pageSize,
                    pushNotification,
                    handleSomethingWentWrong,
                    handleInternalServerError,
                    setSomethingWentWrongInNotification: dispatch(
                      setSomethingWentWrongInNotification
                    ),
                    setNotificationInternalServerError: dispatch(
                      setNotificationInternalServerError
                    ),
                    setApiResponseChangeMessageForNotification: dispatch(
                      setApiResponseChangeMessageForNotification
                    ),
                  })
                );
              } else {
                throw new Error(
                  "notifications update API response has changed"
                );
              }
            } catch (error) {}
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
        .catch((err) => {})
    );
  };

  // TODO:- Currently disabling this , In future We will Update this code

  useEffect(() => {
    try {
      const socket = new WebSocket(
        `${import.meta.env.VITE_API_WEBSOCKET_URL}/ws/notification/${
          collegeId ? collegeId + "/" : ""
        }`
      );
      socket.onopen = () => {
        socket.send(JSON.stringify(token));
      };
      socket.onmessage = (event) => {
        let notification = JSON.parse(event?.data);
        const audio = new Audio(audioFile);
        audio.addEventListener("canplaythrough", (event) => {
          // the audio is now playable; play it if permissions allow
          audio?.play();
        });
        toast(
          <Box>
            <Box>
              <span className={"notification-red-dot-realtime"}>
                {notificationIcons?.redDot}
              </span>
            </Box>

            <Box
              sx={{
                cursor: "pointer",
              }}
              disableGutters
              key={notification?.notification_id}
              className="notification-item-realtime"
              onClick={() => {
                updateNotificationStatus(notification?.notification_id);
                setShowNotificationBox(false);
                switch (notification?.event_type) {
                  case "Assigned Lead":
                    navigate("/userProfile", {
                      state: {
                        applicationId: notification?.application_id,
                        studentId: notification?.student_id,
                        eventType: notification?.event_type,
                      },
                    });
                    break;
                  case "Student Created Query":
                    navigate("/userProfile", {
                      state: {
                        applicationId: notification?.application_id,
                        studentId: notification?.student_id,
                        eventType: "total-queries",
                        tabs: true,
                      },
                    });
                    break;

                  case "Manual Assignment of Lead":
                    navigate("/form-manager", {
                      state: {
                        todays_assigned: true,
                      },
                    });
                    break;
                  case "Important Update":
                    navigate("/resources", {
                      state: {
                        update_resource_id: notification?.update_resource_id,
                        tabs: 1,
                      },
                    });
                    break;
                  case "Data Segment Assignment":
                    window.open(notification?.data_segment_redirect_link);
                    break;
                  default:
                    navigate("/userProfile", {
                      state: {
                        applicationId: notification?.application_id,
                        studentId: notification?.student_id,
                        eventType: notification?.event_type,
                      },
                    });
                }
              }}
            >
              <Box>{notificationIcons[notification?.event_type]}</Box>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: `${notification?.message}</br> <span id="notification-time">
                                      ${notification?.event_datetime}
                                  </span>`,
                }}
                className="notification-inner-title"
                sx={{
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "var(--dark-tone-100, #121828)",
                }}
                variant="body2"
              ></Typography>
            </Box>
          </Box>,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
        setReceivedNotification(notification);
        localStorage.setItem("showUnread", false);
        dispatch(
          fetchNotifications({
            userEmail: Cookies.get("userId"),
            unReadNotification:
              localStorage.getItem("showUnread") === "true" && true,
            page: pageNumber,
            pageSizeNumber: pageSize,
            collegeId: collegeId,
            pushNotification,
            handleSomethingWentWrong,
            handleInternalServerError,
            setSomethingWentWrongInNotification: dispatch(
              setSomethingWentWrongInNotification
            ),
            setNotificationInternalServerError: dispatch(
              setNotificationInternalServerError
            ),
            setApiResponseChangeMessageForNotification: dispatch(
              setApiResponseChangeMessageForNotification
            ),
          })
        );
      };
      socket.onerror = (error) => {
        pushNotification(
          "error",
          "Something went wrong with live notification"
        );
      };

      //Add cleanup function here
      return () => {
        socket.close();
      };
    } catch (error) {
      pushNotification("error", "Something went wrong with live notification");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For now we are commenting websocket connection's code. In future, we will activate it.
  useEffect(() => {
    if (collegeId) {
      try {
        const socket = new WebSocket(
          `${
            import.meta.env.VITE_API_WEBSOCKET_URL
          }/ws/liveApplicants/${collegeId}/`
        );
        socket.onopen = () => {
          socket.send(JSON.stringify({ access_token: authAccessToken }));
        };
        socket.onmessage = (data) => {
          const liveApplicants = JSON.parse(data?.data);
          dispatch(setLiveApplicantCount(liveApplicants ? liveApplicants : {}));
        };
        socket.onerror = (error) => {
          pushNotification(
            "error",
            "Something went wrong with live applicants count"
          );
        };

        return () => {
          socket.close();
        };
      } catch (error) {
        pushNotification(
          "error",
          "Something went wrong with live applicants count"
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId]);

  const debouncedSearchText = useDebounce(searchText, 500);
  //getting data form context
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const { selectedCollegeId, setSelectedCollegeId, headTitle } =
    useContext(LayoutSettingContext);

  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );

  const [colleges, setColleges] = useState([]);
  const {
    data: listOfColleges,
    isSuccess,
    isError,
    error: getCollegeListError,
    isFetching: isFetchingCollegeList,
  } = useGetCollegeListQuery();
  useEffect(() => {
    /// Note : this api need to call in RTK query and invalidated by create client API

    try {
      if (isSuccess) {
        if (Array.isArray(listOfColleges?.data)) {
          const collegeList = [];
          listOfColleges?.data.forEach((college) => {
            collegeList.push({
              label: college.name,
              value: college.id,
            });
          });

          setSelectedCollegeId(collegeList[0]?.value);
          Cookies.set("collegeId", collegeList[0]?.value, {
            expires: 30,
          });

          setColleges(collegeList);
        } else {
          throw new Error("All application manager API response has changed");
        }
      } else if (isError) {
        if (
          getCollegeListError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (getCollegeListError?.data?.detail) {
          pushNotification("error", getCollegeListError?.data?.detail);
        }
        if (getCollegeListError?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      setTimeout(() => {
        navigate("/");
      }, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfColleges, isSuccess, isError, getCollegeListError]);
  const [navbarBackground, setNavbarBackground] = useState("transparent");
  const [topBox, setTopBox] = useState(15);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Change the background color based on scroll position
      if (scrollPosition > 15) {
        setNavbarBackground("white");
        setTopBox(0);
      } else {
        setNavbarBackground("transparent");
        setTopBox(15);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const [rightSidebar, setRightSidebar] = useState(false);
  const [
    isSomethingWentWrongInSeasonDetails,
    setIsSomethingWentWrongInSeasonDetails,
  ] = useState(false);
  const handleSetActionEnableOrDisable = useSetActionDisable(); // inside this hook, we are checking if the selected season is current or not. if not we are updating the isActionDisable state as true so that all the actions get disabled for old season.

  const seasonDetails = useGetSeasonListQuery(
    { collegeId },
    { skip: collegeId?.length > 0 ? false : true }
  );

  useEffect(() => {
    try {
      if (seasonDetails.isSuccess) {
        if (Array.isArray(seasonDetails?.data?.data)) {
          const updatedSessionList = [];
          let currentSeasonIndex = "";

          seasonDetails?.data?.data.forEach((season, index) => {
            updatedSessionList.push({
              label: season?.season_name,
              value: JSON.stringify(season),
            });
            if (season?.current_season) {
              currentSeasonIndex = index;
            }
          });

          const currentSeason = updatedSessionList[currentSeasonIndex].value;
          Cookies.set("season", currentSeason, { expires: 30 });
          handleSetActionEnableOrDisable(currentSeason);

          setSessionData(updatedSessionList);

          dispatch(setSelectedSeason(currentSeason));
        } else {
          throw new Error("Season list API response has changed");
        }
      } else if (seasonDetails.isError) {
        if (
          seasonDetails.error?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (seasonDetails.error?.data?.detail) {
          pushNotification("error", seasonDetails.error?.data?.detail);
        }
        if (seasonDetails.error.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSomethingWentWrongInSeasonDetails,
        "",
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId, seasonDetails]);

  const handleSetSeason = (value) => {
    dispatch(setSelectedSeason(value));
    Cookies.set("season", value, { expires: 30 });

    handleSetActionEnableOrDisable(value);
  };

  return (
    <>
      {isSomethingWentWrongInSeasonDetails ? (
        <ErrorAndSomethingWentWrong
          isSomethingWentWrong={isSomethingWentWrongInSeasonDetails}
        />
      ) : (
        <Box
          sx={{
            backgroundColor: navbarBackground,
            top: topBox,
            paddingBottom: "6px",
            zIndex: 101,
          }}
          className="navbar-box-container-nav"
        >
          <iframe
            title="crack-autoplay-notification"
            src={silenceAudioFile}
            allow="autoplay"
            id="audio"
            style={{ display: "none" }}
          ></iframe>
          <Box sx={{ px: 1 }}>
            <Box className="navbar-toggle-info-box">
              <MenuIcon
                className="mobNav"
                sx={{ mr: 2, cursor: "pointer" }}
                onClick={(event) => {
                  event.stopPropagation();
                  dispatch(setSidebarFixed(!fixed));
                }}
              />
              <Box className="view-only">
                {rightSidebar ? (
                  <CloseIcon
                    sx={{ mr: 1, cursor: "pointer" }}
                    onClick={(event) => {
                      setRightSidebar((prev) => !prev);
                    }}
                  />
                ) : (
                  <img
                    src={profilePhoto}
                    alt="profile Photo"
                    width="20px"
                    height="20px"
                    className="mobNav"
                    sx={{ mr: 2, cursor: "pointer", borderRadius: "100%" }}
                    onClick={(event) => {
                      setRightSidebar((prev) => !prev);
                    }}
                  />
                  // <MenuIcon
                  //   className="mobNav"
                  //   sx={{ mr: 2, cursor: "pointer" }}
                  //   onClick={(event) => {
                  //     setRightSidebar((prev) => !prev);
                  //   }}
                  // />
                )}
              </Box>
            </Box>
            <Box className="navbar-container-data">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MenuIcon
                  className="desktopNav"
                  sx={{ mr: 1, cursor: "pointer" }}
                  onClick={(event) => {
                    event.stopPropagation();
                    dispatch(setSidebarFixed(!fixed));
                  }}
                />
                <Box className="Navbar-headline-text">
                  <Typography
                    sx={{ whiteSpace: "nowrap", ml: "10px" }}
                    color="textPrimary"
                    variant="h5"
                  >
                    {headTitle ? removeUnderlineAndJoin(headTitle) : ""}
                  </Typography>
                </Box>
              </Box>

              <Box
                className={
                  rightSidebar
                    ? "mobile-display-show"
                    : "header_item mobile-display-not-show"
                }
              >
                {/* ----Contact in header----- */}
                <Box className="Navbar-all-box-container">
                  {/* ----Search box in header----- */}
                  {navbarPermission?.["608ac38c"]?.visibility && (
                    <ClickAwayListener
                      onClickAway={() => {
                        setShowSearchBox(false);
                        setSearchText("");
                      }}
                    >
                      {!showSearchBox ? (
                        <img
                          className="Navbar-search-Icon"
                          onClick={() => setShowSearchBox(true)}
                          src={NewSearchIcon}
                          alt=""
                          srcset=""
                          height={"43px"}
                        />
                      ) : (
                        <Box>
                          <TextField
                            onClick={() => {
                              setShowNotificationBox(false);
                            }}
                            value={searchText}
                            onChange={(event) => {
                              setSearchText(event.target.value);
                              setShowSearchBox(true);
                            }}
                            autoFocus
                            placeholder="Search"
                            size="small"
                            color="info"
                            sx={{
                              width: {
                                xs: "100%",
                                sm: "100%",
                                // lg: searchBoxWidth,
                              },
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {searchText?.length > 0 ? (
                                    <CloseIcon
                                      className="search-box-close-icon"
                                      onClick={() => {
                                        setSearchText("");
                                        setShowSearchBox(false);
                                      }}
                                    />
                                  ) : (
                                    <SearchIcon className="search-box-search-icon" />
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                          {showSearchBox && searchText?.length > 0 && (
                            <Box>
                              <SearchBox
                                searchText={debouncedSearchText}
                                setSearchText={setSearchText}
                                setShowSearchBox={setShowSearchBox}
                              ></SearchBox>
                            </Box>
                          )}
                        </Box>
                      )}
                    </ClickAwayListener>
                  )}
                  {headTitle === "Admin Dashboard" && (
                    <>
                      <SelectPicker
                        placeholder="Select college"
                        value={selectedCollegeId}
                        onChange={(value) => {
                          setSelectedCollegeId(value);
                          Cookies.set("collegeId", value, {
                            expires: 30,
                          });
                        }}
                        data={colleges}
                        className="select-picker"
                        cleanable={false}
                        size="lg"
                      />

                      <SelectPicker
                        onChange={(value) => handleSetSeason(value)}
                        data={sessionData}
                        placeholder="Select session"
                        value={selectedSeason}
                        className="select-picker"
                        cleanable={false}
                        size="lg"
                      />
                    </>
                  )}

                  {/* Check in and out */}
                  {currentUserDetails?.show_check_in && (
                    <CheckInOutBox currentUserDetails={currentUserDetails} />
                  )}
                  {/*------Notification in header----- */}
                  {navbarPermission?.["a1474415"]?.visibility && (
                    <ClickAwayListener
                      onClickAway={() => {
                        setShowNotificationBox(false);
                        dispatch(setPageNumber(1));
                      }}
                    >
                      <Box>
                        <Box
                          data-testid="notification-icon"
                          onClick={() => {
                            setShowNotificationBox((prev) => !prev);
                            dispatch(setPageNumber(1));
                          }}
                          className="notifications"
                        >
                          <Badge
                            badgeContent={totalUnread > 0 ? totalUnread : ""}
                            invisible={totalUnread > 0 ? false : true}
                            sx={{
                              "& .MuiBadge-badge": {
                                right: 3,
                                top: 6,
                                border: `2px solid rgba(224, 98, 89, 1)`,
                                padding: "0 2px",
                                backgroundColor: "rgba(224, 98, 89, 1)",
                                color: "white",
                              },
                            }}
                          >
                            <Box
                              className={
                                totalUnread > 0 && "notification-icon "
                              }
                            >
                              {" "}
                              <img
                                src={notificationIcon}
                                height="25px"
                                width="25px"
                                alt=""
                              />
                            </Box>
                          </Badge>
                        </Box>
                        {showNotificationBox && (
                          <Box>
                            <NotificationBox
                              setShowNotificationBox={setShowNotificationBox}
                            ></NotificationBox>
                          </Box>
                        )}
                      </Box>
                    </ClickAwayListener>
                  )}

                  {/* -------Profile in header------- */}

                  <Box sx={{ ml: "12px" }} className="profile">
                    <Box
                      sx={{ cursor: "pointer" }}
                      className="mod-profile-section"
                    >
                      {/* <Box sx={{ display: "flex" }}>
                  <NotificationsOutlinedIcon sx={{ color: "#008BE2" }} />
                  <Typography sx={{ ml: -1.8 }} className="mod-text-notification">
                    0
                  </Typography>
                </Box> */}
                      <Box
                        onClick={handleClick}
                        className="mod-photo-box-container"
                        data-testid="profile-icon"
                      >
                        <img
                          src={profilePhoto}
                          alt="Image description"
                          width="45px"
                          height="45px"
                          className="profile-photo-Navbar"
                        />
                        <Box className="current-user-name-and-designation-container">
                          <Typography>{currentUserDetails?.name}</Typography>
                          <Typography>
                            {tokenState?.scopes
                              ? removeUnderlineAndJoin(tokenState?.scopes[0])
                              : ""}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* ---- profile modal content----- */}
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                >
                  {addingUserEmail ? (
                    <>
                      {user !== addingUserEmail ? (
                        <MenuItem
                          onClick={switchToMainAccount}
                          variant="body2"
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Avatar sx={{ mr: 2 }} />
                          <span>{addingUserEmail}</span>
                          <span>
                            {user === addingUserEmail && (
                              <CheckCircleRoundedIcon
                                sx={{
                                  color: "green",
                                  width: "15px",
                                  ml: 1,
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </span>
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={handleClickRemoveAddingUser}
                          variant="body2"
                          component="span"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Avatar sx={{ mr: 2 }} />
                          <span>{addingUserEmail}</span>
                          <span>
                            {user === addingUserEmail && (
                              <CheckCircleRoundedIcon
                                sx={{
                                  color: "green",
                                  width: "15px",
                                  ml: 1,
                                  mt: 0.5,
                                }}
                              />
                            )}
                          </span>
                        </MenuItem>
                      )}
                    </>
                  ) : (
                    <MenuItem sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar sx={{ mr: 2 }} />
                      {user}
                    </MenuItem>
                  )}
                  <Divider />
                  {addedUserEmail.length > 0 ? (
                    <>
                      {user !== addedUserEmail ? (
                        <MenuItem onClick={handleClickOpenAccountSwitchDialog}>
                          <Avatar />
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            {addedUserEmail}
                          </Typography>
                          {user === addedUserEmail && (
                            <CheckCircleRoundedIcon
                              sx={{ color: "green", width: "15px", ml: 1 }}
                            />
                          )}
                        </MenuItem>
                      ) : (
                        <MenuItem onClick={handleClickOpenAccountRemove}>
                          <Avatar />
                          <Typography variant="body2" sx={{ ml: 2 }}>
                            {addedUserEmail}
                          </Typography>
                          {user === addedUserEmail && (
                            <CheckCircleRoundedIcon
                              sx={{ color: "green", width: "15px", ml: 1 }}
                            />
                          )}
                        </MenuItem>
                      )}
                    </>
                  ) : (
                    <MenuItem onClick={handleClickOpenAddUserDialog}>
                      <ListItemIcon>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      Add another account
                    </MenuItem>
                  )}
                  {userColleges.length > 1 && (
                    <MenuItem
                      onClick={() => {
                        setFrom("ChangeCollege");
                        handleClickOpenDialogCollege();
                      }}
                    >
                      <ListItemIcon>
                        <ChangeCircleIcon fontSize="small" />
                      </ListItemIcon>
                      Change College
                    </MenuItem>
                  )}
                  <MenuItem
                    onClick={() => {
                      navigate("/settings");
                    }}
                  >
                    <ListItemIcon>
                      <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(fetchLogout(authAccessToken));
                      dispatch(removeCookies());
                      dispatch(setPermissions());
                      navigate("/login");
                      localStorage.clear();
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            </Box>

            {/* Dialog For add another account */}
            <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
              <form onSubmit={submitDataForAddUser}>
                {isLoading && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 1 }}
                  >
                    <CircularProgress color="info" />
                  </Box>
                )}
                <Typography sx={{ mt: 2 }} align="center" variant="h5">
                  Add Account
                </Typography>
                <DialogContent>
                  <TextField
                    required
                    autoFocus
                    size="small"
                    sx={{ mt: 1 }}
                    id="id"
                    label="Enter user ID"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setAddAccountEmail(e.target.value)}
                    color="info"
                  />
                  <TextField
                    required
                    sx={{ mt: 3 }}
                    size="small"
                    id="=password"
                    label="Enter password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    onChange={(e) => setAddAcountPassword(e.target.value)}
                    color="info"
                  />

                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ fontSize: "12px", mt: 1 }}
                  >
                    {userValidationError}
                  </Typography>
                  <Button
                    type="submit"
                    sx={{ mt: 3 }}
                    variant="contained"
                    fullWidth
                    color="info"
                  >
                    ADD
                  </Button>
                </DialogContent>
              </form>
            </Dialog>
            {/* Dialog For Manage added account */}
            <AcountSwitchDialogue
              openAccoundSwitch={openAccoundSwitch}
              handleCloseAccountSwitchDialog={handleCloseAccountSwitchDialog}
              isLoading={isLoading}
              loadingCollege={loadingCollege}
              addedUserEmail={addedUserEmail}
              removeAccount={() =>
                removeAccount({
                  refreshToken: multipleAccountRefreshToken[0],
                  accessToken: multipleAccountAccessToken[0],
                })
              }
              handleActiveAnotherUser={() =>
                handleActiveAnotherUser(
                  {
                    refreshToken: multipleAccountRefreshToken[1],
                    accessToken: multipleAccountAccessToken[1],
                  },
                  "Login successfull"
                )
              }
            ></AcountSwitchDialogue>

            {/* Dialog to switch into main account */}
            <AcountSwitchDialogue
              openAccoundSwitch={openSwitchToMainAccount}
              handleCloseAccountSwitchDialog={closeSwitchToMainAccount}
              isLoading={isLoading}
              loadingCollege={loadingCollege}
              addedUserEmail={addingUserEmail}
              removeAccount={() =>
                removeAccount({
                  refreshToken: multipleAccountRefreshToken[1],
                  accessToken: multipleAccountAccessToken[1],
                })
              }
              handleActiveAnotherUser={() => {
                handleActiveAnotherUser(
                  {
                    refreshToken: multipleAccountRefreshToken[0],
                    accessToken: multipleAccountAccessToken[0],
                  },
                  "Login successfull"
                );
              }}
            ></AcountSwitchDialogue>

            {/* Dialog to remove added account */}
            <AcountSwitchDialogue
              openAccoundSwitch={openRemoveAddedAccount}
              handleCloseAccountSwitchDialog={handleClickCloseAccountRemove}
              isLoading={isLoading}
              addedUserEmail={addingUserEmail}
              removeAccount={() =>
                removeAccount({
                  refreshToken: multipleAccountRefreshToken[0],
                  accessToken: multipleAccountAccessToken[0],
                })
              }
            ></AcountSwitchDialogue>
            {/* Dialog to remove account Who added Another account */}

            <AcountSwitchDialogue
              openAccoundSwitch={openRemoveUserWhoAddedAccount}
              handleCloseAccountSwitchDialog={handleClickCloseAddingUserRemove}
              isLoading={isLoading}
              addedUserEmail={addingUserEmail}
              removeAccount={() =>
                removeAccount({
                  refreshToken: multipleAccountRefreshToken[1],
                  accessToken: multipleAccountAccessToken[1],
                })
              }
            ></AcountSwitchDialogue>
          </Box>

          {/* // TODO:- Currently disabling this , In future We will Update this code */}
          <Box
            onClick={() => {
              updateNotificationStatus(receivedNotification?.notification_id);
              setShowNotificationBox(false);

              switch (receivedNotification?.event_type) {
                case "Assigned Lead":
                  navigate("/userProfile", {
                    state: {
                      applicationId: receivedNotification?.application_id,
                      studentId: receivedNotification?.student_id,
                      eventType: receivedNotification?.event_type,
                    },
                  });
                  break;
                case "Student Created Query":
                  navigate("/userProfile", {
                    state: {
                      applicationId: receivedNotification?.application_id,
                      studentId: receivedNotification?.student_id,
                      eventType: "total-queries",
                      tabs: true,
                    },
                  });
                  break;

                case "Manual Assignment of Lead":
                  navigate("/form-manager", {
                    state: {
                      todays_assigned: true,
                    },
                  });
                  break;
                case "Important Update":
                  navigate("/resources", {
                    state: {
                      update_resource_id:
                        receivedNotification?.update_resource_id,
                      tabs: 1,
                    },
                  });
                  break;
                case "Data Segment Assignment":
                  window.open(receivedNotification?.data_segment_redirect_link);
                  break;
                default:
                  navigate("/userProfile", {
                    state: {
                      applicationId: receivedNotification?.application_id,
                      studentId: receivedNotification?.student_id,
                      eventType: receivedNotification?.event_type,
                    },
                  });
              }
            }}
          >
            <ToastContainer
              className={"realtime-toastitify"}
              stacked
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Box>
          <CollegeListDialogue
            handleCloseDialog={handleCloseDialogCollege}
            openDialog={openDialogCollege}
            collegeDetails={userColleges}
            currentToken={currentToken}
            submitDetails={submitDetails}
            from={from}
          ></CollegeListDialogue>
          <TelephonyDialog />
        </Box>
      )}
      <Backdrop
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetchingCollegeList || seasonDetails?.isFetching}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Backdrop>
    </>
  );
}
