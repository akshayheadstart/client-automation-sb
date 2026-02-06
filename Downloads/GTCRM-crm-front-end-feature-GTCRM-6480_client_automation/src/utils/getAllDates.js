import { DateObject } from "react-multi-date-picker";

export function getAllDates(startDate, endDate) {

    const startingDate = new Date(startDate)
    const endingDate = new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1));

    // getting all the date list of date range
    const dates = [];
    while (startingDate.toDateString() !== endingDate.toDateString()) {
        const startDay = String(startingDate.getDate()).padStart(2, "0")
        const startMonth = String(startingDate.getMonth() + 1).padStart(2, "0")
        const startYear = startingDate.getFullYear();
        dates.push(`${startYear}-${startMonth}-${startDay}`);
        startingDate.setDate(startingDate.getDate() + 1);
    }
    return dates

}

export const getDateList = (dates) => {
    const dateList = [];
    dates.forEach(date => {
        const formattedDate = new DateObject(`${date.year}-${date?.month?.number}-${date.day}`).format("YYYY-MM-DD", ["Date"])
        dateList.push(formattedDate)
    })
    return dateList;
}

export const getFormattedDateList = (dates) => {
    const formattedDateList = [];
    dates.forEach((date) => {
        formattedDateList.push({
            date: new Date(`${date?.year}-${date?.month?.number}-${date?.day}`).toDateString(),
            style: {
                backgroundColor: "#04d63c",
                color: "white",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px 5px 5px 0px",
                display: "inline-block",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            }
        })
    })
    return formattedDateList;
}

