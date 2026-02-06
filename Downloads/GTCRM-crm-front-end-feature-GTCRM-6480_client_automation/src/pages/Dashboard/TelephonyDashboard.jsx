import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box } from "@mui/system";
import TelephonyDashboardHeader from "../../components/ui/telephony-dashboard/TelephonyDashboardHeader";
import TelephonyDashboardBody from "../../components/ui/telephony-dashboard/TelephonyDashboardBody";
import "../../styles/TelephonyDashboard.css";
import "../../styles/sharedStyles.css";
function TelephonyDashboard() {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add
  useEffect(() => {
    setHeadTitle("Telephony");
    document.title = "Telephony";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headTitle]);
  return (
    <Box className="shared-dashboard-box-container" sx={{ mt: 6, mb: 3, mx: 3.5 }}>
      <TelephonyDashboardHeader />
      <TelephonyDashboardBody />
    </Box>
  );
}

export default TelephonyDashboard;
