import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  IconButton,
  Card, Popover, Tooltip, Grid
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Drawer from "@mui/material/Drawer";
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  Search
} from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InfoIcon from '@mui/icons-material/Info';
import "../../styles/StudentQueryList.css";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel'
import FilterOption from "./FilterOption";
import { Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from "react";
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
//............................ all api data start.........................
const datas = [
  {
    id: 972975,
    name: "Aakriti Manikandann",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972830,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972798,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972613,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "Closed",
    updatedOn: "20/01/2022, 10:23 am",
    action: "...",
  },
  {
    id: 972975,
    name: "Aakriti Manikandann",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972830,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972798,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Open",
    updatedOn: "-",
    action: "...",
  },
  {
    id: 972613,
    name: "Sanjana Katreddi",
    category: "Admission Query->Form Correction",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "Closed",
    updatedOn: "20/01/2022, 10:23 am",
    action: "...",
  },
  {
    id: 972777,
    name: "Namratha Bhimavarapu",
    category: "Admission Query->Form Correction",
    assignedTo: "Dolani Sahu(Counsellor)",
    status: "Open",
    updatedOn: "20/01/2022, 10:23 am",
    action: "...",
  },
  {
    id: 972483,
    name: "Nandan SP",
    category: "Admission Query->Fees Details",
    assignedTo: "Tanusree(Counsellor)",
    status: "Open",
    updatedOn: "20/01/2022, 10:23 am",
    action: "...",
  },
];
const inProgressData = [
  {
    id: 950781,
    name: "deepaksaradhna",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "In Progress",
    updatedOn: "03/01/2022, 03:13 pm",
    action: "...",
  },
  {
    id: 842552,
    name: "VEDIKA REKHI",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "In Progress",
    updatedOn: "07/09/2021, 4:46 pm",
    action: "...",
  },
  {
    id: 697294,
    name: "Rajeev Parashar",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "In Progress",
    updatedOn: "09/06/2021, 5:31 pm",
    action: "...",
  },
  {
    id: 696806,
    name: "Karambir Singh Dhayal",
    category: "General Query->Hostel",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "In Progress",
    updatedOn: "05/06/2021, 11:02 am",
    action: "...",
  },
  {
    id: 696804,
    name: "Karambir Singh Dhayal",
    category: "Admission Query->Form Correction",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "In Progress",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
]
const closedTicketData = [
  {
    id: 972613,
    name: "Adhiraj Jandu",
    category: "Admission Query->Form Correction",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "03/01/2022, 03:13 pm",
    action: "...",
  },
  {
    id: 971870,
    name: "BHARTI KATIYAR",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "07/09/2021, 4:46 pm",
    action: "...",
  },
  {
    id: 908821,
    name: "Shayshri Mathur",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "09/06/2021, 5:31 pm",
    action: "...",
  },
  {
    id: 900562,
    name: "Nilam Sharma",
    category: "General Query-> Other General Queries",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:02 am",
    action: "...",
  },
  {
    id: 899861,
    name: "Yutii Agarwal",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
  {
    id: 679986,
    name: "Sanchit Garg",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
  {
    id: 972613,
    name: "Adhiraj Jandu",
    category: "Admission Query->Form Correction",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "03/01/2022, 03:13 pm",
    action: "...",
  },
  {
    id: 971870,
    name: "BHARTI KATIYAR",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "07/09/2021, 4:46 pm",
    action: "...",
  },
  {
    id: 908821,
    name: "Shayshri Mathur",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "09/06/2021, 5:31 pm",
    action: "...",
  },
  {
    id: 900562,
    name: "Nilam Sharma",
    category: "General Query-> Other General Queries",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:02 am",
    action: "...",
  },
  {
    id: 899861,
    name: "Yutii Agarwal",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
  {
    id: 679986,
    name: "Sanchit Garg",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
  {
    id: 972613,
    name: "Adhiraj Jandu",
    category: "Admission Query->Form Correction",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "03/01/2022, 03:13 pm",
    action: "...",
  },
  {
    id: 971870,
    name: "BHARTI KATIYAR",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "07/09/2021, 4:46 pm",
    action: "...",
  },
  {
    id: 908821,
    name: "Shayshri Mathur",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "09/06/2021, 5:31 pm",
    action: "...",
  },
  {
    id: 971870,
    name: "BHARTI KATIYAR",
    category: "Admission Query->Form Correction",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "07/09/2021, 4:46 pm",
    action: "...",
  },
  {
    id: 908821,
    name: "Shayshri Mathur",
    category: "General Query-> Other General Queries",
    assignedTo: "NA",
    status: "Closed",
    updatedOn: "09/06/2021, 5:31 pm",
    action: "...",
  },
  {
    id: 900562,
    name: "Nilam Sharma",
    category: "General Query-> Other General Queries",
    assignedTo: "Shivali Grant(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:02 am",
    action: "...",
  },
  {
    id: 899861,
    name: "Yutii Agarwal",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
  {
    id: 679986,
    name: "Sanchit Garg",
    category: "General Query-> Other General Queries",
    assignedTo: "Deepika Madan(Counsellor)",
    status: "Closed",
    updatedOn: "05/06/2021, 11:01 am",
    action: "...",
  },
]
const positiveFeedback = [
  {
    id: 912375,
    name: "Rachna Singh",
    category: "General Query-> Other General Queries",
    assignedTo: "Tarun Arora(Counsellor)",
    status: "Closed",
    updatedOn: "17/12/2021, 03:22 pm",
    action: "...",
  },
  {
    id: 913254,
    name: "Rachna Singh",
    category: "General Query-> Other General Queries",
    assignedTo: "Tarun Arora(Counsellor)",
    status: "Closed",
    updatedOn: "17/12/2021, 03:22 pm",
    action: "...",
  },
  {
    id: 926088,
    name: "Gopika Surendran",
    category: "Admission Query->Form Correction",
    assignedTo: "Simran Munjal(Counsellor)",
    status: "Closed",
    updatedOn: "29/11/2021, 01:11 pm",
    action: "...",
  }
]

//............................ all api data end.........................
const StudentQueryList = ({ isOpen, onClick }) => {
  // modal
  // const [age, setAge] = React.useState('');
  // const handleChange1 = (event) => {
  //   setAge(event.target.value);
  // };
  // modal search
  const [value, setValue] = React.useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  // searchField
  // Action detais
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  };
  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover' : undefined;
  // token details drawer
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleDrawer = () => {
    setOpenDrawer(true);
  };
  return (
    <div>
      <Box className="heading_Query_list">
        <Typography variant="h6">Manage Student Queries</Typography>
        <Box className="icons">
          <Box>
            {/* search field */}
            {/* <Box sx={{ display: "flex", height: "40px",marginTop:"20px" }}>
              <TextField
              size="small"
                // className="search_field"
                sx={{height:"40px",width:"400px"}}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                label="Search By Ticket ID"
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Age</InputLabel>
                <Select
                sx={{height:"40px",width:"100px"}}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Ticket ID"
                  onChange={handleChange1}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Box> */}
            <IconButton>
              <Search />
            </IconButton>
          </Box>
          <Box>
            <FilterOption />
          </Box>
          <Box>
            {/* <Button aria-describedby={id} variant="contained" > */}
            <Tooltip title="More Options" placement="top">
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            {/* </Button> */}
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Button
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}><FileDownloadOutlinedIcon /> Download</Button>
            </Popover>
          </Box>
        </Box>
      </Box>
      {/* tabs header */}
      <Box sx={{ maxWidth: "98%", margin: "0 auto" }}>
        <TabContext value={value}>
          <Box>
            <TabList variant="scrollable"
              scrollButtons="auto"
              className="tabList"
              aria-label="scrollable auto tabs example"
              sx={{ maxWidth: "98%", margin: "20px" }}
              onChange={handleChange} >
              {/*First Tab  */}
              <Tab label={<Box className="tab_text">
                <Tooltip width="100%" placement="top"
                  title="The total number of tickets received in the time period selected">
                  <Typography variant="small">Total Tickets
                    <IconButton>
                      <InfoIcon className="infoIcon" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                <Typography variant="h5" className="alignment">439</Typography>
              </Box>} value="1" />
              {/* second tab */}
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip placement="top"
                  width="100%"
                  title="The total number of untouched tickets in the time period selected">
                  <Typography variant="small">Open Tickets
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                {/* <Typography variant="p">Open Tickets
                </Typography> */}
                <Typography variant="h4" className="alignment">243</Typography>
              </Box>} value="2" />
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip width="100%" placement="top"
                  title="The total number of tickets that remained unresolved or in-progress at the end of the time period selected">
                  <Typography variant="small">In Progress Tickets
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                {/* <Typography variant="p">In Progress Tickets</Typography> */}
                <Typography variant="h4" className="alignment">5</Typography>
              </Box>} value="3" />
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip width="100%" placement="top"
                  title="The total number of tickets resolved or closed in the time period selected">
                  <Typography variant="small">Closed Tickets
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                <Typography variant="h4" className="alignment">191</Typography>
              </Box>} value="4" />
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip width="100%" placement="top"
                  title="Total number tickets for which feedback is not given by the applicant  in the time period selected">
                  <Typography variant="small">Feedback Not Given
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                <Typography variant="h4" className="alignment">187</Typography>
              </Box>} value="5" />
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip width="100%" placement="top"
                  title="Total of tickets for which positive feedback is given by the applicant in the time period selected">
                  <Typography variant="small">Positive Feedback
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                <Typography variant="h4" className="alignment">3</Typography>
              </Box>} value="6" />
              <Tab label={<Box className="tab_text">
                {/*  */}
                <Tooltip width="100px" placement="top"
                  title="Total of tickets for which negative feedback is given by the applicant in the time period selected">
                  <Typography variant="small">Negative Feedback
                    <IconButton>
                      <InfoIcon className="infoIcon" fontSize="small" />
                    </IconButton>
                  </Typography>
                </Tooltip>
                <Typography variant="h4" className="alignment">1</Typography>
              </Box>} value="7" />
            </TabList>
          </Box>
          {/* tab body */}
          <TabPanel value="1">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <Button onClick={handleDrawer}>
                          {data.id}
                        </Button>
                      </TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TabPanel>
          <TabPanel value="2">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {datas.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell><Button onClick={handleDrawer}>
                        {data.id}
                      </Button></TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />

          </TabPanel>
          <TabPanel value="3">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inProgressData.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell><Button onClick={handleDrawer}>
                        {data.id}
                      </Button></TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell width="15%">
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton1"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />

          </TabPanel>
          <TabPanel value="4">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {closedTicketData.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell><Button onClick={handleDrawer}>
                        {data.id}
                      </Button></TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />

          </TabPanel>
          <TabPanel value="5">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {closedTicketData.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell><Button onClick={handleDrawer}>
                        {data.id}
                      </Button></TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />

          </TabPanel>
          <TabPanel value="6">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positiveFeedback.map((data) => (
                    <TableRow hover key={data.id}>
                      <TableCell padding="checkbox">
                        <Checkbox />
                      </TableCell>
                      <TableCell><Button onClick={handleDrawer}>
                        {data.id}
                      </Button></TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.category}</TableCell>
                      <TableCell>{data.assignedTo}</TableCell>
                      <TableCell>
                        {" "}
                        <Button
                          variant="contained"
                          size="small"
                          className="statusButton"
                        >
                          {data.status}
                        </Button>
                      </TableCell>
                      <TableCell>{data.updatedOn}</TableCell>
                      <TableCell>
                        <IconButton>
                          <MoreHorizIcon onClick={handleClick1} />
                        </IconButton>
                        <Popover
                          id={id1} open={open1} anchorEl={anchorEl1}
                          onClose={handleClose1}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                          }}
                        >
                          <Box sx={{ p: 2 }}>
                            <Link to="/" className="link_design">View Details</Link> <br />
                            <Link to="/" className="link_design">Reassign</Link> <br />
                            <Link to="/" className="link_design">Mark as read</Link>
                          </Box>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TabPanel>
          <TabPanel value="7">
            <Card className="table">
              <Table>
                <TableHead sx={{ backgroundColor: "#F2F9FE" }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell>Ticket ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Assigned To</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Updated On</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell padding="checkbox">
                      <Checkbox />
                    </TableCell>
                    <TableCell><Button onClick={handleDrawer}>
                      934144
                    </Button></TableCell>
                    <TableCell>haaridhraa raja</TableCell>
                    <TableCell>Admission Query{`->`}Course Details</TableCell>
                    <TableCell>Babita(Counsellor)</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        className="statusButton"
                      >
                        Closed
                      </Button>
                    </TableCell>
                    <TableCell>08/12/2021, 11:24 am</TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreHorizIcon onClick={handleClick1} />
                      </IconButton>
                      <Popover
                        id={id1} open={open1} anchorEl={anchorEl1}
                        onClose={handleClose1}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Link to="/" className="link_design">View Details</Link> <br />
                          <Link to="/" className="link_design">Reassign</Link> <br />
                          <Link to="/" className="link_design">Mark as read</Link>
                        </Box>
                      </Popover>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
            <TablePagination
              component="div"
              count={datas.length}
              onPageChange={() => { }}
              onRowsPerPageChange={() => { }}
              page={0}
              rowsPerPage={5}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TabPanel>
        </TabContext>
      </Box>
      <Drawer sx={{ width: "700px" }} anchor="right"
        open={openDrawer} onClose={() => setOpenDrawer(false)}>
        <Box className="drawer_width1"
          style={{
            margin: "20px",
          }}>
          <Box className="filter_items_flex ticket">
            <Typography className="filter_text">Ticket ID-972975</Typography>
            <Button size="small" className="close_btn">
              <IconButton>
                <CloseIcon onClick={() => setOpenDrawer(false)} />
              </IconButton>
            </Button>
          </Box>
          {/* body */}
          <Grid container sx={{ height: "570px", borderBottom: "1px solid #e6e8f0" }}>
            <Grid item xs={12} md={4} sx={{ width: "100%", borderRight: "1px solid #e6e8f0", height: "100vh" }}>
              <Box className="filter_items_flex status">
                <Typography variant="h6">Status- <span style={{ color: "#3832A0" }}>Open</span></Typography>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
              {/* info  */}
              <Box>
                <Typography className="lable">Name</Typography>
                <Typography variant='h6' className="details_text">Aakriti Manikandann</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">Email Address</Typography>
                <Typography variant='h6' className="details_text">akritim2004@gmail.com</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">Mobile Number</Typography>
                <Typography variant='h6' className="details_text">+91-6362248658</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">City</Typography>
                <Typography variant='h6' className="details_text">Bengaluru</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">State</Typography>
                <Typography variant='h6' className="details_text">Karnataka</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">Course</Typography>
                <Typography variant='h6 className="details_text"'>B.A. (Hons.) Liberak Arts and Humanities</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">Category</Typography>
                <Typography variant='h6' className="details_text">Other General Queries</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography className="lable">Lead Stage</Typography>
                <Typography variant='h6' className="details_text">Interested</Typography>
              </Box>

            </Grid>
            {/* right body  */}
            <Grid item xs={12} md={8} sx={{ pl: 2 }}>
              <Box className="status1">
                <Typography variant="h6">Ticket Conversion</Typography>
              </Box>
              <Box className="main_chat_body">
                <Box className="chat_body">
                  <Typography className="first_letter">A</Typography>
                  <Typography className="text_design">Where do i register for the jsat?</Typography>  <br />
                </Box>
                <Typography sx={{ paddingLeft: "40px" }}>20 jan 2022 01:15 pm</Typography>

              </Box>
              {/* quilt editor component by fahim */}
            </Grid>
          </Grid>
          {/* footer */}
          <Box sx={{ mt: 2 }} className="progress_icon">
            <FormControl
              sx={{ width: "150px" }}
              variant="outlined"
            >
              <InputLabel>
                Status
              </InputLabel>
              <Select
                size="small"
                defaultValue="In Progress"
                label="Status"
              >
                <MenuItem value="In Progress">
                  In Progress
                </MenuItem>
                <MenuItem value="Closed">
                  Closed
                </MenuItem>
              </Select>
            </FormControl>
            <IconButton className="send_icon"><AttachmentRoundedIcon /></IconButton>
            <IconButton className="send_icon1"><SendRoundedIcon /></IconButton>
          </Box>
        </Box>
      </Drawer>
      {/* tabs */}
    </div >
  );
};

export default StudentQueryList;
