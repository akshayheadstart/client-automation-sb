import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import React from "react";
import { tagsValidation } from "../../../utils/validation";
import { useSelector } from "react-redux";

const TagAutoComplete = ({
  tags,
  allTags,
  setAllGetTags,
  errorTagField,
  setErrorTagField,
  setCallAPI,
  label,
  from,
  className = "",
  width = "100%",
  setCallTemplateTagApi,
}) => {
  const isLoading = useSelector((state) => state?.template?.loading);
  return (
    <Autocomplete
      onOpen={() => setCallTemplateTagApi(true)}
      loading={true}
      className={`search-by-tags-field ${className}`}
      defaultValue={allTags}
      value={allTags}
      sx={{
        mt: from === "sms" || from === "whatsapp" ? 0 : 3,
        "& .MuiAutocomplete-tag": {
          backgroundColor: "#5048E5",
          color: "#fff",
        },
        "& .MuiAutocomplete-tag .MuiChip-deleteIcon": {
          color: "#fff",
        },
      }}
      multiple
      size="small"
      id="tags-filled"
      options={tags}
      onChange={(event, newValue) => {
        setAllGetTags(newValue);
        setCallAPI && setCallAPI(true);
      }}
      freeSolo
      renderInput={(params) => (
        <TextField
          sx={{
            width:
              from === "sms" ? "100%" : from === "whatsapp" ? "100%" : width,
          }}
          {...params}
          helperText={errorTagField}
          error={errorTagField}
          onKeyDown={(e) => {
            if (tagsValidation(e)) {
              setErrorTagField("");
            } else {
              setErrorTagField("Only characters and numbers are allowed");
              e.preventDefault();
            }
          }}
          color="info"
          label={label}
          InputProps={{
            ...params?.InputProps,

            endAdornment: (
              <React.Fragment>
                {isLoading ? <CircularProgress color="info" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
            classes: {
              root: "tm-input-root",
              notchedOutline: "tm-notched-outline",
            },
          }}
          InputLabelProps={{
            ...params?.InputLabelProps,
            sx: {
              color: "#8E8E93",
              fontSize: "12px",
              fontWeight: 400,
              top: "2px",
              "&.Mui-focused": {
                color: "#3498ff",
              },
            },
          }}
        />
      )}
    />
  );
};

export default TagAutoComplete;
