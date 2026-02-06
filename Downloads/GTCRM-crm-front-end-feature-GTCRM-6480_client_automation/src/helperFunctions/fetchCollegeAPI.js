import { ApiCallHeaderAndBody } from "../hooks/ApiCallHeaderAndBody";
import { customFetch } from "../pages/StudentTotalQueries/helperFunction";

export async function fetchCollege(authToken, usingFor) {
  try {
    const response = await customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/college/list_college/${
        usingFor ? "?using_for=" + usingFor : ""
      }`,
      ApiCallHeaderAndBody(authToken, "GET"),
      usingFor ? false : true
    );

    const res = await response.json();
    return res;
  } catch (error) {
    throw error; // Propagate the error to the caller
  }
}
