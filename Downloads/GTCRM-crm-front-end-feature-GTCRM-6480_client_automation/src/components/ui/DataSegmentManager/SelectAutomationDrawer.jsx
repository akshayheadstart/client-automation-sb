import {
  Box,
  Button,
  ClickAwayListener,
  Drawer,
  InputAdornment,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseSVG from "../../../icons/close.svg";
import useTableCellDesign from "../../../hooks/useTableCellDesign";
import { Radio, RadioGroup, Divider } from "rsuite";
import { useContext, useEffect, useState } from "react";
import Pagination from "../../shared/Pagination/Pagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import {
  useGetAutomationByIdMutation,
  useGetAutomationManagerTableDataQuery,
  usePrefetch,
} from "../../../Redux/Slices/applicationDataApiSlice";
import { useSelector } from "react-redux";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import SearchIcon from "@mui/icons-material/Search";
import searchIconImage from "../../../images/searchIcon.png";
import useDebounce from "../../../hooks/useDebounce";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import AutomationCReateWindowDialog from "../NestedAutomation/Automation-Drawer/AutomationCReateWindowDialog";
import { setNestedAutomationPayload } from "../../../Redux/Slices/authSlice";
import { useDispatch } from "react-redux";
import BackDrop from "../../shared/Backdrop/Backdrop";

const SelectAutomationDrawer = ({
  openDrawer,
  setOpenDrawer,
  selectedDataSegmentList,
}) => {
  const StyledTableCell = useTableCellDesign();
  const pushNotification = useToasterHook();
  const dispatch = useDispatch();

  const [selectedAutomationTemplate, setSelectedAutomationTemplate] =
    useState(null);

  const [searchText, setSearchText] = useState("");
  const [automationList, setAutomationList] = useState([]);
  const [totalAutomationCount, setTotalAutomationCount] = useState("");

  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);
  const [hideTable, setHideTable] = useState(false);

  const [searchFieldToggle, setSearchFieldToggle] = useState(false);

  // pagination
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const count = Math.ceil(totalAutomationCount / rowsPerPage);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const debouncedSearchText = useDebounce(searchText, 500);

  const { data, isError, error, isFetching, isSuccess } =
    useGetAutomationManagerTableDataQuery({
      collegeId,
      pageNumber,
      rowsPerPage,
      searchText: debouncedSearchText,
      payload: {
        data_type:
          selectedDataSegmentList?.length > 0
            ? [selectedDataSegmentList?.[0]?.module_name]
            : [],
      },
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        if (Array.isArray(data?.data)) {
          setAutomationList(data.data);
          setTotalAutomationCount(data?.total);
        } else {
          throw new Error("Tag list API response has changed");
        }
      } else if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error.status === 500) {
          handleInternalServerError(
            setIsInternalServerError,
            setHideTable,
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setIsSomethingWentWrong, setHideTable, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, error, isSuccess]);

  const prefetchAutomation = usePrefetch("getAutomationManagerTableData");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data?.data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchAutomation,
      {
        payload: {
          payload: {
            data_type:
              selectedDataSegmentList?.length > 0
                ? [selectedDataSegmentList?.[0]?.module_name]
                : [],
          },
          searchText: debouncedSearchText,
        },
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    pageNumber,
    prefetchAutomation,
    rowsPerPage,
    collegeId,
    debouncedSearchText,
  ]);

  const sumOfDataSegmentCount = selectedDataSegmentList?.reduce(
    (sum, segment) => sum + segment.count_of_entities,
    0
  );

  const [isLoadingAutomationDetails, setIsLoadingAutomationDetails] =
    useState(false);

  const [getAutomationById] = useGetAutomationByIdMutation();
  const handleAutomationDetailsApiCall = () => {
    setIsLoadingAutomationDetails(true);

    getAutomationById({
      collegeId,
      automationId: selectedAutomationTemplate,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          try {
            if (typeof res.message === "string") {
              const automationObj = res?.data;

              // Updating the object with selected data segments and count
              const updatedObject = {
                ...automationObj,
                automation_details: {
                  ...automationObj.automation_details,
                  data_count: sumOfDataSegmentCount,
                  data_segment: selectedDataSegmentList,
                },
              };

              dispatch(setNestedAutomationPayload(updatedObject));
              setOpenCreateAutomationDialog(true);
            } else {
              throw new Error("automation get by id API response changed");
            }
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
          }
        } else if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        }
      })
      .catch((error) => {
        if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 5000);
        }
      })
      .finally(() => {
        setIsLoadingAutomationDetails(false);
      });
  };

  const [openCreateAutomationDialog, setOpenCreateAutomationDialog] =
    useState(false);

  const [automationDaysRange, setAutomationDaysRange] = useState([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
  ]);

  return (
    <Drawer
      anchor="right"
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      PaperProps={{
        sx: {
          width: "600px",
        },
      }}
    >
      <BackDrop openBackdrop={isLoadingAutomationDetails} text="Loading..." />

      <Box className="automation-communication-drawer-header">
        <Box className="create-automation-drawer-title">
          Select Automation Template
        </Box>
        <Box
          onClick={() => setOpenDrawer(false)}
          className="automation-drawer-close-icon"
        >
          <img src={CloseSVG} alt="settingsImage" style={{ width: "100%" }} />
        </Box>
      </Box>

      <Box className="automation-drawer-box">
        {selectedDataSegmentList?.map((dataSegment) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            key={dataSegment?.data_segment_id}
          >
            <Typography className="select-automation-data-segment-text">
              {dataSegment?.data_segment_name}
            </Typography>
            <Divider
              className="select-automation-data-segment-text"
              style={{ background: "black" }}
              vertical
            />
            <Typography className="select-automation-data-segment-text">
              {dataSegment?.count_of_entities}
            </Typography>
          </Box>
        ))}
        <Box className="data-segment-table-container">
          <Box sx={{ p: "5px" }} className="data-segment-table-top-box">
            <Box className="automation-drawer-filter-title">
              Select Automation Template
            </Box>

            <ClickAwayListener onClickAway={() => setSearchFieldToggle(false)}>
              <Box>
                {!searchFieldToggle ? (
                  <Box sx={{ cursor: "pointer" }}>
                    <img
                      onClick={() => setSearchFieldToggle(true)}
                      src={searchIconImage}
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
                      placeholder="Search Automation"
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
          {isFetching ? (
            <>
              <Box
                sx={{ minHeight: "50vh" }}
                className="common-not-found-container"
              >
                <LeefLottieAnimationLoader
                  height={200}
                  width={200}
                ></LeefLottieAnimationLoader>
              </Box>
            </>
          ) : (
            <>
              {isInternalServerError || isSomethingWentWrong ? (
                <Box
                  sx={{ minHeight: "25vh" }}
                  className="common-not-found-container"
                >
                  {isInternalServerError && (
                    <Error500Animation
                      height={200}
                      width={200}
                    ></Error500Animation>
                  )}
                  {isSomethingWentWrong && (
                    <ErrorFallback
                      error={apiResponseChangeMessage}
                      resetErrorBoundary={() => window.location.reload()}
                    />
                  )}
                </Box>
              ) : (
                <>
                  {automationList?.length > 0 ? (
                    <>
                      <TableContainer
                        sx={{ visibility: hideTable ? "hidden" : "visible" }}
                        className="custom-scrollbar"
                      >
                        <Table
                          size="small"
                          sx={{
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
                              <StyledTableCell width="2%"></StyledTableCell>
                              <StyledTableCell width="2%">Name</StyledTableCell>

                              <StyledTableCell width="5%">
                                Communication Action
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {automationList?.map((row) => {
                              return (
                                <TableRow
                                  sx={{
                                    borderBottom: "1px solid blue",
                                  }}
                                >
                                  <StyledTableCell bodyCellPadding="10px 30px">
                                    <RadioGroup
                                      name="radio-name-automation"
                                      value={selectedAutomationTemplate}
                                      onChange={(value) => {
                                        setSelectedAutomationTemplate(value);
                                      }}
                                      style={{ fontSize: "30px" }}
                                    >
                                      <Radio value={row?._id}></Radio>
                                    </RadioGroup>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row?.rule_name ? row?.rule_name : `– –`}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {row?.action_type?.length ? (
                                      <>
                                        {row.action_type.map((action) => (
                                          <Typography className="status active">
                                            {action}
                                          </Typography>
                                        ))}
                                      </>
                                    ) : (
                                      <Typography className="status">
                                        – –
                                      </Typography>
                                    )}
                                  </StyledTableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Pagination
                          className="pagination-bar"
                          currentPage={pageNumber}
                          totalCount={totalAutomationCount}
                          pageSize={rowsPerPage}
                          onPageChange={(page) =>
                            handleChangePage(page, "", setPageNumber)
                          }
                          count={count}
                        />
                        <AutoCompletePagination
                          rowsPerPage={rowsPerPage}
                          rowPerPageOptions={rowsPerPage}
                          setRowsPerPageOptions={setRowsPerPage}
                          rowCount={totalAutomationCount}
                          page={pageNumber}
                          setPage={setPageNumber}
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    </>
                  ) : (
                    <Box className="common-not-found-container">
                      <BaseNotFoundLottieLoader height={200} width={200} />
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>

        <Typography
          sx={{ mt: "20px" }}
          className="select-automation-data-segment-text"
        >
          Final Count of Entries : {sumOfDataSegmentCount}
        </Typography>
      </Box>
      <Box className="select-data-segment-drawer-buttons">
        <Button
          sx={{ color: "#008BE2 !important" }}
          className="common-outlined-button"
          onClick={() => {
            setOpenDrawer(false);
          }}
        >
          Back
        </Button>
        <Button
          className="common-contained-button"
          onClick={() => {
            if (!selectedAutomationTemplate?.length > 0) {
              pushNotification("warning", "Please select automation template");
            } else {
              handleAutomationDetailsApiCall();
            }
          }}
        >
          Continue
        </Button>
      </Box>

      <AutomationCReateWindowDialog
        open={openCreateAutomationDialog}
        handleManageCreateAutomationDialogue={setOpenCreateAutomationDialog}
        daysRange={automationDaysRange}
        setDaysRange={setAutomationDaysRange}
        readOnlyBoxes={true}
        from="select-automation-drawer"
      ></AutomationCReateWindowDialog>
    </Drawer>
  );
};

export default SelectAutomationDrawer;
