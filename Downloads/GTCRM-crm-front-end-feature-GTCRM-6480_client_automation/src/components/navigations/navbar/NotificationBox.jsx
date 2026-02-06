import { Box, Card, CircularProgress, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  setApiResponseChangeMessageForNotification,
  setNotificationInternalServerError,
  setNotifications,
  setPageNumber,
  setSomethingWentWrongInNotification,
  setToggleNotifications,
} from "../../../Redux/Slices/notificationSlice";
import { notificationIcons } from "../../../constants/notificationSvgIcons";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import useToasterHook from "../../../hooks/useToasterHook";
import "../../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import SingleNotification from "./SingleNotification";
const NotificationBox = ({ setShowNotificationBox }) => {
  const dispatch = useDispatch();
  const pushNotification = useToasterHook();
  const tokenState = useSelector((state) => state.authentication.token);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const {
    apiResponseChangeMessageForNotification,
    notificationInternalServerError,
    notifications,
    pageNumber,
    pageSize,
    somethingWentWrongInNotification,
    total,
    isLoading,
  } = useSelector((state) => state?.notificationsData);
  const [todayNotifications, setTodayNotifications] = useState([]);
  const [yesterdayNotifications, setYesterdayNotifications] = useState([]);
  const [olderNotifications, setOlderNotifications] = useState([]);
  const [isLoadingDeleteNotification, setIsLoadingDeleteNotification] =
    useState(false);

  useEffect(() => {
    const todayNotifications = [];
    const yesterdayNotifications = [];
    const olderNotifications = [];

    for (const notification of notifications) {
      if (notification?.category === "today") {
        todayNotifications.push(notification);
      } else if (notification?.category === "yesterday") {
        yesterdayNotifications.push(notification);
      } else if (notification?.category === "older") {
        olderNotifications.push(notification);
      }
    }

    setTodayNotifications(todayNotifications);
    setYesterdayNotifications(yesterdayNotifications);
    setOlderNotifications(olderNotifications);
  }, [notifications]);

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
                    page: pageNumber,
                    pageSizeNumber: pageSize,
                    collegeId: collegeId,
                    pushNotification,
                    handleSomethingWentWrong,
                    setSomethingWentWrongInNotification: dispatch(
                      setSomethingWentWrongInNotification
                    ),
                    handleInternalServerError,
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
            } catch (error) {
              dispatch(setApiResponseChangeMessageForNotification(error));

              handleSomethingWentWrong(
                dispatch(setSomethingWentWrongInNotification),
                "",
                5000
              );
            }
          } else if (result?.detail) {
            pushNotification("error", result?.detail);
          }
        })
        .catch((err) => {
          handleInternalServerError(
            dispatch(setNotificationInternalServerError),
            "",
            5000
          );
        })
    );
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const removeNotification = (notificationId) => {
    setIsLoadingDeleteNotification(true);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/notifications/hide_by_id/?${
        notificationId ? "notification_id=" + notificationId : ""
      }&hide=true${
        collegeId ? "&college_id=" + collegeId : ""
      }&feature_key=a1474415`,
      {
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) =>
      res
        .json()
        .then((result) => {
          if (result?.detail === "Could not validate credentials") {
            setIsLoadingDeleteNotification(false);
            window.location.reload();
          } else if (result?.message) {
            pushNotification("success", result?.message);
            setIsLoadingDeleteNotification(false);
            const expectedData = result?.message;
            try {
              setIsLoadingDeleteNotification(false);
              if (typeof expectedData === "string") {
                const filterNotificationData = notifications?.filter(
                  (item) => item.notification_id !== notificationId
                );
                dispatch(setNotifications(filterNotificationData));
                if (notifications?.length === 1) {
                  dispatch(
                    fetchNotifications({
                      userEmail: tokenState?.sub,
                      page: 1,
                      pageSizeNumber: pageSize,
                      collegeId: collegeId,
                      pushNotification,
                      handleSomethingWentWrong,
                      setSomethingWentWrongInNotification: dispatch(
                        setSomethingWentWrongInNotification
                      ),
                      handleInternalServerError,
                      setNotificationInternalServerError: dispatch(
                        setNotificationInternalServerError
                      ),
                      setApiResponseChangeMessageForNotification: dispatch(
                        setApiResponseChangeMessageForNotification
                      ),
                    })
                  );
                }
              } else {
                throw new Error(
                  "notifications update API response has changed"
                );
              }
            } catch (error) {
              setIsLoadingDeleteNotification(false);
              setApiResponseChangeMessageForNotification(error);
              handleSomethingWentWrong(
                dispatch(setSomethingWentWrongInNotification),
                "",
                5000
              );
            }
          } else if (result?.detail) {
            setIsLoadingDeleteNotification(false);
            pushNotification("error", result?.detail);
          }
        })
        .catch((err) => {
          setIsLoadingDeleteNotification(false);
          handleInternalServerError(
            dispatch(setNotificationInternalServerError),
            "",
            5000
          );
        })
    );
  };

  const maxPage = Math.ceil(total / pageSize);

  const fetchMoreData = () => {
    if (pageNumber < maxPage) {
      dispatch(setToggleNotifications(false));
      dispatch(setPageNumber(pageNumber + 1));
    } else {
      dispatch(setPageNumber(1));
    }
  };
  const [showUnread, setShowUnread] = React.useState(
    localStorage.getItem("showUnread")
      ? localStorage.getItem("showUnread") === "true"
        ? true
        : false
      : false
  );
  useEffect(() => {
    if (localStorage.getItem("showUnread") === "true") {
      setShowUnread(true);
    } else {
      setShowUnread(false);
    }
  }, []);

  const handleChangeUnread = (event) => {
    dispatch(setNotifications([]));
    dispatch(setPageNumber(1));
    dispatch(setToggleNotifications(true));
    dispatch(
      fetchNotifications({
        userEmail: tokenState?.sub,
        unReadNotification: event,
        collegeId: collegeId,
        page: 1,
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
    localStorage.setItem("showUnread", event);
    setShowUnread(event);
  };
  // we are considering notification systems maximum of 5 pages
  const pageNumberMaximum = 5;
  return (
    <Card elevation={12} className="notification-box">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          alignItems: "center",
          boxShadow: "0px 10px 60px 0px rgba(226, 236, 249, 0.25)",
          borderRadius: "8px",
          background: "#FFF",
        }}
      >
        <Typography
          sx={{
            fontWeight: 750,
            fontSize: "16px",
            mb: 1,
            pt: 1,
            lineHeight: "22px",
          }}
        >
          Notifications
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {notifications?.length === 0 || (
            <span
              style={{
                fontSize: "12px",
                color: "#121828",
                marginBottom: "3px",
              }}
            >
              Unreads
            </span>
          )}

          {showUnread && (
            <Box
              onClick={() => {
                handleChangeUnread(false);
              }}
              sx={{ cursor: "pointer" }}
            >
              {notificationIcons.trueCheckbox}
            </Box>
          )}
          {showUnread ||
            (notifications?.length > 0 && (
              <Box
                onClick={() => {
                  handleChangeUnread(true);
                }}
                sx={{ cursor: "pointer" }}
              >
                {notificationIcons.falseCheckbox}
              </Box>
            ))}
        </Box>
      </Box>

      {notifications?.length === 0 && (
        <Box
          className="loading-animation-for-notification"
          data-testid="not-found-animation-container"
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}

      {notificationInternalServerError || somethingWentWrongInNotification ? (
        <Box
          className="loading-animation-for-notification"
          data-testid="error-animation-container"
        >
          {notificationInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInNotification && (
            <ErrorFallback
              error={apiResponseChangeMessageForNotification}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <InfiniteScroll
          dataLength={notifications?.length}
          next={pageNumber < pageNumberMaximum ? () => fetchMoreData() : ""}
          hasMore={
            total >= 50
              ? notifications?.length !== 50
              : notifications?.length !== total
          }
          loader={
            isLoading && (
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress color="info" />
              </Box>
            )
          }
          endMessage={
            notifications?.length > 0 && (
              <p className="notification-end-message">
                <b>Yay! You have seen it all</b>
              </p>
            )
          }
          height={window.innerHeight}
          style={{
            height: notifications?.length > 0 ? "400px" : "50px",
            paddingBottom: "10px",
          }}
          className="vertical-scrollbar-new"
        >
          <Box>
            {todayNotifications?.length > 0 && (
              <>
                <Box
                  sx={{ px: 2, mb: -2 }}
                  className="notification-sub-section"
                >
                  <Typography
                    sx={{ fontSize: "13px", color: "#000000", fontWeight: 400 }}
                    variant="body2"
                  >
                    Today
                  </Typography>
                  <Typography
                    onClick={() => updateNotificationStatus()}
                    variant="caption"
                    color="black"
                    className="mark-as-read"
                  >
                    Mark all as read
                  </Typography>
                </Box>
                <SingleNotification
                  isLoadingDeleteNotification={isLoadingDeleteNotification}
                  title={"TODAY"}
                  notifications={todayNotifications}
                  updateNotificationStatus={updateNotificationStatus}
                  setShowNotificationBox={setShowNotificationBox}
                  todayNotifications={todayNotifications}
                  removeNotification={removeNotification}
                />
              </>
            )}

            {yesterdayNotifications?.length > 0 && (
              <>
                <Box sx={{ px: 2 }} className="notification-sub-section">
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#000000",
                      fontWeight: 500,
                      mb: -2,
                    }}
                    variant="body2"
                  >
                    Yesterday
                  </Typography>
                  {todayNotifications?.length === 0 && (
                    <Typography
                      onClick={() => updateNotificationStatus()}
                      variant="caption"
                      color="black"
                      className="mark-as-read"
                    >
                      Mark all as read
                    </Typography>
                  )}
                </Box>
                <SingleNotification
                  isLoadingDeleteNotification={isLoadingDeleteNotification}
                  title={"YESTERDAY"}
                  notifications={yesterdayNotifications}
                  updateNotificationStatus={updateNotificationStatus}
                  setShowNotificationBox={setShowNotificationBox}
                  yesterdayNotifications={yesterdayNotifications}
                  removeNotification={removeNotification}
                />
              </>
            )}

            {olderNotifications?.length > 0 && (
              <>
                <Box sx={{ px: 2 }} className="notification-sub-section">
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#000000",
                      fontWeight: 500,
                      mb: -2,
                    }}
                    variant="body2"
                  >
                    Older
                  </Typography>
                  {todayNotifications?.length === 0 &&
                    yesterdayNotifications?.length === 0 && (
                      <Typography
                        onClick={() => updateNotificationStatus()}
                        variant="caption"
                        color="black"
                        className="mark-as-read"
                      >
                        Mark all as read
                      </Typography>
                    )}
                </Box>
                <SingleNotification
                  isLoadingDeleteNotification={isLoadingDeleteNotification}
                  title={"OLDER"}
                  notifications={olderNotifications}
                  updateNotificationStatus={updateNotificationStatus}
                  setShowNotificationBox={setShowNotificationBox}
                  olderNotifications={olderNotifications}
                  removeNotification={removeNotification}
                />
              </>
            )}
          </Box>
        </InfiniteScroll>
      )}
    </Card>
  );
};

export default NotificationBox;
