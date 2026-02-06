export function generateHourList(totalMinutes, startHourStr, endHourStr) {
  const hourList = [];
  const start = new Date(startHourStr);
  const end = new Date(endHourStr);
  while (start <= end) {
    const formattedHour = start.toLocaleString("en-US", {
      hour: "2-digit",
      hour12: true,
    });

    const [hour, type] = formattedHour.split(" ");

    hourList.push({ hour, type });
    start.setMinutes(start.getMinutes() + totalMinutes);
  }

  return hourList;
}

export function generateHourListForAutomation(startDate, endDate) {
  const hours = [];
  let currentDate = new Date(startDate);
  const endingDate = new Date(endDate);

  while (currentDate <= endingDate) {
    const startHour = currentDate.toLocaleString("en-US", {
      hour: "numeric",
      hour12: true,
    });

    const [hour, type] = startHour.split(" ");
    hours.push({ hour, type });

    currentDate.getMinutes() > 0
      ? currentDate.setMinutes(
          currentDate.getMinutes() + (60 - currentDate.getMinutes())
        )
      : currentDate.setHours(currentDate.getHours() + 1);
  }

  return hours;
}

export const returnTimerOverlayWidth = ({
  totalOverlayWidth,
  leftSideGap,
  rightSideGap,
  index,
  timerList,
}) => {
  let timerGap = 0;

  if (index === 0) {
    /* if the timerList has only two (2 is the minimum) timer item the timer gap will be the sum of right side gap and left side gap.
      Else the first timer gap will be only the left side gap because in this case right side gap is not applicable.
     */

    if (timerList.length === 2) {
      timerGap = rightSideGap + leftSideGap;
    } else {
      timerGap = leftSideGap;
    }
  } else {
    // If the rendered timer is the last one, the timer gap will be the right side gap because in this case the left side gap is not applicable.
    if (timerList.length - 2 === index) {
      timerGap = rightSideGap;
    }
  }

  return `${totalOverlayWidth - timerGap}px`;
};

export function addMinutesToDateTime(startDateTimeStr, minutesToAdd) {
  const startDateTime = new Date(startDateTimeStr);
  const endTime = new Date(startDateTime.getTime() + minutesToAdd * 60 * 1000);

  return endTime;
}

export function formatDateTime(dateTime) {
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = dateTime
    .toLocaleDateString("en-GB", options)
    .replace(",", "");

  return `${formattedDate}`?.toUpperCase();
}

export function convertDateTimeFormat(inputDateTimeStr) {
  const [datePart, timePart, ampm] = inputDateTimeStr.split(" ");
  const [day, month, year] = datePart.split("/");
  const formattedDate = `${day} ${getMonthName(month)} ${year}`;

  const formattedTime = `${timePart} ${ampm.toUpperCase()}`;

  return `${formattedDate} ${formattedTime}`.toUpperCase();
}

function getMonthName(monthNumber) {
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

  return monthNames[parseInt(monthNumber) - 1];
}
