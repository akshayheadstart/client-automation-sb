import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import IconDateRangePicker from "../../shared/filters/IconDateRangePicker";
import { useSelector } from "react-redux";
import { useGetCheckoutReasonListQuery } from "../../../Redux/Slices/telephonySlice";
import { useCommonApiCalls } from "../../../hooks/apiCalls/useCommonApiCalls";
import FilterSelectPicker from "../../shared/filters/FilterSelectPicker";
import { counsellorStatus } from "../../../constants/LeadStageList";

function CounsellorCallActivityHeader({
  activityStatus,
  setActivityStatus,
  callActivityDateRange,
  setCallActivityDateRange,
  selectedQuickFilter,
  setSelectedQuickFilter,
}) {
  const [skipCheckoutReasonApiCall, setSkipCheckoutReasonApiCall] =
    useState(true);
  const [checkoutReasonList, setCheckoutReasonList] = useState([]);
  const [activityStatusValue, setActivityStatusValue] = useState([]);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const checkoutReasonListApiCallInfo = useGetCheckoutReasonListQuery(
    { collegeId: collegeId },
    {
      skip: skipCheckoutReasonApiCall,
    }
  );
  const { handleFilterListApiCall } = useCommonApiCalls();
  //get checkout reason list
  useEffect(() => {
    if (!skipCheckoutReasonApiCall) {
      const reasonList = checkoutReasonListApiCallInfo.data?.data[0];
      const organizeReason = (reasons) =>
        reasons.map((reason) => ({ label: reason.title, value: reason.title }));
      handleFilterListApiCall(
        reasonList,
        checkoutReasonListApiCallInfo,
        setCheckoutReasonList,
        null,
        organizeReason
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skipCheckoutReasonApiCall, checkoutReasonListApiCallInfo]);

  return (
    <Box className="counsellor-call-activity-header common-display-flex-properties">
      <Typography>Counsellor Call Activity</Typography>

      <Box className="common-display-flex-properties">
        <FilterSelectPicker
          pickerData={counsellorStatus}
          pickerValue={selectedQuickFilter}
          setSelectedPicker={setSelectedQuickFilter}
          placeholder="Counsellor Status"
          style={{ width: 140 }}
          placement="bottomEnd"
          hideSearch={true}
        />
        <MultipleFilterSelectPicker
          placement="bottomEnd"
          placeholder="Activity Status"
          onChange={(value) => {
            setActivityStatusValue(value);
          }}
          pickerData={checkoutReasonList}
          setSelectedPicker={setActivityStatusValue}
          pickerValue={activityStatusValue}
          className="select-picker"
          style={{ width: 140 }}
          onOpen={() => setSkipCheckoutReasonApiCall(false)}
          loading={checkoutReasonListApiCallInfo.isFetching}
          callAPIAgain={() => {
            setActivityStatus(activityStatusValue);
          }}
          onClean={() => {
            setActivityStatus([]);
          }}
        />
        <Box>
          <IconDateRangePicker
            onChange={(value) => {
              setCallActivityDateRange(value);
            }}
            dateRange={callActivityDateRange}
            customWidthHeight={37}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default CounsellorCallActivityHeader;
