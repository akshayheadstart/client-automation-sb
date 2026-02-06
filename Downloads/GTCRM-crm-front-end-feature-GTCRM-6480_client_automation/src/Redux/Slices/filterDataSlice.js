import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { filterDataPermissionKeys } from "../../utils/apiPermissionIds";

export const filterOptionData = createApi({
  reducerPath: "filterOptions",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: filterDataPermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    getAllStateList: builder.query({
      query: () => ({
        url: `/countries/IN/states/`,
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
    getAllCourseList: builder.query({
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
    }),
    getAllSourceList: builder.query({
      query: ({ collegeId }) => ({
        url: `/admin/get_source_name/${
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
    getAllExtraFiltersList: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/extra_filter_fields/${
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
    getParticularStudentList: builder.query({
      query: ({
        collegeId,
        interviewListId,
        pageNumber,
        rowsPerPage,
        filterOfApiPayload,
      }) => ({
        url: `/interview/view_interview_detail/?interview_list_id=${interviewListId}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: filterOfApiPayload,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["particularStudentList"],
    }),
    deleteStudentFromList: builder.mutation({
      query: ({ interviewListId, collegeId, selectedStudent }) => ({
        url: `/interview/delete_students_from_list/?interview_list_id=${interviewListId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedStudent,
      }),
      invalidatesTags: [
        "particularStudentList",
        "getStudentDetailsHeader",
        "selectedStudentApplications",
        "studentWhoAreNotInList",
        "interviewList",
      ],
    }),
    updateInterviewListStatus: builder.mutation({
      query: ({ status, collegeId, selectedInterviewList }) => ({
        url: `/interview_list/change_status_by_ids/?status=${status}&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedInterviewList,
      }),
      invalidatesTags: ["interviewList"],
    }),
    getViewStudentDetailsHeaderDetails: builder.query({
      query: ({ collegeId, interviewListId }) => ({
        url: `/interview/interview_list_header/?interview_list_id=${interviewListId}&college_id=${collegeId}`,
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
      providesTags: ["getStudentDetailsHeader"],
    }),
    changeStatusOfCandidates: builder.mutation({
      query: ({ collegeId, payload, approvalStatus }) => ({
        url: `/interview_list/change_interview_status_of_candidates/?is_approval_status=${approvalStatus}&college_id=${collegeId}`,
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
      invalidatesTags: [
        "particularStudentList",
        "getStudentDetailsHeader",
        "pendingApprovalApplicants",
        "reviewedApplicants",
        "interviewedCandidateHeader",
        "selectedStudentApplications",
      ],
    }),
    getInterviewedCandidateHeaderDetails: builder.query({
      query: ({ collegeId }) => ({
        url: `/interview/get_hod_header/?college_id=${collegeId}`,
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
      providesTags: ["interviewedCandidateHeader"],
    }),
    getPendingApprovalApplicants: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage }) => ({
        url: `/interview_list/approval_pending_applicants_data/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["pendingApprovalApplicants"],
    }),
    getReviewedApplicants: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage }) => ({
        url: `/interview_list/reviewed_applicants_data/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["reviewedApplicants"],
    }),
    getAllModeratorList: builder.query({
      query: ({ user, collegeId }) => ({
        url: `/user/list/?user_type=${user}&college_id=${collegeId}`,
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
    getAllSchoolList: builder.query({
      query: ({ collegeId }) => ({
        url: `/admin/school_names/?college_id=${collegeId}`,
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
    getListOfSchools: builder.query({
      query: ({ collegeId }) => ({
        url: `/admin/school_names/?college_id=${collegeId}`,
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
    getListOfUsers: builder.query({
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
      keepUnusedDataFor: Infinity,
    }),
    getTwelveBoardList: builder.query({
      query: ({ collegeId }) => ({
        url: `/student_user_crud/board_detail/?college_id=${collegeId}`,
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
    getApplicationsBasedOnProgram: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload }) => ({
        url: `/interview_list/applications_data_based_on_program/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
    createInterviewList: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/interview/create_or_update_interview_list/?college_id=${collegeId}`,
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
      invalidatesTags: ["interviewList"],
    }),
    getCityList: builder.query({
      query: ({ payload }) => ({
        url: `/countries/get_cities_based_on_states/`,
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
    getSelectedStudentApplications: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload }) => ({
        url: `/interview_list/selected_student_applications_data/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["selectedStudentApplications"],
    }),
    handleSendForApproval: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/interview_list/send_applicants_for_approval/?college_id=${collegeId}`,
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
      invalidatesTags: [
        "pendingApprovalApplicants",
        "interviewedCandidateHeader",
        "selectedStudentApplications",
      ],
    }),
    handleSearchStudent: builder.mutation({
      query: ({ searchText, interviewStatus, interviewListId, collegeId }) => ({
        url: `/interview_list/get_interview_list/?search_input=${searchText}&interview_id=${interviewListId}&interview_status=${
          interviewStatus ? interviewStatus : ""
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
    }),
    handleAddStudentToList: builder.mutation({
      query: ({ collegeId, interviewListId, selectedStudent }) => ({
        url: `/interview/add_students_into_list/?interview_list_id=${interviewListId}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedStudent,
      }),
      invalidatesTags: [
        "particularStudentList",
        "getStudentDetailsHeader",
        "interviewList",
      ],
    }),
    getInterviewListHeaderData: builder.query({
      query: ({ archivedSwitchChecked, collegeId }) => ({
        url: `/interview/gd_pi_header_list/?archive=${archivedSwitchChecked}&college_id=${collegeId}`,
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
      providesTags: ["interviewList"],
    }),
    getInterviewListData: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        searchInput,
        interviewStatus,
        slotType,
      }) => ({
        url: `/interview_list/get_interview_header/${
          pageNumber ? "?page_num=" + pageNumber : ""
        }${rowsPerPage ? "&page_size=" + rowsPerPage : ""}${
          searchInput
            ? pageNumber
              ? "&search_input=" + searchInput
              : "?search_input=" + searchInput
            : ""
        }${
          interviewStatus
            ? pageNumber || searchInput
              ? "&interview_status=" + interviewStatus
              : "?interview_status=" + interviewStatus
            : ""
        }${
          pageNumber || searchInput || interviewStatus ? "&" : "?"
        }college_id=${collegeId}${slotType ? "&slot_type=" + slotType : ""}`,
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
      providesTags: ["interviewList"],
    }),
    deleteArchivedInterviewList: builder.mutation({
      query: ({ selectedArchivedList, collegeId }) => ({
        url: `/interview/delete_list/?college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedArchivedList,
      }),
      invalidatesTags: ["interviewList"],
    }),
    updateStudentInterviewStatus: builder.mutation({
      query: ({ formatData, collegeId }) => ({
        url: `/interview_list/change_interview_status_of_candidates/?is_approval_status=true&college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: formatData,
      }),
      invalidatesTags: ["particularStudentList", "selectedStudentApplications"],
    }),
    getAllApplicantsWhoAreNotInList: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        searchedText,
        course,
        specialization,
      }) => ({
        url: `/admin/all_applications_by_email/?search_input=${searchedText}&page_size=${rowsPerPage}&is_interview=false&course=${course}&specialization_name=${specialization}&page_num=${pageNumber}&college_id=${collegeId}`,
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
      providesTags: ["studentWhoAreNotInList"],
    }),
    getSlotOrPanelDetails: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        slotOrPanelId,
      }) => ({
        url: `/planner/get_slot_or_panel_data/?slot_or_panel_id=${slotOrPanelId}&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getPanelOrSlotDetails"],
    }),
    assignApplicantOrPanelistToSlot: builder.mutation({
      query: ({ slotId, applicationId, panelistId, collegeId }) => ({
        url: `/interview_list/assign_application/panelist?slot_id=${slotId}&${
          applicationId
            ? `application_id=${applicationId}&`
            : `panelist_id=${panelistId}&`
        }college_id=${collegeId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      // invalidatesTags: ["getPanelOrSlotDetails"],
    }),
    handleUnassignApplicantsFromSlots: builder.mutation({
      query: ({ selectedSlots, collegeId }) => ({
        url: `/planner/unassign_applicants_from_slots/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedSlots,
      }),
      invalidatesTags: ["getPanelOrSlotDetails"],
    }),
    handleUnassignSinglePanelistOfApplicant: builder.mutation({
      query: ({ applicationId, panelistId, slotId, collegeId }) => ({
        url: `/interview_list/unassigned_application?${
          applicationId
            ? `application_id=${applicationId}`
            : `panelist_id=${panelistId}`
        }&slot_id=${slotId}&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getPanelOrSlotDetails"],
    }),
    handleRescheduleApplicant: builder.mutation({
      query: ({ applicationId, originSlotId, reScheduleSlotId }) => ({
        url: `/interview_list/reschedule_interview?origin_slot_id=${originSlotId}&reschedule_slot_id=${reScheduleSlotId}&application_id=${applicationId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getPanelOrSlotDetails", "getStudentsInfo"],
    }),
    getCounselorDataList: builder.query({
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
      providesTags: ["updateCounselorDataList"],
    }),
    getEventTypesData: builder.query({
      query: ({ collegeId }) => ({
        url: `/event/types?college_id=${collegeId}`,
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
      providesTags: ["getEventType"],
    }),
    handleAddSecondaryEmail: builder.mutation({
      query: ({ dataValue, studentId, collegeId }) => ({
        url: `/lead/add_secondary_tertiary_email_phone/?student_id=${studentId}&secondary=${dataValue?.secondaryEmail}&set_as_default_secondary=${dataValue?.secondaryCheckbox}&tertiary=${dataValue?.tertiaryEmail}&set_as_default_tertiary=${dataValue?.tertiaryCheckBox}&phone=false&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [],
    }),
    handleAddSecondaryPhone: builder.mutation({
      query: ({ dataValue, studentId, collegeId }) => ({
        url: `/lead/add_secondary_tertiary_email_phone/?student_id=${studentId}&secondary=${dataValue?.secondaryPhoneNumber}&set_as_default_secondary=${dataValue?.secondaryPhoneNumberCheckbox}&tertiary=${dataValue?.tertiaryPhoneNumber}&set_as_default_tertiary=${dataValue?.tertiaryPhoneNumberCheckbox}&phone=true&college_id=${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [],
    }),
    handleUpdateResourceContent: builder.mutation({
      query: ({ collegeId, dataValue }) => ({
        url: `/resource/send_update_to_profile/?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: dataValue,
      }),
      invalidatesTags: ["getResourceContent"],
    }),
    getResourceContentData: builder.query({
      query: ({ updateId, collegeId, pageNumber, rowsPerPage }) => ({
        url: `/resource/get_user_updates/?${
          pageNumber ? `page_num=${pageNumber}&page_size=${rowsPerPage}` : ""
        }${updateId ? `update_id=${updateId}` : ""}&college_id=${collegeId}`,
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
      providesTags: ["getResourceContent"],
    }),
    getSourceWiseDataDetails: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        sourceWiseIndicator,
      }) => {
        // Build the base URL with required parameters
        const url = `/campaign_manager/source_performance_details/?college_id=${collegeId}&change_indicator=${
          sourceWiseIndicator || "last_7_days"
        }&page_num=${pageNumber}&page_size=${rowsPerPage}`;

        // Build the headers
        const headers = {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        };

        const finalPayload = {
          url,
          method: "POST",
          headers,
        };
        if (payload?.start_date) {
          finalPayload.data = payload;
        }

        return finalPayload;
      },
      keepUnusedDataFor: Infinity,
      providesTags: ["getSourceWiseData"],
    }),
    getSourceWiseOverlapDataDetails: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        sourceWiseIndicator,
      }) => ({
        url: `/campaign/source_wise_overlap?change_indicator=${
          sourceWiseIndicator ? sourceWiseIndicator : "last_7_days"
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
      providesTags: ["getSourceWiseOverLapData"],
    }),
    getUtmDataDetails: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        payload,
        sourceWiseIndicator,
        utmType,
      }) => ({
        url: `/campaign/utm_details?utm_type=${utmType}&change_indicator=${
          sourceWiseIndicator ? sourceWiseIndicator : "last_7_days"
        }&page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getUTMData"],
    }),
    getAllLanguagesList: builder.query({
      query: ({ collegeId }) => ({
        url: `/counselor/get_human_languages/${
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
    getAllUserData: builder.query({
      query: ({ collegeId }) => ({
        url: `/user/get_details/?download_data=false`,
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
      providesTags: ["getAllUserData"],
    }),
    getPendingChatLeadsData: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage }) => ({
        url: `/admin/get_untouched_leads?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getPendingChatLeads"],
    }),
    handleCreatePromoCode: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/promocode_vouchers/create_promocode/?college_id=${collegeId}`,
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
      invalidatesTags: ["getPromoCodeDetailsTable"],
    }),
    handleCreateVoucher: builder.mutation({
      query: ({ collegeId, payload }) => ({
        url: `/promocode_vouchers/create_voucher/?college_id=${collegeId}`,
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
      invalidatesTags: ["getVoucherDetailsTable"],
    }),
    getPromoCodeDetailsTable: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload }) => ({
        url: `/promocode_vouchers/get_promocodes/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      providesTags: ["getPromoCodeDetailsTable"],
    }),
    getAppliedUserPromoCode: builder.query({
      query: ({
        collegeId,
        pageNumber,
        rowsPerPage,
        promoCodeId,
        payload,
      }) => ({
        url: `/promocode_vouchers/get_applied_students/?page_num=${pageNumber}&page_size=${rowsPerPage}&promocode_id=${promoCodeId}&college_id=${collegeId}`,
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
        // "getPromoCodeDetailsTable"
      ],
    }),
    getVoucherDetailsTable: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, payload, featureKey }) => ({
        url: `/promocode_vouchers/get_vouchers/?page_num=${pageNumber}&page_size=${rowsPerPage}&college_id=${collegeId}`,
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
      keepUnusedDataFor: Infinity,
      providesTags: ["getVoucherDetailsTable"],
    }),
    updatePromoCodeInfo: builder.mutation({
      query: ({ collegeId, promoCodeId, payload }) => ({
        url: `/promocode_vouchers/update_promocode/?_id=${promoCodeId}&college_id=${collegeId}`,
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
      invalidatesTags: ["getPromoCodeDetailsTable"],
    }),
    getVoucherDetailsData: builder.query({
      query: ({ collegeId, pageNumber, rowsPerPage, voucherId, payload }) => ({
        url: `/promocode_vouchers/get_voucher_details/?page_num=${pageNumber}&page_size=${rowsPerPage}&voucher_id=${voucherId}&college_id=${collegeId}`,
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
    updateVoucherInfo: builder.mutation({
      query: ({ collegeId, voucherId, payload }) => ({
        url: `/promocode_vouchers/update_voucher/?voucher_id=${voucherId}&college_id=${collegeId}`,
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
      invalidatesTags: ["getVoucherDetailsTable"],
    }),
    deletePromoCodeInfo: builder.mutation({
      query: ({ collegeId, promoCode, payload }) => ({
        url: `/promocode_vouchers/delete_promocode_voucher/?promocode=${promoCode}&college_id=${collegeId}`,
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
      invalidatesTags: ["getPromoCodeDetailsTable", "getVoucherDetailsTable"],
    }),
    getAllTwelveBoardList: builder.query({
      query: ({ collegeId }) => ({
        url: `/student_user_crud/board_detail/${
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
    getCampaignManagerHeaderData: builder.query({
      query: ({ collegeId, payload, leadType, campaignIndicator }) => ({
        url: `/campaign/campaign_header?lead_type=${
          leadType ? leadType : "API"
        }&change_indicator=${
          campaignIndicator ? campaignIndicator : "last_7_days"
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
    }),
    createEmailTemplateCategory: builder.mutation({
      query: ({ collegeId, categoryName }) => ({
        url: `/templates/add_or_get_template_category?category_name=${categoryName}&college_id=${collegeId}`,
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
      invalidatesTags: ["EmailTemplateCategory"],
    }),
    getEmailTemplateCategory: builder.query({
      query: ({ collegeId }) => ({
        url: `/templates/add_or_get_template_category?college_id=${collegeId}`,
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
      providesTags: ["EmailTemplateCategory"],
    }),
    getEmailTemplateParticularRoleBaseMembers: builder.query({
      query: ({ collegeId, selectedRoleType }) => ({
        url: `/templates/particular_role_user_list?college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: selectedRoleType,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["ParticularRoleBaseMembers"],
    }),
    getEmailTemplateUserRole: builder.query({
      query: ({}) => ({
        url: `/templates/roles`,
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
      providesTags: ["UserRole"],
    }),
    manualAddPayment: builder.mutation({
      query: ({
        collegeId,
        applicationId,
        paymentId,
        selectedReason,
        note,
        season,
        paymentDevice,
        deviceOS,
        payload,
        name,
        courseName,
        sPceName,
        amount,
      }) => ({
        url: `/payments/manual_capture/?application_id=${applicationId}&payment_id=${paymentId}&reason_type=${selectedReason}${
          name ? `&name=${name}` : ""
        }${courseName ? `&course_name=${courseName}` : ""}${
          sPceName ? `&specialization_name=${sPceName}` : ""
        }${amount ? `&amount=${amount}` : ""}&reason_name=${selectedReason}${
          note ? `&note=${note}` : ""
        }${
          season ? `&season=${season}` : ""
        }&payment_device=${paymentDevice}&device_os=${deviceOS}&college_id=${collegeId}`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "multipart/form-data",
        },
        data: payload,
      }),
      keepUnusedDataFor: Infinity,
      // invalidatesTags: ["manualAddPayment"],
    }),
    manualAddPaymentSendMail: builder.mutation({
      query: ({ collegeId, applicationId, season }) => ({
        url: `/payments/send_receipt_through_mail/?application_id=${applicationId}${
          season ? `&season=${season}` : ""
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
      // keepUnusedDataFor: Infinity,
      // invalidatesTags: ["manualAddPaymentSendMail"],
    }),
    getAllOfflinePaymentList: builder.query({
      query: ({ collegeId, applicationId }) => ({
        url: `/payments/application/${applicationId}/?college_id=${collegeId}`,
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
      providesTags: ["AllOfflinePaymentList"],
    }),
    getParticularPaymentDetails: builder.query({
      query: ({ collegeId, paymentId }) => ({
        url: `/payments/${paymentId}/?college_id=${collegeId}`,
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
      providesTags: ["ParticularPaymentDetails"],
    }),
  }),
});

export const {
  useGetCampaignManagerHeaderDataQuery,
  useGetAllStateListQuery,
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetAllExtraFiltersListQuery,
  useGetListOfSchoolsQuery,
  useGetListOfUsersQuery,
  useGetTwelveBoardListQuery,
  useGetApplicationsBasedOnProgramQuery,
  useGetInterviewedCandidateHeaderDetailsQuery,
  useGetParticularStudentListQuery,
  useDeleteStudentFromListMutation,
  useUpdateInterviewListStatusMutation,
  useGetViewStudentDetailsHeaderDetailsQuery,
  useChangeStatusOfCandidatesMutation,
  useCreateInterviewListMutation,
  usePrefetch,
  useGetCityListQuery,
  useGetPendingApprovalApplicantsQuery,
  useGetReviewedApplicantsQuery,
  useGetAllModeratorListQuery,
  useGetAllSchoolListQuery,
  useGetSelectedStudentApplicationsQuery,
  useHandleSendForApprovalMutation,
  useHandleSearchStudentMutation,
  useHandleAddStudentToListMutation,
  useGetSlotOrPanelDetailsQuery,
  useAssignApplicantOrPanelistToSlotMutation,
  useHandleUnassignApplicantsFromSlotsMutation,
  useHandleUnassignSinglePanelistOfApplicantMutation,
  useHandleRescheduleApplicantMutation,
  useGetInterviewListHeaderDataQuery,
  useGetInterviewListDataQuery,
  useUpdateStudentInterviewStatusMutation,
  useGetAllApplicantsWhoAreNotInListQuery,
  useGetEventTypesDataQuery,
  useGetCounselorDataListQuery,
  useDeleteArchivedInterviewListMutation,
  useHandleUpdateResourceContentMutation,
  useGetResourceContentDataQuery,
  useHandleAddSecondaryEmailMutation,
  useHandleAddSecondaryPhoneMutation,
  useGetAllUserDataQuery,
  useGetAllLanguagesListQuery,
  useGetSourceWiseDataDetailsQuery,
  useGetSourceWiseOverlapDataDetailsQuery,
  useGetUtmDataDetailsQuery,
  useGetPendingChatLeadsDataQuery,
  useHandleCreatePromoCodeMutation,
  useGetPromoCodeDetailsTableQuery,
  useHandleCreateVoucherMutation,
  useGetAppliedUserPromoCodeQuery,
  useGetVoucherDetailsTableQuery,
  useUpdatePromoCodeInfoMutation,
  useGetVoucherDetailsDataQuery,
  useUpdateVoucherInfoMutation,
  useDeletePromoCodeInfoMutation,
  useGetAllTwelveBoardListQuery,
  useCreateEmailTemplateCategoryMutation,
  useGetEmailTemplateCategoryQuery,
  useGetEmailTemplateParticularRoleBaseMembersQuery,
  useGetEmailTemplateUserRoleQuery,
  useManualAddPaymentMutation,
  useManualAddPaymentSendMailMutation,
  useGetAllOfflinePaymentListQuery,
  useGetParticularPaymentDetailsQuery,
} = filterOptionData;
