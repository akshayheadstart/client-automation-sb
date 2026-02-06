import { Box, IconButton } from "@mui/material";
import React, { useRef } from "react";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import PoperComponent from "../../components/userProfile/PoperComponent";
import IndividualStep from "./IndividualStep";
import { useState } from "react";
import { useEffect } from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const LeadStageSteps = ({
  userProfileStepsInternalServerError,
  somethingWentWrongInUserProfileSteps,
  hideUserProfileSteps,
  apiResponseChangeMessage,
  userProfileStepsData,
  userProfileHeader,
}) => {
  const [overlayWidth, setOverlayWidth] = useState({});
  const [openPopper1, setOpenPopper1] = React.useState(false);
  const [anchorEl1, setAnchorEl1] = React.useState(null);

  const handleClickPopper1 = (event) => {
    setAnchorEl1(event.currentTarget);
    setOpenPopper1((previousOpen) => !previousOpen);
  };
  const [openPopper2, setOpenPopper2] = React.useState(false);
  const [anchorEl2, setAnchorEl2] = React.useState(null);

  const handleClickPopper2 = (event) => {
    setAnchorEl2(event.currentTarget);
    setOpenPopper2((previousOpen) => !previousOpen);
  };

  const [openPopper3, setOpenPopper3] = React.useState(false);
  const [anchorEl3, setAnchorEl3] = React.useState(null);

  const handleClickPopper3 = (event) => {
    setAnchorEl3(event.currentTarget);
    setOpenPopper3((previousOpen) => !previousOpen);
  };

  const [percentage, setPercentage] = useState(0);
  const [elementWidth, setElementWidth] = useState(0);

  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition((prevPosition) => Math.max(prevPosition - 100, 0));
  };

  const scrollRight = () => {
    setScrollPosition((prevPosition) => Math.min(prevPosition + 120, 400));
  };
  const handleSetOverlayWidth = (width) => {
    setElementWidth(width);
  };

  useEffect(() => {
    const stepProgress = [
      { enable: true },
      { enable: userProfileStepsData?.verify },
      { enable: userProfileStepsData?.application_started },
      { enable: userProfileStepsData?.payment_approved },
      { enable: userProfileStepsData?.application_submitted },
    ];
    for (let index = 0; index < stepProgress.length; index++) {
      if (!stepProgress[index].enable) {
        break;
      } else {
        setPercentage(elementWidth * (index + 1));
      }
    }
  }, [userProfileStepsData, elementWidth]);

  return (
    <>
      {userProfileStepsInternalServerError ||
      somethingWentWrongInUserProfileSteps ? (
        <Box sx={{ py: 4 }}>
          {userProfileStepsInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {somethingWentWrongInUserProfileSteps && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            display: hideUserProfileSteps ? "none" : "block",
            overflowX: "hidden",
            position: "relative",
          }}
        >
          <IconButton
            sx={{ color: "white", p: 0 }}
            onClick={scrollLeft}
            className="lead-stage-arrow-icon arrow-left"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Box>
            <Box
              sx={{ mb: 2, transition: "transform 0.3s ease" }}
              style={{
                transform: `translateX(-${scrollPosition}px)`,
              }}
              id="user-application-all-stages"
            >
              <Box
                className="step-progress-overlay"
                sx={{
                  width: `${percentage - 5}px`,
                }}
              ></Box>
              <Box className="all-stages-container">
                <IndividualStep
                  currentLabel={1}
                  isDisable={false}
                  title="Unverified"
                  handleSetOverlayWidth={handleSetOverlayWidth}
                />

                <IndividualStep
                  isDisable={!userProfileStepsData?.verify}
                  title="Verified"
                />

                <IndividualStep
                  isDisable={!userProfileStepsData?.application_started}
                  title="Application Started"
                  stepData={userProfileStepsData?.application_started}
                  handleClickPopper={handleClickPopper1}
                />

                <IndividualStep
                  isDisable={!userProfileStepsData?.payment_approved}
                  title="Payment Approved"
                  stepData={userProfileStepsData?.payment_approved}
                  handleClickPopper={handleClickPopper2}
                />

                <IndividualStep
                  last={true}
                  isDisable={!userProfileStepsData?.application_submitted}
                  title="Application Submitted"
                  stepData={userProfileStepsData?.application_submitted}
                  handleClickPopper={handleClickPopper3}
                />
              </Box>
            </Box>
          </Box>
          <IconButton
            sx={{ color: "white", p: 0 }}
            onClick={scrollRight}
            className="lead-stage-arrow-icon arrow-right"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
      <Box>
        <PoperComponent
          openPopper={openPopper1}
          index={1}
          anchorEl={anchorEl1}
          title={userProfileStepsData?.course}
          percentage={userProfileStepsData?.application_stage}
          subText={userProfileHeader?.basic_info?.application_stage}
        ></PoperComponent>
        <PoperComponent
          openPopper={openPopper2}
          index={2}
          anchorEl={anchorEl2}
          title={
            userProfileStepsData?.payment_approved >= 1 &&
            userProfileStepsData?.course
          }
        ></PoperComponent>
        <PoperComponent
          openPopper={openPopper3}
          index={3}
          anchorEl={anchorEl3}
          title={
            userProfileStepsData?.application_submitted >= 1 &&
            userProfileStepsData?.course
          }
        ></PoperComponent>
      </Box>
    </>
  );
};

export default LeadStageSteps;
