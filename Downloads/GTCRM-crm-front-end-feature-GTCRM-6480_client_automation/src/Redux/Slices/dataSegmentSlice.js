import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { dataSegmentSlicePermissionKeys } from "../../utils/apiPermissionIds";
import axiosBaseQuery from "./axiosBaseQuery";

export const dataSegmentData = createApi({
  reducerPath: "dataSegment",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: dataSegmentSlicePermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    getDataSegmentQuickView: builder.query({
      query: ({ collegeId, status, featureKey }) => ({
        url: `/data_segments/quick_view_info/?college_id=${collegeId}${
          status ? `&status=${status}` : ""
        }`,
        method: "GET",
        params: { feature_key: featureKey },
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
        },
      }),
      keepUnusedDataFor: Infinity,
    }),

    createDataSegmentCountOfEntries: builder.mutation({
      query: ({ collegeId, payload, featureKey }) => ({
        url: `/data_segment/count_of_entities/?college_id=${collegeId}`,
        method: "POST",
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
      invalidatesTags: ["selection-procedure"],
    }),
    createDataSegment: builder.mutation({
      query: ({ dataSegmentId, dataSegmentPayload, collegeId }) => ({
        url: `/data_segment/create/${
          collegeId ? "?college_id=" + collegeId : ""
        }&data_segment_id=${dataSegmentId ? dataSegmentId : ""}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: dataSegmentPayload,
      }),
      invalidatesTags: ["updateDataSegmentData"],
    }),
    getDataSegmentData: builder.query({
      query: ({
        pageNumber,
        rowsPerPage,
        collegeId,
        searchText,
        status,
        payload,
        featureKey,
      }) => ({
        url: `/data_segments/?page_num=${pageNumber}&page_size=${rowsPerPage}${
          collegeId ? "&college_id=" + collegeId : ""
        }${searchText ? "&search_string=" + searchText : ""}${
          status ? "&status=" + status : ""
        }`,
        params: { feature_key: featureKey },
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
      providesTags: ["updateDataSegmentData"],
    }),
    updateDataSegmentStatus: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/data_segments/change_status/?college_id=${collegeId}`,
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
      invalidatesTags: ["updateDataSegmentData"],
    }),
  }),
});

export const {
  useGetDataSegmentQuickViewQuery,
  usePrefetch,
  useCreateDataSegmentCountOfEntriesMutation,
  useCreateDataSegmentMutation,
  useGetDataSegmentDataQuery,
  useUpdateDataSegmentStatusMutation,
} = dataSegmentData;
