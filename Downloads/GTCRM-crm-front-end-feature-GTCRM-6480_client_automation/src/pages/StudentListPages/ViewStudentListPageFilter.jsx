import { Box } from "@mui/system";
import React, { useState } from "react";
import MultipleFilterSelectionInterviewModule from "../../components/shared/CreateInterviewRoomList/CreateInterviewFilter";
import {
  interviewStatusOptions,
  selectionStatusOptions,
} from "../../constants/LeadStageList";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";
import { Button } from "@mui/material";

const ViewStudentListPageFilter = ({
  setFilterOptions,
  filterOptions,
  setFilterOfApiPayload,
  setShowSearchResult,
}) => {
  const [addColumn, setAddColumn] = useState([]);
  return (
    <Box className="view-student-list-filter-container">
      <FilterSelectPicker
        className="view-student-list-filter"
        placeholder="Interview Status"
        size="lg"
        pickerData={interviewStatusOptions}
        setSelectedPicker={(value) =>
          setFilterOptions((prev) => ({ ...prev, interview_status: value }))
        }
        pickerValue={filterOptions?.interview_status}
      />
      <FilterSelectPicker
        className="view-student-list-filter"
        placeholder="GD Status"
        size="lg"
        pickerData={interviewStatusOptions}
        setSelectedPicker={(value) =>
          setFilterOptions((prev) => ({ ...prev, gd_status: value }))
        }
        pickerValue={filterOptions?.gd_status}
      />
      <FilterSelectPicker
        className="view-student-list-filter"
        placeholder="Selection Status"
        size="lg"
        pickerData={selectionStatusOptions}
        setSelectedPicker={(value) =>
          setFilterOptions((prev) => ({ ...prev, selection_status: value }))
        }
        pickerValue={filterOptions.selection_status}
      />
      <MultipleFilterSelectionInterviewModule
        className="view-student-list-filter"
        placeholder="Add Column"
        size="lg"
        data={[]}
        setValue={setAddColumn}
        value={addColumn}
      />
      <Button
        onClick={() => {
          setFilterOfApiPayload(filterOptions);
          setShowSearchResult(false);
        }}
        variant="contained"
        color="info"
      >
        Apply
      </Button>
    </Box>
  );
};

export default ViewStudentListPageFilter;
