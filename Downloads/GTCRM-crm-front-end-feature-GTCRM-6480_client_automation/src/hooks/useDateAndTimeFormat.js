//format date as dd/mm/yyyy and time as 12:06 am / pm
export default function formatDateAndTime(date) {
  var hours = date?.getHours();
  var minutes = date?.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  const yyyy = date?.getFullYear();
  let mm = date?.getMonth() + 1; // Months start at 0!
  let dd = date?.getDate();
  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;
  var formattedDate = dd + "/" + mm + "/" + yyyy;
  return formattedDate + " " + strTime;
}

export const slotAndPanelDateTimeFormat = (date) => {
  const dateObj = new Date(date);
  // Format the date portion as "dd MMM yyyy"
  const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString(
    "default",
    { month: "short" }
  )} ${dateObj.getFullYear()}`;

  // Format the time portion as "hh:mm:ss a"
  const formattedTime = dateObj.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  // Get year, month, and day from the Date object
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");

  const publishDateFormat = `${year}-${month}-${day}`;

  return { formattedDate, formattedTime, publishDateFormat };
};
