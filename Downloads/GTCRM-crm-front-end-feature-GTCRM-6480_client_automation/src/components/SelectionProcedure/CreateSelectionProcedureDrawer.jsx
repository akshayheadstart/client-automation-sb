import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { eligibilityCriteriaList } from "../../constants/ListForSelectionProcedures";
import Error500Animation from "../shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { useContext } from "react";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
import WeightageAndParameter from "./WeightageAndParameter";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function CreateSelectionProcedureDrawer({
  openCreateSelectionProcedure,
  gdItems,
  setGdItems,
  piItems,
  setPiItems,
  courses,
  handleCreateSelectionProcedure,
  setSelectedProgram,
  setSelectedSpecialization,
  setSpecializations,
  specializations,
  selectedSpecialization,
  selectedMinimumQualification,
  setSelectedMinimumQualification,
  selectedOfferLetter,
  setSelectedOfferLetter,
  listOfApprovers,
  selectedAuthorizeApprover,
  setSelectedAuthorizeApprover,
  handleWeightageChangeForGd,
  handleWeightageChangeForPi,
  setGdOptionChecked,
  gdOptionChecked,
  piOptionChecked,
  setPiOptionChecked,
  gdTotalWeightage,
  setGdTotalWeightage,
  piTotalWeightage,
  setPiTotalWeightage,
  internalServerError,
  somethingWentWrong,
  handleCloseDrawer,
}) {
  const { apiResponseChangeMessage } = useContext(DashboradDataContext);

  const [openCreateParameterDialog, setOpenCreateParameterDialog] =
    useState(false);
  const [clickNext, setClickNext] = useState(false);
  const [gdOrPiBtnClicked, setGdOrPiBtnClicked] = useState("");

  const [parameterName, setParameterName] = useState("");
  const [weightageValue, setWeightageValue] = useState("");

  const handleCloseDialog = () => {
    setOpenCreateParameterDialog(false);
    setClickNext(false);
    setParameterName("");
    setWeightageValue("");
  };

  const handleParameterForm = (e) => {
    e.preventDefault();

    if (gdOrPiBtnClicked === "gd") {
      const newItem = {
        id: gdItems?.length + 1,
        parameter_name: parameterName,
        weightage_value: weightageValue,
      };

      const updatedGdItems = [...gdItems, newItem];
      setGdItems(updatedGdItems);

      const gdTotalWeightage = updatedGdItems?.reduce(
        (sum, parameter) =>
          sum +
          parseInt(
            Number.isNaN(parameter.weightage_value)
              ? 0
              : parameter.weightage_value
          ),
        0
      );

      setGdTotalWeightage(gdTotalWeightage);
      handleCloseDialog();
    }

    if (gdOrPiBtnClicked === "pi") {
      const newItem = {
        id: piItems?.length + 1,
        parameter_name: parameterName,
        weightage_value: weightageValue,
      };

      const updatedPiItems = [...gdItems, newItem];
      setPiItems(updatedPiItems);

      const piTotalWeightage = updatedPiItems?.reduce(
        (sum, parameter) =>
          sum +
          parseInt(
            Number.isNaN(parameter.weightage_value)
              ? 0
              : parameter.weightage_value
          ),
        0
      );

      setPiTotalWeightage(piTotalWeightage);
      handleCloseDialog();
    }
  };

  const handleChangeGdCheckBox = (event) => {
    setGdOptionChecked(event.target.checked);
    if (event.target.checked === false) {
      setPiOptionChecked(true);
    }
  };
  const handleChangePiCheckBox = (event) => {
    setPiOptionChecked(event.target.checked);
    if (event.target.checked === false) {
      setGdOptionChecked(true);
    }
  };

  const gdTotalWeightageCondition =
    Number.isNaN(gdTotalWeightage) ||
    gdTotalWeightage < 100 ||
    gdTotalWeightage > 100;

  const piTotalWeightageCondition =
    Number.isNaN(piTotalWeightage) ||
    piTotalWeightage < 100 ||
    piTotalWeightage > 100;

  const [gdParameterFieldWarning, setGdParameterFieldWarning] = useState("");
  const [piParameterFieldWarning, setPiParameterFieldWarning] = useState("");

  return (
    <Drawer
      anchor="right"
      onClose={handleCloseDrawer}
      open={openCreateSelectionProcedure}
      PaperProps={{ sx: { width: { xs: "100%", md: 820 } } }}
    >
      <Box
        sx={{ p: { md: 3, xs: 2 } }}
        className="create-selection-procedure-drawer"
      >
        {internalServerError || somethingWentWrong ? (
          <Box className="loading-animation-for-notification">
            {internalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
            {somethingWentWrong && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
          </Box>
        ) : (
          <form
            onSubmit={(event) => {
              handleCreateSelectionProcedure(event);
            }}
          >
            <Box className="create-selection-procedure-header">
              <Typography variant="h6">Create Selection Procedure</Typography>
              <IconButton onClick={() => handleCloseDrawer()}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box className="create-selection-step-title">
              <Typography variant="h6">Step 1</Typography>
              <Typography variant="body2">Select Program</Typography>
              <Box className="create-selection-step1-divider"></Box>
              <CloseIcon className="create-selection-step-close-icon" />
            </Box>
            <Box
              sx={{
                mt: 1,
                mb: 2,
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={courses}
                onChange={(_, newValue) => {
                  setSelectedProgram(newValue);
                  setSelectedSpecialization(null);
                  setSpecializations([]);
                }}
                sx={{ width: 240 }}
                renderInput={(params) => (
                  <TextField {...params} required label="Select Program" color="info"/>
                )}
              />

              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                getOptionLabel={(option) => option?.spec_name}
                options={specializations}
                value={selectedSpecialization}
                onChange={(_, newValue) => {
                  setSelectedSpecialization(newValue);
                }}
                sx={{ width: 240 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Select Specialization"
                    color="info"
                  />
                )}
              />
            </Box>
            <Box className="create-selection-step-title">
              <Typography variant="h6">Step 2</Typography>
              <Typography variant="body2">Eligibility Criteria</Typography>
              <Box className="create-selection-step2-divider"></Box>
              <CloseIcon className="create-selection-step-close-icon" />
            </Box>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Autocomplete
                multiple
                id="size-small-outlined-multi"
                size="small"
                options={eligibilityCriteriaList}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                )}
                style={{ width: 240 }}
                isOptionEqualToValue={(option, value) => option === value}
                value={selectedMinimumQualification}
                onChange={(_, newValue) =>
                  setSelectedMinimumQualification(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    required={
                      selectedMinimumQualification?.length === 0 ? true : false
                    }
                    {...params}
                    size="small"
                    label="Minimum Qualification"
                    color="info"
                  />
                )}
              />
            </Box>
            <Box className="create-selection-step-title">
              <Typography variant="h6">Step 3</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={gdOptionChecked}
                  onChange={handleChangeGdCheckBox}
                />
                <Typography variant="body2">
                  GD Parameters & Weightage
                </Typography>
              </Box>
              <Box className="create-selection-step3-divider"></Box>
              <CloseIcon className="create-selection-step-close-icon" />
            </Box>
            <Box>
              <WeightageAndParameter
                parameterItems={gdItems}
                totalWeightageCondition={gdTotalWeightageCondition}
                handleWeightageChange={handleWeightageChangeForGd}
                setParameterFieldWarning={setGdParameterFieldWarning}
                parameterFieldWarning={gdParameterFieldWarning}
                setOpenCreateParameterDialog={setOpenCreateParameterDialog}
                setGdOrPiBtnClicked={setGdOrPiBtnClicked}
                totalWeightage={gdTotalWeightage}
                from="gd"
              />
            </Box>
            <Box className="create-selection-step-title">
              <Typography variant="h6">Step 4</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={piOptionChecked}
                  onChange={handleChangePiCheckBox}
                />
                <Typography variant="body2">
                  PI Parameters & Weightage
                </Typography>
              </Box>
              <Box className="create-selection-step4-divider"></Box>
              <CloseIcon className="create-selection-step-close-icon" />
            </Box>
            <Box>
              <WeightageAndParameter
                parameterItems={piItems}
                totalWeightageCondition={piTotalWeightageCondition}
                handleWeightageChange={handleWeightageChangeForPi}
                setParameterFieldWarning={setPiParameterFieldWarning}
                parameterFieldWarning={piParameterFieldWarning}
                setOpenCreateParameterDialog={setOpenCreateParameterDialog}
                setGdOrPiBtnClicked={setGdOrPiBtnClicked}
                totalWeightage={piTotalWeightage}
                from="pi"
              />
            </Box>
            <Box className="create-selection-step-title">
              <Typography variant="h6">Step 5</Typography>
              <Typography variant="body2">Offer Letter</Typography>
              <Box className="create-selection-step5-divider"></Box>
              <CloseIcon className="create-selection-step-close-icon" />
            </Box>
            <Box
              sx={{
                mt: 1,
                mb: 4,
                display: "flex",
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                getOptionLabel={(option) => option}
                options={["Offer Letter 1", "Offer Letter 2"]}
                value={selectedOfferLetter}
                onChange={(_, newValue) => {
                  setSelectedOfferLetter(newValue);
                }}
                sx={{ width: 240 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Offer Letter Template"
                    color="info"
                  />
                )}
              />

              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                getOptionLabel={(option) => option?.fullName}
                options={listOfApprovers}
                value={selectedAuthorizeApprover}
                onChange={(_, newValue) => {
                  setSelectedAuthorizeApprover(newValue);
                }}
                sx={{ width: 240 }}
                renderInput={(params) => (
                  <TextField {...params} required label="Authorize Approver" color="info" />
                )}
              />
            </Box>

            {openCreateParameterDialog && (
              <Dialog
                open={openCreateParameterDialog}
                onClose={handleCloseDialog}
              >
                <DialogTitle id="alert-dialog-title">
                  Create Parameter
                </DialogTitle>
                <DialogContent sx={{ p: "0px 20px" }}>
                  {!clickNext && (
                    <TextField
                      required
                      autoFocus
                      margin="dense"
                      type="text"
                      sx={{ width: 300 }}
                      id="outlined-basic"
                      label="Enter Parameter Name"
                      variant="outlined"
                      onChange={(e) => setParameterName(e.target.value)}
                      color="info"
                    />
                  )}
                  {clickNext && (
                    <TextField
                      required
                      autoFocus
                      margin="dense"
                      type="number"
                      sx={{ width: 300 }}
                      id="outlined-basic"
                      label="Enter Weightage"
                      variant="outlined"
                      onChange={(e) => {
                        setWeightageValue(e.target.value);
                      }}
                      color="info"
                    />
                  )}
                </DialogContent>
                <DialogActions>
                  {!clickNext && (
                    <Button
                      disabled={parameterName?.length === 0 ? true : false}
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: 30, paddingX: 3 }}
                      color="info"
                      onClick={() => setClickNext(true)}
                    >
                      Next
                    </Button>
                  )}
                  {clickNext && (
                    <Button
                      type="submit"
                      variant="contained"
                      size="small"
                      sx={{ borderRadius: 30, paddingX: 3 }}
                      color="info"
                      onClick={handleParameterForm}
                      disabled={weightageValue?.length === 0 ? true : false}
                    >
                      Save
                    </Button>
                  )}
                  <Button
                    variant="text"
                    sx={{ borderRadius: 30, paddingX: 3 }}
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <button
                disabled={
                  gdTotalWeightageCondition ||
                  piTotalWeightageCondition ||
                  gdParameterFieldWarning ||
                  piParameterFieldWarning
                    ? true
                    : false
                }
                style={{
                  background:
                    (gdTotalWeightageCondition ||
                      piTotalWeightageCondition ||
                      gdParameterFieldWarning ||
                      piParameterFieldWarning) &&
                    "#BDBDBD",
                }}
                type="submit"
                className="create-selection-procedure-btn"
              >
                Submit
              </button>
            </Box>
          </form>
        )}
      </Box>
    </Drawer>
  );
}
