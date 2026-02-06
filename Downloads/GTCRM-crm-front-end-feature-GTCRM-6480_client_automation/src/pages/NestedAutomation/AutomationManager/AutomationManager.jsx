import { Box } from "@mui/system";
import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../../store/contexts/LayoutSetting";
import AutomationManagerHeader from "./AutomationManagerHeader";
import "../../../styles/AutomationManager.css";
import AutomationManagerTable from "./AutomationManagerTable";
import AutomationManagerDetails from "./AutomationManagerDetails";
const AutomationManager = () => {
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [detailsId, stDetailsId] = useState("");
  const { headTitle, setHeadTitle } = useContext(LayoutSettingContext);
  // Title add
  useEffect(() => {
    setHeadTitle(`Automation ${showDetailsPage ? "Details" : "Manager"}`);
    document.title = `Automation ${showDetailsPage ? "Details" : "Manager"}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headTitle, showDetailsPage]);

  return (
    <Box sx={{ m: 3, mt: 7 }}>
      {showDetailsPage ? (
        <AutomationManagerDetails
          detailsId={detailsId}
          setShowDetailsPage={setShowDetailsPage}
        />
      ) : (
        <>
          <AutomationManagerHeader />
          <AutomationManagerTable
            setShowDetailsPage={setShowDetailsPage}
            setDetailsId={stDetailsId}
          />
        </>
      )}
    </Box>
  );
};

export default AutomationManager;
