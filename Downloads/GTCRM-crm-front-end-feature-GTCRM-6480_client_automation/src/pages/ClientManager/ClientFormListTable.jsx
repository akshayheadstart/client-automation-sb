import {
  Button,
  Chip,
  Dialog,
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
import React from "react";
import { Whisper } from "rsuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useState } from "react";
import BorderColorIcon from "@mui/icons-material/BorderColor";

function ClientFormListTable({
  speaker,
  data,
  editForm,
  setSelectedCollegeId,
  setExistingField,
}) {
  const [openViewFormDetailsDialog, setOpenViewFormDetailsFormDialog] =
    useState(false);

  return (
    <TableContainer
      sx={{ mt: 1 }}
      className="custom-scrollbar"
      component={Paper}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>College Name</TableCell>
            <TableCell align="center">Contact Email</TableCell>
            <TableCell align="center">Contact Phone Number</TableCell>
            <TableCell align="center">Form Status</TableCell>
            <TableCell align="center">Update Status</TableCell>
            <TableCell align="center">
              {editForm ? "Edit" : "View"} Form
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((college) => (
            <TableRow key={college.id}>
              <TableCell>
                <Typography variant="subtitle2">{college?.name}</Typography>
              </TableCell>
              <TableCell align="center">
                {college?.pocs?.length > 0 ? college.pocs[0].email : "- -"}
              </TableCell>
              <TableCell align="center">
                {college?.pocs?.length > 0
                  ? college.pocs[0].mobile_number
                  : "- -"}
              </TableCell>
              <TableCell align="center">
                <Chip
                  variant="outlined"
                  color={
                    college.status === "Approved"
                      ? "success"
                      : college.status === "Pending"
                      ? "warning"
                      : "error"
                  }
                  label={college.status}
                ></Chip>
              </TableCell>
              <TableCell align="center">
                <Whisper
                  placement="bottom"
                  controlId="control-id-click"
                  trigger="click"
                  speaker={speaker}
                >
                  <Button
                    onClick={() => setSelectedCollegeId(college.id)}
                    sx={{ borderRadius: "20px" }}
                    size="small"
                    variant="outlined"
                  >
                    Update
                  </Button>
                </Whisper>
              </TableCell>
              <TableCell align="center">
                <Tooltip
                  title={editForm ? "View and Edit" : "View"}
                  placement="left"
                  arrow
                >
                  {editForm ? (
                    <IconButton
                      onClick={() => {
                        setExistingField(college, editForm);
                      }}
                    >
                      <BorderColorIcon sx={{ color: "#3498ff" }} />
                    </IconButton>
                  ) : (
                    <IconButton
                      onClick={() => {
                        setExistingField(college);
                      }}
                    >
                      <VisibilityIcon sx={{ color: "#3498ff" }} />
                    </IconButton>
                  )}
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openViewFormDetailsDialog}
        onClose={() => setOpenViewFormDetailsFormDialog(false)}
      >
        {/* <AllApplicationForm
                    heading="All"
                    formFieldsStates={formFieldsStates}
                /> */}
      </Dialog>
    </TableContainer>
  );
}

export default ClientFormListTable;
