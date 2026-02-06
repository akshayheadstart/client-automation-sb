import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Input,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import AddedCourseAction from "../../shared/ClientRegistration/AddedCourseAction";
import AddIcon from "@mui/icons-material/Add";

export default function DynamicTable({
  templateDetails,
  setOpenAddFieldDialog,
  tableData,
  setTableData,
  setSelectedTableTemplateRow,
  isTemplate,
}) {
  const addColumn = () => {
    const newColumnKey = `column_${tableData.table.headers.length + 1}`;
    const newHeader = {
      header_name: `Column ${tableData.table.headers.length + 1}`,
      is_mandatory: false,
      editable: true,
      key_name: newColumnKey,
      isNew: true, // Mark the column as new
    };

    const updatedHeaders = [...tableData.table.headers, newHeader];

    // Add a new row object only once
    const newRow = {
      field_name: "",
      field_type: "",
      is_mandatory: false,
      editable: false,
      can_remove: false,
      value: "",
      error: "",
      key_name: "",
    };

    const updatedRows = [...tableData.table.rows, newRow]; // Append new row only once

    setTableData({
      ...tableData,
      table: { ...tableData.table, headers: updatedHeaders, rows: updatedRows },
    });
  };

  const updateHeaderName = (index, value) => {
    const updatedHeaders = [...tableData.table.headers];
    updatedHeaders[index].header_name = value;
    setTableData({
      ...tableData,
      table: { ...tableData.table, headers: updatedHeaders },
    });
  };

  const deleteColumn = (columnIndex) => {
    if (tableData.table.headers.length === 1) return; // Prevent deleting the last column

    // Get the column key to delete
    const columnKeyToDelete = tableData.table.headers[columnIndex].key_name;

    // Remove the header at the given index
    const updatedHeaders = tableData.table.headers.filter(
      (_, headerIndex) => headerIndex !== columnIndex
    );

    // Remove the corresponding row object at the same index
    const updatedRows = tableData.table.rows.filter(
      (_, rowIndex) => rowIndex !== columnIndex
    );

    setTableData((prevTableData) => ({
      ...prevTableData,
      table: {
        ...prevTableData.table,
        headers: updatedHeaders,
        rows: updatedRows,
      },
    }));
  };

  const handleResultModeChange = (event, setTableData) => {
    const selectedValue = event.target.value === "true";

    setTableData((prevState) => {
      const updatedData = { ...prevState };

      // Update the radio field value
      updatedData.table.result_mode_fields =
        prevState.table.result_mode_fields.map((item) =>
          item.key_name === "result_mode"
            ? { ...item, value: selectedValue }
            : item
        );

      // Determine new header and field names
      const newLabel = selectedValue ? "Semester Number" : "Year Number";

      // Update first header
      updatedData.table.headers = prevState.table.headers.map((header, index) =>
        index === 0 ? { ...header, header_name: newLabel } : header
      );

      // Update first row
      updatedData.table.rows = prevState.table.rows.map((row, index) =>
        index === 0 ? { ...row, field_name: newLabel } : row
      );

      return updatedData;
    });
  };

  return (
    <Box>
      {tableData?.table?.result_mode_fields &&
        tableData?.table?.result_mode_fields?.map((field) => (
          <FormControl color="grey">
            <Box className="client-onboarding-flex-box">
              <FormLabel>{field?.field_name}</FormLabel>
              <RadioGroup
                row
                value={field?.value}
                onChange={(event) => {
                  handleResultModeChange(event, setTableData);
                }}
              >
                {field?.options?.map((option) => (
                  <FormControlLabel
                    disabled={isTemplate}
                    value={option?.value}
                    control={<Radio color="info" />}
                    label={option?.label}
                  />
                ))}
              </RadioGroup>
            </Box>
          </FormControl>
        ))}

      <Table
        sx={{
          mt: 2,
          width: "100%",
          border: "1px solid #3498ff",
        }}
      >
        <TableHead>
          <TableRow>
            {tableData?.table?.headers?.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  border: "1px solid #3498ff",
                  backgroundColor: "#f0f0f0",
                }}
              >
                {tableData?.table?.headers?.length > 1 && header?.isNew ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {isTemplate ? (
                      <Typography variant="body2" fontWeight="bold">
                        {header.header_name}
                      </Typography>
                    ) : (
                      <>
                        <TextField
                          color="info"
                          size="small"
                          value={header.header_name}
                          onChange={(e) =>
                            updateHeaderName(index, e.target.value)
                          }
                          sx={{ textAlign: "center" }}
                        />

                        <IconButton
                          size="small"
                          onClick={() => deleteColumn(index)}
                        >
                          <TrashIcon color="#dc2626" fontSize="small" />
                        </IconButton>
                      </>
                    )}
                  </div>
                ) : (
                  <Typography variant="body2" fontWeight="bold">
                    {header.header_name}
                  </Typography>
                )}
              </TableCell>
            ))}
            {!isTemplate && (
              <TableCell
                sx={{
                  border: "1px solid #3498ff",
                  backgroundColor: "#f0f0f0",
                  textAlign: "center",
                }}
              >
                <Button size="small" onClick={addColumn} color="info">
                  + Add Column
                </Button>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {tableData?.table?.headers?.map((_, colIndex) => (
              <TableCell key={colIndex} sx={{ border: "1px solid #3498ff" }}>
                {tableData?.table?.Row?.fields[colIndex]?.field_name === "" ? (
                  <AddedCourseAction
                    Icon={AddIcon}
                    helpText="Add New Field"
                    disabled={false}
                    handleAction={() => {
                      setOpenAddFieldDialog(true);
                      setSelectedTableTemplateRow(colIndex);
                    }}
                    style={{
                      cursor: "pointer",
                      color: "#3498ff",
                    }}
                  />
                ) : (
                  tableData?.table?.Row?.fields[colIndex]?.field_name
                )}
              </TableCell>
            ))}
            {!isTemplate && (
              <TableCell
                sx={{ border: "1px solid #3498ff", textAlign: "center" }}
              ></TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
