import { Box } from "@mui/material";
import React, { useCallback } from "react";
import AddLeadStageBtn from "../AdditionalDetails/AddLeadStageBtn";
import PaymentDetails from "./PaymentDetails";

const PaymentMemoization = ({
  arrayHelpers,
  formikValues,
  handleChange,
  setFieldValue,
  handleBlur,
  isFieldError,
  isFieldTouched,
  getEnabledGateways,
  formik,
}) => {
  const handleAddNewPayment = useCallback(
    () =>
      arrayHelpers.push({
        allow_payment: "",
        application_wise: "",
        apply_promo_voucher: "",
        apply_scholarship: "",
        payment_gateway: [],
        payment_key: "",
        payment_mode: {
          offline: "",
          online: "",
        },
        payment_name: "",
        show_status: "",
      }),
    []
  );
  const handleRemovePayment = useCallback(
    (index) => arrayHelpers.remove(index),
    []
  );
  return (
    <Box>
      <AddLeadStageBtn
        handleAdd={handleAddNewPayment}
        btnText="Add Payment"
        title="Payment Details"
      />
      {formikValues?.payment_configurations?.map((payment, index) => (
        <PaymentDetails
          key={index}
          allowPaymentValue={payment?.allow_payment}
          applicationWiseValue={payment?.application_wise}
          promoVoucherValue={payment?.apply_promo_voucher}
          scholarshipValue={payment?.apply_scholarship}
          paymentGatewayValue={payment?.payment_gateway}
          paymentkeyValue={payment?.payment_key}
          paymentNameValue={payment?.payment_name}
          showStatusValue={payment?.show_status}
          offlineValue={payment?.payment_mode?.offline}
          onlineValue={payment?.payment_mode?.online}
          paymentList={getEnabledGateways}
          index={index}
          setFieldValue={setFieldValue}
          handleChange={handleChange}
          handleRemovePayment={handleRemovePayment}
          handleBlur={handleBlur}
          isFieldTouched={{
            payment_name: formik.touched?.payment_configurations?.[index]?.payment_name,
            payment_key: formik.touched?.payment_configurations?.[index]?.payment_key,
            allow_payment: formik.touched?.payment_configurations?.[index]?.allow_payment,
          }}
          isFieldError={{
            payment_name: formik.errors?.payment_configurations?.[index]?.payment_name,
            payment_key: formik.errors?.payment_configurations?.[index]?.payment_key,
            allow_payment: formik.errors?.payment_configurations?.[index]?.allow_payment,
          }}
        />
      ))}
    </Box>
  );
};

export default PaymentMemoization;
