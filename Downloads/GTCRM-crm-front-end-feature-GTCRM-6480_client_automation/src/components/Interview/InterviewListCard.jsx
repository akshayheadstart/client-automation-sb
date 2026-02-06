import { Box, Checkbox, Grid, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import schoolCapIcon from "../../icons/school-cap-icon.svg";
import gdIcon from "../../icons/gd-icon.svg";
import piIcon from "../../icons/pi-icon.svg";
import personIcon from "../../icons/person-icon.svg";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { useEffect } from "react";
import {
  handleLocalStorageForCheckbox,
  singleCheckboxHandlerFunction,
} from "../../helperFunctions/checkboxHandleFunction";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";

export default function InterviewListCard({
  setOpenCreateInterview,
  interviewListData,
  isFetching,
  interviewListInternalServerError,
  interviewListSomethingWentWrong,
  hideInterviewList,
  selectedInterviewList,
  setSelectedInterviewList,
  localStorageKeyName,
}) {
  const navigate = useNavigate();

  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  // set selected users in state from local storage after reload
  useEffect(() => {
    handleLocalStorageForCheckbox(
      localStorageKeyName,
      setSelectedInterviewList
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageKeyName]);

  const slicedData = interviewListData?.slice(0, 7);

  return (
    <>
      {interviewListInternalServerError || interviewListSomethingWentWrong ? (
        <Box className="loading-animation-for-notification">
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
        <Box
          sx={{ mt: 2, visibility: hideInterviewList ? "hidden" : "visible" }}
        >
          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader
                height={150}
                width={150}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <>
              {slicedData?.length > 0 ? (
                <Grid container spacing={3}>
                  <Grid item md={3} sm={6} xs={12}>
                    <Box
                      onClick={() => setOpenCreateInterview(true)}
                      className="interview-list-first-card"
                    >
                      <Typography variant="h6">+</Typography>
                      <Typography variant="h6">Create List</Typography>
                    </Box>
                  </Grid>
                  {slicedData?.map((item) => (
                    <Grid key={item} item md={3} sm={6} xs={12}>
                      <Box className="interview-list-card">
                        <Box className="interview-list-card-top-items">
                          <Typography
                            variant="body2"
                            className={`${
                              item?.status?.toLowerCase() === "closed"
                                ? "closed-status-card"
                                : item?.status?.toLowerCase()
                            } interview-list-table-status`}
                          >
                            {item?.status}
                          </Typography>
                          <Checkbox
                            sx={{ p: 0 }}
                            checked={
                              selectedInterviewList?.includes(
                                item?.interview_id
                              )
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              singleCheckboxHandlerFunction(
                                e,
                                item?.interview_id,
                                localStorageKeyName,
                                selectedInterviewList,
                                setSelectedInterviewList
                              );
                            }}
                          />
                        </Box>
                        <Typography variant="body1">
                          {item?.list_name}
                        </Typography>
                        <Tooltip
                          title={
                            item?.course_name?.length > 30
                              ? item?.course_name
                              : ""
                          }
                          placement="top"
                        >
                          <Typography
                            variant="body2"
                            className="interview-list-card-item"
                          >
                            <img src={schoolCapIcon} alt="school icon" />
                            {item?.course_name?.length > 30
                              ? `${item?.course_name?.slice(0, 30)}...`
                              : item?.course_name}
                          </Typography>
                        </Tooltip>

                        <Box className="interview-list-counts">
                          <Typography
                            variant="body2"
                            className="interview-list-card-item"
                          >
                            <img src={personIcon} alt="school icon" />
                            {item?.total_count}
                          </Typography>

                          {item?.gd_count !== undefined && (
                            <Typography
                              variant="body2"
                              className="interview-list-card-item"
                            >
                              <img src={gdIcon} alt="school icon" />
                              {item?.gd_count !== null ? item?.gd_count : 0}
                            </Typography>
                          )}

                          {item?.pi_count !== undefined && (
                            <Typography
                              variant="body2"
                              className="interview-list-card-item"
                            >
                              <img src={piIcon} alt="school icon" />
                              {item?.pi_count !== null ? item?.pi_count : 0}
                            </Typography>
                          )}
                        </Box>

                        <Box className="interview-list-card-buttons">
                          <button
                            onClick={() =>
                              navigate("/view-interview-list", {
                                state: {
                                  id: item?.interview_id,
                                },
                              })
                            }
                          >
                            View List
                          </button>
                          <button
                            onClick={() =>
                              navigate("/selected-student", {
                                state: {
                                  id: item?.interview_id,
                                  program_name: item.course_name,
                                  interview_name: item.list_name,
                                },
                              })
                            }
                          >
                            Selected Student
                          </button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    minHeight: "55vh",
                    alignItems: "center",
                  }}
                  data-testid="not-found-animation-container"
                >
                  <BaseNotFoundLottieLoader
                    height={200}
                    width={200}
                    noContainer={true}
                  ></BaseNotFoundLottieLoader>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
}
