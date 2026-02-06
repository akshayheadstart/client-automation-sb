import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useToasterHook from "../../hooks/useToasterHook";
import { useGetCollegeListQuery } from "../../Redux/Slices/applicationDataApiSlice";

const useCollegeIdHook = () => {
  const [collegeId, setCollegeId] = React.useState("");
  const [somethingWentWrongInColleges, setSomethingWentWrongInColleges] =
    React.useState(false);
  const navigate = useNavigate();
  const pushNotification = useToasterHook();

  const {
    data: listOfColleges,
    isSuccess,
    isError,
    error: getCollegeListError,
  } = useGetCollegeListQuery();

  React.useEffect(() => {
    /// Note : this api need to call in RTK query and invalidated by create client API
    try {
      if (isSuccess) {
        if (Array.isArray(listOfColleges?.data)) {
          const collegeList = [];
          listOfColleges?.data.forEach((college) => {
            collegeList.push({
              label: college.name,
              value: college.id,
            });
          });

          setCollegeId(collegeList[0]?.value);
          Cookies.set("collegeId", collegeList[0]?.value, {
            expires: 30,
          });
        } else {
          throw new Error("All application manager API response has changed");
        }
      } else if (isError) {
        if (
          getCollegeListError?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (getCollegeListError?.data?.detail) {
          pushNotification("error", getCollegeListError?.data?.detail);
        }
        if (getCollegeListError?.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setSomethingWentWrongInColleges(true);
      setTimeout(() => {
        navigate("/");
      }, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listOfColleges, isSuccess, isError, getCollegeListError]);

  return {
    collegeId,
    somethingWentWrongInColleges,
  };
};

export default useCollegeIdHook;
