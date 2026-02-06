import React from "react";
import { useState } from "react";
import Chart from "react-apexcharts";
import "../../styles/QuickSnapshot.css";
import FilterListIcon from "@mui/icons-material/FilterList";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import {
  Grid,
  Button,
  Divider,
  Typography,
  Box,
  TextField,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from '@mui/material/styles';
import { Link } from "react-router-dom";
const QuickSnapshot = () => {
  const theme = useTheme();
  const [stageData] = useState({
    series: [
      {
        data: [69, 63, 6],
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
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
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
        categories: ["Limit", "Created", "Balance"],
      },
    },
  });
  const [chart2Data] = useState({
    series: [
      {
        data: [2, 1, 5, 55, 1, 1],
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
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: "45%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
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
        categories: ["College Super Admin",
          "College Admin",
          "College Staff",
          "Counsellor",
          "Agent",
          "Publisher",],
      },
    },
  });
  return (
    <div className="padding">
      <Grid container spacing={3}>
        <Grid item md={12} sm={12} xs={12}>
          <Box className="header">
            <Typography color="textPrimary" gutterBottom variant="h5">
              User Manager
            </Typography>
            <Box className="buttons_alignment box_height">
              <TextField
              color="info"
                size="small"
                className="search_byrequest_field"
                label="Search by Request Id"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                className="filter-btn"
                sx={{ marginLeft: "15px" }}
                variant="outlined"
              >
                <IconButton>
                  <FilterListIcon />
                </IconButton>
                Filter
              </Button>
            </Box>
          </Box>
          <Divider sx={{ marginTop: "10px" }} />
        </Grid>
      </Grid>
      <Box sx={{ marginTop: "15px" }}>
        <Link to="/users/user-manager" >
          <Button variant="outlined" size="small" className="snapshot_btn">
            <i class="far fa-building icon"></i> College User
          </Button>
        </Link>
        <Button variant="contained" size="small" className="college_user_btn" sx={{ marginLeft: "10px" }}>
          <i class="far fa-chart-bar icon"></i> Quick Snapshot
        </Button>
      </Box>
      <div className="charts">
        <div className="chart1">
          <Chart
            options={stageData.options}
            series={stageData.series}
            type="bar"
            height={250}
            width={500}
          />
        </div>
        <div className="chart1">
          <Chart
            options={chart2Data.options}
            series={chart2Data.series}
            type="bar"
            height={250}
            width={500}
          />
        </div>
      </div>
    </div>
  );
};
export default QuickSnapshot;