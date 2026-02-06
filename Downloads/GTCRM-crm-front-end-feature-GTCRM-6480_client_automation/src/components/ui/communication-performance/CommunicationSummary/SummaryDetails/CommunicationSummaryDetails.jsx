import { Box } from "@mui/material";
import React from "react";
import SummaryDetailsTopStrip from "./SummaryDetailsTopStrip";
import ReleaseDetails from "./ReleaseDetails/ReleaseDetails";
import CounsellorWiseDetails from "./CounsellorWiseDetails/CounsellorWiseDetails";
import TemplateWiseDetails from "./TemplateWiseDetails/TemplateWiseDetails";
import DataSegmentWiseDetails from "./DataSegmentWiseDetails/DataSegmentWiseDetails";

const CommunicationSummaryDetails = ({ featurePermission }) => {
  return (
    <Box className="communication-summary-details-container">
      {featurePermission?.["638652c7"]?.visibility && (
        <SummaryDetailsTopStrip />
      )}
      {featurePermission?.["4f9eb2fd"]?.visibility && <ReleaseDetails />}
      {featurePermission?.["ea61a0d1"]?.visibility && <CounsellorWiseDetails />}
      {featurePermission?.["e3ce0f0d"]?.visibility && (
        <DataSegmentWiseDetails />
      )}
      {featurePermission?.["c8991cb7"]?.visibility && <TemplateWiseDetails />}
    </Box>
  );
};

export default CommunicationSummaryDetails;
