import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Popover, Whisper } from "rsuite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ClientDefaultForm from "../ClientDefaultForm";
import { borderRadius } from "@mui/system";
import ModuleSubscriptionTable from "../ModuleSubscriptionTable/ModuleSubscriptionTable";
import "../../../../styles/clientOnboardingStyles.css";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const data = [
  {
    id: "665f2f662874c8252e01bd07",
    name: "Test",
    address: {
      address_line_1: "sdsd",
      address_line_2: "sdsd",
      country_code: "AF",
      state: "BDS",
      city: "Ashkāsham",
    },
    website_url: "https://shiftboolean.atlassian.net/jira/your-work",
    pocs: [
      {
        name: "rerer",
        email: "raju@gmail.com",
        mobile_number: 4545454545,
      },
    ],
    subscriptions: {
      raw_data_module: false,
      lead_management_system: false,
      app_management_system: false,
    },
    enforcements: {
      lead_limit: 545,
      counselor_limit: 4545,
      client_manager_limit: 4545,
      publisher_account_limit: 545,
    },
    status_info: {
      activation_date: "2024-06-04T11:37:01.940595",
      deactivation_date: "2024-06-04T11:37:01.940618",
      creation_date: "2024-06-04T15:14:46.191000",
    },
    charges_per_release: {},
    college_manager_name: ["gfhghgh"],
    extra_fields: {},
    course_details: [
      {
        courseName: "course 1",
        courseFees: "43434",
        school: "School1",
        courseSpecializations: ["dfdf"],
        isCoursePg: false,
        courseActivationDate: "2024-06-04T15:12:04.707Z",
        courseDeactivationDate: "2025-06-04T15:12:04.707Z",
      },
    ],
    is_different_forms: false,
    charges_details: {
      lead: 6000,
      counselor_account: 30300,
      client_manager_account: 113600,
      publisher_account: 6800,
      raw_data_module: 1000,
      lead_management_system: 1000,
      app_management_system: 1000,
      per_sms_charge: 1,
      per_email_charge: 1,
      per_whatsapp_charge: 2,
      total_bill: 159700,
    },
    status: "Approved",
    background_image:
      "https://devsbhs.s3.ap-south-1.amazonaws.com/theapollouniversity/2024/devassestssb/b357b8470f60457ab9c675eeba0e108c.jpg",
    logo: "https://devsbhs.s3.ap-south-1.amazonaws.com/theapollouniversity/2024/devassestssb/f425caadf6b8421eb5a017cca610453b.jpg",
    school_names: ["School1"],
    lead_stage_label: {},
    lead_tags: ["string"],
    current_crm_usage: false,
    name_of_current_crm: "",
    old_data_migration: "",
    brochure_url: "",
    campus_tour_video_url: "",
    website_html_url: "https://shiftboolean.atlassian.net/jira/your-work",
    google_tag_manager_id: "sdsd",
    project_title: "sds",
    project_meta_description: "dsds",
    thank_you_page_url: "",
    system_preference: null,
  },
];

const statusOptions = [
  { label: "Approve", value: "approved" },
  { label: "Decline", value: "declined" },
];

const speaker = (
  <Popover>
    <form
    //  onSubmit={handleUpdateStatus}
    >
      {/* {statusUpdateLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <CircularProgress size={25} color="info" />
        </Box>
      )} */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <Autocomplete
          disablePortal
          getOptionLabel={(option) => option.label}
          options={statusOptions}
          sx={{ width: 250 }}
          size="small"
          // onChange={(_, value) => setSelectedStatus(value)}
          renderInput={(params) => (
            <TextField
              required
              size="small"
              {...params}
              label="Select Status"
              color="info"
            />
          )}
        />
        <Button size="small" variant="outlined" type="submit">
          Submit
        </Button>
      </Box>
    </form>
  </Popover>
);

const FormRequestManagementTable = ({ editForm }) => {
  const navigate = useNavigate();
  const [openViewFormDetailsDialog, setOpenViewFormDetailsFormDialog] =
    useState(false);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  return (
    <>
      {data?.map(
        (college) =>
          college.status.toLowerCase() === "approved" && (
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => navigate("/client-onboarding")}
                color="info"
                sx={{ borderRadius: 1 }}
              >
                Create College
              </Button>
            </Box>
          )
      )}
      <TableContainer
        sx={{ mt: 1 }}
        className="custom-scrollbar"
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="client-onboarding-table-header">
                College Name
              </TableCell>
              <TableCell
                className="client-onboarding-table-header"
                align="center"
              >
                Contact Email
              </TableCell>
              <TableCell
                className="client-onboarding-table-header"
                align="center"
              >
                Contact Phone Number
              </TableCell>
              <TableCell
                className="client-onboarding-table-header"
                align="center"
              >
                Form Status
              </TableCell>
              <TableCell
                className="client-onboarding-table-header"
                align="center"
              >
                Update Status
              </TableCell>
              <TableCell
                className="client-onboarding-table-header"
                align="center"
              >
                {editForm ? "Edit" : "View"} Form
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((college) => (
              <TableRow key={college.id}>
                <TableCell>
                  <Typography variant="subtitle2">{college.name}</Typography>
                </TableCell>
                <TableCell align="center">{college.pocs[0].email}</TableCell>
                <TableCell align="center">
                  {college.pocs[0].mobile_number}
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
                      // onClick={() => setSelectedCollegeId(college.id)}
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
                      // onClick={() => {
                      //   setExistingField(college, editForm);
                      // }}
                      >
                        <BorderColorIcon sx={{ color: "#3498ff" }} />
                      </IconButton>
                    ) : (
                      <IconButton
                        // onClick={() => {
                        //   setExistingField(college);
                        // }}
                        onClick={() => setOpenViewFormDetailsFormDialog(true)}
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
        {openViewFormDetailsDialog && (
          <Dialog
            open={openViewFormDetailsDialog}
            onClose={() => setOpenViewFormDetailsFormDialog(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2.5 } }}
          >
            <Box sx={{ p: 4 }}>
              {currentSectionIndex === 0 && (
                <ClientDefaultForm
                  currentSectionIndex={currentSectionIndex}
                  setCurrentSectionIndex={setCurrentSectionIndex}
                  // collegeId={collegeId}
                  hideBackBtn={true}
                  apiCallingStepValue={0}
                />
              )}
              {currentSectionIndex === 1 && (
                <Box sx={{ my: 4 }}>
                  {/*
                TODO : API is not implemented for the module subscription table, only design is done. API implementation will be done in the upcoming sprint.
              */}
                  <ModuleSubscriptionTable
                    currentSectionIndex={currentSectionIndex}
                    setCurrentSectionIndex={setCurrentSectionIndex}
                  />
                </Box>
              )}
            </Box>
          </Dialog>
        )}
      </TableContainer>
    </>
  );
};

export default FormRequestManagementTable;
