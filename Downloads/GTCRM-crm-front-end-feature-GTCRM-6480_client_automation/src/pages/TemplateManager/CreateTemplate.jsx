import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MultipleTabs from "../../components/shared/tab-panel/MultipleTabs";
import KeyboardArrowDownSharpIcon from "@mui/icons-material/KeyboardArrowDownSharp";

const CreateTemplate = ({ collegeId, onClose, currentTab, setCurrentTab }) => {
  const [templateName, setTemplateName] = React.useState("");
  const [smsType, setSmsType] = React.useState("");

  const handleCloseIconClick = () => {
    onClose();
  };

  const handleChangeSms = (event) => {
    setSmsType(event.target.value);
  };

  return (
    <Box className="create-template-main-container">
      <Grid container spacing={2}>
        <Grid item md={12} sm={12} xs={12}>
          <Box className="align-row">
            <Typography className="script-text">Create Template</Typography>
            <IconButton
              onClick={() => handleCloseIconClick()}
              className="close-icon"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className="tm-tabs-wrapper mt-22">
            <MultipleTabs
              tabArray={[
                { tabName: "Email" },
                { tabName: "WhatsApp" },
                { tabName: "Sms" },
              ]}
              setMapTabValue={setCurrentTab}
              mapTabValue={currentTab}
              boxWidth="260px"
            ></MultipleTabs>
          </Box>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TextField
            sx={{ width: "100%" }}
            label="Template Name*"
            variant="outlined"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            size="small"
            InputProps={{
              classes: {
                root: "tm-input-root",
                notchedOutline: "tm-notched-outline",
              },
            }}
            InputLabelProps={{
              className: "tm-input-label",
            }}
          />
        </Grid>

        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TextField
            sx={{ width: "100%" }}
            label="Sender ID*"
            variant="outlined"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            size="small"
            InputProps={{
              classes: {
                root: "tm-input-root",
                notchedOutline: "tm-notched-outline sender-id-outline",
              },
            }}
            InputLabelProps={{
              className: "tm-input-label",
            }}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <FormControl required fullWidth sx={{ mt: 0 }}>
            <InputLabel
              className="sms-input-label"
              id="demo-controlled-open-select-label"
            >
              SMS Type
            </InputLabel>
            <Select
              defaultValue={smsType}
              required
              value={smsType}
              onChange={handleChangeSms}
              label="SMS Type"
              size="small"
              classes={{
                root: "tm-input-root sms-type-root",
                outlined: "tm-notched-outline sms-type-outline",
              }}
              IconComponent={(props) => (
                <KeyboardArrowDownSharpIcon {...props} />
              )}
            >
              <MenuItem value={"Service Implicit"}>Service Implicit</MenuItem>
              <MenuItem value={"Service Explicit"}>Service Explicit</MenuItem>
              <MenuItem value={"Promotional"}>Promotional</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <TextField
            sx={{ width: "100%" }}
            label="Add Tags"
            variant="outlined"
            value={templateName}
            onChange={(event) => setTemplateName(event.target.value)}
            size="small"
            InputProps={{
              classes: {
                root: "tm-input-root",
                notchedOutline: "tm-notched-outline add-tags-outline",
              },
            }}
            InputLabelProps={{
              className: "tm-input-label",
            }}
          />
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={12}>
          <FormControl required fullWidth sx={{ mt: 0 }}>
            <InputLabel
              className="sms-input-label"
              id="demo-controlled-open-select-label"
            >
              Dlt Content ID
            </InputLabel>
            <Select
              defaultValue={smsType}
              required
              value={smsType}
              onChange={handleChangeSms}
              label="Dlt Content ID"
              size="small"
              classes={{
                root: "tm-input-root sms-type-root",
                outlined: "tm-notched-outline sms-type-outline",
              }}
              IconComponent={(props) => (
                <KeyboardArrowDownSharpIcon {...props} />
              )}
            >
              
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
export default CreateTemplate;
