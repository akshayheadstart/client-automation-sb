import { Box } from "@mui/material";
import React from "react";

export const PaymentStatus = ({ rowData }) => {
  const { payment_status } = rowData || {};

  return (
    <Box
      className={`${
        payment_status?.length ? payment_status?.toLowerCase() : ""
      } status`}
    >
      {payment_status ? payment_status : `– –`}
    </Box>
  );
};
