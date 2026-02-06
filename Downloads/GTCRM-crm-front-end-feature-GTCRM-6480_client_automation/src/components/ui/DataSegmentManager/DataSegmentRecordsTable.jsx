import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import useToasterHook from "../../../hooks/useToasterHook";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import Pagination from "../../shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import "../../../styles/DataSegmentRecordsTable.css";
import CreateDataSegmentDrawer from "./CreateDataSegmentDrawer";
import { Dropdown, SelectPicker } from "rsuite";
import {
  dataSegmentTypes,
  segmentTypes,
} from "../../../constants/LeadStageList";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { BootstrapTooltip } from "../../shared/Tooltip/BootsrapTooltip";
import TableDataCount from "../application-manager/TableDataCount";
import {
  useGetDataSegmentDataQuery,
  usePrefetch,
} from "../../../Redux/Slices/dataSegmentSlice";
import useDebounce from "../../../hooks/useDebounce";
import MultipleFilterSelectPicker from "../../shared/filters/MultipleFilterSelectPicker";
import DataSegmentUserProfile from "./DataSegmentUserProfile";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../../images/searchIcon.png";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";

const renderButton = (props, ref, buttonText) => {
  return (
    <div
      className={
        buttonText === "Active"
          ? "data-segment-active-status-box"
          : buttonText === "Closed" && "data-segment-closed-status-box"
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0px",
      }}
      {...props}
      ref={ref}
    >
      <button
        style={{
          background: "transparent",
        }}
      >
        {buttonText}
      </button>
      <ArrowDropDownIcon sx={{ ml: "-8px" }} />
    </div>
  );
};

const DataSegmentRecordsTable = ({
  selectedDataSegmentList,
  setSelectedDataSegmentList,
  paginationRef,
  setDataSegmentRecordsInternalServerError,
  dataSegmentRecordsInternalServerError,
  setSomethingWentWrongInDataSegmentRecords,
  somethingWentWrongInDataSegmentRecords,
  localStorageKeyName,
  handleSelectDataSegmentStatus,
  from,
  selectedDataSegmentId,
  setSelectedDataSegmentId,
}) => {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(["5", "10"]);
  const StyledTableCell = useTableCellDesign();
  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );

  const permissions = useSelector((state) => state.authentication.permissions);
  const editPermission =
    permissions?.menus?.data_segment_manager?.data_segment_manager?.features
      ?.edit_data_segment;

  const [dataSegmentRecords, setDataSegmentRecords] = useState([]);

  const [hideDataSegmentRecords, setHideDataSegmentRecords] = useState(false);

  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);

  const [selectedSegmentType, setSelectedSegmentType] = useState("");
  const [selectedDataType, setSelectedDataType] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [headerStatus, setHeaderStatus] = useState("");

  const debouncedSearchText = useDebounce(searchText, 500);

  const statusList = ["Active", "Closed"];

  const handleHeaderStatusChange = (selectedStatus) => {
    setHeaderStatus(selectedStatus);
    setPageNumber(1);
  };

  const renderStatusItems = (dataSegmentId) => {
    return statusList.map((status, index) => (
      <Dropdown.Item
        key={index}
        onClick={() => {
          dataSegmentId
            ? handleSelectDataSegmentStatus(status, dataSegmentId)
            : handleHeaderStatusChange(status);
        }}
      >
        {status}
      </Dropdown.Item>
    ));
  };

  const dataSegmentPageNumber = localStorage.getItem(
    `${Cookies.get("userId")}dataSegmentRecordSavePageNo`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}dataSegmentRecordSavePageNo`
        )
      )
    : 1;

  const dataSegmentRowsPerPage = localStorage.getItem(
    `${Cookies.get("userId")}dataSegmentRecordTableRowPerPage`
  )
    ? parseInt(
        localStorage.getItem(
          `${Cookies.get("userId")}dataSegmentRecordTableRowPerPage`
        )
      )
    : 10;

  // pagination
  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(dataSegmentRowsPerPage);
  const [pageNumber, setPageNumber] = useState(dataSegmentPageNumber);
  const count = Math.ceil(rowCount / rowsPerPage);
  const [callAPI, setCallAPI] = useState(false);

  const [dataSegmentDataTypeFilter, setDataSegmentDataTypeFilter] = useState(
    []
  );

  useEffect(() => {
    setDataSegmentDataTypeFilter(selectedDataType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callAPI]);

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
    status: headerStatus,
    featureKey: "4cbd834b",
    payload: {
      segment_type: selectedSegmentType,
      data_types:
        from === "create-automation"
          ? [nestedAutomationPayload?.automation_details?.data_type]
          : dataSegmentDataTypeFilter,
    },
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
  }, [error, isError, isSuccess, dataSegmentData, callAPI]);

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
        status: headerStatus,
        featureKey: "4cbd834b",
        payload: {
          segment_type: selectedSegmentType,
          data_types: dataSegmentDataTypeFilter,
        },
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

  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);

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

  //according to checkbox select set the application id in selectApplications state
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

  // set selected applications in state from local storage after reload
  // useEffect(() => {
  //   //applications
  //   const adminSelectedApplications = JSON.parse(
  //     localStorage.getItem(localStorageKeyName)
  //   );
  //   if (adminSelectedApplications?.length > 0) {
  //     setSelectedDataSegmentList(adminSelectedApplications);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  //set state of application id, emails and mobile numbers
  useEffect(() => {
    const selectedDataSegmentIds = selectedDataSegmentList?.map(
      (object) => object.data_segment_id
    );
    setSelectedDataSegmentId(selectedDataSegmentIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDataSegmentList]);

  const [openDataSegmentShareLinkDialog, setOpenDataSegmentShareLinkDialog] =
    useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState({});
  const handleDataSegmentShareLinkClickOpen = () => {
    setOpenDataSegmentShareLinkDialog(true);
  };

  const handleDataSegmentShareLinkClose = () => {
    setOpenDataSegmentShareLinkDialog(false);
  };
  const navigate = useNavigate();

  const [searchFieldToggle, setSearchFieldToggle] = useState(false);

  return (
    <Box
      className="data-segment-records-box"
      sx={{ p: from === "create-automation" ? "30px 0px 20px 0px" : "28px" }}
    >
      {from === "create-automation" && (
        <Box sx={{ px: "25px" }} className="data-segment-table-top-box">
          <Box className="automation-drawer-filter-title">
            Select Data Segment
          </Box>

          <ClickAwayListener onClickAway={() => setSearchFieldToggle(false)}>
            <Box>
              {!searchFieldToggle ? (
                <Box sx={{ cursor: "pointer" }}>
                  <img
                    onClick={() => setSearchFieldToggle(true)}
                    src={searchIcon}
                    alt=""
                    srcset=""
                  />
                </Box>
              ) : (
                <>
                  <TextField
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#008BE2",
                      },
                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#008BE2",
                        },
                      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#008BE2",
                        },
                      width: "230px",
                    }}
                    value={searchText}
                    onChange={(event) => {
                      setSearchText(event.target.value);
                    }}
                    placeholder="Search Data Segment"
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#008BE2" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              )}
            </Box>
          </ClickAwayListener>
        </Box>
      )}

      {from !== "create-automation" && (
        <Box className="data-segment-table-top-box">
          <Box className="data-segment-filter-options">
            <SelectPicker
              data={segmentTypes}
              style={{ width: "150px" }}
              placeholder="Segment Type"
              onChange={(value) => {
                setSelectedSegmentType(value);
                setPageNumber(1);
              }}
              placement="bottomEnd"
            />

            <MultipleFilterSelectPicker
              onChange={(value) => {
                setSelectedDataType(value);
                setPageNumber(1);
              }}
              pickerData={dataSegmentTypes}
              placeholder="Data Type"
              pickerValue={selectedDataType}
              className="dashboard-select-picker"
              setSelectedPicker={setSelectedDataType}
              style={{ width: "150px" }}
              callAPIAgain={() => setCallAPI((preV) => !preV)}
              onClean={() => {
                setCallAPI((preV) => !preV);
              }}
            />
          </Box>

          <Box className="data-segment-filter-options">
            <TextField
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#008BE2",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#008BE2",
                  },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#008BE2",
                  },
                width: "230px",
              }}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
              placeholder="Search Data Segment"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#008BE2" }} />
                  </InputAdornment>
                ),
              }}
            />
            {/* {editPermission && ( */}
            <Button
              id="manage-automation-btn"
              onClick={() => setOpenCreateDataSegmentDrawer(true)}
              startIcon={<AddIcon sx={{ color: "#008BE2" }} />}
            >
              Create Data Segment
            </Button>
            {/* )} */}
          </Box>
        </Box>
      )}

      <Box>
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
            ) : dataSegmentRecords?.length > 0 ? (
              <Box
                sx={{
                  visibility: hideDataSegmentRecords ? "hidden" : "visible",
                }}
              >
                {from !== "create-automation" && (
                  <TableDataCount
                    totalCount={rowCount}
                    currentPageShowingCount={dataSegmentRecords?.length}
                    pageNumber={pageNumber}
                    rowsPerPage={rowsPerPage}
                  />
                )}
                <TableContainer className="custom-scrollbar">
                  <Table
                    size="small"
                    sx={{
                      minWidth: from !== "create-automation" && 650,
                      whiteSpace: "nowrap",
                    }}
                    aria-label="a dense table"
                  >
                    <TableHead
                      sx={{
                        background: "#fff",
                        color: "#7E92A2",
                      }}
                    >
                      <TableRow
                        sx={{
                          borderBottom: "1px solid #aaadab",
                        }}
                      >
                        <StyledTableCell width="2%">
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
                        <StyledTableCell width="2%">
                          {from === "create-automation"
                            ? "Name"
                            : "Segment Name"}
                        </StyledTableCell>
                        {from !== "create-automation" && (
                          <>
                            <StyledTableCell width="10%">
                              Created On
                            </StyledTableCell>
                            <StyledTableCell width="15%">
                              Created By
                            </StyledTableCell>
                            <StyledTableCell width="15%">
                              Data Type
                            </StyledTableCell>
                          </>
                        )}

                        {from === "create-automation" ? (
                          <>
                            <StyledTableCell width="2%">
                              Lead Count
                            </StyledTableCell>
                            <StyledTableCell width="8%">Type</StyledTableCell>
                          </>
                        ) : (
                          <>
                            <StyledTableCell width="2%">
                              Segment Type
                            </StyledTableCell>
                            <StyledTableCell width="2%">
                              Entries
                            </StyledTableCell>
                          </>
                        )}

                        {from !== "create-automation" && (
                          <>
                            <StyledTableCell width="15%">
                              Communications
                            </StyledTableCell>
                            {/* {editPermission && ( */}
                            <StyledTableCell width="15%">
                              Linked Automation
                            </StyledTableCell>
                            {/* )} */}
                            <StyledTableCell width="15%">
                              <Dropdown
                                placement="bottomEnd"
                                renderToggle={(props, ref) =>
                                  renderButton(props, ref, "Status")
                                }
                              >
                                {renderStatusItems()}
                              </Dropdown>
                            </StyledTableCell>
                            {/* {editPermission && ( */}
                            <StyledTableCell width="15%">Share</StyledTableCell>
                            {/* )} */}
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataSegmentRecords?.map((row, index) => {
                        return (
                          <TableRow
                            sx={{
                              borderBottom: "1px solid blue",
                              "& .MuiTableCell-root": {
                                color: `${
                                  row?.status === "Active" ? "" : "#9e9e9e"
                                } !important`,
                              },
                            }}
                          >
                            <StyledTableCell bodyCellPadding="10px 16px">
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
                            <StyledTableCell>
                              <span
                                onClick={() => {
                                  if (from !== "create-automation") {
                                    navigate("/data-segment-details", {
                                      state: {
                                        segmentId: row.data_segment_id,
                                        module_name: row?.module_name,
                                      },
                                    });
                                  }
                                }}
                                style={{
                                  cursor:
                                    from !== "create-automation" && "pointer",
                                }}
                              >
                                {row?.data_segment_name
                                  ? row?.data_segment_name
                                  : `– –`}
                              </span>
                            </StyledTableCell>
                            {from !== "create-automation" && (
                              <>
                                <StyledTableCell>
                                  {row?.created_on
                                    ? row?.created_on
                                        ?.split(" ")
                                        ?.slice(0, 2)
                                        ?.join(" ")
                                    : `– –`}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {row?.created_by_name
                                    ? row?.created_by_name
                                    : `– –`}
                                </StyledTableCell>
                                <StyledTableCell>
                                  <Box
                                    className="data-type-box"
                                    sx={{
                                      width:
                                        row?.module_name === "Application"
                                          ? "75px"
                                          : "56px",
                                    }}
                                  >
                                    {row?.module_name
                                      ? row?.module_name === "Raw Data"
                                        ? row?.module_name?.split(" ")[0]
                                        : row?.module_name
                                      : `– –`}
                                  </Box>
                                </StyledTableCell>
                              </>
                            )}
                            {from === "create-automation" ? (
                              <>
                                <StyledTableCell width="15%">
                                  {row?.current_data_count
                                    ? row?.current_data_count
                                    : 0}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {row?.segment_type
                                    ? row?.segment_type
                                    : `– –`}
                                </StyledTableCell>
                              </>
                            ) : (
                              <>
                                <StyledTableCell>
                                  {row?.segment_type
                                    ? row?.segment_type
                                    : `– –`}
                                </StyledTableCell>
                                <StyledTableCell width="15%">
                                  {row?.current_data_count
                                    ? row?.current_data_count
                                    : 0}
                                </StyledTableCell>
                              </>
                            )}
                            {from !== "create-automation" && (
                              <>
                                <StyledTableCell width="15%">
                                  <BootstrapTooltip
                                    arrow
                                    title={
                                      row?.communication_info.total >= 0 && (
                                        <Box className="bootstrap-tooltip-text-value-box">
                                          <Typography className="bootstrap-tooltip-text">
                                            Email :{" "}
                                            {row?.communication_info?.email}
                                          </Typography>
                                          <Typography className="bootstrap-tooltip-text">
                                            SMS : {row?.communication_info?.sms}
                                          </Typography>
                                          <Typography className="bootstrap-tooltip-text">
                                            WhatsApp :{" "}
                                            {row?.communication_info?.whatsapp}
                                          </Typography>
                                        </Box>
                                      )
                                    }
                                    placement="right"
                                    backgroundColor="#008BE2"
                                  >
                                    {row?.communication_info?.total
                                      ? row?.communication_info?.total
                                      : 0}
                                  </BootstrapTooltip>
                                </StyledTableCell>
                                {/* {editPermission && ( */}
                                <StyledTableCell width="15%">
                                  <BootstrapTooltip
                                    arrow
                                    title={
                                      row?.linked_automation_info?.length >
                                        0 && (
                                        <Box className="bootstrap-tooltip-text-value-box">
                                          {row?.linked_automation_info?.map(
                                            (automation, index) => (
                                              <Typography
                                                key={index}
                                                className="bootstrap-tooltip-text"
                                              >
                                                {automation?.automation_name}
                                              </Typography>
                                            )
                                          )}
                                        </Box>
                                      )
                                    }
                                    placement="right"
                                    backgroundColor="#008BE2"
                                  >
                                    {row?.linked_automation_count
                                      ? row?.linked_automation_count
                                      : 0}
                                  </BootstrapTooltip>
                                </StyledTableCell>
                                {/* )} */}

                                <StyledTableCell width="15%">
                                  {row?.status ? (
                                    <>
                                      {editPermission ? (
                                        <Dropdown
                                          placement={
                                            index ===
                                              dataSegmentRecords?.length - 1 ||
                                            index ===
                                              dataSegmentRecords?.length - 2
                                              ? "topStart"
                                              : "bottomEnd"
                                          }
                                          renderToggle={(props, ref) =>
                                            renderButton(
                                              props,
                                              ref,
                                              row?.status
                                            )
                                          }
                                        >
                                          {renderStatusItems(
                                            row?.data_segment_id
                                          )}
                                        </Dropdown>
                                      ) : (
                                        <Box
                                          className={
                                            row?.status === "Active"
                                              ? "data-segment-active-status-box"
                                              : row?.status === "Closed" &&
                                                "data-segment-closed-status-box"
                                          }
                                        >
                                          {row?.status}
                                        </Box>
                                      )}
                                    </>
                                  ) : (
                                    `– –`
                                  )}
                                </StyledTableCell>
                                {/* {editPermission && ( */}
                                <StyledTableCell width="15%">
                                  <ShareOutlinedIcon
                                    sx={{
                                      color:
                                        row?.status === "Active"
                                          ? "#008BE2"
                                          : "lightgray",
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      // if (editPermission) {
                                      handleDataSegmentShareLinkClickOpen();
                                      setSelectedUserInfo(row);
                                      // }
                                    }}
                                  />
                                </StyledTableCell>
                                {/* // )} */}
                              </>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
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
                    currentPage={pageNumber}
                    totalCount={rowCount}
                    pageSize={rowsPerPage}
                    onPageChange={(page) => {
                      handleChangePage(
                        page,
                        `dataSegmentRecordSavePageNo`,
                        setPageNumber,
                        setCallAPI
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
                      "dataSegmentRecordTableRowPerPage"
                    }
                    localStorageChangePage={"dataSegmentRecordSavePageNo"}
                    setRowsPerPage={setRowsPerPage}
                    setCallAPI={setCallAPI}
                  ></AutoCompletePagination>
                </Box>
              </Box>
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
          </>
        )}
      </Box>
      {openCreateDataSegmentDrawer && (
        <CreateDataSegmentDrawer
          setOpenCreateDataSegmentDrawer={setOpenCreateDataSegmentDrawer}
          openCreateDataSegmentDrawer={openCreateDataSegmentDrawer}
        />
      )}
      {openDataSegmentShareLinkDialog && (
        <DataSegmentUserProfile
          open={openDataSegmentShareLinkDialog}
          handleDataSegmentShareLinkClose={handleDataSegmentShareLinkClose}
          selectedUserInfo={selectedUserInfo}
        ></DataSegmentUserProfile>
      )}
    </Box>
  );
};

export default DataSegmentRecordsTable;
