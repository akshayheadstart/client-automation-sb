import React, { useRef } from "react";
import { Box, Container, Grid } from "@mui/material";
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";
import "../../styles/StudentQualityIndex.css";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FilterByDrawer from "../../components/shared/filters/FilterByDrawer";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import DateRangePicker from "rsuite/DateRangePicker";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { useTheme } from "@mui/material/styles";
import Chart from "react-apexcharts";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function StudentQualityIndex(props) {
  const theme = useTheme();
  // const [state, setState] = React.useState({
  //   top: false,
  //   left: false,
  //   bottom: false,
  //   right: false,
  // });

  const [value, setValue] = React.useState(0);

  const tabHandleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [filterApplied, setFilterApplied] = React.useState(false);

  const [institute, setInstitute] = React.useState("");
  const [donut] = React.useState({
    series: [40, 60],
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Male", "Female"],
      colors: ["#FFB020", "#2196F3"],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const [bar2] = React.useState({
    series: [
      {
        data: [400, 300, 100],
        name: "Total",
      },
    ],
    options: {
      chart: {
        background: "transparent",
        stacked: false,
        toolbar: {
          show: false,
        },
      },

      colors: ["#5048E5", "#10B981", "#FFB020"],
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      grid: {
        borderColor: theme.palette.divider,
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      legend: {
        show: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "45",
          distributed: true,
        },
      },
      theme: {
        mode: theme.palette.mode,
      },
      tooltip: {
        // y: {
        //   formatter: (value) => numeral(value).format("$0,0.00"),
        // },
      },
      xaxis: {
        axisBorder: {
          color: theme.palette.divider,
          show: true,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true,
        },
        categories: [
          "Centeral Board of Secondary Education(CBSE)",
          "Council of Indian School Certificate Examination(CISCE)",
          "Others",
        ],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    },
  });
  const [bar] = React.useState({
    series: [
      {
        data: [400, 430, 448, 470, 540],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 380,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: ["#5048E5", "#10B981", "#FFB020", "#2196F3", "#D14343"],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: [
          "27 Years",
          "26 Years",
          "25 Years",
          "24 Years",
          "21 Years",
        ],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },

      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  });

  const handleChange = (event) => {
    setInstitute(event.target.value);
  };

  const filterByRef = useRef();
  const openDrawer = (anchor, open) => (event) => {
    filterByRef.current.openDrawer(anchor, open);
  };
  const [leads] = React.useState([
    {
      state: "Delhi",
      no_of_leads: 14,
    },
    {
      state: "Uttar Pradesh",
      no_of_leads: 10,
    },
    {
      state: "Haryana",
      no_of_leads: 33,
    },
    {
      state: "Maharastra",
      no_of_leads: 11,
    },
    {
      state: "West Bengal",
      no_of_leads: 11,
    },
    {
      state: "Others",
      no_of_leads: 21,
    },
  ]);

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            <Card sx={{ height: "100%" }} {...props}>
              <CardHeader
                sx={{ py: 1.5 }}
                action={
                  <IconButton aria-label="Download">
                    <FilterAltOutlinedIcon
                      size="large"
                      onClick={openDrawer("right", true)}
                      sx={{ fontSize: "30px" }}
                    />
                  </IconButton>
                }
                title={
                  <Typography color="textPrimary" variant="h6">
                    Student Quality Index
                    <Tooltip
                      title="Student Quality Index is a powerful paltform that helps you drive deep in data and statical insights both at institue and application level."
                      arrow
                      placement="top"
                    >
                      <IconButton sx={{ p: 0.6, mt: -0.5 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                }
                subheader={
                  <Typography color="textSecondary" variant="caption">
                    We recommend you to read the information tip for better
                    understanding and visualizaiton
                  </Typography>
                }
              />
              <Divider />
              <CardContent>
                {!filterApplied ? (
                  <Box
                    sx={{
                      height: "62vh",
                      justifyContent: "center",
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <LockOpenIcon sx={{ fontSize: "50px" }} />
                    <Typography component="span">
                      Please select an institute from filter and click apply to
                      view results
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item lg={6} sm={6} xs={12} className="graphWrapper">
                      <Box className="graph">
                        <Typography
                          color="textPrimary"
                          variant="h6"
                          className="graphTitle"
                        >
                          Age Bifurcation
                        </Typography>
                        <Box className="graphContent">
                          <Chart
                            options={bar.options}
                            series={bar.series}
                            type="bar"
                            height={300}
                          />
                          <Box className="noteBookWrapper">
                            <Box variant="span" className="notebookIcon">
                              {/* <SummarizeIcon color="success" size="small" /> */}
                              <Typography color="primary">Insight</Typography>
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
                                <ListItemText primary="Average Day of your application is 23 years" />
                              </ListItem>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item lg={6} sm={6} xs={12} className="graphWrapper">
                      <Box className="graph">
                        <Typography
                          color="textPrimary"
                          variant="h6"
                          className="graphTitle"
                        >
                          Gender Ratio
                        </Typography>
                        <Box className="graphContent">
                          <Chart
                            options={donut.options}
                            series={donut.series}
                            type="donut"
                            height={313}
                          />
                          <Box className="noteBookWrapper">
                            <Box variant="span" className="notebookIcon">
                              {/* <SummarizeIcon color="success" size="small" /> */}
                              <Typography color="primary">Insight</Typography>
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
                                <ListItemText primary="General ratio(Male: Female) of your application is 2:3" />
                              </ListItem>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item lg={12} sm={12} xs={12} className="graphWrapper">
                      <Box className="graph">
                        <Typography
                          color="textPrimary"
                          variant="h6"
                          className="graphTitle"
                        >
                          10th Standard Analysis
                        </Typography>
                        <Box className="graphContent">
                          <Box
                            clssName="innerGraphContent"
                            sx={{ display: "flex", flexWrap: "wrap" }}
                          >
                            <Box sx={{ width: "70%" }}>
                              <Chart
                                options={bar2.options}
                                series={bar2.series}
                                type="bar"
                                height={300}
                              />
                            </Box>
                            <Box sx={{ width: "30%" }}>
                              <Box
                                key="cbse"
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                  p: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: "#5048E5",
                                    borderRadius: "50%",
                                    height: 8,
                                    width: 8,
                                  }}
                                />
                                <Typography sx={{ ml: 2 }} variant="subtitle2">
                                  Centeral Board of Seconadary Education(CBSE)
                                </Typography>
                              </Box>
                              <Box
                                key="cise"
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                  p: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: "#10B981",
                                    borderRadius: "50%",
                                    height: 8,
                                    width: 8,
                                  }}
                                />
                                <Typography sx={{ ml: 2 }} variant="subtitle2">
                                  Council of Indian School Certificate
                                  Examination(CISCE)
                                </Typography>
                              </Box>
                              <Box
                                key="Others"
                                sx={{
                                  alignItems: "center",
                                  display: "flex",
                                  p: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    backgroundColor: "#FFB020",
                                    borderRadius: "50%",
                                    height: 8,
                                    width: 8,
                                  }}
                                />
                                <Typography sx={{ ml: 2 }} variant="subtitle2">
                                  Others
                                </Typography>
                              </Box>
                            </Box>
                          </Box>

                          <Box className="noteBookWrapper">
                            <Box variant="span" className="notebookIcon">
                              {/* <SummarizeIcon color="success" size="small" /> */}
                              <Typography color="primary">Insight</Typography>
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
                                <ListItemText primary='Majority of your applicants have completed their 12th from "Centeral Board of Secondary Education", "Council of Indian School Certifate Examination", Boards/Universities' />
                              </ListItem>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid
                      item
                      lg={12}
                      sm={12}
                      xs={12}
                      className="infoAnalysisWrapper"
                    >
                      <Typography
                        color="textPrimary"
                        variant="h6"
                        className="inflowAnalyisTitle"
                      >
                        Inflow Analysis
                      </Typography>

                      <Box className="inflowAnalysisContent">
                        <Box sx={{ width: "100%" }}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                              value={value}
                              onChange={tabHandleChange}
                              aria-label="basic tabs example"
                            >
                              <Tab label="Leads" {...a11yProps(0)} />
                              <Tab label="Applications" {...a11yProps(1)} />
                              <Tab label="Enrollment" {...a11yProps(2)} />
                            </Tabs>
                          </Box>
                          <TabPanel value={value} index={0}>
                            <TableContainer component={Paper}>
                              <Table
                                sx={{ minWidth: 700 }}
                                className="applicationTable"
                              >
                                <TableHead className="tableHead">
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="right">State</TableCell>
                                    <TableCell align="right">
                                      % of Leads
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {leads.map((row, index) => (
                                    <TableRow key={index}>
                                      <TableCell
                                        component="th"
                                        scope="row"
                                        sx={{
                                          borderColor: "#E6E8F0",
                                        }}
                                      >
                                        {index + 1}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderColor: "#E6E8F0",
                                        }}
                                        align="center"
                                      >
                                        {row.state}
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          borderColor: "#E6E8F0",
                                        }}
                                        align="center"
                                      >
                                        {row.no_of_leads} %
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </TabPanel>
                          <TabPanel value={value} index={1}>
                            Item Two
                          </TabPanel>
                          <TabPanel value={value} index={2}>
                            Item Three
                          </TabPanel>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <FilterByDrawer
        ref={filterByRef}
        title="Filter By"
        onFilterApply={() => setFilterApplied(true)}
        onFilterReset={() => setFilterApplied(false)}
      >
        <Box sx={{ minWidth: 120 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth className="formConrol">
                <InputLabel id="institute-name-select-label">
                  Institute Name
                </InputLabel>
                <Select
                  labelId="institute-name-select-label"
                  id="institute-name-select"
                  value={institute}
                  label="Institute Name"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>O.p. Jindal Gloabl University</MenuItem>
                  <MenuItem value={20}>Punjab Technical University</MenuItem>
                  <MenuItem value={30}>
                    Indira Gandhi Technical Institute
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth className="formControl">
                <InputLabel id="select-form-select-label">
                  Select Form
                </InputLabel>
                <Select
                  labelId="select-form-select-label"
                  id="select-form-select"
                  value={institute}
                  label="select Form"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>B.A form</MenuItem>
                  <MenuItem value={20}>MCA Form</MenuItem>
                  <MenuItem value={30}>B.tech Form</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DateRangePicker className="daterangepicker" />
            </Grid>
          </Grid>
        </Box>
      </FilterByDrawer>
    </Box>
  );
}

export default StudentQualityIndex;
