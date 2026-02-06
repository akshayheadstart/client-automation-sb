import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Cookies from "js-cookie";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import { useContext } from "react";
import { DashboradDataContext } from "../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../hooks/useToasterHook";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import { useSelector } from "react-redux";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const UserRoleListItem = ({
  nodeDatum,
  allPermission,
  loading,
  setLoading,
  setPermissionUpdated,
  permissionUpdated,
  setUpdateApiInternalServerError,
  setSomethingWentWrongInUserPermission,
}) => {
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const [add_client, setAdd_client] = useState(
    allPermission[nodeDatum.role]?.permission?.add_client
  );
  const [delete_client, setDelete_client] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_client
  );
  const [purge_client_data, setpurge_client_data] = useState(
    allPermission[nodeDatum.role]?.permission?.purge_client_data
  );
  const [add_client_manager, setadd_client_manager] = useState(
    allPermission[nodeDatum.role]?.permission?.add_client_manager
  );
  const [delete_client_manager, setdelete_client_manager] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_client_manager
  );
  const [create_enquiry_form, setcreate_enquiry_form] = useState(
    allPermission[nodeDatum.role]?.permission?.create_enquiry_form
  );
  const [update_enquiry_form, setupdate_enquiry_form] = useState(
    allPermission[nodeDatum.role]?.permission?.update_enquiry_form
  );
  const [select_verification_type, setselect_verification_type] = useState(
    allPermission[nodeDatum.role]?.permission?.select_verification_type
  );
  const [add_college_super_admin, setadd_college_super_admin] = useState(
    allPermission[nodeDatum.role]?.permission?.add_college_super_admin
  );
  const [delete_college_super_admin, setdelete_college_super_admin] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_college_super_admin
  );
  const [add_college_admin, setadd_college_admin] = useState(
    allPermission[nodeDatum.role]?.permission?.add_college_admin
  );
  const [delete_college_admin, setdelete_college_admin] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_college_admin
  );
  const [add_college_head_counselor, setadd_college_head_counselor] = useState(
    allPermission[nodeDatum.role]?.permission?.add_college_head_counselor
  );
  const [delete_college_head_counselor, setdelete_college_head_counselor] =
    useState(
      allPermission[nodeDatum.role]?.permission?.delete_college_head_counselor
    );
  const [add_college_counselor, setadd_college_counselor] = useState(
    allPermission[nodeDatum.role]?.permission?.add_college_counselor
  );
  const [delete_college_counselor, setdelete_college_counselor] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_college_counselor
  );
  const [add_college_publisher_console, setadd_college_publisher_console] =
    useState(
      allPermission[nodeDatum.role]?.permission?.add_college_publisher_console
    );
  const [
    delete_college_publisher_console,
    setdelete_college_publisher_console,
  ] = useState(
    allPermission[nodeDatum.role]?.permission?.delete_college_publisher_console
  );

  const permissionObject = {
    add_client: add_client,
    delete_client: delete_client,
    purge_client_data: purge_client_data,
    add_client_manager: add_client_manager,
    delete_client_manager: delete_client_manager,
    create_enquiry_form: create_enquiry_form,
    update_enquiry_form: update_enquiry_form,
    select_verification_type: select_verification_type,
    add_college_super_admin: add_college_super_admin,
    delete_college_super_admin: delete_college_super_admin,
    add_college_admin: add_college_admin,
    delete_college_admin: delete_college_admin,
    add_college_head_counselor: add_college_head_counselor,
    delete_college_head_counselor: delete_college_head_counselor,
    add_college_counselor: add_college_counselor,
    delete_college_counselor: delete_college_counselor,
    add_college_publisher_console: add_college_publisher_console,
    delete_college_publisher_console: delete_college_publisher_console,
  };

  const { setApiResponseChangeMessage } = useContext(DashboradDataContext);

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const updatePermissionTable = () => {
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/user/update_permissions/?user_type=${nodeDatum?.userType}${
        collegeId ? "&college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "PUT", JSON.stringify(permissionObject))
    )
      .then((res) => res.json())
      .then((result) => {
        setPermissionUpdated(!permissionUpdated);
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          setLoading(false);
          pushNotification("error", result?.detail);
        } else {
          try {
            pushNotification("success", "Successfully Updated");
            setLoading(false);
            window.location.reload();
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUserPermission,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        handleInternalServerError(setUpdateApiInternalServerError, "", 5000);
      })
      .finally(() => setLoading(false));
  };
  return (
    <List sx={{ width: "100%", maxWidth: 360, p: 1 }}>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            Client
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Add Client" />
              <Switch
                edge="end"
                onChange={() => setAdd_client(!add_client)}
                checked={add_client}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Delete Client" />
              <Switch
                edge="end"
                onChange={() => setDelete_client(!delete_client)}
                checked={delete_client}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Purge Client Data" />
              <Switch
                edge="end"
                onChange={() => setpurge_client_data(!purge_client_data)}
                checked={purge_client_data}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Add Client Manager" />
              <Switch
                edge="end"
                onChange={() => setadd_client_manager(!add_client_manager)}
                checked={add_client_manager}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Delete Client Manager" />
              <Switch
                edge="end"
                onChange={() =>
                  setdelete_client_manager(!delete_client_manager)
                }
                checked={delete_client_manager}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            Enquiry Form
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Create Enquiry Form" />
              <Switch
                edge="end"
                onChange={() => setcreate_enquiry_form(!create_enquiry_form)}
                checked={create_enquiry_form}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Update Enquiry Form" />
              <Switch
                edge="end"
                onChange={() => setupdate_enquiry_form(!update_enquiry_form)}
                checked={update_enquiry_form}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Select Verification Type"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setselect_verification_type(!select_verification_type)
                }
                checked={select_verification_type}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            College Super Admin
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Add College Super Admin"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setadd_college_super_admin(!add_college_super_admin)
                }
                checked={add_college_super_admin}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Delete College Super Admin"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setdelete_college_super_admin(!delete_college_super_admin)
                }
                checked={delete_college_super_admin}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            College Admin
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Add College Admin" />
              <Switch
                edge="end"
                onChange={() => setadd_college_admin(!add_college_admin)}
                checked={add_college_admin}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Delete College Admin" />
              <Switch
                edge="end"
                onChange={() => setdelete_college_admin(!delete_college_admin)}
                checked={delete_college_admin}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            College Head Counselor
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Add College Head Counselor"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setadd_college_head_counselor(!add_college_head_counselor)
                }
                checked={add_college_head_counselor}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Delete College Head Counselor"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setdelete_college_head_counselor(
                    !delete_college_head_counselor
                  )
                }
                checked={delete_college_head_counselor}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            College Counselor
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText id="switch-list" primary="Add College Counselor" />
              <Switch
                edge="end"
                onChange={() =>
                  setadd_college_counselor(!add_college_counselor)
                }
                checked={add_college_counselor}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Delete College Counselor"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setdelete_college_counselor(!delete_college_counselor)
                }
                checked={delete_college_counselor}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ mb: 1 }} className="faqs-accord-individual">
        <AccordionSummary
          expandIcon={<AddOutlinedIcon className="faqs-accord-icon" />}
          aria-controls="panel1a-content"
          id="faqs-accord-individual-question"
        >
          <Typography className="faqs-accord-individual-question-text">
            College Publisher Console
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography className="faqs-accord-individual-question-text">
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Add College Publisher Console"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setadd_college_publisher_console(
                    !add_college_publisher_console
                  )
                }
                checked={add_college_publisher_console}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: -2 }}>
              <ListItemText
                id="switch-list"
                primary="Delete College Publisher Console"
              />
              <Switch
                edge="end"
                onChange={() =>
                  setdelete_college_publisher_console(
                    !delete_college_publisher_console
                  )
                }
                checked={delete_college_publisher_console}
                inputProps={{
                  "aria-labelledby": "switch-list-label",
                }}
              />
            </ListItem>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Box
        sx={{ display: "flex", justifyContent: "center", my: 3, mx: 1 }}
        data-testid="loading-button"
      >
        <LoadingButton
          size="small"
          color="secondary"
          onClick={updatePermissionTable}
          loading={loading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          {" "}
          Save
        </LoadingButton>
      </Box>
    </List>
  );
};

export default UserRoleListItem;
