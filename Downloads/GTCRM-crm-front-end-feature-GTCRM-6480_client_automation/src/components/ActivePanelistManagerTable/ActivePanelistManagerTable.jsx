import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import * as React from "react";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useToasterHook from "../../hooks/useToasterHook";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/activePanelistManager.css";
import "../../styles/sharedStyles.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import LeefLottieAnimationLoader from "../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../shared/Loader/BaseNotFoundLottieLoader";
import { IconButton } from "@mui/material";
import {
  customFetch,
  getFeatureKeyFromCookie,
} from "../../pages/StudentTotalQueries/helperFunction";

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount, selectedPanelistId } = props;

  return (
    <TableHead sx={{ bgcolor: "#DCF8FF" }}>
      <TableRow>
        <TableCell
          // className={selectedPanelistId ? "department-table-col-padding" : "department-table-col-padding"}
          padding="checkbox"
        >
          <Checkbox
            color="info"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        <TableCell align="center">Name</TableCell>
        <TableCell className="department-table-col-padding" align="center">
          School
        </TableCell>
        <TableCell
          align={selectedPanelistId ? "left" : "left"}
          className="department-table-col-padding"
        >
          Department
        </TableCell>
        {/* <TableCell
          align={selectedPanelistId ? "left" : "left"}
          className="department-table-col-padding"
        >
          Status
        </TableCell> */}
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

export default function ActivePanelistManagerTable({
  selected,
  setSelected,
  setSelectedDeletePanelist,
  setSelectedPanelistId,
  setIsScrolledPanelistInfo,
  loadingData,
  setFirstEnterPageLoading,
  firstEnterPageLoading,
  getPanelist,
  setGetPanelist,
  updateLoading,
  selectedPanelistId,
  filterDataPayload,
  selectedStatus,
  setPageNumber,
  pageNumber,
  allDataFetched,
  setAllDataFetched,
  createUserState,
  setCreateUserState,
  selectedValueProgram,
  setSelectedPanelistCard,
  search,
  deleteLoading,
  deleteStatus,
  activeStatus,
  setDeleteStatus,
  setActiveStatus,
  statusUpdateIdInternalServerError,
  somethingWentWrongInStatusUpdate,
}) {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = getPanelist?.map((panelist) => panelist._id);
      setSelected(newSelected);
      setSelectedDeletePanelist(newSelected);
      return;
    }
    setSelected([]);
    setSelectedDeletePanelist([]);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleAddToSelectedPanelist = (event, rowId) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      // Add rowId to the selectedPanelists array
      return setSelectedDeletePanelist((prevSelected) => [
        ...prevSelected,
        rowId,
      ]);
    } else {
      // Remove rowId from the selectedPanelists array
      return setSelectedDeletePanelist((prevSelected) =>
        prevSelected.filter((id) => id !== rowId)
      );
    }
  };
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const [somethingWentWrongInGetPanelist, setSomethingWentWrongInGetPanelist] =
    useState(false);
  const [getPanelistInternalServerError, setGetPanelistInternalServerError] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  React.useEffect(() => {
    const url = `${
      import.meta.env.VITE_API_BASE_URL
    }/user/panelists/?page_num=${pageNumber}&page_size=6&college_id=${collegeId}&feature_key=${getFeatureKeyFromCookie()}`;
    customFetch(
      url,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(filterDataPayload))
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          pushNotification("error", result.detail);
          setAllDataFetched(true);
        } else if (result.data) {
          try {
            if (result.data) {
              if (Array.isArray(result?.data)) {
                if (result?.data.length < 6) {
                  setAllDataFetched(true);
                }
                if (getPanelist.length > 0) {
                  setGetPanelist((previous) => [...previous, ...result?.data]);
                } else {
                  setGetPanelist(result?.data);
                }
              } else {
                throw new Error("Get panelist API response has changed");
              }
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInGetPanelist,
              "",
              10000
            );
          }
        }
      })
      .catch(() => {
        handleInternalServerError(setGetPanelistInternalServerError, "", 5000);
      })
      .finally(() => {
        setLoading(false);
        setFirstEnterPageLoading(false);
        setCreateUserState(false);
        setDeleteStatus(false);
        setActiveStatus(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageNumber,
    // loadingData,
    // updateLoading,
    selectedValueProgram,
    selectedStatus,
    search,
    createUserState,
    deleteStatus,
    activeStatus,
  ]);
  React.useEffect(() => {
    if (
      selectedStatus ||
      selectedValueProgram ||
      deleteStatus ||
      createUserState ||
      search ||
      activeStatus
    ) {
      setPageNumber(1);
      setGetPanelist([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedStatus,
    selectedValueProgram,
    createUserState,
    deleteStatus,
    search,
    activeStatus,
  ]);

  const tableContainerRef = React.useRef(null);
  const fetchData = () => {
    setLoading(true);
    setPageNumber((prevPage) => prevPage + 1);
  };
  const handleScroll = () => {
    const target = tableContainerRef.current;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    const scrollThreshold = 1; // You can adjust this threshold based on your preference.

    // Check if the user has scrolled near the bottom of the container
    if (scrollTop + clientHeight + scrollThreshold >= scrollHeight) {
      if (!allDataFetched) {
        fetchData();
      }
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 6 }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        {getPanelistInternalServerError ||
        somethingWentWrongInGetPanelist ||
        statusUpdateIdInternalServerError ||
        somethingWentWrongInStatusUpdate ? (
          <>
            {(getPanelistInternalServerError ||
              statusUpdateIdInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInGetPanelist ||
              somethingWentWrongInStatusUpdate) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </>
        ) : (
          <TableContainer
            ref={tableContainerRef} // Set the ref for the TableContainer
            sx={{ maxHeight: "370px", overflowY: "scroll" }} // Add overflowY: "auto" to enable scrolling
            onScroll={handleScroll}
            className="vertical-scrollbar custom-scrollbar"
          >
            {firstEnterPageLoading ? (
              <>
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={200}
                    width={180}
                  ></LeefLottieAnimationLoader>
                </Box>
              </>
            ) : (
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={getPanelist?.length}
                  selectedPanelistId={selectedPanelistId}
                />
                <TableBody>
                  <>
                    {getPanelist?.map((row, index) => {
                      const isItemSelected = isSelected(row._id);

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                          sx={{
                            cursor: "pointer",
                            bgcolor:
                              index % 2 === 0 ? "" : "rgba(240, 252, 255, 1)",
                          }}
                          style={{
                            backgroundColor: isItemSelected
                              ? "rgba(170, 251, 255, 1)"
                              : "",
                          }}
                        >
                          <TableCell
                            // className={
                            //   selectedPanelistId
                            //     ? ""
                            //     : ""
                            // }
                            padding="checkbox"
                          >
                            {isItemSelected ? (
                              <IconButton
                                sx={{ p: "9px" }}
                                onClick={() => {
                                  handleClick(
                                    {
                                      target: {
                                        checked: false,
                                      },
                                    },
                                    row._id
                                  );
                                  handleAddToSelectedPanelist(
                                    {
                                      target: {
                                        checked: false,
                                      },
                                    },
                                    row._id
                                  );
                                }}
                              >
                                <CheckBoxOutlinedIcon
                                  sx={{ color: "#008be2" }}
                                />
                              </IconButton>
                            ) : (
                              <Checkbox
                                onClick={(event) => {
                                  handleClick(event, row._id);
                                  handleAddToSelectedPanelist(event, row._id);
                                }}
                                color="info"
                                checked={isItemSelected}
                                inputProps={
                                  {
                                    // "aria-labelledby": labelId,
                                  }
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setSelectedPanelistId(row._id);
                              setIsScrolledPanelistInfo(true);
                              setSelectedPanelistCard(true);
                            }}
                            component="th"
                            // id={labelId}
                            scope="row"
                            padding="normal"
                            align="center"
                          >
                            {row.name ? row.name : "N/A"}
                          </TableCell>
                          <TableCell
                            className="department-table-col-padding"
                            align="center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {row.school ? row.school : "N/A"}
                          </TableCell>
                          <TableCell
                            align={selectedPanelistId ? "left" : "left"}
                            className="department-table-col-padding"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {row?.selected_programs?.map((program) => {
                              return (
                                <li>
                                  {program?.course_name}{" "}
                                  {program?.specialization_name}
                                </li>
                              );
                            })}
                          </TableCell>
                          {/* <TableCell
                            className="department-table-col-padding"
                            align="left"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {row.status ? <Button
                            size="small" variant="outlined"
                            sx={{paddingY:'1px',border:'1px solid #039BDC',color:'#039BDC',backgroundColor:'#e4f0f5'}}
                            >Active</Button> : <Button
                            size="small" variant="outlined"
                            sx={{paddingY:'1px',border:'1px solid gray',color:'gray'}}
                            >Deactive</Button>}
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  </>
                </TableBody>
              </Table>
            )}
            {loading && (
              <Box className="loading-animation">
                <LeefLottieAnimationLoader
                  height={30}
                  width={100}
                ></LeefLottieAnimationLoader>
              </Box>
            )}

            {getPanelist.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "25vh",
                  alignItems: "center",
                }}
                data-testid="not-found-animation-container"
              >
                <BaseNotFoundLottieLoader
                  height={250}
                  width={250}
                ></BaseNotFoundLottieLoader>
              </Box>
            ) : (
              <>
                {allDataFetched && (
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                )}
              </>
            )}
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
