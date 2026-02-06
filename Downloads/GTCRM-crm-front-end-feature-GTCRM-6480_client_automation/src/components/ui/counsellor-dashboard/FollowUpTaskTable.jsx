import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import Cookies from "js-cookie";
import "../../../styles/sharedStyles.css";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useUpdateFollowupStatusMutation } from "../../../Redux/Slices/applicationDataApiSlice";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { useContext } from "react";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import Pagination from "../../shared/Pagination/Pagination";
import UpdateStatusCheckbox from "./UpdateStatusCheckbox";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TableTopPagination from "../application-manager/TableTopPagination";
import TableDataCount from "../application-manager/TableDataCount";
import SortIndicatorWithTooltip from "../../shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { followupDetailsTableHeaders } from "../../../constants/LeadStageList";

const FollowUpTaskTable = ({
  followUpReportData,
  rowCount,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
  totalFollowupReports,
  setFollowUpTaskInternalServerError,
  setSomethingWentWrongInFollowUpTask,
  otherFollowupKey,
  dateRange,
  headCounselorId,
  counsellorDashboard,
  sortingColumn,
  setSortingColumn,
  sortingType,
  setSortingType,
}) => {
  const theme = useTheme();
  const smallDevices = useMediaQuery(theme.breakpoints.down("sm"));

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  const count = Math.ceil(rowCount / rowsPerPage);
  localStorage.setItem(
    `${Cookies.get("userId")}totalPage`,
    JSON.stringify(count)
  );
  const navigate = useNavigate();
  const pushNotification = useToasterHook();
  const [handleUpdateFollowupStatus] = useUpdateFollowupStatusMutation();
  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  // function to complete followup
  const handleCompleteAndIncompleteFollowup = (
    checkedValue,
    applicationId,
    indexNumber
  ) => {
    handleUpdateFollowupStatus({
      checkedValue,
      applicationId,
      indexNumber,
      collegeId,
    })
      .unwrap()
      .then((res) => {
        if (res.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res.code === 200) {
          try {
            if (typeof res.message === "string") {
              pushNotification("success", res?.message);
            } else {
              throw new Error("Followup status update api response is changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInFollowUpTask,
              "",
              5000
            );
          }
        } else if (res.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch(() => {
        handleInternalServerError(setFollowUpTaskInternalServerError, "", 5000);
      });
  };

  const nameColumnRef = useRef(null);
  const [nameColumnMinWidth, setNameColumnMinWidth] = useState(0);

  useEffect(() => {
    if (nameColumnRef.current) {
      const cell = nameColumnRef.current.offsetWidth;
      setNameColumnMinWidth(cell);
    }
  }, [followUpReportData]);

  const permissions = useSelector((state) => state.authentication.permissions);
  const [features, setFeatures] = useState({});

  useEffect(() => {
    setFeatures(
      permissions?.["aefd607c"]?.features?.["c2a62998"]?.features?.["a5168b10"]
        ?.features
    );
  }, [permissions]);

  return (
    <>
      <Box sx={{ mt: 2 }} className="followup-task-table-container">
        <TableDataCount
          currentPageShowingCount={followUpReportData?.length}
          totalCount={totalFollowupReports}
          pageNumber={page}
          rowsPerPage={rowsPerPage}
        />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TableTopPagination
            pageNumber={page}
            setPageNumber={setPage}
            totalCount={totalFollowupReports}
            rowsPerPage={rowsPerPage}
          />
        </Box>
      </Box>
      {followUpReportData?.length > 0 ? (
        <>
          <TableContainer className="custom-scrollbar">
            <Table className="followup-task-main-table">
              <TableHead>
                <TableRow>
                  <TableCell className="table-row-sticky" align="center">
                    Mark as Completed
                  </TableCell>

                  <TableCell
                    ref={nameColumnRef}
                    sx={{ left: "160px" }}
                    className="table-row-sticky"
                    align="left"
                  >
                    Lead Name
                  </TableCell>
                  <TableCell
                    sx={{ left: `${nameColumnMinWidth + 155}px` }}
                    className="table-row-sticky"
                    align="center"
                  >
                    <Box
                      sx={{
                        justifyContent: "center",
                      }}
                      className="sorting-option-with-header-content"
                    >
                      Status
                      <>
                        <SortIndicatorWithTooltip
                          sortType={
                            sortingColumn === "status" ? sortingType : ""
                          }
                          value="status"
                          sortColumn={sortingColumn}
                          setSortType={setSortingType}
                          setSortColumn={setSortingColumn}
                        />
                      </>
                    </Box>
                  </TableCell>

                  {followupDetailsTableHeaders?.map((head) => (
                    <>
                      <TableCell key={head.name}>
                        <Box
                          sx={{
                            justifyContent: head?.align,
                          }}
                          className="sorting-option-with-header-content"
                        >
                          {head?.name}
                          {head?.sort && (
                            <>
                              <SortIndicatorWithTooltip
                                sortType={
                                  sortingColumn === head?.value
                                    ? sortingType
                                    : ""
                                }
                                value={head?.value}
                                sortColumn={sortingColumn}
                                setSortType={setSortingType}
                                setSortColumn={setSortingColumn}
                              />
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {followUpReportData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" className="table-row-sticky">
                      <UpdateStatusCheckbox
                        status={row?.status?.toLowerCase()}
                        handleCompleteAndIncompleteFollowup={
                          handleCompleteAndIncompleteFollowup
                        }
                        applicationId={row?.application_id}
                        index={row?.index_number}
                      />
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{ left: "160px" }}
                      className={smallDevices ? "" : "table-row-sticky"}
                    >
                      <Box className="followup-student-name">
                        <Box
                          onClick={() => {
                            navigate("/userProfile", {
                              state: {
                                applicationId: row?.application_id,
                                studentId: row?.student_id,
                                courseName: row?.course_name || row.course,
                                from: `${
                                  otherFollowupKey
                                    ? otherFollowupKey[2]
                                    : "followupTask"
                                }`,
                                dateRange: dateRange,
                                headCounselorId: headCounselorId,
                                eventType: "followup",
                              },
                            });
                            localStorage.setItem(
                              `${Cookies.get("userId")}applicationIndex`,
                              JSON.stringify(index)
                            );
                          }}
                          sx={{ fontWeight: 400 }}
                        >
                          {row.student_name ? row.student_name : "- -"}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ left: `${nameColumnMinWidth + 155}px` }}
                      className={smallDevices ? "" : "table-row-sticky"}
                      align="center"
                    >
                      <Box
                        className={`${row?.status?.toLowerCase()} followupStatus`}
                      >
                        {row.status ? row.status : "- -"}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {row.overdue_days ? row.overdue_days + " Days" : "- -"}
                    </TableCell>
                    <TableCell>
                      {row.followup_date ? row.followup_date : "- -"}
                    </TableCell>
                    {/* <TableCell> will implement it later
                      {row.followup_labels ? row.followup_labels : "- -"}
                    </TableCell> */}

                    <TableCell>
                      {row.lead_activity ? row.lead_activity : "- -"}
                    </TableCell>

                    <TableCell>
                      {row.created_by ? row.created_by : "- -"}
                    </TableCell>
                    <TableCell>
                      {row.updated_by ? row.updated_by : "- -"}
                    </TableCell>

                    <TableCell>
                      {row?.created_on ? row.created_on : "- -"}
                    </TableCell>
                    <TableCell>
                      {row.counselor_name ? row.counselor_name : "- -"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {!counsellorDashboard && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <>
                <Pagination
                  className="pagination-bar"
                  currentPage={page}
                  totalCount={rowCount}
                  pageSize={rowsPerPage}
                  onPageChange={(page) =>
                    handleChangePage(
                      page,
                      `${
                        otherFollowupKey
                          ? otherFollowupKey[0]
                          : "followupTaskSavePageNo"
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
                    otherFollowupKey
                      ? otherFollowupKey[1]
                      : "followupTaskRowPerPage"
                  }`}
                  localStorageChangePage={`${
                    otherFollowupKey
                      ? otherFollowupKey[0]
                      : "followupTaskSavePageNo"
                  }`}
                  setRowsPerPage={setRowsPerPage}
                ></AutoCompletePagination>
              </>
            </Box>
          )}
        </>
      ) : (
        <Box className="followup-task-not-found-container">
          <BaseNotFoundLottieLoader
            height={200}
            width={250}
          ></BaseNotFoundLottieLoader>
        </Box>
      )}

      {features?.["e9c92c33"]?.visibility && counsellorDashboard && (
        <Box sx={{ textAlign: "right" }}>
          <Button
            onClick={() =>
              navigate("/followup-task-details", { state: { tab: 4 } })
            }
            variant="contained"
            color="info"
            size="small"
            sx={{ mt: 2, fontWeight: 400, borderRadius: 3, px: 2.5 }}
          >
            View All
          </Button>
        </Box>
      )}
    </>
  );
};

export default FollowUpTaskTable;
