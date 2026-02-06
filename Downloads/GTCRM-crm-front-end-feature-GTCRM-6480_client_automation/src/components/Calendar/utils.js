import Cookies from "js-cookie";

import { DAYS } from "./counts";

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const range = (end) => {
  const { result } = Array.from({ length: end }).reduce(
    ({ result, current }) => ({
      result: [...result, current],
      current: current + 1,
    }),
    { result: [], current: 1 }
  );
  return result;
};

export const sortDays = (date) => {
  const dayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const sortedDays = [...DAYS.slice(dayIndex), ...DAYS.slice(0, dayIndex)];
  return sortedDays;
};

export const datesAreOnSameDay = (firstDate, secondDate) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

export const getMonthYear = (date) => {
  const options = { month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const d = formattedDate.split(" ");
  return `${d[0]} ${d[1]}`;
};

export const nextMonth = (date, cb) => {
  const mon = date.getMonth();
  if (mon < 11) {
    date.setMonth(mon + 1);
  } else {
    date.setMonth(0);
    date.setFullYear(date.getFullYear() + 1);
  }
  cb(new Date(date));
};

export const prevMonth = (date, cb) => {
  const mon = date.getMonth();
  if (mon > 0) {
    date.setMonth(mon - 1);
  } else {
    date.setMonth(11);
    date.setFullYear(date.getFullYear() - 1);
  }
  cb(new Date(date));
};

export const getDarkColor = () => {
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
};

export const getSortedDays = (date) => {
  const daysInMonth = range(getDaysInMonth(date));
  const index = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return [...Array(index === 0 ? 6 : index - 1), ...daysInMonth];
};
const today = new Date();
export const todayDateData = today.toLocaleDateString("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});
export const timeDataArray = [
  {
    id: 2,
    time: "9 am",
  },
  {
    id: 3,
    time: "10 am",
  },
  {
    id: 4,
    time: "11 am",
  },
  {
    id: 5,
    time: "12 pm",
  },
  {
    id: 6,
    time: "1 pm",
  },
  {
    id: 7,
    time: "2 pm",
  },
  {
    id: 8,
    time: "3 pm",
  },
  {
    id: 9,
    time: "4 pm",
  },
  {
    id: 10,
    time: "5 pm",
  },
  {
    id: 11,
    time: "6 pm",
  },
];
export const checklistDialogContents = [
  {
    title: "The file is in CSV format.",
    text: 'Using a excel sheet? Change a .XLS sheet as a CSV file using "Save As".',
  },
  {
    title: "First row of sheet must have header labels",
    text: "CRM will use each column header to match will internal header label for better mapping and maintaining proper import data.",
  },
  {
    title: "Each row must contain valid name,email id and mobile number.",
    text: "Each email id or mobile number in each row is must to upload a CSV file. In case both are missing, that particular row data will not be imported. Till the time either email id or mobile number is unique in a row of sheet, contact will be imported.",
  },
  {
    title:
      "If email id and contact number already exist in the sheet or list earlier will be skipped.",
    text: "When you import a contact having email id and mobile number that is already in our particular list database, that contact record will be skipped.",
  },
];

export const currentSeasonDateRangeGenerator = () => {
  const currentDate = new Date();
  const firstDayOfSeason = new Date(currentDate.getFullYear(), 0, 1);
  const lastDayOfSeason = new Date(currentDate.getFullYear(), 11, 31);
  return { firstDayOfSeason, lastDayOfSeason };
};

export const removeLocalStorageKeys = (keys) => {
  keys.forEach((key) => {
    localStorage.removeItem(`${Cookies.get("userId")}${key}`);
  });
};
export const defaultRowsPerPageOptions = ["25", "50", "100", "200"];

export const provideTheClassName = (rowData) => {
  if (rowData?.payment_status?.toLowerCase() === "captured") {
    return "payment-done";
  } else if (rowData?.lead_stage?.toLowerCase() === "fresh lead") {
    return "fresh-lead";
  } else if (rowData?.verification?.lead?.toLowerCase() !== "unverified") {
    return "lead-verified";
  }
};

// this function is used for only lead manager because in the lead manager payment status and lead stage come in Array
export const provideTheClassNameForLead = (rowData) => {
  if (
    rowData?.payment_status?.includes("captured") ||
    rowData?.payment_status?.includes("Captured")
  ) {
    return "payment-done";
  } else if (rowData?.verification?.lead?.toLowerCase() !== "unverified") {
    return "lead-verified";
  } else if (
    rowData?.lead_stage?.includes("fresh lead") ||
    rowData?.lead_stage?.includes("Fresh Lead")
  ) {
    return "fresh-lead";
  }
};

export const provideTheClassNameForDataSegmentCheckbox = (
  rowData,
  dataType
) => {
  if (dataType === "Lead") {
    return provideTheClassNameForLead(rowData);
  } else if (dataType !== "Lead") {
    return provideTheClassName(rowData);
  }

  if (
    rowData?.verification === true ||
    (rowData?.verification !== "unverified" && rowData?.verification !== false)
  ) {
    return "lead-verified";
  }
};

export const applicationInitialColumns = [
  {
    content: "Name",
    id: "name",
  },
  { content: "Form Name", id: "form" },
  { content: "Automation", id: "automation" },
  { content: "Contact Details", id: "contact" },
  { content: "Payment Status", id: "payment" },
];
export const dateFormatInDayMonthYear = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const givenDate = new Date(date);

  const day = String(givenDate.getDate()).padStart(2, "0");
  const month = months[givenDate.getMonth()];
  const year = givenDate.getFullYear();

  return `${day} ${month} ${year}`;
};

export const parseTemplateText = (text, mergeWithTags, isIncoming) => {
  let content = text;
  mergeWithTags.forEach((tag) => {
    if (isIncoming) {
      // parsing the found incoming tags and replacing into HTML
      content = content.replaceAll(
        tag?.value,
        `<span data-type='mention' data-id='${tag?.name}' class='sms-merge-tag'></span>`
      );
    } else {
      // parsing the texts and replacing the tags into ex. First Name to {First Name}
      content = content.replaceAll(tag.name, tag.value);
    }
  });
  content = content.replace(/\n/g, " ");
  return content;
};

export function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}
