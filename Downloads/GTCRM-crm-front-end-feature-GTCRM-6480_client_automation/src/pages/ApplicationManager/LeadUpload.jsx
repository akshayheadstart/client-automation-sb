/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useContext, useEffect } from "react";
import "../../styles/Checklist.css";
import CheckListDialog from "../Query_Manager/CheckListDialog";
import SelectLeadFile from "./SelectLeadFile";
import LeadUploadHistory from "./LeadUploadHistory";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";

const LeadUpload = ({ state }) => {
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Lead manager Head Title add
  useEffect(() => {
    setHeadTitle(state ? "Lead Upload" : "Offline Data");
    document.title = state ? "Lead Upload" : "Offline Data";
  }, [headTitle, state]);
  return (
    <Box sx={{ m: 3 }} className="lead-upload-container-box">
      <Box>
        <SelectLeadFile state={state} />
      </Box>
      <Box>
        <LeadUploadHistory state={state} />
      </Box>
      <CheckListDialog />
    </Box>
  );
};

export default LeadUpload;
