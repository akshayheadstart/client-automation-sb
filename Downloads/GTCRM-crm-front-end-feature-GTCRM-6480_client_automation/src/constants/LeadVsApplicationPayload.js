import {
  formatLeadDates,
  formatLeadVsPaidApplicationDates,
  formatSingleLeadDate,
} from "../helperFunctions/filterHelperFunction";
import paidVsLeadFormat from "./PaidVsLeadApplicationDataFormat";

function leadVsApplicationPayload(data, setChartState) {
  const paidVsLeadFormatData = { ...paidVsLeadFormat };
  paidVsLeadFormatData.leadSeries[0].data = formatLeadVsPaidApplicationDates(
    data.data[0]?.lead
  );
  paidVsLeadFormatData.leadOptions.xaxis.categories = formatLeadDates(
    data.data[0]?.date
  );
  paidVsLeadFormatData.leadOptions.annotations.points = [
    ...(data.data[0]?.event.length > 0
      ? data.data[0]?.event?.map((data) => {
          return {
            x: formatSingleLeadDate(data?.date),
            y: 0,
            marker: {
              size: 5,
              fillColor: "#2e8ebb",
              strokeColor: "#2e8ebb",
              radius: 2,
              hover: {},
            },
          };
        })
      : ""),
  ];
  paidVsLeadFormatData.leadOptions.tooltip = {
    custom: function ({ seriesIndex, dataPointIndex, w }) {
      let data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

      return `
          <div  style="padding:10px 10px 10px 10px";>
             <p style="color:#39A1D1;list-style-type: circle; font-size:13px; font-weight:bold">Date: ${
               data?.x ? data?.x : "N/A"
             }</p>
             <p style="list-style-type: circle; font-size:13px;font-weight:bold">Lead: ${
               data?.y ? data?.y : "0"
             }</p>
             <div style="display:flex; flex-wrap: wrap; gap: 10px; padding-top:15px;">
             
             ${
               data?.event?.length > 0
                 ? data?.event?.map(
                     (
                       value,
                       index
                     ) => `<small style="list-style-type: circle; font-size:11px;">
              <li>Event Name ${index + 1}: ${value?.event_name}</li>
              <li>Event Start Date: ${value?.event_start_date}</li>
              <li style="color:#39A1D1;">Event End Date: ${
                value?.event_end_date
              }</li>
              </small>`
                   )
                 : ""
             }
             </div>
          <div>`;
    },
  };
  //

  paidVsLeadFormatData.paidApplicationSeries[0].data =
    formatLeadVsPaidApplicationDates(data.data[0]?.application);
  paidVsLeadFormatData.paidApplicationOptions.xaxis.categories =
    formatLeadDates(data.data[0]?.date);
  paidVsLeadFormatData.paidApplicationOptions.annotations.points = [
    ...(data.data[0]?.event?.length > 0
      ? data.data[0]?.event?.map((data) => {
          return {
            x: formatSingleLeadDate(data?.date),
            y: 0,
            marker: {
              size: 5,
              fillColor: "#19a5b5",
              strokeColor: "#19a5b5",
              radius: 2,
              hover: {},
            },
          };
        })
      : ""),
  ];
  paidVsLeadFormatData.paidApplicationOptions.tooltip = {
    custom: function ({ seriesIndex, dataPointIndex, w }) {
      let data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

      return `
            <div  style="padding:10px 10px 10px 10px;">
            <p style="color:#0FABBD;list-style-type: circle; font-size:13px; font-weight:bold">Date: ${
              data?.x ? data?.x : "N/A"
            }</p>
            <p style="list-style-type: circle; font-size:13px; font-weight:bold">Paid: ${
              data?.y ? data?.y : "0"
            }</p>
            <div style="display:flex; flex-wrap: wrap; gap: 10px; padding-top:15px;">
            ${
              data?.event?.length > 0
                ? data?.event?.map(
                    (
                      value,
                      index
                    ) => `<small style="list-style-type: circle; font-size:11px;">
             <li>Event Name ${index + 1}: ${value?.event_name}</li>
             <li>Event Start Date: ${value?.event_start_date}</li>
             <li style="color:#0FABBD;">Event End Date: ${
               value?.event_end_date
             }</li>
             </small>`
                  )
                : ""
            }
            </div>
             
            </div>`;
    },
  };

  setChartState(paidVsLeadFormatData);
}

export default leadVsApplicationPayload;
