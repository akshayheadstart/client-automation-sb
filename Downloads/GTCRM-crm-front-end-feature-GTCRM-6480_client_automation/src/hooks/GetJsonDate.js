import dayjs from "dayjs";

const GetJsonDate = (dateRange) => {
  if (dateRange?.length > 0) {
    const startDay = String(dateRange[0]?.getDate()).padStart(2, "0");
    const startMonth = String(dateRange[0]?.getMonth() + 1).padStart(2, "0");
    const startYear = dateRange[0]?.getFullYear();

    let end_date = "";

    if (dateRange[1]) {
      const endDay = String(dateRange[1]?.getDate()).padStart(2, "0");
      const endMonth = String(dateRange[1]?.getMonth() + 1).padStart(2, "0");
      const endYear = dateRange[1]?.getFullYear();
      end_date = endYear + "-" + endMonth + "-" + endDay;
    } else {
      end_date = "";
    }

    const start_date = startYear + "-" + startMonth + "-" + startDay;

    return JSON.stringify({ start_date, end_date });
  } else {
    return JSON.stringify({});
  }
};
export default GetJsonDate;

export const getJsonDateToShowFollowUpReport = (startDate, endDate) => {
  const startDay = String(startDate.getDate()).padStart(2, "0");
  const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
  const startYear = startDate.getFullYear();

  const endDay = String(endDate.getDate()).padStart(2, "0");
  const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
  const endYear = endDate.getFullYear();

  const start_date = `${startYear}-${startMonth}-${startDay}`;
  const end_date = `${endYear}-${endMonth}-${endDay}`;
  return { start_date, end_date };
};
export const GetFormatDate = (dateRange) => {
  if (dateRange?.length > 1) {
    const startDay = String(dateRange[0]?.getDate()).padStart(2, "0");
    const startMonth = String(dateRange[0]?.getMonth() + 1).padStart(2, "0");
    const startYear = dateRange[0]?.getFullYear();

    const endDay = String(dateRange[1]?.getDate()).padStart(2, "0");
    const endMonth = String(dateRange[1]?.getMonth() + 1).padStart(2, "0");
    const endYear = dateRange[1]?.getFullYear();

    const start_date = startYear + "-" + startMonth + "-" + startDay;
    const end_date = endYear + "-" + endMonth + "-" + endDay;
    return { start_date, end_date };
  } else {
    return {};
  }
};
export const handleFormatDate = (dateValue) => {
  let todayDate = new Date(dateValue),
    day = "" + todayDate.getDate(),
    month = "" + (todayDate.getMonth() + 1),
    year = todayDate.getFullYear();
  if (day.length < 2) {
    day = "0" + day;
  }
  if (month.length < 2) {
    month = "0" + month;
  }
  let fullDate = day + "/" + month + "/" + year;
  return fullDate;
};
export const handleFormatInputDate = (date) => {
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

  const today = new Date(date);
  const day = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
};

export const callReviewedDate = (inputDate) => {
  const date = new Date(inputDate);
  const formattedDate = handleFormatInputDate(date);
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  let hours = date.getHours() % 12;
  if (hours === 0) hours = 12;
  const formattedHours = hours.toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${formattedDate} ${formattedHours}:${minutes} ${ampm}`;
};

//date format for panel and slot
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
}

export function convertToCustomFormat(dateArray) {
  const start_date = formatDate(dateArray[0]);
  const end_date = formatDate(dateArray[1]);

  const [start_date_part, start_time_part] = start_date.split(", ");
  const [end_date_part, end_time_part] = end_date.split(", ");

  return {
    start_time: { date: start_date_part, time: start_time_part },
    end_time: { date: end_date_part, time: end_time_part },
  };
}
export function convertToSingleCustomFormat(dateValue) {
  const date = formatDate(dateValue);

  const [date_part, time_part] = date.split(", ");

  return { date: date_part, time: time_part };
}

//date format 10/08/2023
export function formattedCurrentDate(currentDate) {
  // Create a new Date object with the original date string
  const dateObject = new Date(currentDate);

  // Get day, month, and year
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
  const year = dateObject.getFullYear();

  // Create a formatted date string
  return `${day}/${month.toString().padStart(2, "0")}/${year}`;
}

//date format 10 August 2023
export function dateInStringFormat(currentDate) {
  const originalDate = new Date(currentDate);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return originalDate.toLocaleDateString("en-GB", options);
}
export function isDateSameOrFuture(inputDateStr) {
  const inputDateParts = inputDateStr.split(" ");
  const inputMonth = new Date(
    Date.parse(inputDateParts[1] + " 1, 2000")
  ).getMonth(); // Convert month name to month number
  const inputYear = parseInt(inputDateParts[2]);
  const inputDay = parseInt(inputDateParts[0]);
  const inputDateObj = new Date(inputYear, inputMonth, inputDay);
  const currentDate = new Date();
  inputDateObj.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  // Compare the input date with the current date
  if (inputDateObj >= currentDate) {
    return true;
  } else {
    return false;
  }
}

export const eightAM = dayjs().set("hour", 8).startOf("hour");
export const sixPM = dayjs().set("hour", 18).startOf("hour");

export const calculatePanelAndSlotMinEndTime = (value) => {
  const originalTime = dayjs(value);
  return originalTime.add(10, "minutes");
};

export const calculatePanelAndSlotMaxStartTime = (value) => {
  const originalTime = dayjs(value);
  return originalTime.subtract(10, "minutes");
};
export const emailValid = (email) => {
  const emailData = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (emailData) {
    return true;
  } else {
    return false;
  }
};
export const phoneNumberLengthCount = (number) => {
  const phone = number?.length;
  if (phone === 10) {
    return true;
  } else {
    return false;
  }
};
export function filterEvents(events) {
  const currentDate = new Date();
  const lastTwoMonthsStartDate = new Date();
  lastTwoMonthsStartDate.setMonth(currentDate.getMonth() - 2);
  const nextMonthStartDate = new Date();
  nextMonthStartDate.setMonth(currentDate.getMonth() + 2);
  const filteredEvents = events?.filter((event) => {
    const eventEndDate = new Date(event?.event_end_date);
    return (
      eventEndDate >= lastTwoMonthsStartDate &&
      eventEndDate <= nextMonthStartDate
    );
  });

  return filteredEvents;
}

export function formatTypeDate(inputDate) {
  const date = new Date(inputDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
