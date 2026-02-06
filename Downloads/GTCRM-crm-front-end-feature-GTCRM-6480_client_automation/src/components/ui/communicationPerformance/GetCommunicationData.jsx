import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

export const getCommunicationData = (
  collegeId,
  setData,
  setLoading,
  actions,
  setHide,
  setInternalServerError,
  release,
  indicator
) => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  setLoading(true);
  customFetch(
    `${
      import.meta.env.VITE_API_BASE_URL
    }/college/communication_performance_dashboard/?${
      release ? `release_type=${release}&` : ""
    }${indicator ? `change_indicator=${indicator}&` : ""}${
      collegeId ? "college_id=" + collegeId : ""
    }`,
    ApiCallHeaderAndBody(token, "GET")
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (data?.data) {
        setData(data?.data);
      } else if (data?.detail) {
        actions.pushNotification("error", data.detail);
      }
    })
    .catch(() => {
      handleInternalServerError(setInternalServerError, setHide, 5000);
    })
    .finally(() => setLoading(false));
};
