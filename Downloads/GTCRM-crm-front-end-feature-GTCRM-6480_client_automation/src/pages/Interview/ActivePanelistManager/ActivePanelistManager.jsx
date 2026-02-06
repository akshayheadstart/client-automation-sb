/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import {
  Box,
  Button,
  Card,
  ClickAwayListener,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Grid from "@mui/system/Unstable_Grid/Grid";
import SearchIcon from "@rsuite/icons/Search";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CheckPicker, Checkbox, SelectPicker } from "rsuite";
import { useGetPanelistInfoByIdQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useGetAllCourseListQuery } from "../../../Redux/Slices/filterDataSlice";
import ActivePanelistManagerHeader from "../../../components/ActivePanelistManagerHeader/ActivePanelistManagerHeader";
import ActivePanelistManagerTable from "../../../components/ActivePanelistManagerTable/ActivePanelistManagerTable";
import CreatePanelistDialog from "../../../components/CreatePanelistDialog/CreatePanelistDialog";
import DeleteDialogue from "../../../components/shared/Dialogs/DeleteDialogue";
import Error500Animation from "../../../components/shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../../../components/shared/Loader/LeefLottieAnimationLoader";
import { organizeCourseFilterInterViewOption } from "../../../helperFunctions/filterHelperFunction";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import useToasterHook from "../../../hooks/useToasterHook";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import "../../../styles/activePanelistManager.css";
import "../../../styles/sharedStyles.css";
import "../../../styles/report.css";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { useMemo } from "react";
import { useRef } from "react";
import { panelistManagerStatus } from "../../../constants/LeadStageList";
import CreateInterviewDrawer from "../../../components/Interview/CreateInterviewDrawer";
import { Link } from "react-router-dom";
import SearchBox from "../../../components/shared/SearchBox/SearchBox";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import activePanelist from "../../../images/activePanelistsIcon.png";
import availableSlots from "../../../images/avaiableSlots.png";
import interviewDone from "../../../images/interviewDoneIocn.png";
import totalPanelist from "../../../images/TotalPanelist.png";
import photoProfile from "../../../images/profilePhotoIcon.png";
import InterviewTaken from "../../../images/interviewTakenIocn.png";
import selectedStudents from "../../../images/selectedStudentsIcon.png";
import rejectedStudents from "../../../images/rejectedStudentIocn.png";
import selectedRatio from "../../../images/selectionIcon.png";
import { customFetch } from "../../StudentTotalQueries/helperFunction";

const ActivePanelistManager = () => {
  const [listOfCourses, setListOfCourses] = React.useState([]);
  const [selectedValueProgram, setSelectedValueProgram] = useState([]);
  const allValue = useMemo(() => {
    return listOfCourses?.map((item) => ({
      course_name: item.value.course_name,
      specialization_name: item.value.course_specialization,
    }));
  }, [listOfCourses]);
  const handleCheckAll = (value, checked) => {
    setSelectedValueProgram(checked ? allValue : []);
    setFirstEnterPageLoading(true);
    setPageNumber(1);
    setAllDataFetched(false);
  };
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  // common api call functions
  const { handleFilterListApiCall } = useCommonApiCalls();
  const [hideCourseList, setHideCourseList] = useState(false);

  const [callFilterOptionApi, setCallFilterOptionApi] = useState({
    skipStateApiCall: true,
    skipSourceApiCall: true,
    skipCounselorApiCall: true,
    skipCourseApiCall: true,
    callBoard: false,
  });

  const courseListInfo = useGetAllCourseListQuery(
    { collegeId: collegeId },
    { skip: callFilterOptionApi.skipCourseApiCall }
  );
  useEffect(() => {
    if (!callFilterOptionApi.skipCourseApiCall) {
      const courseList = courseListInfo?.data?.data[0];
      handleFilterListApiCall(
        courseList,
        courseListInfo,
        setListOfCourses,
        setHideCourseList,
        organizeCourseFilterInterViewOption
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    courseListInfo,
    callFilterOptionApi.skipCourseApiCall,
    hideCourseList,
    callFilterOptionApi,
  ]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [search, setSearch] = useState("");
  const filterDataPayload = {
    program: selectedValueProgram,
    search_input: search,
  };
  if (selectedStatus) {
    filterDataPayload.is_activated = selectedStatus === "Active" ? true : false;
  }

  const dataCourse = useMemo(() => {
    return listOfCourses?.map((item) => ({
      label: item.label,
      value: {
        course_name: item.value.course_name,
        specialization_name: item.value.course_specialization,
      },
    }));
  }, [listOfCourses]);
  const selectPickerStyles = { width: 120, display: "block", zIndex: 1 };
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const handleClickOpen = () => {
    setOpenCreateDialog(true);
  };
  const handleClose = () => {
    setOpenCreateDialog(false);
  };
  const [selected, setSelected] = React.useState([]);

  const [selectedDeletePanelist, setSelectedDeletePanelist] = React.useState(
    []
  );
  const [selectedPanelistId, setSelectedPanelistId] = useState("");
  const [selectedPanelistCard, setSelectedPanelistCard] = useState(false);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [
    somethingWentWrongInDeletePanelist,
    setSomethingWentWrongInDeletePanelist,
  ] = useState(false);
  const [
    deletePanelistInternalServerError,
    setDeletePanelistInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDownloadPanelist,
    setSomethingWentWrongInDownloadPanelist,
  ] = useState(false);
  const [
    downloadPanelistInternalServerError,
    setDownloadPanelistInternalServerError,
  ] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstEnterPageLoading, setFirstEnterPageLoading] = useState(true);
  const [panelistInfo, setPanelistInfo] = useState({});
  const [getPanelist, setGetPanelist] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [allDataFetched, setAllDataFetched] = useState(false);
  const [openCreateInterview, setOpenCreateInterview] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const handleDeletePanelist = () => {
    setDeleteLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/delete_by_ids/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(
        token,
        "POST",
        JSON.stringify(selectedDeletePanelist)
      )
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            const deleteIds = selectedDeletePanelist?.find(
              (selectedId) => selectedId === selectedPanelistId
            );
            if (deleteIds) {
              setPanelistInfo({});
              setSelectedPanelistCard(false);
            }
            pushNotification("success", "Successfully Deleted");
            setPageNumber(1);
            setDeleteStatus(true);
            setAllDataFetched(false);
            setSelectedDeletePanelist([]);
            setSelected([]);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInDeletePanelist,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setDeletePanelistInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setLoading(!loading);
        setOpenDeleteDialog(false);
        setFirstEnterPageLoading(true);
        setDeleteLoading(false);
        setUpdateLoading((prev) => !prev);
      });
  };
  const handlePanelistDownload = () => {
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/user/download_panelist/`,
      ApiCallHeaderAndBody(token, "POST"),
      true
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          const expectedData = result?.file_url;
          pushNotification("success", result?.message);
          try {
            if (typeof expectedData === "string") {
              window.open(result?.file_url);
            } else {
              throw new Error(
                "download_applications_data API response has changed"
              );
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInDownloadPanelist,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setDownloadPanelistInternalServerError,
          "",
          5000
        );
      });
  };
  const [
    somethingWentWrongInPanelistHeader,
    setSomethingWentWrongInPanelistHeader,
  ] = useState(false);
  const [
    panelistHeaderInternalServerError,
    setPanelistHeaderInternalServerError,
  ] = useState(false);
  const [panelistHeaderInfo, setPanelistHeaderInfo] = useState({});
  const [isScrolledPanelistInfo, setIsScrolledPanelistInfo] = useState(false);

  const [
    somethingWentWrongInPanelistInfoId,
    setSomethingWentWrongInPanelistInfoId,
  ] = useState(false);
  const [
    panelistInfoIdInternalServerError,
    setPanelistInfoIdInternalServerError,
  ] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [createUserState, setCreateUserState] = useState(false);
  React.useEffect(() => {
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/user/panelist_manager_header_info/?college_id=${collegeId}`;
    customFetch(url, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else if (result.data) {
          try {
            if (typeof result?.data === "object" && result?.data !== null) {
              setPanelistHeaderInfo(result?.data);
            } else {
              throw new Error("Get panelist API response has changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInPanelistHeader,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(
          setPanelistHeaderInternalServerError,
          "",
          5000
        );
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading, updateLoading]);
  const { data, isSuccess, isFetching, error, isError } =
    useGetPanelistInfoByIdQuery(
      { user_id: selectedPanelistId, collegeId: collegeId },
      { skip: isScrolledPanelistInfo ? false : true }
    );
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data?.data === "object" && data?.data !== null) {
          setPanelistInfo(data?.data);
        } else {
          throw new Error("get_details API response has changed");
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
            setPanelistInfoIdInternalServerError,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrongInPanelistInfoId, 10000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.data,
    error?.data?.detail,
    error?.status,
    isError,
    isSuccess,
    setApiResponseChangeMessage,
  ]);
  const programRef = useRef();
  const footerButtonStyle = {
    float: "right",
    marginRight: 10,
    marginTop: 2,
  };
  const footerStyles = {
    padding: "10px 2px",
    borderTop: "1px solid #e5e5e5",
  };
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  const [
    somethingWentWrongInStatusUpdate,
    setSomethingWentWrongInStatusUpdate,
  ] = useState(false);
  const [
    statusUpdateIdInternalServerError,
    setStatusUpdateIdInternalServerError,
  ] = useState(false);
  const [activeStatus, setActiveStatus] = useState(false);
  const handleUpdateStatus = (active) => {
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/enable_or_disable_users/?is_activated=${active}`,
      ApiCallHeaderAndBody(token, "PUT", JSON.stringify(selectedDeletePanelist))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", "Successfully Status Updated");
            setPageNumber(1);
            setActiveStatus(true);
            setAllDataFetched(false);
            setSelectedDeletePanelist([]);
            setSelected([]);
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInStatusUpdate,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        handleInternalServerError(
          setStatusUpdateIdInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setUpdateLoading((prev) => !prev);
        // setOpenDeleteDialog(false);
        //   setDeleteLoading(false)
      });
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Active Panelists Head Title add
  useEffect(() => {
    setHeadTitle("Active Panelists");
    document.title = "Active Panelists";
  }, [headTitle]);
  return (
    <Card
      sx={{ mx: "28px" }}
      className="active-manager-card-container active-panelists-header-box-container"
    >
      <Box className="active-panelist-manager-header-box">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={9}>
            {panelistHeaderInternalServerError ||
            somethingWentWrongInPanelistHeader ? (
              <>
                {panelistHeaderInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInPanelistHeader && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </>
            ) : (
              <Box className="active-panelist-manager-header-text-box">
                <Grid item xs={6} sm={4} md={2}>
                  <Box className="active-panelist-manager-box-grid">
                    <ActivePanelistManagerHeader
                      photoURL={activePanelist}
                      nameOne={"Active"}
                      nameTwo={"Panelists"}
                      value={panelistHeaderInfo?.active_panelist}
                    ></ActivePanelistManagerHeader>

                    <Box
                      sx={{
                        "& svg": {
                          m: 1.5,
                        },
                        "& hr": {
                          mx: 0.5,
                        },
                      }}
                      className="divider-box-container"
                    >
                      <Divider
                        sx={{ borderColor: "#0080C9" }}
                        orientation="vertical"
                        flexItem
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box className="active-panelist-manager-box-grid">
                    <ActivePanelistManagerHeader
                      photoURL={availableSlots}
                      nameOne={"Available"}
                      nameTwo={"Slots"}
                      value={panelistHeaderInfo?.available_slots}
                    ></ActivePanelistManagerHeader>
                    <Box
                      sx={{
                        "& svg": {
                          m: 1.5,
                        },
                        "& hr": {
                          mx: 0.5,
                        },
                      }}
                      className="divider-box-container"
                    >
                      <Divider
                        sx={{ borderColor: "#0080C9" }}
                        orientation="vertical"
                        flexItem
                        className="divider-available-slot"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={2}>
                  <Box className="active-panelist-manager-box-grid">
                    <ActivePanelistManagerHeader
                      photoURL={interviewDone}
                      nameOne={"Interview"}
                      nameTwo={"Done"}
                      value={panelistHeaderInfo?.interview_done}
                    ></ActivePanelistManagerHeader>
                    <Box
                      sx={{
                        "& svg": {
                          m: 1.5,
                        },
                        "& hr": {
                          mx: 0.5,
                        },
                      }}
                      className="divider-box-container"
                    >
                      <Divider
                        sx={{ borderColor: "#0080C9" }}
                        orientation="vertical"
                        flexItem
                        className="divider-end"
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4} md={1}>
                  <Box className="active-panelist-manager-box-grid-last">
                    <ActivePanelistManagerHeader
                      photoURL={totalPanelist}
                      nameOne={"Total"}
                      nameTwo={"Panelists"}
                      value={panelistHeaderInfo?.total_panelists}
                    ></ActivePanelistManagerHeader>
                  </Box>
                </Grid>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box className="active-button-box-container">
              <Box className="active-button-panelist-manager"></Box>
              <Box sx={{ mb: 1 }}>
                <ClickAwayListener
                  onClickAway={() => setSearchFieldToggle(false)}
                >
                  <Box className="active-panelist-button-box-search">
                    {!searchFieldToggle ? (
                      <Box
                        className="button-design-manage-panel-slots"
                        data-testid="search-toggle"
                        sx={{
                          paddingY: "4px",
                          borderRadius: "5px",
                          paddingX: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => setSearchFieldToggle(true)}
                      >
                        <SearchIcon sx={{ fontSize: "30px" }} />
                      </Box>
                    ) : (
                      <SearchBox
                        setSearchText={setSearch}
                        searchText={search}
                        setPageNumber={setPageNumber}
                        setAllDataFetched={setAllDataFetched}
                        maxWidth={130}
                        InputLabelProps={{
                          sx: {
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 400,
                            top: "2px",
                            "&.Mui-focused": {
                              color: "white",
                            },
                          },
                        }}
                        InputProps={{
                          classes: {
                            root: "report-input-root",
                            notchedOutline: "report-notched-outline",
                          },
                        }}
                      />
                    )}
                    <Button
                      size="small"
                      sx={{ borderRadius: 50, whiteSpace: "nowrap" }}
                      className="button-design-manage-panel-slots-create-list"
                      variant="outlined"
                      startIcon={
                        <AddIcon
                          className={searchFieldToggle ? "addIcon-size" : ""}
                        />
                      }
                      onClick={() => setOpenCreateInterview(true)}
                    >
                      Create Lists
                    </Button>
                  </Box>
                </ClickAwayListener>
              </Box>
              <Box className="manage-panel-slot-button-box">
                <Link to="/planner">
                  <Button
                    size="small"
                    sx={{ borderRadius: 50, mt: "8px", whiteSpace: "nowrap" }}
                    className="button-design-manage-panel-slots"
                    variant="outlined"
                  >
                    Manage panel and Slots
                  </Button>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box className="active-list-data-container">
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={12}
            md={Object.keys(panelistInfo).length > 0 ? 6.5 : 12}
          >
            <Card sx={{ border: "1px solid #A8C9E5", borderRadius: "8px" }}>
              <Box className="active-panelist-table-container">
                <Box className="active-panelist-box-design">
                  <Button
                    onClick={() => handleClickOpen()}
                    color="info"
                    size="small"
                    sx={{
                      borderRadius: 50,
                      bgcolor: "#039BDC",
                      whiteSpace: "nowrap",
                    }}
                    className="button-design-manage-panel-slots-create-panelist"
                    variant="contained"
                    startIcon={<AddIcon />}
                  >
                    Add Panelists
                  </Button>
                  <Box className="select-picker-box-container">
                    <CheckPicker
                      style={{ width: 150, zIndex: 1 }}
                      ref={programRef}
                      loading={
                        courseListInfo.isFetching
                          ? courseListInfo.isFetching
                          : false
                      }
                      placeholder="Select Program"
                      className="select-picker"
                      data={dataCourse}
                      value={selectedValueProgram}
                      onChange={(value) => {
                        setSelectedValueProgram(value);
                        setPageNumber(1);
                        setFirstEnterPageLoading(true);
                        setAllDataFetched(false);
                      }}
                      placement={
                        selectedPanelistCard ? "bottomStart" : "bottomEnd"
                      }
                      onOpen={() => {
                        setCallFilterOptionApi &&
                          setCallFilterOptionApi((prev) => ({
                            ...prev,
                            skipCourseApiCall: false,
                          }));
                      }}
                      renderExtraFooter={() => (
                        <div style={footerStyles}>
                          <Checkbox
                            indeterminate={
                              selectedValueProgram?.length > 0 &&
                              selectedValueProgram?.length < allValue?.length
                            }
                            checked={
                              selectedValueProgram?.length === allValue?.length
                            }
                            onChange={handleCheckAll}
                          >
                            Check all
                          </Checkbox>
                          {selectedValueProgram?.length > 0 ? (
                            <Button
                              style={footerButtonStyle}
                              appearance="primary"
                              size="sm"
                              onClick={() => {
                                programRef.current.close();
                              }}
                            >
                              Close
                            </Button>
                          ) : (
                            <Button
                              style={footerButtonStyle}
                              appearance="primary"
                              size="sm"
                              onClick={() => {
                                programRef.current.close();
                              }}
                            >
                              Ok
                            </Button>
                          )}
                        </div>
                      )}
                    />
                    <SelectPicker
                      size="md"
                      placeholder="Status"
                      data={panelistManagerStatus}
                      style={selectPickerStyles}
                      className="select-picker-field"
                      searchable={false}
                      onChange={(status) => {
                        setSelectedStatus(status);
                        setPageNumber(1);
                        setFirstEnterPageLoading(true);
                        setAllDataFetched(false);
                      }}
                    />
                    <Button
                      onClick={() => handlePanelistDownload()}
                      size="small"
                      className="button-design-manage-panel-slots-download"
                      variant="outlined"
                    >
                      <FileDownloadOutlinedIcon sx={{ color: "#008BE2" }} />
                    </Button>
                  </Box>
                </Box>
                <Box>
                  {somethingWentWrongInDeletePanelist ||
                  deletePanelistInternalServerError ||
                  somethingWentWrongInDownloadPanelist ||
                  downloadPanelistInternalServerError ? (
                    <>
                      {(downloadPanelistInternalServerError ||
                        deletePanelistInternalServerError) && (
                        <Error500Animation
                          height={400}
                          width={400}
                        ></Error500Animation>
                      )}
                      {(somethingWentWrongInDownloadPanelist ||
                        somethingWentWrongInDeletePanelist) && (
                        <ErrorFallback
                          error={apiResponseChangeMessage}
                          resetErrorBoundary={() => window.location.reload()}
                        />
                      )}
                    </>
                  ) : (
                    <ActivePanelistManagerTable
                      selected={selected}
                      setSelected={setSelected}
                      setSelectedDeletePanelist={setSelectedDeletePanelist}
                      setSelectedPanelistId={setSelectedPanelistId}
                      setIsScrolledPanelistInfo={setIsScrolledPanelistInfo}
                      loadingData={loading}
                      setFirstEnterPageLoading={setFirstEnterPageLoading}
                      firstEnterPageLoading={firstEnterPageLoading}
                      setGetPanelist={setGetPanelist}
                      getPanelist={getPanelist}
                      updateLoading={updateLoading}
                      selectedPanelistId={selectedPanelistId}
                      filterDataPayload={filterDataPayload}
                      selectedStatus={selectedStatus}
                      setPageNumber={setPageNumber}
                      pageNumber={pageNumber}
                      allDataFetched={allDataFetched}
                      setAllDataFetched={setAllDataFetched}
                      createUserState={createUserState}
                      setCreateUserState={setCreateUserState}
                      selectedValueProgram={selectedValueProgram}
                      setSelectedPanelistCard={setSelectedPanelistCard}
                      search={search}
                      deleteLoading={deleteLoading}
                      deleteStatus={deleteStatus}
                      activeStatus={activeStatus}
                      setActiveStatus={setActiveStatus}
                      setDeleteStatus={setDeleteStatus}
                      selectedDeletePanelist={selectedDeletePanelist}
                      statusUpdateIdInternalServerError={
                        statusUpdateIdInternalServerError
                      }
                      somethingWentWrongInStatusUpdate={
                        somethingWentWrongInStatusUpdate
                      }
                    />
                  )}
                </Box>
              </Box>
            </Card>
          </Grid>
          {Object.keys(panelistInfo).length > 0 && (
            <Grid item xs={12} sm={12} md={5.5}>
              {panelistInfoIdInternalServerError ||
              somethingWentWrongInPanelistInfoId ? (
                <>
                  {panelistInfoIdInternalServerError && (
                    <Error500Animation
                      height={400}
                      width={400}
                    ></Error500Animation>
                  )}
                  {somethingWentWrongInPanelistInfoId && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </>
              ) : (
                <>
                  {isFetching ? (
                    <>
                      <Box className="loading-animation">
                        <LeefLottieAnimationLoader
                          height={200}
                          width={180}
                        ></LeefLottieAnimationLoader>
                      </Box>
                    </>
                  ) : (
                    <Card
                      sx={{ border: "1px solid #A8C9E5", borderRadius: "8px" }}
                    >
                      <Box className="active-panelist-table-container">
                        <Box
                          sx={{
                            display: "grid",
                            placeItems: "center",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              position: "absolute",
                              mt: 20,
                              textAlign: "center",
                            }}
                            className="profile-image-box"
                          >
                            <img
                              src={photoProfile}
                              alt="Image description"
                              className="profile-photo"
                            />
                            {/* <Typography
                              sx={{
                                fontSize: "22px",
                                color: "white",
                                fontWeight: 600,
                              }}
                              className="Panelist-name-text"
                            >
                              {panelistInfo?.first_name} {panelistInfo?.middle_name} {panelistInfo?.last_name}
                            </Typography> */}
                          </Box>
                        </Box>
                        <Box className="active-panelist-box-user-profile">
                          <Typography
                            sx={{
                              fontSize: "18px",
                              color: "white",
                              fontWeight: 600,
                              textAlign: "center",
                              pt: "110px",
                            }}
                            className="Panelist-name-text"
                          >
                            {panelistInfo?.first_name}{" "}
                            {panelistInfo?.middle_name}{" "}
                            {panelistInfo?.last_name}
                          </Typography>
                          <Box className="panelist-info-data-box-container">
                            <Box className="box-container-flex">
                              <MailOutlinedIcon className="mail-icon" />
                              <Box
                                sx={{
                                  minWidth: "110px",
                                  overflowWrap: "break-word",
                                }}
                                className="panelist-email-width-container"
                              >
                                <Typography sx={{ fontSize: "13px" }}>
                                  {panelistInfo?.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="box-container-flex">
                              <LocalPhoneOutlinedIcon />
                              <Typography sx={{ fontSize: "13px" }}>
                                {panelistInfo?.mobile_number
                                  ? panelistInfo?.mobile_number
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                          <Box className="active-panelist-box-design-text">
                            <Box className="box-container-flex">
                              <MailOutlinedIcon className="mail-icon" />
                              <Box className="email-text-container-large-screen">
                                <Typography
                                  sx={{ fontSize: "13px", width: "30px" }}
                                >
                                  {panelistInfo?.email}
                                </Typography>
                              </Box>
                            </Box>
                            <Box className="box-container-flex box-phone-container">
                              <LocalPhoneOutlinedIcon />
                              <Typography sx={{ fontSize: "13px" }}>
                                {panelistInfo?.mobile_number
                                  ? panelistInfo?.mobile_number
                                  : "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box className="active-panelist-info-data-text">
                          <Typography className="active-panelist-school-text">
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: 800 }}
                            >
                              School:
                            </Typography>
                            <Typography sx={{ fontSize: "13px" }}>
                              {panelistInfo?.school_name
                                ? panelistInfo?.school_name
                                : "N/A"}
                            </Typography>
                          </Typography>
                          <Typography className="active-panelist-school-text">
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: 800 }}
                            >
                              Department:
                            </Typography>
                            <Typography sx={{ fontSize: "13px" }}>
                              {panelistInfo?.selected_programs?.map(
                                (program) => {
                                  return (
                                    <li>
                                      {program?.course_name}{" "}
                                      {program?.specialization_name}
                                    </li>
                                  );
                                }
                              )}
                            </Typography>
                          </Typography>
                          <Typography className="active-panelist-school-text">
                            <Typography
                              sx={{ fontSize: "13px", fontWeight: 800 }}
                            >
                              Designation:
                            </Typography>
                            <Typography sx={{ fontSize: "13px" }}>
                              {panelistInfo?.designation
                                ? panelistInfo?.designation
                                : "N/A"}
                            </Typography>
                          </Typography>
                        </Box>
                        <Box className="active-panelist-info-data-text active-info-panelist-container">
                          <Box>
                            <img src={InterviewTaken} alt="Image description" />
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Interview
                            </Typography>
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Taken
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "42px",
                                fontWeight: 700,
                                color: "#008CE0",
                              }}
                            >
                              {panelistInfo?.interview_taken}
                            </Typography>
                          </Box>
                          <Box>
                            <img
                              src={selectedStudents}
                              alt="Image description"
                            />
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Selected
                            </Typography>
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Students
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "42px",
                                fontWeight: 700,
                                color: "#008CE0",
                              }}
                            >
                              {panelistInfo?.selected_students}
                            </Typography>
                          </Box>
                          <Box>
                            <img
                              src={rejectedStudents}
                              alt="Image description"
                            />
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Rejected
                            </Typography>
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Students
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "42px",
                                fontWeight: 700,
                                color: "#008CE0",
                              }}
                            >
                              {panelistInfo?.rejected_students}
                            </Typography>
                          </Box>
                          <Box>
                            <img src={selectedRatio} alt="Image description" />
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Selection
                            </Typography>
                            <Typography
                              sx={{ fontSize: "18px", fontWeight: 500 }}
                            >
                              Ratio
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "42px",
                                fontWeight: 700,
                                color: "#008CE0",
                              }}
                            >
                              {panelistInfo?.selection_ratio}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  )}
                </>
              )}
            </Grid>
          )}
        </Grid>
        {selected.length > 0 && (
          <Box className="MOD-action-container">
            <Box className="MOD-action-wrapper">
              <Card className="MOD-action-card">
                <Box className="MOD-action-content-container">
                  <Box className="MOD-action-content">
                    <Typography variant="subtitle1">
                      {" "}
                      {selected.length} items selected
                    </Typography>
                  </Box>
                  <Box
                    onClick={() => setOpenDeleteDialog(true)}
                    className="MOD-action-content"
                  >
                    <DeleteOutlineIcon sx={{ color: "#008BE2" }} />
                    <Typography variant="subtitle1">Archive</Typography>
                  </Box>
                  <Box
                    onClick={() => {
                      handleUpdateStatus(true);
                    }}
                    className="MOD-action-content"
                  >
                    <BubbleChartIcon sx={{ color: "#008BE2" }} />
                    <Typography variant="subtitle1">Active</Typography>
                  </Box>
                  <Box
                    onClick={() => {
                      handleUpdateStatus(false);
                    }}
                    className="MOD-action-content"
                  >
                    <BubbleChartIcon sx={{ color: "gray" }} />
                    <Typography variant="subtitle1">Deactive</Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        )}
        {openCreateDialog && (
          <CreatePanelistDialog
            openCreateDialog={openCreateDialog}
            handleClose={handleClose}
            listOfCourses={listOfCourses}
            setListOfCourses={setListOfCourses}
            callFilterOptionApi={callFilterOptionApi}
            setCallFilterOptionApi={setCallFilterOptionApi}
            courseListInfo={courseListInfo}
            setUpdateLoading={setUpdateLoading}
            dataCourse={dataCourse}
            allValue={allValue}
            handleCheckAll={handleCheckAll}
            setPageNumber={setPageNumber}
            setFirstEnterPageLoading={setFirstEnterPageLoading}
            setCreateUserState={setCreateUserState}
            setAllDataFetched={setAllDataFetched}
          ></CreatePanelistDialog>
        )}
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={() => handleDeletePanelist()}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
          loading={deleteLoading}
        />
        <CreateInterviewDrawer
          openCreateInterview={openCreateInterview}
          setOpenCreateInterview={setOpenCreateInterview}
        />
      </Box>
    </Card>
  );
};

export default React.memo(ActivePanelistManager);
