/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  ClickAwayListener,
  Button,
  Typography,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Drawer,
} from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import SearchIcon from "@rsuite/icons/Search";
import SearchBox from "../../components/shared/SearchBox/SearchBox";

import "../../styles/Script.css";
import "../../styles/sharedStyles.css";
import SortIndicatorWithTooltip from "../../components/shared/SortIndicatorWithTooltip/SortIndicatorWithTooltip";
import { scriptTableCols } from "../../utils/ResourceUtils";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import Pagination from "../../components/shared/Pagination/Pagination";
import { handleChangePage } from "../../helperFunctions/pagination";
import {
  useDeleteScriptMutation,
  useGetAllScriptDataQuery,
} from "../../Redux/Slices/applicationDataApiSlice";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import EditIcon from "../../icons/edit-icon.svg";
import DeleteIcon from "../../icons/delete-icon.svg";
import useToasterHook from "../../hooks/useToasterHook";
import CreateScript from "./CreateScript";
import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";
import ScriptDetails from "./ScriptDetails";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import Cookies from "js-cookie";

const Script = ({ collegeId, canUpdate }) => {
  const [tabValue, setTabValue] = React.useState(0);
  const [searchFieldToggle, setSearchFieldToggle] = React.useState(false);
  const [scriptSearch, setScriptSearch] = React.useState("");
  const [scriptPageNumber, setScriptPageNumber] = React.useState(1);
  const [scriptPageSize, setScriptPageSize] = React.useState(25);
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editData, setEditData] = React.useState(null);
  const pushNotification = useToasterHook();
  const debouncedSearchText = useDebounce(scriptSearch);

  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState(null); // asc or dsc or null
  const [deleteScriptId, setDeleteScriptId] = React.useState(null);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
    React.useState(false);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const [createScriptBtnOpen, setCreateScriptBtnOpen] = React.useState(false);
  const [scriptDetailsOpen, setScriptDetailsOpen] = React.useState(false);
  const [scriptDetailsData, setScriptDetailsData] = React.useState(null);
  const [scriptData, setScriptData] = React.useState(null);
  const { apiResponseChangeMessage, setApiResponseChangeMessage } =
  useContext(DashboradDataContext);
  const [deleteScript] = useDeleteScriptMutation();
  const [getAllScriptInternalServerError,setGetAllScriptInternalServerError]=useState(false)
  const [somethingWentWrongInGetScript,setSomethingWentWrongInGetScript]=useState(false)
  const { data, isSuccess, isFetching, error, isError } =
  useGetAllScriptDataQuery({
    collegeId,
    pageNum: scriptPageNumber,
    pageSize: scriptPageSize,
    all: tabValue === 0,
    search: debouncedSearchText,
    sort: sortType === "asc" || sortType === "dsc",
    sortType,
    sortField: sortColumn,
    payload:{},
  }
  );
useEffect(() => {
  try {
    if (isSuccess) {
      if (data?.message) {
        setScriptData(data);
      } else {
        throw new Error("get script API response has changed");
      }
    }
    if (isError) {
      if (error?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (error?.data?.detail) {
        pushNotification("error", error?.data?.detail);
      }
      if (error?.status === 500) {
        handleInternalServerError(setGetAllScriptInternalServerError, 10000);
      }
    }
  } catch (error) {
    setApiResponseChangeMessage(error);
    handleSomethingWentWrong(setSomethingWentWrongInGetScript, 10000);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  data?.data,
  error?.data?.detail,
  isError,
  isSuccess,
]);
  const handleCreateScriptDialogOpen = () => {
    setCreateScriptBtnOpen(true);
  };

  const handleCreateScriptDialogClose = () => {
    setCreateScriptBtnOpen(false);
    setIsEditMode(false);
    setEditData(null);
  };

  const showScriptDetails = (item) => {
    setScriptDetailsData(item);
    setScriptDetailsOpen(true);
  };

  const handleScriptDetailsDialogClose = () => {
    setScriptDetailsOpen(false);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    handleCreateScriptDialogOpen();
    setEditData(item);
  };

  const handleDeleteClick = (item) => {
    setDeleteScriptId(item._id);
    setOpenConfirmationDialog(true);
  };

  const handleConfirmation = () => {
    setDeleteLoading(true);
    deleteScript({
      collegeId,
      scriptId: deleteScriptId,
    })
      .unwrap()
      .then((res) => {
        if (res?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (res?.detail) {
          pushNotification("error", res?.detail);
        } else if (res?.message) {
          setDeleteScriptId(null);
          pushNotification("success", res?.message);
        }
      })
      .catch((error) => {
        pushNotification("error", error?.data?.detail);
      })
      .finally(() => {
        setOpenConfirmationDialog(false);
        setDeleteLoading(false);
      });
  };
 useEffect(()=>{
  localStorage.setItem(
    `${Cookies.get("userId")}updateResourcesIndex`,
    JSON.stringify(0))
 },[])

  return (
    <Box className="script-continer">
      <Box className="script-header">
        <MultipleTabs
          tabArray={[{ tabName: "All" }, { tabName: "Drafts" }]}
          setMapTabValue={setTabValue}
          mapTabValue={tabValue}
          boxWidth="100px"
        ></MultipleTabs>

        <Box className="align-row gap-20">
          <Box>
            
              <ClickAwayListener
                onClickAway={() => setSearchFieldToggle(false)}
              >
                <Box className="active-panelist-button-box-search">
                  {!searchFieldToggle ? (
                    <Box
                      className="search-icon-btn-wrapper"
                      data-testid="search-toggle"
                      sx={{
                        paddingY: "4px",
                        borderRadius: "5px",
                        paddingX: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setSearchFieldToggle(true)}
                    >
                      <SearchIcon className="search-icon" />
                    </Box>
                  ) : (
                    <SearchBox
                    setSearchText={setScriptSearch}
                    searchText={scriptSearch}
                     setPageNumber={setScriptPageNumber}
                    setAllDataFetched={() => {}}
                    searchIconClassName="search-icon"
                    className="resources-searchbox"
                    searchBoxColor={"info"}
                  />
                  )}
                </Box>
              </ClickAwayListener>
            
          </Box>
          {canUpdate && (
            <Button
              onClick={() => handleCreateScriptDialogOpen()}
              className="create-script-btn"
            >
              <Typography className="create-script-btn-label">
                Create Script
              </Typography>
            </Button>
          )}
        </Box>
      </Box>

      {/* table */}
      {
        getAllScriptInternalServerError ||
        somethingWentWrongInGetScript  ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "55vh",
              alignItems: "center",
            }}
            data-testid="error-animation-container"
          >
            {(getAllScriptInternalServerError) && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {(somethingWentWrongInGetScript) && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ):
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12}>
          {isFetching ? (
            <Box className="loader-wrapper">
              <LeefLottieAnimationLoader
                height={100}
                width={150}
              ></LeefLottieAnimationLoader>{" "}
            </Box>
          ) : scriptData?.data?.length ? (
            <>
              <Box className="table-container">
                <TableContainer className="custom-scrollbar">
                  <Table
                    sx={{ minWidth: "500px" }}
                    size="small"
                    aria-label="simple table"
                  >
                    <TableHead className="script-thead">
                      <TableRow>
                        {scriptTableCols?.map((col) => (
                          <TableCell
                            key={col.value}
                            style={{ minWidth: col.width }}
                            // width={col.width}
                            className="script-table-header"
                          >
                            <Box className="sorting-option-with-header-content">
                              {col.label}
                              {""}
                              {col.sort ? (
                                sortColumn === col.value ? (
                                  <SortIndicatorWithTooltip
                                    sortType={sortType}
                                    value={col?.value}
                                    sortColumn={sortColumn}
                                    setSortType={setSortType}
                                    setSortColumn={setSortColumn}
                                  />
                                ) : (
                                  <SortIndicatorWithTooltip
                                    sortColumn={sortColumn}
                                    setSortType={setSortType}
                                    setSortColumn={setSortColumn}
                                    value={col?.value}
                                  />
                                )
                              ) : null}
                            </Box>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scriptData?.data?.map((item) => {
                        return (
                          <TableRow
                            className="script-table-row"
                            key={item.script_name}
                          >
                            <TableCell>
                              <Typography
                                onClick={() => showScriptDetails(item)}
                                className="script-table-name-text"
                              >
                                {item.script_name}
                              </Typography>
                              <Typography className="script-table-created-text">
                                Created On: {item?.created_date}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {item?.source_name?.length > 0
                                  ? item?.source_name
                                      ?.slice(0, 1)
                                      .map((source, index) => {
                                        return (
                                          <span
                                            className="script-details-items-box"
                                            key={index}
                                          >
                                            {source}
                                          </span>
                                        );
                                      })
                                  : `– –`}
                                {item?.source_name?.length > 1 && (
                                  <CustomTooltip
                                    description={
                                      <div>
                                        {" "}
                                        <ul className="items-data-align-design-tooltip">
                                          {" "}
                                          {item?.source_name
                                            ?.slice(1)
                                            .map((source) => {
                                              return <li>{source}</li>;
                                            })}
                                        </ul>
                                      </div>
                                    }
                                    component={
                                      <Box
                                        sx={{ borderRadius: 10 }}
                                        className="script-details-length-box"
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >{`+${
                                          item?.source_name?.slice(1)?.length
                                        }`}</Typography>
                                      </Box>
                                    }
                                    color={true}
                                    placement={"right"}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "5px",
                                  alignItems: "center",
                                }}
                              >
                                {item?.program_name?.length > 0
                                  ? item?.program_name
                                      ?.slice(0, 1)
                                      .map((specialization, index) => (
                                        <span
                                          className="script-details-items-box"
                                          key={index}
                                        >
                                          {`${specialization.course_name} ${
                                            specialization.course_specialization
                                              ? "in"
                                              : ""
                                          } ${
                                            specialization.course_specialization
                                              ? specialization.course_specialization
                                              : "(no specialization)"
                                          }`}
                                        </span>
                                      ))
                                  : `– –`}
                                {item?.program_name?.length > 1 && (
                                  <CustomTooltip
                                    description={
                                      <div>
                                        {" "}
                                        <ul className="items-data-align-design-tooltip">
                                          {" "}
                                          {item?.program_name
                                            ?.slice(1)
                                            .map((specialization) => {
                                              return (
                                                <li>{`${
                                                  specialization.course_name
                                                } ${
                                                  specialization.course_specialization
                                                    ? "in"
                                                    : ""
                                                } ${
                                                  specialization.course_specialization
                                                    ? specialization.course_specialization
                                                    : "(no specialization)"
                                                }`}</li>
                                              );
                                            })}
                                        </ul>
                                      </div>
                                    }
                                    component={
                                      <Box
                                        sx={{ borderRadius: 10 }}
                                        className="script-details-length-box"
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: "10px",
                                            color: "white",
                                          }}
                                        >{`+${
                                          item?.program_name?.slice(1)?.length
                                        }`}</Typography>
                                      </Box>
                                    }
                                    color={true}
                                    placement={"right"}
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              {item?.application_stage?.length > 0
                                ? item?.application_stage?.map(
                                    (application, index) => {
                                      return (
                                        <span
                                          className="script-details-items-box"
                                          key={index}
                                        >
                                          {application}
                                        </span>
                                      );
                                    }
                                  )
                                : `– –`}
                            </TableCell>
                            <TableCell>
                              {
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: "5px",
                                    alignItems: "center",
                                  }}
                                >
                                  {item?.lead_stage?.length > 0
                                    ? item?.lead_stage
                                        ?.slice(0, 1)
                                        .map((lead, index) => {
                                          return (
                                            <span
                                              className="script-details-items-box"
                                              key={index}
                                            >
                                              {lead}
                                            </span>
                                          );
                                        })
                                    : `– –`}
                                  {item?.lead_stage?.length > 1 && (
                                    <CustomTooltip
                                      description={
                                        <div>
                                          {" "}
                                          <ul className="items-data-align-design-tooltip">
                                            {" "}
                                            {item?.lead_stage
                                              ?.slice(1)
                                              .map((lead) => {
                                                return <li>{lead}</li>;
                                              })}
                                          </ul>
                                        </div>
                                      }
                                      component={
                                        <Box
                                          sx={{ borderRadius: 10 }}
                                          className="script-details-length-box"
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: "10px",
                                              color: "white",
                                            }}
                                          >{`+${
                                            item?.lead_stage?.slice(1)?.length
                                          }`}</Typography>
                                        </Box>
                                      }
                                      color={true}
                                      placement={"right"}
                                    />
                                  )}
                                </Box>
                              }
                              {/* <Typography className="script-table-values script-single-line-text">
                                {item.lead_stage}
                              </Typography> */}
                            </TableCell>
                            <TableCell>
                              {item?.tags?.length > 0 ? (
                                <Box className="script-tag-box-container">
                                  {item?.tags?.map((tag) => {
                                    return (
                                      <Box className="script-table-tag-btn">
                                        <Typography className="script-tag-table-values script-single-line-text">
                                          {tag}
                                        </Typography>
                                      </Box>
                                    );
                                  })}
                                </Box>
                              ) : (
                                "---"
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography className="script-table-values script-single-line-text">
                              {item?.content?.length > 30
            ? `${item?.content?.substring(0, 30)}...`
            : item?.content}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box className="align-row">
                                {canUpdate && (
                                  <IconButton
                                    onClick={() => {
                                      handleEditClick(item);
                                    }}
                                  >
                                    <img src={EditIcon} alt="Edit Script" />
                                  </IconButton>
                                )}
                                {canUpdate && (
                                  <IconButton
                                    onClick={() => {
                                      handleDeleteClick(item);
                                    }}
                                  >
                                    <img
                                      src={DeleteIcon}
                                      height={18}
                                      width={18}
                                      alt="Delete Script"
                                    />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Pagination
                  className="script-pagination"
                  currentPage={scriptPageNumber}
                  totalCount={scriptData?.total || 0}
                  pageSize={scriptPageSize}
                  onPageChange={(page) =>
                    handleChangePage(
                      page,
                      `adminApplicationSavePageNo`,
                      setScriptPageNumber
                    )
                  }
                  count={scriptData?.count || 0}
                />
                <AutoCompletePagination
                  rowsPerPage={scriptPageSize}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={scriptData?.count || 0}
                  page={scriptPageNumber}
                  setPage={setScriptPageNumber}
                  localStorageChangeRowPerPage={`studentQueryTableRowPerPage`}
                  localStorageChangePage={`studentQuerySavePageNo`}
                  setRowsPerPage={setScriptPageSize}
                ></AutoCompletePagination>
              </Box>
            </>
          ) : (
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
          )}
        </Grid>
      </Grid>
      }
      <Drawer
        anchor={"right"}
        open={createScriptBtnOpen}
        onClose={handleCreateScriptDialogClose}
        sx={{ width: "50%" }}
      >
        <CreateScript
          isEditMode={isEditMode}
          onClose={handleCreateScriptDialogClose}
          data={editData}
          collegeId={collegeId}
          isDraft={tabValue === 1}
        />
      </Drawer>
      <ConfirmationDialog
        title="Confirm"
        message={
          <Typography component="p">
            Are you sure, you want to delete this script?
          </Typography>
        }
        handleClose={() => {
          setDeleteScriptId(null);
          setOpenConfirmationDialog(false);
        }}
        handleOk={() => handleConfirmation()}
        open={openConfirmationDialog}
        loading={deleteLoading}
      />

      <Drawer
        anchor={"right"}
        open={scriptDetailsOpen}
        onClose={handleScriptDetailsDialogClose}
        sx={{ width: "50%" }}
      >
        <ScriptDetails
          onClose={handleScriptDetailsDialogClose}
          data={scriptDetailsData}
        />
      </Drawer>
    </Box>
  );
};
export default Script;
