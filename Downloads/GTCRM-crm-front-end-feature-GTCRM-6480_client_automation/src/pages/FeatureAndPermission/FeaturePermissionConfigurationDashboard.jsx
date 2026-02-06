import { Card } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box } from "@mui/system";
import StudentDashboardFeatureConfiguration from "../../components/ui/FeatureAndPermission/StudentDashboardFeatureConfiguration";
import AdminDashboardFeatureConfiguration from "../../components/ui/FeatureAndPermission/AdminDashboardFeatureConfiguration";
import useToasterHook from "../../hooks/useToasterHook";
import { useGetCollegeListQuery } from "../../Redux/Slices/applicationDataApiSlice";

function FeaturePermissionConfigurationDashboard() {
  const pushNotification = useToasterHook();
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Feature Configuration Dashboard");
    document.title = "Feature Configuration Dashboard";
  }, [headTitle]);

  const [collegeLists, setCollegeLists] = useState([]);

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

  return (
    <Box sx={{ my: 8, mx: 3 }}>
      <StudentDashboardFeatureConfiguration collegeLists={collegeLists} />
      <Box sx={{ mt: 4.5 }}>
        <AdminDashboardFeatureConfiguration collegeLists={collegeLists} />
      </Box>
    </Box>
  );
}

export default FeaturePermissionConfigurationDashboard;
