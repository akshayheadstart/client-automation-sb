import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useGetLeadBySearchMutation } from "../../../../Redux/Slices/telephonySlice";
import { useSelector } from "react-redux";
import { DashboradDataContext } from "../../../../store/contexts/DashboardDataContext";
import { handleSomethingWentWrong } from "../../../../utils/handleSomethingWentWrong";
import useToasterHook from "../../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../../utils/handleInternalServerError";
import Error500Animation from "../../../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../../../hooks/ErrorFallback";
import { telephonyDialogInputBoxWorkingKeys } from "../../../../constants/LeadStageList";

const SearchApplicationInputField = ({
  searchedApplication,
  setSearchedApplication,
  selectedApplication,
  setSelectedApplication,
}) => {
  const [searchText, setSearchText] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);
  const [isInternalServerError, setIsInternalServerError] = useState(false);
  const [isSomethingWentWrong, setIsSomethingWentWrong] = useState(false);

  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);

  const pushNotification = useToasterHook();
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const [getLeadBySearch] = useGetLeadBySearchMutation();
  const handleGetLeadBySearch = (searchText) => {
    setSearchLoading(true);

    getLeadBySearch({
      searchText,
      pageNumber: 1,
      pageSize: 20,
      collegeId,
    })
      .unwrap()
      .then((response) => {
        try {
          if (Array.isArray(response?.data)) {
            const modifiedSearchResults = response?.data?.map((result) => {
              return {
                program_name: `${result?.course_name} ${
                  result?.specialization?.length
                    ? `${
                        result?.specialization[0]?.length
                          ? `in ${result?.specialization[0]}`
                          : ""
                      }`
                    : ""
                } `,
                custom_application_id: result?.custom_application_id,
                application_id: result?.application_id,
                student_id: result?.student_id,
              };
            });
            setSearchedApplication(modifiedSearchResults);
          } else {
            throw new Error("Search API response has been changed.");
          }
        } catch (error) {
          setApiResponseChangeMessage(error);
          handleSomethingWentWrong(setIsSomethingWentWrong, "", 5000);
        }
      })
      .catch((error) => {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        } else {
          handleInternalServerError(setIsInternalServerError, "", 10000);
        }
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const handleOnKeyDown = (event) => {
    if (telephonyDialogInputBoxWorkingKeys.includes(event.key)) {
      return;
    }
    if (searchText?.length === 10 || isNaN(event.key)) {
      event.preventDefault();
    }
  };
  return (
    <>
      {isInternalServerError || isSomethingWentWrong ? (
        <Box sx={{ minHeight: "20vh" }} className="common-not-found-container">
          {isInternalServerError && (
            <Error500Animation height={200} width={200}></Error500Animation>
          )}
          {isSomethingWentWrong && (
            <ErrorFallback
              error={apiResponseChangeMessage}
              resetErrorBoundary={() => window.location.reload()}
            />
          )}
        </Box>
      ) : (
        <Autocomplete
          onInputChange={(...args) => {
            const [, , reason] = args;
            if (reason === "clear") {
              setSearchText("");
            }
          }}
          value={selectedApplication?.program_name ? selectedApplication : null}
          loading={searchLoading}
          onChange={(_, value) => {
            setSelectedApplication(value);
            setSearchText("");
          }}
          freeSolo
          options={searchedApplication}
          getOptionLabel={(option) => option?.program_name}
          renderOption={(props, option) => (
            <li
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              {...props}
            >
              <Typography className="telephony-select-application  telephony-select-option">
                {option.program_name}
              </Typography>{" "}
              <Typography
                className="telephony-select-option"
                sx={{ color: "rgba(9, 44, 76, 0.80)" }}
              >
                {option.custom_application_id}
              </Typography>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              color="info"
              onKeyDown={handleOnKeyDown}
              onChange={(event) => {
                if (event.target.value?.length === 10) {
                  handleGetLeadBySearch(event.target.value);
                }
                setSearchText(event.target.value);
              }}
              required
              {...params}
              inputProps={{
                ...params.inputProps,
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.stopPropagation();
                  }
                },
              }}
              label="Application Details"
              helperText="Search through mobile number"
            />
          )}
          filterOptions={(options) => options}
        />
      )}
    </>
  );
};

export default SearchApplicationInputField;
