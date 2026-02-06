import React from "react";
import BenchmarkingToolbar from "../../components/ui/benchmarking-dashboard/BenchmarkingToolbar";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SummarizeIcon from "@mui/icons-material/Summarize";
import "../../styles/BenchmarkingDashboard.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import DateRangePicker from "rsuite/DateRangePicker";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import Chart from "react-apexcharts";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import ArrowRightAltOutlinedIcon from "@mui/icons-material/ArrowRightAltOutlined";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Divider,
  Container,
  Grid,
  Typography,
} from "@mui/material";

// const options = {
//   responsive: true,
//   maintainAspectRatio: false,

//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//     },
//   },
// };

// const labels = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "2020-2021 Applications",
//       data: [0, 1, 2, 3, 4, 5, 6, 9, 19],
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "2021-2022 Applications",
//       data: [10, 20, 30, 40, 0, 10, 6, 44, 55, 55],
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trends-tabpanel-${index}`}
      aria-labelledby={`trends-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function applicationProps(index) {
  return {
    id: `application-tab-${index}`,
    "aria-controls": `application-tabpanel-${index}`,
  };
}
function trendProps(index) {
  return {
    id: `trend-tab-${index}`,
    "aria-controls": `trend-tabpanel-${index}`,
  };
}

// const TableCell = styled(TableCell)(({ theme }) => ({
//   [`&.${tableCellClasses.head}`]: {
//     backgroundColor: theme.palette.common.black,
//     color: theme.palette.common.white,

//     fontSize: 10,
//   },
//   [`&.${tableCellClasses.body}`]: {
//     fontSize: 14,
//   },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

const applications = [
  {
    application_start_date: "1st Oct, 2021",
    application_end_date: "1st Oct, 2021",
    total_days_for_application: "364",
    days_elapsed: 111,
    days_remaining: 253,
    application_received: 162,
    running_application_avg: "1.46",
    running_projection: 531,
    final_application_count: 2,
  },
  {
    application_start_date: "1st Oct, 2021",
    application_end_date: "1st Oct, 2021",
    total_days_for_application: "364",
    days_elapsed: 111,
    days_remaining: 253,
    application_received: 162,
    running_application_avg: "1.46",
    running_projection: 531,
    final_application_count: 2,
  },
];

function BenchmarkingDashboard(props) {
  const theme = useTheme();
  const [filterApplied, setFilterApplied] = React.useState(false);

  const [applicationTab, setApplicationTab] = React.useState(0);
  const [trendsTab, setTrendsTab] = React.useState(0);
  const [application] = React.useState("");
  const [allSelected, setAllSelected] = React.useState("");

  const handleApplicationChange = (event, newValue) => {
    setApplicationTab(newValue);
  };
  const handleTrendsChange = (event, newValue) => {
    setTrendsTab(newValue);
  };
  const handleAllSelectedChange = (event) => {
    setAllSelected(event.target.value);
  };

  const [state] = useState({
    series: [
      {
        color: "#FF9800",
        data: [92, 600, 120, 352, 50, 250, 532, 453, 60, 100, 500, 80],
        name: "2020-2021 Applications",
      },
      {
        color: "#0C7CD5",
        data: [100, 122, 50, 300, 250, 400, 312, 200, 10, 60, 90, 400],
        name: "2021-2022 Applications",
      },
    ],
    options: {
      chart: {
        id: "basic-bar",
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
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
  });

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            <BenchmarkingToolbar
              onFilterApply={() => setFilterApplied(true)}
              onFilterReset={() => setFilterApplied(false)}
            />
          </Grid>
          {!filterApplied ? (
            <Grid item lg={12} sm={12} xs={12}>
              <Box className="withoutFilterApplyWrapper">
                <Box className="messageBoxWithLock">
                  <LockOpenIcon sx={{ fontSize: "50px" }} />
                  <Typography component="span">
                    Please select an institute from filter and click apply to
                    view benchmarking dashboard.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ) : (
            <Grid item lg={12} sm={12} xs={12}>
              <Box>
                <Card {...props}>
                  <CardHeader
                    title="B.A [Hons] Psychology Application 2022"
                    action={<FileDownloadOutlinedIcon />}
                  />
                  <TableContainer
                    component={Paper}
                    className="custom-scrollbar"
                  >
                    <Table sx={{ minWidth: 700 }} className="applicationTable">
                      <TableHead className="tableHead">
                        <TableRow>
                          <TableCell>Application Start Date</TableCell>
                          <TableCell align="right">
                            Application End Date
                          </TableCell>
                          <TableCell align="right">
                            Total Days For Applition
                          </TableCell>
                          <TableCell align="right">Days Ellapsed</TableCell>
                          <TableCell align="right">Days Remaining</TableCell>
                          <TableCell align="right">
                            Applicatin Received
                          </TableCell>
                          <TableCell align="right">
                            Running Application Average
                          </TableCell>
                          <TableCell align="right">
                            Running Projections
                          </TableCell>
                          <TableCell align="right">
                            Final Application Count
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {applications.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              component="th"
                              scope="row"
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                            >
                              {row.application_start_date}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.application_end_date}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.total_days_for_application}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.days_elapsed}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.days_remaining}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.application_received}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.running_application_avg}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.running_projection}
                            </TableCell>
                            <TableCell
                              sx={{
                                borderColor: "#E6E8F0",
                              }}
                              align="right"
                            >
                              {row.final_application_count}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Box>
              <Box className="noteBookWrapper">
                <Box variant="span" className="notebookIcon">
                  <SummarizeIcon color="success" size="small" />
                </Box>
                <Box>
                  <ListItem
                    sx={{
                      padding: 0,
                    }}
                  >
                    <ListItemIcon>
                      <RadioButtonCheckedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Running Application Average = Application Received / Days Elapsed" />
                  </ListItem>
                  <ListItem
                    sx={{
                      padding: 0,
                      PaddingBottom: 0,
                    }}
                  >
                    <ListItemIcon>
                      <RadioButtonCheckedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Running Application Average = Application Received / Days Elapsed" />
                  </ListItem>
                  <ListItem
                    sx={{
                      padding: 0,
                    }}
                  >
                    <ListItemIcon>
                      <RadioButtonCheckedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Running Application Average = Application Received / Days Elapsed" />
                  </ListItem>
                </Box>
              </Box>
              <Box className="applicationWrapper">
                <Grid container spacing={3}>
                  <Grid item lg={12} sm={12} xs={12}>
                    <Box className="applicationFilterWrapper">
                      <Box className="applicationTitle">
                        <Typography variant="span">Applications</Typography>
                      </Box>
                      <Box className="applicationFilter">
                        <Box>
                          <TextField
                            className="textFieldWithOutlined"
                            id="outlined-start-adornment"
                            sx={{ m: 1, width: "25ch" }}
                            size="small"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment size="small" position="start">
                                  From Day
                                </InputAdornment>
                              ),
                            }}
                            color="info"
                          />
                        </Box>
                        <Box>
                          <TextField
                            className="textFieldWithOutlined"
                            id="outlined-start-adornment"
                            size="small"
                            sx={{ m: 1, width: "25ch" }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  To Day
                                </InputAdornment>
                              ),
                            }}
                            color="info"
                          />
                        </Box>
                        `
                        <Box className="selectBoxWrapper">
                          <Box className="applicationSelectBoxWrapper">
                            <FormControl className="selectBox">
                              <InputLabel id="application-select-label">
                                Applications
                              </InputLabel>
                              <Select
                                labelId="application-select-label"
                                id="application-select"
                                value={application}
                                label="application"
                                onChange={handleApplicationChange}
                                size="small"
                              >
                                <MenuItem value={10}>Application1</MenuItem>
                                <MenuItem value={20}>Application2</MenuItem>
                                <MenuItem value={30}>Application3</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                          <Box className="applicationSelectBoxWrapper">
                            <FormControl className="selectBox">
                              <InputLabel id="all-selected-select-label">
                                All Selected
                              </InputLabel>
                              <Select
                                labelId="all-selected-select-label"
                                id="all-selected"
                                value={allSelected}
                                label="application"
                                onChange={handleAllSelectedChange}
                                size="small"
                              >
                                <MenuItem value={10}>Selected1</MenuItem>
                                <MenuItem value={20}>Selected2 </MenuItem>
                                <MenuItem value={30}>Selected3</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Box className="graphTabsWrapper">
                      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                          value={applicationTab}
                          onChange={handleApplicationChange}
                          aria-label="basic tabs example"
                        >
                          <Tab
                            label="Day-Wise Graph"
                            {...applicationProps(0)}
                          />
                          <Tab
                            label="Cumulative Graph"
                            {...applicationProps(1)}
                          />
                        </Tabs>
                      </Box>
                      <TabPanel
                        className="tabPanel"
                        value={applicationTab}
                        index={0}
                      >
                        <Box>
                          <Chart
                            options={state.options}
                            series={state.series}
                            type="line"
                            height={350}
                          />
                        </Box>
                      </TabPanel>
                      <TabPanel
                        className="tabPanel"
                        value={applicationTab}
                        index={1}
                      >
                        <Box>
                          <Chart
                            options={state.options}
                            series={state.series}
                            type="line"
                            height={350}
                          />
                        </Box>
                      </TabPanel>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box className="trendsWrapper">
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={trendsTab}
                    onChange={handleTrendsChange}
                    aria-label="basic tabs example"
                  >
                    <Tab label="Day-Wise Trends" {...trendProps(0)} />
                    <Tab label="Date-Wise Trends" {...trendProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel className="tabPanel" value={trendsTab} index={0}>
                  <Box>
                    <Card {...props}>
                      <CardHeader
                        title="Day-Wise Trends"
                        action={<FileDownloadOutlinedIcon />}
                      />
                      <TableContainer
                        component={Paper}
                        className="custom-scrollbar"
                      >
                        <Table sx={{ minWidth: 700 }} className="trendsTable">
                          <TableHead>
                            <TableRow className="trendsHead">
                              <TableCell rowSpan={2}>Day No</TableCell>
                              <TableCell colSpan={2} align="center">
                                Online Payment
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                DD/Voucher
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Total Applications for the Day
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Cumulative Applications
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Leads for the Day
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Cumulative Leads
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Day-wise conversion %
                              </TableCell>
                            </TableRow>
                            <TableRow className="trendssubHeader">
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 1
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 2
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 3
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 4
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 5
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 6
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Day 7
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Divider />
                        <CardActions>
                          <Button
                            endIcon={
                              <ArrowRightAltOutlinedIcon fontSize="small" />
                            }
                          >
                            Load more
                          </Button>
                        </CardActions>
                      </TableContainer>
                    </Card>
                  </Box>
                </TabPanel>
                <TabPanel className="tabPanel" value={trendsTab} index={1}>
                  <Box>
                    <Card {...props}>
                      <CardHeader
                        title="Date-Wise Trends"
                        action={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <DateRangePicker
                              size="sm"
                              placeholder="Select Date Range"
                            />
                            <FileDownloadOutlinedIcon />
                          </Box>
                        }
                      />
                      <TableContainer
                        component={Paper}
                        className="custom-scrollbar"
                      >
                        <Table sx={{ minWidth: 700 }} className="trendsTable">
                          <TableHead>
                            <TableRow className="trendsHead">
                              <TableCell rowSpan={2}>Day No</TableCell>
                              <TableCell colSpan={2} align="center">
                                Online Payment
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                DD/Voucher
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Total Applications for the Day
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Cumulative Applications
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Leads for the Day
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Cumulative Leads
                              </TableCell>
                              <TableCell colSpan={2} align="center">
                                Day-wise conversion %
                              </TableCell>
                            </TableRow>
                            <TableRow className="trendssubHeader">
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                              <TableCell align="center">2020-2021</TableCell>
                              <TableCell align="center">2021-2022</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 14th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 15th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 16th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 17th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 18th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 19th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                Jan 20th
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#e6e8f0" }}
                              >
                                0
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                        <Divider />
                        <CardActions>
                          <Button
                            endIcon={
                              <ArrowRightAltOutlinedIcon fontSize="small" />
                            }
                          >
                            Load more
                          </Button>
                        </CardActions>
                      </TableContainer>
                    </Card>
                  </Box>
                </TabPanel>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}

export default BenchmarkingDashboard;
