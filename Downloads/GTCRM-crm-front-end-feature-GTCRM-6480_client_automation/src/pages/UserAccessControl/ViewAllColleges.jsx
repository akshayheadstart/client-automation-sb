import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box, Card } from "@mui/material";
import "../../styles/clientOnboardingStyles.css";
import ViewCollegesTable from "./ViewCollegesTable";
const ViewAllColleges = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("View All Colleges");
    document.title = "View All Colleges";
  }, [headTitle]);
  return (
    <Box sx={{ mx: 3.5, mt: 8 }}>
      <Card
        className="common-box-shadow"
        sx={{ p: 3, borderRadius: 2.5 }}
      >
        <ViewCollegesTable/>
      </Card>
    </Box>
  );
};

export default ViewAllColleges;
