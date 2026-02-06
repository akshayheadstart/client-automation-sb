import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTabs from "../../../../shared/tab-panel/CustomTabs";
import { BorderLinearProgress } from "../../../counsellor-dashboard/LeadStageDetailsProgressBar";
import { calculatePercentageOfValue } from "../../../../../pages/StudentTotalQueries/helperFunction";
import ProgressDetails from "./ProgressDetails";
import { Tag } from "rsuite";

const FollowupSummaryDetailsProgressBar = ({
  followupDetails,
  setSelectedHeadCounsellor,
  selectedHeadCounsellor,
  setSelectedCounsellor,
  setAppliedCounsellor,
}) => {
  const [tabNo, setTabNo] = useState(1);
  const [isProgressOverflowing, setIsProgressOverflowing] = useState(false);
  const progressRef = useRef(null);
  useEffect(() => {
    if (progressRef?.current) {
      if (
        progressRef.current?.clientHeight < progressRef.current?.scrollHeight
      ) {
        setIsProgressOverflowing(true);
      } else {
        setIsProgressOverflowing(false);
      }
    }
  }, [progressRef, tabNo, followupDetails]);

  useEffect(() => {
    if (selectedHeadCounsellor?.head_counselor_id) {
      setTabNo(2);
    } else {
      setTabNo(1);
    }
  }, [selectedHeadCounsellor]);

  return (
    <>
      <Box
        sx={{
          overflowY: isProgressOverflowing ? "scroll" : "",
          pr: isProgressOverflowing ? 2 : 0,
        }}
        ref={progressRef}
        className={`followup-details-progress ${
          isProgressOverflowing ? "vertical-scrollbar" : ""
        }`}
      >
        {selectedHeadCounsellor?.name && (
          <Typography>
            <Tag closable onClose={() => setSelectedHeadCounsellor({})}>
              {" "}
              {selectedHeadCounsellor?.name}{" "}
            </Tag>
          </Typography>
        )}
        {tabNo === 1 &&
          followupDetails?.followup_under_head_counsellors?.map((details) => (
            <ProgressDetails
              details={details}
              onClick={(headCounsellor) => {
                setSelectedHeadCounsellor(headCounsellor);
                setSelectedCounsellor([]);
                setAppliedCounsellor([]);
              }}
            />
          ))}
        {tabNo === 2 &&
          followupDetails?.coursellors_followups?.map((details) => (
            <ProgressDetails details={details} />
          ))}
      </Box>
      {!selectedHeadCounsellor?.head_counselor_id && (
        <CustomTabs tabNo={tabNo} setTabNo={setTabNo} />
      )}
    </>
  );
};

export default FollowupSummaryDetailsProgressBar;
