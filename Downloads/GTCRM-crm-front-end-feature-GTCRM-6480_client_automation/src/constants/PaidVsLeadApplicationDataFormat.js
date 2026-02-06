
const paidVsLeadFormat = {
    
    leadSeries: [
      {
        color: "#39A1D1",
        data: [],
        
      },
      
    ],
    leadOptions: {
      chart: {
        id: "yt",
        background: "transparent",
        stacked: false,
        group: "social",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [],
        
        labels:{
          show: true,
          rotate: 0,
          rotateAlways: false,
          hideOverlappingLabels: true,
          tickPlacement: 'between',
        style: {
          colors: [],
          fontSize: '16px',
          fontWeight: 400,
      },
        }
      },
      
      yaxis: {
        show: true,
        showAlways: true,
        showForNullSeries: true,
        opposite: false,
        reversed: false,
        logarithmic: false,
        tickAmount: 5,
        logBase: 10,
        min:0,
        forceNiceScale: false,
        floating: false,
        decimalsInFloat: undefined,
        title: {
          text: "LEADS",
        },
        axisBorder: {
          show: true,
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      annotations: {
      
        xaxis: [
          {
            x: new Date("03 Apr 2023").getTime(),
            strokeDashArray: 0,
            borderColor: "#39A1D1",
            label: {
              borderColor: "#39A1D1",
              style: {
                color: "#fff",
                background: "#39A1D1",
              },
              text: "Anno Test",
            },
          },
          {
            x: new Date("20 Mar 2023").getTime(),
            x2: new Date("30 Mar 2023").getTime(),
            fillColor: "#B3F7CA",
            opacity: 0.4,
            label: {
              borderColor: "#B3F7CA",
              style: {
                fontSize: "10px",
                color: "#fff",
                background: "#39A1D1",
              },
              offsetY: -10,
              text: "X-axis range",
            },
          },
        ],
       
      },
      grid: {
        borderColor: '#ECECEC',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: true,
      },
      markers: {
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
        radius: 2,
        shape: "circle",
        size: 4,
        strokeWidth: 0,
        
      },
      stroke: {
        curve: "smooth",
        lineCap: "butt",
        width: 3,
      },
     
    },

    paidApplicationSeries: [
      {
        color: "#0FABBD",
        data: [],
        name: "Paid Applications",
      },
    ],
    paidApplicationOptions: {
      chart: {
        id: "yt",
        background: "transparent",
        stacked: false,
        group: "social",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories:[],
        labels:{
          show: true,
          rotate: 0,
          rotateAlways: false,
          hideOverlappingLabels: true,
          tickPlacement: 'between',
          style: {
            colors: [],
            fontSize: '16px',
            fontWeight: 400,
        },
        }
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      yaxis: {
        show: true,
        showAlways: true,
        showForNullSeries: true,
        opposite: false,
        reversed: false,
        logarithmic: false,
        tickAmount: 5,
        logBase: 10,
        min:0,
        forceNiceScale: false,
        floating: false,
        decimalsInFloat: undefined,
        title: {
          text: "PAID APPLICATIONS",
        },
        axisBorder: {
          show: true,
          offsetX: 0,
          offsetY: 0,
        },
        axisTicks: {
          show: true,
          borderType: "solid",
          width: 6,
          offsetX: 0,
          offsetY: 0,
        },
      },
      annotations: {
      
        xaxis: [
          {
            x: new Date("03 Apr 2023").getTime(),
            strokeDashArray: 0,
            borderColor: "#775DD0",
            label: {
              borderColor: "#775DD0",
              style: {
                color: "#fff",
                background: "#775DD0",
              },
              text: "Anno Test",
            },
          },
          {
            x: new Date("20 Mar 2023").getTime(),
            x2: new Date("30 Mar 2023").getTime(),
            fillColor: "#B3F7CA",
            opacity: 0.4,
            label: {
              borderColor: "#B3F7CA",
              style: {
                fontSize: "10px",
                color: "#fff",
                background: "#00E396",
              },
              offsetY: -10,
              text: "X-axis range",
            },
          },
        ],
        
      },

      grid: {
        borderColor: '#ECECEC',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: true,
      },
      markers: {
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
        radius: 2,
        shape: "circle",
        size: 4,
        strokeWidth: 0,
      },
      stroke: {
        curve: "smooth",
        lineCap: "butt",
        width: 3,
      },
    
    },
  }

  export default paidVsLeadFormat;
