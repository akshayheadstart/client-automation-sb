import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { adminDashboardPermissionKeys } from "../../utils/apiPermissionIds";

export const adminDashboardSlice = createApi({
  reducerPath: "adminDashboardSlice",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: adminDashboardPermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    getScoreBoardData: builder.query({
      query: ({
        scoreBoardApplicationType,
        scoreBoardIndicator,
        collegeId,
        payloadForScoreBoard,
      }) => ({
        url: `/admin/score_board/${
          collegeId ? collegeId : ""
        }?change_indicator=${
          scoreBoardIndicator !== null ? scoreBoardIndicator : "last_7_days"
        }&application_type=${scoreBoardApplicationType}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payloadForScoreBoard,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["getScoreBoard"],
    }),
    getChannelWisePerformanceDetails: builder.query({
      query: ({ collegeId, topPerformingIndicator, payload }) => ({
        url: `/admin/top_performing_channel/${collegeId}?change_indicator=${
          topPerformingIndicator ? topPerformingIndicator : "last_7_days"
        }`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getApplicationFunnelDetails: builder.query({
      query: ({ collegeId, payload, featureKey }) => ({
        url: `/admin/application_funnel/${collegeId}`,
        method: "PUT",
        params: { feature_key: featureKey },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["getApplicationFunnel"],
    }),
    getKeyIndicatorDetails: builder.query({
      query: ({ collegeId, payload, keyIndicatorIndicator }) => ({
        url: `/admin/key_indicator/?change_indicator=${
          keyIndicatorIndicator ? keyIndicatorIndicator : "last_7_days"
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getStateWisePerformanceDetails: builder.query({
      query: ({ collegeId, payload, stateWiseIndicator, featureKey }) => ({
        url: `/map_data/${collegeId}?change_indicator=${
          stateWiseIndicator ? stateWiseIndicator : "last_7_days"
        }`,
        method: "POST",
        params: { feature_key: featureKey },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getLeadVsPaidApplicationDetails: builder.query({
      query: ({ selectedCollegeId, payload }) => ({
        url: `/admin/lead_application/${selectedCollegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      // keepUnusedDataFor: ,
      providesTags: ["getLeadVsApplications"],
    }),
    getProgramWiseApplicationDetails: builder.query({
      query: ({ collegeId, payload, programWiseIndicator, featureKey }) => ({
        url: `/admin/form_wise_record/${collegeId}?change_indicator=${
          programWiseIndicator ? programWiseIndicator : "last_7_days"
        }`,
        method: "POST",
        params: { feature_key: featureKey },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["getProgramWise"],
    }),
    getSourceWiseLeadDetails: builder.query({
      query: ({
        collegeId,
        payload,
        sourceWiseLeadIndicator,
        selectedLeadType,
      }) => ({
        url: `/admin/source_wise_detail?${
          selectedLeadType ? "lead_type=" + selectedLeadType : ""
        }&change_indicator=${
          sourceWiseLeadIndicator ? sourceWiseLeadIndicator : "last_7_days"
        }&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
      providesTags: ["getSourceWise"],
    }),
    getApplicationStepWiseDetails: builder.query({
      query: ({ collegeId, payload }) => ({
        url: `/lead/step_wise_data?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getCounsellorQuickViewDetails: builder.query({
      query: ({ collegeId, payload, quickViewChangeIndicator }) => ({
        url: `/counselor/quick_view/?change_indicator=${
          quickViewChangeIndicator ? quickViewChangeIndicator : "last_7_days"
        }&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getCounsellorKeyIndicatorDetails: builder.query({
      query: ({
        collegeId,
        keyIndicatorChangeIndicator,
        keyIndicatorLcrType,
      }) => ({
        url: `/counselor/key_indicators/?lcr_type=${keyIndicatorLcrType}&change_indicator=${
          keyIndicatorChangeIndicator
            ? keyIndicatorChangeIndicator
            : "last_7_days"
        }&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
      }),
      keepUnusedDataFor: 60,
    }),
    getLeadStageCountDetails: builder.query({
      query: ({ collegeId, payload }) => ({
        url: `/counselor/lead_stage_count_summary/?download_data=false&college_id=${
          collegeId ? collegeId : ""
        }`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
    getCounsellorPerformanceDetails: builder.query({
      query: ({ collegeId, payload }) => ({
        url: `/counselor/counselor_performance?college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "content-type": "application/json",
        },
        data: payload,
      }),
      keepUnusedDataFor: 60,
    }),
  }),
});

export const {
  usePrefetch,
  useGetScoreBoardDataQuery,
  useGetChannelWisePerformanceDetailsQuery,
  useGetApplicationFunnelDetailsQuery,
  useGetKeyIndicatorDetailsQuery,
  useGetStateWisePerformanceDetailsQuery,
  useGetLeadVsPaidApplicationDetailsQuery,
  useGetProgramWiseApplicationDetailsQuery,
  useGetSourceWiseLeadDetailsQuery,
  useGetApplicationStepWiseDetailsQuery,
  useGetCounsellorQuickViewDetailsQuery,
  useGetCounsellorKeyIndicatorDetailsQuery,
  useGetLeadStageCountDetailsQuery,
  useGetCounsellorPerformanceDetailsQuery,
} = adminDashboardSlice;
