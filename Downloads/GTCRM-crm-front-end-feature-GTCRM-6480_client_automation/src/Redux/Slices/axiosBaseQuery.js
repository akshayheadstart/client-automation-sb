import axios from "axios";
import { getFeatureKeyFromCookie } from "../../pages/StudentTotalQueries/helperFunction";

const axiosBaseQuery =
  ({ baseUrl, featureKeys } = { baseUrl: "" }) =>
  async ({ url, method, headers, data, params }, api) => {
    const featureKey = featureKeys?.[api?.endpoint];
    const featureKeyFromCookie = getFeatureKeyFromCookie();

    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        headers,
        data,
        params: {
          ...params,
          ...(!params?.feature_key
            ? featureKey
              ? { feature_key: featureKey }
              : featureKeyFromCookie
              ? { feature_key: featureKeyFromCookie }
              : {}
            : {}),
        },
      });
      return { data: result.data };
    } catch (axiosError) {
      let err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;
