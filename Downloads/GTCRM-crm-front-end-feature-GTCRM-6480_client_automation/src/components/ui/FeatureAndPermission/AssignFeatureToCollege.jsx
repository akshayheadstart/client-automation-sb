import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import useCommonErrorHandling from "../../../hooks/useCommonErrorHandling";
import AssignFeatureAndPermissionDialog from "../../../pages/FeatureAndPermission/AssignFeatureAndPermissionDialog";
import { useGetCollegeListQuery } from "../../../Redux/Slices/applicationDataApiSlice";
import { useAssignCollegeFeatureAndPermissionMutation } from "../../../Redux/Slices/clientOnboardingSlice";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";

const AssignFeatureToCollege = ({ selectedFeatures }) => {
  const [collegeLists, setCollegeLists] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState({});
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [openAssignFeaturesDialog, setOpenAssignFeaturesDialog] =
    useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const handleError = useCommonErrorHandling();
  const pushNotification = useToasterHook();

  const [assignCollegeFeatureAndPermission] =
    useAssignCollegeFeatureAndPermissionMutation();

  const { data, isSuccess, isError, error } = useGetCollegeListQuery();

  useEffect(() => {
    if (isSuccess) {
      const collegeList = [];
      data?.data.forEach((college) => {
        collegeList.push({
          label: college.name,
          value: college.id,
        });
      });
      setCollegeLists(collegeList);
    } else if (isError) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
    }
  }, [data, isSuccess, isError, error]);

  //Assign College APi implementation here
  const handleAssignCollege = () => {
    setIsLoadingAssign(true);
    assignCollegeFeatureAndPermission({
      collegeId: selectedCollege?.value,
      dashboardType: "admin_dashboard",
      payload: { screen_details: selectedFeatures },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setOpenAssignFeaturesDialog(false);
          } else {
            throw new Error(
              "Role for assign feature and permission API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        handleError({ error, setIsInternalServerError });
      })
      .finally(() => {
        setIsLoadingAssign(false);
      });
  };

  const infoDataForCollege = {
    optionsList:[{
      options: collegeLists,
      label: "Select College",
      setSelectedOption: setSelectedCollege,
      selectedValue: selectedCollege,
    }],
    handleFunction: handleAssignCollege,
    loading: isLoadingAssign,
    isInternalServerError,
    isSomethingWentWrong,
  };
  return (
    <>
      <Box
        onClick={setOpenAssignFeaturesDialog}
        className="lead-action-content"
      >
        Assign to College
      </Box>
      {openAssignFeaturesDialog && (
        <AssignFeatureAndPermissionDialog
          openAssignFeaturesAndPermission={openAssignFeaturesDialog}
          handleClose={() => setOpenAssignFeaturesDialog(false)}
          infoData={infoDataForCollege}
        />
      )}
    </>
  );
};

export default AssignFeatureToCollege;
