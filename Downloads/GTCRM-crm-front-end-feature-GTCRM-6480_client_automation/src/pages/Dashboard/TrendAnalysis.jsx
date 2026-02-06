import React from "react";

import ToolbarWrapper from "../../components/shared/toolbars/ToolBarWrapper";

import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import "../../styles/TrendAnalysis.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SearchForm from "../../components/ui/trend-analysis/SearchForm";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { visuallyHidden } from "@mui/utils";

import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const headCells = [
  {
    id: "fromName",
    numeric: false,
    disablePadding: false,
    label: "From Name",
  },
  {
    id: "registerState",
    numeric: false,
    disablePadding: false,
    label: "Register State",
  },
  {
    id: "city",
    numeric: false,
    disablePadding: false,
    label: "city",
  },
  {
    id: "date1",
    numeric: true,
    disablePadding: false,
    label: "08 Jan 2022",
  },
  {
    id: "date2",
    numeric: true,
    disablePadding: false,
    label: "09 Apr 2022",
  },
  {
    id: "date3",
    numeric: true,
    disablePadding: false,
    label: "09 Jul 2022",
  },
  {
    id: "date4",
    numeric: true,
    disablePadding: false,
    label: "11 Dec 2021",
  },
  {
    id: "date5",
    numeric: true,
    disablePadding: false,
    label: "11 Jun 2022",
  },
  {
    id: "date6",
    numeric: true,
    disablePadding: false,
    label: "12 Feb 2022",
  },
  {
    id: "date7",
    numeric: true,
    disablePadding: false,
    label: "12 Mar 2022",
  },
];

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

const registerStateVsDateOfOnlneExam = [
  {
    fromName: "MA In Diplomacy Law & Bussiness Application 2022",
    registerState: "Andhra Pradesh",
    city: "Dhone",
    date1: "0",
    date2: "0",
    date3: "0",
    date4: "0",
    date5: "0",
    date6: "0",
    date7: "0",
  },
  {
    fromName: "B.A In Diplomacy Law & Bussiness Application 2022",
    registerState: "Andhra Pradesh",
    city: "Dhone",
    date1: "0",
    date2: "0",
    date3: "0",
    date4: "0",
    date5: "0",
    date6: "0",
    date7: "0",
  },
  {
    fromName: "Diploma In Diplomacy Law & Bussiness Application 2022",
    registerState: "Andhra Pradesh",
    city: "Dhone",
    date1: "0",
    date2: "0",
    date3: "0",
    date4: "0",
    date5: "0",
    date6: "0",
    date7: "0",
  },
  {
    fromName: "MA In Diplomacy Law & Bussiness Application 2022",
    registerState: "Andhra Pradesh",
    city: "Dhone",
    date1: "0",
    date2: "0",
    date3: "0",
    date4: "0",
    date5: "0",
    date6: "0",
    date7: "0",
  },
  {
    fromName: "MA In Diplomacy Law & Bussiness Application 2022",
    registerState: "Andhra Pradesh",
    city: "Dhone",
    date1: "0",
    date2: "0",
    date3: "0",
    date4: "0",
    date5: "0",
    date6: "0",
    date7: "0",
  },
];

const TrendAnalysis = (props) => {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 2 }}>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            <ToolbarWrapper>
              <Box className="toolbarWrapper">
                <Typography variant="h5" component="div">
                  Trend Alalysis
                </Typography>
                <Box component="span" className="playCircleIcon">
                  <PlayCircleIcon color="primary" />
                </Box>
              </Box>
            </ToolbarWrapper>
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <Box>
              <SearchForm />
            </Box>
          </Grid>

          <Grid item lg={12} sm={12} xs={12}>
            <Box>
              <Card {...props}>
                <CardHeader
                  title="Register State Vs Date of Online Exam"
                  action={<FileDownloadOutlinedIcon />}
                />
                <TableContainer component={Paper} className="custom-scrollbar">
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow sx={{ background: "#cccc" }}>
                        {headCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? order : "asc"
                              }
                              onClick={createSortHandler(headCell.id)}
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell
                          sx={{
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          Total &nbsp; <ArrowRightAltIcon fontSize="small" />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>9</TableCell>
                        <TableCell>2</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>11</TableCell>
                        <TableCell>12</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>12</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {registerStateVsDateOfOnlneExam.map((obj) => (
                        <TableRow
                          key={obj.fromName}
                          sx={{
                            "&:last-child td": {
                              border: 0,
                            },
                          }}
                        >
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            <Box
                              sx={{
                                alignItems: "center",
                                display: "flex",
                              }}
                            >
                              <Box
                                sx={{
                                  height: 16,
                                  width: 16,
                                  "& img": {
                                    height: 16,
                                    width: 16,
                                  },
                                }}
                              ></Box>

                              <Typography sx={{ ml: 1 }} variant="subtitle2">
                                {obj.fromName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.registerState}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.city}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date1}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date2}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date3}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date4}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date5}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date6}
                          </TableCell>
                          <TableCell sx={{ borderColor: "#E6E8F0" }}>
                            {obj.date7}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Divider />
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
export default TrendAnalysis;
