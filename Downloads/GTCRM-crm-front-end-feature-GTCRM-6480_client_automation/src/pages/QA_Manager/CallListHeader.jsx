/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import IconDateRangePicker from "../../components/shared/filters/IconDateRangePicker";
import {
  useGetCounselorListQuery,
  useGetUserListQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import MultipleFilterSelectPicker from "../../components/shared/filters/MultipleFilterSelectPicker";
import HorizontalCharts from "../../components/CustomCharts/HorizontalCharts";
import {
  organizeCounselorFilterOption,
  organizeQaFilterOption,
} from "../../helperFunctions/filterHelperFunction";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";

const CallListHeader = ({
  collegeId,
  isCallList,
  onChangeFilter = () => {},
  loading,
  data,
  route,
  user = "",
}) => {
  const [callListHeaderDate, setCallListHeaderDate] = React.useState([]);
  const [selectedCounsellor, setSelectedCounsellor] = React.useState([]);
  const [selectedQA, setSelectedQA] = React.useState([]);
  const [programName, setProgramName] = React.useState([]);
  // const [skipProgramApiCall, setSkipProgramApiCall] = React.useState(false);
  const [skipCounselorApiCall, setSkipCounselorApiCall] = React.useState(true);
  const [skipQaApiCall, setSkipQaApiCall] = React.useState(true);
  const [counsellorList, setCOunsellorList] = React.useState([]);
  const [qaList, setQaList] = React.useState([]);
  const [callAPI, setCallAPI] = React.useState(false);
  const isQaManager = route === "qaManager";

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
    setQaList(organizeQaFilterOption(qaListApiCallInfo?.data?.data[0] || []));
  }, [qaListApiCallInfo]);

  React.useEffect(() => {
    setCOunsellorList(
      organizeCounselorFilterOption(
        counselorListApiCallInfo?.data?.data[0] || []
      )
    );
  }, [counselorListApiCallInfo]);

  React.useEffect(() => {
    onChangeFilter({
      dateRange: callListHeaderDate,
      counsellor: selectedCounsellor,
      qa: selectedQA,
    });
  }, [callAPI]);

  return (
    <Box
      className={`page-header-container ${isCallList ? "" : "rejected-header"}`}
    >
      <Box className="page-header-filters">
        {loading ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "165px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LeefLottieAnimationLoader
              height={120}
              width={120}
            ></LeefLottieAnimationLoader>
          </Box>
        ) : (
          <>
            {isCallList ? (
              <Box
                className={
                  isQaManager
                    ? "header-section-wrapper1"
                    : "header-section-wrapper2"
                }
              >
                <Box
                  className={`align-items-col ${
                    isQaManager ? "qa-box" : "call-box"
                  }`}
                >
                  <Typography
                    component="p"
                    className="call-list-header-section-label"
                  >
                    Total Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.total_calls || 0}
                    </Typography>
                    {isQaManager && (
                      <Box className="qa-box">
                        <HorizontalCharts
                          data={[
                            {
                              plotName: "QCed",
                              value: data?.qced_calls?.count || 0,
                              color: "#11BED2",
                            },
                            {
                              plotName: "Not QCed",
                              value: data?.not_qced_calls || 0,
                              color: "#008BE2",
                            },
                          ]}
                        ></HorizontalCharts>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 79 }}
                    className="call-list-header-section-label"
                  >
                    Not QCed Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.not_qced_calls || 0}
                    </Typography>
                  </Box>
                </Box>

                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 42 }}
                    className="call-list-header-section-label"
                  >
                    QCed Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.qced_calls?.count || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      {data?.qced_calls?.percent?.toFixed(2) || 0}%
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 65 }}
                    className="call-list-header-section-label"
                  >
                    Rejected Calls
                  </Typography>
                  <Box>
                    <Box>
                      <Typography
                        component="span"
                        className="call-list-header-section-value"
                      >
                        {data?.rejected_calls?.count || 0}
                      </Typography>
                      <Typography
                        component="span"
                        className="call-list-header-section-sub-value"
                      >
                        {data?.rejected_calls?.percent?.toFixed(2) || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 43 }}
                    className="call-list-header-section-label"
                  >
                    Fatal Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.fataled_calls?.count || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      {data?.fataled_calls?.percent?.toFixed(2) || 0}
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 90 }}
                    className="call-list-header-section-label"
                  >
                    Calls With QC% {`>`} 90%
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.call_qc_gt_90 || 0}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Box className="header-section-wrapper-rejected">
                <Box className="align-items-col">
                  <Typography
                    component="p"
                    className="call-list-header-section-label"
                    sx={{ width: 46 }}
                  >
                    Total Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.total_calls || 0}
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 79 }}
                    className="call-list-header-section-label"
                  >
                    QCed Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.qced_calls?.count || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      {data?.qced_calls?.percent?.toFixed(2) || 0}
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 65 }}
                    className="call-list-header-section-label"
                  >
                    Rejected Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.rejected_calls?.count || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      {data?.rejected_calls?.percent?.toFixed(2) || 0}
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 43 }}
                    className="call-list-header-section-label"
                  >
                    Fatal Calls
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.fataled_calls?.count || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      {data?.fataled_calls?.percent?.toFixed(2) || 0}
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box className="align-items-col">
                  <Typography
                    sx={{ width: 81 }}
                    className="call-list-header-section-label"
                  >
                    QCed Calls Duration
                  </Typography>
                  <Box>
                    <Typography
                      component="span"
                      className="call-list-header-section-value"
                    >
                      {data?.qced_calls_duration || 0}
                    </Typography>
                    <Typography
                      component="span"
                      className="call-list-header-section-sub-value"
                    >
                      min
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box className="filter-wrapper">
              <IconDateRangePicker
                onChange={(value) => {
                  setCallListHeaderDate(value);
                  onChangeFilter({
                    dateRange: value?.lenght === 0 ? null : value,
                    counsellor: selectedCounsellor,
                    qa: selectedQA,
                  });
                }}
                dateRange={callListHeaderDate}
              />
              {["head_qa", "college_super_admin"].includes(user) && (
                <MultipleFilterSelectPicker
                  style={{ width: "150px" }}
                  placement="bottomEnd"
                  placeholder="QA"
                  onChange={(value) => {
                    setSelectedQA(value);
                  }}
                  pickerData={qaList}
                  setSelectedPicker={setSelectedQA}
                  pickerValue={selectedQA}
                  loading={qaListApiCallInfo.isFetching}
                  onOpen={() => setSkipQaApiCall(false)}
                  className="key-select-picker"
                  callAPIAgain={() => setCallAPI((prev) => !prev)}
                  onClean={() => setCallAPI((prev) => !prev)}
                />
              )}
              {(!isCallList || ["college_head_counselor"].includes(user)) && (
                <MultipleFilterSelectPicker
                  style={{ width: "150px" }}
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
                  callAPIAgain={() => setCallAPI((prev) => !prev)}
                  onClean={() => setCallAPI((prev) => !prev)}
                />
              )}
              {/* Progam name list */}
              <MultipleFilterSelectPicker
                disableField
                style={{ width: "150px" }}
                placement="bottomEnd"
                placeholder="Program"
                onChange={(value) => {
                  setProgramName(value);
                }}
                pickerData={[]}
                setSelectedPicker={setProgramName}
                pickerValue={programName}
                loading={false}
                // onOpen={() => setSkipProgramApiCall(false)}
                className="key-select-picker"
                callAPIAgain={() => setCallAPI((prev) => !prev)}
                onClean={() => setCallAPI((prev) => !prev)}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};
export default CallListHeader;
