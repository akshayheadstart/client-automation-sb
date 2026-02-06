import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import TableHeadingAndDate from "../TableHeadingAndDate";
import IconDateRangePicker from "../../../../shared/filters/IconDateRangePicker";
import MultipleFilterSelectPicker from "../../../../shared/filters/MultipleFilterSelectPicker";
import MultipleTabs from "../../../../shared/tab-panel/MultipleTabs";
import { inboundOutboundCallTab } from "../../../../../constants/LeadStageList";
import { useGetCounselorListQuery } from "../../../../../Redux/Slices/applicationDataApiSlice";
import { useCommonApiCalls } from "../../../../../hooks/apiCalls/useCommonApiCalls";
import { organizeCounselorFilterOption } from "../../../../../helperFunctions/filterHelperFunction";
import { useSelector } from "react-redux";

const CallInfoTableFilters = ({
  dateRange,
  tabValue,
  setTabValue,
  setPageNumber,
  setDateRange,
  setAppliedCounsellor,
  setSortingType,
  setSortingColumn,
}) => {
  const [selectedCounsellors, setSelectedCounsellors] = useState([]);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = useState(true);
  const [counsellorList, setCounsellorList] = useState([]);

  const { handleFilterListApiCall } = useCommonApiCalls();

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: skipCounselorApiCall,
    }
  );

  //get counsellor list
  useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        null,
        organizeCounselorFilterOption
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  return (
    <Box className="call-quality-filter-container">
      <Box>
        <TableHeadingAndDate title="Call Info" dateRange={dateRange} />
      </Box>
      <Box>
        <MultipleTabs
          tabArray={inboundOutboundCallTab}
          setMapTabValue={(tabValue) => {
            setTabValue(tabValue);
            setSortingType("");
            setSortingColumn("");
          }}
          mapTabValue={tabValue}
          boxWidth="220px !important"
        />

        <MultipleFilterSelectPicker
          placeholder="Counsellor"
          style={{ width: "140px" }}
          pickerValue={selectedCounsellors}
          className="select-picker"
          placement="bottomEnd"
          onClean={() => {
            setAppliedCounsellor([]);
            setPageNumber(1);
          }}
          onChange={(value) => setSelectedCounsellors(value)}
          callAPIAgain={() => {
            setAppliedCounsellor(selectedCounsellors);
            setPageNumber(1);
          }}
          pickerData={counsellorList}
          onOpen={() => setSkipCounselorApiCall(false)}
          loading={counselorListApiCallInfo?.isFetching}
          setSelectedPicker={setSelectedCounsellors}
        />
        <IconDateRangePicker
          dateRange={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setPageNumber(1);
          }}
          customWidthHeight={36}
        />
      </Box>
    </Box>
  );
};

export default CallInfoTableFilters;
