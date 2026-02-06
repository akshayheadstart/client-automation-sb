import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box } from "@mui/material";
import "../../styles/clientOnboardingStyles.css";
import AdditionalDetailsForm from "../../components/ui/client-onboarding/AdditionalDetails/AdditionalDetailsForm";
import ModuleSubscriptionTable from "../../components/ui/client-onboarding/ModuleSubscriptionTable/ModuleSubscriptionTable";
import CourseDetailsForm from "../../components/ui/client-onboarding/CourseDetails/CourseDetailsForm";
import ColorThemesForm from "../ColorThemesForm/ColorThemesForm";
import ClientDefaultForm from "../../components/ui/client-onboarding/ClientDefaultForm";
import CollegeBasicInfo from "../../components/ui/client-onboarding/CollegeBasicInfo";
import { useSelector } from "react-redux";
import { useGetCurrentUserDetailsQuery } from "../../Redux/Slices/telephonySlice";

const ClientOnboarding = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Create College");
    document.title = "Create College";
  }, [headTitle]);

  const userId = useSelector((state) => state.authentication.token?.user_id);

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

  const [currentSectionIndex, setCurrentSectionIndex] = useState(() => {
    const storedIndex = localStorage.getItem(
      `${userId}createCollegeSectionIndex`
    );
    return storedIndex !== null ? Number(storedIndex) : 0; // default is 0
  });
  const [createdCollegeId, setCreatedCollegeId] = useState();
  const [additionalPreferenceFields, setAdditionalPreferenceFields] = useState(
    []
  );

  useEffect(() => {
    if (!createdCollegeId) {
      const storedCollegeId = localStorage.getItem(`${userId}createdCollegeId`);
      if (storedCollegeId) {
        setCreatedCollegeId(storedCollegeId);
      }
    }
  }, [createdCollegeId]);

  return (
    <Box sx={{ mx: 3.5, mt: 7, mb: 3.5 }}>
      {currentSectionIndex === 0 && (
        <CollegeBasicInfo
          currentSectionIndex={currentSectionIndex}
          setCurrentSectionIndex={setCurrentSectionIndex}
          setCreatedCollegeId={setCreatedCollegeId}
          hideBackBtn={true}
        />
      )}

      {currentSectionIndex === 1 && (
        <Box sx={{ my: 4 }}>
          <CourseDetailsForm
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            additionalPreferenceFields={additionalPreferenceFields}
            setAdditionalPreferenceFields={setAdditionalPreferenceFields}
            collegeId={createdCollegeId}
          />
        </Box>
      )}

      {currentSectionIndex === 2 && (
        <ClientDefaultForm
          currentSectionIndex={currentSectionIndex}
          setCurrentSectionIndex={setCurrentSectionIndex}
          collegeId={createdCollegeId}
          apiCallingStepValue={2}
          additionalPreferenceFields={additionalPreferenceFields}
          clientId={currentUserDetails?.associated_client}
        />
      )}

      {currentSectionIndex === 3 && (
        <AdditionalDetailsForm
          currentSectionIndex={currentSectionIndex}
          setCurrentSectionIndex={setCurrentSectionIndex}
          collegeId={createdCollegeId}
        />
      )}

      {currentSectionIndex === 4 && (
        <Box sx={{ my: 4 }}>
          <ColorThemesForm
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            userId={userId}
            collegeId={createdCollegeId}
            defaultColor={true}
          />
        </Box>
      )}
      {currentSectionIndex === 5 && (
        <Box sx={{ my: 4 }}>
          <ModuleSubscriptionTable
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            hideNextBtn={true}
            collegeId={createdCollegeId}
            clientId={currentUserDetails?.associated_client}
          />
        </Box>
      )}
    </Box>
  );
};

export default ClientOnboarding;
