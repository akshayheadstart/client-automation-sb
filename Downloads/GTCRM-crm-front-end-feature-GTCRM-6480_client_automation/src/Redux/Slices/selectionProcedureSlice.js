import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { selectionProcedurePermissionKeys } from "../../utils/apiPermissionIds";

export const selectionProcedureData = createApi({
  reducerPath: "selectionProcedure",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: selectionProcedurePermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    getSelectionProcedureData: builder.query({
      query: ({ pageNumber, rowsPerPage, collegeId }) => ({
        url: `/interview/selection_procedures/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["selection-procedure"],
    }),
    createSelectionProcedure: builder.mutation({
      query: ({ collegeId, payload, procedureId }) => ({
        url: `/interview/create_or_update_selection_procedure/?college_id=${collegeId}${
          procedureId ? "&procedure_id=" + procedureId : ""
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
      invalidatesTags: ["selection-procedure"],
    }),
    deleteSelectionProcedure: builder.mutation({
      query: ({ collegeId, selectedSelectionProcedure }) => ({
        url: `/interview/delete_selection_procedures/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedSelectionProcedure,
      }),
      invalidatesTags: ["selection-procedure"],
    }),
  }),
});

export const {
  useGetSelectionProcedureDataQuery,
  useCreateSelectionProcedureMutation,
  usePrefetch,
  useDeleteSelectionProcedureMutation,
} = selectionProcedureData;
