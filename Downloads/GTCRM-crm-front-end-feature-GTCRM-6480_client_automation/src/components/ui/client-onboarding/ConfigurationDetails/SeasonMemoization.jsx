import { Box } from "@mui/material";
import React, { useCallback } from "react";
import AddLeadStageBtn from "../AdditionalDetails/AddLeadStageBtn";
import SeasonDetails from "./SeasonDetails";

const SeasonMemoization = ({
  arrayHelpers,
  formikValues,
  handleChange,
  setFieldValue,
  handleBlur,
  isFieldError,
  isFieldTouched,
  formik,
}) => {
  const handleAddNewSeason = useCallback(
    () =>
      arrayHelpers.push({
        season_name: "",
        start_date: "",
        end_date: "",
        database: {
          username: "",
          password: "",
          url: "",
          db_name: "",
        },
      }),
    []
  );
  const handleRemoveSeason = useCallback(
    (index) => arrayHelpers.remove(index),
    []
  );
  return (
    <Box>
      <AddLeadStageBtn
        handleAdd={handleAddNewSeason}
        btnText="Add Season"
        title="Seasons Details"
      />
      {formikValues?.seasons?.map((season, index) => (
        <SeasonDetails
          key={index}
          seasonNameValue={season?.season_name}
          seasonStartDate={season?.start_date}
          seasonEndDate={season?.end_date}
          databaseUserName={season?.database?.username}
          databasePassWord={season?.database?.password}
          databaseUrl={season?.database?.url}
          databaseDbName={season?.database?.db_name}
          index={index}
          setFieldValue={setFieldValue}
          handleChange={handleChange}
          handleRemoveSeason={handleRemoveSeason}
          handleBlur={handleBlur}
          isFieldTouched={{
            season_name: formik.touched?.seasons?.[index]?.season_name,
            start_date: formik.touched?.seasons?.[index]?.start_date,
            end_date: formik.touched?.seasons?.[index]?.end_date,
            database: {
              username: formik.touched?.seasons?.[index]?.database?.username,
              password: formik.touched?.seasons?.[index]?.database?.password,
              url: formik.touched?.seasons?.[index]?.database?.url,
              db_name: formik.touched?.seasons?.[index]?.database?.db_name,
            },
          }}
          isFieldError={{
            season_name: formik.errors?.seasons?.[index]?.season_name,
            start_date: formik.errors?.seasons?.[index]?.start_date,
            end_date: formik.errors?.seasons?.[index]?.end_date,
            database: {
              username: formik.errors?.seasons?.[index]?.database?.username,
              password: formik.errors?.seasons?.[index]?.database?.password,
              url: formik.errors?.seasons?.[index]?.database?.url,
              db_name: formik.errors?.seasons?.[index]?.database?.db_name,
            },
          }}
        />
      ))}
    </Box>
  );
};

export default SeasonMemoization;
