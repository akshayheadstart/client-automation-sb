import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import NextAndBackButton from "./NextAndBackButton";
import FormRadioField from "./FormRadioField";
import ClientRegTextField from "./ClientRegTextField";
import BaseNotFoundLottieLoader from "../Loader/BaseNotFoundLottieLoader";

const CoursePreferenceAndFeesRules = ({
  preview,
  handleClientRegistration,
  setOpenDetailsDialog,
  setTitleOfDialog,
  handleBack,
  setNeedCoursePreference,
  needCoursePreference,
  preferenceCount,
  setPreferenceCount,
  preferenceAndFeesCalculation,
  setPreferenceAndFeesCalculation,
  setAdditionalFeesRules,
  additionalFeesRules,
  feeLimit,
  setFeeLimit,
  multipleApplicationMode,
  setMultipleApplicationMode,
}) => {
  useEffect(() => {
    let preferenceArray = [];
    for (let index = 2; index <= preferenceCount; index++) {
      preferenceArray.push({
        trigger_count: index,
        amount: additionalFeesRules[index - 2]?.amount
          ? additionalFeesRules[index - 2]?.amount
          : 0,
      });
    }
    setAdditionalFeesRules([...preferenceArray]);
  }, [preferenceCount]);
  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Manage Preference & Fee's</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item md={12} sm={12} xs={12} sx={{ mb: -3 }}>
            <FormRadioField
              value={needCoursePreference}
              setValue={setNeedCoursePreference}
              label="Do you want preference based system?"
              preview={preview}
              reset={() => setPreferenceCount(2)}
            />
          </Grid>

          {needCoursePreference && (
            <Grid item md={6} sm={6} xs={12}>
              <ClientRegTextField
                value={preferenceCount}
                setValue={setPreferenceCount}
                label="How many preference You want"
                type="number"
                preview={preview}
                required={needCoursePreference ? true : false}
              />
            </Grid>
          )}
          <Grid item md={12} sm={12} xs={12} sx={{ mb: -3 }}>
            <FormRadioField
              value={multipleApplicationMode}
              setValue={setMultipleApplicationMode}
              label="Will Student able to create Multiple Application?"
              preview={preview}
            />
          </Grid>

          <Grid item md={6} sm={6} xs={12}>
            <ClientRegTextField
              value={feeLimit}
              setValue={setFeeLimit}
              label="Enter Maximum fee Limit"
              type="number"
              preview={preview}
            />
          </Grid>
        </Grid>
        <Box sx={{ mb: 2, mt: 4 }}>
          <Typography variant="h6">Base Fees</Typography>
        </Box>
        <TableContainer
          component={Paper}
          className="custom-scrollbar"
          sx={{ maxWidth: "700px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Course Name</TableCell>
                <TableCell align="center">Specialization Name</TableCell>
                <TableCell align="center">Fees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(preferenceAndFeesCalculation?.base_fees).map(
                ([courseName, specs]) =>
                  Object.entries(specs).map(([specName, fee], index) => (
                    <TableRow key={`${courseName}-${specName}`}>
                      <TableCell>{courseName}</TableCell>
                      <TableCell align="center">{specName}</TableCell>
                      <TableCell align="right">
                        <TextField
                          sx={{ mt: 0.5 }}
                          defaultValue={fee}
                          color="info"
                          size="small"
                          value={fee}
                          onChange={(event) => {
                            setPreferenceAndFeesCalculation((prevData) => {
                              return {
                                ...prevData,
                                base_fees: {
                                  ...prevData?.base_fees,
                                  [courseName]: {
                                    ...prevData?.base_fees[courseName],
                                    [specName]: event.target.value,
                                  },
                                },
                              };
                            });
                          }}
                          InputProps={{
                            readOnly: preview,
                          }}
                          label="Enter fees"
                          type="number"
                          required={true}
                          fullWidth
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {Object?.entries(preferenceAndFeesCalculation?.base_fees).length >
          0 || (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              minHeight: "300px",
              alignItems: "center",
              maxWidth: "700px",
            }}
          >
            <BaseNotFoundLottieLoader
              height={250}
              width={150}
            ></BaseNotFoundLottieLoader>
          </Box>
        )}

        <Box sx={{ mb: 2, mt: 4 }}>
          <Typography variant="h6">Additional Preference Fees</Typography>
        </Box>

        <TableContainer
          component={Paper}
          className="custom-scrollbar"
          sx={{ maxWidth: "500px" }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Trigger Count</TableCell>
                <TableCell align="center">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {additionalFeesRules.map((item, index) => (
                <TableRow>
                  <TableCell align="center">
                    Trigger Count {item.trigger_count}
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      sx={{ mt: 0.5 }}
                      defaultValue={item?.amount}
                      color="info"
                      size="small"
                      value={additionalFeesRules[index].amount}
                      onChange={(event) => {
                        const previousValue = additionalFeesRules;
                        previousValue[index] = {
                          ...previousValue[index],
                          amount: event.target.value,
                        };
                        setAdditionalFeesRules([...previousValue]);
                      }}
                      InputProps={{
                        readOnly: preview,
                      }}
                      label="Enter fees"
                      type="number"
                      required={true}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {!preview && (
        <NextAndBackButton
          setOpenDetailsDialog={setOpenDetailsDialog}
          setTitleOfDialog={setTitleOfDialog}
          handleBack={handleBack}
          handleClientRegistration={handleClientRegistration}
        />
      )}
    </>
  );
};

export default CoursePreferenceAndFeesRules;
