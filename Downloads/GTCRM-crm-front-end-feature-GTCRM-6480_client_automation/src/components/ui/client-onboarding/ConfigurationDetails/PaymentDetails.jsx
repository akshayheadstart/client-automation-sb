import React, { useState } from "react";
import useToasterHook from "../../../../hooks/useToasterHook";
import { Button, Grid, TextField } from "@mui/material";
import SharedAutocomplete from "../../../shared/forms/ClientOnboardingForms/SharedAutocomplete";
import DeleteDialogue from "../../../shared/Dialogs/DeleteDialogue";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const PaymentDetails = ({
  allowPaymentValue,
  applicationWiseValue,
  promoVoucherValue,
  scholarshipValue,
  paymentGatewayValue,
  paymentkeyValue,
  paymentNameValue,
  showStatusValue,
  offlineValue,
  onlineValue,
  paymentList,
  index,
  setFieldValue,
  handleChange,
  handleRemovePayment,
  handleBlur,
  isFieldTouched,
  isFieldError,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const pushNotification = useToasterHook();
  return (
    <Grid sx={{ mb: 3 }} container spacing={3}>
        <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Payment Name"
          name={`payment_configurations.${index}.payment_name`}
          value={paymentNameValue}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.payment_name && Boolean(isFieldError?.payment_name)}
          helperText={isFieldTouched?.payment_name && isFieldError?.payment_name}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <TextField
          fullWidth
          required={true}
          label="Payment key"
          name={`payment_configurations.${index}.payment_key`}
          value={paymentkeyValue}
          onChange={handleChange}
          color="info"
          onBlur={handleBlur}
          error={isFieldTouched?.payment_key && Boolean(isFieldError?.payment_key)}
          helperText={isFieldTouched?.payment_key && isFieldError?.payment_key}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Allow Payment",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.allow_payment`
          }}
          value={allowPaymentValue}
          setFieldValue={setFieldValue}
          isFieldError={isFieldTouched?.allow_payment}
          isFieldTouched={isFieldTouched?.allow_payment}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Application Wise",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.application_wise`
          }}
          value={applicationWiseValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Apply Promo Voucher",
            options: ["true", "false"],
            required: true,
             name:`payment_configurations.${index}.apply_promo_voucher`
          }}
          value={promoVoucherValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Apply Scholarship",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.apply_scholarship`
          }}
          value={scholarshipValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Payment Gateway",
            options: paymentList(),
            // required: true,
            multiple:true,
            name:`payment_configurations.${index}.payment_gateway`
          }}
          value={paymentGatewayValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Show Status",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.show_status`
          }}
          value={showStatusValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "offline Mood",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.payment_mode.offline`
          }}
          value={offlineValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={3} sm={6} xs={12}>
        <SharedAutocomplete
          field={{
            label: "Online Mood",
            options: ["true", "false"],
            required: true,
            name:`payment_configurations.${index}.payment_mode.online`
          }}
          value={onlineValue}
          setFieldValue={setFieldValue}
        />
      </Grid>
      <Grid item md={2} sm={6} xs={12}>
        <Button
          endIcon={<DeleteOutlineOutlinedIcon />}
          size="large"
          color="error"
          fullWidth
          variant="outlined"
          onClick={() => setOpenDeleteDialog(true)}
        >
          Remove
        </Button>
      </Grid>
      {openDeleteDialog && (
        <DeleteDialogue
          openDeleteModal={openDeleteDialog}
          handleDeleteSingleTemplate={() => {
            pushNotification("success", "Payment is successfully deleted");
            setOpenDeleteDialog(false);
            handleRemovePayment(index);
          }}
          handleCloseDeleteModal={() => setOpenDeleteDialog(false)}
        />
      )}
    </Grid>
  );
};

export default PaymentDetails;
