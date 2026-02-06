import dayjs from "dayjs";

export const CounsellorCallListColumn = [
  {
    label: "Name of Counsellor",
    value: "",
    width: "150px",
  },
  {
    label: "Total Calls",
    value: "",
    width: "80px",
  },
  {
    label: "Total QCed Calls",
    value: "",
    width: "125px",
  },
  {
    label: "QC Passed",
    value: "",
    width: "85px",
  },

  {
    label: "QC Failed",
    value: "",
    width: "75px",
  },

  {
    label: "Fatal Rejected",
    value: "",
    width: "110px",
  },

  {
    label: "Call Qty %",
    value: "",
    width: "80px",
  },
];

export const QACallListColumn = [
  {
    label: "Name of QA",
    value: "",
    width: "20%",
  },
  {
    label: "Total QCed Calls",
    value: "",
    width: "20%",
  },
  {
    label: "QC Passed",
    value: "",
    width: "20%",
  },
  {
    label: "QC Failed",
    value: "",
    width: "20%",
  },
  {
    label: "Fatal Rejected",
    value: "",
    width: "20%",
  },
];

export const CounsellorCallListReviewColumn = [
  {
    label: "Call Date and Time",
    value: "call_date_time",
    width: "200px",
  },
  {
    label: "Type of Call",
    value: "call_type",
    width: "115px",
  },
  {
    label: "Call Duration",
    value: "call_duration",
    width: "125px",
  },
  {
    label: "QC Status",
    value: "qc_status",
    width: "120px",
  },
  {
    label: "QA Score",
    value: "qa_score",
    width: "95px",
  },
  {
    label: "QA Name",
    value: "qa_name",
    width: "160px",
  },
  {
    label: "QC Date",
    value: "qc_date",
    width: "150px",
  },
  {
    label: "Caller Name",
    value: "caller_name",
    width: "160px",
  },
  {
    label: "Lead Name",
    value: "lead_name",
    width: "115px",
  },
  {
    label: "Call Starting",
    value: "call_starting",
    width: "120px",
  },
  {
    label: "Call Closing",
    value: "call_closing",
    width: "115px",
  },
  {
    label: "Engagement",
    value: "call_engagement",
    width: "125px",
  },
  {
    label: "Issue Handling",
    value: "call_issue_handling",
    width: "145PX",
  },
  {
    label: "Remarks",
    value: "call_remarks",
    width: "175PX",
  },
];

export const QcRejectedColumns = [
  {
    label: "Call Date and Time",
    value: "",
  },
  {
    label: "Type of Call",
    value: "",
  },
  {
    label: "Call Duration",
    value: "",
  },
  {
    label: "QC Status",
    value: "",
  },
  {
    label: "QA Score",
    value: "",
  },
  {
    label: "QA Name",
    value: "",
  },
  {
    label: "QC Date",
    value: "",
  },
  {
    label: "Counsellor Name",
    value: "",
  },
  {
    label: "Lead Name",
    value: "",
  },
];

export const callTypeOptions = [
  {
    label: "Inbound",
    value: "Inbound",
  },
  {
    label: "Outbound",
    value: "Outbound",
  },
];

export const QcStatusOptions = [
  {
    label: "Accepted",
    value: "Accepted",
  },
  {
    label: "Rejected",
    value: "Rejected",
  },
  {
    label: "Fatal Rejected",
    value: "Fatal Rejected",
  },
];


export const calculateCallQualityScore = (scores) => {
  let totalWeightedScore = 0;
  
  scores?.forEach(score => {
    const matchingWeight = score?.weight;
    if (matchingWeight !== undefined) {
      totalWeightedScore += score.point * (matchingWeight / 200);
    }
  });

  return totalWeightedScore;
};

export const formateDate = (date) => {
  if (date) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return null;
};