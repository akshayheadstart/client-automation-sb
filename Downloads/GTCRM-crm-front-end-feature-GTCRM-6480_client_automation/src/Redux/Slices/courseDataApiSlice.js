import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";

export const manageCourseSlice = createApi({
  reducerPath: "manageCourseSlice",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
  }),
  tagTypes: ["updateCourseList", "updateSpecializationList"],
  endpoints: (builder) => ({
    getAllCourses: builder.query({
      query: ({ collegeId }) => ({
        url: `/course/list/?show_disable_courses=true${
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
      providesTags: ["updateCourseList"],
    }),
    addCourse: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/course/create/?college_id=${collegeId}`,
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
      invalidatesTags: ["updateCourseList"],
    }),
    editExsitingCourse: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/course/edit/?college_id=${collegeId}&course_id=${payload._id}`,
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
      invalidatesTags: ["updateCourseList"],
    }),

    addCourseSpecialization: builder.mutation({
      query: ({ courseId, courseName, collegeId, payload }) => ({
        url: `/course/add_specializations/?course_id=${courseId}&course_name=${courseName}&college_id=${collegeId}`,
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
      keepUnusedDataFor: true,
      invalidatesTags: ["updateCourseList"],
    }),
    updateCourseSpecialization: builder.mutation({
      query: ({ courseId, courseName, collegeId, payload }) => ({
        url: `/course/update_specializations/?course_id=${courseId}&course_name=${courseName}&college_id=${collegeId}`,
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
      keepUnusedDataFor: true,
      invalidatesTags: ["updateCourseList"],
    }),
    updateCourseStatus: builder.mutation({
      query: ({ collegeId, courseId, payload }) => ({
        url: `/course/status/?college_id=${collegeId}&course_id=${courseId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(payload),
      }),
      keepUnusedDataFor: true,
      invalidatesTags: ["updateCourseList"],
    }),
  }),
});

export const {
  useGetAllCoursesQuery,
  useAddCourseMutation,
  useEditExsitingCourseMutation,
  useAddCourseSpecializationMutation,
  useUpdateCourseSpecializationMutation,
  useUpdateCourseStatusMutation,
} = manageCourseSlice;
