import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  Drawer,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { eligibilityCriteriaList } from "../../constants/ListForSelectionProcedures";
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function ViewSelectionProcedureDrawer({
  openViewSelectionProcedure,
  gdItems,
  piItems,
  selectionProcedureData,
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
  setGdItems,
  setPiItems,
  editSelectionProcedure,
  handleCloseViewSelectionDrawer,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // Convert the object back to an array with the specified format
  const gdList =
    selectionProcedureData?.gd_parameters_weightage &&
    Object.entries(selectionProcedureData?.gd_parameters_weightage).map(
      ([key, value]) => ({
        parameter_name:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        weightage_value: value,
      })
    );

  const piList =
    selectionProcedureData?.pi_parameters_weightage &&
    Object.entries(selectionProcedureData?.pi_parameters_weightage).map(
      ([key, value]) => ({
        parameter_name:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
        weightage_value: value,
      })
    );

  useEffect(() => {
    setSelectedProgram(selectionProcedureData?.course_name);
    setSelectedSpecialization({
      spec_name: selectionProcedureData?.specialization_name,
    });
    setSelectedMinimumQualification(
      selectionProcedureData?.eligibility_criteria?.minimum_qualification
    );
    setGdItems(gdList);
    setPiItems(piList);
    setSelectedOfferLetter(selectionProcedureData?.offer_letter?.template);
    setSelectedAuthorizeApprover(
      selectionProcedureData?.offer_letter?.authorized_approver_name
        ? {
            fullName:
              selectionProcedureData?.offer_letter?.authorized_approver_name,
            id: selectionProcedureData?.offer_letter?.authorized_approver,
          }
        : null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionProcedureData]);

  const [totalWeightageValueForGd, setTotalWeightageValueForGd] = useState(0);
  const [totalWeightageValueForPi, setTotalWeightageValueForPi] = useState(0);

  // Calculate the total weightage value using reduce
  useEffect(() => {
    const gdTotalWeightage = gdItems?.reduce(
      (sum, parameter) =>
        sum +
        parseInt(
          Number.isNaN(parameter.weightage_value)
            ? 0
            : parameter.weightage_value
        ),
      0
    );
    const piTotalWeightage = piItems?.reduce(
      (sum, parameter) =>
        sum +
        parseInt(
          Number.isNaN(parameter.weightage_value)
            ? 0
            : parameter.weightage_value
        ),
      0
    );

    setTotalWeightageValueForGd(gdTotalWeightage);
    setTotalWeightageValueForPi(piTotalWeightage);
  }, [gdItems, piItems]);

  const gdTotalWeightageCondition =
    Number.isNaN(totalWeightageValueForGd) ||
    totalWeightageValueForGd < 100 ||
    totalWeightageValueForGd > 100;

  const piTotalWeightageCondition =
    Number.isNaN(totalWeightageValueForPi) ||
    totalWeightageValueForPi < 100 ||
    totalWeightageValueForPi > 100;

  return (
    <Drawer
      anchor="right"
      onClose={handleCloseViewSelectionDrawer}
      open={openViewSelectionProcedure}
      PaperProps={{ sx: { width: { xs: "100%", md: 1000 } } }}
    >
      <Box
        sx={{ p: { md: 3, xs: 2 } }}
        className="create-selection-procedure-drawer"
      >
        <Box sx={{ mb: 12 }}>
          <Box className="view-selection-procedure-header">
            <Typography variant="h6">Selection Procedure</Typography>
            <IconButton onClick={() => handleCloseViewSelectionDrawer()}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1">
            {selectionProcedureData?.course_name}-
            {selectionProcedureData?.specialization_name}
          </Typography>
        </Box>
        <form
          onSubmit={(event) => {
            handleCreateSelectionProcedure(
              event,
              selectionProcedureData?.procedure_id
            );
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: { md: "space-between", xs: "center" },
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: "60px" },
            }}
          >
            <Box className="custom-box program-selection-box">
              <label className="custom-label">Program Selection</label>
              <Box className="custom-input">
                <Box className="view-selection-step-no">1</Box>
                <Box className="selection-procedure-view-box">
                  <Autocomplete
                    readOnly={editSelectionProcedure ? false : true}
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    options={courses}
                    defaultValue={selectionProcedureData?.course_name}
                    onChange={(_, newValue) => {
                      setSelectedProgram(newValue);
                      setSelectedSpecialization(null);
                      setSpecializations([]);
                    }}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} required label="Select Program" color="info"/>
                    )}
                  />
                  <Autocomplete
                    readOnly={editSelectionProcedure ? false : true}
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option?.spec_name}
                    options={specializations}
                    value={selectedSpecialization}
                    onChange={(_, newValue) => {
                      setSelectedSpecialization(newValue);
                    }}
                    sx={{ width: 300 }}
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
              </Box>
            </Box>

            <Box className="custom-box eligibility-box">
              <label className="custom-label">Eligibility Criteria</label>
              <Box className="custom-input">
                <Box className="view-selection-step-no">2</Box>
                <Box className="selection-procedure-view-box">
                  <Autocomplete
                    readOnly={editSelectionProcedure ? false : true}
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
                    style={{ width: 350 }}
                    isOptionEqualToValue={(option, value) => option === value}
                    value={selectedMinimumQualification}
                    onChange={(_, newValue) =>
                      setSelectedMinimumQualification(newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        required={
                          selectedMinimumQualification?.length === 0
                            ? true
                            : false
                        }
                        {...params}
                        size="small"
                        label="Minimum Qualification"
                        color="info"
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { md: "space-between", xs: "center" },
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: "60px" },
              my: 10,
            }}
          >
            {fullScreen ? (
              <>
                <Box className="custom-box group-discussion-box">
                  <label className="custom-label">Group Discussion</label>
                  <Box className="custom-input">
                    <Box className="view-selection-step-no">3</Box>
                    {gdItems?.length ? (
                      <>
                        {editSelectionProcedure && (
                          <Alert severity="info" sx={{ py: 0, mt: 1 }}>
                            You can only edit weightage value
                          </Alert>
                        )}
                        <Grid
                          container
                          spacing={2}
                          sx={{
                            my: 2,
                            justifyContent: { xs: "center" },
                          }}
                        >
                          {gdItems?.map((item, index) => (
                            <Grid key={item} item md={6}>
                              <TextField
                                error={gdTotalWeightageCondition ? true : false}
                                required
                                type="number"
                                size="small"
                                id="outlined-basic"
                                label={item?.parameter_name}
                                variant="outlined"
                                defaultValue={item?.weightage_value}
                                value={item?.weightage_value}
                                onWheel={(e) => e.target.blur()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    (value > 0 && value <= 100)
                                  ) {
                                    handleWeightageChangeForGd(
                                      index,
                                      value,
                                      item?.parameter_name
                                    );
                                  }
                                }}
                                InputProps={{
                                  readOnly: editSelectionProcedure
                                    ? false
                                    : true,
                                }}
                                color="info"
                              />
                            </Grid>
                          ))}
                        </Grid>
                        <Box
                          className="selection-procedure-total-weightage-box"
                          sx={{
                            justifyContent:
                              gdTotalWeightageCondition && "space-between",
                          }}
                        >
                          {gdTotalWeightageCondition && (
                            <FormHelperText
                              sx={{ color: "#ffa117" }}
                              variant="subtitle1"
                            >
                              Total weightage must be 100
                            </FormHelperText>
                          )}
                          <TextField
                            inputProps={{
                              readOnly: true,
                            }}
                            autoFocus
                            value={`${
                              totalWeightageValueForGd
                                ? totalWeightageValueForGd
                                : 0
                            } | 100`}
                            size="small"
                            id="outlined-basic"
                            label="Total Weightage"
                            variant="outlined"
                            sx={{ width: 150 }}
                            color="info"
                          />
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "Center",
                          height: "355px",
                        }}
                      >
                        <Typography>N/A</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box className="custom-box personal-interview-box">
                  <label className="custom-label">Personal Interview</label>
                  <Box className="custom-input">
                    <Box className="view-selection-step-no">4</Box>
                    {piItems?.length ? (
                      <>
                        {editSelectionProcedure && (
                          <Alert severity="info" sx={{ py: 0, mt: 1 }}>
                            You can only edit weightage value
                          </Alert>
                        )}
                        <Grid
                          container
                          spacing={2}
                          sx={{ my: 2, justifyContent: { xs: "center" } }}
                        >
                          {piItems?.map((item, index) => (
                            <Grid key={item} item md={6}>
                              <TextField
                                error={piTotalWeightageCondition ? true : false}
                                required
                                type="number"
                                size="small"
                                id="outlined-basic"
                                label={item?.parameter_name}
                                variant="outlined"
                                defaultValue={item?.weightage_value}
                                value={item?.weightage_value}
                                onWheel={(e) => e.target.blur()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    (value > 0 && value <= 100)
                                  ) {
                                    handleWeightageChangeForPi(
                                      index,
                                      value,
                                      item?.parameter_name
                                    );
                                  }
                                }}
                                color="info"
                                InputProps={{
                                  readOnly: editSelectionProcedure
                                    ? false
                                    : true,
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        <Box
                          className="selection-procedure-total-weightage-box"
                          sx={{
                            justifyContent:
                              piTotalWeightageCondition && "space-between",
                          }}
                        >
                          {piTotalWeightageCondition && (
                            <FormHelperText
                              sx={{ color: "#ffa117" }}
                              variant="subtitle1"
                            >
                              Total weightage must be 100
                            </FormHelperText>
                          )}
                          <TextField
                            autoFocus
                            value={`${
                              totalWeightageValueForPi
                                ? totalWeightageValueForPi
                                : 0
                            } | 100`}
                            size="small"
                            id="outlined-basic"
                            label="Total Weightage"
                            variant="outlined"
                            sx={{ width: 150 }}
                            InputProps={{
                              readOnly: true,
                            }}
                            color="info"
                          />
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "Center",
                          height: "355px",
                        }}
                      >
                        <Typography>N/A</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box className="custom-box personal-interview-box">
                  <label className="custom-label">Personal Interview</label>
                  <Box
                    className="custom-input"
                    sx={{
                      minHeight: "375px",
                    }}
                    s
                  >
                    <Box className="view-selection-step-no">4</Box>
                    {piItems?.length ? (
                      <>
                        {editSelectionProcedure && (
                          <Alert severity="info" sx={{ py: 0, mt: 1 }}>
                            You can only edit weightage value
                          </Alert>
                        )}
                        <Grid container spacing={2} sx={{ my: 2 }}>
                          {piItems?.map((item, index) => (
                            <Grid key={item} item md={6}>
                              <TextField
                                error={piTotalWeightageCondition ? true : false}
                                required
                                type="number"
                                size="small"
                                id="outlined-basic"
                                label={item?.parameter_name}
                                variant="outlined"
                                defaultValue={item?.weightage_value}
                                value={item?.weightage_value}
                                onWheel={(e) => e.target.blur()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    (value > 0 && value <= 100)
                                  ) {
                                    handleWeightageChangeForPi(
                                      index,
                                      value,
                                      item?.parameter_name
                                    );
                                  }
                                }}
                                InputProps={{
                                  readOnly: editSelectionProcedure
                                    ? false
                                    : true,
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                        <Box
                          className="selection-procedure-total-weightage-box"
                          sx={{
                            justifyContent:
                              piTotalWeightageCondition && "space-between",
                          }}
                        >
                          {piTotalWeightageCondition && (
                            <FormHelperText
                              sx={{ color: "#ffa117" }}
                              variant="subtitle1"
                            >
                              Total weightage must be 100
                            </FormHelperText>
                          )}
                          <TextField
                            autoFocus
                            value={`${
                              totalWeightageValueForPi
                                ? totalWeightageValueForPi
                                : 0
                            } | 100`}
                            size="small"
                            id="outlined-basic"
                            label="Total Weightage"
                            variant="outlined"
                            sx={{ width: 150 }}
                            InputProps={{
                              readOnly: true,
                            }}
                            color="info"
                          />
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "Center",
                          height: "355px",
                        }}
                      >
                        <Typography>N/A</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box className="custom-box group-discussion-box">
                  <label className="custom-label">Group Discussion</label>
                  <Box
                    className="custom-input"
                    sx={{
                      minHeight: "375px",
                    }}
                  >
                    <Box className="view-selection-step-no">3</Box>
                    {gdItems?.length ? (
                      <>
                        {editSelectionProcedure && (
                          <Alert severity="info" sx={{ py: 0, mt: 1 }}>
                            You can only edit weightage value
                          </Alert>
                        )}
                        <Grid container spacing={2} sx={{ my: 2 }}>
                          {gdItems?.map((item, index) => (
                            <Grid key={item} item md={6}>
                              <TextField
                                error={gdTotalWeightageCondition ? true : false}
                                required
                                type="number"
                                size="small"
                                id="outlined-basic"
                                label={item?.parameter_name}
                                variant="outlined"
                                defaultValue={item?.weightage_value}
                                value={item?.weightage_value}
                                onWheel={(e) => e.target.blur()}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (
                                    value === "" ||
                                    (value > 0 && value <= 100)
                                  ) {
                                    handleWeightageChangeForGd(
                                      index,
                                      value,
                                      item?.parameter_name
                                    );
                                  }
                                }}
                                InputProps={{
                                  readOnly: editSelectionProcedure
                                    ? false
                                    : true,
                                }}
                                color="info"
                              />
                            </Grid>
                          ))}
                        </Grid>

                        <Box
                          className="selection-procedure-total-weightage-box"
                          sx={{
                            justifyContent:
                              gdTotalWeightageCondition && "space-between",
                          }}
                        >
                          {gdTotalWeightageCondition && (
                            <FormHelperText
                              sx={{ color: "#ffa117" }}
                              variant="subtitle1"
                            >
                              Total weightage must be 100
                            </FormHelperText>
                          )}
                          <TextField
                            autoFocus
                            value={`${
                              totalWeightageValueForGd
                                ? totalWeightageValueForGd
                                : 0
                            } | 100`}
                            size="small"
                            id="outlined-basic"
                            label="Total Weightage"
                            variant="outlined"
                            sx={{ width: 150 }}
                            InputProps={{
                              readOnly: true,
                            }}
                            color="info"
                          />
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "Center",
                          height: "355px",
                        }}
                      >
                        <Typography>N/A</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "center", md: "flex-start" },
              alignItems: "center",
            }}
          >
            <Box className="custom-box">
              <label className="custom-label">Offer Letter</label>
              <Box className="custom-input">
                <Box className="view-selection-step-no">5</Box>
                <Box className="selection-procedure-view-box">
                  <Autocomplete
                    readOnly={editSelectionProcedure ? false : true}
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(option) => option}
                    options={["Offer Letter 1", "Offer Letter 2"]}
                    value={selectedOfferLetter}
                    onChange={(_, newValue) => {
                      setSelectedOfferLetter(newValue);
                    }}
                    sx={{ width: 300 }}
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
                    readOnly={editSelectionProcedure ? false : true}
                    size="small"
                    disablePortal
                    id="combo-box-demo"
                    sx={{ width: 300 }}
                    getOptionLabel={(option) => option?.fullName}
                    options={listOfApprovers}
                    value={selectedAuthorizeApprover}
                    onChange={(_, newValue) => {
                      setSelectedAuthorizeApprover(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Authorized Approver"
                        color="info"
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {editSelectionProcedure && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <button
                disabled={
                  gdTotalWeightageCondition || piTotalWeightageCondition
                    ? true
                    : false
                }
                style={{
                  background:
                    (gdTotalWeightageCondition || piTotalWeightageCondition) &&
                    "#BDBDBD",
                }}
                className="create-selection-procedure-btn"
                type="submit"
              >
                Submit
              </button>
            </Box>
          )}
        </form>
      </Box>
    </Drawer>
  );
}
