/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button as MuiButton,
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Drawer,
} from "@mui/material";
// Icons
import AddIcon from "@mui/icons-material/Add";

import Cookies from "js-cookie";
import BaseNotFoundLottieLoader from "../../components/shared/Loader/BaseNotFoundLottieLoader";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import "../../styles/manageCommunication.css";
import "../../styles/CreateViewTemplate.css";
import "../../styles/sharedStyles.css";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import DeleteIcon from "../../icons/delete-icon.svg";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import { ErrorFallback } from "../../hooks/ErrorFallback";

import { handleDeleteSingleTemplate } from "../../hooks/useHandleDeleteTemplate";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { handleChangePage } from "../../helperFunctions/pagination";
import AutoCompletePagination from "../../components/shared/forms/AutoCompletePagination";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import useToasterHook from "../../hooks/useToasterHook";
import Pagination from "../../components/shared/Pagination/Pagination";
import { useSelector } from "react-redux";
import { defaultRowsPerPageOptions } from "../../components/Calendar/utils";
import TableDataCount from "../../components/ui/application-manager/TableDataCount";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import CreateEmailTemplate from "./CreateEmailTemplate";
import CreateSmsTemplate from "./CreateSmsTemplate";
import CreateWhatsAppTemplate from "./CreateWhatsAppTemplate";
import ConfirmationDialog from "../../components/shared/Dialogs/ConfirmationDialog";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  useFetchAllTemplatesQuery,
  usePrefetch,
  useDeleteTemplateMutation,
} from "../../Redux/Slices/applicationDataApiSlice";
import { apiCallFrontAndBackPage } from "../../helperFunctions/apiCallFrontAndBackPage";
import { setTags } from "../../Redux/Slices/templateSlice";
import { useDispatch } from "react-redux";

function ManageCommunicationTemplate(props) {
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(
    defaultRowsPerPageOptions
  );
  const [allTemplate, setAllTemplate] = useState([]);
  const pushNotification = useToasterHook();

  const [rowCount, setRowCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const count = Math.ceil(rowCount / rowsPerPage);

  //internal server error states
  const [
    templateTableInternalServerError,
    setTemplateTableInternalServerError,
  ] = useState(false);
  const [hideTemplateTable, setHideTemplateTable] = useState(false);
  const [
    somethingWentWrongInTemplateTable,
    setSomethingWentWrongInTemplateTable,
  ] = useState(false);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [templateDeleted, setTemplateDeleted] = useState(false);
  const [deleteTemplateID, setDeleteTemplateID] = useState("");
  const [deleteTemplateName, setDeleteTemplateName] = React.useState("");
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [
    deleteTemplateInternalServerError,
    setDeleteTemplateInternalServerError,
  ] = useState(false);
  const [
    somethingWentWrongInDeleteTemplate,
    setSomethingWentWrongInDeleteTemplate,
  ] = useState(false);

  const [createTemplateBtnOpen, setCreateTemplateBtnOpen] =
    React.useState(false);
  const [tabValue, setTabsValue] = React.useState(0);

  const [deleteTemplate] = useDeleteTemplateMutation();

  // create template button
  const createTemplateHandleClick = (event) => {
    setCreateTemplateBtnOpen(true);
  };

  const handleCreateTemplateDialogClose = () => {
    setCreateTemplateBtnOpen(false);
  };

  const [callPagination, setCallPagination] = useState(false);
  useEffect(() => {
    setPage(
      localStorage.getItem(`${Cookies.get("userId")}allTemplateSavePageNo`)
        ? parseInt(
            localStorage.getItem(
              `${Cookies.get("userId")}allTemplateSavePageNo`
            )
          )
        : 1
    );

    setRowsPerPage(
      localStorage.getItem(`${Cookies.get("userId")}allTemplateTableRowPerPage`)
        ? parseInt(
            localStorage.getItem(
              `${Cookies.get("userId")}allTemplateTableRowPerPage`
            )
          )
        : 25
    );
  }, [templateDeleted, callPagination]);

  const { data, isSuccess, isError, error, isFetching } =
    useFetchAllTemplatesQuery(
      {
        collegeId,
        pageNumber: page,
        rowsPerPage,
        payload: null,
      },
      {
        skip: !collegeId,
      }
    );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setTags([]));
  }, [tabValue]);

  React.useEffect(() => {
    try {
      if (isSuccess) {
        if (data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (data?.data) {
          try {
            if (Array.isArray(data?.data)) {
              setRowCount(data?.total);
              setAllTemplate(data.data);
            } else {
              throw new Error("templates API response has changed");
            }
          } catch (error) {}
        } else if (data?.detail) {
          pushNotification("error", data?.detail);
        }
      } else if (isError) {
        if (error?.status === 500) {
          handleInternalServerError(
            setTemplateTableInternalServerError,
            setHideTemplateTable,
            10000
          );
        }
      }
    } catch (err) {
      setApiResponseChangeMessage(err);
      handleSomethingWentWrong(
        setSomethingWentWrongInTemplateTable,
        setHideTemplateTable,
        10000
      );
    }
  }, [data, isSuccess, isError, error, isFetching]);

  const prefetchAllTemplates = usePrefetch("fetchAllTemplates");

  React.useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      page,
      collegeId,
      prefetchAllTemplates,
      { payload: null }
    );
  }, [data, page, prefetchAllTemplates, rowsPerPage, collegeId]);

  const handleOpenDeleteModal = (id, name) => {
    setDeleteTemplateID(id);
    setOpenDeleteModal(true);
    setDeleteTemplateName(name);
  };
  const handleCloseDeleteModal = () => {
    setDeleteTemplateID("");
    setOpenDeleteModal(false);
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  //Admin dashboard Head Title add

  useEffect(() => {
    setHeadTitle("Template Manager");
    document.title = "Template Manager";
  }, [headTitle]);
  return (
    <Box
      component="main"
      className="communication-performance manageCommunication-header-box-container"
      sx={{ py: 0, pb: 2 }}
    >
      <Container maxWidth={false}>
        <Grid container>
          <Grid item md={12} sm={12} xs={12}>
            {templateTableInternalServerError ||
            somethingWentWrongInTemplateTable ? (
              <Card sx={{ mb: 4 }}>
                {templateTableInternalServerError && (
                  <Error500Animation
                    height={400}
                    width={400}
                  ></Error500Animation>
                )}
                {somethingWentWrongInTemplateTable && (
                  <ErrorFallback
                    error={apiResponseChangeMessage}
                    resetErrorBoundary={() => window.location.reload()}
                  />
                )}
              </Card>
            ) : (
              <Box>
                {isFetching ? (
                  <Card className="lottie-loader-Animation">
                    {" "}
                    <LeefLottieAnimationLoader
                      height={100}
                      width={150}
                    ></LeefLottieAnimationLoader>{" "}
                  </Card>
                ) : (
                  <Box>
                    <Card {...props}>
                      <Box
                        className="common-table-heading-container"
                        sx={{ p: 2, pb: 1 }}
                      >
                        <Box>
                          <Typography
                            component="p"
                            className="tm-communication-sub-header"
                          >
                            Communication Template
                          </Typography>
                          <Typography
                            component="p"
                            className="communication-sub-header"
                          >
                            Total {rowCount} Records
                          </Typography>
                        </Box>

                        <Box>
                          <MuiButton
                            onClick={createTemplateHandleClick}
                            className="create-template-btn"
                            startIcon={
                              <AddIcon className="create-template-add-icon" />
                            }
                          >
                            <Typography className="create-template-btn-label">
                              Create Template
                            </Typography>
                          </MuiButton>
                        </Box>
                      </Box>
                      {/* -----Tabs----- */}
                      {allTemplate.length > 0 ? (
                        <Box
                          className="records-wrapper"
                          sx={{
                            display: "flex",
                            visibility: hideTemplateTable
                              ? "hidden"
                              : "visible",
                            flexDirection: "column",
                          }}
                        >
                          <Box className="tm-communication-data-count">
                            <TableDataCount
                              totalCount={rowCount}
                              currentPageShowingCount={allTemplate.length}
                              pageNumber={page}
                              rowsPerPage={rowsPerPage}
                              className="table-data-count-text"
                            />
                          </Box>
                          <TableContainer className="manage-communicationTable custom-scrollbar">
                            <Table size="small">
                              <TableHead className="tm-table-header">
                                <TableRow>
                                  <TableCell
                                    sx={{ py: 2 }}
                                    className="tm-table-header-cell"
                                  >
                                    Template Name
                                  </TableCell>
                                  <TableCell className="tm-table-header-cell">
                                    Template Type
                                  </TableCell>
                                  <TableCell className="tm-table-header-cell">
                                    Template Status
                                  </TableCell>
                                  <TableCell className="tm-table-header-cell">
                                    Created By
                                  </TableCell>
                                  <TableCell className="tm-table-header-cell">
                                    Delete
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {allTemplate.map((template, i) => (
                                  <TableRow key={i.id}>
                                    <TableCell className="tm-manage-comm-cell">
                                      {template?.template_name?.slice(0, 35)}
                                    </TableCell>
                                    <TableCell>
                                      <Box className="tag-capsule">
                                        <Typography
                                          className="tag-text"
                                          variant="span"
                                        >
                                          {template?.template_type}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Box className="tag-capsule">
                                        <Typography
                                          className="tag-text"
                                          variant="span"
                                        >
                                          {template?.template_status}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell className="tm-manage-comm-cell">
                                      {template?.created_by_user_name}
                                    </TableCell>
                                    <TableCell>
                                      <IconButton
                                        onClick={() =>
                                          handleOpenDeleteModal(
                                            template?.template_id,
                                            template?.template_name
                                          )
                                        }
                                      >
                                        <img
                                          src={DeleteIcon}
                                          height={18}
                                          width={18}
                                          alt="Delete Template"
                                        />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {!isFetching && allTemplate?.length > 0 && (
                              <Box
                                className="manage-communication-pagination"
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
                                      `allTemplateSavePageNo`,
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
                                  localStorageChangeRowPerPage={`allTemplateTableRowPerPage`}
                                  localStorageChangePage={`allTemplateSavePageNo`}
                                  setRowsPerPage={setRowsPerPage}
                                ></AutoCompletePagination>
                              </Box>
                            )}
                          </TableContainer>
                        </Box>
                      ) : (
                        <Box
                          data-testid="not-found-animations"
                          className="BaseNotFoundLottieLoader"
                        >
                          <BaseNotFoundLottieLoader
                            height={250}
                            width={250}
                          ></BaseNotFoundLottieLoader>
                        </Box>
                      )}
                    </Card>
                  </Box>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      <ConfirmationDialog
        title={
          <Box className="info-icon-container">
            <InfoOutlinedIcon />
          </Box>
        }
        message={
          <Typography component="p" textAlign="center">
            {deleteTemplateName} will be deleted.
          </Typography>
        }
        handleClose={handleCloseDeleteModal}
        handleOk={() => {
          handleDeleteSingleTemplate(
            deleteTemplate,
            deleteTemplateID,
            handleCloseDeleteModal,
            setTemplateDeleted,
            templateDeleted,
            pushNotification,
            null,
            allTemplate?.length,
            page,
            setPage,
            `allTemplateSavePageNo`,
            setCallPagination,
            setDeleteTemplateInternalServerError,
            setApiResponseChangeMessage,
            setSomethingWentWrongInDeleteTemplate,
            collegeId,
            setDeleteLoading
          );
        }}
        open={openDeleteModal}
        loading={deleteLoading}
        className="tm-confirmation-dialog"
        internalServerError={deleteTemplateInternalServerError}
        somethingWentWrong={somethingWentWrongInDeleteTemplate}
        apiResponseChangeMessage={apiResponseChangeMessage}
      />

      <Drawer
        anchor={"right"}
        open={createTemplateBtnOpen}
        onClose={handleCreateTemplateDialogClose}
        sx={{ width: "100%" }}
        PaperProps={{
          sx: {
            width:"100%",
          },
        }}
      >
        {tabValue === 0 ? (
          <CreateEmailTemplate
            onClose={handleCreateTemplateDialogClose}
            currentTab={tabValue}
            setCurrentTab={setTabsValue}
            createMood={true}
          />
        ) : null}
        {tabValue === 2 ? (
          <CreateSmsTemplate
            onClose={handleCreateTemplateDialogClose}
            currentTab={tabValue}
            setCurrentTab={setTabsValue}
            createMood={true}
          />
        ) : null}
        {tabValue === 1 ? (
          <CreateWhatsAppTemplate
            collegeId={collegeId}
            onClose={handleCreateTemplateDialogClose}
            currentTab={tabValue}
            setCurrentTab={setTabsValue}
            createMood={true}
          />
        ) : null}
      </Drawer>
    </Box>
  );
}

export default ManageCommunicationTemplate;
