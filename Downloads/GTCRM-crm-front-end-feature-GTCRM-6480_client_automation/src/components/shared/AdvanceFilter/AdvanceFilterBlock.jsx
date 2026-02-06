import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Divider,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import "../../../styles/AdvanceFilter.css";
import advFilterCloseIcon from "../../../icons/advance-filter-close-icon.svg";
import { CheckPicker, SelectPicker, Input, Checkbox, Button } from "rsuite";
import ToggleSwitch from "./ToggleSwitch";
import AdvanceFilterOperatorBox from "./AdvanceFilterOperatorBox";
import AdvanceFilterFieldNameBox from "./AdvanceFilterFieldNameBox";
import {
  useGetAdvanceFilterCategoriesDataQuery,
  useGetCounselorListQuery,
  useGetUserManagerDataQuery,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useDebounce from "../../../hooks/useDebounce";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import GetJsonDate from "../../../hooks/GetJsonDate";
import { fetchCities, fetchStates } from "../../../Redux/Slices/countrySlice";
import { useDispatch } from "react-redux";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import {
  useGetAllCourseListQuery,
  useGetAllSourceListQuery,
  useGetListOfSchoolsQuery,
  useGetListOfUsersQuery,
} from "../../../Redux/Slices/filterDataSlice";
import {
  organizeCounselorFilterOption,
  organizeCourseFilterOption,
  organizeSourceFilterOption,
} from "../../../helperFunctions/filterHelperFunction";
import { advFilterFieldsAPICall } from "../../../helperFunctions/advanceFilterHelperFunctions";
import { useLeadStageLabel } from "../../../hooks/useLeadStageLabel";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import useFetchUTMMedium from "../../../hooks/useFetchUTMMedium";
import useFetchCommonApi from "../../../hooks/useFetchCommonApi";
import TagAutoComplete from "../forms/TagAutoComplete";
import { emailValidation, isValidEmail } from "../../../utils/validation";

const footerStyles = {
  padding: "10px 2px",
  borderTop: "1px solid #e5e5e5",
};

const footerButtonStyle = {
  float: "right",
  marginRight: 10,
  marginTop: 2,
};

const AdvanceFilterBlock = ({
  block,
  filterBlocks,
  setFilterBlocks,
  deleteFilterBlock,
  handleFilterOptionUpdate,
  selectedCategoriesFields,
  setSelectedCategoriesFields,
  from,
  addFilterBlock,
  localStorageKey,
  preview,
}) => {
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const { leadStageList, leadStageObject, setSkipCallNameAndLabelApi } =
    useFetchCommonApi();

  const { id, blockCondition, filterOptions, next_action } = block;

  const dispatch = useDispatch();

  const checkPickerRef = useRef();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [errorTagField, setErrorTagField] = useState("");

  const nextActionList = [
    { label: "Communication", value: "communicationNode" },
    { label: "Add Tag", value: "tagNode" },
    { label: "Exit Condition", value: "exitNode" },
    { label: "Allocation", value: "allocationNode" },
    { label: "Lead Stage Change", value: "leadStageNode" },
  ];

  const [listOfCourses, setListOfCourses] = useState([]);

  const [selectedFilterValue, setSelectedFilterValue] = useState([]);

  const [leadStageLabelArray, setLeadStageLabelArray] = useState([]);
  const [sourceList, setSourceList] = useState([]);

  // filter option api calling state
  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callUtmMedium: undefined,
  });

  const { handleFilterListApiCall } = useCommonApiCalls();

  // get course list
  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    {
      skip: callFilterOptionApi.skipCourseApiCall,
    }
  );

  useEffect(() => {
    if (!callFilterOptionApi.skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];

      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setListOfCourses,
        null,
        organizeCourseFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListInfo, callFilterOptionApi.skipCourseApiCall]);

  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId: collegeId },
    {
      skip: callFilterOptionApi.skipSourceApiCall,
    }
  );

  //get source list
  useEffect(() => {
    if (!callFilterOptionApi.skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        null,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipSourceApiCall, sourceListInfo]);

  const [utmMedium, setUtmMedium] = useState([]);
  const fetchUtmMediumData = useFetchUTMMedium();

  // getting the UTM Medium list
  useEffect(() => {
    if (callFilterOptionApi.callUtmMedium !== undefined) {
      fetchUtmMediumData(
        selectedFilterValue,
        null,
        null,
        null,
        null,
        setUtmMedium
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.callUtmMedium]);

  const [listOfUsers, setListOfUsers] = useState([]);
  const [skipAssignUsersApiCall, setSkipAssignUsersApiCall] = useState(true);

  const {
    data: userManagerData,
    isSuccess: userManagerDataSuccess,
    error: userManagerError,
    isError: isUserManagerDataError,
  } = useGetUserManagerDataQuery(
    {
      payload: {
        user_types: [
          "college_super_admin",
          "college_admin",
          "college_head_counselor",
          "college_counselor",
        ],
      },
    },
    { skip: skipAssignUsersApiCall }
  );
  useEffect(() => {
    if (userManagerDataSuccess) {
      if (Array.isArray(userManagerData?.data?.[0])) {
        setListOfUsers(userManagerData?.data?.[0]);
      } else {
        throw new Error("get_details API response has changed");
      }
    }
    if (isUserManagerDataError) {
      setListOfUsers([]);
      if (userManagerError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (userManagerError?.data?.detail) {
        pushNotification("error", userManagerError?.data?.detail);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    userManagerError,
    isUserManagerDataError,
    userManagerDataSuccess,
    userManagerData,
  ]);

  const [listOfSchools, setListOfSchools] = useState([]);
  const [skipListOfSchoolsApiCall, setSkipListOfSchoolsApiCall] =
    useState(true);

  const {
    data: listOfSchoolsData,
    error: listOfSchoolError,
    isError: isListOfSchoolError,
    isSuccess: isListOfSchoolSuccess,
  } = useGetListOfSchoolsQuery(
    { collegeId },
    { skip: skipListOfSchoolsApiCall }
  );

  useEffect(() => {
    if (isListOfSchoolSuccess) {
      if (listOfSchoolsData?.data) {
        setListOfSchools(listOfSchoolsData?.data);
      } else {
        throw new Error("List of school API's response has been changed.");
      }
    } else if (isListOfSchoolError) {
      if (
        listOfSchoolError?.data?.detail === "Could not validate credentials"
      ) {
        window.location.reload();
      } else if (listOfSchoolError?.data?.detail) {
        pushNotification("error", listOfSchoolError?.data?.detail);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    listOfSchoolsData,
    listOfSchoolError,
    isListOfSchoolError,
    isListOfSchoolSuccess,
  ]);

  const [advFilterAPICallFunc, setAdvFilterAPICallFunc] = useState("");
  const [filterOptionIndex, setFilterOptionIndex] = useState(null);
  const [skipModeratorAPICall, setSkipModeratorAPICall] = useState(true);
  const [listOfModerators, setListOfModerators] = useState([]);
  const [skipHeadCounsellorAPICall, setSkipHeadCounsellorAPICall] =
    useState(true);
  const [listOfHeadCounsellor, setListOfHeadCounsellor] = useState([]);
  const [skipPanelistAPICall, setSkipPanelistAPICall] = useState(true);
  const [listOfPanelist, setListOfPanelist] = useState([]);
  const [counsellorList, setCounsellorList] = useState([]);

  const functions = {
    handleStateAPI: () => {
      dispatch(fetchStates("IN"));
    },
    handleCityAPI: (selectedState) => {
      dispatch(
        fetchCities({
          countryIso: "IN",
          stateIso: selectedState,
        })
      );
    },
    handleProgramAPI: () => {
      setCallFilterOptionApi((prev) => ({ ...prev, skipCourseApiCall: false }));
    },
    handleModeratorAPI: () => {
      setSkipModeratorAPICall(false);
    },
    handleLeadStageAPI: () => {
      setSkipCallNameAndLabelApi(false);
    },
    handleLeadSubStageAPI: () => {
      // setCallLeadSubStageApi(true);

      leadStageLabel(
        leadStageObject,
        selectedFilterValue,
        setLeadStageLabelArray
      );
    },
    handleHeadCounsellorAPI: () => {
      setSkipHeadCounsellorAPICall(false);
    },
    handleCounsellorAPI: () => {
      setCallFilterOptionApi((prev) => ({
        ...prev,
        skipCounselorApiCall: false,
      }));
    },
    handlePanelistAPI: () => {
      setSkipPanelistAPICall(false);
    },
    handleSourceAPI: () => {
      setCallFilterOptionApi((prev) => ({ ...prev, skipSourceApiCall: false }));
    },
    handleUtmMediumAPI: () => {
      setCallFilterOptionApi((prev) => ({
        ...prev,
        callUtmMedium: prev.callUtmMedium ? false : true,
      }));
    },
    handleAssignUsersAPI: () => {
      setSkipAssignUsersApiCall(false);
    },
    handleSchoolNamesAPI: () => {
      setSkipListOfSchoolsApiCall(false);
    },
  };

  const states = useSelector((state) => state?.country?.states);
  const cities = useSelector((state) => state?.country?.cities);

  const moderatorDetails = useGetListOfUsersQuery(
    {
      userType: "moderator",
      collegeId,
    },
    { skip: skipModeratorAPICall }
  );

  useEffect(() => {
    if (moderatorDetails.isSuccess) {
      if (Array.isArray(moderatorDetails.data.data[0])) {
        setListOfModerators(moderatorDetails.data.data[0]);
      } else {
        throw new Error("Moderator list API response has been changed.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderatorDetails]);

  const panelistDetails = useGetListOfUsersQuery(
    {
      userType: "panelist",
      collegeId,
    },
    { skip: skipPanelistAPICall }
  );

  useEffect(() => {
    if (panelistDetails.isSuccess) {
      if (Array.isArray(panelistDetails.data.data[0])) {
        setListOfPanelist(panelistDetails.data.data[0]);
      } else {
        throw new Error("Panelist list API response has been changed.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelistDetails]);

  const headCounsellorDetails = useGetListOfUsersQuery(
    {
      userType: "college_head_counselor",
      collegeId,
    },
    { skip: skipHeadCounsellorAPICall }
  );

  useEffect(() => {
    if (headCounsellorDetails.isSuccess) {
      if (Array.isArray(headCounsellorDetails.data.data[0])) {
        setListOfHeadCounsellor(headCounsellorDetails.data.data[0]);
      } else {
        throw new Error("head counsellor list API response has been changed.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headCounsellorDetails]);

  const leadStageLabel = useLeadStageLabel();

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: callFilterOptionApi.skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!callFilterOptionApi.skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        null,
        organizeCounselorFilterOption
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFilterOptionApi.skipCounselorApiCall, counselorListApiCallInfo]);

  useEffect(() => {
    if (advFilterAPICallFunc === "handleStateAPI") {
      const selectOptions = states;
      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: value.name,
            value: value.iso2,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleCityAPI") {
      const selectOptions = cities;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: value.name,
            value: value.name,
          };
        }),
        filterOptionIndex,
        id
      );
    }

    if (advFilterAPICallFunc === "handleProgramAPI") {
      const selectOptions = listOfCourses;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions,
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleModeratorAPI") {
      const selectOptions = listOfModerators;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: `${value?.first_name} ${value?.middle_name} ${value?.last_name}`,
            value: value?.id,
          };
        }),
        filterOptionIndex,
        id
      );
    }

    if (advFilterAPICallFunc === "handleHeadCounsellorAPI") {
      const selectOptions = listOfHeadCounsellor;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: `${value?.first_name} ${value?.middle_name} ${value?.last_name}`,
            value: value?.id,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleCounsellorAPI") {
      const selectOptions = counsellorList;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions,
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handlePanelistAPI") {
      const selectOptions = listOfPanelist;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: `${value?.first_name} ${value?.middle_name} ${value?.last_name}`,
            value: value?.id,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleLeadStageAPI") {
      const selectOptions = leadStageList;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: value?.label,
            value: value?.value,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleLeadSubStageAPI") {
      const selectOptions = leadStageLabelArray;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((value) => {
          return {
            label: value?.label,
            value: value?.value,
            role: value?.role,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleSourceAPI") {
      const selectOptions = sourceList;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions,
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleUtmMediumAPI") {
      const selectOptions = utmMedium;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions,
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleAssignUsersAPI") {
      const selectOptions = listOfUsers;

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((option) => {
          return {
            label: option?.user_name,
            value: option?.user_id,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    if (advFilterAPICallFunc === "handleSchoolNamesAPI") {
      const selectOptions = Object.keys(listOfSchools);

      handleFilterOptionUpdate(
        "value-list",
        selectOptions?.map((option) => {
          return {
            label: option,
            value: option,
          };
        }),
        filterOptionIndex,
        id
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    advFilterAPICallFunc,
    cities,
    filterOptionIndex,
    id,
    listOfCourses,
    states,
    listOfModerators,
    leadStageList,
    leadStageLabelArray,
    listOfHeadCounsellor,
    counsellorList,
    listOfPanelist,
    sourceList,
    utmMedium,
    listOfUsers,
    listOfSchools,
  ]);

  // Function to add a new filter option to the current block
  const handleAddFilterOption = () => {
    const updatedFilterBlocks = filterBlocks.map((block) => {
      if (block?.id === id) {
        return {
          ...block,
          filterOptions: [
            ...block?.filterOptions,
            {
              fieldName: "",
              operator: "",
              value: "",
              fieldType: "select",
            },
          ],
        };
      }
      return block;
    });

    setFilterBlocks(updatedFilterBlocks);
  };

  const pushNotification = useToasterHook();

  const [advFilterCategoryList, setAdvFilterCategoryList] = useState([]);

  const [avFilterCategorySearchText, setAvFilterCategorySearchText] =
    useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [
    advFilterCategoryInternalServerError,
    setAdvFilterCategoryInternalServerError,
  ] = useState(false);
  const [
    advFilterCategorySomethingWentWrong,
    setAdvFilterCategorySomethingWentWrong,
  ] = useState(false);

  const debouncedSearchText = useDebounce(avFilterCategorySearchText, 500);

  const {
    data: advFilterCategories,
    isSuccess,
    error,
    isError,
    isFetching: loadingAdvFilterCategories,
  } = useGetAdvanceFilterCategoriesDataQuery({
    collegeId: collegeId,
    categoryName: selectedCategory,
    searchText: debouncedSearchText,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(advFilterCategories?.data)) {
          if (
            !selectedCategory &&
            typeof advFilterCategories?.data?.[0] !== "object"
          ) {
            setAdvFilterCategoryList(advFilterCategories?.data);
          } else {
            setSelectedCategoriesFields(advFilterCategories?.data);
          }
        } else {
          throw new Error("Advance filter categories API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setAdvFilterCategoryInternalServerError,
            "",
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setAdvFilterCategorySomethingWentWrong,
        "",
        5000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, advFilterCategories]);

  useEffect(() => {
    if (advFilterCategoryList?.length > 0) {
      const categoryName = advFilterCategoryList[0];
      if (typeof categoryName !== "object") {
        setSelectedCategory(categoryName);
      }
    } else {
      setSelectedCategoriesFields([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advFilterCategoryList]);

  useEffect(() => {
    if (avFilterCategorySearchText) {
      setSelectedCategory("");
    } else {
      setSelectedCategory("");
    }
  }, [avFilterCategorySearchText]);

  const checkDisabled = (data) => {
    if (
      data?.operator?.toLowerCase() === "is blank" ||
      data?.operator?.toLowerCase() === "is not blank" ||
      data?.operator?.toLowerCase() === "is null"
    ) {
      return true;
    }
  };

  const handleAlertMessageOfAdvFilter = () => {
    filterBlocks?.forEach((block) => {
      block?.filterOptions?.forEach((option) => {
        if (option?.dependentFields) {
          // Check if all dependent fields have non-empty values
          const allDependenciesFulfilled = option?.dependentFields.every(
            (dependentField) => {
              const matchingOption = block?.filterOptions?.find(
                (opt) => opt?.fieldName === dependentField
              );
              return matchingOption?.value?.length > 0;
            }
          );

          // Set or clear the alert based according to dependency
          if (allDependenciesFulfilled) {
            option.alert = "";
          } else {
            const dependentFieldNames = option?.dependentFields?.join(", ");
            option.alert = `This field is dependent on ${dependentFieldNames}`;
          }
        }
      });
    });
  };

  const handleAlertMessageOfIfElseDrawer = () => {
    setFilterBlocks((prevFilterBlocks) =>
      prevFilterBlocks.map((block) => ({
        ...block,
        filterOptions: block?.filterOptions?.map((option) => {
          if (option?.dependentFields) {
            const allDependenciesFulfilled = option?.dependentFields.every(
              (dependentField) => {
                const matchingOption = block?.filterOptions?.find(
                  (opt) => opt?.fieldName === dependentField
                );
                return matchingOption?.value?.length > 0;
              }
            );

            if (allDependenciesFulfilled) {
              return { ...option, alert: "" };
            } else {
              const dependentFieldNames = option?.dependentFields?.join(", ");
              return {
                ...option,
                alert: `This field is dependent on ${dependentFieldNames}`,
              };
            }
          }
          return option;
        }),
      }))
    );
  };

  const findObjectByFieldName = (block, fieldName) => {
    return block?.filterOptions?.filter((obj) =>
      obj.dependentFields?.includes(fieldName)
    );
  };

  const handleDependentFields = (blockIdToFind, fieldNameToFind) => {
    setFilterBlocks((prevFilterBlocks) =>
      prevFilterBlocks?.map((block) => {
        if (block?.id === blockIdToFind) {
          const matchingObjects = findObjectByFieldName(block, fieldNameToFind);

          if (matchingObjects?.length > 0) {
            // Update values for the matching objects
            matchingObjects.forEach((matchingObject) => {
              matchingObject.value = "";
              if (matchingObject?.selectOptionFunction?.length > 0) {
                matchingObject.selectOption = "";
              }
            });
          }
        }
        return block;
      })
    );
  };

  return (
    <div>
      <Box
        className="advance-filter-first-block"
        sx={{
          border:
            from !== "automation-if-else-drawer" &&
            from !== "automation-exit-condition-drawer"
              ? blockCondition === "AND"
                ? "0.5px solid #039bdc"
                : "0.5px solid #0FABBD"
              : "none",
        }}
      >
        <Box className="advance-filter-first-block-header">
          {from !== "automation-exit-condition-drawer" && (
            <>
              {from === "automation-if-else-drawer" ? (
                <Typography className="automation-if-text">{`${blockCondition} {`}</Typography>
              ) : (
                <Box>
                  <ToggleSwitch
                    filterBlocks={filterBlocks}
                    setFilterBlocks={setFilterBlocks}
                    blockId={id}
                    localStorageKey={localStorageKey}
                    preview={preview}
                  />
                </Box>
              )}
            </>
          )}

          <Box>
            {!preview && (
              <>
                {id !== 1 &&
                  filterBlocks.length > 1 &&
                  blockCondition !== "Else" && (
                    <IconButton sx={{ p: 0 }}>
                      <img
                        src={advFilterCloseIcon}
                        alt="close-icon"
                        onClick={() => deleteFilterBlock(id)}
                      />
                    </IconButton>
                  )}
              </>
            )}

            {!preview && (
              <>
                {from !== "automation-exit-condition-drawer" && (
                  <>
                    {from === "automation-if-else-drawer" &&
                    blockCondition !== "Else"
                      ? filterBlocks?.length < 5 && (
                          <IconButton sx={{ p: 0.5 }}>
                            <AddCircleIcon
                              sx={{ color: "#008be2" }}
                              onClick={() => addFilterBlock()}
                            />
                          </IconButton>
                        )
                      : filterOptions?.length < 5 && (
                          <IconButton sx={{ p: 0.5 }}>
                            <AddCircleIcon
                              sx={{ color: "#008be2" }}
                              onClick={() => handleAddFilterOption()}
                            />
                          </IconButton>
                        )}
                  </>
                )}
              </>
            )}
          </Box>
        </Box>

        <Box>
          {filterOptions?.map(
            (filterOption, index) =>
              filterOption !== null && (
                <>
                  <Box className="adv-filter-block-inner-box" key={index}>
                    <Box className="adv-filter-field-operator-box">
                      <Box>
                        <AdvanceFilterFieldNameBox
                          selectedValue={filterOption?.fieldName}
                          handleFilterOptionUpdate={handleFilterOptionUpdate}
                          index={index}
                          blockId={id}
                          advFilterCategoryList={advFilterCategoryList}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          selectedCategoriesFields={selectedCategoriesFields}
                          advFilterCategoryInternalServerError={
                            advFilterCategoryInternalServerError
                          }
                          advFilterCategorySomethingWentWrong={
                            advFilterCategorySomethingWentWrong
                          }
                          avFilterCategorySearchText={
                            avFilterCategorySearchText
                          }
                          setAvFilterCategorySearchText={
                            setAvFilterCategorySearchText
                          }
                          loadingAdvFilterCategories={
                            loadingAdvFilterCategories
                          }
                          preview={preview}
                        />
                      </Box>

                      <AdvanceFilterOperatorBox
                        selectedValue={filterOption?.operator}
                        handleFilterOptionUpdate={handleFilterOptionUpdate}
                        options={
                          filterOption?.operators ? filterOption?.operators : []
                        }
                        index={index}
                        blockId={id}
                        from="operator"
                        preview={preview}
                      />
                    </Box>
                    {!preview && (
                      <Box>
                        {index !== 0 && (
                          <IconButton
                            onClick={() =>
                              handleFilterOptionUpdate(
                                "delete",
                                null,
                                index,
                                id
                              )
                            }
                            sx={{ p: 0 }}
                          >
                            <img src={advFilterCloseIcon} alt="close-icon" />
                          </IconButton>
                        )}
                      </Box>
                    )}
                  </Box>

                  {!filterOption?.fieldType && (
                    <SelectPicker
                      readOnly={preview}
                      data={
                        filterOption?.selectOption
                          ? filterOption?.selectOption
                          : []
                      }
                      style={{ width: "100%" }}
                      value={filterOption?.value}
                      onChange={(value) =>
                        handleFilterOptionUpdate("value", value, index, id)
                      }
                      placement="bottomEnd"
                    />
                  )}

                  {filterOption?.fieldType === "multiple-select" && (
                    <>
                      <CheckPicker
                        readOnly={preview}
                        disabled={checkDisabled(filterOption)}
                        groupBy={
                          (filterOption?.fieldName?.toLowerCase() ===
                            "lead sub stage" ||
                            filterOption?.fieldName?.toLowerCase() ===
                              "utm medium") &&
                          "role"
                        }
                        data={
                          filterOption?.selectOption
                            ? filterOption?.selectOption
                            : []
                        }
                        style={{ width: "100%" }}
                        value={
                          filterOption?.value?.length > 0
                            ? filterOption?.value
                            : []
                        }
                        onChange={(value) => {
                          handleFilterOptionUpdate("value", value, index, id);
                          setSelectedFilterValue(value);

                          if (
                            from === "automation-if-else-drawer" ||
                            from === "automation-exit-condition-drawer"
                          ) {
                            handleAlertMessageOfIfElseDrawer();
                          } else {
                            handleAlertMessageOfAdvFilter();
                          }

                          handleDependentFields(id, filterOption?.fieldName);
                        }}
                        onOpen={() => {
                          setFilterOptionIndex(index);
                          setAdvFilterAPICallFunc("");

                          if (!filterOption?.selectOption) {
                            advFilterFieldsAPICall(
                              filterBlocks,
                              filterOption,
                              functions,
                              setAdvFilterAPICallFunc
                            );
                          }
                        }}
                        placement="bottomEnd"
                        ref={checkPickerRef}
                        renderExtraFooter={() => (
                          <div style={footerStyles}>
                            <Checkbox
                              indeterminate={
                                filterOption?.value?.length > 0 &&
                                filterOption?.value?.length <
                                  filterOption?.selectOption?.length
                              }
                              checked={
                                filterOption?.value?.length > 0 &&
                                filterOption?.value?.length ===
                                  filterOption?.selectOption?.length
                              }
                              onChange={(value, checked) => {
                                handleFilterOptionUpdate(
                                  "value",
                                  checked
                                    ? filterOption?.selectOption?.map(
                                        (item) => item?.value
                                      )
                                    : [],
                                  index,
                                  id
                                );
                                setSelectedFilterValue(value);
                                handleDependentFields(
                                  id,
                                  filterOption?.fieldName
                                );
                                if (
                                  from === "automation-if-else-drawer" ||
                                  from === "automation-exit-condition-drawer"
                                ) {
                                  handleAlertMessageOfIfElseDrawer();
                                } else {
                                  handleAlertMessageOfAdvFilter();
                                }
                              }}
                            >
                              Select all
                            </Checkbox>

                            <Button
                              style={footerButtonStyle}
                              appearance="primary"
                              size="sm"
                              onClick={() => {
                                checkPickerRef.current.close();
                              }}
                            >
                              Ok
                            </Button>
                          </div>
                        )}
                      />
                    </>
                  )}

                  {filterOption?.fieldType === "select" && (
                    <SelectPicker
                      readOnly={preview}
                      disabled={checkDisabled(filterOption)}
                      onOpen={() => {
                        setFilterOptionIndex(index);
                        setAdvFilterAPICallFunc("");

                        if (!filterOption?.selectOption) {
                          advFilterFieldsAPICall(
                            filterBlocks,
                            filterOption,
                            functions,
                            setAdvFilterAPICallFunc
                          );
                        }
                      }}
                      data={
                        filterOption?.selectOption
                          ? filterOption?.selectOption
                          : []
                      }
                      style={{ width: "100%" }}
                      value={filterOption?.value}
                      onChange={(value) => {
                        handleFilterOptionUpdate("value", value, index, id);
                        setSelectedFilterValue(value);

                        if (
                          from === "automation-if-else-drawer" ||
                          from === "automation-exit-condition-drawer"
                        ) {
                          handleAlertMessageOfIfElseDrawer();
                        } else {
                          handleAlertMessageOfAdvFilter();
                        }

                        handleDependentFields(id, filterOption?.fieldName);
                      }}
                      placement="bottomEnd"
                    />
                  )}

                  {filterOption?.fieldType === "date" &&
                    (filterOption?.operator === "Between" ? (
                      <Box className="adv-filter-values-box">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            readOnly={preview}
                            disabled={checkDisabled(filterOption)}
                            views={["year", "month", "day"]}
                            slotProps={{
                              textField: { size: "small", fullWidth: true },
                            }}
                            value={
                              filterOption?.value?.start_date
                                ? new Date(filterOption?.value?.start_date)
                                : null
                            }
                            onChange={(date) => {
                              const formattedDate = new Date(date);
                              const valueField = [
                                formattedDate,
                                new Date(filterOption?.value?.end_date),
                              ];

                              handleFilterOptionUpdate(
                                "value",
                                JSON.parse(GetJsonDate(valueField)),
                                index,
                                id
                              );
                            }}
                          />
                        </LocalizationProvider>
                        -
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            readOnly={preview}
                            disabled={checkDisabled(filterOption)}
                            views={["year", "month", "day"]}
                            slotProps={{
                              textField: { size: "small", fullWidth: true },
                            }}
                            value={
                              filterOption?.value?.end_date
                                ? new Date(filterOption?.value?.end_date)
                                : null
                            }
                            onChange={(date) => {
                              const formattedDate = new Date(date);
                              const valueField = [
                                new Date(filterOption?.value?.start_date),
                                formattedDate,
                              ];

                              handleFilterOptionUpdate(
                                "value",
                                JSON.parse(GetJsonDate(valueField)),
                                index,
                                id
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Box>
                    ) : (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          readOnly={preview}
                          disabled={checkDisabled(filterOption)}
                          views={["year", "month", "day"]}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                          value={
                            filterOption?.value?.start_date
                              ? new Date(filterOption?.value?.start_date)
                              : null
                          }
                          onChange={(value) => {
                            const formattedDate = new Date(value);

                            handleFilterOptionUpdate(
                              "value",
                              JSON.parse(GetJsonDate([formattedDate])),
                              index,
                              id
                            );
                          }}
                        />
                      </LocalizationProvider>
                    ))}

                  {filterOption?.fieldType === "year" &&
                    (filterOption?.operator === "Between" ? (
                      <Box className="adv-filter-values-box">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            readOnly={preview}
                            disabled={checkDisabled(filterOption)}
                            disableFuture
                            views={["year"]}
                            slotProps={{
                              textField: { size: "small", width: "50%" },
                            }}
                            value={
                              filterOption?.value?.start_date
                                ? new Date(
                                    filterOption?.value?.start_date,
                                    0,
                                    1
                                  )
                                : null
                            }
                            onChange={(value) => {
                              const formattedDate = value.getFullYear();

                              const valueObj = {
                                start_date: formattedDate,
                                end_date: filterOption?.value?.end_date,
                              };

                              handleFilterOptionUpdate(
                                "value",
                                valueObj,
                                index,
                                id
                              );
                            }}
                          />
                        </LocalizationProvider>
                        -
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            readOnly={preview}
                            disabled={checkDisabled(filterOption)}
                            disableFuture
                            views={["year"]}
                            slotProps={{
                              textField: { size: "small", width: "50%" },
                            }}
                            value={
                              filterOption?.value?.end_date
                                ? new Date(filterOption?.value?.end_date, 0, 1)
                                : null
                            }
                            onChange={(value) => {
                              const formattedDate = value.getFullYear();

                              const valueObj = {
                                start_date: filterOption?.value?.start_date,
                                end_date: formattedDate,
                              };

                              handleFilterOptionUpdate(
                                "value",
                                valueObj,
                                index,
                                id
                              );
                            }}
                          />
                        </LocalizationProvider>
                      </Box>
                    ) : (
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          readOnly={preview}
                          disabled={checkDisabled(filterOption)}
                          disableFuture
                          views={["year"]}
                          slotProps={{
                            textField: { size: "small", fullWidth: true },
                          }}
                          value={
                            filterOption?.value?.start_date
                              ? new Date(filterOption?.value?.start_date, 0, 1)
                              : null
                          }
                          onChange={(value) => {
                            const formattedDate = value.getFullYear();

                            const valueObj = {
                              start_date: formattedDate,
                              end_date: "",
                            };

                            handleFilterOptionUpdate(
                              "value",
                              valueObj,
                              index,
                              id
                            );
                          }}
                        />
                      </LocalizationProvider>
                    ))}
                  {filterOption?.fieldType === "text" && (
                    <Input
                      readOnly={preview}
                      type="text"
                      disabled={checkDisabled(filterOption)}
                      placeholder="Enter text"
                      style={{ width: "100%" }}
                      value={filterOption.value}
                      onChange={(value) =>
                        handleFilterOptionUpdate("value", value, index, id)
                      }
                    />
                  )}
                  {filterOption?.fieldType === "email" && (
                    <Box>
                      <Autocomplete
                        disabled={checkDisabled(filterOption)}
                        readOnly={preview}
                        value={filterOption?.value}
                        sx={{
                          "& .MuiAutocomplete-tag": {
                            backgroundColor: "#5048E5",
                            color: "#fff",
                          },
                          "& .MuiAutocomplete-tag .MuiChip-deleteIcon": {
                            color: "#fff",
                          },
                          width: "100%",
                        }}
                        multiple
                        size="small"
                        id="tags-filled"
                        options={[]}
                        onChange={(_, newValue) => {
                          handleFilterOptionUpdate(
                            "value",
                            newValue,
                            index,
                            id
                          );
                        }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            disabled={checkDisabled(filterOption)}
                            type="email"
                            placeholder="Enter email id"
                            sx={{
                              width: "100%",
                            }}
                            {...params}
                            color="info"
                            InputProps={{
                              ...params?.InputProps,
                              classes: {
                                root: "tm-input-root",
                                notchedOutline: "tm-notched-outline",
                              },
                            }}
                            InputLabelProps={{
                              ...params?.InputLabelProps,
                              sx: {
                                color: "#8E8E93",
                                fontSize: "12px",
                                fontWeight: 400,
                                top: "2px",
                                "&.Mui-focused": {
                                  color: "#3498ff",
                                },
                              },
                            }}
                          />
                        )}
                      />

                      <FormHelperText
                        sx={{ ml: 1, color: "#ffa117" }}
                        variant="body2"
                      >
                        Click enter to add multiple email
                      </FormHelperText>
                    </Box>
                  )}
                  {filterOption?.fieldType === "number" &&
                    (filterOption?.operator === "Between" ? (
                      <Box className="adv-filter-values-box">
                        <Input
                          readOnly={preview}
                          type="number"
                          disabled={checkDisabled(filterOption)}
                          placeholder="Enter number"
                          style={{ width: "100%" }}
                          value={filterOption.value.value1}
                          onChange={(value) => {
                            const valueField = {
                              value1: value,
                              value2: filterOption.value.value2,
                            };
                            handleFilterOptionUpdate(
                              "value",
                              valueField,
                              index,
                              id
                            );
                          }}
                        />
                        -
                        <Input
                          readOnly={preview}
                          type="number"
                          disabled={checkDisabled(filterOption)}
                          placeholder="Enter number"
                          style={{ width: "100%" }}
                          value={filterOption.value.value2}
                          onChange={(value) => {
                            const valueField = {
                              value1: filterOption.value.value1,
                              value2: value,
                            };
                            handleFilterOptionUpdate(
                              "value",
                              valueField,
                              index,
                              id
                            );
                          }}
                        />
                      </Box>
                    ) : (
                      <Input
                        readOnly={preview}
                        type="number"
                        disabled={checkDisabled(filterOption)}
                        placeholder="Enter number"
                        style={{ width: "100%" }}
                        value={filterOption.value}
                        onChange={(value) =>
                          handleFilterOptionUpdate("value", value, index, id)
                        }
                      />
                    ))}
                  {filterOption?.fieldType === "minutes" && (
                    <Input
                      readOnly={preview}
                      type="number"
                      disabled={checkDisabled(filterOption)}
                      placeholder="Enter minutes"
                      style={{ width: "100%" }}
                      value={filterOption.value}
                      onChange={(value) =>
                        handleFilterOptionUpdate("value", value, index, id)
                      }
                    />
                  )}
                  {filterOption?.alert && (
                    <FormHelperText
                      sx={{ color: "#ffa117" }}
                      variant="subtitle1"
                    >
                      {filterOption?.alert}
                    </FormHelperText>
                  )}
                  {index !== filterOptions?.length - 1 && (
                    <Divider sx={{ mt: 1 }} />
                  )}
                </>
              )
          )}

          {from === "automation-if-else-drawer" &&
            (next_action?.length >= 0 || next_action === null) && (
              <Box sx={{ mt: 1 }}>
                <SelectPicker
                  readOnly={preview}
                  data={nextActionList}
                  style={{ width: "100%", marginBottom: "10px" }}
                  value={next_action}
                  onChange={(value) =>
                    handleFilterOptionUpdate(
                      "next-action-value",
                      value,
                      null,
                      id
                    )
                  }
                  placement="bottomEnd"
                  placeholder="Next Action"
                />
              </Box>
            )}

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {from === "automation-if-else-drawer" && (
              <Typography className="automation-if-text">{"}"}</Typography>
            )}
            {from === "automation-if-else-drawer" &&
              blockCondition === "Else" && (
                <Typography className="automation-else-block-default-text">
                  Default
                </Typography>
              )}

            {from === "automation-exit-condition-drawer" && (
              <Box className="automation-exit-condition-text-box">
                <Typography className="automation-exit-condition-text">
                  Exit Condition
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdvanceFilterBlock;
