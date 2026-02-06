/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box } from "@mui/material";
import { DateRangePicker } from "rsuite";
import {
  useGetCounselorListQuery,
  useGetUserListQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import {
  organizeCounselorFilterOption,
  organizeQaFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import { useCommonApiCalls } from "../../hooks/apiCalls/useCommonApiCalls";
import { QcStatusOptions, callTypeOptions } from "../../utils/QAManagerUtils";
import FilterSelectPicker from "../../components/shared/filters/FilterSelectPicker";

const CallListFilters = ({
  collegeId,
  isCallList,
  filterChange = () => {},
  user,
}) => {
  const [selectedCounsellor, setSelectedCounsellor] = React.useState([]);
  const [counsellorList, setCounsellorList] = React.useState([]);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = React.useState(true);
  const [hideCounsellorList, setHideCounsellorList] = React.useState(false);

  const [selectedQA, setSelectedQA] = React.useState([]);
  const [qaList, setQAList] = React.useState([]);
  const [skipQaApiCall, setSkipQaApiCall] = React.useState(true);
  const [hideQaList, setHideQaList] = React.useState(false);
  const [callType, setCallType] = React.useState(null);
  const [qcStatus, setQcStatus] = React.useState([]);
  const [qcDate, setQcDate] = React.useState();
  const [qcCallDate, setQCCallDate] = React.useState();
  const [callAPIAgain, setCallAPIAgain] = React.useState(false);

  const { handleFilterListApiCall } = useCommonApiCalls();
  const counselorListApiCallInfo = useGetCounselorListQuery(
    { isHoliday: false, collegeId: collegeId },
    {
      skip: !collegeId || skipCounselorApiCall,
    }
  );

  const qaListApiCallInfo = useGetUserListQuery(
    {
      userType: "qa",
      collegeId,
    },
    {
      skip: skipQaApiCall,
    }
  );

  React.useEffect(() => {
    if (!skipQaApiCall) {
      const list = qaListApiCallInfo?.data?.data[0];
      handleFilterListApiCall(
        list,
        qaListApiCallInfo,
        setQAList,
        setHideQaList,
        organizeQaFilterOption
      );
    }
  }, [qaListApiCallInfo, skipQaApiCall]);

  React.useEffect(() => {
    if (!skipCounselorApiCall) {
      const counselorList = counselorListApiCallInfo.data?.data[0];
      handleFilterListApiCall(
        counselorList,
        counselorListApiCallInfo,
        setCounsellorList,
        setHideCounsellorList,
        organizeCounselorFilterOption
      );
    }
  }, [skipCounselorApiCall, counselorListApiCallInfo]);

  React.useEffect(() => {
    filterChange(
      {
        qa: selectedQA,
        counsellor: selectedCounsellor,
        callType,
        qcStatus,
        qcDate,
        qcCallDate,
      },
      true
    );
  }, [callType, qcDate, qcCallDate, callAPIAgain]);

  return (
    <Box className="call-list-filter">
      {user === "qa"
        ? null
        : hideQaList || (
            <MultipleFilterSelectPicker
              style={{ width: "175px", heigh: "38px" }}
              placement="bottomEnd"
              placeholder="QA"
              onChange={(value) => {
                setSelectedQA(value);
              }}
              pickerData={qaList}
              setSelectedPicker={setSelectedQA}
              pickerValue={selectedQA}
              loading={false}
              onOpen={() => setSkipQaApiCall(false)}
              className="key-select-picker"
              callAPIAgain={() => setCallAPIAgain((prev) => !prev)}
              onClean={() => setCallAPIAgain((prev) => !prev)}
            />
          )}
      {/* Counsellor */}
      <MultipleFilterSelectPicker
        style={{ width: "175px", height: "38px" }}
        placement="bottomEnd"
        placeholder="Counsellor"
        onChange={(value) => {
          setSelectedCounsellor(value);
        }}
        pickerData={counsellorList}
        setSelectedPicker={setSelectedCounsellor}
        pickerValue={selectedCounsellor}
        loading={counselorListApiCallInfo.isFetching}
        onOpen={() => setSkipCounselorApiCall(false)}
        className="key-select-picker"
        callAPIAgain={() => setCallAPIAgain((prev) => !prev)}
        onClean={() => setCallAPIAgain((prev) => !prev)}
      />
      {/* Call Type */}
      {hideCounsellorList || (
        <FilterSelectPicker
          setSelectedPicker={setCallType}
          pickerData={callTypeOptions}
          placeholder="Call type"
          pickerValue={callType}
          placement={"bottomEnd"}
          className="call-type-filter key-select-picker"
        />
      )}
      {/* QC Status */}
      <MultipleFilterSelectPicker
        style={{ width: "175px", height: "38px" }}
        placement="bottomEnd"
        placeholder="QC Status"
        onChange={(value) => {
          setQcStatus(value);
        }}
        pickerData={QcStatusOptions}
        setSelectedPicker={setQcStatus}
        pickerValue={qcStatus}
        loading={false}
        onOpen={() => {}}
        className="key-select-picker"
        callAPIAgain={() => setCallAPIAgain((prev) => !prev)}
        onClean={() => setCallAPIAgain((prev) => !prev)}
      />
      {/* QC Date */}
      <DateRangePicker
        style={{ width: "175px" }}
        value={qcDate}
        onChange={(value) => {
          if (value === null || (value[0] === 1 && value[1] === 1)) {
            setQcDate([]);
          } else {
            setQcDate(value);
          }
        }}
        placement="auto"
        placeholder="QC Date"
        className="date-range-btn call-list-fiter-date-range"
      />

      {/* Call Date */}
      <DateRangePicker
        style={{ width: "175px" }}
        value={qcCallDate}
        onChange={(value) => {
          if (value === null || (value[0] === 1 && value[1] === 1)) {
            setQCCallDate([]);
          } else {
            setQCCallDate(value);
          }
        }}
        placement="auto"
        placeholder="Call Date"
        className="date-range-btn call-list-fiter-date-range"
      />
    </Box>
  );
};
export default CallListFilters;
