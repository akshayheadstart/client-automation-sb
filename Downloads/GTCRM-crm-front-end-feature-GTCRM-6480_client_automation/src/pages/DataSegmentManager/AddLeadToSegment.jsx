import { Box } from "@mui/material";
import React, { useState } from "react";
import AddLeadToSegmentTable from "../../components/ui/DataSegmentManager/AddLeadToSegmentTable";
import AddLeadToSegmentHeader from "../../components/ui/DataSegmentManager/AddLeadToSegmentHeader";

function AddLeadToSegment({ setShowAddLeadPage, moduleName, dataSegmentId }) {
  const [searchText, setSearchText] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  return (
    <Box>
      <AddLeadToSegmentHeader
        searchText={searchText}
        setSearchText={setSearchText}
        setShowAddLeadPage={setShowAddLeadPage}
        selectedApplications={selectedApplications}
        setSelectedApplications={setSelectedApplications}
        dataSegmentId={dataSegmentId}
        setPageNumber={setPageNumber}
      />
      <AddLeadToSegmentTable
        selectedApplications={selectedApplications}
        setSelectedApplications={setSelectedApplications}
        searchText={searchText}
        moduleName={moduleName}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    </Box>
  );
}

export default AddLeadToSegment;
