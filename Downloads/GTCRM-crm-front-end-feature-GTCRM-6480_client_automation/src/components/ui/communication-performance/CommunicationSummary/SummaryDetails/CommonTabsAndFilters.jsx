import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import IconDateRangePicker from "../../../../shared/filters/IconDateRangePicker";
import MultipleTabs from "../../../../shared/tab-panel/MultipleTabs";
import {
  communicationTabs,
  dataSegmentTypes,
  segmentTypes,
} from "../../../../../constants/LeadStageList";
import { getDateMonthYear } from "../../../../../hooks/getDayMonthYear";
import MultipleFilterSelectPicker from "../../../../shared/filters/MultipleFilterSelectPicker";
import FilterSelectPicker from "../../../../shared/filters/FilterSelectPicker";

const CommonTabsAndFilters = ({
  dateRange,
  setDateRange,
  tabValue,
  setTabValue,
  heading,
  setAppliedDataType,
  segmentType,
  setSegmentType,
}) => {
  const [selectedDataType, setSelectedDataType] = useState([]);
  return (
    <Box className="common-tabs-and-filter-container">
      <Box sx={{ cursor: dateRange?.length ? "pointer" : "" }}>
        <Typography variant="h6">{heading}</Typography>
        {dateRange?.length > 0 && (
          <Typography>
            {getDateMonthYear(dateRange[0])} - {getDateMonthYear(dateRange[1])}
          </Typography>
        )}
      </Box>
      <Box>
        <MultipleTabs
          tabArray={communicationTabs}
          mapTabValue={tabValue}
          setMapTabValue={setTabValue}
          boxWidth="250px !important"
        />
        {setAppliedDataType && (
          <>
            <MultipleFilterSelectPicker
              onChange={(value) => {
                setSelectedDataType(value);
              }}
              callAPIAgain={() => setAppliedDataType(selectedDataType)}
              onClean={() => setAppliedDataType([])}
              setSelectedPicker={setSelectedDataType}
              pickerData={dataSegmentTypes}
              placeholder="Data Type"
              pickerValue={selectedDataType}
              style={{ width: "130px" }}
              placement="bottomEnd"
            />
            <FilterSelectPicker
              setSelectedPicker={setSegmentType}
              pickerData={segmentTypes}
              placeholder="Segment Type"
              pickerValue={segmentType}
              style={{ width: "130px" }}
              placement="bottomEnd"
            />
          </>
        )}
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(date) => setDateRange(date)}
          customWidthHeight="39px"
        />
      </Box>
    </Box>
  );
};

export default CommonTabsAndFilters;
