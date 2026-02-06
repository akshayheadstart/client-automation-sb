import { Card } from "@mui/material";
import React, { useState } from "react";
import CommonTabsAndFilters from "../CommonTabsAndFilters";
import DateRangeShowcase from "../../../../../shared/CalendarTimeData/DateRangeShowcase";
import { getDateMonthYear } from "../../../../../../hooks/getDayMonthYear";
import DataSegmentWiseDetailsTable from "./DataSegmentWiseDetailsTable";

const DataSegmentWiseDetails = () => {
  const [tabValue, setTabValue] = useState(0);
  const [dateRange, setDateRange] = useState([]);
  const [appliedDataType, setAppliedDataType] = useState([]);
  const [segmentType, setSegmentType] = useState("");
  return (
    <Card className="common-box-shadow common-summary-details-container">
      {dateRange?.length > 1 && (
        <DateRangeShowcase
          startDateRange={getDateMonthYear(dateRange[0])}
          endDateRange={getDateMonthYear(dateRange[1])}
          triggeredFunction={() => setDateRange([])}
        ></DateRangeShowcase>
      )}
      <CommonTabsAndFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        tabValue={tabValue}
        setTabValue={setTabValue}
        heading="Data Segment Wise"
        setAppliedDataType={setAppliedDataType}
        segmentType={segmentType}
        setSegmentType={setSegmentType}
      />
      <DataSegmentWiseDetailsTable tabValue={tabValue} />
    </Card>
  );
};

export default DataSegmentWiseDetails;
