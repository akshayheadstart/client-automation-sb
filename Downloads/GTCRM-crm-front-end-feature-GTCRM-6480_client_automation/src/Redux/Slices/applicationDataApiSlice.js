// Import the RTK Query methods from the React-specific entry point
import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { applicationDataApiSlicePermissionKeys } from "../../utils/apiPermissionIds";

export const tableSlice = createApi({
  reducerPath: "tableAPI",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: applicationDataApiSlicePermissionKeys,
  }),
  tagTypes: [
    "updateUserManager",
    "updateFollowupReport",
    "updateApplications",
    "updateCounsellorList",
    "updateRawData",
    "updateDownloadRequestList",
    "updateCurrentUserReports",
    "updatePaidApplications",
    "updateAllRulesData",
    "updateLeadData",
    "updateDataSegmentData",
    "getCommunicationTrendData",
    "eventMapping",
    "updateCounselorList",
    "updateCollegeList",
    "updateManageSession",
    "updateCounselorCalendar",
    "updateKeyCategories",
    "updateScriptsData",
    "updateCallListData",
    "updateTemplateData",
  ],

  endpoints: (builder) => ({
    getApplications: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        twelveScoreSort,
        payload,
        formInitiated,
      }) => ({
        url: `/admin/all_applications/${
          formInitiated ? "?form_initiated=false&" : "?"
        }page_num=${pageNumber}&page_size=${rowsPerPage}${
          twelveScoreSort === true || twelveScoreSort === false
            ? "&twelve_score_sort=" + twelveScoreSort
            : ""
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateApplications"],
    }),
    getLeads: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        payload,
        twelveScoreSort,
      }) => ({
        url: `/admin/all_leads/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          twelveScoreSort === true || twelveScoreSort === false
            ? "&twelve_score_sort=" + twelveScoreSort
            : ""
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateApplications"],
    }),
    getPublisherApplications: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        payloadForAllApplication,
        sourceType,
        selectedSummery,
        applicationDetails,
      }) => ({
        url: `/publisher/get_all_leads/?${
          sourceType?.toLowerCase() !== "total" && sourceType
            ? `source_type=${sourceType}`
            : ""
        }${
          payloadForAllApplication?.payload?.lead_type?.lead_type_name
            ? `${sourceType ? "&" : ""}lead_type=${
                payloadForAllApplication?.payload?.lead_type?.lead_type_name
              }`
            : ""
        }${
          payloadForAllApplication?.payload?.application_stage
            ?.application_stage_name || applicationDetails
            ? `${
                sourceType ||
                payloadForAllApplication?.payload?.lead_type?.lead_type_name
                  ? "&"
                  : ""
              }form_status=${
                payloadForAllApplication?.payload?.application_stage
                  ?.application_stage_name
                  ? payloadForAllApplication?.payload?.application_stage
                      ?.application_stage_name
                  : applicationDetails
              }`
            : ""
        }${
          sourceType ||
          payloadForAllApplication?.payload?.lead_type?.lead_type_name ||
          payloadForAllApplication?.payload?.application_stage
            ?.application_stage_name ||
          applicationDetails
            ? "&"
            : ""
        }page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadForAllApplication,
      }),
      keepUnusedDataFor: Infinity,
    }),
    getRawDataUploadHitory: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        payloadOfUploadfRawData,
        apiUrl,
      }) => ({
        url: `${apiUrl}?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadOfUploadfRawData,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateRawData"],
    }),
    getViewRawData: builder.query({
      query: ({ offlineId, pageNumber, rowsPerPage, collegeId, viewLead }) => ({
        url: `/manage/${
          offlineId
            ? `${
                viewLead
                  ? "system_successful_lead_data"
                  : "show_successful_lead"
              }?offline_id=` +
              offlineId +
              "&"
            : "get_all_raw_data/?"
        }page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateRawData"],
    }),
    getUserManagerData: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        userMangerSortObj,
        payload,
      }) => ({
        url: `/user/get_details/${pageNumber ? `?page_num=${pageNumber}` : ""}${
          rowsPerPage ? `&page_size=${rowsPerPage}` : ""
        }${
          userMangerSortObj?.sort_type
            ? `&sort_type=${userMangerSortObj?.sort_type}`
            : ""
        }${
          userMangerSortObj?.sort
            ? `&column_name=${userMangerSortObj?.sort}`
            : ""
        }${pageNumber ? "&" : "?"}download_data=false`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateUserManager"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, isActive, collegeId }) => ({
        url: `/user/enable_or_disable/?user_id=${userId}&is_activated=${isActive}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateUserManager", "updateCounsellorList"],
    }),
    createUser: builder.mutation({
      query: ({ userType, payloadOfUser, collegeId }) => ({
        url: `/user/create_new_user/?user_type=${userType}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadOfUser,
      }),
      invalidatesTags: [
        "updateUserManager",
        "updateCounselorList",
        "updateHeadCounselorList",
      ],
    }),
    getDownloadRequestListData: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        payloadForDownloadRequestList,
      }) => ({
        url: `/reports/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadForDownloadRequestList,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateDownloadRequestList"],
    }),
    getUserSessionData: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId }) => ({
        url: `/lead/user_activity/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getAllCounsellorList: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        counselorSortObj,
        search,
        payload,
      }) => ({
        url: `/counselor/all_counselor_list?page_num=${pageNumber}&page_size=${rowsPerPage}${
          search ? `&search_string=${search}` : ""
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateCounsellorList"],
    }),
    allocateCounsellor: builder.mutation({
      query: ({
        selectedCounsellorId,
        payloadOfAllocateCounsellor,
        collegeId,
      }) => ({
        url: `/counselor/assign_course?counselor_id=${selectedCounsellorId}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadOfAllocateCounsellor,
      }),
      invalidatesTags: ["updateCounsellorList"],
    }),
    getApplicationFollowup: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        tabValue,
        payload,
        searchTextOfPayload,
      }) => ({
        url: `/counselor/followup_report/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          searchTextOfPayload ? `&search=${searchTextOfPayload}` : ""
        }&todays_followup=${tabValue === 0 ? true : false}&upcoming_followup=${
          tabValue === 1 ? true : false
        }&overdue_followup=${
          tabValue === 2 ? true : false
        }&completed_followup=${tabValue === 3 ? true : false}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateFollowupReport", "updateCounselorCalendar"],
    }),
    updateFollowup: builder.mutation({
      query: ({ applicationId, followupData, collegeId, checkedValue }) => {
        if (applicationId) {
          return {
            url: `/followup_notes/${applicationId}/?resolved=${
              checkedValue || false
            }${collegeId ? "&college_id=" + collegeId : ""}`,
            method: "PUT",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${Cookies.get(
                "jwtTokenCredentialsAccessToken"
              )}`,
              "Content-Type": "application/json",
            },
            data: followupData,
          };
        }
      },
      invalidatesTags: [
        "updateFollowupReport",
        "updatePendingFollowupData",
        "updateHeadCounselorPendingFollowupData",
        "updateCounselorCalendar",
        "getFollowupSummary",
        "getStudentTimelineFollowupAndNotes",
        "leadHeader",
        "UserProfileTimelineInfo",
        "UserProfileFollowupNote",
        "UserProfileLeadDetails",
        "getCounsellorWiseFollowupDetails",
      ],
    }),

    updateFollowupStatus: builder.mutation({
      query: ({ checkedValue, applicationId, indexNumber, collegeId }) => {
        return {
          url: `/followup_notes/update_followup_status/${applicationId}/?status=${checkedValue}&index_number=${indexNumber}${
            collegeId ? "&college_id=" + collegeId : ""
          }`,
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
          },
        };
      },
      invalidatesTags: [
        "updateFollowupReport",
        "updatePendingFollowupData",
        "updateHeadCounselorPendingFollowupData",
        "updateCounselorCalendar",
        "getFollowupSummary",
        "leadAndApplicationStageCount",
        "getStudentTimelineFollowupAndNotes",
        "UserProfileLeadDetails",
        "getCounsellorWiseFollowupDetails",
      ],
    }),
    getPaidApplications: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        payload,
        twelveScoreSort,
      }) => ({
        url: `/admin/all_paid_applications/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          twelveScoreSort === true || twelveScoreSort === false
            ? "&twelve_score_sort=" + twelveScoreSort
            : ""
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updatePaidApplications"],
    }),
    multipleLeadAssignToCounselor: builder.mutation({
      query: ({
        selectedCounsellorId,
        selectedApplicationsToAssign,
        collegeId,
      }) => {
        return {
          url: `/counselor/multiple_application_to_one_counselor?counselor_id=${selectedCounsellorId}${
            collegeId ? "&college_id=" + collegeId : ""
          }`,
          method: "PUT",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "content-type": "application/json",
          },
          data: selectedApplicationsToAssign,
        };
      },
      invalidatesTags: [
        "updateFollowupReport",
        "updateApplications",
        "updatePaidApplications",
        "updateCounselorCalendar",
        "userProfileHeaderInfo",
        "leadHeader",
        "getCounsellorWiseFollowupDetails",
      ],
    }),
    uploadRawData: builder.mutation({
      query: ({ formData, leadDataName, collegeId }) => ({
        url: `/manage/raw_data?data_name=${leadDataName}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "multipart/form-data",
        },
        data: formData,
      }),
      invalidatesTags: ["updateRawData", "getRawDataNameList"],
    }),
    getRawDataNameList: builder.query({
      query: ({ collegeId }) => ({
        url: `/manage/list_of_raw_data_names/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getRawDataNameList"],
    }),
    generateReport: builder.mutation({
      query: ({ collegeId, payloadForReportGeneration, reportId }) => ({
        url: `/reports/generate_request_data/?${
          reportId ? `report_id=${reportId ? reportId : ""}` : ""
        }${collegeId ? `${reportId ? "&" : ""}college_id=` + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payloadForReportGeneration,
      }),
      invalidatesTags: [
        "updateDownloadRequestList",
        "updateCurrentUserReports",
        "getReportAutoScheduled",
        "getReportTemplate",
      ],
    }),
    getCurrentUserReports: builder.query({
      query: ({ pageNumber, rowPerPage, collegeId }) => ({
        url: `/reports/current_user/?page_num=${pageNumber}&page_size=${rowPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateCurrentUserReports"],
    }),
    getRuleDetailsAPI: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        automationId,
        moduleType,
        searchItem,
      }) => ({
        url: `/automation/rule_details/?${
          searchItem ? `data_segment_name=${searchItem}&` : ""
        }automation_id=${automationId}&page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",

        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: {
          module_type: moduleType,
        },
      }),
      keepUnusedDataFor: 60,
    }),
    getRuleDEliveryDetailsAPI: builder.query({
      query: ({ automationJobId, collegeId }) => ({
        url: `/automation/job_delivery_details_by_id/?automation_job_id=${automationJobId}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: 60,
    }),
    getRuleJobDetailsAPI: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        automationJobId,
        searchItem,
      }) => ({
        url: `/automation/job_details_by_id/?${
          searchItem ? `email_id=${searchItem}&` : ""
        }automation_job_id=${automationJobId}&page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: 0,
    }),
    getAllRulesData: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId }) => ({
        url: `/campaign/get_rules/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateAllRulesData"],
    }),
    updateCampaignStatus: builder.mutation({
      query: ({
        campaignRuleId,
        campaignRuleName,
        campaignRuleStatus,
        collegeId,
      }) => ({
        url: `/campaign/update_status_of_rule/?rule_id=${campaignRuleId}&rule_name=${campaignRuleName}&enabled=${
          campaignRuleStatus ? "false" : "true"
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateAllRulesData"],
    }),
    createRule: builder.mutation({
      query: ({ ruleId, payloadOfCreateRule, collegeId }) => ({
        url: `/campaign/create_rule/?rule_id=${ruleId ? ruleId : ""}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadOfCreateRule,
      }),
      invalidatesTags: ["updateAllRulesData", "getCommunicationTrendData"],
    }),
    uploadLeadData: builder.mutation({
      query: ({ formData, collegeId, selectedCounsellor, leadDataName }) => ({
        url: `/admin/add_leads_using_or_csv/?counselor_id=${selectedCounsellor}&data_name=${leadDataName}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "multipart/form-data",
        },
        data: formData,
      }),
      invalidatesTags: ["updateLeadData"],
    }),

    getInBoundActivitiesDetailsAPI: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        dateRange,
        counselorId,
        applicationStatus,
        callStatus,
        search,
      }) => ({
        url: `/call_activities/counselor_wise_inbound_report?${
          counselorId ? `counselor_id=${counselorId}&` : ""
        }${applicationStatus ? `lead_status=${applicationStatus}&` : ""}${
          search ? `search=${search}&` : ""
        }${
          callStatus ? `call_status=${callStatus}&` : ""
        }page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: { counselor_id: counselorId, date_range: dateRange },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getOutBoundActivitiesDetailsAPI: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        dateRange,
        counselorId,
        applicationStatus,
        callStatus,
        search,
      }) => ({
        url: `/call_activities/counselor_wise_outbound_report?${
          applicationStatus ? `lead_status=${applicationStatus}&` : ""
        }${search ? `search=${search}&` : ""}${
          callStatus ? `call_status=${callStatus}&` : ""
        }page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,

        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: { counselor_id: counselorId, date_range: dateRange },
      }),
      keepUnusedDataFor: Infinity,
    }),
    mapCounselorToHeadCounselor: builder.mutation({
      query: ({ selectedHeadCounselor, collegeId }) => ({
        url: `/counselor/map_with_head_counselor/?counselor_id=${
          selectedHeadCounselor.counselor_id
        }&head_counselor_id=${selectedHeadCounselor.head_counselor_id}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "updateCounsellorList",
        "updateHeadCounselorPendingFollowupData",
      ],
    }),
    getUtmDetails: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        sourceName,
        from,
        payloadOfUtmDetails,
      }) => ({
        url: `/campaign/get_utm_campaign?source_name=${sourceName}&utm_name=${from}&page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payloadOfUtmDetails,
      }),
      keepUnusedDataFor: Infinity,
    }),

    deleteDataSegment: builder.mutation({
      query: ({ dataSegmentId, collegeId }) => ({
        url: `/data_segment/delete/?data_segment_id=${dataSegmentId}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateDataSegmentData"],
    }),

    getHeadCounselorListWithPendingFollowupCount: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId, dateRange }) => ({
        url: `/followup_notes/head_counselor_details?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: dateRange,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateHeadCounselorPendingFollowupData"],
    }),
    getPendingFollowup: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        dateRange,
        headCounselorId,
      }) => ({
        url: `/followup_notes/get_pending_followup?head_counselor_id=${headCounselorId}&page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: dateRange,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updatePendingFollowupData"],
    }),
    clientRegistration: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/college/create/${collegeId ? "?college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["billing", "getCollegeByStatus"],
    }),
    getBillingList: builder.query({
      query: ({ pageNumber, rowsPerPage }) => ({
        url: `/college/estimation_bill/?page_num=${pageNumber}&page_size=${rowsPerPage}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["billing"],
    }),
    getCollegesByStatus: builder.query({
      query: ({ pageNumber, rowsPerPage, approve, pending, reject }) => ({
        url: `/colleges/get_by_status/?approved=${approve}&declined=${reject}&pending=${pending}&own_colleges=false&page_num=${pageNumber}&page_size=${rowsPerPage}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getCollegeByStatus"],
    }),
    updateCollegeStatus: builder.mutation({
      query: ({ status, collegeId }) => ({
        url: `/college/update_status/${
          collegeId ? "?college_id=" + collegeId : ""
        }&status=${status}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["billing", "getCollegeByStatus"],
    }),
    getCommunicationTrendData: builder.query({
      query: ({ segmentRowPerPage, type, collegeId }) => ({
        url: `/data_segments/communication_performance_dashboard/?communication_type=${type}&page_num=1&page_size=${segmentRowPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getCommunicationTrendData"],
    }),
    getEventMappingData: builder.query({
      query: ({ pageNumber, rowsPerPage, fromDataValue, collegeId }) => ({
        url: `/events/?${
          pageNumber
            ? `page_num=${pageNumber}&page_size=${rowsPerPage}&download_data=false&`
            : ""
        }${collegeId ? "college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: fromDataValue,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["eventMapping"],
    }),
    updateEventMapping: builder.mutation({
      query: ({ event_id, updateEventData, collegeId }) => {
        if (event_id) {
          return {
            url: `/event/add_or_update/?event_id=${event_id}${
              collegeId ? "&college_id=" + collegeId : ""
            }`,
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${Cookies.get(
                "jwtTokenCredentialsAccessToken"
              )}`,
              "Content-Type": "application/json",
            },
            data: updateEventData,
          };
        }
      },
      invalidatesTags: ["eventMapping"],
    }),
    deleteEvent: builder.mutation({
      query: ({ eventId, collegeId }) => ({
        url: `/event/delete_by_name_or_id/?event_id=${eventId}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["eventMapping"],
    }),
    createEventMapping: builder.mutation({
      query: ({ eventData, collegeId }) => {
        if (eventData) {
          return {
            url: `/event/add_or_update/${
              collegeId ? "?college_id=" + collegeId : ""
            }`,
            method: "POST",
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${Cookies.get(
                "jwtTokenCredentialsAccessToken"
              )}`,
              "Content-Type": "application/json",
            },
            data: eventData,
          };
        }
      },
      invalidatesTags: ["eventMapping"],
    }),
    getCounselorList: builder.query({
      query: ({ isHoliday, collegeId }) => ({
        url: `/counselor/college_counselor_list/?holiday=${isHoliday}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateCounselorList"],
    }),
    getManageSessionList: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId }) => ({
        url: `/user/session_info/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateManageSession"],
    }),
    revokeSession: builder.mutation({
      query: ({ sessionId }) => ({
        url: `/oauth/refresh_token/revoke/?token=${sessionId}`,
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["updateManageSession"],
    }),
    getCollegeList: builder.query({
      query: () => ({
        url: `/college/list_college/`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateCollegeList"],
    }),
    getFeatureList: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/features/${collegeId ? "?college_id=" + collegeId : ""}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getNameAndLabelList: builder.query({
      query: ({ collegeId }) => ({
        url: `/followup_notes/get_lead_stage_label${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getConsumptionInfo: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/communication_info/${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getAllPanelAndSlotData: builder.query({
      query: ({ filterDataPayload, date, collegeId }) => ({
        url: `/planner/day_wise_slot_panel_data/?date=${date}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: filterDataPayload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getAllPanelAndSlot"],
    }),
    getPanelistInfoById: builder.query({
      query: ({ user_id, collegeId }) => ({
        url: `/user/get_data_by_id/?user_id=${user_id}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["panelistInfoById"],
    }),
    getStudentCommentData: builder.mutation({
      query: ({ applicationOrOther, clickData, studentId, collegeId }) => ({
        url: `/admin/get_document_comments/?student_id=${studentId}&recent_photo=${
          clickData === "recent_photo" ? true : false
        }&tenth=${clickData === "tenth" ? true : false}&inter=${
          clickData === "inter" ? true : false
        }&graduation=${
          clickData === "graduation" ? true : false
        }&ug_consolidated_mark_sheet=${
          clickData === "ug_consolidated_mark_sheet" ? true : false
        }&title=${
          clickData !== "recent_photo" ||
          clickData !== "tenth" ||
          clickData !== "inter" ||
          clickData !== "graduation" ||
          clickData !== "ug_consolidated_mark_sheet"
            ? applicationOrOther
            : ""
        }&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        // data: fromDataValue,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getComment"],
    }),
    updateStudentDocumentGetComment: builder.mutation({
      query: ({
        studentId,
        commentDescription,
        clickData,
        applicationOrOther,
        collegeId,
      }) => ({
        url: `/admin/add_comment_for_document/?student_id=${studentId}&comment=${commentDescription}&recent_photo=${
          clickData === "recent_photo" ? true : false
        }&tenth=${clickData === "tenth" ? true : false}&inter=${
          clickData === "inter" ? true : false
        }&graduation=${
          clickData === "graduation" ? true : false
        }&ug_consolidated_mark_sheet=${
          clickData === "ug_consolidated_mark_sheet" ? true : false
        }&title=${
          clickData !== "recent_photo" ||
          clickData !== "tenth" ||
          clickData !== "inter" ||
          clickData !== "graduation" ||
          clickData !== "ug_consolidated_mark_sheet"
            ? applicationOrOther
            : ""
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getComment", "UserProfileLeadDocument"],
    }),
    updateStudentDocumentStatus: builder.mutation({
      query: ({
        documentStatus,
        applicationId,
        selectedStatusClickData,
        applicationOrOtherStatus,
        collegeId,
      }) => ({
        url: `/admin/update_status_of_document/?status=${documentStatus}&application_id=${applicationId}&recent_photo=${
          selectedStatusClickData === "recent_photo" ? true : false
        }&tenth=${selectedStatusClickData === "tenth" ? true : false}&inter=${
          selectedStatusClickData === "inter" ? true : false
        }&graduation=${
          selectedStatusClickData === "graduation" ? true : false
        }&ug_consolidated_mark_sheet=${
          selectedStatusClickData === "ug_consolidated_mark_sheet"
            ? true
            : false
        }&title=${
          selectedStatusClickData !== "recent_photo" ||
          selectedStatusClickData !== "tenth" ||
          selectedStatusClickData !== "inter" ||
          selectedStatusClickData !== "graduation" ||
          selectedStatusClickData !== "ug_consolidated_mark_sheet"
            ? applicationOrOtherStatus
            : ""
        }&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "updateStudentDocumentStatus",
        "UserProfileLeadDocument",
      ],
    }),
    TakeSlotPanelist: builder.mutation({
      query: ({ slotId, collegeId }) => ({
        url: `/planner/take_a_slot/?slot_id=${slotId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getAllPanelAndSlot"],
    }),
    deleteSlotAndPanel: builder.mutation({
      query: ({ selectedId, collegeId }) => ({
        url: `/interview/delete_slots_or_panels/?college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedId,
      }),
      invalidatesTags: ["getAllPanelAndSlot"],
    }),
    publishSlotAndPanel: builder.mutation({
      query: ({ date, selectedId, collegeId }) => ({
        url: `/planner/publish_slots_or_panels/?date=${date}&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedId,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["getAllPanelAndSlot"],
    }),

    //demo set up getInterview API
    getInterViewStudentsInfoData: builder.mutation({
      query: ({ slot_id, collegeId }) => ({
        url: `/planner/profile_marking_details/?slot_id=${slot_id}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        // data: fromDataValue,
      }),
      // keepUnusedDataFor: Infinity,
      providesTags: ["getStudentsInfo"],
    }),
    interviewStudentMarkSubmit: builder.mutation({
      query: ({ selectedApplicationId, slotId, collegeId, studentMarks }) => ({
        url: `/interview/store_feedback/?application_id=${selectedApplicationId}&slot_id=${slotId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: studentMarks,
      }),
      // keepUnusedDataFor: Infinity,
      invalidatesTags: ["getStudentsInfo"],
    }),
    unAssigneeStudent: builder.mutation({
      query: ({ slot_id, studentApplicationId, collegeId }) => ({
        url: `/interview_list/unassigned_application?application_id=${studentApplicationId}&slot_id=${slot_id}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["getStudentsInfo"],
    }),
    createSlot: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/planner/create_or_update_slot/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["getAllPanelAndSlot", "getSlotPanelStatus"],
    }),
    createPanel: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/planner/create_or_update_panel/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["getAllPanelAndSlot", "getSlotPanelStatus"],
    }),
    deleteLeadUploadHistory: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/manage/delete_raw_data/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["updateRawData"],
    }),
    getDateWiseSlotPanelStatus: builder.query({
      query: ({ isSlot, currentDate, collegeId }) => ({
        url: `/planner/date_wise_panel_slot_hours/?is_slot=${isSlot}&date=${currentDate}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getSlotPanelStatus"],
    }),
    getUserProfileHeaderInfo: builder.query({
      query: ({ applicationId, collegeId }) => ({
        url: `/lead/lead_profile_header/${applicationId}${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["userProfileHeaderInfo"],
    }),
    getStudentTotalQueriesData: builder.query({
      query: ({ filterDataPayload, collegeId }) => ({
        url: `/admin/student_total_queries_header/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: filterDataPayload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getStudentHeaderData"],
    }),
    getStudentTotalQueriesTableData: builder.query({
      query: ({ filterDataPayload, collegeId, pageNumber, rowsPerPage }) => ({
        url: `/query/list/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: filterDataPayload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getStudentTableData"],
    }),
    getCounselorFollowUpCalendarData: builder.query({
      query: ({ date, month, year, collegeId }) => ({
        url: `/counselor/get_calendar_info/?date=${date}&month=${month}&year=${year}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateCounselorCalendar"],
    }),
    getFollowupSummary: builder.query({
      query: ({ payload, collegeId, indicatorValue }) => ({
        url: `/counselor/followup_details_summary/?change_indicator=${
          indicatorValue ? indicatorValue : "last_7_days"
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getFollowupSummary"],
    }),
    getDocumentLockerUserData: builder.mutation({
      query: ({ index, studentId, collegeId }) => ({
        url: `/student/documents/text_extraction_info/${studentId}/?index=${index}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getDocumentLockData"],
    }),

    manualCounsellorAssign: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/counselor/manual_counselor_assign/?college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["updateRawData"],
    }),

    addTagToStudent: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/lead/add_tag/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: [
        "updateApplications",
        "updatePaidApplications",
        "getLeadStageDetails",
        "leadHeader",
      ],
    }),
    getTagLists: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/lead_tags/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    handleLeadStageChange: builder.mutation({
      query: ({
        leadStage,
        collegeId,
        selectedLeadStageLabel,
        permissions,
        changeMultipleLeadStageData,
      }) => ({
        url: `/followup_notes/multiple_lead_stage?lead_stage=${leadStage}&label=${
          permissions?.menus?.others?.add_lead_stage_label?.menu
            ? selectedLeadStageLabel?.title
              ? selectedLeadStageLabel?.title
              : ""
            : selectedLeadStageLabel
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: changeMultipleLeadStageData,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: [
        "updateApplications",
        "updatePaidApplications",
        "leadAndApplicationStageCount",
        "getLeadStageDetails",
      ],
    }),
    getLeadAndApplicationStageCount: builder.query({
      query: ({ URL }) => ({
        url: URL,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["leadAndApplicationStageCount"],
    }),
    getLeadAndApplicationStageDetails: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        clickedLeadStage,
        fromApplication,
        seasonId,
      }) => ({
        url: `/${
          fromApplication
            ? "application_wrapper/application_data_count"
            : "lead/lead_data_count"
        }?data_type=${
          clickedLeadStage?.title
        }&page_num=${pageNumber}&page_size=${rowsPerPage}&season=${seasonId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getLeadStageDetails"],
    }),
    deleteTag: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/lead/delete_tag/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: [
        "updateApplications",
        "updatePaidApplications",
        "getLeadStageDetails",
        "getSegmentDetailsData",
        "getSegmentDetailsAddLeadData",
        "leadHeader",
      ],
    }),
    getLeadAndApplicationSummary: builder.query({
      query: ({
        indicator,
        payload,
        collegeId,
        leadType,
        formInitiated,
        seasonId,
      }) => ({
        url: `/lead/lead_header?lead_type=${leadType}&change_indicator=${
          indicator ? indicator : `last_7_days`
        }${
          formInitiated ? formInitiated : ""
        }&season=${seasonId}&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getLeadHeaderData"],
    }),
    getStudentTimelineFollowupAndNotes: builder.query({
      query: ({ payload, collegeId, applicationId }) => ({
        url: `/student_timeline/followup_and_notes/${applicationId}/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getStudentTimelineFollowupAndNotes"],
    }),
    getAdminPendingFollowupCount: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId, payload }) => ({
        url: `/counselor/get_pending_followup/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 10,
    }),

    getStudentQueryData: builder.mutation({
      query: ({ collegeId, pageNumber, pageSize, payload }) => ({
        url: `/admin/student_queries/?college_id=${collegeId}&page_num=${pageNumber}&page_size=${pageSize}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    createKeyCategory: builder.mutation({
      query: ({ collegeId, payload, index }) => ({
        url: `/resource/create_key_category/?${
          index !== null ? `index_number=${index}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["updateKeyCategories"],
    }),

    createQuestion: builder.mutation({
      query: ({ collegeId, payload, questionId }) => ({
        url: `/resource/create_or_update_a_question/?${
          questionId ? `question_id=${questionId}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["updateKeyCategories"],
    }),

    getQuestions: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/resource/get_questions/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),

    deleteQuestion: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/resource/delete_questions/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),

    deleteCategory: builder.mutation({
      query: ({ collegeId, index }) => ({
        url: `/resource/delete_key_category/?index_number=${index}&college_id=${collegeId}`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateKeyCategories"],
    }),

    getKeyCategories: builder.query({
      query: ({ collegeId }) => ({
        url: `/resource/get_key_categories/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateKeyCategories"],
    }),
    getTemplateMergeKays: builder.query({
      query: ({ collegeId }) => ({
        url: `/templates/get_template_merge_fields/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getTemplateMergeKays"],
    }),
    getSenderAndReceiverEmailIdDetail: builder.query({
      query: ({ collegeId }) => ({
        url: `/templates/email_id_list?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    addMergeTag: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/templates/add_template_merge_field/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["getTemplateMergeKays"],
    }),
    getCounsellorLeadsApplicationData: builder.query({
      query: ({ collegeId, date, leadData }) => ({
        url: `/counselor/get_leads_application_data?date=${date}&lead_data=${
          leadData ? "true" : "false"
        }&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    updateAndEditUserInfo: builder.mutation({
      query: ({ userId, payload, collegeId }) => ({
        url: `/user/update/?user_id=${userId}&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["updateUserManager"],
    }),
    getUserManagerChartData: builder.query({
      query: ({ collegeId }) => ({
        url: `/user/chart_info/?download_data=false&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["userManagerChartData"],
    }),
    getAdvanceFilterCategoriesData: builder.query({
      query: ({ collegeId, categoryName, searchText }) => ({
        url: `/advance_filter/categories_or_fields/?college_id=${collegeId}${
          categoryName ? `&category_name=${categoryName}` : ""
        }${searchText ? `&search_pattern=${searchText}` : ""}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    getAllScriptData: builder.query({
      query: ({
        collegeId,
        pageNum,
        pageSize,
        all,
        search = "",
        sort,
        sortType,
        sortField,
        payload,
      }) => ({
        url: `/resource/scripts/?all=${all}&${
          pageNum ? `page_num=${pageNum}&` : ""
        }${pageSize ? `page_size=${pageSize}&` : ""}${
          search?.length ? `&search=${search}&` : ""
        }${sort ? `sort=${sort}&` : ""}${
          sortType ? `sort_type=${sortType}&` : ""
        }${sortField ? `sort_field=${sortField}&` : ""}college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      providesTags: ["updateScriptsData"],
    }),

    createUpdateScript: builder.mutation({
      query: ({ collegeId, scriptId, payload }) => ({
        url: `/resource/create_or_update_a_script/?${
          scriptId ? `script_id=${scriptId}&` : ""
        }college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["updateScriptsData"],
    }),

    deleteScript: builder.mutation({
      query: ({ collegeId, scriptId }) => ({
        url: `/resource/delete_a_script/?${
          scriptId ? `script_id=${scriptId}&` : ""
        }college_id=${collegeId}`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateScriptsData"],
    }),
    getQaManagerCounsellorList: builder.query({
      query: ({ collegeId, pageNum, pageSize, payload }) => ({
        url: `/qa_manager/counsellor/?${pageNum ? `page_num=${pageNum}&` : ""}${
          pageSize ? `page_size=${pageSize}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["updateCallListData"],
    }),
    getQaManagerQAList: builder.query({
      query: ({ collegeId, pageNum, pageSize, payload }) => ({
        url: `/qa_manager/qa/?${pageNum ? `page_num=${pageNum}&` : ""}${
          pageSize ? `page_size=${pageSize}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["updateCallListData"],
    }),
    getUserList: builder.query({
      query: ({ userType, collegeId }) => ({
        url: `/user/list/?user_type=${userType}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    rejectedCallListFilter: builder.mutation({
      query: ({ collegeId, payload, counsellorId }) => ({
        url: `/qa_manager/rejected_call_list_metrics/?${
          counsellorId ? `counsellor_id=${counsellorId}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    callListFilter: builder.mutation({
      query: ({ collegeId, payload, qaId }) => ({
        url: `/qa_manager/call_list_metrics/?${
          qaId ? `qa_id=${qaId}&` : ""
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    getDataSegmentDetailsHeaderData: builder.query({
      query: ({ collegeId, dataSegmentId, token, payload }) => ({
        url: `/data_segment/header_view/?data_segment_id=${dataSegmentId}&token=${token}&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    getDataSegmentDetailsTableData: builder.query({
      query: ({
        collegeId,
        dataSegmentId,
        payload,
        pageNumber,
        rowsPerPage,
        searchText,
        token,
        applyBasicFilter,
      }) => ({
        url: `/data_segment/student_mapped?data_segment_id=${dataSegmentId}&page_num=${pageNumber}&page_size=${rowsPerPage}&search=${searchText}&token=${token}&basic_filter=${
          applyBasicFilter ? "true" : "false"
        }&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    getDataSegmentDetailsAddLeadTableData: builder.query({
      query: ({
        collegeId,
        payload,
        pageNumber,
        rowsPerPage,
        searchText,
        dataType,
      }) => ({
        url: `/data_segment/search_for_add_data_segment?data_type=${dataType}&search_string=${searchText}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),

    addLeadToDataSegment: builder.mutation({
      query: ({ collegeId, payload, dataSegmentId }) => ({
        url: `/data_segment/add_data_segment_student?data_segment_id=${dataSegmentId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: [
        "getSegmentDetailsAddLeadData",
        "getSegmentDetailsHeaderData",
        "getSegmentDetailsData",
      ],
    }),

    getAutomationManagerHeaderData: builder.query({
      query: ({ collegeId, automationStatus, automationDataType }) => ({
        url: `/nested_automation/automation_top_bar_data?status_type=${automationStatus}&data_type=${automationDataType}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["automationHeaderData"],
    }),
    getAutomationManagerTableData: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload, searchText }) => ({
        url: `/nested_automation/automation_list?search=${searchText}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      providesTags: ["automationTableData"],
    }),
    getAutomationManagerDetailsHeaderData: builder.query({
      query: ({ collegeId, automationId, payload }) => ({
        url: `/nested_automation/top_bar_details/?automation_id=${automationId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      providesTags: ["automationDetailsHeaderData"],
    }),
    getAutomationManagerDetailsTableData: builder.query({
      query: ({ collegeId, automationId, tabValue }) => ({
        url: `/nested_automation/communication_data/?automation_id=${automationId}&email=${
          tabValue === 0 ? "true" : "false"
        }&sms=${tabValue === 1 ? "true" : "false"}&whatsapp=${
          tabValue === 2 ? "true" : "false"
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["automationDetailsTableData"],
    }),
    addAutomationData: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/automation_beta/create/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: [
        "automationDetailsTableData",
        "automationDetailsHeaderData",
        "automationTableData",
        "automationHeaderData",
      ],
    }),
    deleteNestedAutomation: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/nested_automation/delete_automation?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: [
        "automationTableData",
        "automationHeaderData",
        "automationDetailsHeaderData",
        "automationDetailsTableData",
      ],
    }),
    copyNestedAutomation: builder.mutation({
      query: ({ collegeId, automationId }) => ({
        url: `/nested_automation/copy_automation?automation_id=${automationId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "automationTableData",
        "automationHeaderData",
        "automationDetailsHeaderData",
        "automationDetailsTableData",
      ],
    }),
    updateNestedAutomationStatus: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/nested_automation/change_automation_status?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: [
        "automationTableData",
        "automationHeaderData",
        "automationDetailsHeaderData",
        "automationDetailsTableData",
      ],
    }),
    getAutomationById: builder.mutation({
      query: ({ collegeId, automationId }) => ({
        url: `/nested_automation/get_data_by_id/?automation_id=${automationId}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
    }),
    getReportAutoScheduledData: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        search,
        autoSchedule,
      }) => ({
        url: `/reports/current_user/?page_num=${pageNumber}&page_size=${rowsPerPage}&reschedule_report=false&auto_schedule_reports=${autoSchedule}&search_pattern=${search}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getReportAutoScheduled"],
    }),
    getReportTemplates: builder.query({
      query: ({ collegeId }) => ({
        url: `/reports/get_saved_report_templates/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["getReportTemplate"],
    }),
    deleteReportTemplate: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/reports/delete_report_by_id/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["getReportTemplate"],
    }),
    downloadPreviousReports: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/reports/get_download_url_by_request_id/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    fetchTemplates: builder.query({
      query: ({
        collegeId,
        category,
        payload,
        draftTemplates,
        state,
        tabsValue,
        rowsPerPage,
        pageNumber,
        ownEmailTemplates,
      }) => ({
        url: `/templates/?draft_whatsapp_templates=${
          state?.from === "whatsapp" ? draftTemplates : false
        }&draft_email_templates=${
          state?.from === "email" ? draftTemplates : false
        }&email_templates=${
          state?.from === "email" ? true : false
        }&own_templates=${ownEmailTemplates}&sms_templates=${
          state?.from === "sms" ? true : false
        }&whatsapp_templates=${
          state?.from === "whatsapp" ? true : false
        }&draft_sms_template=${
          state?.from === "sms" ? draftTemplates : false
        }&page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }${
          tabsValue !== 1 && tabsValue !== 2
            ? state?.from === "email"
              ? ""
              : state?.from === "sms"
              ? "&sms_category=" + category
              : ""
            : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateTemplateData"],
    }),
    addOrUpdateTemplate: builder.mutation({
      query: ({ collegeId, templateId, payload }) => ({
        url: `/templates/add_or_update/${
          collegeId ? "?college_id=" + collegeId : ""
        }${templateId ? `&template_id=${templateId}` : ""}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      invalidatesTags: ["updateTemplateData"],
    }),
    fetchAllTemplates: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload }) => ({
        url: `/templates/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["updateTemplateData"],
    }),
    deleteTemplate: builder.mutation({
      query: ({ deleteTemplateID, collegeId }) => ({
        url: `/templates/delete/?template_id=${deleteTemplateID}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["updateTemplateData"],
    }),
    getQuestionsData: builder.query({
      query: ({ collegeId, payload }) => ({
        url: `/resource/get_questions/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getQuestionsData"],
    }),
    getSeasonList: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/season_list/?id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
    }),
    getCounselorPerformanceReportData: builder.query({
      query: ({
        selectedCollegeId,
        payload,
        counsellorPerformanceIndicator,
      }) => ({
        url: `/counselor/counsellor_performance_report${
          selectedCollegeId ? "?college_id=" + selectedCollegeId : ""
        }&change_indicator=${
          counsellorPerformanceIndicator !== null
            ? counsellorPerformanceIndicator
            : "last_7_days"
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      providesTags: ["getCounselorPerformanceReport"],
    }),
    getHeadCounselorList: builder.query({
      query: ({ collegeId }) => ({
        url: `/counselor/get_head_counselors_list/?college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["updateHeadCounselorList"],
    }),
    getPublisherQuickViewData: builder.query({
      query: ({ collegeId, payload, publisherIndicator }) => ({
        url: `/publisher/get_publisher_percentage_data?change_indicator=${
          publisherIndicator ? publisherIndicator : "last_7_days"
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      providesTags: ["getPublisherQuickView"],
    }),
    getUserProfileLeadHeader: builder.query({
      query: ({ collegeId, applicationId }) => ({
        url: `/lead/lead_profile_header/${applicationId ? applicationId : ""}${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["leadHeader"],
    }),
    getUserProfileTimelineInfo: builder.query({
      query: ({ collegeId, applicationId, payload }) => ({
        url: `/student_timeline/${applicationId ? applicationId : ""}${
          collegeId ? "/?college_id=" + collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileTimelineInfo"],
    }),
    getUserProfileTimelineFollowupNote: builder.query({
      query: ({ collegeId, applicationId }) => ({
        url: `/student_timeline/followup_and_notes/${
          applicationId ? applicationId : ""
        }${collegeId ? "/?college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileFollowupNote"],
    }),
    getUserProfileLeadStepInfo: builder.query({
      query: ({ collegeId, applicationId }) => ({
        url: `/lead/lead_notifications/${applicationId}${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileLeadStep"],
    }),
    getUserProfileLeadDetailsInfo: builder.query({
      query: ({ collegeId, applicationId }) => ({
        url: `/lead/lead_details_user/${applicationId}${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileLeadDetails"],
    }),
    getUserProfileStudentCommunicationLog: builder.query({
      query: ({
        collegeId,
        applicationId,
        communicationTabValue,
        payload,
      }) => ({
        url: `/student_communication_log/${applicationId}/?email=${
          communicationTabValue === 2 ? true : false
        }&sms=${communicationTabValue === 3 ? true : false}&whatsapp=${
          communicationTabValue === 1 ? true : false
        }${collegeId ? "&college_id=" + collegeId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileCommunicationLog"],
    }),
    getUserProfileLeadDocument: builder.query({
      query: ({ collegeId, studentId }) => ({
        url: `/admin/student_documents/?student_id=${studentId}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileLeadDocument"],
    }),
    getUserProfileLeadTicketList: builder.query({
      query: ({ collegeId, applicationId, pageNumber, pageSize }) => ({
        url: `/query/get/?application_id=${applicationId}&page_num=${pageNumber}&page_size=${pageSize}${
          collegeId ? "&college_id=" + collegeId : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["UserProfileLeadTicketList"],
    }),
    downloadRawData: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/manage/download_raw_data?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
    }),
    getLeadProcessedDetails: builder.query({
      query: ({
        collegeId,
        offlineId,
        pageNumber,
        rowsPerPage,
        payload,
        isApplication,
      }) => ({
        url: `/manage/converted_lead_and_application_list/?offline_id=${offlineId}&is_application=${isApplication}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
    }),
    getPreferenceWisePerformance: builder.query({
      query: ({ collegeId, payload, selectTabs, season }) => ({
        url: `/admin/preference_wise_data/?data_for=${selectTabs}&season=${season}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["PreferenceWisePerformance"],
    }),
    getCounsellorWiseFollowupDetails: builder.query({
      query: ({ collegeId, payload, headCounsellorId }) => ({
        url: `/communication/counsellor_wise_followup_details${
          headCounsellorId ? `?head_counsellor_id=${headCounsellorId}&` : "?"
        }college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getCounsellorWiseFollowupDetails"],
    }),
    fetchCollegeList: builder.mutation({
      query: ({ usingFor, token }) => ({
        url: `/college/list_college/${
          usingFor ? "?using_for=" + usingFor : ""
        }`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useFetchCollegeListMutation,
  useGetCounsellorWiseFollowupDetailsQuery,
  useGetLeadProcessedDetailsQuery,
  useDownloadRawDataMutation,
  useGetHeadCounselorListQuery,
  useGetRawDataNameListQuery,
  useGetSeasonListQuery,
  useDownloadPreviousReportsMutation,
  useDeleteReportTemplateMutation,
  useGetReportTemplatesQuery,
  useUpdateNestedAutomationStatusMutation,
  useCopyNestedAutomationMutation,
  useDeleteNestedAutomationMutation,
  useGetAutomationManagerDetailsTableDataQuery,
  useGetAutomationManagerDetailsHeaderDataQuery,
  useGetAutomationManagerHeaderDataQuery,
  useGetAutomationManagerTableDataQuery,
  useGetDataSegmentDetailsHeaderDataQuery,
  useGetDataSegmentDetailsTableDataQuery,
  useGetDataSegmentDetailsAddLeadTableDataQuery,
  useAddLeadToDataSegmentMutation,
  useAddMergeTagMutation,
  useGetTemplateMergeKaysQuery,
  useGetApplicationsQuery,
  useUpdateCounsellorMutation,
  usePrefetch,
  useGetPublisherApplicationsQuery,
  useGetRawDataUploadHitoryQuery,
  useGetViewRawDataQuery,
  useGetUserManagerDataQuery,
  useGetDownloadRequestListDataQuery,
  useGetUserSessionDataQuery,
  useUpdateUserStatusMutation,
  useCreateUserMutation,
  useAllocateCounsellorMutation,
  useGetAllCounsellorListQuery,
  useGetApplicationFollowupQuery,
  useUpdateFollowupMutation,
  useUpdateFollowupStatusMutation,
  useGetPaidApplicationsQuery,
  useMultipleLeadAssignToCounselorMutation,
  useUploadRawDataMutation,
  useGenerateReportMutation,
  useGetCurrentUserReportsQuery,
  useGetRuleDetailsAPIQuery,
  useGetRuleDEliveryDetailsAPIQuery,
  useGetRuleJobDetailsAPIQuery,
  useGetAllRulesDataQuery,
  useUpdateCampaignStatusMutation,
  useCreateRuleMutation,
  useGetInBoundActivitiesDetailsAPIQuery,
  useGetOutBoundActivitiesDetailsAPIQuery,
  useMapCounselorToHeadCounselorMutation,
  useGetUtmDetailsQuery,
  useUploadLeadDataMutation,
  useDeleteDataSegmentMutation,
  useGetHeadCounselorListWithPendingFollowupCountQuery,
  useGetPendingFollowupQuery,
  useClientRegistrationMutation,
  useGetBillingListQuery,
  useGetCollegesByStatusQuery,
  useUpdateCollegeStatusMutation,
  useGetCommunicationTrendDataQuery,
  useGetEventMappingDataQuery,
  useUpdateEventMappingMutation,
  useDeleteEventMutation,
  useCreateEventMappingMutation,
  useGetCounselorListQuery,
  useGetManageSessionListQuery,
  useRevokeSessionMutation,
  useGetFeatureListQuery,
  useGetCollegeListQuery,
  useGetNameAndLabelListQuery,
  useGetConsumptionInfoQuery,
  useGetLeadsQuery,
  useGetAllPanelAndSlotDataQuery,
  useGetPanelistInfoByIdQuery,
  useUpdateStudentDocumentStatusMutation,
  useUpdateStudentDocumentGetCommentMutation,
  useTakeSlotPanelistMutation,
  useDeleteSlotAndPanelMutation,
  useGetInterViewStudentsInfoDataMutation,
  usePublishSlotAndPanelMutation,
  useCreateSlotMutation,
  useCreatePanelMutation,
  useGetDateWiseSlotPanelStatusQuery,
  useUnAssigneeStudentMutation,
  useInterviewStudentMarkSubmitMutation,
  useGetCounselorFollowUpCalendarDataQuery,
  useGetUserProfileHeaderInfoQuery,
  useDeleteLeadUploadHistoryMutation,
  useManualCounsellorAssignMutation,
  useGetStudentTotalQueriesDataQuery,
  useGetStudentTotalQueriesTableDataQuery,
  useGetFollowupSummaryQuery,
  useGetDocumentLockerUserDataMutation,
  useGetStudentCommentDataMutation,
  useAddTagToStudentMutation,
  useGetTagListsQuery,
  useHandleLeadStageChangeMutation,
  useGetLeadAndApplicationStageCountQuery,
  useGetLeadAndApplicationStageDetailsQuery,
  useDeleteTagMutation,
  useGetLeadAndApplicationSummaryQuery,
  useGetStudentTimelineFollowupAndNotesQuery,
  useGetAdminPendingFollowupCountQuery,
  useGetStudentQueryDataMutation,
  useCreateKeyCategoryMutation,
  useGetKeyCategoriesQuery,
  useCreateQuestionMutation,
  useGetQuestionsMutation,
  useGetCounsellorLeadsApplicationDataQuery,
  useDeleteQuestionMutation,
  useDeleteCategoryMutation,
  useCreateUpdateScriptMutation,
  useDeleteScriptMutation,
  useUpdateAndEditUserInfoMutation,
  useGetUserManagerChartDataQuery,
  useCallListFilterMutation,
  useRejectedCallListFilterMutation,
  useGetUserListQuery,
  useGetAdvanceFilterCategoriesDataQuery,
  useGetAllScriptQuery,
  useGetQaManagerCounsellorListQuery,
  useGetQaManagerQAListQuery,
  useGetReportAutoScheduledDataQuery,
  useAddAutomationDataMutation,
  useGetAutomationByIdMutation,
  useFetchTemplatesQuery,
  useAddOrUpdateTemplateMutation,
  useFetchAllTemplatesQuery,
  useDeleteTemplateMutation,
  useGetQuestionsDataQuery,
  useGetCounselorPerformanceReportDataQuery,
  useGetAllScriptDataQuery,
  useGetPublisherQuickViewDataQuery,
  useGetUserProfileLeadHeaderQuery,
  useGetUserProfileTimelineInfoQuery,
  useGetUserProfileTimelineFollowupNoteQuery,
  useGetUserProfileLeadStepInfoQuery,
  useGetUserProfileLeadDetailsInfoQuery,
  useGetUserProfileStudentCommunicationLogQuery,
  useGetUserProfileLeadDocumentQuery,
  useGetUserProfileLeadTicketListQuery,
  useGetPreferenceWisePerformanceQuery,
  useGetSenderAndReceiverEmailIdDetailQuery,
} = tableSlice;
