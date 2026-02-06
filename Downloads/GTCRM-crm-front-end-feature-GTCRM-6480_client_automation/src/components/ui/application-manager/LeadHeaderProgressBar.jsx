import React from "react";
import LeadStageDetailsProgressBar from "../counsellor-dashboard/LeadStageDetailsProgressBar";
import { useMemo } from "react";
import { calculatePercentageOfValue } from "../../../pages/StudentTotalQueries/helperFunction";

const LeadHeaderProgressBar = ({ stage, progress }) => {
  const allProgressValues = useMemo(
    () => progress.map((value) => value?.value),
    [progress]
  );

  const calculateValuePercentage = (value) => {
    return calculatePercentageOfValue(value, allProgressValues);
  };

  return (
    <LeadStageDetailsProgressBar
      stage={stage}
      normalise={calculateValuePercentage}
    />
  );
};

export default LeadHeaderProgressBar;
