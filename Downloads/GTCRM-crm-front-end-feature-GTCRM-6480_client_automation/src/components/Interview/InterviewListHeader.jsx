import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import HorizontalCharts from "../CustomCharts/HorizontalCharts";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import CreateInterviewDrawer from "./CreateInterviewDrawer";
import { useGetInterviewListHeaderDataQuery } from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import SearchInputField from "../shared/forms/SearchInputField";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    background: "grey",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
  "& .Mui-checked": {
    color: "#fff !important",
  },
}));

const InterviewListHeader = ({
  openCreateInterview,
  setOpenCreateInterview,
  setSearchText,
  searchText,
}) => {
  const pushNotification = useToasterHook();
  const navigate = useNavigate();

  const [clickedSearchIcon, setClickedSearchIcon] = useState(false);

  const [archivedSwitchChecked, setArchivedSwitchChecked] = useState(false);

  const [showSlotText, setShowSlotText] = useState(false);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [interviewListHeaderData, setInterviewListHeaderData] = useState({});

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [hideHeader, setHideHeader] = useState(false);
  const [
    interviewListInternalServerError,
    setInterviewListInternalServerError,
  ] = useState(false);
  const [interviewListSomethingWentWrong, setInterviewListSomethingWentWrong] =
    useState(false);

  const {
    data: headerData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetInterviewListHeaderDataQuery({ archivedSwitchChecked, collegeId });

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = headerData;
        if (
          typeof expectedData === "object" &&
          expectedData !== null &&
          !Array.isArray(expectedData)
        ) {
          setInterviewListHeaderData(headerData);
        } else {
          throw new Error("Interview list header API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setInterviewListInternalServerError,
            setHideHeader,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setInterviewListSomethingWentWrong,
        setHideHeader,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData, error, isError, isSuccess]);

  const listData = [
    {
      plotName: "Active",
      value: interviewListHeaderData?.active_interview_list,
      color: "white",
    },
    {
      plotName: "Closed",
      value: interviewListHeaderData?.close_interview_list,
      color: "#00465F",
    },
  ];
  const interviewData = [
    {
      plotName: "Selected",
      value: interviewListHeaderData?.selected_candidate_count,
      color: "white",
    },
    {
      plotName: "Rejected",
      value: interviewListHeaderData?.rejected_candidate_count,
      color: "#008be2",
    },
    {
      plotName: "Hold",
      value: interviewListHeaderData?.hold_candidate_count,
      color: "#00465F",
    },
  ];

  return (
    <>
      {interviewListInternalServerError || interviewListSomethingWentWrong ? (
        <Box className=".loading-animation-for-notification">
          {interviewListInternalServerError && (
            <Error500Animation height={300} width={300}></Error500Animation>
          )}
          {interviewListSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box className="loading-animation-for-interview-header">
              <LeefLottieAnimationLoader
                height={100}
                width={100}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <Grid
              container
              spacing={0}
              columns={{ xs: 4, sm: 8.1, md: 12.1 }}
              sx={{
                backgroundColor: `#11bed2`,
                borderRadius: "12px",
                pb: 2,
                display: hideHeader && "none",
              }}
            >
              <Grid item xs={4} sm={4} md={3}>
                <Box className="interview-header-box">
                  <Box className="header-slot-gd-Title">Slots / GD&amp;PI</Box>
                  <Typography variant="h1" id="header-slot-gd-Title-Percentage">
                    {interviewListHeaderData?.percentage_available_slot}%
                  </Typography>
                  <Box
                    className={`element`}
                    onMouseEnter={() => setShowSlotText(true)}
                    onMouseLeave={() => setShowSlotText(false)}
                  >
                    <span id="header-slot-gd-Slots-available">
                      {interviewListHeaderData?.slot_available}/
                    </span>
                    <span id="header-slot-gd-Slots-interview">
                      {interviewListHeaderData?.total_candidate_count}
                    </span>
                  </Box>

                  {showSlotText && (
                    <Box className="header-slot-hover-text">
                      Available Slots/ Interviews to be done
                    </Box>
                  )}
                </Box>
              </Grid>
              <Box className="interview-header-divider-box">
                <Divider
                  sx={{
                    display: { xs: "none", sm: "block", md: "block" },
                    height: "95px",
                    "&.MuiDivider-root": {
                      borderColor: "#0080C9",
                      borderWidth: "1.5px",
                    },
                  }}
                  className="interview-header-divider"
                  orientation="vertical"
                  flexItem
                ></Divider>
              </Box>

              <Grid item xs={4} sm={4} md={3}>
                <Box className="interview-header-box">
                  <Box className="header-slot-gd-Title">Lists</Box>
                  <Box className="header-slot-gd-Title-sub-title">
                    {interviewListHeaderData?.total_interview_list}
                  </Box>
                  <Box className="interview-list-vertical-representation">
                    <HorizontalCharts data={listData}></HorizontalCharts>
                  </Box>
                </Box>
              </Grid>
              <Box className="interview-header-divider-box">
                <Divider
                  sx={{
                    display: { xs: "none", sm: "none", md: "block" },
                    height: "95px",
                    "&.MuiDivider-root": {
                      borderColor: "#0080C9",
                      borderWidth: "1.5px",
                    },
                  }}
                  className="interview-header-divider"
                  orientation="vertical"
                  flexItem
                ></Divider>
              </Box>
              <Grid item xs={4} sm={4} md={3}>
                <Box className="interview-header-box">
                  <Box className="header-slot-gd-Title">Interviews</Box>
                  <Box className="header-slot-gd-Title-sub-title">
                    {interviewListHeaderData?.total_interview_list}
                  </Box>
                  <Box className="interview-list-vertical-representation">
                    <HorizontalCharts data={interviewData}></HorizontalCharts>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} md={3}>
                <Box className="interview-header-box">
                  <Box
                    sx={{
                      display: "flex",
                      gap: "15px",
                      flexDirection: clickedSearchIcon ? "column" : "row",
                      justifyContent: "center",
                      alignItems: "Center",
                    }}
                  >
                    <Box>
                      <ClickAwayListener
                        onClickAway={() => setClickedSearchIcon(false)}
                      >
                        <Box>
                          {clickedSearchIcon ? (
                            <SearchInputField
                              setSearchText={setSearchText}
                              searchText={searchText}
                              maxWidth={220}
                            />
                          ) : (
                            <Box
                              onClick={() => setClickedSearchIcon(true)}
                              className="interview-list-search-container"
                            >
                              <SearchOutlinedIcon />
                            </Box>
                          )}
                        </Box>
                      </ClickAwayListener>
                    </Box>

                    <Button
                      onClick={() => setOpenCreateInterview(true)}
                      className="interviewList-create-list-button"
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{ minWidth: clickedSearchIcon && "220px" }}
                    >
                      Create List
                    </Button>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Button
                      className="interviewList-manage-pannel-button"
                      variant="contained"
                      onClick={() => navigate("/planner")}
                    >
                      Manage Panel and Slots
                    </Button>
                  </Box>
                  <Box className="archived-lists-switch-box">
                    <FormControlLabel
                      className="archived-lists-switch-label "
                      control={
                        <Android12Switch
                          checked={archivedSwitchChecked}
                          onChange={(e) =>
                            setArchivedSwitchChecked(e.target.checked)
                          }
                        />
                      }
                      label="Archived Lists"
                    />
                  </Box>
                </Box>
              </Grid>
              {openCreateInterview && (
                <CreateInterviewDrawer
                  openCreateInterview={openCreateInterview}
                  setOpenCreateInterview={setOpenCreateInterview}
                />
              )}
            </Grid>
          )}
        </>
      )}
    </>
  );
};

export default InterviewListHeader;
