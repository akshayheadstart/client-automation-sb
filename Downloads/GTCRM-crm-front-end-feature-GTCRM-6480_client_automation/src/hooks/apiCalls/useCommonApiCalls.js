import useToasterHook from "../useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ApiCallHeaderAndBody } from "../ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import {
  useChangeStatusOfCandidatesMutation,
  useHandleSearchStudentMutation,
} from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { customFetch } from "../../pages/StudentTotalQueries/helperFunction";

export const useCommonApiCalls = () => {
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  /*
      Overview of the common filter list api call
  
      1. data > It represents the filter data. (required)
      2. apiCallInfo > It is the return object of RTK query api call . (required).
      3. setOptionsList > This is the state to set all the filter list. (required)
      4. setHideFilterOption > This is the state to hide the filter if in case there has any errors. (required)
      5. modifyFilterOptions > This is a function to make organized the filter list in format like ([{label: "name", value: "value"}]). (required)
      6. setCollegeId > In case if you want to set college ID from the response of filter list api, you can use it. (optional)
  */

  const handleFilterListApiCall = (
    data,
    apiCallInfo,
    setOptionsList,
    setHideFilterOption,
    modifyFilterOptions,
    setCollegeId,
    setCounsellorListInternalServerError,
    setSomethingWentWrongInCounsellorList
  ) => {
    const { isSuccess, error, isError } = apiCallInfo;
    try {
      if (isSuccess) {
        if (Array.isArray(data)) {
          const listOfOptions = modifyFilterOptions
            ? modifyFilterOptions(data)
            : data;
          setOptionsList(listOfOptions);
          setCollegeId && setCollegeId(data[0]?.associated_colleges[0]);
        } else {
          throw new Error(
            "In counsellor wise filter college_counselor_list API response has changed"
          );
        }
      } else if (isError) {
        setHideFilterOption && setHideFilterOption(true);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          setHideFilterOption && setHideFilterOption(true);
          setCounsellorListInternalServerError &&
            setCounsellorListInternalServerError(true);
        }
      }
    } catch (error) {
      setSomethingWentWrongInCounsellorList &&
        setSomethingWentWrongInCounsellorList(true);

      setApiResponseChangeMessage(error);
      setHideFilterOption(true);
    }
  };
  const handleExtraFilterListApiCall = (
    apiCallInfo,
    setHideExtraFilterList,
    setAllExtraFiltersList
  ) => {
    const { data, isSuccess, error, isError } = apiCallInfo;

    try {
      if (isSuccess) {
        if (Array.isArray(data.data)) {
          const modifiedResult = [];
          data.data.forEach((item) => {
            const tempData = {
              labelText: item.field_name,
              data: item.select_option.map((option) => ({
                label: option,
                value: {
                  field_name: item.field_name,
                  value: option,
                },
              })),
            };
            modifiedResult.push(tempData);
          });
          setAllExtraFiltersList(modifiedResult);
        } else {
          throw new Error(
            "In the lead manager, extra filter API response has changed"
          );
        }
      } else if (isError) {
        setHideExtraFilterList(true);
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          setHideExtraFilterList(true);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      setHideExtraFilterList(true);
    }
  };

  const getSavedFiltersList = (params) => {
    const {
      apiURL,
      setListOfFilters,
      setFilterSaveSomethingWentWrong,
      setFilterSaveInternalServerError,
      setSavedFilterLoading,
    } = params;

    customFetch(apiURL, ApiCallHeaderAndBody(token, "GET"))
      .then((response) => response.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.data) {
          try {
            if (Array.isArray(data.data)) {
              setListOfFilters(
                data.data.reverse()?.map((filter) => ({
                  label: filter?.name,
                  value: JSON.stringify(filter),
                }))
              );
            } else {
              throw new Error(
                "Admin filter GET api response has been changed."
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setFilterSaveSomethingWentWrong, "", 5000);
          }
        } else if (data.detail) {
          pushNotification("error", data.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(setFilterSaveInternalServerError, "", 5000);
      })
      .finally(() => setSavedFilterLoading(false));
  };

  const handleDeleteSavedFilter = (params) => {
    const {
      apiURL,
      setCallFilterSaveApi,
      setListOfFilters,
      resetFilterOptions,
      setFilterPayload,
      setDeleteFilterLoading,
      setOpenDeleteFilterDialog,
      setFilterSaveInternalServerError,
      setFilterSaveSomethingWentWrong,
    } = params;

    customFetch(apiURL, ApiCallHeaderAndBody(token, "DELETE"))
      .then((response) => response.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.message) {
          try {
            if (typeof data.message === "string") {
              pushNotification("success", data.message);
              setCallFilterSaveApi(false);
              setListOfFilters([]);
              resetFilterOptions();
              setFilterPayload("");
            } else {
              throw new Error(
                "All application filter delete api response has been changed."
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setFilterSaveSomethingWentWrong, "", 5000);
          }
        } else if (data.detail) {
          pushNotification("error", data.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(setFilterSaveInternalServerError, "", 5000);
      })
      .finally(() => {
        setOpenDeleteFilterDialog(false);
        setFilterPayload("");
        setDeleteFilterLoading(false);
      });
  };

  const handleAddSavedFilter = (params) => {
    const {
      apiURL,
      payload,
      setCallFilterSaveApi,
      setListOfFilters,
      setFilterSaveSomethingWentWrong,
      setFilterDataLoading,
      setOpenSaveFilterDialog,
      setFilterSaveName,
      setFilterSaveInternalServerError,
    } = params;

    customFetch(
      apiURL,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((response) => response.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data.message) {
          try {
            if (typeof data.message === "string") {
              pushNotification("success", data.message);
              setCallFilterSaveApi(false);
              setListOfFilters([]);
            } else {
              throw new Error(
                "All application filter save api response has been changed."
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setFilterSaveSomethingWentWrong, "", 5000);
          }
        } else if (data.detail) {
          pushNotification("error", data?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(setFilterSaveInternalServerError, "", 5000);
      })
      .finally(() => {
        setFilterSaveName("");
        setOpenSaveFilterDialog(false);
        setFilterDataLoading(false);
      });
  };

  const [changeStatusOfCandidates] = useChangeStatusOfCandidatesMutation();

  const handleChangeStatusApiCall = (params) => {
    const {
      approvalStatus,
      payload,
      collegeId,
      setLoadingChangeStatus,
      setStudentListSomethingWentWrong,
      setStudentListInternalServerError,
      setOpenConfirmationDialog,
      handleRedirect,
    } = params;
    setLoadingChangeStatus(true);
    if (import.meta.env.VITE_ACCOUNT_TYPE === "demo") {
      pushNotification("success", `Successfully sent mail !`);
      setLoadingChangeStatus(false);
      setOpenConfirmationDialog && setOpenConfirmationDialog(false);
      handleRedirect && handleRedirect();
    } else {
      changeStatusOfCandidates({
        collegeId,
        payload,
        approvalStatus,
      })
        .unwrap()
        .then((data) => {
          try {
            if (data.message) {
              pushNotification("success", data.message);
            } else {
              throw new Error("Status change API response has been changed.");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setStudentListSomethingWentWrong,
              "",
              10000
            );
          }
        })
        .catch((error) => {
          if (error?.data.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data.detail) {
            pushNotification("error", error?.data.detail);
          } else {
            handleInternalServerError(
              setStudentListInternalServerError,
              "",
              10000
            );
          }
        })
        .finally(() => {
          setLoadingChangeStatus(false);
          setOpenConfirmationDialog && setOpenConfirmationDialog(false);
          handleRedirect && handleRedirect();
        });
    }
  };

  const [handleSearchStudent] = useHandleSearchStudentMutation();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const handleSearchStudentApiCall = (params) => {
    const {
      searchText,
      interviewStatus,
      interviewListId,
      setLoadingSearchStudent,
      setSearchedData,
      setInternalServerError,
      setSomethingWentWrong,
    } = params || {};
    setLoadingSearchStudent(true);
    handleSearchStudent({
      searchText,
      interviewStatus,
      interviewListId,
      collegeId,
    })
      .unwrap()
      .then((response) => {
        try {
          if (Array.isArray(response?.data)) {
            setSearchedData(response?.data);
          } else if (response?.message) {
            pushNotification("error", response?.message);
          } else {
            throw new Error(
              "Search student details API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setInternalServerError, "", 10000);
        }
      })
      .finally(() => setLoadingSearchStudent(false));
  };

  return {
    handleFilterListApiCall,
    handleExtraFilterListApiCall,
    getSavedFiltersList,
    handleDeleteSavedFilter,
    handleAddSavedFilter,
    handleChangeStatusApiCall,
    handleSearchStudentApiCall,
  };
};
