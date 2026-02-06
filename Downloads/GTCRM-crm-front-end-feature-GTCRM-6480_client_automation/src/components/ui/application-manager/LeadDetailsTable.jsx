import React, { useContext, useEffect, useState } from "react";
import { Drawer, InputGroup, Input } from "rsuite";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Container,
  Grid,
  Card,
  FormGroup,
  FormControlLabel,
  Dialog,
  Tooltip,
  Paper,
  Stack,
} from "@mui/material";
//Icon---
import { Search, RestartAltRounded } from "@mui/icons-material";
import Cookies from "js-cookie";

import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import "../../../styles/ApplicationManagerTable.css";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// table columns and rows component

import ReorderIcon from "@mui/icons-material/Reorder";
import CloseIcon from "@mui/icons-material/Close";
import TableHeadCollumns from "./table-head/TableHeadCollumns";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Pagination from "../../shared/Pagination/Pagination";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { useIntersectionObserver } from "react-intersection-observer-hook";

import LeadDetailsTableCell from "./LeadDetailsTableCell";
import {
  defaultRowsPerPageOptions,
  provideTheClassNameForLead,
} from "../../Calendar/utils";
import QuickDropdownFilters from "./QuickDropdownFilters";
import ChangeMultipleLeadStage from "../counsellor-dashboard/ChangeMultipleLeadStage";
import { bgcolor, border } from "@mui/system";

function LeadDetailsTable({
  openCol,
  setOpenCol,
  applications,
  rowsPerPage,
  setRowsPerPage,
  rowCount,
  loading,
  selectedApplications,
  setSelectedApplications,
  additionalColumnStates,
  searchedEmail,
  page,
  setPage,
  allApplicationInternalServerError,
  somethingWentWrongInApplicationDownload,
  somethingWentWrongInAllApplication,
  hideApplicationsTable,
  items,
  setItems,
  setOpenColumnsReorder,
  openColumnsReorder,
  initialColumns,
  handleCustomizeTableColumn,
  columnsOrder,
  selectedApplicationIds,
  isActionDisable,
  setIsScrolledToPagination,
  setTwelveScoreSort,
  sort,
  setSort,
  sortingLocalStorageKeyName,
  handleOpenUserProfileDrawer,
  setUserDetailsStateData,
  setSkipUserProfileApiCall,
  handleApplyQuickFilters,
  quickFilterList,
  setSelectedEmails,
}) {
  const [openChangeLeadStageDialog, setOpenChangeLeadStageDialog] =
    useState(false);
  const [clickedApplicationId, setClickedApplicationId] = useState([]);
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  // *********** Rearrenge Table Columns ******
  const handleClose = () => {
    setOpenColumnsReorder(false);
  };

  const grid = 8;
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid,
    margin: `0 0 ${grid}px 0`,
    fontSize: "14px",
    // change background colour if dragging
    background: "lightgray",

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    padding: grid,
    width: "100%",
  });

  const resetColumnsOrder = () => {
    localStorage.setItem(
      `${Cookies.get("userId")}leadArrangedCollumns`,
      JSON.stringify(initialColumns)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
      )
    );
    localStorage.setItem(
      `${Cookies.get("userId")}leadAddedCollumnsOrder`,
      JSON.stringify([])
    );
    handleCustomizeTableColumn();
  };

  const renderTableHead = (tableHead) => {
    return (
      <TableHeadCollumns
        columnText={tableHead}
        setTwelveScoreSort={setTwelveScoreSort}
        sort={sort}
        setSort={setSort}
        sortingLocalStorageKeyName={sortingLocalStorageKeyName}
      />
    );
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const item = reorder(items, result.source.index, result.destination.index);
    localStorage.setItem(
      `${Cookies.get("userId")}leadArrangedCollumns`,
      JSON.stringify(item)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}leadArrangedCollumns`)
      )
    );
  };

  // ****************************************************

  const count = Math.ceil(rowCount / rowsPerPage);

  useEffect(() => {
    localStorage.setItem(
      `${Cookies.get("userId")}totalPage`,
      JSON.stringify(count)
    );
  }, [count]);

  //additional column states
  const { regState, setRegState, city, setCity } = additionalColumnStates;

  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Drawer
  const [size] = useState("xs"); // ! setSize()
  const [backdrop] = useState(true); // ! setBackdrop()

  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const adminSelectedApplications = JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}adminSelectedLeads`)
      );

      if (adminSelectedApplications?.length > 0) {
        //applications
        const filteredApplications = applications.filter(
          (application) =>
            !selectedApplications.some(
              (element) => element.student_id === application.student_id
            )
        );

        setSelectedApplications((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);
        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedLeads`,
          JSON.stringify([...selectedApplications, ...filteredApplications])
        );
      } else {
        setSelectedApplications(applications);
        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedLeads`,
          JSON.stringify(applications)
        );
      }
    } else {
      //set selected applications
      const filteredApplications = selectedApplications.filter(
        (application) =>
          !applications.some(
            (element) => element.student_id === application.student_id
          )
      );
      setSelectedApplications(filteredApplications);
      localStorage.setItem(
        `${Cookies.get("userId")}adminSelectedLeads`,
        JSON.stringify(filteredApplications)
      );
    }
  };

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);

  //show top checkbox and indeterminate
  useEffect(() => {
    let applicationCount = 0;
    const applicationIds = applications?.map(
      (application) => application.student_id
    );
    applicationIds?.forEach((item) => {
      if (selectedApplicationIds?.indexOf(item) !== -1) applicationCount++;
    });

    if (applicationCount === applications?.length && applicationCount > 0) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (applicationCount < applications?.length && applicationCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [applications, selectedApplicationIds]);

  //according to checkbox select set the application id in selectApplications state
  const handleApplicationCheckBox = (e, dataRow) => {
    const selectedApplicationIds = selectedApplications.map(
      (application) => application.student_id
    );
    if (e.target.checked === true) {
      if (selectedApplications.length < 1) {
        //applications
        setSelectedApplications([dataRow]);

        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedLeads`,
          JSON.stringify([dataRow])
        );
      } else if (!selectedApplicationIds.includes(dataRow.student_id)) {
        //applications
        setSelectedApplications((currentArray) => [...currentArray, dataRow]);

        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedLeads`,
          JSON.stringify([...selectedApplications, dataRow])
        );
      }
    } else {
      const filteredApplications = selectedApplications.filter((object) => {
        return object.student_id !== dataRow.student_id;
      });

      setSelectedApplications(filteredApplications);
      localStorage.setItem(
        `${Cookies.get("userId")}adminSelectedLeads`,
        JSON.stringify(filteredApplications)
      );
    }
  };

  // set selected applications in state from localstorage after reload
  useEffect(() => {
    //applications
    const adminSelectedApplications = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}adminSelectedLeads`)
    );
    if (adminSelectedApplications?.length > 0) {
      setSelectedApplications(adminSelectedApplications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //close and reset values of customize column
  const handleCloseAndResetCustomizeColumn = () => {
    setOpenCol(false);
    setRegState(false);
    setCity(false);
  };

  //get customize column from localstorage
  useEffect(() => {
    const columns = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}customizeColumns`)
    );
    setRegState(columns?.state);
    setCity(columns?.city);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="basicDetailsTable">
      <Box>
        {/* ------------ Drawer Start -------------- */}
        <Drawer
          size={size}
          backdrop={backdrop}
          open={openCol}
          onClose={() => setOpenCol(false)}
        >
          <Box className="drawer-header" component={Card}>
            <Box className="d_title">Customize column</Box>
            <Box className="">
              <Button variant="outlined" onClick={() => setOpenCol(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
          <Drawer.Body style={{ padding: "16px 0px", maxWidth: "100%" }}>
            <Container className="customize_body">
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Box className="search">
                    <InputGroup>
                      <Input
                        placeholder="Search..."
                        onChange={(e) => setSearchText(e)}
                      />
                      <InputGroup.Button>
                        <Search />
                      </InputGroup.Button>
                    </InputGroup>
                    <Typography variant="body1" className="leadDetails">
                      Lead Details
                    </Typography>
                  </Box>
                  <Box className="lead_details_main">
                    <Box className="formTableColumn">
                      <FormGroup>
                        {/* <FormControlLabel
                        className="labalName"
                        control={<Checkbox defaultChecked />}
                        label="Registered Name"
                      /> */}
                        {/* <FormControlLabel
                        className="labalName"
                        control={<Checkbox />}
                        label="Registered Email"
                      /> */}
                        {/* <FormControlLabel
                        className="labalName"
                        control={
                          <Checkbox
                            onChange={(e) => setRegDate(e.target.checked)}
                            checked={regDate}
                          />
                        }
                        label="Registration Date"
                      /> */}
                        {/* <FormControlLabel
                        className="labalName"
                        control={<Checkbox />}
                        label="Registered Mobile"
                      /> */}
                        {/* <FormControlLabel
                        className="labalName"
                        control={
                          <Checkbox
                            onChange={(e) => setRegCountry(e.target.checked)}
                            checked={regCountry}
                          />
                        }
                        label="Registered Country"
                      /> */}
                        {searchText ? (
                          searchText.toLocaleLowerCase() === "state" && (
                            <FormControlLabel
                              className="labalName"
                              control={
                                <Checkbox
                                  onChange={(e) =>
                                    setRegState(e.target.checked)
                                  }
                                  checked={regState}
                                />
                              }
                              label="State"
                            />
                          )
                        ) : (
                          <FormControlLabel
                            className="labalName"
                            control={
                              <Checkbox
                                onChange={(e) => setRegState(e.target.checked)}
                                checked={regState}
                              />
                            }
                            label="State"
                          />
                        )}

                        {searchText ? (
                          searchText.toLocaleLowerCase() === "city" && (
                            <FormControlLabel
                              className="labalName"
                              control={
                                <Checkbox
                                  onChange={(e) => setCity(e.target.checked)}
                                  checked={city}
                                />
                              }
                              label="City"
                            />
                          )
                        ) : (
                          <FormControlLabel
                            className="labalName"
                            control={
                              <Checkbox
                                onChange={(e) => setCity(e.target.checked)}
                                checked={city}
                              />
                            }
                            label="City"
                          />
                        )}
                      </FormGroup>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Drawer.Body>
          <Drawer.Actions component={Card}>
            <Box className="column_footer">
              <Button
                variant="contained"
                endIcon={<RestartAltRounded fontSize="small" />}
                onClick={handleCloseAndResetCustomizeColumn}
              >
                Reset
              </Button>
              <Button
                variant="outlined"
                onClick={() => setOpenCol(false)}
                appearance="primary"
              >
                Apply
              </Button>
            </Box>
          </Drawer.Actions>
        </Drawer>
      </Box>
      {allApplicationInternalServerError ||
      somethingWentWrongInApplicationDownload ||
      somethingWentWrongInAllApplication ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: "55vh",
            alignItems: "center",
          }}
          data-testid="error-animation-container"
        >
          {allApplicationInternalServerError && (
            <Error500Animation height={400} width={400}></Error500Animation>
          )}
          {(somethingWentWrongInApplicationDownload ||
            somethingWentWrongInAllApplication) && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Box sx={{ visibility: hideApplicationsTable ? "hidden" : "visible" }}>
          {loading ? (
            <TableBody
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              data-testid="loading-animation-container"
            >
              <LeefLottieAnimationLoader
                height={120}
                width={120}
              ></LeefLottieAnimationLoader>
            </TableBody>
          ) : applications?.length > 0 ? (
            <TableContainer
              component={Paper}
              className="custom-scrollbar"
              sx={{ boxShadow: 0 }}
            >
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow>
                    {!isActionDisable && (
                      <TableCell className="checkbox-check-all-container table-row-sticky">
                        <Checkbox
                          checked={selectTopCheckbox}
                          onChange={(e) => handleAllCheckbox(e)}
                          indeterminate={showIndeterminate}
                        />
                        <QuickDropdownFilters
                          quickFilterList={quickFilterList}
                          handleApplyQuickFilters={handleApplyQuickFilters}
                        />
                      </TableCell>
                    )}
                    {items?.map((item) => {
                      return (
                        <TableCell key={item.id}>
                          {renderTableHead(item.content)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {applications.map((dataRow, index) => {
                    return (
                      <TableRow
                        className={
                          selectedApplicationIds?.indexOf(
                            dataRow?.student_id
                          ) !== -1
                            ? "selected-lead"
                            : ""
                        }
                        key={dataRow.student_id}
                        onClick={() => {
                          localStorage.setItem(
                            `${Cookies.get("userId")}applicationIndex`,
                            JSON.stringify(index)
                          );
                        }}
                      >
                        {!isActionDisable && (
                          <TableCell
                            className={`table-row-sticky ${provideTheClassNameForLead(
                              dataRow
                            )}`}
                          >
                            {selectedApplicationIds?.includes(
                              dataRow?.student_id
                            ) ? (
                              <IconButton
                                sx={{ p: "9px" }}
                                onClick={() => {
                                  handleApplicationCheckBox(
                                    {
                                      target: {
                                        checked: false,
                                      },
                                    },
                                    dataRow
                                  );
                                }}
                              >
                                <CheckBoxOutlinedIcon
                                  sx={{ color: "#008be2" }}
                                />
                              </IconButton>
                            ) : (
                              <Checkbox
                                checked={
                                  selectedApplicationIds?.includes(
                                    dataRow?.student_id
                                  )
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  handleApplicationCheckBox(e, dataRow);
                                  setSelectedEmails(dataRow?.student_email_id);
                                }}
                              />
                            )}
                          </TableCell>
                        )}
                        {items?.map((item, index) => {
                          return (
                            <TableCell
                              className="basic-details-table-row"
                              key={index}
                            >
                              <LeadDetailsTableCell
                                isActionDisable={isActionDisable}
                                setClickedStudentId={setClickedApplicationId}
                                handleClickOpenDialogsLead={() =>
                                  setOpenChangeLeadStageDialog(true)
                                }
                                tableHead={item.id}
                                dataRow={dataRow}
                                applicationIndex={index}
                                handleOpenUserProfileDrawer={
                                  handleOpenUserProfileDrawer
                                }
                                setUserDetailsStateData={
                                  setUserDetailsStateData
                                }
                                setSkipUserProfileApiCall={
                                  setSkipUserProfileApiCall
                                }
                              />
                            </TableCell>
                          );
                        })}

                        {/* <TableCell>
                          <IconButton disabled={isActionDisable}>
                            <Download
                              color="primary"
                              onClick={() =>
                                handleSingleApplicationDownload(
                                  dataRow?.student_id
                                )
                              }
                            />
                          </IconButton>
                        </TableCell> */}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                minHeight: "55vh",
                alignItems: "center",
              }}
              data-testid="not-found-animation-container"
            >
              <BaseNotFoundLottieLoader
                height={250}
                width={250}
              ></BaseNotFoundLottieLoader>
            </Box>
          )}

          {!loading && applications?.length > 0 && (
            <Box
              ref={paginationRef}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {searchedEmail?.length === 0 && (
                <Pagination
                  className="pagination-bar"
                  currentPage={page}
                  totalCount={rowCount}
                  pageSize={rowsPerPage}
                  onPageChange={(page) =>
                    handleChangePage(page, `adminLeadSavePageNo`, setPage)
                  }
                  count={count}
                />
              )}

              {searchedEmail?.length === 0 && (
                <AutoCompletePagination
                  rowsPerPage={rowsPerPage}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={rowCount}
                  page={page}
                  setPage={setPage}
                  localStorageChangeRowPerPage={`adminTableRowPerPage`}
                  localStorageChangePage={`adminLeadSavePageNo`}
                  setRowsPerPage={setRowsPerPage}
                ></AutoCompletePagination>
              )}
            </Box>
          )}
        </Box>
      )}

<Dialog
        open={openColumnsReorder}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            // Add border style here
            borderRadius: '30px', // Change dialog background color here
          },
        }}
      >
        <Box className="rearrange-columns-dialog-head"  paddingLeft='25px' paddingTop='15px' paddingRight='35px'
        paddingBottom='10px'>
          <Typography className="rearrange-columns-dialog-title" color='#3c5973' fontSize='18px'
          fontWeight='500'>
            Rearrange Table Columns
          </Typography>
          <Box width='20px'></Box>
          <Box>
            <Tooltip arrow placement="top" title="Reset Columns">
              <IconButton sx={{ color:"#008BE2"}}
                className={`${
                  columnsOrder === false && "reset-columns-button"
                }`}
              >
                <RestartAltIcon onClick={resetColumnsOrder} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ px: "10px" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{paddingLeft:'15px',paddingRight:'15px',paddingBottom:'15px',}}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                        className="rearrange-column-filter"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Box className="reordering-item">
                            <ReorderIcon className="reorder-icon"  sx={{color:'black'}}/>
                            <Box sx={{fontSize:'17px', fontWeight:400}}>{item.content}</Box>
                          </Box>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      </Dialog>
      <ChangeMultipleLeadStage
        color={"application"}
        handleCloseDialogs={() => setOpenChangeLeadStageDialog(false)}
        openDialogs={openChangeLeadStageDialog}
        selectedApplicationIds={clickedApplicationId}
        setSelectedApplications={setClickedApplicationId}
      ></ChangeMultipleLeadStage>
    </Box>
  );
}

export default React.memo(LeadDetailsTable);
