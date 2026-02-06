import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { telephonyPermissionKeys } from "../../utils/apiPermissionIds";

export const telephonyData = createApi({
  reducerPath: "telephonyData",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: telephonyPermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    getCallDetailsTopStripData: builder.query({
      query: ({ collegeId, payload, indicatorValue, featureKey }) => ({
        url: `/telephony/dashboard_header?change_indicator=${indicatorValue}&college_id=${collegeId}`,
        method: "PUT",
        params: { feature_key: featureKey },
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
      providesTags: ["getCallDetailsTopStripData"],
    }),
    getDialedByUsers: builder.query({
      query: ({ collegeId }) => ({
        url: `/telephony/get_dialed_by_users?college_id=${collegeId}`,
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
      providesTags: ["getDialedByUsers"],
    }),
    getAnsweredByUsers: builder.query({
      query: ({ collegeId }) => ({
        url: `/telephony/get_answered_by_users?college_id=${collegeId}`,
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
    getInboundOutboundCallLogs: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        tabValue,
        callStatus,
      }) => ({
        url: `/telephony/${
          tabValue === 0 ? "outbound_call_log" : "inbound_call_log"
        }?${
          callStatus?.length ? `call_status=${callStatus}&` : ""
        }page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getOutboundCallLogs"],
    }),
    initializeTelephonyCall: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/telephony/initiate_call?college_id=${collegeId}`,
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
      invalidatesTags: ["getDialedByUsers", "getOutboundCallLogs"],
    }),
    getLeadBySearch: builder.mutation({
      query: ({ collegeId, searchText, pageNumber, pageSize }) => ({
        url: `/admin/search_students/?page_num=${pageNumber}&page_size=${pageSize}&search_input=${searchText}&college_id=${collegeId}`,
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
    saveAndDisposeCal: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/telephony/save_and_dispose?college_id=${collegeId}`,
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
    assignCallToApplication: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/telephony/assign_application_on_call?college_id=${collegeId}`,
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
      invalidatesTags: ["getOutboundCallLogs"],
    }),
    getCallRecording: builder.mutation({
      query: ({ callId, collegeId }) => ({
        url: `/telephony/download_call_recording?call_id=${callId}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getOutboundCallLogs", "updateCallListData"],
    }),
    getCallListReviewData: builder.query({
      query: ({ collegeId, payload, pageNumber, rowsPerPage, call_type }) => ({
        url: `/qa_manager/call_list/?page_num=${pageNumber}&page_size=${rowsPerPage}&${
          call_type ? `call_type=${call_type}&` : ""
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
      providesTags: ["updateCallListData"],
    }),
    addCallReview: builder.mutation({
      query: ({ collegeId, payload, callId }) => ({
        url: `/qa_manager/call_review/?call_id=${callId}&college_id=${collegeId}`,
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
      invalidatesTags: ["updateCallListData"],
    }),
    getCheckoutReasonList: builder.query({
      query: ({ collegeId }) => ({
        url: `/telephony/get_checkout_reasons?college_id=${collegeId}`,
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
    getCurrentUserDetails: builder.query({
      query: () => ({
        url: `/user/current_user_details/`,
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
      providesTags: ["CurrentUserDetails"],
    }),
    getCounsellorActivityDetails: builder.query({
      query: ({ collegeId, selectedQuickFilter, payload }) => ({
        url: `/telephony/counsellor_call_activity?quick_filter=${
          selectedQuickFilter || ""
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
      providesTags: ["getCounsellorActivityDetails"],
    }),
    checkInAndOut: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/telephony/check_in_or_out?college_id=${collegeId}`,
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
      invalidatesTags: ["CurrentUserDetails"],
    }),
    multipleCheckInAndOut: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/telephony/multiple_check_in_or_out?college_id=${collegeId}`,
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
      invalidatesTags: ["getCounsellorActivityDetails", "CurrentUserDetails"],
    }),
    getMissedCallDetailsTopStripData: builder.query({
      query: ({ collegeId, payload, indicatorValue }) => ({
        url: `/telephony/missed_call_top_strip?change_indicator=${indicatorValue}&college_id=${collegeId}`,
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
      providesTags: ["getMissedCallDetailsTopStripData"],
    }),
    getLandingNumbers: builder.query({
      query: ({ collegeId }) => ({
        url: `/telephony/landing_number?college_id=${collegeId}`,
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
    getMissedCallLists: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        selectedLandingNumber,
        payload,
      }) => ({
        url: `/telephony/missed_call_list?landing_number=${
          selectedLandingNumber || ""
        }&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getMissedCallLists"],
    }),
    assignCounselorToMissedCall: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/telephony/assigned_counsellor_on_missed_call?college_id=${collegeId}`,
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
      invalidatesTags: ["getMissedCallLists"],
    }),
    getCallLogsTopStripDetails: builder.query({
      query: ({ collegeId, indicator, payload }) => ({
        url: `/telephony/counsellor_call_log_header?change_indicator=${indicator}&college_id=${collegeId}`,
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
    getCallQualityDetails: builder.query({
      query: ({ collegeId, indicator, payload, pageNumber, rowsPerPage }) => ({
        url: `/telephony/call_quality_table?change_indicator=${indicator}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
    getCallInfo: builder.query({
      query: ({ collegeId, callType, payload, pageNumber, rowsPerPage }) => ({
        url: `/telephony/counsellor_call_info?data_type=${callType}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
    downloadCallQualityDetails: builder.mutation({
      query: ({ collegeId, indicator, payload, pageNumber, rowsPerPage }) => ({
        url: `/telephony/call_quality_table_download?change_indicator=${indicator}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
    getCommunicationSummaryTopStripDetails: builder.query({
      query: ({ collegeId, indicator, payload }) => ({
        url: `/communication/header_summary?change_indicator=${indicator}&college_id=${collegeId}`,
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
  }),
});

export const {
  usePrefetch,
  useGetCallDetailsTopStripDataQuery,
  useInitializeTelephonyCallMutation,
  useGetLeadBySearchMutation,
  useSaveAndDisposeCalMutation,
  useGetDialedByUsersQuery,
  useGetAnsweredByUsersQuery,
  useGetInboundOutboundCallLogsQuery,
  useAssignCallToApplicationMutation,
  useGetCallRecordingMutation,
  useGetCallListReviewDataQuery,
  useAddCallReviewMutation,
  useGetCheckoutReasonListQuery,
  useGetCurrentUserDetailsQuery,
  useCheckInAndOutMutation,
  useGetCounsellorActivityDetailsQuery,
  useMultipleCheckInAndOutMutation,
  useGetMissedCallDetailsTopStripDataQuery,
  useGetLandingNumbersQuery,
  useGetMissedCallListsQuery,
  useAssignCounselorToMissedCallMutation,
  useGetCallLogsTopStripDetailsQuery,
  useGetCallQualityDetailsQuery,
  useGetCallInfoQuery,
  useDownloadCallQualityDetailsMutation,
  useGetCommunicationSummaryTopStripDetailsQuery,
} = telephonyData;
