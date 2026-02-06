import { Box } from "@mui/system";
import React, { useContext, useEffect } from "react";
import CallLogsTopStrip from "./CallLogsTopStrip";
import "../../../../styles/communicationSummary.css";
import CallSummaryTableAndFilter from "../../communication-performance/CommunicationSummary/CallSummaryTableAndFilter";
import { LayoutSettingContext } from "../../../../store/contexts/LayoutSetting";

const CallLogs = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Call Logs");
    document.title = "Call Logs";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headTitle]);
  return (
    <Box sx={{ mt: 7, mx: 2.5 }}>
      <Box sx={{ mb: 2.5 }}>
        <CallLogsTopStrip />
      </Box>
      <CallSummaryTableAndFilter callLogDashboard={true} />
    </Box>
  );
};

export default CallLogs;
