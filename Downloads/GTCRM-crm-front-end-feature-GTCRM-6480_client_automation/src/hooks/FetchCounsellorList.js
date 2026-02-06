import { customFetch } from "../pages/StudentTotalQueries/helperFunction";

export const FetchCounsellorList = (
  token,
  isCounsellorOnHoliday,
  collegeId
) => {
  return customFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/counselor/college_counselor_list/?holiday=${isCounsellorOnHoliday}${
      collegeId ? "&college_id=" + collegeId : ""
    }`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    }
  );
};
