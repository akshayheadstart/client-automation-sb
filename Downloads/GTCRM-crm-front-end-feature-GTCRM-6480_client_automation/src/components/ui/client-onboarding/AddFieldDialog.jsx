import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddCustomFieldDialog from "./AddCustomFieldDialog";
import FormFields from "../../shared/ClientRegistration/FormFields";
import useToasterHook from "../../../hooks/useToasterHook";
import {
  useDeleteCustomFieldMutation,
  useGetDefaultFormFieldsQuery,
  usePrefetch,
} from "../../../Redux/Slices/clientOnboardingSlice";
import useDebounce from "../../../hooks/useDebounce";
import Pagination from "../../shared/Pagination/Pagination";
import AutoCompletePagination from "../../shared/forms/AutoCompletePagination";
import { handleChangePage } from "../../../helperFunctions/pagination";
import BaseNotFoundLottieLoader from "../../shared/Loader/BaseNotFoundLottieLoader";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import LeefLottieAnimationLoader from "../../shared/Loader/LeefLottieAnimationLoader";
import Error500Animation from "../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../hooks/ErrorFallback";
import SearchIcon from "@mui/icons-material/Search";
import TableDataCount from "../application-manager/TableDataCount";
import TableTopPagination from "../application-manager/TableTopPagination";
import { apiCallFrontAndBackPage } from "../../../helperFunctions/apiCallFrontAndBackPage";
import { useSelector } from "react-redux";

const AddFieldDialog = ({
  openAddFieldDialog,
  title,
  subTitle,
  setFormFields,
  handleCloseDialog,
  viewField,
  handleAddFields,
  sectionIndex,
  prevSelectedRows,
  collegeId,
  clientId,
}) => {
  const pushNotification = useToasterHook();
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const userId = useSelector((state) => state.authentication.token?.user_id);

  const [selectedRows, setSelectedRows] = useState([]);
  const [defaultFields, setDefaultFields] = useState([]);

  const [openCustomFieldDialog, setOpenCustomFieldDialog] = useState(false);

  const [searchText, setSearchText] = useState("");

  const [
    defaultFormFieldsInternalServerError,
    setDefaultFormFieldsInternalServerError,
  ] = useState(false);

  const [
    somethingWentWrongInDefaultFormFieldsApi,
    setSomethingWentWrongInDefaultFormFieldsApi,
  ] = useState(false);

  // pagination
  const [rowPerPageOptions, setRowsPerPageOptions] = useState(["5", "10"]);
  const [rowCount, setRowCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const count = Math.ceil(rowCount / rowsPerPage);

  const handleCloseCustomFieldDialog = () => {
    setOpenCustomFieldDialog(false);
  };

  // Handle Checkbox Click
  const handleSelect = (e, field, index) => {
    if (e.target.checked) {
      setSelectedRows((prevSelected) => [...prevSelected, field]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter(
          (selectedField) => selectedField.key_name !== field.key_name
        )
      );
    }
  };

  const handleAddField = () => {
    if (selectedRows?.length > 0) {
      handleAddFields(sectionIndex, selectedRows);
      handleCloseDialog();
    } else {
      pushNotification("warning", "Please select field");
    }
  };

  useEffect(() => {
    if (prevSelectedRows?.length) {
      setSelectedRows(prevSelectedRows);
    }
  }, [prevSelectedRows]);

  const handleAddCustomField = () => {
    handleCloseCustomFieldDialog(false);
  };

  const debouncedSearchText = useDebounce(searchText, 500);

  const { data, isSuccess, isFetching, error, isError } =
    useGetDefaultFormFieldsQuery({
      pageNumber: pageNumber,
      rowsPerPage: rowsPerPage,
      searchText: debouncedSearchText,
      clientId: clientId ? clientId : !collegeId ? userId : "",
      collegeId: collegeId,
    });

  useEffect(() => {
    try {
      if (isSuccess) {
        const expectedData = data?.data;
        if (Array.isArray(expectedData)) {
          setDefaultFields(expectedData);
          setRowCount(data?.total);
        } else {
          throw new Error(
            "get client default form fields API response has changed"
          );
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
            setDefaultFormFieldsInternalServerError,
            "",
            5000
          );
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(
        setSomethingWentWrongInDefaultFormFieldsApi,
        "",
        5000
      );
    }
  }, [error, isError, isSuccess, data]);

  // prefetching default form fields
  const prefetchDefaultFormFields = usePrefetch("getDefaultFormFields");

  useEffect(() => {
    apiCallFrontAndBackPage(
      data,
      rowsPerPage,
      pageNumber,
      collegeId,
      prefetchDefaultFormFields,
      {
        searchText: debouncedSearchText,
        clientId: clientId ? clientId : !collegeId ? userId : "",
      }
    );
  }, [
    data,
    pageNumber,
    prefetchDefaultFormFields,
    rowsPerPage,
    debouncedSearchText,
    clientId,
    collegeId,
  ]);

  const [deleteCustomField] = useDeleteCustomFieldMutation();
  const handleCustomFieldDelete = (fieldIndex) => {
    const keyName = defaultFields[fieldIndex]?.key_name;

    if (keyName?.length) {
      deleteCustomField({
        keyName: keyName,
        clientId: clientId ? clientId : !collegeId ? userId : "",
        collegeId: collegeId,
      })
        .unwrap()
        .then((response) => {
          try {
            const expectedData = response.message;
            if (typeof expectedData === "string") {
              pushNotification("success", expectedData);
            } else {
              throw new Error(
                "Custom field delete api response has been changed."
              );
            }
          } catch (error) {
            pushNotification("error", error?.message);
          }
        })
        .catch((error) => {
          if (error?.data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (error?.data?.detail) {
            pushNotification("error", error?.data?.detail);
          } else {
            pushNotification("error", error?.message);
          }
        })
        .finally(() => {});
    }
  };

  return (
    <React.Fragment>
      <Dialog
        disableAutoFocus
        disableRestoreFocus
        PaperProps={{ sx: { borderRadius: 2.5 } }}
        maxWidth="lg"
        open={openAddFieldDialog}
        onClose={handleCloseDialog}
        fullWidth
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mr: 4,
            pt: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "Center" }}>
            <DialogTitle>{title} </DialogTitle>
            {selectedRows?.length > 0 && (
              <Typography>
                ( <b>{selectedRows?.length}</b> Field Exist )
              </Typography>
            )}
          </Box>

          <Button
            variant="outlined"
            color="info"
            onClick={() => {
              setOpenCustomFieldDialog(true);
            }}
          >
            <AddIcon sx={{ mr: 2 }} />
            Add Custom Field
          </Button>
        </Box>

        <DialogContent sx={{ pb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <DialogContentText>{subTitle}</DialogContentText>

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
              placeholder="Search Field"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#008BE2" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {defaultFormFieldsInternalServerError ||
          somethingWentWrongInDefaultFormFieldsApi ? (
            <Box className="loading-animation-for-search">
              {defaultFormFieldsInternalServerError && (
                <Error500Animation height={400} width={400}></Error500Animation>
              )}
              {somethingWentWrongInDefaultFormFieldsApi && (
                <ErrorFallback
                  error={apiResponseChangeMessage}
                  resetErrorBoundary={() => window.location.reload()}
                />
              )}
            </Box>
          ) : (
            <>
              {isFetching ? (
                <Box className="loading-animation">
                  <LeefLottieAnimationLoader
                    height={120}
                    width={120}
                  ></LeefLottieAnimationLoader>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      my: 0.7,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TableDataCount
                      totalCount={rowCount}
                      currentPageShowingCount={defaultFields?.length}
                      pageNumber={pageNumber}
                      rowsPerPage={rowsPerPage}
                    />

                    <TableTopPagination
                      pageNumber={pageNumber}
                      setPageNumber={setPageNumber}
                      rowsPerPage={rowsPerPage}
                      totalCount={rowCount}
                    />
                  </Box>
                  {defaultFields?.length > 0 ? (
                    <>
                      <FormFields
                        heading={""}
                        fieldDetails={defaultFields}
                        setFieldDetails={setDefaultFields}
                        preview={false}
                        selectedRows={selectedRows}
                        handleSelectRow={handleSelect}
                        showActions={true}
                        handleDeleteField={handleCustomFieldDelete}
                        from="add-field-dialog"
                        collegeId={collegeId}
                        clientId={clientId}
                        hideAddFieldButton={true}
                        hideAddValidationColumn={true}
                      />
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
                          totalCount={rowCount}
                          pageSize={rowsPerPage}
                          onPageChange={(page) => {
                            handleChangePage(page, ``, setPageNumber);
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
                          setRowsPerPage={setRowsPerPage}
                        ></AutoCompletePagination>
                      </Box>
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        minHeight: "30vh",
                        alignItems: "center",
                      }}
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              onClick={handleCloseDialog}
              color="info"
              variant="outlined"
              sx={{ mt: 4, borderRadius: 30 }}
            >
              Cancel
            </Button>
            {!viewField && (
              <Button
                onClick={handleAddField}
                color="info"
                variant="contained"
                type="submit"
                sx={{ mt: 4, borderRadius: 30 }}
              >
                Add Field
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {openCustomFieldDialog && (
        <AddCustomFieldDialog
          openAddCustomFieldDialog={openCustomFieldDialog}
          handleCloseCustomFieldDialog={handleCloseCustomFieldDialog}
          title="Add Custom Field"
          subTitle="Configure a new form field"
          setFormFields={setFormFields}
          handleAddCustomField={handleAddCustomField}
          sectionIndex={sectionIndex}
          handleCloseAddFieldDialog={handleCloseDialog}
          collegeId={collegeId}
          clientId={clientId}
        />
      )}
    </React.Fragment>
  );
};

export default AddFieldDialog;
