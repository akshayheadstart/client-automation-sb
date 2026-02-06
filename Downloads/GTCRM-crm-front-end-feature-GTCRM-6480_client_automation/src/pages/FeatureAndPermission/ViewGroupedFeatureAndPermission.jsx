import React, { useContext, useEffect, useState } from "react";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import { viewGroupedFeatureTableHeaderList } from "../../constants/LeadStageList";
import { useNavigate } from "react-router-dom";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import "../../styles/sharedStyles.css";
import "../../styles/managementDashboard.css";
import "../../styles/DataSegmentRecordsTable.css";
import "../../styles/CampaignManager.css";
import Pagination from "../../components/shared/Pagination/Pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import {
  useDeleteFeatureGroupMutation,
  useGetFeatureGroupsQuery,
} from "../../Redux/Slices/clientOnboardingSlice";
import useToasterHook from "../../hooks/useToasterHook";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import DeleteDialogue from "../../components/shared/Dialogs/DeleteDialogue";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import { handleChangePage } from "../../helperFunctions/pagination";
const ViewGroupedFeatureAndPermission = ({
  selectedApplications,
  setSelectedApplications,
  hideEditAndDeleteButton,
}) => {
  const pushNotification = useToasterHook();
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //top checkbox and indeterminate state
  const [selectTopCheckbox, setSelectTopCheckbox] = useState(false);
  const [showIndeterminate, setShowIndeterminate] = useState(false);
  useEffect(() => {
    setHeadTitle("View Grouped Feature & Permission");
    document.title = "View Grouped Feature & Permission";
  }, [headTitle]);

  const navigate = useNavigate();

  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState();
  const count = Math.ceil(rowCount / pageSize);

  const [groupedFeatureList, setGroupedFeatureList] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loadingDeleteFeatureGroup, setLoadingDeleteFeatureGroup] =
    useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState("");
  const handleApplicationCheckBox = (checked, data) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, data._id]);
    } else {
      setSelectedApplications((prev) => prev.filter((id) => id !== data._id));
    }
  };
  useEffect(() => {
    const totalItems = groupedFeatureList?.length;
    const selectedCount = selectedApplications?.length;

    setSelectTopCheckbox(selectedCount === totalItems && totalItems > 0);
    setShowIndeterminate(selectedCount > 0 && selectedCount < totalItems);
  }, [selectedApplications, groupedFeatureList]);

  const {
    data: featureData,
    isSuccess: isFeatureSuccess,
    isError: isFeatureError,
    error: featureError,
    isFetching: isFeatureFetching,
  } = useGetFeatureGroupsQuery({ pageNum: pageNumber, pageSize: pageSize });

  useEffect(() => {
    if (isFeatureSuccess) {
      setGroupedFeatureList(featureData?.data);
      setRowCount(featureData?.total);
    } else if (isFeatureError) {
      setGroupedFeatureList([]);
      if (featureError?.data?.detail === "Could not validate credentials") {
        window.location.reload();
      } else if (featureError?.data?.detail) {
        pushNotification("error", featureError?.data?.detail);
      }
    }
  }, [isFeatureSuccess, featureData, isFeatureError, featureError]);

  const [deleteFeatureGroup] = useDeleteFeatureGroupMutation();
  const handleDeleteFeatureGroup = (groupId) => {
    setLoadingDeleteFeatureGroup(true);
    deleteFeatureGroup({
      groupId: groupId,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          pushNotification("success", res.message);
          setOpenDeleteDialog(false);
        } else if (res?.detail) {
          if (res?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (res?.detail) {
            pushNotification("error", res?.detail);
          }
        }
      })
      .catch((err) => pushNotification("error", err?.data?.detail))
      .finally(() => setLoadingDeleteFeatureGroup(false));
  };

  return (
    <Box sx={{ my: 8, mx: 3 }}>
      <>
        {isFeatureFetching ? (
          <Box className="common-not-found-container">
            <LeefLottieAnimationLoader width={200} height={200} />
          </Box>
        ) : (
          <>
            {groupedFeatureList?.length > 0 ? (
              <>
                <TableContainer
                  component={Paper}
                  className="custom-scrollbar"
                  sx={{ boxShadow: 0, mb: 1 }}
                >
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead sx={{ bgcolor: "#FFF" }}>
                      <TableRow sx={{ borderBottom: "1px solid #EEE" }}>
                        {hideEditAndDeleteButton && (
                          <TableCell className="checkbox-check-all-container table-row-sticky">
                            <Checkbox
                              color="info"
                              checked={selectTopCheckbox}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (checked) {
                                  const allIds = groupedFeatureList.map(
                                    (item) => item._id
                                  );
                                  setSelectedApplications(allIds);
                                } else {
                                  setSelectedApplications([]);
                                }
                              }}
                              indeterminate={showIndeterminate}
                            />
                          </TableCell>
                        )}
                        {viewGroupedFeatureTableHeaderList?.map(
                          (item, index) => {
                            return (
                              <TableCell
                                key={index}
                                align={item?.align}
                                className={
                                  index === 0
                                    ? "table-cell-fixed management-list-table-head-item"
                                    : "management-list-table-head-item"
                                }
                              >
                                {item.name}
                              </TableCell>
                            );
                          }
                        )}
                        {!hideEditAndDeleteButton && (
                          <TableCell
                            align={"center"}
                            className={"management-list-table-head-item"}
                          >
                            Action
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {groupedFeatureList?.map((dataRow) => {
                        return (
                          <TableRow key={dataRow?.group_name}>
                            {hideEditAndDeleteButton && (
                              <TableCell
                                className={`table-row-sticky college-name-text-design`}
                              >
                                {selectedApplications?.includes(
                                  dataRow?._id
                                ) ? (
                                  <IconButton
                                    sx={{ p: "9px" }}
                                    onClick={() => {
                                      handleApplicationCheckBox(false, dataRow);
                                    }}
                                  >
                                    <CheckBoxOutlinedIcon
                                      sx={{ color: "#008be2" }}
                                    />
                                  </IconButton>
                                ) : (
                                  <Checkbox
                                    color="info"
                                    checked={
                                      selectedApplications?.includes(
                                        dataRow?._id
                                      )
                                        ? true
                                        : false
                                    }
                                    onChange={(e) => {
                                      handleApplicationCheckBox(
                                        e.target.checked,
                                        dataRow
                                      );
                                    }}
                                  />
                                )}
                              </TableCell>
                            )}
                            <TableCell
                              className={`table-row-sticky college-name-text-design`}
                            >
                              {dataRow?.name || "– –"}
                            </TableCell>
                            <TableCell
                              align="left"
                              className="college-name-text-bottom"
                            >
                              <Tooltip
                                title={
                                  dataRow?.group_description?.length > 30
                                    ? dataRow?.group_description
                                    : ""
                                }
                                arrow
                                placement="right"
                              >
                                <span>
                                  {dataRow?.group_description?.length > 30
                                    ? `${dataRow.group_description.slice(
                                        0,
                                        30
                                      )}...`
                                    : dataRow?.group_description || "– –"}
                                </span>
                              </Tooltip>
                            </TableCell>
                            {!hideEditAndDeleteButton && (
                              <TableCell
                                align="center"
                                className="college-name-text-bottom"
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    justifyContent: "center",
                                  }}
                                >
                                  <EditIcon
                                    onClick={() => {
                                      navigate("/view-feature-and-permission", {
                                        state: {
                                          selectedFeatures:
                                            dataRow?.selected_features,
                                          groupDetails: {
                                            group_id: dataRow?._id,
                                            group_name: dataRow?.name,
                                            group_description:
                                              dataRow?.group_description,
                                          },
                                        },
                                      });
                                    }}
                                    style={{
                                      color: "#3498ff",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <TrashIcon
                                    onClick={() => {
                                      setOpenDeleteDialog(true);
                                      setSelectedGroupId(dataRow?._id);
                                    }}
                                    style={{
                                      color: "#dc2626",
                                      cursor: "pointer",
                                    }}
                                  />
                                </Box>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <BaseNotFoundLottieLoader
                height={250}
                width={250}
              ></BaseNotFoundLottieLoader>
            )}
            {groupedFeatureList?.length > 0 && (
              <Box className="pagination-container-campaign-manager">
                <Pagination
                  className="pagination-bar"
                  currentPage={pageNumber}
                  page={pageNumber}
                  totalCount={rowCount}
                  pageSize={pageSize}
                  onPageChange={(page) =>
                    handleChangePage(page, ``, setPageNumber)
                  }
                  count={count}
                />
                <AutoCompletePagination
                  rowsPerPage={pageSize}
                  rowPerPageOptions={rowPerPageOptions}
                  setRowsPerPageOptions={setRowsPerPageOptions}
                  rowCount={rowCount}
                  page={pageNumber}
                  setPage={setPageNumber}
                  setRowsPerPage={setPageSize}
                ></AutoCompletePagination>
              </Box>
            )}

            <DeleteDialogue
              openDeleteModal={openDeleteDialog}
              handleDeleteSingleTemplate={() => {
                handleDeleteFeatureGroup(selectedGroupId);
              }}
              handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
              loading={loadingDeleteFeatureGroup}
            />
          </>
        )}
      </>
    </Box>
  );
};

export default ViewGroupedFeatureAndPermission;
