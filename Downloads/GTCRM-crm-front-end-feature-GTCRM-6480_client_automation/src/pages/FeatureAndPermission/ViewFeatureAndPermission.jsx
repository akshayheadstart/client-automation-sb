import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box, Card } from "@mui/material";
import "../../styles/clientOnboardingStyles.css";
import ViewDashboardWiseFeatureAndPermission from "../../components/ui/FeatureAndPermission/ViewDashboardWiseFeatureAndPermission";
import { useLocation } from "react-router-dom";
import AssignFeatureAndPermissionDialog from "./AssignFeatureAndPermissionDialog";
import { useGetCollegeListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { useGetEmailTemplateUserRoleQuery } from "../../Redux/Slices/filterDataSlice";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import {
  useAssignCollegeFeatureAndPermissionMutation,
  useAssignRoleFeatureAndPermissionMutation,
  useGetAssociatedPermissionsRoleQuery,
  useGetSpecificGroupDetailsQuery,
} from "../../Redux/Slices/clientOnboardingSlice";

const ViewFeatureAndPermission = () => {
  const { state } = useLocation();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  const [openAssignFeaturesAndPermission, setOpenAssignFeaturesAndPermission] =
    React.useState(false);
  const [forStudentSection, setForStudentSection] = React.useState(false);
  useEffect(() => {
    if (state?.groupDetails?.group_id) {
      setHeadTitle("View Grouped Feature & Permission");
      document.title = "View Grouped Feature & Permission";
    } else {
      setHeadTitle("View Feature & Permission");
      document.title = "View Feature & Permission";
    }
  }, [headTitle, state]);
  const pushNotification = useToasterHook();
  const [
    selectedStudentDashboardFeatures,
    setSelectedStudentDashboardFeatures,
  ] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [actionTitle, setActionTitle] = useState("");
  const [collegeLists, setCollegeLists] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [userRoleList, setUserRoleList] = useState([]);
  useEffect(() => {
    if (state?.groupDetails?.group_id) {
      setActionTitle("Edit Group Feature");
    } else {
      setActionTitle("Create Group Feature");
    }
  }, [state]);
  const handleClickOpen = (infoTrigger) => {
    setForStudentSection(infoTrigger);
    setOpenAssignFeaturesAndPermission(true);
  };

  const handleClose = () => {
    setOpenAssignFeaturesAndPermission(false);
  };

  const {
    data: featureData,
    isSuccess: isFeatureSuccess,
    isError: isFeatureError,
    error: featureError,
    isFetching: isFeatureFetching,
  } = useGetSpecificGroupDetailsQuery(
    {
      groupId: state?.groupDetails?.group_id,
    },
    {
      skip: !state?.groupDetails?.group_id,
    }
  );

  useEffect(() => {
    if (isFeatureSuccess) {
      setSelectedFeatures(featureData?.data);
    } else if (isFeatureError) {
      setSelectedFeatures([]);
      if (featureError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (featureError?.data?.detail) {
        pushNotification("error", featureError?.data?.detail);
      }
    }
  }, [isFeatureSuccess, featureData, isFeatureError, featureError]);

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
  //User Role List API implementation here
  const {
    data: dataRole,
    isSuccess: isSuccessRole,
    isError: isErrorRole,
    error: errorRole,
  } = useGetAssociatedPermissionsRoleQuery({ collegeId: collegeId });
  useEffect(() => {
    if (isSuccessRole) {
      const roleList = [];
      dataRole?.data.forEach((role) => {
        roleList.push({
          label: role?.name?.split("_")?.join(" "),
          value: role?.mongo_id,
        });
      });
      setUserRoleList(roleList);
    } else if (isErrorRole) {
      if (errorRole?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (errorRole?.data?.detail) {
        pushNotification("error", errorRole?.data?.detail);
      }
    }
  }, [dataRole, isSuccessRole, isErrorRole, errorRole]);

  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [
    somethingWentWrongInAllApplication,
    setSomethingWentWrongInAllApplication,
  ] = useState(false);
  const [
    allApplicationInternalServerError,
    setAllApplicationInternalServerError,
  ] = useState(false);

  //Assign Role APi implementation here
  const [assignRoleFeatureAndPermission] =
    useAssignRoleFeatureAndPermissionMutation();
  const handleAssignRole = () => {
    setUpdateStatusLoading(true);
    assignRoleFeatureAndPermission({
      collegeId: selectedCollege?.value,
      roleId: selectedRole?.value,
      dashboardType: "admin_dashboard",
      payload: { screen_details: selectedFeatures },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setSelectedFeatures([]);
            setOpenAssignFeaturesAndPermission(false);
            setSelectedCollege([]);
            setSelectedRole({});
          } else {
            throw new Error(
              "Role for assign feature and permission API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };

  //Assign College APi implementation here
  const [assignCollegeFeatureAndPermission] =
    useAssignCollegeFeatureAndPermissionMutation();
  const handleAssignCollege = () => {
    setUpdateStatusLoading(true);
    assignCollegeFeatureAndPermission({
      collegeId: selectedCollege?.value,
      dashboardType: "student_dashboard",
      payload: { screen_details: selectedStudentDashboardFeatures },
    })
      .unwrap()
      .then((response) => {
        try {
          if (response.message) {
            pushNotification("success", response.message);
            setSelectedStudentDashboardFeatures([]);
            setOpenAssignFeaturesAndPermission(false);
            setSelectedCollege([]);
          } else {
            throw new Error(
              "Role for assign feature and permission API response has been changed."
            );
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(
            setSomethingWentWrongInAllApplication,
            "",
            5000
          );
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(
            setAllApplicationInternalServerError,
            "",
            10000
          );
        }
      })
      .finally(() => {
        setUpdateStatusLoading(false);
      });
  };
  const infoDataForCollege = {
    optionsList: [
      {
        options: collegeLists,
        label: "Select College",
        setSelectedOption: setSelectedCollege,
        selectedValue: selectedCollege,
        required: true,
      },
    ],
    handleFunction: handleAssignCollege,
    loading: updateStatusLoading,
    isInternalServerError: allApplicationInternalServerError,
    isSomethingWentWrong: somethingWentWrongInAllApplication,
  };
  const infoDataForRole = {
    optionsList: [
      {
        options: userRoleList,
        label: "Select Role",
        setSelectedOption: setSelectedRole,
        selectedValue: selectedRole,
        required: true,
      },
      {
        options: collegeLists,
        label: "Select College",
        setSelectedOption: setSelectedCollege,
        selectedValue: selectedCollege,
        required: false,
      },
    ],
    handleFunction: handleAssignRole,
    loading: updateStatusLoading,
    isInternalServerError: allApplicationInternalServerError,
    isSomethingWentWrong: somethingWentWrongInAllApplication,
  };
  return (
    <Box sx={{ my: 8, mx: 3 }}>
      {!state?.groupDetails?.group_id && (
        <ViewDashboardWiseFeatureAndPermission
          title="View Student Dashboard Feature and Permission"
          dashboardType="student_dashboard"
          selectedFeatures={selectedStudentDashboardFeatures}
          setSelectedFeatures={setSelectedStudentDashboardFeatures}
          showCheckbox={true}
          actionTitleNew={"Assign to College"}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          openAssignFeaturesAndPermission={openAssignFeaturesAndPermission}
        />
      )}
      <Box sx={{ mt: 4.5 }}>
        <ViewDashboardWiseFeatureAndPermission
          title={
            state?.groupDetails?.group_id
              ? ""
              : "View Admin Dashboard Feature and Permission"
          }
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          actionTitle={actionTitle}
          dashboardType="admin_dashboard"
          showCheckbox={true}
          actionTitleNew={"Assign to Role"}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          openAssignFeaturesAndPermission={openAssignFeaturesAndPermission}
        />
      </Box>
      {openAssignFeaturesAndPermission && (
        <AssignFeatureAndPermissionDialog
          openAssignFeaturesAndPermission={openAssignFeaturesAndPermission}
          handleClose={handleClose}
          infoData={forStudentSection ? infoDataForCollege : infoDataForRole}
        />
      )}
    </Box>
  );
};

export default ViewFeatureAndPermission;
