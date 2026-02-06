import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Box } from "@mui/material";
import FormRequestManagementTable from "../../components/ui/client-onboarding/FormRequestManagement/FormRequestManagementTable";

const FormRequestManagement = () => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Request Management");
    document.title = "Request Management";
  }, [headTitle]);

  return (
    <Box sx={{ mx: 3.5, mt: 7, mb: 3.5 }}>
      <FormRequestManagementTable />
    </Box>
  );
};

export default FormRequestManagement;
