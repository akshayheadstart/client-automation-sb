import React, { useContext, useEffect } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { Card } from "@mui/material";
import CreateFeatureAndPermissionForm from "../../components/ui/FeatureAndPermission/CreateFeatureAndPermissionForm";
import "../../styles/clientOnboardingStyles.css";

function CreateFeatureAndPermission() {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);

  useEffect(() => {
    setHeadTitle("Create Feature & Permission");
    document.title = "Create Feature & Permission";
  }, [headTitle]);

  return (
    <Card className="common-box-shadow client-onboarding-form-card-container ">
      <CreateFeatureAndPermissionForm title="Add Feature & Permission" />
    </Card>
  );
}

export default CreateFeatureAndPermission;
