import { Box, Card } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import "../../styles/clientOnboardingStyles.css";
import ViewClientsTable from "./ViewClientsTable";

function ViewAllClients() {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("View All Clients");
    document.title = "View All Clients";
  }, [headTitle]);

  return (
    <Box sx={{ mx: 3.5, mt: 8 }}>
      <Card className="common-box-shadow" sx={{ p: 3, borderRadius: 2.5 }}>
        <ViewClientsTable />
      </Card>
    </Box>
  );
}

export default ViewAllClients;
