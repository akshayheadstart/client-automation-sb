import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Tooltip,
  Checkbox,
  Paper,
  IconButton,
} from "@mui/material";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import LeadsViewDialog from "./LeadsViewDialog";
import { useState } from "react";
import "../../styles/RawDataUploadHistoryTable.css";
import "../../styles/sharedStyles.css";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/shared/Pagination/Pagination";
import Cookies from "js-cookie";
import { useEffect } from "react";
import {
  allCheckboxHandlerFunction,
  handleLocalStorageForCheckbox,
  showCheckboxAndIndeterminate,
  singleCheckboxHandlerFunction,
} from "../../helperFunctions/checkboxHandleFunction";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import HistoryDetailsTableData from "./HistoryDetailsTableData";
import useFetchCommonApi from "../../hooks/useFetchCommonApi";
const RawDataUploadHistoryTable = ({
  rawDataUploadHistory,
  rowsPerPage,
  setRowsPerPage,
  rowCount,
  loading,
  page,
  setPage,
  state,
  selectedRawDataUploadHistoryRow,
  setSelectedRawDataUploadHistoryRow,
  setIsScrolledToPagination,
  localeStorageKey,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const count = Math.ceil(rowCount / rowsPerPage);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [leads, setLeads] = useState([]);

  const handleClickOpen = (title, leads) => {
    setOpenDialog(true);
    setDialogTitle(title);
    setLeads(leads);
  };

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

  const rawDataUploadHistoryId = rawDataUploadHistory?.map(
    (rawData) => rawData?._id
  );

  const localStorageKeyName = `${Cookies.get("userId")}${localeStorageKey}`;

  // set selected users in state from local storage after reload
  useEffect(() => {
    handleLocalStorageForCheckbox(
      localStorageKeyName,
      setSelectedRawDataUploadHistoryRow
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorageKeyName]);

  //show top checkbox and indeterminate
  useEffect(() => {
    showCheckboxAndIndeterminate(
      rawDataUploadHistoryId,
      selectedRawDataUploadHistoryRow,
      setSelectTopCheckbox,
      setShowIndeterminate
    );
  }, [rawDataUploadHistoryId, selectedRawDataUploadHistoryRow]);

  //selected item actions section
  const [paginationRef, { entry: paginationEntry }] = useIntersectionObserver();

  const isPaginationVisible =
    paginationEntry && paginationEntry?.isIntersecting;

  useEffect(() => {
    if (isPaginationVisible) {
      setIsScrolledToPagination(true);
    } else {
      setIsScrolledToPagination(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaginationVisible]);
  const { currentUserDetails } = useFetchCommonApi();
  return (
    <Box className="basicDetailsTable">
      {loading ? (
        <TableBody
          sx={{
            width: "100%",
            minHeight: "85vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {" "}
          <LeefLottieAnimationLoader
            height={120}
            width={120}
          ></LeefLottieAnimationLoader>{" "}
        </TableBody>
      ) : rawDataUploadHistory?.length > 0 ? (
        <TableContainer
          className="raw-data-upload-history-table-container custom-scrollbar"
          component={Paper}
        >
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ background: "none" }}>
              <TableRow>
                <TableCell className="table-row-sticky">
                  <Checkbox
                    color="info"
                    checked={selectTopCheckbox}
                    onChange={(e) =>
                      allCheckboxHandlerFunction(
                        e,
                        localStorageKeyName,
                        rawDataUploadHistoryId,
                        selectedRawDataUploadHistoryRow,
                        setSelectedRawDataUploadHistoryRow
                      )
                    }
                    indeterminate={showIndeterminate}
                  />
                </TableCell>
                <TableCell align="center">
                  {" "}
                  {state?.from ? "Doc" : "Data"} Name
                </TableCell>
                <TableCell>Import Date & Time</TableCell>

                <TableCell align="center">Import Status</TableCell>
                <TableCell align="center">Imported By</TableCell>
                <TableCell align="center">
                  {state?.from ? "Lead" : "Entries"} Processed
                </TableCell>
                {currentUserDetails?.role_name !==
                  "college_publisher_console" && (
                  <>
                    <TableCell align="center">
                      Successfully Imported {state?.from ? "Lead" : "Entries"}
                    </TableCell>
                    <TableCell align="center">
                      Duplicate {state?.from ? "Lead" : "Entries"}
                    </TableCell>
                  </>
                )}
                <TableCell align="center">
                  Failed {state?.from ? "Lead" : "Entries"}
                </TableCell>

                {!state?.from && (
                  <>
                    <TableCell align="center">Converted to Lead</TableCell>
                    <TableCell align="center">
                      Converted to Application
                    </TableCell>
                  </>
                )}
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            {rawDataUploadHistory?.length > 0 ? (
              <TableBody>
                {rawDataUploadHistory.map((data) => (
                  <TableRow key={data?._id}>
                    <TableCell className="table-row-sticky">
                      {selectedRawDataUploadHistoryRow?.includes(data?._id) ? (
                        <IconButton
                          sx={{ p: "9px" }}
                          onClick={() => {
                            singleCheckboxHandlerFunction(
                              {
                                target: {
                                  checked: false,
                                },
                              },
                              data?._id,
                              localStorageKeyName,
                              selectedRawDataUploadHistoryRow,
                              setSelectedRawDataUploadHistoryRow
                            );
                          }}
                        >
                          <CheckBoxOutlinedIcon sx={{ color: "#008be2" }} />
                        </IconButton>
                      ) : (
                        <Checkbox
                          checked={
                            selectedRawDataUploadHistoryRow?.includes(data?._id)
                              ? true
                              : false
                          }
                          onChange={(e) => {
                            singleCheckboxHandlerFunction(
                              e,
                              data?._id,
                              localStorageKeyName,
                              selectedRawDataUploadHistoryRow,
                              setSelectedRawDataUploadHistoryRow
                            );
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.data_name ? data?.data_name : `– –`}
                    </TableCell>
                    <TableCell>
                      {data?.uploaded_on ? data?.uploaded_on : `– –`}
                    </TableCell>

                    <TableCell align="center">
                      {data?.import_status ? (
                        <button
                          className={
                            data?.import_status === "completed"
                              ? "completed-status"
                              : "pending-status"
                          }
                        >
                          {data?.import_status}
                        </button>
                      ) : (
                        `– –`
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {data?.uploaded_by ? data?.uploaded_by : `– –`}
                    </TableCell>
                    <TableCell align="center">
                      {data?.lead_processed ? data?.lead_processed : 0}
                    </TableCell>
                    {currentUserDetails?.role_name !==
                      "college_publisher_console" && (
                      <>
                        <TableCell sx={{ color: "#14B8A6" }} align="center">
                          {data?.successfully_lead
                            ? data?.successfully_lead
                            : 0}
                        </TableCell>
                        <TableCell
                          align="center"
                          data-testid="duplicate-lead-column"
                          className={
                            data?.duplicate_lead_data?.length > 0
                              ? "lead-column"
                              : "lead-column-default"
                          }
                          onClick={() =>
                            data?.duplicate_lead_data?.length > 0 &&
                            handleClickOpen(
                              "Duplicate Leads",
                              data?.duplicate_lead_data
                            )
                          }
                        >
                          <Tooltip
                            title={
                              data?.duplicate_lead_data?.length > 0
                                ? "Click to view"
                                : ""
                            }
                            placement="left"
                            arrow
                          >
                            <span>
                              {data?.duplicate_leads
                                ? data?.duplicate_leads
                                : 0}
                            </span>
                          </Tooltip>
                        </TableCell>
                      </>
                    )}

                    <TableCell
                      align="center"
                      className={
                        data?.failed_lead_data?.length > 0
                          ? "lead-column"
                          : "lead-column-default"
                      }
                      onClick={() =>
                        data?.failed_lead_data?.length > 0 &&
                        handleClickOpen("Failed Leads", data?.failed_lead_data)
                      }
                    >
                      <Tooltip
                        title={
                          data?.failed_lead_data?.length > 0
                            ? "Click to view"
                            : ""
                        }
                        placement="left"
                        arrow
                      >
                        <span>{data?.failed_lead ? data?.failed_lead : 0}</span>
                      </Tooltip>
                    </TableCell>

                    {!state?.from && (
                      <>
                        <TableCell align="center">
                          <HistoryDetailsTableData
                            rawDataDetails={{
                              id: data?._id,
                              count: data?.converted_to_lead,
                              uploaded_on: data?.uploaded_on,
                              isApplication: false,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <HistoryDetailsTableData
                            rawDataDetails={{
                              id: data?._id,
                              count: data?.converted_to_application,
                              uploaded_on: data?.uploaded_on,
                              isApplication: true,
                            }}
                          />
                        </TableCell>
                      </>
                    )}
                    <TableCell align="center">
                      <button
                        onClick={() => {
                          if (state?.from) {
                            navigate("/view-leads-data", {
                              state: {
                                lead_offline_id: data?._id,
                                from: state?.from,
                              },
                            });
                          } else {
                            navigate(`/view-raw-data?${data?._id}`, {
                              state: {
                                offlineDataId: data?._id,
                              },
                            });
                          }
                        }}
                        className="view-button"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : null}
          </Table>
        </TableContainer>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            minHeight: "75vh",
            alignItems: "center",
          }}
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}
      {!rawDataUploadHistory && (
        <Card
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BaseNotFoundLottieLoader
            height={250}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Card>
      )}
      {!loading && rawDataUploadHistory?.length > 0 && (
        <Box
          ref={paginationRef}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Pagination
            className="pagination-bar"
            currentPage={page}
            totalCount={rowCount}
            pageSize={rowsPerPage}
            onPageChange={(page) =>
              handleChangePage(
                page,
                `${
                  state?.from === "leadUpload"
                    ? "leadDataUploadHistorySavePageNo"
                    : "rawDataUploadHistorySavePageNo"
                }`,
                setPage
              )
            }
            count={count}
          />

          <AutoCompletePagination
            rowsPerPage={rowsPerPage}
            rowPerPageOptions={rowPerPageOptions}
            setRowsPerPageOptions={setRowsPerPageOptions}
            rowCount={rowCount}
            page={page}
            setPage={setPage}
            localStorageChangeRowPerPage={`${
              state?.from === "leadUpload"
                ? "leadDataUploadHistoryTableRowPerPage"
                : "rawDataUploadHistoryTableRowPerPage"
            }`}
            localStorageChangePage={`${
              state?.from === "leadUpload"
                ? "leadDataUploadHistorySavePageNo"
                : "rawDataUploadHistorySavePageNo"
            }`}
            setRowsPerPage={setRowsPerPage}
          ></AutoCompletePagination>
        </Box>
      )}
      <LeadsViewDialog
        state={state}
        openDialog={openDialog}
        title={dialogTitle}
        leads={leads}
        setOpenDialog={setOpenDialog}
      ></LeadsViewDialog>
    </Box>
  );
};

export default RawDataUploadHistoryTable;
