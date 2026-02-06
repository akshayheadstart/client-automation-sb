/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import "../../../styles/CounsellorPerformanceReport.css";
import "../../../styles/FollowupTaskTable.css";
import FollowupTaskDetailsHeader from "./FollowupTaskDetailsHeader";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import FollowupTaskDetails from "./FollowupTaskDetails";
import { useSelector } from "react-redux";

function FollowUpTask({ counsellorDashboard, skipApiCall }) {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Follow-ups Details");
    document.title = "Follow-ups Details";
  }, [headTitle]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["a5168b10"]
        ?.features
    );
  }, [permissions]);

  return (
    <Box
      sx={{ mx: !counsellorDashboard ? 3 : 0, height: "100%" }}
      className={
        !counsellorDashboard ? "followUp-task-header-box-container" : ""
      }
    >
      {!counsellorDashboard && (
        <FollowupTaskDetailsHeader sx={{ mt: 6, mb: 3 }} />
      )}
      <FollowupTaskDetails
        counsellorDashboard={counsellorDashboard}
        skipApiCall={skipApiCall}
      />
    </Box>
  );
}

export default FollowUpTask;
