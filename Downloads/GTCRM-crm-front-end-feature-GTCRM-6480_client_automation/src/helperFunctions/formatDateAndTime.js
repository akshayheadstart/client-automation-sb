import getMonthName from "../utils/getMonth";

export function formatDateAndTime(inputDate) {
  // Convert the input string to a JavaScript Date object
  const date = new Date(inputDate);

  // Format the date part
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();
  const formattedDate = `${day} ${getMonthName(monthIndex)} ${year}`;

  // Format the time part
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const meridiem = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${formatTimeUnit(hours)}:${formatTimeUnit(
    minutes
  )}:${formatTimeUnit(seconds)} ${meridiem}`;

  // Combine the formatted date and time
  const result = { formattedDate, formattedTime };
  return result;
}

function formatTimeUnit(unit) {
  return unit.toString().padStart(2, "0");
}

// convert "29-07-2023 18:27:14" to "29 Jul 2023 6:27:14 PM"
export function convertDateAndTime(inputDateString) {
  // Split the input date string into date and time components
  const [datePart, timePart] = inputDateString.split(" ");

  // Split the date component into day, month, and year
  const [day, month, year] = datePart.split("-").map(Number);

  // Split the time component into hours, minutes, and seconds
  const [hours, minutes, seconds] = timePart.split(":").map(Number);

  // Define month names array
  const monthNames = [
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

  // Get AM/PM and formatted hours
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  // Create formatted date string
  return `${day} ${monthNames[month - 1]} ${year} ${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${amPm}`;
}
