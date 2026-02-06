import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import ValidationActions from "./ValidationActions";
import BaseNotFoundLottieLoader from "../Loader/BaseNotFoundLottieLoader";

function ValidationDetailsTable({ validations, setValidations, currentField }) {
  return (
    <>
      {validations?.length > 0 ? (
        <TableContainer
          sx={{ my: 2 }}
          className="custom-scrollbar vertical-scrollbar"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Validation Type</TableCell>
                <TableCell>Validation Value</TableCell>
                <TableCell>Error Message</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validations.map((validation, index) => (
                <TableRow key={index}>
                  <TableCell>{validation?.type || "N/A"}</TableCell>
                  <TableCell>{validation?.value || "N/A"}</TableCell>
                  <TableCell>{validation?.error_message || "N/A"}</TableCell>
                  <TableCell>
                    <ValidationActions
                      validations={validations}
                      index={index}
                      setValidations={setValidations}
                      currentValidation={validation}
                      currentField={currentField}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ minHeight: "40vh" }} className="common-not-found-container">
          <BaseNotFoundLottieLoader height={200} width={200} />
        </Box>
      )}
    </>
  );
}

export default ValidationDetailsTable;
