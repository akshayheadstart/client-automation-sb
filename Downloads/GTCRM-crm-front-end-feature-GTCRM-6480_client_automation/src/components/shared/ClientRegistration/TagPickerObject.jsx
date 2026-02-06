import {
  Autocomplete,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Button } from "rsuite";

const TagPickerObject = ({
  options,
  setOptions,
  helpText,
  label,
  preventLimit = 20,
  preview,
}) => {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [optionsValue, setOptionsValue] = useState([]);

  const handleCourseOptions = (lateralValue) => {
    const updatedOptions = optionsValue.map((item, index) =>
      typeof item === "string"
        ? { spec_name: item, lateral: lateralValue, id: index }
        : item
    );
    setOptions(updatedOptions);
    setOpenDialogue(false);
  };

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Autocomplete
        multiple
        options={options}
        value={options}
        getOptionLabel={(option) => option?.spec_name}
        freeSolo
        autoHighlight={true}
        readOnly={preview ? true : false}
        renderTags={(_, getTagProps) =>
          options.map((option, index) => (
            <Chip
              key={index}
              variant="outlined"
              label={option?.spec_name}
              {...getTagProps({ index })}
            />
          ))
        }
        onChange={(_, newValue) => {
          if (newValue?.length < options?.length) {
            setOptions(newValue);
          } else {
            setOptionsValue(newValue);
            setOpenDialogue(true);
          }
        }}
        renderInput={(params) => (
          <TextField
            multiline
            onKeyDown={(e) =>
              options.length === preventLimit && e.preventDefault()
            }
            {...params}
            label={label}
            color="info"
          />
        )}
      />
      <FormHelperText sx={{ color: "#ffcc00" }}> {helpText}</FormHelperText>
      <Dialog
        open={openDialogue}
        onClose={() => setOpenDialogue(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Is it a lateral entry?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            For the lateral program, we ask users to fill in their diploma
            details in the educational steps
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ gap: "5px", mr: 1, mb: 1 }}>
          <Button onClick={() => handleCourseOptions(false)}>No</Button>
          <Button
            appearance="primary"
            onClick={() => handleCourseOptions(true)}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TagPickerObject;
