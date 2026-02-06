import { createContext, useState } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useSelector } from "react-redux";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  //API response change message state
  const [
    apiResponseChangeMessageForNotification,
    setApiResponseChangeMessageForNotification,
  ] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [notificationData, setNotificationData] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const [notificationInternalServerError, setNotificationInternalServerError] =
    useState(false);
  const [
    somethingWentWrongInNotification,
    setSomethingWentWrongInNotification,
  ] = useState(false);
  const [hideNotification, setHideNotification] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);

  const fetchNotification = ({
    userEmail,
    unReadNotification,
    page,
    pageSizeNumber,
  }) => {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/notifications/${userEmail}/?${
        unReadNotification ? `unread_notification=true&` : ""
      }page_num=${page ? page : pageNumber}&page_size=${
        pageSizeNumber ? pageSizeNumber : pageSize
      }${collegeId ? "&college_id=" + collegeId : ""}&feature_key=a1474415`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.data) {
          try {
            if (Array.isArray(data?.data)) {
              setNotificationData(data);

              if (pageNumber > 1 && page !== 1) {
                setNotifications((prevData) => [...prevData, ...data?.data]);
              } else {
                setNotifications(data?.data);
              }
            } else {
              throw new Error("notifications API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessageForNotification(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInNotification,
              setHideNotification,
              10000
            );
          }
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch((err) => {
        handleInternalServerError(
          setNotificationInternalServerError,
          setHideNotification,
          10000
        );
      });
  };

  const data = {
    pageSize,
    setPageSize,
    notificationData,
    fetchNotification,
    apiResponseChangeMessageForNotification,
    setApiResponseChangeMessageForNotification,
    somethingWentWrongInNotification,
    setSomethingWentWrongInNotification,
    hideNotification,
    setHideNotification,
    notificationInternalServerError,
    setNotificationInternalServerError,
    pageNumber,
    setPageNumber,
    notifications,
    setNotifications,
  };

  return (
    <NotificationContext.Provider value={data}>
      {children}
    </NotificationContext.Provider>
  );
};
