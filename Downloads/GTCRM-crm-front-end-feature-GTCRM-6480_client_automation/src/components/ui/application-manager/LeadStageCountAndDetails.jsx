/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, Typography } from "@mui/material";
import React, { useContext } from "react";
import { useState } from "react";
import LeadStageDetailsTableDrawer from "./LeadStageDetailsTableDrawer";
import { useSelector } from "react-redux";
import { useGetLeadAndApplicationStageCountQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useEffect } from "react";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";

function LeadStageCountAndDetails({
  fromApplication,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
  loadingLeadProfileHeader,
  openTodayAssignedByDefault,
  openRedirectByDefault,
}) {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const selectedSeason = useSelector(
    (state) => state.authentication.selectedSeason
  );
  const seasonId = selectedSeason?.length
    ? JSON.parse(selectedSeason)?.season_id
    : "";
  const applicationStageCountURL = `/application_wrapper/today_application_count?season=${seasonId}&college_id=${collegeId}`;
  const leadStageCountURL = `/lead/show_today_lead_data/?season=${seasonId}&college_id=${collegeId}`;
  const [openLeadStageDrawer, setOpenLeadStageDrawer] = useState(false);
  const [clickedLeadStage, setClickedLeadStage] = useState({});
  const [stageCount, setStageCount] = useState({});
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const pushNotification = useToasterHook();
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { isSuccess, isError, error, data, isFetching } =
    useGetLeadAndApplicationStageCountQuery({
      URL: fromApplication ? applicationStageCountURL : leadStageCountURL,
    });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          setStageCount(data);
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, data]);

  useEffect(() => {
    if (clickedLeadStage?.title) {
      setUserDetailsStateData((prevState) => ({
        ...prevState,
        eventType: clickedLeadStage?.title,
        title: clickedLeadStage?.title,
      }));
    }
  }, [loadingLeadProfileHeader, clickedLeadStage?.title]);

  useEffect(() => {
    if (openTodayAssignedByDefault) {
      setClickedLeadStage({
        title: "today_assigned",
      });
      setOpenLeadStageDrawer(true);
    }
  }, [openTodayAssignedByDefault]);
  useEffect(() => {
    if (openRedirectByDefault) {
      setClickedLeadStage({
        title: openRedirectByDefault,
      });
      setOpenLeadStageDrawer(true);
    }
  }, [openRedirectByDefault]);
  return (
    <Card
      sx={{ mb: 2, mt: 3, p: 3 }}
      className="lead-stage-count-container common-box-shadow "
    >
      {isInternalServerError || isSomethingWentWrong ? (
        <Box>
          {isInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box
              sx={{ minHeight: "20vh" }}
              className="loading-lottie-file-container"
            >
              <LeefLottieAnimationLoader width={100} height={100} />
            </Box>
          ) : (
            <>
              {Object.keys(stageCount)?.length ? (
                <>
                  {Object.keys(stageCount).map((stage, index) => (
                    <>
                      {stage !== "_id" && (
                        <Box
                          key={stage}
                          onClick={() => {
                            setClickedLeadStage({
                              index: index,
                              title: stage,
                            });
                            setOpenLeadStageDrawer(true);
                          }}
                          className={`lead-stage-count-container lead-stage-details ${
                            stage === clickedLeadStage?.title
                              ? "filter-header-items-active"
                              : ""
                          }`}
                        >
                          <Typography>{stage?.split("_").join(" ")}</Typography>
                          <Typography>({stageCount[stage]})</Typography>
                        </Box>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <Box
                  sx={{ minHeight: "20vh" }}
                  className="loading-lottie-file-container"
                >
                  <BaseNotFoundLottieLoader width={150} height={150} />
                </Box>
              )}
            </>
          )}
        </>
      )}

      {openLeadStageDrawer && (
        <LeadStageDetailsTableDrawer
          openLeadStageDrawer={openLeadStageDrawer}
          setOpenLeadStageDrawer={setOpenLeadStageDrawer}
          clickedLeadStage={clickedLeadStage}
          setClickedLeadStage={setClickedLeadStage}
          fromApplication={fromApplication}
          handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
          setUserDetailsStateData={setUserDetailsStateData}
        />
      )}
    </Card>
  );
}

export default LeadStageCountAndDetails;
