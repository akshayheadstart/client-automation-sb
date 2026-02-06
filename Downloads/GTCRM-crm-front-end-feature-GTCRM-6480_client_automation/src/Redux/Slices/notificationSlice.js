import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";
// Define initial state
const initialState = {
  pageSize: 10,
  notificationData: [],
  notifications: [],
  notificationInternalServerError: false,
  somethingWentWrongInNotification: false,
  hideNotification: false,
  pageNumber: 1,
  apiResponseChangeMessageForNotification: "",
  isLoading: false,
  total: 0,
  totalUnread: 0,
  toggleNotifications: false,
  razorPayKeyId: "",
};

// Create async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({
    userEmail,
    unReadNotification,
    page,
    pageSizeNumber,
    collegeId,
    pushNotification,
    handleInternalServerError,
    handleSomethingWentWrong,
    setNotificationInternalServerError,
    setSomethingWentWrongInNotification,
    setApiResponseChangeMessageForNotification,
  }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/notifications/${userEmail}/?${
          unReadNotification ? "unread_notification=true" : ""
        }${page ? `${unReadNotification ? "&" : ""}page_num=${page}` : ""}${
          pageSizeNumber ? `&page_size=${pageSizeNumber}` : ""
        }${collegeId ? "&college_id=" + collegeId : ""}&feature_key=a1474415`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const data = await response.json();
      if (data?.detail === "Could not validate credentials") {
        window.location.reload();
      }
      try {
        if (Array.isArray(data?.data)) {
          return data;
        } else {
          throw new Error("notifications API response has changed");
        }
      } catch (error) {
        setApiResponseChangeMessageForNotification(error);
        handleSomethingWentWrong(
          setSomethingWentWrongInNotification,
          "",
          10000
        );
      }

      if (data?.detail) {
        pushNotification("error", data.detail);
      }
      return data;
    } catch (error) {
      handleInternalServerError(setNotificationInternalServerError, "", 10000);
    }
  }
);
// fetching Payment Client ID Api
export const fetchGetPaymentClientID = createAsyncThunk(
  "/getClientId",
  async ({ token, collegeId }) => {
    const response = await customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/payments/get_client_id?college_id=${collegeId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((res) => res.json());
    return response;
  }
);

// Create notification slice
export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setToggleNotifications: (state, action) => {
      state.toggleNotifications = action.payload;
    },
    setApiResponseChangeMessageForNotification: (state, action) => {
      state.apiResponseChangeMessageForNotification = action.payload;
    },
    setSomethingWentWrongInNotification: (state, action) => {
      state.somethingWentWrongInNotification = action.payload;
    },
    setHideNotification: (state, action) => {
      state.hideNotification = action.payload;
    },
    setNotificationInternalServerError: (state, action) => {
      state.notificationInternalServerError = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const data = action.payload;
      state.total = data.total;
      state.totalUnread = data.total_unread;
      if (data?.data && Array.isArray(data.data)) {
        state.notificationData = data?.data;
        if (state.pageNumber > 1) {
          state.notifications = [...state.notifications, ...data.data];
        } else {
          state.notifications = data.data;
        }
      }
      state.isLoading = false;
    });
    builder.addCase(fetchNotifications.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(fetchGetPaymentClientID.fulfilled, (state, action) => {
      return {
        ...state,
        razorPayKeyId: action.payload,
      };
    });
    builder.addCase(fetchGetPaymentClientID.pending, () => {});

    builder.addCase(fetchGetPaymentClientID.rejected, (state) => {
      return {
        ...state,
        error: { server: "500" },
      };
    });
  },
});

export const {
  setPageSize,
  setPageNumber,
  setNotifications,
  setApiResponseChangeMessageForNotification,
  setSomethingWentWrongInNotification,
  setHideNotification,
  setNotificationInternalServerError,
  setToggleNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
