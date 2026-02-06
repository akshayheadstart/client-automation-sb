import { createApi } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import axiosBaseQuery from "./axiosBaseQuery";
import { refreshTokenPermissionKeys } from "../../utils/apiPermissionIds";

export const tokenData = createApi({
  reducerPath: "refreshTokenConcepts",
  baseQuery: axiosBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_BASE_URL}`,
    featureKeys: refreshTokenPermissionKeys,
  }),
  tagTypes: [],

  endpoints: (builder) => ({
    checkTokenValidity: builder.query({
      query: () => ({
        url: `/oauth/tokeninfo?token=${Cookies.get(
          "jwtTokenCredentialsAccessToken"
        )}`,
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }),
      keepUnusedDataFor: 1,
    }),
    getAccessToken: builder.query({
      query: () => ({
        url: `/oauth/refresh_token/verify/?token=${Cookies.get(
          "jwtTokenCredentialsRefreshToken"
        )}`,
        method: "POST",
        headers: {
          accept: "application/json",
        },
      }),
    }),
  }),
});

export const { useGetAccessTokenQuery, useCheckTokenValidityQuery } = tokenData;
