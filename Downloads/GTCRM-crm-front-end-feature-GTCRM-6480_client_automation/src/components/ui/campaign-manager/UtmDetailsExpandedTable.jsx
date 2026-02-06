import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Cookies from "js-cookie";
import useToasterHook from "../../../hooks/useToasterHook";
import { useEffect } from "react";
import { DateRangePicker } from "rsuite";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Pagination from "../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import GetJsonDate from "../../../hooks/GetJsonDate";
import {
  useGetUtmDetailsQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../Calendar/utils";

const UtmDetailsExpandedTable = ({
  data,
  from,
  index,
  isOpenCollapse,
  handleOpen,
}) => {
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );

  // states for pagination
  const tablePageNo = localStorage.getItem(
    `${Cookies.get("userId")}utmDetailsSelectedPageNo`
  )
    ? parseInt(
        localStorage.getItem(`${Cookies.get("userId")}utmDetailsSelectedPageNo`)
      )
    : 1;

  const tableRowPerPage = localStorage.getItem(
    `${Cookies.get("userId")}utmDetailsSelectedRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}utmDetailsSelectedRowPerPage`
        )
      )
    : 25;

  const [pageNumber, setPageNumber] = useState(tablePageNo);
  const [rowCount, setRowCount] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(tableRowPerPage);
  const count = Math.ceil(rowCount / rowsPerPage);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const [utmDetails, setUtmDetails] = useState([]);

  const [utmDetailsDateRange, setUtmDetailsDateRange] = useState([]);
  const [sourceName, setSourceName] = useState([]);

  const [somethingWentWrongInUtmDetails, setSomethingWentWrongInUtmDetails] =
    useState(false);
  const [utmDetailsInternalServerError, setUtmDetailsInternalServerError] =
    useState(false);
  const [hideUtmDetails, setHideUtmDetails] = useState(false);

  const {
    data: utmDetailsData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetUtmDetailsQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    sourceName: sourceName,
    from: from,
    payloadOfUtmDetails:
      utmDetailsDateRange?.length > 0 ? GetJsonDate(utmDetailsDateRange) : null,
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(utmDetailsData?.data)) {
          setUtmDetails(utmDetailsData?.data);
          setRowCount(utmDetailsData?.total);
        } else {
          throw new Error("get utm details API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(
            setUtmDetailsInternalServerError,
            setHideUtmDetails,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInUtmDetails,
        setHideUtmDetails,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, utmDetailsData]);

  // use react hook for prefetch data
  const prefetchUtmDetailsData = usePrefetch("getUtmDetails");
  useEffect(() => {
    apiCallFrontAndBackPage(
      utmDetailsData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchUtmDetailsData
    );
  }, [
    utmDetailsData,
    pageNumber,
    prefetchUtmDetailsData,
    rowsPerPage,
    collegeId,
  ]);

  const utmType = from?.split("_");
  const dataInDescendingOrder = useMemo(
    () =>
      utmDetails
        .slice()
        .sort(
          (firstElement, secondElement) =>
            secondElement.total_leads - firstElement.total_leads
        ),
    [utmDetails]
  );

  // calculate total
  const totalLead = useMemo(
    () => utmDetails.reduce((total, lead) => lead.total_leads + total, 0),
    [utmDetails]
  );
  const totalPrimary = useMemo(
    () => utmDetails.reduce((total, lead) => lead.primary_leads + total, 0),
    [utmDetails]
  );
  const totalSecondary = useMemo(
    () => utmDetails.reduce((total, lead) => lead.secondary_leads + total, 0),
    [utmDetails]
  );
  const totalTertiary = useMemo(
    () => utmDetails.reduce((total, lead) => lead.tertiary_leads + total, 0),
    [utmDetails]
  );
  const totalVerifiedPercentage = useMemo(
    () =>
      utmDetails.reduce(
        (total, lead) => parseFloat(lead.verified_percentage) + total,
        0
      ),
    [utmDetails]
  );
  const totalPaidPercentage = useMemo(
    () =>
      utmDetails.reduce(
        (total, lead) => parseFloat(lead.paid_percentage) + total,
        0
      ),
    [utmDetails]
  );

  const averageVerifiedPercentage =
    utmDetails && totalVerifiedPercentage / utmDetails?.length;
  const averagePaidPercentage =
    utmDetails && totalPaidPercentage / utmDetails?.length;

  return (
    <>
      <TableRow>
        <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 0,
            }}
          >
            <Box>
              <Typography variant="subtitle2">
                {data?.source_name ? data?.source_name : "N/A"}
              </Typography>
            </Box>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => {
                localStorage.setItem(
                  `${Cookies.get("userId")}utmDetailsSelectedPageNo`,
                  1
                );
                setPageNumber(1);
                localStorage.setItem(
                  `${Cookies.get("userId")}utmDetailsSelectedRowPerPage`,
                  25
                );
                setRowsPerPage(25);
                handleOpen(index);
                setSourceName(data?.source_name);
                setUtmDetailsDateRange([]);
              }}
            >
              {isOpenCollapse === index ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
          <Typography color={"success.main"} variant="subtitle2">
            {data.leads ? data.leads : 0}
          </Typography>
        </TableCell>
        {data?.total_applications && (
          <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
            <Typography sx={{ color: "green" }} variant="subtitle2">
              {data?.total_applications ? data?.total_applications : 0}
            </Typography>
          </TableCell>
        )}
        <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
          <Typography color={"warning.main"} variant="subtitle2">
            {data?.verified_leads ? data?.verified_leads : 0}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
          <Typography color={"info.main"} variant="subtitle2">
            {data.paid_applications ? data.paid_applications : 0}
          </Typography>
        </TableCell>
        <TableCell align="center" sx={{ borderColor: "#d3d4d7" }}>
          <Typography color={"error.main"} variant="subtitle2">
            {data.unpaid_applications ? data.unpaid_applications : 0}
          </Typography>
        </TableCell>
      </TableRow>

      {isOpenCollapse === index && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse
              in={isOpenCollapse === index}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ my: 1, background: "#F3F4F6" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                  <DateRangePicker
                    value={
                      utmDetailsDateRange?.length ? utmDetailsDateRange : null
                    }
                    placeholder="Date Range"
                    placement="bottomEnd"
                    onChange={(value) => {
                      setUtmDetailsDateRange(value);
                    }}
                  />
                </Box>
                {somethingWentWrongInUtmDetails ||
                utmDetailsInternalServerError ? (
                  <Box>
                    {utmDetailsInternalServerError && (
                      <Error500Animation
                        height={400}
                        width={400}
                      ></Error500Animation>
                    )}
                    {somethingWentWrongInUtmDetails && (
                      <ErrorFallback
                        error={apiResponseChangeMessage}
                        resetErrorBoundary={() => window.location.reload()}
                      />
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{ visibility: hideUtmDetails ? "hidden" : "visible" }}
                  >
                    {isFetching ? (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <LeefLottieAnimationLoader width={70} height={70} />
                      </Box>
                    ) : utmDetails?.length > 0 ? (
                      <>
                        <Table>
                          {utmDetails?.length > 0 && (
                            <TableHead
                              width="25%"
                              sx={{ background: "#DCDCDC" }}
                            >
                              <TableRow>
                                <TableCell>
                                  {`${utmType[0]} ${utmType[1]}`} name
                                </TableCell>
                                <TableCell align="center">
                                  Total leads
                                </TableCell>
                                <TableCell align="center">Primary</TableCell>
                                <TableCell align="center">Secondary</TableCell>
                                <TableCell align="center">Tertiary</TableCell>
                                <TableCell align="center">
                                  Lead to verified %
                                </TableCell>
                                <TableCell align="center">
                                  Lead to paid application %
                                </TableCell>
                              </TableRow>
                            </TableHead>
                          )}
                          <TableBody>
                            {dataInDescendingOrder?.map((historyRow) => (
                              <TableRow
                                key={historyRow.date}
                                sx={{ background: "#F3F4F6" }}
                              >
                                <TableCell sx={{ borderColor: "#d3d4d7" }}>
                                  {historyRow.utm ? historyRow.utm : "N/A"}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.total_leads}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.primary_leads}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.secondary_leads}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.tertiary_leads}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.verified_percentage} %
                                </TableCell>
                                <TableCell
                                  align="center"
                                  sx={{ borderColor: "#d3d4d7" }}
                                >
                                  {historyRow.paid_percentage} %
                                </TableCell>
                              </TableRow>
                            ))}

                            <TableRow>
                              <TableCell sx={{ borderColor: "#d3d4d7" }}>
                                <Typography variant="subtitle2">
                                  Total
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {totalLead ? totalLead : 0}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {totalPrimary ? totalPrimary : 0}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {totalSecondary ? totalSecondary : 0}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {totalTertiary ? totalTertiary : 0}
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {averageVerifiedPercentage
                                    ? averageVerifiedPercentage?.toFixed(2)
                                    : 0}{" "}
                                  %
                                </Typography>
                              </TableCell>
                              <TableCell
                                align="center"
                                sx={{ borderColor: "#d3d4d7" }}
                              >
                                <Typography variant="subtitle2">
                                  {averagePaidPercentage
                                    ? averagePaidPercentage?.toFixed(2)
                                    : 0}{" "}
                                  %
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </>
                    ) : (
                      <BaseNotFoundLottieLoader
                        height={150}
                        width={150}
                      ></BaseNotFoundLottieLoader>
                    )}

                    {utmDetails.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          my: 1,
                        }}
                      >
                        <Pagination
                          className="pagination-bar"
                          currentPage={pageNumber}
                          totalCount={rowCount}
                          pageSize={rowsPerPage}
                          onPageChange={(page) =>
                            handleChangePage(
                              page,
                              `utmDetailsSelectedPageNo`,
                              setPageNumber
                            )
                          }
                          count={count}
                        />

                        <AutoCompletePagination
                          rowsPerPage={rowsPerPage}
                          rowPerPageOptions={rowPerPageOptions}
                          setRowsPerPageOptions={setRowsPerPageOptions}
                          rowCount={rowCount}
                          page={pageNumber}
                          setPage={setPageNumber}
                          localStorageChangeRowPerPage={`utmDetailsSelectedRowPerPage`}
                          localStorageChangePage={`utmDetailsSelectedPageNo`}
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default React.memo(UtmDetailsExpandedTable);
