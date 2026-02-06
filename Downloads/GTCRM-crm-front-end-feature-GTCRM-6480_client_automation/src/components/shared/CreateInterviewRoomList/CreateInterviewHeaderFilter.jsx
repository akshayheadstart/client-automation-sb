import { Grid, TextField, Typography } from "@mui/material";
import React from "react";
import SelectOption from "../SelectedStudent/SelectOption";
import { Box } from "@mui/system";

const CreateInterviewHeaderFilter = ({ listOfSchools, headerFieldsStates }) => {
  return (
    <>
      <Box className="create-interview-room-inner">
        <Typography>
          Please fill the below fields to cerate the Interview Room.
        </Typography>
        <Box>
          <Grid container spacing={3}>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <SelectOption
                required={true}
                label="Select School"
                size="small"
                value={headerFieldsStates.selectedSchool}
                options={Object.keys(listOfSchools)}
                getOptionLabel={(option) =>
                  option === "null" ? "No School" : option
                }
                onChange={(_, newValue) => {
                  headerFieldsStates.setSelectedSchool(newValue);
                  headerFieldsStates.setSelectedProgram(null);
                  headerFieldsStates.setSelectedSpecialization(null);
                }}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <SelectOption
                required={true}
                label="Select Program"
                size="small"
                value={headerFieldsStates.selectedProgram}
                options={listOfSchools[headerFieldsStates.selectedSchool]}
                getOptionLabel={(option) => option?.course_name}
                onChange={(_, newValue) => {
                  headerFieldsStates.setSelectedProgram(newValue);
                  headerFieldsStates.setSelectedSpecialization(null);
                }}
              />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <SelectOption
                required={true}
                label="Specialization"
                size="small"
                options={
                  headerFieldsStates.selectedProgram?.course_specialization
                }
                getOptionLabel={(option) =>
                  option?.spec_name ? option?.spec_name : "No Specialization"
                }
                onChange={(_, newValue) =>
                  headerFieldsStates.setSelectedSpecialization(newValue)
                }
                value={headerFieldsStates.selectedSpecialization}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <TextField
                fullWidth
                required
                label="List Name"
                size="small"
                onChange={(event) =>
                  headerFieldsStates.setListName(event.target.value)
                }
                value={headerFieldsStates.listName}
                sx={{
                  "& label": {
                    color: "white !important",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "& fieldset": {
                      borderColor: "white !important",
                      color: "white !important",
                    },
                  },
                }}
              ></TextField>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <SelectOption
                required={true}
                label="Moderator"
                size="small"
                getOptionLabel={(option) =>
                  `${option.first_name} ${option.middle_name} ${option.last_name}`
                }
                options={headerFieldsStates.listOfModerators}
                onChange={(_, newValue) =>
                  headerFieldsStates.setSelectedModerator(newValue)
                }
              />
            </Grid>

            <Grid item lg={12} md={12} sm={12} xs={12}>
              <TextField
                multiline
                fullWidth
                label="Description"
                size="small"
                onChange={(event) =>
                  headerFieldsStates.setDescriptions(event.target.value)
                }
                value={headerFieldsStates.descriptions}
                sx={{
                  "& label": {
                    color: "white !important",
                  },
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "white",
                    },
                    "& fieldset": {
                      borderColor: "white !important",
                      color: "white !important",
                    },
                  },
                }}
              ></TextField>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default CreateInterviewHeaderFilter;
