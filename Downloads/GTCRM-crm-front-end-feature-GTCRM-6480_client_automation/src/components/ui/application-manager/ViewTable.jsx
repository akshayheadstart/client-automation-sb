import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Checkbox,
  IconButton,
  Link,
  Menu,
  MenuItem,
} from "@mui/material";

import { visuallyHidden } from "@mui/utils";
// Icon----

import { WhatsApp, FileDownloadOutlined } from "@mui/icons-material";

function createData(
  regName,
  applicationNo,
  formName,
  regEmail,
  regMob,
  formStatus,
  payStatus,
  payMethod,
  action
) {
  return {
    regName,
    applicationNo,
    formName,
    regEmail,
    regMob,
    formStatus,
    payStatus,
    payMethod,
    action,
  };
}
// -------Action Download ----------
const options = [
  "Edit Application",
  "Print Application",
  "View Documents",
  "Online Payment Details",
  "Communicate",
  "Change Application Stage",
  "Re-assign Application",
  "View CDD Data",
  "View as Applicant",
];

// ----------------
const rows = [
  createData(
    "Hriday Bharat Thakkar",
    "IAMA220112",
    "MA in Diplomacy Law",
    "globalhriday@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Raja Priya Karuppiah",
    "IAPS220019",
    "BA [Hons.] Political Science",
    "rajapriya@gmail.com",
    9809808877,
    "Complete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Visakha G",
    "IAMA220018",
    "MA in Diplomacy Law",
    "visakhgopakumar@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Pending",
    ""
  ),
  createData(
    "Prisha Khandelwal",
    "IAPS220035",
    "BA [Hons.] Political Science",
    "prishakhandelwal@gmail.com",
    9809808877,
    "Complete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Akul Vashist",
    "IAGA220060",
    "BA [Hons.] Global Affair",
    "globalhriday@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Jayaditya",
    "IAGA220072",
    "BA [Hons.] Political Science",
    "jayditya@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Pending",
    "Online"
  ),
  createData(
    "Rounaq Gupta",
    "IAMA220077",
    "BA [Hons.] Global Affair",
    "rounaqgupta@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Paras Bansal",
    "IAMA220117",
    "MA in Diplomacy Law",
    "globalhriday@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Pending",
    "Online"
  ),
  createData(
    "Ajay Gupta",
    "IAMA220082",
    "MA in Diplomacy Law",
    "ajaygupta@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Rahul Raj ",
    "IAMA220112",
    "MA in Diplomacy Law",
    "rahulraj@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
  createData(
    "Raja Karuppiah",
    "IAMA220112",
    "MA in Diplomacy Law",
    "rajakaruppiah@gmail.com",
    9809808877,
    "Incomplete",
    "Payment Approved",
    "Online"
  ),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "regName",
    label: "Registerd Name",
  },
  {
    id: "applicationNo",
    label: "Application No",
  },
  {
    id: "formName",
    label: "Form Name",
  },
  {
    id: "regEmail",
    label: "Registered Email",
  },
  {
    id: "regMob",
    label: "Registered Moblie",
  },
  {
    id: "formStatus",
    label: "Form Status",
  },
  {
    id: "payStatus",
    label: "Payment Status",
  },
  {
    id: "payMethod",
    label: "Payment Method",
  },
  {
    id: "action",
    label: "Action",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ViewTable(props) {
  // ----
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick1 = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // -------
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer className="custom-scrollbar">
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      <Link href=""> {row.regName}</Link>
                    </TableCell>
                    <TableCell align="left">{row.applicationNo}</TableCell>
                    <TableCell align="left">{row.formName}</TableCell>
                    <TableCell align="left">{row.regEmail}</TableCell>
                    <TableCell align="left">
                      <IconButton>
                        <WhatsApp
                          color="success"
                          sx={{
                            fontSize: "20px",
                          }}
                        />
                      </IconButton>
                      +91- {row.regMob}
                    </TableCell>
                    <TableCell align="left">{row.formStatus}</TableCell>
                    <TableCell align="left">{row.payStatus}</TableCell>
                    <TableCell align="left">{row.payMethod}</TableCell>
                    <TableCell align="left">
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? "long-menu" : undefined}
                        aria-expanded={open ? "true" : undefined}
                        aria-haspopup="true"
                        onClick={handleClick1}
                      >
                        <FileDownloadOutlined />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            width: "200px",
                          },
                        }}
                      >
                        {options.map((option) => (
                          <MenuItem
                            key={option}
                            selected={option === "Pyxis"}
                            onClick={handleClose}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                      {row.action}
                    </TableCell>
                  </TableRow>
                );
              })}
            {/* {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
