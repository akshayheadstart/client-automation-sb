import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { clientOnboardingPermissionKeys } from "../../utils/apiPermissionIds";

export const clientOnboardingSlice = createApi({
  reducerPath: "clientOnboarding",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: clientOnboardingPermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    createClientBasicInfo: builder.mutation({
      query: ({ clientInfo }) => ({
        url: `/client_automation/add_college`,
        method: "POST",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        data: clientInfo,
      }),
      keepUnusedDataFor: Infinity,
    }),
    getClientDefaultForm: builder.query({
      query: ({ url }) => {
        return {
          url: url,
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
        };
      },
      keepUnusedDataFor: Infinity,
      providesTags: ["clientDefaultForm"],
    }),
    saveSignupForm: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/client_automation/save_signup_form/${collegeId}`,
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
      invalidatesTags: ["clientDefaultForm"],
    }),
    getDefaultFormFields: builder.query({
      query: ({ pageNumber, rowsPerPage, searchText, clientId, collegeId }) => {
        const params = new URLSearchParams({
          pageNum: pageNumber,
          pageSize: rowsPerPage,
          search: searchText,
        });

        if (clientId) params.append("clientId", clientId);
        if (collegeId) params.append("collegeId", collegeId);

        return {
          url: `/client_student_dashboard/fetch_list_of_all_fields?${params.toString()}`,
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
        };
      },
      keepUnusedDataFor: Infinity,
      providesTags: ["clientDefaultFormFields"],
    }),
    formKeyNameValidation: builder.mutation({
      query: ({ keyName, clientId, collegeId }) => {
        const params = new URLSearchParams({ key_name: keyName });

        if (clientId) params.append("clientId", clientId);
        if (collegeId) params.append("collegeId", collegeId);

        return {
          url: `/master/validate_key_name?${params.toString()}`,
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
        };
      },
      keepUnusedDataFor: Infinity,
      invalidatesTags: [],
    }),
    saveClientConfigurationDetails: builder.mutation({
      query: ({ clientId, payload }) => ({
        url: `/client/${clientId}/configuration/add`,
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
      invalidatesTags: ["getClientConfigurationDetails"],
    }),
    saveCollegeCourseDetails: builder.mutation({
      query: ({ collegeId, payload, approverId }) => ({
        url: `/client_automation/${collegeId}/add_course${
          approverId ? `?approval_id=${approverId}` : ""
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
      invalidatesTags: ["ManagementDashboardData"],
    }),
    saveCollegeAdditionalDetails: builder.mutation({
      query: ({ collegeId, payload, approverId }) => ({
        url: `/college/additional_details?college_id=${collegeId}&short_version=true${
          approverId ? `&approval_id=${approverId}` : ""
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
      invalidatesTags: ["ManagementDashboardData"],
    }),
    getDefaultTemplates: builder.query({
      query: () => ({
        url: `/master/get_all_templates/`,
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
      providesTags: [],
    }),
    addCustomField: builder.mutation({
      query: ({ clientId, collegeId, payload, keyName }) => {
        const params = new URLSearchParams();
        if (clientId) params.append("client_id", clientId);
        if (collegeId) params.append("college_id", collegeId);
        if (keyName) params.append("existing_key_name", keyName);

        return {
          url: `/client_student_dashboard/custom_field/${
            params.toString() ? `?${params.toString()}` : ""
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
        };
      },
      invalidatesTags: ["clientDefaultFormFields"],
    }),
    createClient: builder.mutation({
      query: ({ payload }) => ({
        url: `/client/create/`,
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
      invalidatesTags: ["getAllClientsData"],
    }),
    validateRequestForm: builder.mutation({
      query: ({ url, clientId, collegeId, payload, approverId }) => {
        const params = new URLSearchParams();
        if (clientId) params.append("client_id", clientId);
        if (collegeId) params.append("college_id", collegeId);
        if (approverId) params.append("approval_id", approverId);

        return {
          url: `${url}?${params.toString()}`,
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
          data: payload,
        };
      },
      invalidatesTags: ["ManagementDashboardData"],
    }),
    createFormRequest: builder.mutation({
      query: ({ payload }) => ({
        url: `/approval/create_request`,
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
      invalidatesTags: [],
      invalidatesTags: ["ManagementDashboardData"],
    }),
    getAllFeatureLists: builder.query({
      query: ({ pageNumber, pageSize, collegeId, clientId }) => ({
        url: `/client_automation/get_screen_details?${
          collegeId ? `college_id=${collegeId}&` : ""
        }${
          clientId ? `client_id=${clientId}&` : ""
        }page_num=${pageNumber}&page_size=${pageSize}`,
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
      providesTags: [],
    }),
    addFeatureScreen: builder.mutation({
      query: ({ payload, clientId, collegeId, approverId }) => {
        const params = new URLSearchParams();
        if (clientId) params.append("client_id", clientId);
        if (collegeId) params.append("college_id", collegeId);
        if (approverId) params.append("approval_id", approverId);

        return {
          url: `/client_automation/add_features_screen?${params.toString()}`,
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
          data: payload,
        };
      },
      invalidatesTags: ["ManagementDashboardData"],
    }),
    getApprovalRequestById: builder.query({
      query: ({ approverId }) => ({
        url: `/approval/get_request_data/${approverId}`,
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
    updateCollegeStatus: builder.mutation({
      query: ({ approverId, status, payload }) => ({
        url: `/approval/update_status/${approverId}?status=${status}`,
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
      invalidatesTags: ["ManagementDashboardData"],
    }),
    deleteCustomField: builder.mutation({
      query: ({ keyName, clientId, collegeId }) => {
        const params = new URLSearchParams();
        if (clientId) params.append("client_id", clientId);
        if (collegeId) params.append("college_id", collegeId);

        return {
          url: `/client_student_dashboard/remove_custom_field?key_name=${keyName}${
            params.toString() ? `&${params.toString()}` : ""
          }`,
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: [],
      invalidatesTags: ["clientDefaultFormFields"],
    }),
    addMasterFeatureAndPermission: builder.mutation({
      query: ({ payload, dashboardType }) => ({
        url: `/master/add_master_screen?dashboard_type=${dashboardType}`,
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
      invalidatesTags: ["getMasterScreen"],
    }),
    getManagementDashboardData: builder.query({
      query: ({ pageNumber, rowsPerPage, payload }) => ({
        url: `/approval/get_all_approval_requests?page=${pageNumber}&limit=${rowsPerPage}`,
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
      providesTags: ["ManagementDashboardData"],
    }),
    getAccountManagerDashboardData: builder.query({
      query: ({ pageNumber, rowsPerPage }) => ({
        url: `/account_manager/get_all?page=${pageNumber}&limit=${rowsPerPage}`,
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
      providesTags: ["AccountManagerDashboardData"],
    }),
    getAllClientsData: builder.query({
      query: ({ pageNumber, rowsPerPage }) => ({
        url: `/client/all${pageNumber ? `?page=${pageNumber}&` : ""}${
          rowsPerPage ? `limit=${rowsPerPage}` : ""
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
      providesTags: ["getAllClientsData"],
    }),
    assignClient: builder.mutation({
      query: ({ accountManagerId, payload }) => ({
        url: `/account_manager/add_clients/${accountManagerId}`,
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
      invalidatesTags: ["AccountManagerDashboardData"],
    }),
    createManagerAccount: builder.mutation({
      query: ({ payload }) => ({
        url: `/account_manager/create`,
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
    createSuperAccountManager: builder.mutation({
      query: ({ payload }) => ({
        url: `/super_account_manager/create`,
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
    getManagementDashboardUrl: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/${collegeId}/urls`,
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
      providesTags: ["ManagementDashboardUrl"],
    }),
    updateCollegeStatus: builder.mutation({
      query: ({ approverId, status, payload }) => ({
        url: `/approval/update_status/${approverId}?status=${status}`,
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
      invalidatesTags: ["ManagementDashboardData"],
    }),
    getBillingData: builder.query({
      query: ({ payload }) => ({
        url: `/client_automation/get_billing_details`,
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
      providesTags: ["BillingData"],
    }),
    getAllRequestOf: builder.query({
      query: ({}) => ({
        url: `/approval/get_metadata`,
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
    updateColorThemes: builder.mutation({
      query: ({ collegeId, payload,approverId }) => ({
        url: `/client_automation/update_color_theme/?college_id=${collegeId}${approverId?`&approval_id=${approverId}`:""}`,
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
      invalidatesTags: ["ColorThemesData"],
    }),
    getListCollege: builder.query({
      query: ({ payload }) => ({
        url: `/college/get_colleges_by_client_ids/`,
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
    getUploadDocumentData: builder.query({
      query: ({ clientId, collegeId, courseId }) => ({
        url: `/college/fetch_additional_upload_fields?${
          clientId ? `client_id=${clientId}` : ""
        }${collegeId ? `&college_id=${collegeId}` : ""}${
          courseId ? `&course_id=${courseId}` : ""
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
      providesTags: ["UploadDocumentData"],
    }),
    deleteUploadDocumentField: builder.mutation({
      query: ({ keyName, clientId, collegeId }) => ({
        url: `/client_student_dashboard/remove_custom_field?key_name=${keyName}${
          clientId ? `&client_id=${clientId}` : ""
        }${collegeId ? `&college_id=${collegeId}` : ""}`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      invalidatesTags: ["UploadDocumentData"],
    }),
    updateUploadDocumentField: builder.mutation({
      query: ({ payload, clientId, collegeId }) => ({
        url: `/client_student_dashboard/custom_field/?${
          clientId ? `client_id=${clientId}` : ""
        }${collegeId ? `&college_id=${collegeId}` : ""}${
          payload?.key_name ? `&existing_key_name=${payload?.key_name}` : ""
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
      invalidatesTags: ["UploadDocumentData"],
    }),
    getFeatureScreen: builder.query({
      query: ({ collegeId, dashboardType }) => ({
        url: `/client_automation/get_feature_screen?college_id=${collegeId}&dashboard_type=${dashboardType}`,
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
      providesTags: ["getFeatureScreen"],
    }),
    getRoleWiseFeatureScreen: builder.query({
      query: ({ roleId, collegeId }) => ({
        url: `/role_permissions/get_specific_roles?role_id=${roleId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        params: { college_id: collegeId },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["getRoleWiseFeatureScreen"],
    }),
    updateSpecificFeature: builder.mutation({
      query: ({ collegeId, payload, dashboardType }) => ({
        url: `/client_automation/update_specific_fields?college_id=${collegeId}&dashboard_type=${dashboardType}`,
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
      invalidatesTags: ["getFeatureScreen"],
    }),
    updateFeatureOfRole: builder.mutation({
      query: ({ roleId, payload, collegeId }) => ({
        url: `/role_permissions/update_role_feature?role_id=${roleId}`,
        method: "PUT",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
        params: { college_id: collegeId },
        data: payload,
      }),
      invalidatesTags: ["getRoleWiseFeatureScreen"],
    }),
    getMasterScreen: builder.query({
      query: ({ dashboardType }) => ({
        url: `/master_stages/get_master_screen?dashboard_type=${dashboardType}`,
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
      providesTags: ["getFeatureScreen", "getMasterScreen"],
    }),
    updateMasterScreen: builder.mutation({
      query: ({ dashboardType, payload }) => ({
        url: `/master_stages/update_master_screen?dashboard_type=${dashboardType}`,
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
      invalidatesTags: ["getMasterScreen"],
    }),
    deleteMasterScreen: builder.mutation({
      query: ({ dashboardType, featureId }) => ({
        url: `/master_stages/delete_master_screen?feature_id=${featureId}&dashboard_type=${dashboardType}&whole_screen=false`,
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessToken"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["getMasterScreen"],
    }),
    createFeatureGroup: builder.mutation({
      query: ({ groupName, payload, update }) => ({
        url: `/role_permissions/create_feature_group?group_name=${groupName}${
          update ? `&update=${update}` : ""
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
      invalidatesTags: ["getFeatureGroup"],
    }),
    getFeatureGroups: builder.query({
      query: ({ pageNum, pageSize }) => ({
        url: `/role_permissions/get_all_group?page_num=${pageNum}&page_size=${pageSize}`,
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
      providesTags: ["getFeatureGroup"],
    }),
    updateFeatureGroups: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `/role_permissions/update_feature_group?group_id=${groupId}`,
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
      invalidatesTags: ["getFeatureGroup"],
    }),
    deleteFeatureGroup: builder.mutation({
      query: ({ groupId, featureId }) => ({
        url: `/role_permissions/delete_feature_group?_id=${groupId}${
          featureId ? `&feature_id=${featureId}` : ""
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
      invalidatesTags: [
        "getFeatureGroup",
        "getFeatureScreen",
        "getMasterScreen",
        "getSpecificFeatureDetails",
      ],
    }),
    assignRoleFeatureAndPermission: builder.mutation({
      query: ({ roleId, dashboardType, payload, collegeId }) => ({
        url: `/role_permissions/create_role_feature?role_id=${roleId}&dashboard_type=${dashboardType}${
          collegeId ? `&college_id=${collegeId}` : ""
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
      invalidatesTags: ["getRoleWiseFeatureScreen"],
    }),
    assignCollegeFeatureAndPermission: builder.mutation({
      query: ({ clientId, dashboardType, payload, collegeId }) => ({
        url: `/client_automation/add_features_screen?dashboard_type=${dashboardType}${
          clientId ? `client_id=${clientId}` : ""
        }${
          collegeId ? `&college_id=${collegeId}` : ""
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
      invalidatesTags: ["getFeatureScreen"],
    }),
    getUserManagerPermissionData: builder.query({
      query: ({ pageNumber, pageSize }) => ({
        url: `/user/get_all_users/?page_num=${pageNumber}&page_size=${pageSize}`,
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
      providesTags: ["UserManagerPermissionData"],
    }),
    getColorThemesData: builder.query({
      query: ({ collegeId }) => ({
        url: `/client_automation/get_color_theme/${collegeId}`,
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Cookies.get(
            "jwtTokenCredentialsAccessTokenStudent"
          )}`,
          "Content-Type": "application/json",
        },
      }),
      keepUnusedDataFor: Infinity,
      providesTags: ["ColorThemesData"],
    }),
    createUserRole: builder.mutation({
      query: ({ payload }) => ({
        url: `/role_permissions/create_role/`,
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
    addGroupPermissionForUser: builder.mutation({
      query: ({ payload }) => ({
        url: `/role_permissions/assigned_permissions`,
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
      invalidatesTags: ["getFeatureGroupsForParticularUser"],
    }),
    getSpecificGroupDetails: builder.query({
      query: ({ groupId }) => ({
        url: `/role_permissions/get_specific_group?role_id=${groupId}`,
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
      providesTags: ["getSpecificFeatureDetails"],
    }),
    getSuperAccountManagerList: builder.query({
      query: ({}) => ({
        url: `/super_account_manager/get_all`,
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
    getClientConfigurationDetails: builder.query({
      query: ({ clientId }) => ({
        url: `/client/${clientId}/configuration/get`,
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
      providesTags: ["getClientConfigurationDetails"],
    }),

    getAllCollegesList: builder.query({
      query: ({ pageNumber, rowsPerPage }) => ({
        url: `/college/get_all_colleges/${
          pageNumber ? `?page_num=${pageNumber}` : ""
        }${rowsPerPage ? `&page_size=${rowsPerPage}` : ""}`,
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
    getAssociatedPermissionsRole: builder.query({
      query: ({ scope }) => ({
        url: `/role_permissions/roles${scope ? `?scope=${scope}` : ""}`,
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
    getCollegeConfigurationDetails: builder.query({
      query: ({ collegeId }) => ({
        url: `/college/college_configuration?college_id=${collegeId}&short_version=false`,
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
      providesTags: ["getCollegeConfigurationDetails"],
    }),
    collegeConfigUpdate: builder.mutation({
      query: ({ payload, collegeId }) => ({
        url: `/college/add_college_configuration?college_id=${collegeId}&short_version=false`,
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
      invalidatesTags: [],
    }),
    getOnboardingStatus: builder.query({
      query: ({ clientId, collegeId }) => {
        const params = new URLSearchParams();
        if (clientId) params.append("client_id", clientId);
        if (collegeId) params.append("college_id", collegeId);

        return {
          url: `/college/onboarding_details/${
            params.toString() ? `?${params.toString()}` : ""
          }`,
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${Cookies.get(
              "jwtTokenCredentialsAccessToken"
            )}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: [],
    }),
    updatePricingScreen: builder.mutation({
      query: ({ payload, clientId, collegeId, type }) => ({
        url: `/client_automation/update_feature_screen?dashboard_type=${type}${
          clientId ? `&client_id=${clientId}` : ""
        }${collegeId ? `&college_id=${collegeId}` : ""}`,
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
      invalidatesTags: ["BillingData"],
    }),
    getFeatureGroupsForParticularUser: builder.query({
      query: ({ pageNum, pageSize, userId }) => ({
        url: `/role_permissions/user_group_details?user_id=${userId}&page_num=${pageNum}&page_size=${pageSize}`,
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
      providesTags: ["getFeatureGroupsForParticularUser"],
    }),
    removeGroupPermissionForUser: builder.mutation({
      query: ({ payload, userId }) => ({
        url: `/role_permissions/remove_feature_group?user_id=${userId}`,
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
      invalidatesTags: ["getFeatureGroupsForParticularUser"],
    }),
  }),
});

export const {
  useGetClientConfigurationDetailsQuery,
  useUpdateFeatureOfRoleMutation,
  useUpdateSpecificFeatureMutation,
  useGetRoleWiseFeatureScreenQuery,
  useGetFeatureScreenQuery,
  useAddMasterFeatureAndPermissionMutation,
  useAddFeatureScreenMutation,
  useGetAllFeatureListsQuery,
  useCreateClientMutation,
  useCreateClientBasicInfoMutation,
  useGetClientDefaultFormQuery,
  useSaveSignupFormMutation,
  useGetDefaultFormFieldsQuery,
  useFormKeyNameValidationMutation,
  usePrefetch,
  useSaveClientConfigurationDetailsMutation,
  useSaveCollegeCourseDetailsMutation,
  useSaveCollegeAdditionalDetailsMutation,
  useGetDefaultTemplatesQuery,
  useAddCustomFieldMutation,
  useValidateRequestFormMutation,
  useCreateFormRequestMutation,
  useGetAccountManagerDashboardDataQuery,
  useGetAllClientsDataQuery,
  useAssignClientMutation,
  useCreateManagerAccountMutation,
  useCreateSuperAccountManagerMutation,
  useGetManagementDashboardUrlQuery,
  useGetBillingDataQuery,
  useGetAllRequestOfQuery,
  useGetApprovalRequestByIdQuery,
  useGetManagementDashboardDataQuery,
  useUpdateCollegeStatusMutation,
  useGetUserManagerPermissionDataQuery,
  useGetColorThemesDataQuery,
  useCreateUserRoleMutation,
  useUpdateColorThemesMutation,
  useGetListCollegeQuery,
  useAddGroupPermissionForUserMutation,
  useDeleteUploadDocumentFieldMutation,
  useGetUploadDocumentDataQuery,
  useUpdateUploadDocumentFieldMutation,
  useDeleteCustomFieldMutation,
  useGetMasterScreenQuery,
  useUpdateMasterScreenMutation,
  useDeleteMasterScreenMutation,
  useCreateFeatureGroupMutation,
  useGetFeatureGroupsQuery,
  useDeleteFeatureGroupMutation,
  useUpdateFeatureGroupsMutation,
  useAssignRoleFeatureAndPermissionMutation,
  useAssignCollegeFeatureAndPermissionMutation,
  useGetSpecificGroupDetailsQuery,
  useGetSuperAccountManagerListQuery,
  useUpdatePricingScreenMutation,
  useGetAllCollegesListQuery,
  useGetCollegeConfigurationDetailsQuery,
  useCollegeConfigUpdateMutation,
  useGetOnboardingStatusQuery,
  useGetAssociatedPermissionsRoleQuery,
  useGetFeatureGroupsForParticularUserQuery,
  useRemoveGroupPermissionForUserMutation,
} = clientOnboardingSlice;
