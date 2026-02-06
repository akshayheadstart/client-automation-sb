import { CloseOutlined } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Drawer } from "rsuite";
import PanelEditOptions from "./PanelEditOptions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import PublishIcon from "../../icons/publish-icon.svg";
import SlotList from "./SlotList";
import PanelistAndApplications from "./PanelistAndApplications";
import { useState } from "react";
import InterviewTimeDetails from "./InterviewTimeDetails";
import SelectOption from "../../components/shared/SelectedStudent/SelectOption";
import useToasterHook from "../../hooks/useToasterHook";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GDSlotList from "./GDSlotList";
import PublishDialog from "../../components/PublishDialog/PublishDialog";
import SlotActions from "./SlotActions";
import { useSelector } from "react-redux";
import {
  useAssignApplicantOrPanelistToSlotMutation,
  useGetSlotOrPanelDetailsQuery,
  useHandleRescheduleApplicantMutation,
  useHandleUnassignApplicantsFromSlotsMutation,
  useHandleUnassignSinglePanelistOfApplicantMutation,
} from "../../Redux/Slices/filterDataSlice";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { slotAndPanelDateTimeFormat } from "../../hooks/useDateAndTimeFormat";
import UserImage from "../../icons/user-image.svg";
import {
  useDeleteSlotAndPanelMutation,
  usePublishSlotAndPanelMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import { customFetch } from "../StudentTotalQueries/helperFunction";
const PanelAndStudentLIstDetailsDrawer = ({
  openDrawer,
  setOpenDrawer,
  size,
  typeOfPanel,
  openReschedule,
  setOpenReschedule,
  setPanelOrSlot,
  setReschedule,
  setSelectedStudentsApplicationId,
  setSlotId,
  slotOrPanelId,
  preview,
  handleGetViewStudentInfoData,
  setCalendarFilterPayload,
}) => {
  const [formattedDateTime, setFormattedDateTime] = useState({});
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [panelOrSlotDetails, setPanelOrSlotsDetails] = useState({});
  const [allTheApplicants, setAllTheApplicants] = useState([]);
  const [hideSlots, setHideSlots] = useState(false);
  const [isSlotsInternalServerError, setIsSlotsInternalServeError] =
    useState(false);
  const [isSlotsSomethingWentWrong, setIsSlotsSomethingWentWrong] =
    useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [slotsPayload, setSlotsPayload] = useState({
    search_by_applicant: "",
    search_by_panelist: "",
    sort_by_twelve_marks: false,
  });
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [selectedPanelist, setSelectedPanelist] = useState({});
  const [gapBetweenSlots, setGapBetweenSlots] = useState({
    label: "30 min default",
    value: 30,
  });

  // Create default interviews and gaps
  const [scheduleData, setScheduleData] = useState([]);

  const [slotCountAndAvailableTime, setSlotCountAndAvailableTime] = useState(
    {}
  );

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const {
    data: slotsDetails,
    isError,
    error,
    isFetching,
    isSuccess,
    refetch,
  } = useGetSlotOrPanelDetailsQuery({
    collegeId,
    pageNumber,
    rowsPerPage,
    slotOrPanelId,
    payload: slotsPayload,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const {
    apiResponseChangeMessage,
    setApiResponseChangeMessage,
    setSelectedSlotId,
    selectedSlotId,
    selectedApplicant,
  } = useContext(DashboradDataContext);

  useEffect(() => {
    try {
      if (isSuccess) {
        setPanelOrSlotsDetails(slotsDetails);
        setAllTheApplicants(slotsDetails?.applicants[0]);
        setTotalApplicationsCount(slotsDetails?.total_applicants);
        setGapBetweenSlots({
          label: `${slotsDetails?.gap_between_slots} min ${
            slotsDetails?.gap_between_slots === 30 ? "(default)" : ""
          }`,
          value: slotsDetails?.gap_between_slots,
        });
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === "500") {
          handleInternalServerError(
            setIsSlotsInternalServeError,
            setHideSlots,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setIsSlotsSomethingWentWrong,
        setHideSlots,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, slotsDetails]);

  useEffect(() => {
    if (panelOrSlotDetails?.time) {
      const formattedDateTime = slotAndPanelDateTimeFormat(
        panelOrSlotDetails?.time
      );
      setFormattedDateTime(formattedDateTime);
    }
  }, [panelOrSlotDetails]);

  const pushNotification = useToasterHook();

  const [highlightedSlot, setHighlightedSlot] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openPublish, setOpenPublish] = React.useState(false);
  const [clickedOutsideOfAction, setClickedOutsideOfAction] = useState(false);
  const handlePublishClickOpen = () => {
    setSelectedSlots([panelOrSlotDetails?.id]);
    setOpenPublish(true);
  };

  const handleDragStart = (event, item) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const handleDragOver = (event, slot) => {
    event.preventDefault();
    setHighlightedSlot(slot);
  };

  const [assignApplicantOrPanelistToSlot] =
    useAssignApplicantOrPanelistToSlotMutation();
  const handleAssignApplicantOrPanelist = ({
    slotId,
    panelistId,
    applicationId,
  }) => {
    setOpenBackdrop(true);
    assignApplicantOrPanelistToSlot({
      slotId: slotId,
      panelistId: panelistId,
      applicationId: applicationId,
      collegeId,
    })
      .unwrap()
      .then((result) => {
        if (result?.message) {
          pushNotification("success", result?.message);
          refetch();
        } else if (result?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result?.detail) {
          pushNotification("warning", result?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
      });
  };
  const handleDrop = (event, slot, index) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));

    if (
      data?.application_id &&
      slot?.application_details?.length &&
      panelOrSlotDetails?.slot_type === "PI"
    ) {
      pushNotification("warning", "Slot is full.");
    } else {
      const payload = {
        slotId: slot?._id,
        applicationId: data?.application_id,
        panelistId: data?._id,
      };
      handleAssignApplicantOrPanelist(payload);
    }
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setOpenReschedule && setOpenReschedule(false);
    setSelectedSlots([]);
  };

  const handlePublishClose = () => {
    setOpenPublish(false);
  };
  const [handleUnassignApplicantsFromSlots] =
    useHandleUnassignApplicantsFromSlotsMutation();
  const handleUnassignApplicantsFromSlotsApiCall = () => {
    setOpenBackdrop(true);
    handleUnassignApplicantsFromSlots({
      collegeId,
      selectedSlots,
    })
      .unwrap()
      .then((result) => {
        pushNotification("success", result?.message);
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
        setSelectedSlots([]);
      });
  };

  const [handleUnassignSinglePanelistOfApplicant] =
    useHandleUnassignSinglePanelistOfApplicantMutation();
  const handleUnassignApplicantOrPanelist = (payload) => {
    setOpenBackdrop(true);
    handleUnassignSinglePanelistOfApplicant({
      collegeId,
      ...payload,
    })
      .unwrap()
      .then((result) => {
        pushNotification("success", result?.message);
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
        setSelectedSlots([]);
      });
  };

  const handleSaveInfo = () => {
    if (typeOfPanel) {
      if (selectedPanelist?.value) {
        handleAssignApplicantOrPanelist({
          slotId: panelOrSlotDetails?.slots[0]?._id,
          panelistId: selectedPanelist?.value,
        });
      } else {
        pushNotification("warning", "Please select panelist to save.");
      }
    }
  };

  const [deleteSlotAndPanel] = useDeleteSlotAndPanelMutation();
  const handleDeleteSlotAndPanel = () => {
    setOpenBackdrop(true);
    deleteSlotAndPanel({
      selectedId: {
        slots_panels_ids: selectedSlots,
      },
      collegeId: collegeId,
    })
      .unwrap()
      .then((result) => {
        pushNotification("success", result?.message);
        refetch();
        handleCloseDrawer();
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
        setSelectedSlots([]);
        setOpenDeleteDialog(false);
      });
  };

  const [publishSlotAndPanel] = usePublishSlotAndPanelMutation();
  const handlePublishSlotsOrPanel = () => {
    setOpenBackdrop(true);

    const payload = {
      slots_panels_ids: selectedSlots,
    };

    publishSlotAndPanel({
      selectedId: payload,
      collegeId: collegeId,
      date: "",
    })
      .unwrap()
      .then((result) => {
        pushNotification("success", result?.message);
        refetch();
        handleCloseDrawer();
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
        setSelectedSlots([]);
        clickedOutsideOfAction(false);
      });
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");

  const handleCreateNewSlot = (startingTime, endingTime) => {
    const payload = {
      slot_type: panelOrSlotDetails?.slot_type,
      user_limit: panelOrSlotDetails?.user_limit,
      panel_id: panelOrSlotDetails?.id,
      interview_mode: "NA",
      panelists: [],
      interview_list_id: panelOrSlotDetails?.interview_list_id,
      state: "",
      city: "",
      status: "",
      time: startingTime,
      end_time: endingTime,
    };

    setOpenBackdrop(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/planner/create_or_update_slot/?college_id=${collegeId}`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((res) => res.json())
      .then((data) => {
        try {
          if (data?.message) {
            if (typeof data?.message === "string") {
              pushNotification("success", data?.message);
              refetch();
            } else {
              throw new Error("Create slot api response has been changed.");
            }
          }
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.detail) {
            pushNotification("error", data?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSlotsSomethingWentWrong, "", 10000);
        }
      })
      .catch(() => {
        handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
      })
      .finally(() => {
        setOpenBackdrop(false);
      });
  };
  const handleSaveUpdatedSlots = (callAddNewSlotApi) => {
    setOpenBackdrop(true);
    const slotDetails = scheduleData
      ?.filter((data) => data?.type !== "gap" && data?.type !== "blank")
      .map((data) => ({
        slot_id: data?.id,
        slot_duration: data?.duration,
      }));

    const payload = {
      panel_id: panelOrSlotDetails?.id,
      gap_between_slot: gapBetweenSlots?.value ? gapBetweenSlots?.value : 30,
      updated_slot: slotDetails,
    };

    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/interview_list/slot_time_management`,
      ApiCallHeaderAndBody(token, "PUT", JSON.stringify(payload)),
      true
    )
      .then((res) => res.json())
      .then((data) => {
        try {
          if (data?.message) {
            if (typeof data?.message === "string") {
              if (callAddNewSlotApi) {
                callAddNewSlotApi();
              } else {
                pushNotification("success", data?.message);
                refetch();
              }
            } else {
              throw new Error("Create slot api response has been changed.");
            }
          }
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.detail) {
            pushNotification("error", error?.detail);
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSlotsSomethingWentWrong, "", 10000);
        }
      })
      .catch(() => {
        handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
      })
      .finally(() => {
        if (!callAddNewSlotApi) {
          setOpenBackdrop(false);
        }
      });
  };

  const [handleRescheduleApplicant] = useHandleRescheduleApplicantMutation();

  const handleRescheduleApplicantApiCall = () => {
    setOpenBackdrop(true);
    handleRescheduleApplicant({
      applicationId: selectedApplicant?.applicationId,
      originSlotId: selectedSlotId,
      reScheduleSlotId: panelOrSlotDetails?.id,
    })
      .unwrap()
      .then((result) => {
        if (result?.message) {
          pushNotification("success", result?.message);
          refetch();
          handleCloseDrawer();
        } else if (result?.detail) {
          pushNotification(result?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data.detail) {
          pushNotification("error", error?.data.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsSlotsInternalServeError, "", 10000);
        }
      })
      .finally(() => {
        setOpenBackdrop(false);
        setOpenPublish(false);
        setReschedule(false);
        setCalendarFilterPayload({
          filter_slot: [],
          program_name: [],
          slot_status: [],
          moderator: [],
          slot_state: "",
        });
      });
  };

  return (
    <Drawer
      open={openDrawer}
      onClose={() => handleCloseDrawer()}
      size={fullScreen ? "full" : size}
    >
      {isSlotsInternalServerError || isSlotsSomethingWentWrong ? (
        <Box className=".loading-animation-for-notification">
          {isSlotsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSlotsSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box className="panel-and-student-drawer-container">
          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader width={200} height={200} />
            </Box>
          ) : (
            <Box sx={{ display: hideSlots ? "none" : "block" }}>
              <Box sx={{ p: { md: 4, xs: 2 } }}>
                <Box className="panel-and-student-layout">
                  <Box>
                    <Typography variant="h6">
                      {panelOrSlotDetails?.name
                        ? panelOrSlotDetails?.name
                        : formattedDateTime?.formattedTime}
                    </Typography>
                    <Box className="panel-list-name-and-type">
                      <Typography variant="body2">
                        {panelOrSlotDetails.interview_list_name}
                      </Typography>
                      <Typography variant="body2">
                        {panelOrSlotDetails.slot_type}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="panel-and-student-layout">
                    <Typography variant="h5">
                      {formattedDateTime?.formattedDate}
                    </Typography>
                    <IconButton onClick={() => handleCloseDrawer()}>
                      <CloseOutlined />
                    </IconButton>
                  </Box>
                </Box>
                <Box
                  sx={{
                    justifyContent: typeOfPanel
                      ? "flex-start"
                      : "space-between",
                  }}
                  className="panel-edit-section"
                >
                  {typeOfPanel ? (
                    <>
                      <SelectOption
                        options={panelOrSlotDetails?.panelists?.map((list) => ({
                          label: list?.name,
                          value: list?._id,
                        }))}
                        size="small"
                        label="Panelist Name"
                        required={true}
                        width={200}
                        selectedPanelist={selectedPanelist}
                        onChange={(_, newValue) => {
                          if (newValue) {
                            setSelectedPanelist(newValue);
                          }
                        }}
                      />
                      {typeOfPanel === "gd" && (
                        <TextField
                          sx={{ width: 120 }}
                          label="Slot User Limit"
                          size="small"
                          value={panelOrSlotDetails?.user_limit}
                          readOnly={true}
                          color="info"
                        />
                      )}
                    </>
                  ) : (
                    <PanelEditOptions
                      panelOrSlotDetails={panelOrSlotDetails}
                      gapBetweenSlots={gapBetweenSlots}
                      setGapBetweenSlots={setGapBetweenSlots}
                      slotCountAndAvailableTime={slotCountAndAvailableTime}
                    />
                  )}
                  {openReschedule ? (
                    <button
                      onClick={() => {
                        setClickedOutsideOfAction(true);
                        handlePublishClickOpen();
                      }}
                      className="publish-button"
                    >
                      <CalendarMonthOutlinedIcon />
                      <Typography variant="body2"> Reschedule</Typography>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          if (
                            Math.sign(
                              slotCountAndAvailableTime?.remainingTime
                            ) === -1
                          ) {
                            pushNotification(
                              "warning",
                              "Ops!! Slot timing is not correct."
                            );
                          } else {
                            if (!typeOfPanel) {
                              handleSaveUpdatedSlots();
                            } else {
                              handleSaveInfo();
                            }
                          }
                        }}
                        className="save-button"
                      >
                        <Typography variant="body2">Save</Typography>
                      </button>
                      {panelOrSlotDetails?.status !== "published" && (
                        <button className="publish-button">
                          <img src={PublishIcon} alt="publish-icon" />
                          <Typography
                            onClick={() => {
                              setClickedOutsideOfAction(true);
                              handlePublishClickOpen();
                            }}
                            variant="body2"
                          >
                            {" "}
                            Publish
                          </Typography>
                        </button>
                      )}
                    </>
                  )}
                </Box>
                {!typeOfPanel && (
                  <InterviewTimeDetails
                    gapBetweenSlots={gapBetweenSlots}
                    setSlotCountAndAvailableTime={setSlotCountAndAvailableTime}
                    panelOrSlotDetails={panelOrSlotDetails}
                    handleCreateNewSlot={handleCreateNewSlot}
                    slotCountAndAvailableTime={slotCountAndAvailableTime}
                    scheduleData={scheduleData}
                    setScheduleData={setScheduleData}
                    handleSaveUpdatedSlots={handleSaveUpdatedSlots}
                  />
                )}
                {typeOfPanel === "gd" ? (
                  <GDSlotList
                    selectedSlots={selectedSlots}
                    preview={preview}
                    setSelectedSlots={(selected) => {
                      setSelectedSlots(selected);
                      setClickedOutsideOfAction(false);
                    }}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    slotList={panelOrSlotDetails?.slots}
                    highlightedSlot={highlightedSlot}
                    // setReschedule={setReschedule}
                    setPanelOrSlot={setPanelOrSlot}
                    handleCloseDrawer={handleCloseDrawer}
                    openReschedule={openReschedule}
                    setSelectedStudentsApplicationId={
                      setSelectedStudentsApplicationId
                    }
                    setSlotId={setSlotId}
                    handleUnassignApplicantOrPanelist={
                      handleUnassignApplicantOrPanelist
                    }
                    setSelectedSlotId={setSelectedSlotId}
                    handleGetViewStudentInfoData={handleGetViewStudentInfoData}
                  />
                ) : (
                  <SlotList
                    panelOrSlotDetails={panelOrSlotDetails}
                    selectedSlots={selectedSlots}
                    preview={preview}
                    setSelectedSlots={(selected) => {
                      setSelectedSlots(selected);
                      setClickedOutsideOfAction(false);
                    }}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    slotList={panelOrSlotDetails?.slots}
                    highlightedSlot={highlightedSlot}
                    typeOfPanel={typeOfPanel}
                    // setReschedule={setReschedule}
                    setPanelOrSlot={setPanelOrSlot}
                    handleCloseDrawer={handleCloseDrawer}
                    openReschedule={openReschedule}
                    setSelectedStudentsApplicationId={
                      setSelectedStudentsApplicationId
                    }
                    setSlotId={setSlotId}
                    handleUnassignApplicantOrPanelist={
                      handleUnassignApplicantOrPanelist
                    }
                    setSelectedSlotId={setSelectedSlotId}
                    handleGetViewStudentInfoData={handleGetViewStudentInfoData}
                  />
                )}
                {openReschedule ? (
                  <Box className="panelist-list-container">
                    <Box className="panelist-heading-and-search">
                      <Typography variant="h6">Applicants</Typography>
                    </Box>
                    <Grid
                      className="panelist-list-details"
                      container
                      spacing={2}
                    >
                      <Grid
                        item
                        md={4}
                        sm={6}
                        xs={12}
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          handlePublishClickOpen();
                          setClickedOutsideOfAction(true);
                        }}
                      >
                        <Box className="panelist-details-container">
                          <Box className="image">
                            <img src={UserImage} alt="Panelist" />
                          </Box>
                          <Box className="panelist-details">
                            <Box className="panelist-name-and-count">
                              <Typography variant="caption">
                                {selectedApplicant?.name}
                              </Typography>
                              <Typography variant="caption">
                                {selectedApplicant.count}
                              </Typography>
                            </Box>
                            <Typography className="user-role" variant="caption">
                              {selectedApplicant?.course_name
                                ? selectedApplicant?.course_name
                                : "N/A"}
                            </Typography>
                            <Typography variant="caption">
                              {selectedApplicant?.inter_info?.marks
                                ? selectedApplicant?.inter_info?.marks
                                : "N/A"}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <PanelistAndApplications
                    panelistList={panelOrSlotDetails?.panelists}
                    applicantsList={allTheApplicants}
                    handleDragStart={handleDragStart}
                    setHighlightedSlot={setHighlightedSlot}
                    typeOfPanel={typeOfPanel}
                    openReschedule={openReschedule}
                    setSlotsPayload={setSlotsPayload}
                    slotsPayload={slotsPayload}
                    slots={panelOrSlotDetails?.slots}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    totalApplicationsCount={totalApplicationsCount}
                  />
                )}
              </Box>
              <PublishDialog
                title={`Applicant is being ${
                  openReschedule ? "rescheduled" : "published"
                }`}
                openPublish={openPublish}
                handlePublishClose={handlePublishClose}
                handlePublishData={() => {
                  openReschedule
                    ? handleRescheduleApplicantApiCall()
                    : handlePublishSlotsOrPanel();
                }}
              ></PublishDialog>
              {selectedSlots.length > 0 && !clickedOutsideOfAction && (
                <SlotActions
                  handleUnassignApplicantsFromSlotsApiCall={
                    handleUnassignApplicantsFromSlotsApiCall
                  }
                  selectedSlot={selectedSlots.length}
                  handlePublishSlotsOrPanel={() => setOpenPublish(true)}
                  handleDeleteSlotAndPanel={setOpenDeleteDialog}
                />
              )}
            </Box>
          )}
        </Box>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color="info" />
      </Backdrop>
      <DeleteDialogue
        openDeleteModal={openDeleteDialog}
        handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        handleDeleteSingleTemplate={() => handleDeleteSlotAndPanel()}
        internalServerError={isSlotsInternalServerError}
        somethingWentWrong={isSlotsSomethingWentWrong}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />
    </Drawer>
  );
};

export default PanelAndStudentLIstDetailsDrawer;
