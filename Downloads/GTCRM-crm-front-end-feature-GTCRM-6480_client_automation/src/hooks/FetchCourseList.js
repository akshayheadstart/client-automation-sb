import { customFetch } from "../pages/StudentTotalQueries/helperFunction";

export const fetchCourseList = (token, collegeId) => {
  return customFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/course/list/?show_disable_courses=true${
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

export const addCourse = (token, collegeId, payload) => {
  const url = `${
    import.meta.env.VITE_API_BASE_URL
  }/course/create/?college_id=${collegeId}`;
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return customFetch(url, options);
};

export const editCourse = (token, collegeId, courseId, payload) => {
  const url = `${
    import.meta.env.VITE_API_BASE_URL
  }/course/edit/?college_id=${collegeId}&course_id=${courseId}`;
  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return customFetch(url, options);
};
