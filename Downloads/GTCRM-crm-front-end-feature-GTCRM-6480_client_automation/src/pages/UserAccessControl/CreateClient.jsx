import { Box, Card } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import CreateClientForm from "./CreateClientForm";
import "../../styles/clientOnboardingStyles.css";
function CreateClient() {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Create Client");
    document.title = "Create Client";
  }, [headTitle]);

  return (
    <Box sx={{ mx: 3.5, mt: 8 }}>
      <Card className="common-box-shadow" sx={{ p: 3, borderRadius: 2.5 }}>
        <CreateClientForm />
      </Card>
    </Box>
  );
}

export default CreateClient;
