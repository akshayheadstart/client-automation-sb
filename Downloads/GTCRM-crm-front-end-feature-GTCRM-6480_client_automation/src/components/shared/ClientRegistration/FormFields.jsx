import {
  Badge,
  Box,
  Button,
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
  Typography,
} from "@mui/material";
import React, { useMemo, useEffect, useContext } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNewField from "./AddNewField";
import { useState } from "react";
import useToasterHook from "../../../hooks/useToasterHook";
import AddedCourseAction from "./AddedCourseAction";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FieldNameHelpText from "./FieldNameHelpText";
import FieldTypeHelpText from "./FieldTypeHelpText";
import RequiredFieldTypeHelpText, {
  DependentFieldHelperText,
  ValidationHelperText,
} from "./RequiredFieldTypeHelpText";
import ActionHelpText from "./ActionHelpText";
import DeleteDialogue from "../Dialogs/DeleteDialogue";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import Cookies from "js-cookie";
import "../../../styles/ClientRegistration.css";
import AddFieldDialog from "../../ui/client-onboarding/AddFieldDialog";
import VisibleIcon from "@rsuite/icons/Visible";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import AddIcon from "@mui/icons-material/Add";
import AddCustomFieldDialog from "../../ui/client-onboarding/AddCustomFieldDialog";
import AddTemplateDialog from "../../ui/client-onboarding/AddTemplateDialog";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import AddDependentField from "../../ui/client-onboarding/AddDependentField";
import DynamicTable from "../../ui/client-onboarding/DynamicTable";
import { addDynamicNestedDependentField } from "../../../pages/StudentTotalQueries/helperFunction";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import AddFieldValidations from "./AddFieldValidations";

const FormFields = ({
  fieldDetails,
  setFieldDetails,
  preview,
  handleAddFields,
  sectionIndex,
  handleAddCustomField,
  selectedRows,
  handleSelectRow,
  handleDeleteField,
  openAddTemplateDialog,
  setOpenAddTemplateDialog,
  handleAddTemplate,
  templateDetails,
  setTemplateDetails,
  tableTemplateData,
  setTableTemplateData,
  showTable,
  setSelectedTableTemplateRow,
  isTemplate,
  dependentFields,
  selectedOption,
  collegeId,
  clientId,
  hideAddFieldButton,
  showActions,
  from,
  hideAddValidationColumn,
}) => {
  const currentFieldDetails = dependentFields ? dependentFields : fieldDetails;

  // here wil be the state of form
  const [editField, setEditField] = useState({});
  const [fieldName, setFieldName] = useState("");
  const [fieldType, setFieldType] = useState("");
  const [charLimit, setCharLimit] = useState("");
  const [selectOptions, setSelectOptions] = useState([]);
  const [isMandatory, setIsMandatory] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const [loadingFormFields, setLoadingFormFields] = useState(false);
  const [listOfFormFields, setListOfFormFields] = useState([]);
  const [hideFieldMapping, setHideFieldMapping] = useState(false);
  const [callFormFieldsApi, setCallFormFieldsApi] = useState(false);
  const [mappedField, setMappedField] = useState(null);

  const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewField, setViewField] = useState(false);
  const [addFieldDialogTitle, setAddFieldDialogTitle] =
    useState("Add New Field");

  const [openAddCustomFieldDialog, setOpenAddCustomFieldDialog] =
    useState(false);

  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const { targetKeyPath } = useContext(DashboradDataContext);

  // Handle edit button click
  const handleFieldEdit = (field, index) => {
    setAddFieldDialogTitle("Edit Field");
    setEditingField(field);
    setEditingIndex(index);
    // setOpenAddFieldDialog(true);
    setOpenAddCustomFieldDialog(true);
  };

  // Handle view button click
  const handleFieldView = (field, index) => {
    setAddFieldDialogTitle("View Field");
    setEditingField(field);
    setEditingIndex(index);
    setViewField(true);
    // setOpenAddFieldDialog(true);
    setOpenAddCustomFieldDialog(true);
  };

  // Reset edit and view state when dialog closes
  const handleCloseAddFieldDialog = () => {
    setEditingField(null);
    setEditingIndex(null);
    setOpenAddFieldDialog(false);
    setAddFieldDialogTitle("Add New Field");
    setViewField(false);
  };

  const handleCloseCustomFieldDialog = () => {
    setOpenAddCustomFieldDialog(false);
    setEditingField(null);
    setEditingIndex(null);
    setAddFieldDialogTitle("Add New Field");
    setViewField(false);
  };

  const handleCloseAddTemplateDialog = () => {
    setOpenAddTemplateDialog(false);
  };

  const handleAddOrUpdateField = (updatedFields) => {
    if (dependentFields) {
      const modifiedFields = addDynamicNestedDependentField({
        fields: fieldDetails,
        targetKeyPath,
        selectedOption,
        selectedFields: updatedFields,
        pushNotification,
      });

      setFieldDetails(modifiedFields);
    } else {
      setFieldDetails(updatedFields);
    }
  };

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const fields = Array.from(currentFieldDetails);
    const [reorderedItem] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedItem);
    // need update here
    handleAddOrUpdateField(fields);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      ></Box>
      {!showTable && (
        <TableContainer
          component={Paper}
          sx={{ my: 2, whiteSpace: "nowrap" }}
          className="custom-scrollbar vertical-scrollbar"
        >
          <Table>
            <TableHead>
              <TableRow>
                {selectedRows && !preview && (
                  <TableCell
                    sx={{ fontSize: "44px" }}
                    className="client-reg-table-header"
                  >
                    Select
                  </TableCell>
                )}
                <TableCell sx={{ fontSize: "44px" }}>
                  <Box className="client-reg-table-header">
                    Field Name
                    <Tooltip
                      arrow
                      placement="bottom"
                      title={<FieldNameHelpText />}
                    >
                      <InfoOutlinedIcon className="client-reg-table-help-icon" />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    className="client-reg-table-header"
                    sx={{ justifyContent: "center" }}
                  >
                    Field Type
                    <Tooltip
                      arrow
                      placement="bottom"
                      title={<FieldTypeHelpText />}
                    >
                      <InfoOutlinedIcon className="client-reg-table-help-icon" />
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    className="client-reg-table-header"
                    sx={{ justifyContent: "center" }}
                  >
                    Is mandatory
                    <Tooltip
                      arrow
                      placement="bottom"
                      title={<RequiredFieldTypeHelpText />}
                    >
                      <InfoOutlinedIcon className="client-reg-table-help-icon" />
                    </Tooltip>
                  </Box>
                </TableCell>
                {!hideAddFieldButton && (
                  <TableCell align="center">
                    <Box
                      className="client-reg-table-header"
                      sx={{ justifyContent: "center" }}
                    >
                      Dependent Fields
                      <Tooltip
                        arrow
                        placement="bottom"
                        title={<DependentFieldHelperText />}
                      >
                        <InfoOutlinedIcon className="client-reg-table-help-icon" />
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}
                {!hideAddValidationColumn && (
                  <TableCell align="center">
                    <Box
                      className="client-reg-table-header"
                      sx={{ justifyContent: "center" }}
                    >
                      Validations
                      <Tooltip
                        arrow
                        placement="bottom"
                        title={<ValidationHelperText />}
                      >
                        <InfoOutlinedIcon className="client-reg-table-help-icon" />
                      </Tooltip>
                    </Box>
                  </TableCell>
                )}

                {showActions && (
                  <>
                    {!preview && (
                      <TableCell align="center">
                        <Box
                          className="client-reg-table-header"
                          sx={{ justifyContent: "center" }}
                        >
                          Actions
                          <Tooltip
                            arrow
                            placement="bottom"
                            title={<ActionHelpText />}
                          >
                            <InfoOutlinedIcon className="client-reg-table-help-icon" />
                          </Tooltip>
                        </Box>
                      </TableCell>
                    )}
                  </>
                )}
              </TableRow>
            </TableHead>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="table-drag" as="tbody">
                {(provided) => (
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentFieldDetails?.map((field, index) => (
                      <Draggable
                        key={field.key_name}
                        draggableId={field.key_name}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              display: snapshot.isDragging
                                ? "table"
                                : "table-row",
                              boxShadow:
                                snapshot.isDragging &&
                                "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                              borderRadius: snapshot.isDragging && "8px",
                            }}
                          >
                            {selectedRows && !preview && (
                              <TableCell>
                                <Checkbox
                                  color="info"
                                  checked={
                                    selectedRows?.findIndex(
                                      (row) => row.key_name === field.key_name
                                    ) != -1
                                  }
                                  onChange={(e) =>
                                    handleSelectRow(e, field, index)
                                  }
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography variant="subtitle2">
                                {field.field_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" className="chip-wrapper">
                              <span className={`chip ${field?.field_type}`}>
                                {field?.field_type}
                              </span>
                            </TableCell>
                            <TableCell align="center">
                              <span
                                className={`chip ${
                                  field?.is_mandatory ? "Required" : "Optional"
                                }`}
                              >
                                {field?.is_mandatory ? "Required" : "Optional"}
                              </span>
                            </TableCell>
                            {!hideAddFieldButton && (
                              <TableCell align="center">
                                <AddDependentField
                                  currentField={field}
                                  currentFieldIndex={index}
                                  fields={fieldDetails}
                                  setFields={setFieldDetails}
                                />
                              </TableCell>
                            )}

                            {!hideAddValidationColumn && (
                              <TableCell align="center">
                                <AddFieldValidations
                                  currentField={field}
                                  fields={fieldDetails}
                                  setFields={setFieldDetails}
                                />
                              </TableCell>
                            )}
                            {showActions && (
                              <>
                                {!preview && (
                                  <TableCell align="center">
                                    {from === "add-field-dialog" ? (
                                      field?.is_custom && (
                                        <AddedCourseAction
                                          Icon={VisibleIcon}
                                          helpText="View"
                                          handleAction={() => {
                                            handleFieldView(field, index);
                                          }}
                                          style={{
                                            color: "#3498ff",
                                          }}
                                        />
                                      )
                                    ) : (
                                      <AddedCourseAction
                                        Icon={VisibleIcon}
                                        helpText="View"
                                        handleAction={() => {
                                          handleFieldView(field, index);
                                        }}
                                        style={{
                                          color: "#3498ff",
                                        }}
                                      />
                                    )}

                                    {from === "add-field-dialog" ? (
                                      field?.is_custom && (
                                        <AddedCourseAction
                                          Icon={EditIcon}
                                          helpText="Edit"
                                          disabled={
                                            dependentFields
                                              ? false
                                              : !field.editable
                                          }
                                          handleAction={() =>
                                            handleFieldEdit(field, index)
                                          }
                                          style={{
                                            color:
                                              field.editable || dependentFields
                                                ? "#3498ff"
                                                : "",
                                          }}
                                        />
                                      )
                                    ) : (
                                      <AddedCourseAction
                                        Icon={EditIcon}
                                        helpText="Edit"
                                        disabled={
                                          dependentFields
                                            ? false
                                            : !field.editable
                                        }
                                        handleAction={() =>
                                          handleFieldEdit(field, index)
                                        }
                                        style={{
                                          color:
                                            field.editable || dependentFields
                                              ? "#3498ff"
                                              : "",
                                        }}
                                      />
                                    )}

                                    {from === "add-field-dialog" ? (
                                      field?.is_custom && (
                                        <AddedCourseAction
                                          disabled={
                                            dependentFields
                                              ? false
                                              : !field.can_remove
                                          }
                                          Icon={TrashIcon}
                                          helpText="Delete"
                                          style={{
                                            color:
                                              field.can_remove ||
                                              dependentFields
                                                ? "#dc2626"
                                                : "",
                                          }}
                                          handleAction={() => {
                                            setDeleteIndex(index);
                                            setOpenDeleteDialog(true);
                                          }}
                                        />
                                      )
                                    ) : (
                                      <AddedCourseAction
                                        disabled={
                                          dependentFields
                                            ? false
                                            : !field.can_remove
                                        }
                                        Icon={TrashIcon}
                                        helpText="Delete"
                                        style={{
                                          color:
                                            field.can_remove || dependentFields
                                              ? "#dc2626"
                                              : "",
                                        }}
                                        handleAction={() => {
                                          setDeleteIndex(index);
                                          setOpenDeleteDialog(true);
                                        }}
                                      />
                                    )}

                                    {from === "add-field-dialog" &&
                                      !field?.is_custom &&
                                      "N/A"}
                                  </TableCell>
                                )}
                              </>
                            )}
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </Table>

          {!isTemplate && (
            <>
              {selectedRows || preview || hideAddFieldButton ? null : (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <AddedCourseAction
                    Icon={AddIcon}
                    helpText="Add New Field"
                    disabled={false}
                    handleAction={() => {
                      setOpenAddFieldDialog(true);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "#3498ff",
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </TableContainer>
      )}

      {showTable && (
        <DynamicTable
          templateDetails={templateDetails}
          setOpenAddFieldDialog={setOpenAddFieldDialog}
          tableData={
            isTemplate
              ? currentFieldDetails
              : tableTemplateData?.table?.headers
              ? tableTemplateData
              : currentFieldDetails
          }
          setTableData={setTableTemplateData}
          setSelectedTableTemplateRow={setSelectedTableTemplateRow}
          isTemplate={isTemplate}
        />
      )}

      {openAddFieldDialog && (
        <AddFieldDialog
          title={addFieldDialogTitle}
          subTitle="Add a new form field"
          openAddFieldDialog={openAddFieldDialog}
          setFormFields={setFieldDetails}
          handleCloseDialog={handleCloseAddFieldDialog}
          viewField={viewField}
          handleAddFields={handleAddFields}
          sectionIndex={sectionIndex}
          setOpenAddTemplateDialog={setOpenAddTemplateDialog}
          prevSelectedRows={currentFieldDetails}
          collegeId={collegeId}
          clientId={clientId}
        />
      )}

      {openAddCustomFieldDialog && (
        <AddCustomFieldDialog
          openAddCustomFieldDialog={openAddCustomFieldDialog}
          handleCloseCustomFieldDialog={handleCloseCustomFieldDialog}
          title={addFieldDialogTitle}
          subTitle="Configure a new form field"
          setFormFields={setFieldDetails}
          editingField={editingField}
          editingIndex={editingIndex}
          viewField={viewField}
          handleAddCustomField={handleAddCustomField}
          sectionIndex={sectionIndex}
          handleCloseAddFieldDialog={handleCloseAddFieldDialog}
          collegeId={collegeId}
          clientId={clientId}
          from={from}
        />
      )}

      {openAddTemplateDialog && (
        <AddTemplateDialog
          title={"Add Template"}
          subTitle="Add a new form template"
          open={openAddTemplateDialog}
          setFormFields={setFieldDetails}
          handleCloseDialog={handleCloseAddTemplateDialog}
          viewField={viewField}
          openAddCustomFieldDialog={openAddCustomFieldDialog}
          setOpenAddCustomFieldDialog={setOpenAddCustomFieldDialog}
          handleCloseCustomFieldDialog={handleCloseCustomFieldDialog}
          sectionIndex={sectionIndex}
          handleAddTemplate={handleAddTemplate}
          templateDetails={templateDetails}
          setTemplateDetails={setTemplateDetails}
          setOpenAddFieldDialog={setOpenAddFieldDialog}
          tableTemplateData={tableTemplateData}
          setTableTemplateData={setTableTemplateData}
        />
      )}

      {openDeleteDialog && (
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={() => {
            handleDeleteField(deleteIndex, sectionIndex);
            setOpenDeleteDialog(false);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </Box>
  );
};

export default FormFields;
