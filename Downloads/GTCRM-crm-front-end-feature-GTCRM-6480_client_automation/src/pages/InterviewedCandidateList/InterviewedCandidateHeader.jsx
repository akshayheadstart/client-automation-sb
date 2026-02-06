import { Box } from "@mui/material";
import React, { useState } from "react";
import HeadingDetails from "../../components/shared/InterviewedCandidate/HeadingDetails";
import DoneIcon from "../../icons/InterviewCandidate/done.svg";
import SelectedIcon from "../../icons/InterviewCandidate/selected.svg";
import PendingIcon from "../../icons/InterviewCandidate/pending.svg";
import RejectedIcon from "../../icons/InterviewCandidate/rejected.svg";
import useToasterHook from "../../hooks/useToasterHook";
import { useSelector } from "react-redux";
import { useGetInterviewedCandidateHeaderDetailsQuery } from "../../Redux/Slices/filterDataSlice";
import { useEffect } from "react";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";

function InterviewedCandidateHeader() {
  const [headerDetails, setHeaderDetails] = useState({});
  const [hideHeader, setHideHeader] = useState(false);
  const [headerSomethingWentWrong, setHeaderSomethingWentWrong] =
    useState(false);
  const [headerInternalServerError, setHeaderInternalServerError] =
    useState(false);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const { data, isFetching, error, isError, isSuccess } =
    useGetInterviewedCandidateHeaderDetailsQuery({ collegeId });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof data === "object") {
          setHeaderDetails(data);
        } else {
          throw new Error(
            "Interviewed candidate header api's response has been changed."
          );
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setHeaderInternalServerError,
            setHideHeader,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setHeaderSomethingWentWrong,
        setHideHeader,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, isError, error]);

  return (
    <Box>
      {headerInternalServerError || headerSomethingWentWrong ? (
        <Box className="loading-animation-for-notification">
          {headerInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {headerSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <>
          {isFetching ? (
            <Box className="loading-animation-for-notification">
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </Box>
          ) : (
            <Box
              sx={{
                px: { md: 4, xs: 3 },
                py: { md: 5, xs: 3 },
                display: hideHeader ? "none" : "block",
              }}
              className="interviewed-candidate-header"
            >
              <Box className="interviewed-header-item">
                <HeadingDetails
                  title={"Interviews Done"}
                  count={headerDetails?.interview_done}
                  src={DoneIcon}
                />
                <Box className={`interviewed-vertical-line line1`}></Box>
                <HeadingDetails
                  title={"Selected Candidates"}
                  count={headerDetails?.selected_candidate}
                  src={SelectedIcon}
                />
                <Box className={`interviewed-vertical-line line2`}></Box>
                <HeadingDetails
                  title={"Pending For Reviews"}
                  count={headerDetails?.pending_for_review}
                  src={PendingIcon}
                />
                <Box className={`interviewed-vertical-line line3`}></Box>
                <HeadingDetails
                  title={"Rejected Candidates"}
                  count={headerDetails?.rejected_candidate}
                  src={RejectedIcon}
                />
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

export default InterviewedCandidateHeader;
