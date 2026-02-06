/* eslint-disable react-hooks/exhaustive-deps */
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  Checkbox,
  ClickAwayListener,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { useIntersectionObserver } from "react-intersection-observer-hook";
import { useSelector } from "react-redux";
import {
  useGetDataSegmentDataQuery,
  usePrefetch,
} from "../../Redux/Slices/dataSegmentSlice";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import SearchInputBox from "../../components/shared/forms/SearchInputBox";
import { handleChangePage } from "../../helperFunctions/pagination";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import useDebounce from "../../hooks/useDebounce";
import useTableCellDesign from "../../hooks/useTableCellDesign";
import useToasterHook from "../../hooks/useToasterHook";
import counsellorSearchIcon from "../../images/searchIcon.png";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import "../../styles/ApplicationManagerTable.css";
import "../../styles/sharedStyles.css";
import "../../styles/voucherPromocodeManager.css";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
const SelectDataSegmentDrawer = ({
  setSelectDataSegmentDrawerOpen,
  totalCount,
  setTotalCount,
  setSelectedDataSegmentIds,
  previewDataSegmentIds,
  setGetDataSegment,
  previewUpdate,
}) => {
  const dataSegmentRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}dataSegmentRecordForPromoCodeTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}dataSegmentRecordForPromoCodeTableRowPerPage`
        )
      )
    : 5;
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(["5", "10"]);
  const [searchText, setSearchText] = useState("");
  const [dataSegmentRecords, setDataSegmentRecords] = useState([]);
  const [
    dataSegmentRecordsInternalServerError,
    setDataSegmentRecordsInternalServerError,
  ] = useState(false);
  const [hideDataSegmentRecords, setHideDataSegmentRecords] = useState(false);
  const [
    somethingWentWrongInDataSegmentRecords,
    setSomethingWentWrongInDataSegmentRecords,
  ] = useState(false);
  const debouncedSearchText = useDebounce(searchText, 500);
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  // pagination
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(dataSegmentRowsPerPage);
  const [pageNumber, setPageNumber] = useState(1);
  const count = Math.ceil(rowCount / rowsPerPage);
  const {
    data: dataSegmentData,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetDataSegmentDataQuery({
    pageNumber: pageNumber,
    rowsPerPage: rowsPerPage,
    collegeId: collegeId,
    searchText: debouncedSearchText,
    featureKey: "ccbb2d7a",
  });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(dataSegmentData?.data)) {
          setDataSegmentRecords(dataSegmentData?.data);
          setRowCount(dataSegmentData?.total);
        } else {
          throw new Error("get all data segment API response has changed");
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
            setDataSegmentRecordsInternalServerError,
            setHideDataSegmentRecords,
            10000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInDataSegmentRecords,
        setHideDataSegmentRecords,
        10000
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isError, isSuccess, dataSegmentData]);

  const prefetchAllDataSegmentData = usePrefetch("getDataSegmentData");
  useEffect(() => {
    apiCallFrontAndBackPage(
      dataSegmentData,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAllDataSegmentData,
      {
        searchText: debouncedSearchText,
        featureKey: "ccbb2d7a",
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dataSegmentData,
    pageNumber,
    prefetchAllDataSegmentData,
    rowsPerPage,
    collegeId,
  ]);
  const [selectedDataSegmentList, setSelectedDataSegmentList] = useState(
    previewDataSegmentIds?.length > 0 ? previewDataSegmentIds : []
  );
  const [selectedDataSegmentId, setSelectedDataSegmentId] = useState([]);
  const localStorageKeyName = `${Cookies.get("userId")}selectedDataSegmentList`;
  const StyledTableCell = useTableCellDesign();
  const [searchFieldToggle, setSearchFieldToggle] = useState(false);
  //top checkbox handler function
  const handleAllCheckbox = (e) => {
    if (e.target.checked === true) {
      const adminSelectedApplications = JSON.parse(
        localStorage.getItem(localStorageKeyName)
      );

      if (adminSelectedApplications?.length > 0) {
        //applications
        const filteredApplications = dataSegmentRecords.filter(
          (dataSegment) =>
            !selectedDataSegmentList.some(
              (element) =>
                element.data_segment_id === dataSegment.data_segment_id
            )
        );

        setSelectedDataSegmentList((currentArray) => [
          ...currentArray,
          ...filteredApplications,
        ]);
        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedDataSegmentList, ...filteredApplications])
        );
      } else {
        setSelectedDataSegmentList(dataSegmentRecords);
        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify(dataSegmentRecords)
        );
      }
    } else {
      //set selected applications
      const filteredApplications = selectedDataSegmentList.filter(
        (dataSegment) =>
          !dataSegmentRecords.some(
            (element) => element.data_segment_id === dataSegment.data_segment_id
          )
      );
      setSelectedDataSegmentList(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  //show top checkbox and indeterminate
  useEffect(() => {
    let applicationCount = 0;
    const applicationIds = dataSegmentRecords?.map(
      (dataSegment) => dataSegment.data_segment_id
    );
    applicationIds?.forEach((item) => {
      if (selectedDataSegmentId?.indexOf(item) !== -1) applicationCount++;
    });

    if (
      applicationCount === dataSegmentRecords?.length &&
      applicationCount > 0
    ) {
      setSelectTopCheckbox(true);
    } else {
      setSelectTopCheckbox(false);
    }

    if (applicationCount < dataSegmentRecords?.length && applicationCount > 0) {
      setShowIndeterminate(true);
    } else {
      setShowIndeterminate(false);
    }
  }, [dataSegmentRecords, selectedDataSegmentId]);
  const handleApplicationCheckBox = (e, dataRow) => {
    const selectedApplicationIds = selectedDataSegmentList.map(
      (dataSegment) => dataSegment.data_segment_id
    );
    if (e.target.checked === true) {
      if (selectedDataSegmentList.length < 1) {
        //applications
        setSelectedDataSegmentList([dataRow]);
        localStorage.setItem(localStorageKeyName, JSON.stringify([dataRow]));
      } else if (!selectedApplicationIds.includes(dataRow.data_segment_id)) {
        //applications
        setSelectedDataSegmentList((currentArray) => [
          ...currentArray,
          dataRow,
        ]);

        localStorage.setItem(
          localStorageKeyName,
          JSON.stringify([...selectedDataSegmentList, dataRow])
        );
      }
    } else {
      const filteredApplications = selectedDataSegmentList.filter((object) => {
        return object.data_segment_id !== dataRow.data_segment_id;
      });

      setSelectedDataSegmentList(filteredApplications);
      localStorage.setItem(
        localStorageKeyName,
        JSON.stringify(filteredApplications)
      );
    }
  };
  useEffect(() => {
    if (selectedDataSegmentList) {
      const selectedDataSegmentIds = selectedDataSegmentList?.map(
        (object) => object?.data_segment_id
      );
      setSelectedDataSegmentId(selectedDataSegmentIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataSegmentList]);
  // selected data segment ids
  useEffect(() => {
    if (selectedDataSegmentList) {
      const allIds = selectedDataSegmentList?.map(
        (segment) => segment?.data_segment_id
      );
      setSelectedDataSegmentIds(allIds);
      const sum = selectedDataSegmentList?.reduce(
        (total, item) => total + item.count_of_entities,
        0
      );
      setTotalCount(sum);
      if (previewUpdate) {
        setGetDataSegment(selectedDataSegmentList);
      }
    }
  }, [selectedDataSegmentList]);
  const [isScrolledToPagination, setIsScrolledToPagination] = useState(false);
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
  return (
    <>
      <Box className="voucher-drawer-box-top">
        <Typography className="voucher-drawer-headline-text">
          Select Data Segment
        </Typography>
        <IconButton>
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setSelectDataSegmentDrawerOpen(false)}
          />
        </IconButton>
      </Box>
      <Box className="voucher-drawer-content-box">
        {isFetching ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LeefLottieAnimationLoader
              height={100}
              width={150}
            ></LeefLottieAnimationLoader>{" "}
          </Box>
        ) : (
          <>
            {dataSegmentRecordsInternalServerError ||
            somethingWentWrongInDataSegmentRecords ? (
              <Box
                className="error-animation-box"
                data-testid="error-animation-container"
              >
                {dataSegmentRecordsInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInDataSegmentRecords && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Box>
            ) : (
              <>
                {dataSegmentRecords?.length > 0 && (
                  <Box className="data-segment-select-box-heading">
                    <Box>
                      <Typography className="data-segment-select-headline-text">
                        Select Data Segment
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: "5px" }}>
                      <Box sx={{ mb: 1 }}>
                        <ClickAwayListener
                          onClickAway={() => setSearchFieldToggle(false)}
                        >
                          <Box>
                            {!searchFieldToggle ? (
                              <img
                                onClick={() => setSearchFieldToggle(true)}
                                src={counsellorSearchIcon}
                                alt=""
                                srcset=""
                                height={"38px"}
                              />
                            ) : (
                              <SearchInputBox
                                setSearchText={setSearchText}
                                searchText={searchText}
                                className={"button-design-counsellor-search"}
                                maxWidth={200}
                              />
                            )}
                          </Box>
                        </ClickAwayListener>
                      </Box>
                    </Box>
                  </Box>
                )}
                {dataSegmentRecords?.length > 0 ? (
                  <Box
                    sx={{
                      visibility: hideDataSegmentRecords ? "hidden" : "visible",
                    }}
                  >
                    <TableContainer
                      sx={{ boxShadow: 0 }}
                      component={Paper}
                      className="custom-scrollbar"
                    >
                      <Table
                        sx={{ minWidth: 400 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow
                            sx={{
                              borderBottom: "1px solid rgba(238, 238, 238, 1)",
                            }}
                          >
                            <StyledTableCell>
                              <Checkbox
                                sx={{
                                  "&.Mui-checked": {
                                    color: "#008be2",
                                  },
                                  "&.MuiCheckbox-indeterminate": {
                                    color: "#008be2",
                                  },
                                }}
                                checked={selectTopCheckbox}
                                onChange={(e) => {
                                  handleAllCheckbox(e);
                                }}
                                indeterminate={showIndeterminate}
                              />
                            </StyledTableCell>
                            <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                              {" "}
                              Name
                            </StyledTableCell>
                            <StyledTableCell
                              sx={{ whiteSpace: "nowrap" }}
                              align="center"
                            >
                              {" "}
                              Lead Count
                            </StyledTableCell>
                            <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                              {" "}
                              Type
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataSegmentRecords?.map((row, index) => (
                            <TableRow
                              sx={{
                                borderBottom:
                                  "1px solid rgba(238, 238, 238, 1)",
                              }}
                              key={index}
                            >
                              <StyledTableCell>
                                {selectedDataSegmentId?.includes(
                                  row?.data_segment_id
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
                                        row
                                      );
                                    }}
                                  >
                                    <CheckBoxOutlinedIcon
                                      sx={{ color: "#008be2" }}
                                    />
                                  </IconButton>
                                ) : (
                                  <Checkbox
                                    sx={{
                                      "&.Mui-checked": {
                                        color: "#008be2",
                                      },
                                    }}
                                    checked={
                                      selectedDataSegmentId?.includes(
                                        row?.data_segment_id
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      handleApplicationCheckBox(e, row);
                                    }}
                                  />
                                )}
                              </StyledTableCell>

                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Typography className="data-segment-value-text-size-data-segment">{`${
                                  row?.data_segment_name
                                    ? row?.data_segment_name
                                    : "---"
                                }`}</Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="center"
                              >
                                <Typography className="data-segment-value-text-size-data-segment">{`${
                                  row?.count_of_entities
                                    ? row?.count_of_entities
                                    : "---"
                                }`}</Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                bodyCellPadding={"16px 18px !important"}
                                sx={{ whiteSpace: "nowrap", color: "#092C4C" }}
                                align="left"
                              >
                                <Typography className="data-segment-value-text-size-data-segment">{`${
                                  row?.segment_type ? row?.segment_type : "---"
                                }`}</Typography>
                              </StyledTableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        mr: "-30px",
                        mt: "10px",
                      }}
                      ref={paginationRef}
                    >
                      <Pagination
                        className="pagination-bar"
                        currentPage={pageNumber}
                        totalCount={rowCount}
                        pageSize={rowsPerPage}
                        onPageChange={(page) => {
                          handleChangePage(
                            page,
                            `dataSegmentRecordForPromoCodeSavePageNo`,
                            setPageNumber
                            // setCallAPI
                          );
                        }}
                        count={count}
                      />

                      <AutoCompletePagination
                        rowsPerPage={rowsPerPage}
                        rowPerPageOptions={rowPerPageOptions}
                        setRowsPerPageOptions={setRowsPerPageOptions}
                        rowCount={rowCount}
                        page={pageNumber}
                        setPage={setPageNumber}
                        localStorageChangeRowPerPage={
                          "dataSegmentRecordForPromoCodeTableRowPerPage"
                        }
                        localStorageChangePage={
                          "dataSegmentRecordForPromoCodeSavePageNo"
                        }
                        setRowsPerPage={setRowsPerPage}
                        // setCallAPI={setCallAPI}
                      ></AutoCompletePagination>
                    </Box>
                    {selectedDataSegmentList?.length > 0 && (
                      <Box className="promoCode-data-segment-action-wrapper">
                        <Card
                          className={`promoCode-data-segment--action-card ${
                            isScrolledToPagination ? "move-up" : "move-down"
                          }`}
                        >
                          <Box className="promoCode-data-segment-content-container">
                            <Box className="promoCode-data-segment-content">
                              <Typography variant="subtitle1">
                                {" "}
                                {selectedDataSegmentList?.length} selected |
                                Total Data: {totalCount}
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      minHeight: "30vh",
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
              </>
            )}
          </>
        )}
      </Box>
      <Box className="select-data-segment-button-box">
        <Button
          sx={{ borderRadius: 50, height: "38px !important" }}
          variant="outlined"
          size="medium"
          color="info"
          onClick={() => {
            setSelectDataSegmentDrawerOpen(false);
          }}
        >
          Back
        </Button>
        <Button
          sx={{ borderRadius: 50 }}
          variant="contained"
          size="medium"
          color="info"
          className={"view-profile-button"}
          onClick={() => {
            setSelectDataSegmentDrawerOpen(false);
          }}
        >
          Continue
        </Button>
      </Box>
    </>
  );
};

export default SelectDataSegmentDrawer;
