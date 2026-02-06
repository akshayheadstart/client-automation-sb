import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { mediaGalleryPermissionKeys } from "../../utils/apiPermissionIds";

export const mediaGallerySlice = createApi({
  reducerPath: "mediaGallerySlice",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: mediaGalleryPermissionKeys,
  }),
  tagTypes: ["deleteMediaFile", "uploadMediaFile"],
  endpoints: (builder) => ({
    getAllMediaFiles: builder.query({
      query: ({
        collegeId,
        debouncedSearchText: filterParams,
        page_num,
        page_size,
      }) => {
        return {
          url: `/templates/get_media_gallery?page_num=${page_num}&page_size=${page_size}&college_id=${collegeId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            accept: "application/json",
            "Content-Type": "application/json",
          },

          data: filterParams,
        };
      },
      keepUnusedDataFor: Infinity,
      providesTags: ["uploadMediaFile", "deleteMediaFile"],
    }),
    uploadMediaFiles: builder.mutation({
      query: ({ collegeId, file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `/templates/gallery_upload?college_id=${collegeId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
          },
          data: formData,
        };
      },
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["uploadMediaFile"],
    }),
    getMediaFileDetail: builder.query({
      query: ({ collegeId, media_id }) => ({
        url: `/templates/get_spec_media_details?media_id=${media_id}&college_id=${collegeId}`,
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
    deleteMediaFiles: builder.mutation({
      query: ({ collegeId, media_ids }) => {
        return {
          url: `/templates/delete_gallery_data?college_id=${collegeId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
          },
          data: media_ids,
        };
      },
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["deleteMediaFile"],
    }),
    downloadMediaFiles: builder.mutation({
      query: ({ collegeId, media_ids }) => {
        return {
          url: `/templates/download_media?college_id=${collegeId}`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
          },
          data: media_ids,
        };
      },
      keepUnusedDataFor: Infinity,
    }),
  }),
});

export const {
  useGetAllMediaFilesQuery,
  useUploadMediaFilesMutation,
  useGetMediaFileDetailQuery,
  useDeleteMediaFilesMutation,
  useDownloadMediaFilesMutation,
} = mediaGallerySlice;
