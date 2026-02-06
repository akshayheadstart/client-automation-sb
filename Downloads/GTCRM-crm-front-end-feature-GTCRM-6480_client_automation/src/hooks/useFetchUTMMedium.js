import { useContext } from "react";
import { ApiCallHeaderAndBody } from "./ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { DashboradDataContext } from "../store/contexts/DashboardDataContext";
import useToasterHook from "./useToasterHook";
import { handleSomethingWentWrong } from "../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../utils/handleInternalServerError";
import { useSelector } from "react-redux";
import { customFetch } from "../pages/StudentTotalQueries/helperFunction";

const useFetchUTMMedium = () => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const pushNotification = useToasterHook();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const fetchUtmMediumData = (
    sources,
    setHide,
    setLoading,
    setSomethingWentWrong,
    setInternalServerError,
    setUtmMedium
  ) => {
    setLoading && setLoading((prev) => ({ ...prev, utmMediumData: true }));
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/college/utm_medium_by_source_names/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(sources))
    )
      .then((result) => result.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.message) {
          try {
            if (Array.isArray(data?.data)) {
              const utmDetails = data.data.map((utm) => {
                const modifiedData = {
                  label: utm?.label,
                  role: utm?.role,
                  value: {
                    source_name: utm?.value?.source,
                    utm_medium: utm?.value?.utm_medium,
                  },
                };
                if (!modifiedData?.label) {
                  modifiedData.label = "NA";
                }
                return modifiedData;
              });
              setUtmMedium(utmDetails);
            } else {
              throw new Error("UTM Medium list api response has been changed.");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            setHide(true);
            handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
          }
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch(() => {
        setHide(true);
        handleInternalServerError(setInternalServerError, "", 5000);
      })
      .finally(() => setLoading((prev) => ({ ...prev, utmMediumData: false })));
  };
  return fetchUtmMediumData;
};

export default useFetchUTMMedium;
