/* eslint-disable react-hooks/exhaustive-deps */
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import "../../../styles/SelectionProcedure.css";
import SelectionProcedureCard from "../../../components/SelectionProcedure/SelectionProcedureCard";
import CreateSelectionProcedureDrawer from "../../../components/SelectionProcedure/CreateSelectionProcedureDrawer";
import ViewSelectionProcedureDrawer from "../../../components/SelectionProcedure/ViewSelectionProcedureDrawer";
import {
  useCreateSelectionProcedureMutation,
  useGetSelectionProcedureDataQuery,
  usePrefetch,
} from "../../../Redux/Slices/selectionProcedureSlice";
import { useSelector } from "react-redux";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Cookies from "js-cookie";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import {
  parameterWeightageListForGd,
  parameterWeightageListForPi,
} from "../../../constants/ListForSelectionProcedures";
import Pagination from "../../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import SelectionProcedureAction from "../../../components/SelectionProcedure/SelectionProcedureAction";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { tableSlice } from "../../../Redux/Slices/applicationDataApiSlice";
import { filterOptionData } from "../../../Redux/Slices/filterDataSlice";
import { useDispatch } from "react-redux";
import { defaultRowsPerPageOptions } from "../../../components/Calendar/utils";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import { customFetch } from "../../StudentTotalQueries/helperFunction";

export default function SelectionProcedure() {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const [hideSelectionProcedure, setHideSelectionProcedure] = useState(false);
  const [selectionProcedureData, setSelectionProcedureData] = useState([]);
  const [
    selectionProcedureInternalServerError,
    setSelectionProcedureInternalServerError,
  ] = useState(false);
  const [
    selectionProcedureSomethingWentWrong,
    setSelectionProcedureSomethingWentWrong,
  ] = useState(false);

  const pushNotification = useToasterHook();

  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
  //selected item actions section
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  const [selectedSelectionProcedure, setSelectedSelectionProcedure] = useState(
    []
  );

  const [selectedProcedureIndex, setSelectedProcedureIndex] = useState(null);
  const [editSelectionProcedure, setEditSelectionProcedure] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  // states for pagination
  const selectionProcedurePageNumber = localStorage.getItem(
    `${Cookies.get("userId")}selectionProcedureSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}selectionProcedureSavePageNo`
        )
      )
    : 1;

  const selectionProcedureRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}selectionProcedureRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}selectionProcedureRowPerPage`
        )
      )
    : 25;

  const [pageNumber, setPageNumber] = useState(selectionProcedurePageNumber);
  const [rowsPerPage, setRowsPerPage] = useState(selectionProcedureRowsPerPage);

  const [totalSelectionProcedures, setTotalSelectionProcedures] = useState(0);

  const count = Math.ceil(totalSelectionProcedures / rowsPerPage);

  // get selection procedures data
  const {
    data: selectionProcedures,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetSelectionProcedureDataQuery({
    pageNumber,
    rowsPerPage,
    collegeId,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(selectionProcedures?.data)) {
          setSelectionProcedureData(selectionProcedures?.data);
          setTotalSelectionProcedures(selectionProcedures?.total);
        } else {
          throw new Error("get selection procedure API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setSelectionProcedureInternalServerError,
            setHideSelectionProcedure,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSelectionProcedureSomethingWentWrong,
        setHideSelectionProcedure,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionProcedures, error, isError, isSuccess]);

  // use react hook for prefetch data
  const prefetchSelectionProcedureData = usePrefetch(
    "getSelectionProcedureData"
  );
  useEffect(() => {
    apiCallFrontAndBackPage(
      selectionProcedures,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchSelectionProcedureData
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectionProcedures,
    pageNumber,
    collegeId,
    prefetchSelectionProcedureData,
    rowsPerPage,
  ]);

  const [openCreateSelectionProcedure, setOpenCreateSelectionProcedure] =
    useState(false);

  const initialParametersForGd = [
    {
      id: 1,
      parameter_name: "Agility",
      weightage_value: 20,
    },
    {
      id: 2,
      parameter_name: "Attitude",
      weightage_value: 20,
    },
    {
      id: 3,
      parameter_name: "Behavioral",
      weightage_value: 20,
    },
    {
      id: 4,
      parameter_name: "Communication Skills",
      weightage_value: 20,
    },
    {
      id: 5,
      parameter_name: "Domain Knowledge",
      weightage_value: 20,
    },
  ];

  const initialParametersForPi = [
    {
      id: 1,
      parameter_name: "Agility",
      weightage_value: 20,
    },
    {
      id: 2,
      parameter_name: "Attitude",
      weightage_value: 20,
    },
    {
      id: 3,
      parameter_name: "Behavioral",
      weightage_value: 20,
    },
    {
      id: 4,
      parameter_name: "Communication Skills",
      weightage_value: 20,
    },
    {
      id: 5,
      parameter_name: "Domain Knowledge",
      weightage_value: 20,
    },
  ];

  const handleCloseCreteSelectionDrawer = () => {
    setOpenCreateSelectionProcedure(false);
    setSelectedProgram("");
    setSpecializations([]);
    setSelectedSpecialization(null);
    setSelectedMinimumQualification([]);
    setGdItems(initialParametersForGd);
    setPiItems(initialParametersForPi);
    setSelectedOfferLetter(null);
    setSelectedAuthorizeApprover(null);
    setGdTotalWeightage(100);
    setPiTotalWeightage(100);
  };

  const handleCloseViewSelectionDrawer = () => {
    setOpenViewSelectionProcedure(false);
    setSelectedProgram("");
    setSpecializations([]);
    setSelectedSpecialization(null);
    setSelectedMinimumQualification([]);
    setGdItems(initialParametersForGd);
    setPiItems(initialParametersForPi);
    setSelectedOfferLetter(null);
    setSelectedAuthorizeApprover(null);
    setGdTotalWeightage(100);
    setPiTotalWeightage(100);
  };

  const [openViewSelectionProcedure, setOpenViewSelectionProcedure] =
    useState(false);

  const [gdItems, setGdItems] = useState(parameterWeightageListForGd);

  const [piItems, setPiItems] = useState(parameterWeightageListForPi);

  const courseListOfACollegeAPI = `${
    import.meta.env.VITE_API_BASE_URL
  }/course/list/?college_id=${collegeId}`;

  const [courses, setCourses] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);

  const [selectedOfferLetter, setSelectedOfferLetter] = useState(null);

  const [listOfApprovers, setListOfApprovers] = useState([]);
  const [selectedAuthorizeApprover, setSelectedAuthorizeApprover] =
    useState(null);

  const [selectedMinimumQualification, setSelectedMinimumQualification] =
    useState([]);

  const [
    createSelectionProcedureInternalServerError,
    setCreateSelectionProcedureInternalServerError,
  ] = useState(false);
  const [
    createSelectionProcedureSomethingWentWrong,
    setCreateSelectionProcedureSomethingWentWrong,
  ] = useState(false);

  // courses
  useEffect(() => {
    customFetch(courseListOfACollegeAPI, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.detail) {
          pushNotification("error", data.detail);
        } else if (data?.data) {
          try {
            if (Array.isArray(data?.data)) {
              const courseNamesArray = data?.data[0]?.map(
                (item) => item.course_name
              );
              setCourses(courseNamesArray);
            } else {
              throw new Error("course list API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setCreateSelectionProcedureSomethingWentWrong,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setCreateSelectionProcedureInternalServerError,
          "",
          5000
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseListOfACollegeAPI]);

  // course specializations
  useEffect(() => {
    if (selectedProgram) {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/course/specialization_list/?college_id=${collegeId}&course_name=${selectedProgram}&college_id=${collegeId}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data?.detail) {
            pushNotification("error", data.detail);
          } else if (data?.data) {
            try {
              if (Array.isArray(data?.data)) {
                const specializationList = data?.data[0];
                if (specializationList[0]?.course_specialization?.length > 0) {
                  setSpecializations(
                    specializationList[0]?.course_specialization
                  );
                } else {
                  setSpecializations([]);
                }
              } else {
                throw new Error(
                  "course specialization list API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setCreateSelectionProcedureSomethingWentWrong,
                "",
                5000
              );
            }
          }
        })
        .catch(() => {
          handleInternalServerError(
            setCreateSelectionProcedureInternalServerError,
            "",
            5000
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedProgram, collegeId]);

  useEffect(() => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/list/?user_type=authorized_approver&college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "GET")
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.detail) {
          pushNotification("error", data.detail);
        } else if (data?.data) {
          try {
            if (Array.isArray(data?.data)) {
              const listOfUsers = data?.data?.[0]?.map((item) => {
                return {
                  fullName: item.first_name + item.middle_name + item.last_name,
                  id: item.id,
                };
              });

              setListOfApprovers(listOfUsers);
            } else {
              throw new Error("list of users API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setCreateSelectionProcedureSomethingWentWrong,
              "",
              5000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setCreateSelectionProcedureInternalServerError,
          "",
          5000
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [gdTotalWeightage, setGdTotalWeightage] = useState(100);
  const [piTotalWeightage, setPiTotalWeightage] = useState(100);

  const handleWeightageChangeForGd = (index, weightageValue, parameterName) => {
    const updatedGdItems = [...gdItems];

    updatedGdItems[index].weightage_value = parseInt(weightageValue);
    updatedGdItems[index].parameter_name = parameterName;

    if (!weightageValue && !parameterName) {
      updatedGdItems.splice(index, 1);
    }

    const gdTotalWeightage = updatedGdItems?.reduce(
      (sum, parameter) =>
        sum +
        parseInt(
          Number.isNaN(parameter.weightage_value)
            ? 0
            : parameter.weightage_value
        ),
      0
    );

    setGdItems(updatedGdItems);
    setGdTotalWeightage(gdTotalWeightage);
  };

  const handleWeightageChangeForPi = (index, weightageValue, parameterName) => {
    const updatedPiItems = [...piItems];

    updatedPiItems[index].weightage_value = parseInt(weightageValue);
    updatedPiItems[index].parameter_name = parameterName;

    if (!weightageValue && !parameterName) {
      updatedPiItems.splice(index, 1);
    }

    const piTotalWeightage = updatedPiItems?.reduce(
      (sum, parameter) =>
        sum +
        parseInt(
          Number.isNaN(parameter.weightage_value)
            ? 0
            : parameter.weightage_value
        ),
      0
    );

    setPiItems(updatedPiItems);
    setPiTotalWeightage(piTotalWeightage);
  };

  const [gdOptionChecked, setGdOptionChecked] = useState(true);
  const [piOptionChecked, setPiOptionChecked] = useState(true);

  const dispatch = useDispatch();

  // Create a new object by converting the parameter_name to lowercase and replacing spaces with underscores
  const convertGdPiObject = (array) => {
    const result = array?.reduce((acc, item) => {
      const key = item?.parameter_name?.toLowerCase().replace(/ /g, "_");
      acc[key] = parseInt(item?.weightage_value);
      return acc;
    }, {});

    return result;
  };

  const payload = {
    course_name: selectedProgram,
    specialization_name: selectedSpecialization?.spec_name,
    eligibility_criteria: {
      minimum_qualification: selectedMinimumQualification,
    },
    gd_parameters_weightage: gdOptionChecked ? convertGdPiObject(gdItems) : {},
    pi_parameters_weightage: piOptionChecked ? convertGdPiObject(piItems) : {},
    offer_letter: {
      template: selectedOfferLetter,
      authorized_approver: selectedAuthorizeApprover?.id,
    },
  };

  const [openBackDrop, setOpenBackDrop] = useState(false);

  const [createSelectionProcedure] = useCreateSelectionProcedureMutation();

  const handleCreateSelectionProcedure = (event, procedureId) => {
    event.preventDefault();
    setOpenBackDrop(true);
    createSelectionProcedure({
      collegeId,
      payload,
      procedureId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          try {
            if (typeof res?.message === "string") {
              pushNotification("success", res?.message);
              handleCloseCreteSelectionDrawer();
              setOpenViewSelectionProcedure(false);
            } else {
              throw new Error(
                "create selection procedure API response changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setCreateSelectionProcedureSomethingWentWrong,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(
            setCreateSelectionProcedureInternalServerError,
            "",
            5000
          );
        }
      })
      .finally(() => {
        setOpenBackDrop(false);
        dispatch(tableSlice.util.resetApiState());
        dispatch(filterOptionData.util.resetApiState());
      });
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Selection Procedure Head Title add
  useEffect(() => {
    setHeadTitle("Selection Procedure");
    document.title = "Selection Procedure";
  }, [headTitle]);
  return (
    <Box
      sx={{ px: 3, pb: 3 }}
      className="selection-procedure-header-box-container"
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
      >
        <Typography fontWeight={"bold"}>Submitting</Typography>
        <CircularProgress sx={{ ml: 2 }} color="info" />
      </Backdrop>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <button
            onClick={() => setOpenCreateSelectionProcedure(true)}
            className="create-selection-procedure-btn"
          >
            Create Selection Procedure
          </button>

          <Box>
            {selectionProcedureInternalServerError ||
            selectionProcedureSomethingWentWrong ? (
              <Box className="loading-animation-for-notification">
                {selectionProcedureInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {selectionProcedureSomethingWentWrong && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  visibility: hideSelectionProcedure ? "hidden" : "visible",
                }}
              >
                {isFetching ? (
                  <Box className="loading-animation-for-session">
                    <LeefLottieAnimationLoader
                      height={120}
                      width={120}
                    ></LeefLottieAnimationLoader>
                  </Box>
                ) : (
                  <>
                    {selectionProcedureData?.map((item, index) => (
                      <Box key={item?.procedure_id}>
                        <SelectionProcedureCard
                          data={item}
                          setOpenViewSelectionProcedure={
                            setOpenViewSelectionProcedure
                          }
                          index={index}
                          setSelectedProcedureIndex={setSelectedProcedureIndex}
                          setEditSelectionProcedure={setEditSelectionProcedure}
                          selectedSelectionProcedure={
                            selectedSelectionProcedure
                          }
                          setSelectedSelectionProcedure={
                            setSelectedSelectionProcedure
                          }
                        />
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
        {openCreateSelectionProcedure && (
          <CreateSelectionProcedureDrawer
            openCreateSelectionProcedure={openCreateSelectionProcedure}
            gdItems={gdItems}
            setGdItems={setGdItems}
            piItems={piItems}
            setPiItems={setPiItems}
            courses={courses}
            handleCreateSelectionProcedure={handleCreateSelectionProcedure}
            setSelectedProgram={setSelectedProgram}
            setSelectedSpecialization={setSelectedSpecialization}
            setSpecializations={setSpecializations}
            specializations={specializations}
            selectedSpecialization={selectedSpecialization}
            selectedMinimumQualification={selectedMinimumQualification}
            setSelectedMinimumQualification={setSelectedMinimumQualification}
            selectedOfferLetter={selectedOfferLetter}
            setSelectedOfferLetter={setSelectedOfferLetter}
            listOfApprovers={listOfApprovers}
            selectedAuthorizeApprover={selectedAuthorizeApprover}
            setSelectedAuthorizeApprover={setSelectedAuthorizeApprover}
            handleWeightageChangeForGd={handleWeightageChangeForGd}
            handleWeightageChangeForPi={handleWeightageChangeForPi}
            setGdOptionChecked={setGdOptionChecked}
            gdOptionChecked={gdOptionChecked}
            piOptionChecked={piOptionChecked}
            setPiOptionChecked={setPiOptionChecked}
            gdTotalWeightage={gdTotalWeightage}
            setGdTotalWeightage={setGdTotalWeightage}
            piTotalWeightage={piTotalWeightage}
            setPiTotalWeightage={setPiTotalWeightage}
            internalServerError={createSelectionProcedureInternalServerError}
            somethingWentWrong={createSelectionProcedureSomethingWentWrong}
            handleCloseDrawer={handleCloseCreteSelectionDrawer}
          />
        )}

        {openViewSelectionProcedure && (
          <ViewSelectionProcedureDrawer
            openViewSelectionProcedure={openViewSelectionProcedure}
            setOpenViewSelectionProcedure={setOpenViewSelectionProcedure}
            gdItems={gdItems}
            piItems={piItems}
            selectionProcedureData={
              selectionProcedureData?.[selectedProcedureIndex]
            }
            courses={courses}
            handleCreateSelectionProcedure={handleCreateSelectionProcedure}
            setSelectedProgram={setSelectedProgram}
            setSelectedSpecialization={setSelectedSpecialization}
            setSpecializations={setSpecializations}
            specializations={specializations}
            selectedSpecialization={selectedSpecialization}
            selectedMinimumQualification={selectedMinimumQualification}
            setSelectedMinimumQualification={setSelectedMinimumQualification}
            selectedOfferLetter={selectedOfferLetter}
            setSelectedOfferLetter={setSelectedOfferLetter}
            listOfApprovers={listOfApprovers}
            selectedAuthorizeApprover={selectedAuthorizeApprover}
            setSelectedAuthorizeApprover={setSelectedAuthorizeApprover}
            handleWeightageChangeForGd={handleWeightageChangeForGd}
            handleWeightageChangeForPi={handleWeightageChangeForPi}
            setGdItems={setGdItems}
            setPiItems={setPiItems}
            editSelectionProcedure={editSelectionProcedure}
            setGdTotalWeightage={setGdTotalWeightage}
            setPiTotalWeightage={setPiTotalWeightage}
            handleCloseViewSelectionDrawer={handleCloseViewSelectionDrawer}
          />
        )}

        {!isFetching && selectionProcedureData?.length > 0 && (
          <Box
            ref={paginationRef}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              className="pagination-bar"
              currentPage={pageNumber}
              totalCount={totalSelectionProcedures}
              pageSize={rowsPerPage}
              onPageChange={(page) =>
                handleChangePage(
                  page,
                  `selectionProcedureSavePageNo`,
                  setPageNumber
                )
              }
              count={count}
            />
            <AutoCompletePagination
              rowsPerPage={rowsPerPage}
              rowPerPageOptions={rowPerPageOptions}
              setRowsPerPageOptions={setRowsPerPageOptions}
              rowCount={totalSelectionProcedures}
              page={pageNumber}
              setPage={setPageNumber}
              localStorageChangeRowPerPage={`selectionProcedureRowPerPage`}
              localStorageChangePage={`selectionProcedureSavePageNo`}
              setRowsPerPage={setRowsPerPage}
            ></AutoCompletePagination>
          </Box>
        )}
        {selectedSelectionProcedure?.length > 0 && (
          <SelectionProcedureAction
            isScrolledToPagination={isScrolledToPagination}
            selectedSelectionProcedure={selectedSelectionProcedure}
            setSelectedSelectionProcedure={setSelectedSelectionProcedure}
            setInternalServerError={setSelectionProcedureInternalServerError}
            setSomethingWentWrong={setSelectionProcedureSomethingWentWrong}
          />
        )}
      </Card>
    </Box>
  );
}
