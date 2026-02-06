import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { logoutAPI } from "../../constants/CommonApiUrls";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import GetJsonDate from "../../hooks/GetJsonDate";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

const initialState = {
  dashboardLayout: {
    paddingTop: 0,
    paddingLeft: 0,
  },
  selectedSeason: "",
  isActionDisable: false, //For old season it will be true and all the actions in admin dashboard will be disabled.
  liveApplicantsCount: {},
  sidebarFixed: false,
  logout: false,
  userEmail: { userId: "", authenticated: false },
  loadTokenVerify: false,
  token: "",
  tokenError: "",
  permissions: {},
  currentUserInitialCollege: Cookies.get("COLLEGE_ID")
    ? JSON.parse(Cookies.get("COLLEGE_ID"))
    : {},
  currentUserCollegesList: Cookies.get("COLLEGE_LIST")
    ? JSON.parse(Cookies.get("COLLEGE_LIST"))
    : [],
  lastNodesValue: 1,
  openDataSegmentDialog: false,
  nestedAutomationPayload: {
    automation_details: {
      automation_name: "",
      data_type: null,
      releaseWindow: {
        start_time: null,
        end_time: null,
      },

      date: {
        start_date: null,
        end_date: null,
      },
      days: [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ],
      //TODO :
      data_segment: [],
      data_count: 0,

      filters: {
        lead_stage_change: {
          lead_stage_from: {
            lead_stage: null,
            lead_stage_label: null,
          },
          lead_stage_to: {
            lead_stage: null,
            lead_stage_label: null,
          },
        },
        application_stage: {
          stage_from: null,
          stage_to: null,
        },
        source_name: [],
        selected_filters: {
          filters: {
            state_code: [],
            source_name: [],
            lead_name: [],
            lead_type_name: "",
            counselor_id: [],
            application_stage_name: "",
            is_verify: "",
            payment_status: [],
            course: {},
          },
          advance_filters: [],
          date_range: {
            start_date: "",
            end_date: "",
          },
        },
      },
    },
    automation_node_edge_details: {
      nodes: [
        {
          id: "1",
          data: { label: "data Segment" },
          position: { x: 0, y: 0 },
          type: "dataSegmentNode",
        },
      ],
      edges: [],
    },
    automation_status: "",
    template: false,
  },
};

// fetching logout Api
export const fetchPermission = createAsyncThunk(
  "/fetchPermission",
  async ({ token, collegeId }) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/role_permissions/get_user_permissions?dashboard_type=admin_dashboard&feature_key=459e7929`,
      ApiCallHeaderAndBody(token, "GET")
    ).then((res) => res.json());
    return response;
  }
);

// fetching logout Api
export const fetchLogout = createAsyncThunk("/logout", async (token) => {
  const response = await customFetch(
    logoutAPI,
    ApiCallHeaderAndBody(token, "GET"),
    true
  ).then((res) => res.json());
  return response;
});
// fetching token info API
export const fetchToken = createAsyncThunk("/fetchToken", async (token) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/oauth/tokeninfo?token=${token}`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
      },
    }
  ).then((res) => res.json());
  return response;
});

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = {
        userId: action.payload.userId,
        authenticated: action.payload.authenticated,
      };
    },
    setDashboardLayout: (state) => {
      state.dashboardLayout = {
        paddingTop: 50,
        paddingLeft: 80,
      };
    },
    setLiveApplicantCount: (state, action) => {
      state.liveApplicantsCount = action.payload;
    },
    setSelectedSeason: (state, action) => {
      state.selectedSeason = action.payload;
    },
    setIsActionDisable: (state, action) => {
      state.isActionDisable = action.payload;
    },

    updateLastNodeValue: (state, action) => {
      state.lastNodesValue = action.payload;
    },

    removeCookies: (state, action) => {
      state.token = "";
      state.userEmail = { userId: "", authenticated: false };
      state.loadTokenVerify = false;
      state.currentUserInitialCollege = {};
      state.currentUserCollegesList = [];
      Cookies.remove("jwtTokenCredentialsRefreshToken");
      Cookies.remove("jwtTokenCredentialsAccessToken");
      Cookies.remove("COLLEGE_ID");
      Cookies.remove("COLLEGE_LIST");
      Cookies.remove("userId");
      Cookies.remove("feature_key");
    },
    setLoadTokenVerify: (state, action) => {
      state.loadTokenVerify = action.payload;
    },
    setSidebarFixed: (state, action) => {
      state.sidebarFixed = action.payload;
    },
    setPermissions: (state, action) => {
      state.permissions = {};
    },
    setTokenInfo: (state, action) => {
      state.token = action.payload;
    },
    setUserCollegeInfo: (state, action) => {
      state.currentUserInitialCollege = action?.payload?.initialCollege;
      state.currentUserCollegesList = action?.payload?.collegeList;
    },
    setOpenDataSegmentDialog: (state, action) => {
      state.openDataSegmentDialog = action.payload;
    },
    setAutomationNameValue: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          automation_name: action.payload,
        },
      };
    },
    setAutomationValue: (state, action) => {
      state.nestedAutomationPayload = action.payload;
    },
    setAutomationType: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        template: action.payload,
      };
    },
    setAutomationDataType: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          data_type: action.payload,
        },
      };
    },
    setAutomationDateType: (state, action) => {
      if (action.payload !== null) {
        const dates = JSON.parse(GetJsonDate(action.payload));
        state.nestedAutomationPayload = {
          ...state.nestedAutomationPayload,
          automation_details: {
            ...state?.nestedAutomationPayload?.automation_details,
            date: {
              ...state?.nestedAutomationPayload?.automation_details?.date,
              start_date: dates.start_date,
              end_date: dates.end_date,
            },
          },
        };
      } else {
        state.nestedAutomationPayload = {
          ...state.nestedAutomationPayload,
          automation_details: {
            ...state?.nestedAutomationPayload?.automation_details,
            date: {
              ...state?.nestedAutomationPayload?.automation_details?.date,
              start_date: "",
              end_date: "",
            },
          },
        };
      }
    },
    setAutomationStartTime: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          releaseWindow: {
            ...state?.nestedAutomationPayload?.automation_details
              ?.releaseWindow,
            start_time: action.payload,
          },
        },
      };
    },
    setAutomationEndTime: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          releaseWindow: {
            ...state?.nestedAutomationPayload?.automation_details
              ?.releaseWindow,
            end_time: action.payload,
          },
        },
      };
    },
    setAutomationDaysSetup: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          days: action.payload,
        },
      };
    },
    setAutomationFilters: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          filters: action.payload,
        },
      };
    },
    setFiltersDataCount: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          data_count: action.payload,
        },
      };
    },
    setDataSegmentForAutomation: (state, action) => {
      state.nestedAutomationPayload = {
        ...state.nestedAutomationPayload,
        automation_details: {
          ...state?.nestedAutomationPayload?.automation_details,
          data_segment: action.payload,
        },
      };
    },
    setNestedAutomationPayload: (state, action) => {
      state.nestedAutomationPayload = action.payload;
    },
    setNestedAutomationInitialPayload: (state, action) => {
      state.nestedAutomationPayload = initialState.nestedAutomationPayload;
    },
  },
  extraReducers: (builder) => {
    // set logout
    builder.addCase(fetchLogout.fulfilled, (state, action) => {
      state.userEmail = { userId: "", authenticated: false };
      state.logout = true;
    });
    builder.addCase(fetchLogout.pending, (state, action) => {
      state.logout = false;
    });

    builder.addCase(fetchLogout.rejected, (state, action) => {
      state.logout = false;
    });
    builder.addCase(fetchPermission.fulfilled, (state, action) => {
      if (action?.payload?.detail === "Could not validate credentials") {
        // window.location.reload();
      } else {
        state.permissions = action?.payload?.data;
      }
    });
    builder.addCase(fetchPermission.pending, (state, action) => {});

    builder.addCase(fetchPermission.rejected, (state, action) => {
      state.logout = false;
    });
    builder.addCase(fetchToken.fulfilled, (state, action) => {
      state.token = action.payload;
    });
    builder.addCase(fetchToken.pending, (state, action) => {});

    builder.addCase(fetchToken.rejected, (state, action) => {
      state.token = { server: "500" };
    });
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsActionDisable,
  setSelectedSeason,
  setLiveApplicantCount,
  setUserEmail,
  removeCookies,
  setLoadTokenVerify,
  setPermissions,
  setSidebarFixed,
  setTokenInfo,
  setUserCollegeInfo,
  updateLastNodeValue,
  setAutomationNameValue,
  setAutomationDataType,
  setAutomationDateType,
  setAutomationStartTime,
  setAutomationEndTime,
  setAutomationDaysSetup,
  setAutomationFilters,
  setFiltersDataCount,
  setDataSegmentForAutomation,
  setAutomationValue,
  setAutomationType,
  setOpenDataSegmentDialog,
  setNestedAutomationPayload,
  setNestedAutomationInitialPayload,
  setDashboardLayout,
} = authSlice.actions;

export default authSlice.reducer;
