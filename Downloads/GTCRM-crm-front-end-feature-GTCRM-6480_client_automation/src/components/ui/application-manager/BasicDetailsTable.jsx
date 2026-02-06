import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  Tooltip,
} from "@mui/material";

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
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import RegisteredName from "./table-cell/RegisteredName";
import ReorderIcon from "@mui/icons-material/Reorder";
import CloseIcon from "@mui/icons-material/Close";
import TableHeadCollumns from "./table-head/TableHeadCollumns";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Pagination from "../../shared/Pagination/Pagination";
import StudentContact from "./StudentContact";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { PaymentStatus } from "./PaymentStatus";
import ApplicationStatus from "./ApplicationStatus";
import LeadType from "./LeadType";
import DocumentVerificationStatus from "./table-cell/DocumentVerificationStatus";
import {
  defaultRowsPerPageOptions,
  provideTheClassName,
} from "../../Calendar/utils";
import QuickDropdownFilters from "./QuickDropdownFilters";
import ShowAutomation from "./ShowAutomation";

function BasicDetailsTable({
  applications,
  rowsPerPage,
  setRowsPerPage,
  rowCount,
  loading,
  selectedApplications,
  setSelectedApplications,
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
  studentId,
  setStudentId,
  handleApplyQuickFilters,
  setSelectStudentApplicationId,
  setUserDetailsStateData,
  handleOpenUserProfileDrawer,
  quickFilterList,
}) {
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
      `${Cookies.get("userId")}arrangedCollumns`,
      JSON.stringify(initialColumns)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
      )
    );
    localStorage.setItem(
      `${Cookies.get("userId")}addedCollumnsOrder`,
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

  const renderTableColumns = (tableHead, dataRow, applicationIndex) => {
    if (tableHead === "name") {
      return (
        <RegisteredName
          localStorageKey="filterOptions"
          dataRow={dataRow}
          applicationIndex={applicationIndex}
          setSelectStudentApplicationId={setSelectStudentApplicationId}
          handleOpenUserProfileDrawer={handleOpenUserProfileDrawer}
          setUserDetailsStateData={setUserDetailsStateData}
          showArrowIcon={true}
        />
      );
    } else if (tableHead === "application") {
      return dataRow?.custom_application_id
        ? dataRow?.custom_application_id
        : `– –`;
    } else if (tableHead === "form") {
      return dataRow?.course_name ? dataRow?.course_name : `– –`;
    } else if (tableHead === "automation") {
      return (
        <ShowAutomation
          automationDetails={{
            count: dataRow?.automation,
            names: dataRow?.automation_names,
          }}
        />
      );
    } else if (tableHead === "contact") {
      return <StudentContact dataRow={dataRow} />;
    } else if (tableHead === "mobile") {
      return dataRow?.student_mobile_no ? dataRow?.student_mobile_no : `– –`;
    } else if (tableHead === "payment") {
      return <PaymentStatus rowData={dataRow} />;
    } else if (tableHead === "DV Status") {
      return (
        <DocumentVerificationStatus
          dataRow={dataRow}
          applicationIndex={applicationIndex}
        />
      );
    } else if (tableHead === "12th Score") {
      return dataRow?.twelve_marks_name ? dataRow?.twelve_marks_name : `– –`;
    } else if (tableHead === "Registration Date") {
      return dataRow?.date ? dataRow?.date : `– –`;
    } else if (tableHead === "State") {
      return dataRow?.state_name ? dataRow?.state_name : `– –`;
    } else if (tableHead === "City") {
      return dataRow?.city_name ? dataRow?.city_name : `– –`;
    } else if (tableHead === "Source") {
      return dataRow?.source_name ? dataRow?.source_name : `– –`;
    } else if (tableHead === "Lead Type") {
      return <LeadType rowData={dataRow} />;
    } else if (tableHead === "Lead Stage") {
      return (
        <Box className="status lead-stage">
          {dataRow?.lead_stage ? dataRow?.lead_stage : `– –`}
        </Box>
      );
    } else if (tableHead === "Counselor Name") {
      return dataRow?.counselor_name ? dataRow?.counselor_name : `– –`;
    } else if (tableHead === "Application Stage") {
      return <ApplicationStatus dataRow={dataRow} />;
    } else if (tableHead === "UTM Campaign") {
      return dataRow?.utm_campaign ? dataRow?.utm_campaign : `– –`;
    } else if (tableHead === "UTM Medium") {
      return dataRow?.utm_medium ? dataRow?.utm_medium : `– –`;
    } else if (tableHead === "Outbound Calls Count") {
      return dataRow?.outbound_call ? dataRow?.outbound_call : `– –`;
    } else if (tableHead === "Source Type") {
      return dataRow.source_type?.length > 0
        ? dataRow.source_type?.map((type) => (
            <Box className="source-type-status status">{type}</Box>
          ))
        : `– –`;
    } else if (tableHead === "Verification Status") {
      return (
        <Box
          className={`${
            dataRow?.is_verify === "verified" ? "captured" : "failed"
          } status`}
        >
          {dataRow?.is_verify || `– –`}
        </Box>
      );
    } else if (tableHead === "Lead Sub Stage") {
      return dataRow.lead_sub_stage ? (
        <Box className="status lead-stage">{dataRow.lead_sub_stage}</Box>
      ) : (
        <Box> `– –`</Box>
      );
    }
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const item = reorder(items, result.source.index, result.destination.index);
    localStorage.setItem(
      `${Cookies.get("userId")}arrangedCollumns`,
      JSON.stringify(item)
    );
    setItems(
      JSON.parse(
        localStorage.getItem(`${Cookies.get("userId")}arrangedCollumns`)
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

  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      setStudentId(applications.map((application) => application.student_id));
      const adminSelectedApplications = JSON.parse(
        localStorage.getItem(
          `${Cookies.get("userId")}adminSelectedApplications`
        )
      );

      if (adminSelectedApplications?.length > 0) {
        //applications
        const filteredApplications = applications.filter(
          (application) =>
            !selectedApplications.some(
              (element) => element.application_id === application.application_id
            )
        );

        setSelectedApplications((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);
        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedApplications`,
          JSON.stringify([...selectedApplications, ...filteredApplications])
        );
      } else {
        setSelectedApplications(applications);
        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedApplications`,
          JSON.stringify(applications)
        );
      }
    } else {
      setStudentId([]);
      //set selected applications
      const filteredApplications = selectedApplications.filter(
        (application) =>
          !applications.some(
            (element) => element.application_id === application.application_id
          )
      );
      setSelectedApplications(filteredApplications);
      localStorage.setItem(
        `${Cookies.get("userId")}adminSelectedApplications`,
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
      (application) => application.application_id
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
      (application) => application.application_id
    );
    if (e.target.checked === true) {
      setStudentId((prev) => [...prev, dataRow.student_id]);
      if (selectedApplications.length < 1) {
        //applications
        setSelectedApplications([dataRow]);
        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedApplications`,
          JSON.stringify([dataRow])
        );
      } else if (!selectedApplicationIds.includes(dataRow.application_id)) {
        //applications
        setSelectedApplications((currentArray) => [...currentArray, dataRow]);

        localStorage.setItem(
          `${Cookies.get("userId")}adminSelectedApplications`,
          JSON.stringify([...selectedApplications, dataRow])
        );
      }
    } else {
      const previousStudentIds = [...studentId];
      const currentStudentIndex = previousStudentIds.indexOf(
        dataRow.student_id
      );
      previousStudentIds.splice(currentStudentIndex, 1);
      setStudentId(previousStudentIds);

      const filteredApplications = selectedApplications.filter((object) => {
        return object.application_id !== dataRow.application_id;
      });

      setSelectedApplications(filteredApplications);
      localStorage.setItem(
        `${Cookies.get("userId")}adminSelectedApplications`,
        JSON.stringify(filteredApplications)
      );
    }
  };

  // set selected applications in state from localstorage after reload
  useEffect(() => {
    //applications
    const adminSelectedApplications = JSON.parse(
      localStorage.getItem(`${Cookies.get("userId")}adminSelectedApplications`)
    );
    if (adminSelectedApplications?.length > 0) {
      setSelectedApplications(adminSelectedApplications);
      setStudentId(
        adminSelectedApplications?.map((application) => application.student_id)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="basicDetailsTable">
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
              sx={{ minWidth: 700, boxShadow: 0 }}
              className="custom-scrollbar"
            >
              <Table>
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
                            dataRow?.application_id
                          ) !== -1
                            ? "selected-lead"
                            : ""
                        }
                        key={dataRow.application_id}
                      >
                        {!isActionDisable && (
                          <TableCell
                            className={`table-row-sticky ${provideTheClassName(
                              dataRow
                            )}`}
                          >
                            {selectedApplicationIds?.includes(
                              dataRow?.application_id
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
                                    dataRow?.application_id
                                  )
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  handleApplicationCheckBox(e, dataRow);
                                }}
                              />
                            )}
                          </TableCell>
                        )}
                        {items?.map((item) => {
                          return (
                            <TableCell
                              align={item.id === "12th Score" ? "center" : ""}
                              className="basic-details-table-row"
                              key={item.id}
                            >
                              {renderTableColumns(item.id, dataRow, index)}
                            </TableCell>
                          );
                        })}
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
                    handleChangePage(
                      page,
                      `adminApplicationSavePageNo`,
                      setPage
                    )
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
                  localStorageChangePage={`adminApplicationSavePageNo`}
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
            borderRadius: '30px',
          },
        }}
      >
        <Box className="rearrange-columns-dialog-head" paddingLeft='25px' paddingTop='15px' paddingRight='35px'
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
                            <ReorderIcon className="reorder-icon" sx={{color:'black'}}/>
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
    </Box>
  );
}

export default React.memo(BasicDetailsTable);
