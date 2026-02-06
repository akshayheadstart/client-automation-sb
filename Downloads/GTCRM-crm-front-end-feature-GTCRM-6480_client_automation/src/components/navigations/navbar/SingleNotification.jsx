import { useNavigate } from "react-router-dom";
import { notificationIcons } from "../../../constants/notificationSvgIcons";
import "../../../styles/sharedStyles.css";
import { Box, List, Typography } from "@mui/material";
import { useState } from "react";

const SingleNotification = ({
  notifications,
  updateNotificationStatus,
  setShowNotificationBox,
  removeNotification,
  isLoadingDeleteNotification,
}) => {
  const navigate = useNavigate();
  const [clickItemNo, setClickItemNumber] = useState(0);

  return (
    <Box sx={{ padding: "10px 20px" }}>
      <List
        sx={{ overflowX: "hidden", overflowY: "hidden", zIndex: 100 }}
        disablePadding
      >
        {notifications?.map((notification, index) => (
          <Box
            key={index}
            sx={{
              opacity:
                clickItemNo === index && isLoadingDeleteNotification && 0.4,
            }}
          >
            <Box>
              <span
                onClick={() => {
                  removeNotification(notification?.notification_id);
                  setClickItemNumber(index);
                }}
                className={"notification-cross-icon"}
              >
                {notificationIcons?.crossIcon}
              </span>

              {notification?.mark_as_read === false && (
                <span sx={{}} className={"notification-red-dot"}>
                  {notificationIcons?.redDot}
                </span>
              )}
            </Box>

            <Box
              sx={{
                cursor: "pointer",
                border:
                  notification?.mark_as_read === false
                    ? "1px solid #008BE2"
                    : "",

                marginBottom: notifications.length === index + 1 || "-10px",
                // (!notification?.mark_as_read ? "-35px" : "-10px"),
              }}
              disableGutters
              key={notification?.notification_id}
              className="notification-item"
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
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default SingleNotification;
