import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CreateInterviewHeaderFilter from "../shared/CreateInterviewRoomList/CreateInterviewHeaderFilter";
import AllTheFiltersList from "../shared/CreateInterviewRoomList/AllTheFilterList";
import StudentTableOfCreatedList from "../shared/CreateInterviewRoomList/StudentTableOfCreatedList";
import { Drawer } from "rsuite";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CreateInterviewHeaderViewAfterSelectFilter from "../shared/CreateInterviewRoomList/CreateInterviewHeaderViewAfterSelectFilter";
import {
  useCreateInterviewListMutation,
  useGetAllSourceListQuery,
  useGetAllStateListQuery,
  useGetApplicationsBasedOnProgramQuery,
  useGetCityListQuery,
  useGetListOfSchoolsQuery,
  useGetListOfUsersQuery,
  useGetTwelveBoardListQuery,
  usePrefetch,
} from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import {
  applicationStage,
  twelveMarksList,
} from "../../constants/LeadStageList";
import nationalityInfo from "../../constants/nationality";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { organizeSourceFilterOption } from "../../helperFunctions/filterHelperFunction";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import DeleteDialogue from "../shared/Dialogs/DeleteDialogue";
import { useMemo } from "react";
import { createPreferenceList } from "../../pages/StudentTotalQueries/helperFunction";
const CreateInterviewDrawer = ({
  openCreateInterview,
  setOpenCreateInterview,
}) => {
  const systemPreference = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.system_preference
  );
  const listOfPreference = createPreferenceList(
    systemPreference?.preference_count
  );
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [selectedApplicationStage, setSelectedApplicationStage] = useState("");
  const [twelveBoard, setTwelveBoard] = useState([]);
  const [twelveMarks, steTwelveMarks] = useState([]);
  const [UGMarks, setUGMarks] = useState([]);
  const [experience, setExperience] = useState([]);
  const [PGMarks, setPGMarks] = useState([]);
  const [PGUniversity, setPGUniversity] = useState([]);
  const [source, setSource] = useState([]);
  const [examName, setExamName] = useState([]);
  const [examScore, setExamScore] = useState([]);
  const [category, setCategory] = useState([]);
  const [nationality, setNationality] = useState([]);
  const [appliedFilter, setAppliedFilter] = useState(false);
  const [clickedFilterIcon, setClickedFilterIcon] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState([]);

  const [openCreateListDialog, setOpenCreateListDialog] = useState(false);

  const [listOfSchools, setListOfSchools] = useState({});
  const [listOfSchoolInternalServerError, setListOfSchoolInternalServerError] =
    useState(false);
  const [listOfSchoolSomethingWentWrong, setListOfSchoolSomethingWentWrong] =
    useState(false);
  const [hideListOfSchool, setHideListOfSchool] = useState(false);

  // states of the header details
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedProgram, setSelectedProgram] = useState({ course_name: "" });
  const [selectedSpecialization, setSelectedSpecialization] = useState({
    spec_name: "",
  });
  const [listName, setListName] = useState("");
  const [listOfModerators, setListOfModerators] = useState([]);
  const [selectedModerator, setSelectedModerator] = useState("");
  const [descriptions, setDescriptions] = useState("");

  const [skipStateApiCall, setSkipStateApiCall] = useState(true);
  const [skipCityApiCall, setSkipCityApiCall] = useState(true);
  const [skipSourceApiCall, setSkipSourceApiCall] = useState(true);
  const [skipTwelveBoardApiCall, setSkipTwelveBoardApiCall] = useState(true);
  const [hideStateList, setHideStateList] = useState(false);
  const [hideCity, setHideCity] = useState(false);
  const [hideSourceList, setHideSourceList] = useState(false);
  const [hideTwelveBoardList, setHideTwelveBoardList] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [sourceList, setSourceList] = useState([]);
  const [twelveBoardList, setTwelveBoardList] = useState([]);

  const [skipApplicationDetailsApiCall, setSkipApplicationDetailsApiCall] =
    useState(true);

  const [pickTop, setPickTop] = useState(null);
  const [pgMarksSort, setPgMarksSort] = useState(null);
  const [ugMarksSort, setUgMarksSort] = useState(null);
  const [examScoreSort, setExamScoreSort] = useState(null);
  const [examNameSort, setExamNameSort] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [applicationsListBasedOnProgram, setApplicationsBasedOnProgram] =
    useState([]);
  const [totalApplications, setTotalApplications] = useState("");

  const [payloadOfPrograms, setPayloadOfPrograms] = useState({});
  const [loadingCreateList, setLoadingCreateList] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [removeStudentIds, setRemoveStudentIds] = useState([]);
  const [finalRemoveIds, setFinalRemoveIds] = useState([]);

  //delete student
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const sortingStates = {
    pgMarksSort,
    setPgMarksSort,
    ugMarksSort,
    setUgMarksSort,
    examScoreSort,
    setExamScoreSort,
    examNameSort,
    setExamNameSort,
  };

  const headerFieldsStates = {
    selectedSchool,
    setSelectedSchool,
    selectedProgram,
    setSelectedProgram,
    selectedSpecialization,
    setSelectedSpecialization,
    listName,
    setListName,
    selectedModerator,
    setSelectedModerator,
    descriptions,
    setDescriptions,
    listOfModerators,
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleCloseDrawer = () => {
    setOpenCreateInterview(false);
    setAppliedFilter(false);
    setClickedFilterIcon(false);
    setOpenCreateListDialog(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const pushNotification = useToasterHook();

  const handleError = (error) => {
    if (error?.data?.detail === "Could not validate credentials") {
      window.location.reload();
    } else if (error?.data?.detail) {
      pushNotification("error", error?.data?.detail);
    }
    if (error?.status === 500) {
      handleInternalServerError(
        setListOfSchoolInternalServerError,
        setHideListOfSchool,
        10000
      );
    }
  };

  const { data, error, isError, isFetching, isSuccess } =
    useGetListOfSchoolsQuery({ collegeId });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.data) {
          setListOfSchools(data?.data);
        } else {
          throw new Error("List of school API's response has been changed.");
        }
      } else if (isError) {
        handleError(error);
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setListOfSchoolSomethingWentWrong,
        setHideListOfSchool,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, isError, isSuccess]);

  const moderatorDetails = useGetListOfUsersQuery({
    userType: "moderator",
    collegeId,
  });
  useEffect(() => {
    try {
      if (moderatorDetails.isSuccess) {
        if (Array.isArray(moderatorDetails.data.data[0])) {
          setListOfModerators(moderatorDetails.data.data[0]);
        } else {
          throw new Error("Moderator list API response has been changed.");
        }
      } else if (moderatorDetails.isError) {
        handleError(moderatorDetails.error);
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setListOfSchoolSomethingWentWrong,
        setHideListOfSchool,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moderatorDetails]);

  const { handleFilterListApiCall } = useCommonApiCalls();
  //getting state list
  const stateListInfo = useGetAllStateListQuery(undefined, {
    skip: skipStateApiCall,
  });

  useEffect(() => {
    if (!skipStateApiCall) {
      const stateList = stateListInfo.data;
      const modifyFilterOptions = (data) => {
        return data.map((item) => ({ label: item.name, value: item.iso2 }));
      };
      handleFilterListApiCall(
        stateList,
        stateListInfo,
        setStateList,
        setHideStateList,
        modifyFilterOptions
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipStateApiCall, stateListInfo]);

  const cityListInfo = useGetCityListQuery(
    { payload: { country_code: "IN", state_code: state } },
    { skip: skipCityApiCall }
  );
  // get city list
  useEffect(() => {
    if (!skipCityApiCall) {
      if (state?.length) {
        const cityList = cityListInfo.data?.data;
        handleFilterListApiCall(
          cityList,
          cityListInfo,
          setCityList,
          setHideCity
        );
      } else {
        setCityList([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityListInfo, skipCityApiCall]);

  //get source list
  const sourceListInfo = useGetAllSourceListQuery(
    { collegeId },
    {
      skip: skipSourceApiCall,
    }
  );
  useEffect(() => {
    if (!skipSourceApiCall) {
      const sourceList = sourceListInfo?.data?.data[0];

      handleFilterListApiCall(
        sourceList,
        sourceListInfo,
        setSourceList,
        setHideSourceList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipSourceApiCall, sourceListInfo]);

  //get twelve board list
  const twelveBoardListInfo = useGetTwelveBoardListQuery(
    { collegeId },
    {
      skip: skipTwelveBoardApiCall,
    }
  );

  useEffect(() => {
    if (!skipTwelveBoardApiCall) {
      const twelveBoardList =
        twelveBoardListInfo?.data?.data[0]?.[0]?.inter_board_name;

      handleFilterListApiCall(
        twelveBoardList,
        twelveBoardListInfo,
        setTwelveBoardList,
        setHideTwelveBoardList,
        organizeSourceFilterOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipTwelveBoardApiCall, twelveBoardListInfo]);

  let filterPayload = {
    remove_application_ids: finalRemoveIds,
    state_code: state,
    city_name: city,
    application_stage_name: selectedApplicationStage,
    twelve_board: twelveBoard,
    pg_marks: PGMarks,
    pg_university: PGUniversity,
    source_name: source,
    exam_name: examName,
    twelve_marks: twelveMarks,
    ug_marks: UGMarks,
    experience: experience,
    exam_score: examScore,
    category: category,
    nationality: nationality,
    pg_marks_sort: pgMarksSort,
    ug_marks_sort: ugMarksSort,
    exam_score_sort: examScoreSort,
    exam_name_sort: examNameSort,
  };
  if (
    systemPreference &&
    systemPreference?.preference &&
    selectedPreference?.length > 0
  ) {
    filterPayload.preference = selectedPreference;
  }

  const payloadOfApplications = {
    course_name: selectedProgram?.course_name,
    specialization_name: selectedSpecialization?.spec_name,
    pick_top: pickTop ? pickTop : null,
    filters: filterPayload,
  };

  const applicationsListApiDetails = useGetApplicationsBasedOnProgramQuery(
    {
      collegeId,
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      payload: {
        ...payloadOfPrograms,
      },
    },
    { skip: skipApplicationDetailsApiCall }
  );

  useEffect(() => {
    try {
      if (applicationsListApiDetails.isSuccess) {
        setOpenDeleteModal(false);
        setSelectedStudent([]);
        if (Array.isArray(applicationsListApiDetails.data?.data)) {
          setTotalApplications(applicationsListApiDetails.data?.total);
          setApplicationsBasedOnProgram(applicationsListApiDetails.data?.data);
          setAppliedFilter(true);
        } else {
          throw new Error(
            "Application based on program and specialization API's response has been changed"
          );
        }
      } else if (applicationsListApiDetails.isError) {
        handleError(applicationsListApiDetails.error);
        setOpenDeleteModal(false);
        setSelectedStudent([]);
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setListOfSchoolSomethingWentWrong,
        setHideListOfSchool,
        10000
      );
      setOpenDeleteModal(false);
      setSelectedStudent([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationsListApiDetails]);

  // prefetching application data

  const prefetchApplications = usePrefetch("getApplicationsBasedOnProgram");

  useEffect(() => {
    if (appliedFilter) {
      apiCallFrontAndBackPage(
        applicationsListApiDetails?.data,
        rowsPerPage,
        pageNumber,
        collegeId,
        prefetchApplications,
        {
          payload: {
            ...payloadOfPrograms,
          },
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applicationsListApiDetails,
    pageNumber,
    prefetchApplications,
    rowsPerPage,
    collegeId,
    appliedFilter,
  ]);

  const filterData = [
    {
      placeholder: "State",
      data: stateList,
      value: state,
      setValue: (value) => {
        setState(value);
        setCity([]);
        setCityList([]);
      },
      onOpen: () => setSkipStateApiCall(false),
      hide: hideStateList,
      loading: stateListInfo.isFetching,
    },
    {
      placeholder: "City",
      data: cityList,
      value: city,
      setValue: setCity,
      onOpen: () => setSkipCityApiCall(false),
      hide: hideCity,
      loading: cityListInfo.isFetching,
      groupBy: "role",
      onClose: () => setSkipCityApiCall(true),
    },
    {
      placeholder: "Application Stage",
      data: applicationStage,
      value: selectedApplicationStage,
      setValue: setSelectedApplicationStage,
      single: true,
    },
    {
      placeholder: "12 Board",
      data: twelveBoardList,
      value: twelveBoard,
      setValue: setTwelveBoard,
      onOpen: () => setSkipTwelveBoardApiCall(false),
      loading: twelveBoardListInfo.isFetching,
      hide: hideTwelveBoardList,
    },
    {
      placeholder: "12 Marks",
      data: twelveMarksList,
      value: twelveMarks,
      setValue: steTwelveMarks,
    },
    {
      placeholder: "UG Marks",
      data: twelveMarksList,
      value: UGMarks,
      setValue: setUGMarks,
    },
    {
      placeholder: "Experience",
      data: [],
      value: experience,
      setValue: setExperience,
    },
    {
      placeholder: "PG Marks",
      data: twelveMarksList,
      value: PGMarks,
      setValue: { setPGMarks },
    },
    {
      placeholder: "PG University",
      data: [],
      value: PGUniversity,
      setValue: setPGUniversity,
    },
    {
      placeholder: "Source",
      data: sourceList,
      value: source,
      setValue: setSource,
      onOpen: () => setSkipSourceApiCall(false),
      hide: hideSourceList,
      loading: sourceListInfo.isFetching,
    },
    {
      placeholder: "Exam Name",
      data: [],
      value: examName,
      setValue: setExamName,
    },
    {
      placeholder: "Exam Score",
      data: [],
      value: examScore,
      setValue: setExamScore,
    },
    {
      placeholder: "Category",
      data: [],
      value: category,
      setValue: setCategory,
    },
    {
      placeholder: "Nationality",
      data: nationalityInfo,
      value: nationality,
      setValue: setNationality,
    },
  ];
  if (systemPreference && systemPreference?.preference) {
    filterData.push({
      placeholder: "Preference",
      data: listOfPreference,
      value: selectedPreference,
      setValue: setSelectedPreference,
    });
  }
  const setThePayload = () => {
    setPayloadOfPrograms(payloadOfApplications);
  };

  const [createInterviewList] = useCreateInterviewListMutation();
  const handleCreateInterviewList = () => {
    if (totalApplications > 0 || pickTop > 0) {
      const payload = {
        ...payloadOfApplications,
        school_name: selectedSchool,
        list_name: listName,
        moderator_id: selectedModerator?.id,
        description: descriptions,
      };
      setLoadingCreateList(true);
      createInterviewList({ collegeId, payload })
        .unwrap()
        .then((response) => {
          if (response.message) {
            pushNotification("success", response.message);
            handleCloseDrawer();
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          } else {
            handleInternalServerError(
              setListOfSchoolInternalServerError,
              setHideListOfSchool,
              10000
            );
          }
        })
        .finally(() => {
          setLoadingCreateList(false);
          setRemoveStudentIds([]);
          setSelectedStudent([]);
        });
    } else {
      pushNotification(
        "warning",
        `List can't be created for ${totalApplications} Applicant.`
      );
    }
  };

  useEffect(() => {
    if (!pickTop) {
      if (pickTop !== null) {
        setPickTop(null);
        setThePayload();
        setRemoveStudentIds((prev) =>
          prev.filter((student) => allStudentIds.includes(student) === false)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickTop]);

  const allStudentIds = useMemo(() => {
    return applicationsListBasedOnProgram.map((data) => data?.application_id);
  }, [applicationsListBasedOnProgram]);

  return (
    <Drawer
      open={openCreateInterview}
      onClose={() => setOpenCreateInterview(false)}
      size="md"
    >
      <>
        {listOfSchoolInternalServerError || listOfSchoolSomethingWentWrong ? (
          <Box className="loading-animation-for-notification">
            {listOfSchoolInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {listOfSchoolSomethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <>
            {isFetching || applicationsListApiDetails.isFetching ? (
              <Box className="loading-animation-for-notification">
                <LeefLottieAnimationLoader width={80} height={100} />
              </Box>
            ) : (
              <Box
                sx={{
                  p: { md: 3, xs: 2 },
                  display: hideListOfSchool ? "none" : "block",
                }}
                className="create-interview-room-container"
              >
                <Box className="create-list-header">
                  <Typography variant="h6">Create List</Typography>
                  <IconButton onClick={() => handleCloseDrawer()}>
                    <CloseIcon />
                  </IconButton>
                </Box>
                {/* <Drawer.Body> */}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPageNumber(1);
                    setThePayload();
                    setSkipApplicationDetailsApiCall(false);
                    setRemoveStudentIds((prev) =>
                      prev.filter(
                        (student) => allStudentIds.includes(student) === false
                      )
                    );
                  }}
                >
                  <Box className="create-interview-room-wrapper">
                    {appliedFilter ? (
                      <CreateInterviewHeaderViewAfterSelectFilter
                        clickedFilterIcon={clickedFilterIcon}
                        setClickedFilterIcon={setClickedFilterIcon}
                        listName={listName}
                        totalApplications={totalApplications}
                        setPickTop={setPickTop}
                        pickTop={pickTop}
                        setThePayload={setThePayload}
                      />
                    ) : (
                      <CreateInterviewHeaderFilter
                        appliedFilter={appliedFilter}
                        setClickedFilterIcon={setClickedFilterIcon}
                        clickedFilterIcon={clickedFilterIcon}
                        headerFieldsStates={headerFieldsStates}
                        listOfSchools={listOfSchools}
                      />
                    )}
                  </Box>

                  {/* bottom part */}
                  {(!appliedFilter || clickedFilterIcon) && (
                    <AllTheFiltersList
                      filterData={filterData}
                      setAppliedFilter={setAppliedFilter}
                      clickedFilterIcon={clickedFilterIcon}
                      setPageNumber={setPageNumber}
                      setThePayload={setThePayload}
                      setPickTop={setPickTop}
                    />
                  )}
                </form>
                {appliedFilter && (
                  <Box>
                    <StudentTableOfCreatedList
                      pickTop={pickTop}
                      applicationsListBasedOnProgram={
                        applicationsListBasedOnProgram
                      }
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      rowsPerPage={rowsPerPage}
                      setRowsPerPage={setRowsPerPage}
                      totalApplications={totalApplications}
                      sortingStates={sortingStates}
                      setPayloadOfPrograms={setPayloadOfPrograms}
                      selectedStudent={selectedStudent}
                      setSelectedStudent={setSelectedStudent}
                      setRemoveStudentIds={setRemoveStudentIds}
                      removeStudentIds={removeStudentIds}
                      setOpenDeleteModal={setOpenDeleteModal}
                      allStudentIds={allStudentIds}
                    />
                    <Box className="create-interview-action bottom-create-list-button">
                      <button onClick={() => setOpenCreateListDialog(true)}>
                        Create List
                      </button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </>
        )}
      </>
      <Dialog
        open={openCreateListDialog}
        onClose={() => setOpenCreateListDialog(false)}
        fullScreen={fullScreen}
      >
        <DialogContent sx={{ p: 7, textAlign: "center", minWidth: 400 }}>
          <Typography sx={{ fontSize: "22px", fontWeight: 500 }}>
            {" "}
            List of {pickTop ? pickTop : totalApplications} applicants is being
            created
          </Typography>
          <Typography sx={{ mt: 3, fontWeight: 500 }} variant="body2">
            Applied for {selectedProgram?.course_name} program.
          </Typography>
        </DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            mb: 3,
          }}
        >
          <Button
            size="small"
            sx={{
              borderRadius: 30,
              paddingX: 5,
              bgcolor: "white",
              color: "#008BE2",
              border: "1px solid #008BE2",
            }}
            onClick={() => setOpenCreateListDialog(false)}
          >
            Cancel
          </Button>
          {loadingCreateList ? (
            <CircularProgress size={25} color="info" />
          ) : (
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: 30, paddingX: 5 }}
              color="info"
              onClick={handleCreateInterviewList}
            >
              Confirm
            </Button>
          )}
        </Box>
      </Dialog>
      <DeleteDialogue
        loading={applicationsListApiDetails?.isFetching}
        openDeleteModal={openDeleteModal}
        handleDeleteSingleTemplate={() => {
          filterPayload.remove_application_ids = removeStudentIds;
          setFinalRemoveIds(removeStudentIds);
          setThePayload();
        }}
        handleCloseDeleteModal={() => setOpenDeleteModal(false)}
        title="Are you sure, you want to remove?"
      />
    </Drawer>
  );
};

export default CreateInterviewDrawer;
