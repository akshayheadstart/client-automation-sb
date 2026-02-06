import React, { useContext, useEffect, useState } from "react";
import ClientDefaultForm from "../ClientDefaultForm";
import { LayoutSettingContext } from "../../../../store/contexts/LayoutSetting";
import { Box } from "@mui/material";
import ModuleSubscriptionTable from "../ModuleSubscriptionTable/ModuleSubscriptionTable";
import { useSelector } from "react-redux";
import { useGetCurrentUserDetailsQuery } from "../../../../Redux/Slices/telephonySlice";

const FormManagement = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(() => {
    const storedIndex = localStorage.getItem(
      `${userId}formManagementSectionIndex`
    );
    return storedIndex !== null ? Number(storedIndex) : 0; // default is 0
  });

  useEffect(() => {
    setHeadTitle("Form Management");
    document.title = "Form Management";
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
    <>
      <Box sx={{ mx: currentSectionIndex === 1 ? 0 : 3.5, mt: 7, mb: 3.5 }}>
        {currentSectionIndex === 0 && (
          <ClientDefaultForm
            currentSectionIndex={currentSectionIndex}
            setCurrentSectionIndex={setCurrentSectionIndex}
            apiCallingStepValue={0}
            hideBackBtn={true}
            clientId={currentUserDetails?.associated_client}
            from="form-management"
          />
        )}

        {currentSectionIndex === 1 && (
          <Box sx={{ my: 4 }}>
            <ModuleSubscriptionTable
              currentSectionIndex={currentSectionIndex}
              setCurrentSectionIndex={setCurrentSectionIndex}
              hideNextBtn={true}
              clientId={currentUserDetails?.associated_client}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default FormManagement;
