import React from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import {
  addressValidation,
  generalNumberValidation,
  nameValidation,
  validateWebsiteUrl,
} from "../forms/Validation";
import ChargePerReleaseField from "./ChargePerReleaseField";
import ClientRegTextField from "./ClientRegTextField";
import FormRadioField from "./FormRadioField";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import TagPicker from "./TagPicker";

const ClientMainInfoPage = ({ clientMainPageInfoPageFieldState, preview }) => {
  const [websiteUrlError, setWebsiteUrlError] = useState(false);

  const {
    clientName,
    setClientName,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    countryList,
    setSelectedCountryCode,
    selectedCountryCode,
    setStateResetValue,
    setCityList,
    setCityResetValue,
    stateResetValue,
    stateList,
    setSelectedStateCode,
    cityResetValue,
    cityList,
    setSelectedCityName,
    websiteUrl,
    setWebsiteUrl,
    pocName,
    setPocName,
    pocEmail,
    setPocEmail,
    pocMobile,
    setPocMobile,
    leadManagementSystem,
    setLeadManagementSystem,
    appManagementSystem,
    setAppManagementSystem,
    usingAnyCRM,
    setUsingAnyCRM,
    nameOfTheCRM,
    setNameOfTheCRM,
    oldDataMoveTOCRM,
    setOldDataMoveTOCRM,
    rawDataModule,
    setRawDataModule,
    leadLimit,
    setLeadLimit,
    counselorLimit,
    setCounselorLimit,
    collegeManagerLimit,
    setCollegeManagerLimit,
    publisherAccountLimit,
    setPublisherAccountLimit,
    activationDate,
    setActivationDate,
    deactivationDate,
    setDeactivationDate,
    collegeManagerName,
    setCollegeManagerName,
    smsChargesPerRelease,
    whatsappChargesPerRelease,
    emailChargesPerRelease,
    leadStages,
    setLeadStages,
    emailSource,
    setEmailSource,
    emailContactUsNumber,
    setEmailContactUsNumber,
    universityEmailName,
    setUniversityEmailName,
    verificationEmailSubject,
    setVerificationEmailSubject,
    smsUsernameTrans,
    setSmsUsernameTrans,
    smsUsernamePro,
    setSmsUsernamePro,
    smsPassword,
    setSmsPassword,
    smsAuthorization,
    setSmsAuthorization,
    smsSendToPrefix,
    setSmsSendToPrefix,
    whatsAppSendUrl,
    setWhatsAppSendUrl,
    whatsAppGenerateToken,
    setWhatsAppGenerateToken,
    whatsAppUsername,
    setWhatsAppUsername,
    whatsappPassword,
    setWhatsappPassword,
    whatsappSender,
    setWhatsappSender,
    systemTags,
    setSystemTags,
    razorpay_api_key,
    setrazorpay_api_key,
    razorpay_secret,
    setrazorpay_secret,
    razorpay_webhook_secret,
    setrazorpay_webhook_secret,
    partner,
    setpartner,
    x_razorpay_account,
    setx_razorpay_account,

    aws_s3_credentialsusername,
    setaws_s3_credentialsusername,
    aws_s3_credentialsaws_access_key_id,
    setaws_s3_credentialsaws_access_key_id,

    aws_s3_credentialstextract_aws_region_name,
    setaws_s3_credentialstextract_aws_region_name,

    redis_cache_credentialshost,
    setredis_cache_credentialshost,
    redis_cache_credentialsport,
    setredis_cache_credentialsport,
    redis_cache_credentialspassword,
    setredis_cache_credentialspassword,

    textract_aws_access_key_id,
    settextract_aws_access_key_id,
    textract_aws_secret_access_key,
    settextract_aws_secret_access_key,
    textract_aws_region_name,
    settextract_aws_region_name,

    tawk_secret,
    settawk_secret,
    telephony_secret,
    settelephony_secret,
    report_webhook_api_key,
    setreport_webhook_api_key,
    university_contact_us_mail,
    setuniversity_contact_us_mail,
    university_admission_website_url,
    setuniversity_admission_website_url,
    meili_server_host,
    setmeili_server_host,
    meili_server_master_key,
    setmeili_server_master_key,
  } = clientMainPageInfoPageFieldState;

  const [open, setOpen] = useState(false);

  const [newLeadStageName, setNewLeadStageName] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddMore = () => {
    if (newLeadStageName.trim() !== "") {
      const updatedLeadStages = [...leadStages];
      const index = updatedLeadStages.findIndex(
        (stage) => stage.leadstageName === newLeadStageName
      );
      if (index !== -1) {
        if (newLabel.trim() !== "") {
          updatedLeadStages[index].label.push(newLabel);
        }
      } else {
        updatedLeadStages.push({
          leadstageName: newLeadStageName,
          label: newLabel.trim() !== "" ? [newLabel] : [],
        });
      }
      setLeadStages(updatedLeadStages);
      setNewLabel("");
    }
  };

  const handleDone = () => {
    handleAddMore();
    setOpen(false);
  };

  const handleDeleteLeadStage = (leadstageName) => {
    const updatedLeadStages = leadStages.filter(
      (stage) => stage.leadstageName !== leadstageName
    );
    setLeadStages(updatedLeadStages);
  };

  const handleDeleteLabel = (leadstageName, label) => {
    const updatedLeadStages = leadStages.map((stage) => {
      if (stage.leadstageName === leadstageName) {
        stage.label = stage.label.filter((l) => l !== label);
      }
      return stage;
    });
    setLeadStages(updatedLeadStages);
  };

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={clientName}
              setValue={setClientName}
              label="Name of Client"
              type="text"
              keyDown={nameValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={addressLine1}
              setValue={setAddressLine1}
              label="Address line 1"
              type="text"
              preview={preview}
              keyDown={addressValidation}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={addressLine2}
              setValue={setAddressLine2}
              label="Address line 2"
              type="text"
              preview={preview}
              keyDown={addressValidation}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {/* <SelectType labelText="Country" /> */}
            <Autocomplete
              readOnly={preview}
              sx={{ mt: 3 }}
              disablePortal
              id="combo-box-demo"
              value={selectedCountryCode}
              options={countryList}
              getOptionLabel={(option) => option?.name || ""}
              onChange={(_, newValue) => {
                setSelectedCountryCode(newValue);
                setStateResetValue({ name: "" });
                setCityList([{ name: "" }]);
                setCityResetValue({ name: "" });
              }}
              renderInput={(params) => (
                <TextField required {...params} label="Country" color="info" />
              )}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {/* <SelectType labelText="State" /> */}
            <Autocomplete
              readOnly={preview}
              value={stateResetValue}
              sx={{ mt: 3 }}
              disablePortal
              id="combo-box-demo"
              options={stateList?.length ? stateList : [{ name: "" }]}
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                setSelectedStateCode(newValue?.iso2);
                setStateResetValue(newValue);
                setCityResetValue({ name: "" });
              }}
              renderInput={(params) => (
                <TextField required {...params} label="State" color="info" />
              )}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            {/* <SelectType labelText="City" /> */}
            <Autocomplete
              readOnly={preview}
              sx={{ mt: 3 }}
              disablePortal
              value={cityResetValue}
              id="combo-box-demo"
              options={cityList?.length ? cityList : [{ name: "" }]}
              getOptionLabel={(option) => option?.name || ""}
              onChange={(event, newValue) => {
                setSelectedCityName(newValue?.name);
                setCityResetValue(newValue);
              }}
              renderInput={(params) => (
                <TextField required {...params} label="City" color="info" />
              )}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              InputProps={{
                readOnly: preview,
              }}
              color="info"
              required={true}
              sx={{ mt: 3 }}
              fullWidth
              label={"Website URL"}
              error={websiteUrlError}
              type="text"
              value={websiteUrl}
              helperText={websiteUrlError && "Please enter valid URL"}
              onKeyDown={(event) => event.key === " " && event.preventDefault()}
              onChange={(event) => {
                setWebsiteUrl(event.target.value);
                if (validateWebsiteUrl(event.target.value)) {
                  setWebsiteUrlError(false);
                } else {
                  setWebsiteUrlError(true);
                }
              }}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={pocName}
              setValue={setPocName}
              label="POC Name"
              type="text"
              keyDown={nameValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={pocEmail}
              setValue={setPocEmail}
              label="POC Email"
              type="email"
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={pocMobile}
              setValue={setPocMobile}
              label="POC Mobile Number"
              type="number"
              keyDown={generalNumberValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={university_contact_us_mail}
              setValue={setuniversity_contact_us_mail}
              label="Contact Us mail"
              type="email"
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={university_admission_website_url}
              setValue={setuniversity_admission_website_url}
              label="Admission website url"
              type="text"
              preview={preview}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Divider sx={{ mt: 2 }} />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <FormRadioField
              value={leadManagementSystem}
              setValue={setLeadManagementSystem}
              label="Lead management system"
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <FormRadioField
              value={appManagementSystem}
              setValue={setAppManagementSystem}
              label="Application management system"
              preview={preview}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <FormRadioField
              value={rawDataModule}
              setValue={setRawDataModule}
              label="Raw data module"
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={leadLimit}
              setValue={setLeadLimit}
              label="Lead limit"
              type="number"
              keyDown={generalNumberValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={counselorLimit}
              setValue={setCounselorLimit}
              label="Counselor Limit"
              type="number"
              keyDown={generalNumberValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={collegeManagerLimit}
              setValue={setCollegeManagerLimit}
              label="College users limit"
              type="number"
              keyDown={generalNumberValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={publisherAccountLimit}
              setValue={setPublisherAccountLimit}
              label="Publisher account limit"
              type="number"
              keyDown={generalNumberValidation}
              preview={preview}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <Box sx={{ mt: 3 }}>
              <DesktopDatePicker
                readOnly={preview}
                label="Activation Date"
                inputFormat="MM/dd/yyyy"
                sx={{ width: "100%" }}
                value={activationDate}
                onChange={(date) => setActivationDate(date)}
                renderInput={(params) => (
                  <TextField
                    onKeyDown={(e) => e.preventDefault()}
                    fullWidth
                    required
                    {...params}
                    color="info"
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <Box sx={{ mt: 3 }}>
              <DesktopDatePicker
                readOnly={preview}
                label="Deactivation Date"
                inputFormat="MM/dd/yyyy"
                sx={{ width: "100%" }}
                value={deactivationDate}
                onChange={(date) => setDeactivationDate(date)}
                renderInput={(params) => (
                  <TextField
                    onKeyDown={(e) => e.preventDefault()}
                    fullWidth
                    required
                    {...params}
                    color="info"
                  />
                )}
              />
            </Box>
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ChargePerReleaseField
              label="SMS Charge per release"
              value={smsChargesPerRelease}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ChargePerReleaseField
              label="Whatsapp Charge per release"
              value={whatsappChargesPerRelease}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ChargePerReleaseField
              label="Email Charge per release"
              value={emailChargesPerRelease}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={collegeManagerName}
              setValue={setCollegeManagerName}
              label="College manager name"
              type="text"
              keyDown={nameValidation}
              preview={preview}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12} sx={{ mb: -3 }}>
            <FormRadioField
              value={usingAnyCRM}
              setValue={setUsingAnyCRM}
              label="Are you currently using any CRM?"
              preview={preview}
            />
          </Grid>
          {usingAnyCRM && (
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={nameOfTheCRM}
                setValue={setNameOfTheCRM}
                label="Please mention the name of the CRM"
                type="text"
                preview={preview}
              />
            </Grid>
          )}
          {usingAnyCRM && (
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={oldDataMoveTOCRM}
                setValue={setOldDataMoveTOCRM}
                label="Do you want the old data to be moved to our CRM (yes/no)"
                type="text"
                preview={preview}
              />
            </Grid>
          )}
          <Grid item md={6} sm={6} xs={12}>
            <Typography color={"#65748B"} mt={2}>
              Please Add Lead Stages and labels?
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleClickOpen}
              sx={{ mt: 1 }}
            >
              <AddCircleOutlineIcon></AddCircleOutlineIcon>
            </Button>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <TagPicker
              options={systemTags}
              setOptions={setSystemTags}
              preventLimit={6}
              preview={preview}
              helpText="After writing Tags, please press enter button. You can add maximum 6 tags"
              label="Add Tags (Default Tag : DND)"
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"18px"} fontWeight={"bold"} mt={2}>
              Communication Details
            </Typography>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              Email Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={emailSource}
              setValue={setEmailSource}
              label="Email source"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={emailContactUsNumber}
              setValue={setEmailContactUsNumber}
              label="Email contact us number"
              type="number"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={universityEmailName}
              setValue={setUniversityEmailName}
              label="University email name"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={verificationEmailSubject}
              setValue={setVerificationEmailSubject}
              label="Verification email Subject"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              SMS Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={smsUsernameTrans}
              setValue={setSmsUsernameTrans}
              label="Transaction Username"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={smsUsernamePro}
              setValue={setSmsUsernamePro}
              label="Username Pro"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={smsPassword}
              setValue={setSmsPassword}
              label="Password"
              type="password"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={smsAuthorization}
              setValue={setSmsAuthorization}
              label="Authorization"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={smsSendToPrefix}
              setValue={setSmsSendToPrefix}
              label="SMS send to prefix"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              WhatsApp Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={whatsAppSendUrl}
              setValue={setWhatsAppSendUrl}
              label="Send WhatsApp url"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={whatsAppGenerateToken}
              setValue={setWhatsAppGenerateToken}
              label="Generate WhatsApp Token"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={whatsAppUsername}
              setValue={setWhatsAppUsername}
              label="WhatsApp UserName"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={whatsappPassword}
              setValue={setWhatsappPassword}
              label="WhatsApp Password"
              type="password"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={whatsappSender}
              setValue={setWhatsappSender}
              label="Whats App Sender"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              RazorPay Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={razorpay_api_key}
              setValue={setrazorpay_api_key}
              label="API key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={razorpay_secret}
              setValue={setrazorpay_secret}
              label="Secret key "
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={razorpay_webhook_secret}
              setValue={setrazorpay_webhook_secret}
              label="Webhook Secret key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <FormRadioField
              value={partner}
              setValue={setpartner}
              label="Partner?"
              preview={preview}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={x_razorpay_account}
              setValue={setx_razorpay_account}
              label="Ex Razor pay Account"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              AWS S3 Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={aws_s3_credentialsusername}
              setValue={setaws_s3_credentialsusername}
              label="User Name"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={aws_s3_credentialsaws_access_key_id}
              setValue={setaws_s3_credentialsaws_access_key_id}
              label="Access key ID"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={aws_s3_credentialstextract_aws_region_name}
              setValue={setaws_s3_credentialstextract_aws_region_name}
              label="Region Name"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              Redis Cache Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={redis_cache_credentialshost}
              setValue={setredis_cache_credentialshost}
              label="Host"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={redis_cache_credentialsport}
              setValue={setredis_cache_credentialsport}
              label="Port"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={redis_cache_credentialspassword}
              setValue={setredis_cache_credentialspassword}
              label="Password"
              type="password"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              AWS Textract Credentials
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={textract_aws_access_key_id}
              setValue={settextract_aws_access_key_id}
              label="Access key ID"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={textract_aws_secret_access_key}
              setValue={settextract_aws_secret_access_key}
              label="Secret Access Key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={textract_aws_region_name}
              setValue={settextract_aws_region_name}
              label="Region"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <Typography fontSize={"15px"} fontWeight={"bold"} sx={{ mb: -4 }}>
              Others
            </Typography>
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={tawk_secret}
              setValue={settawk_secret}
              label="Tawk.to Secret key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={telephony_secret}
              setValue={settelephony_secret}
              label="Telephony Secret key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={report_webhook_api_key}
              setValue={setreport_webhook_api_key}
              label="Report Webhook"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={meili_server_host}
              setValue={setmeili_server_host}
              label="Meili Search Server host"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={meili_server_master_key}
              setValue={setmeili_server_master_key}
              label="Meili Search Server Master key"
              type="text"
              preview={preview}
              required={false}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>
      <Dialog scroll={"body"} open={open} onClose={handleClose}>
        {!preview && <DialogTitle>Add Lead Stage</DialogTitle>}
        {!preview && (
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="leadStageName"
              label="Lead Stage Name"
              fullWidth
              value={newLeadStageName}
              onChange={(e) => setNewLeadStageName(e.target.value)}
            />
            <TextField
              margin="dense"
              id="label"
              label="Label"
              fullWidth
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
          </DialogContent>
        )}
        {!preview && (
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button onClick={handleAddMore} color="primary">
              Add
            </Button>
            <Button onClick={handleDone} color="primary">
              Done
            </Button>
          </DialogActions>
        )}
        <DialogContent>
          <Typography variant="h7" fontWeight={"bold"}>
            Added lead Stages
          </Typography>
          <List>
            {leadStages?.map((stage) => (
              <ListItem key={stage.leadstageName}>
                <ListItemText
                  style={{ fontWeight: "bold", color: "blue" }}
                  primary={stage.leadstageName}
                  secondary={stage.label.map((label) => (
                    <React.Fragment key={label}>
                      <span style={{ marginLeft: "15px" }}>{label}</span>
                      {!preview && (
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteLabel(stage.leadstageName, label)
                          }
                        >
                          <DeleteIcon
                            sx={{ fontSize: "16px", color: "#39080c" }}
                          />
                        </IconButton>
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                />
                {!preview && (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteLeadStage(stage.leadstageName)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ClientMainInfoPage;
