export const validateInputText = (text) => {
  return text.match(/^[a-zA-Z0-9. ]+$/g);
};

export const leadApplicationBarLabels = [
  {
    key: "12am",
    label: "12 AM",
  },
  {
    key: "1am",
    label: "01 AM",
  },
  {
    key: "2am",
    label: "02 AM",
  },
  {
    key: "3am",
    label: "03 AM",
  },
  {
    key: "4am",
    label: "04 AM",
  },
  {
    key: "5am",
    label: "05 AM",
  },
  {
    key: "6am",
    label: "06 AM",
  },
  {
    key: "7am",
    label: "07 AM",
  },
  {
    key: "8am",
    label: "08 AM",
  },
  {
    key: "9am",
    label: "09 AM",
  },
  {
    key: "10am",
    label: "10 AM",
  },
  {
    key: "11am",
    label: "11 AM",
  },
  {
    key: "12pm",
    label: "12 PM",
  },
  {
    key: "1pm",
    label: "01 PM",
  },
  {
    key: "2pm",
    label: "02 PM",
  },
  {
    key: "3pm",
    label: "03 PM",
  },
  {
    key: "4pm",
    label: "04 PM",
  },
  {
    key: "5pm",
    label: "05 PM",
  },
  {
    key: "6pm",
    label: "06 PM",
  },
  {
    key: "7pm",
    label: "07 PM",
  },
  {
    key: "8pm",
    label: "08 PM",
  },
  {
    key: "9pm",
    label: "09 PM",
  },
  {
    key: "10pm",
    label: "10 PM",
  },
  {
    key: "11pm",
    label: "11 PM",
  },
];

export const formatLeadApplicationChartData = (apiData = {}, isLeads) => {
  return leadApplicationBarLabels.map((item) => {
    const { label } = item;
    return {
      name: label,
      topStack: isLeads
        ? apiData[label]?.leads_assigned
        : apiData[label]?.application_paid,
      bottomStack: isLeads
        ? apiData[label]?.leads_called
        : apiData[label]?.applications_submitted,
    };
  });
};

export const hourlyChartColors = {
  leads: {
    leads_assigned: "#008BE2", // blue,
    leads_called: "#00465F", // dark blue
  },
  application: {
    application_paid: "#11BED2", // cyan
    applications_submitted: "#0A7EAE", // dark cyan
  },
};

export const scriptTableCols = [
  {
    label: "Script Name",
    value: "script_name",
    width: "220px",
  },
  {
    label: "Source",
    value: "source_name",
    sort: true,
  },
  {
    label: "Program Name",
    value: "program_name",
    sort: true,
    width: "170px",
  },
  {
    label: "Application Stage",
    value: "application_stage",
    sort: true,
    width: "185px",
  },
  {
    label: "Lead Stage",
    value: "lead_stage",
    sort: true,
    width: "140px",
  },
  {
    label: "Tag",
    value: "tags",
    sort: true,
    width: "60px",
  },
  {
    label: "Content Preview",
    value: "content",
    width: "310px",
  },
  {
    label: "Action",
    value: "action",
  },
];
