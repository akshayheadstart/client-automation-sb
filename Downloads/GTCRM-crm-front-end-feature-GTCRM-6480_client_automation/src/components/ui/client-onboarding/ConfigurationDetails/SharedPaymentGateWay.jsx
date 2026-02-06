import React from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
} from "@mui/material";

const SharedPaymentGateway = ({
  state,
  setState,
  paymentGateways,
  sectionTitle,
  formik,
}) => {
  const handleChange = (event) => {
    const resetFields = [
      "preferred_payment_gateway",
    ];
  
    resetFields.forEach((field) => {
      formik.setFieldValue(field, "");  
      formik.setFieldTouched(field, false);
      formik.setFieldError(field, undefined);
    });
    formik.setFieldValue("payment_configurations[0].payment_gateway", []);
    formik.setFieldTouched("payment_configurations[0].payment_gateway", false);
    formik.setFieldError(
      "payment_configurations[0].payment_gateway",
      undefined
    );
    const { name, checked } = event.target;
    setState((prevState) => {
      const checkedCount = Object.values(prevState).filter(Boolean).length;
      if (!checked && checkedCount === 1 && prevState[name]) {
        return prevState;
      }

      return {
        ...prevState,
        [name]: checked,
      };
    });
  };

  return (
    <Grid item md={12}>
      <FormControl component="fieldset" variant="standard" sx={{ my: 3 }}>
        <FormLabel component="legend" color="info">
          {sectionTitle}
        </FormLabel>
        <FormGroup row>
          {paymentGateways.map((gateway) => (
            <FormControlLabel
              key={gateway.name}
              control={
                <Checkbox
                  checked={!!state[gateway.name]}
                  onChange={handleChange}
                  name={gateway.name}
                  color="info"
                />
              }
              label={gateway.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Grid>
  );
};

export default SharedPaymentGateway;
