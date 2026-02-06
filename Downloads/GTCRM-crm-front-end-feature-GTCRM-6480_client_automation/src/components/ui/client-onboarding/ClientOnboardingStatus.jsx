import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import OnboardingStatusDialog from "./OnboardingStatusDialog";
import { useSelector } from "react-redux";
import OnboardingStatusSteps from "./OnboardingStatusSteps";
import { Box } from "@mui/material";
import { useGetCurrentUserDetailsQuery } from "../../../Redux/Slices/telephonySlice";

const ClientOnboardingStatus = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Client Onboarding Status");
    document.title = "Client Onboarding Status";
  }, [headTitle]);

  const [currentUserDetails, setCurrentUserDetails] = useState({});

  const {
    data: currentUserData,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetCurrentUserDetailsQuery();

  useEffect(() => {
    try {
      if (isSuccess) {
        if (currentUserData?.email) {
          setCurrentUserDetails(currentUserData);
        } else {
          throw new Error("User details API response has changed");
        }
      } else if (isError) {
        if (
          currentUserData?.data?.detail === "Could not validate credentials"
        ) {
          window.location.reload();
        } else if (currentUserData?.data?.detail) {
          pushNotification("error", currentUserData?.data?.detail);
        }
        if (error.status === 500) {
          navigate("/page500");
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, error, isFetching]);

  return (
    <Box sx={{ mt: 2 }}>
      <OnboardingStatusSteps
        selectedClientId={currentUserDetails?.associated_client}
      />
    </Box>
  );
};

export default ClientOnboardingStatus;
