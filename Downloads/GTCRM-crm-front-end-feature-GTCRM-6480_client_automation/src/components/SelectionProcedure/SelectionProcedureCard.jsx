import {
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { singleCheckboxHandlerFunction } from "../../helperFunctions/checkboxHandleFunction";

const SelectionProcedureCard = ({
  data,
  setOpenViewSelectionProcedure,
  index,
  setSelectedProcedureIndex,
  setEditSelectionProcedure,
  selectedSelectionProcedure,
  setSelectedSelectionProcedure,
}) => {
  return (
    <Grid
      container
      spacing={0}
      columns={{ xs: 4, sm: 8.1, md: 13 }}
      sx={{
        backgroundColor: `#11bed2`,
        borderRadius: "12px",
        pb: { xs: 2, sm: 2, md: 0 },
        mt: 3,
        color: "#FFF",
      }}
    >
      <Grid item xs={4} sm={4} md={3}>
        <Box className="selection-procedure-items-box">
          <Typography variant="h4">1</Typography>
          <Typography variant="subtitle1">Program Name</Typography>
          <Box className="selection-procedure-program-name">
            <Typography variant="subtitle1">{data?.course_name}- </Typography>
            <Typography>{data?.specialization_name}</Typography>
          </Box>
        </Box>
      </Grid>
      <Box className="interview-header-divider-box">
        <Divider
          sx={{
            display: { xs: "none", sm: "block", md: "block" },
            height: "76px",
            "&.MuiDivider-root": {
              borderColor: "#FFF",
              borderWidth: "1px",
            },
          }}
          className="interview-header-divider"
          orientation="vertical"
          flexItem
        ></Divider>
      </Box>
      <Grid item xs={4} sm={4} md={2.3}>
        <Box className="selection-procedure-items-box">
          <Typography variant="h4">2</Typography>
          <Typography variant="subtitle1">Eligibility Criteria</Typography>
          <Box className="selection-procedure-program-name">
            <Typography variant="body1">
              {data?.eligibility_criteria
                ? data?.eligibility_criteria?.minimum_qualification?.join(", ")
                : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Box className="interview-header-divider-box">
        <Divider
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            height: "76px",
            "&.MuiDivider-root": {
              borderColor: "#FFF",
              borderWidth: "1px",
            },
          }}
          className="interview-header-divider"
          orientation="vertical"
          flexItem
        ></Divider>
      </Box>
      <Grid item xs={4} sm={4} md={2.3}>
        <Box className="selection-procedure-items-box">
          <Typography variant="h4">3</Typography>
          <Typography variant="subtitle1">Group Discussion</Typography>
          <Box className="selection-procedure-program-name">
            <Typography variant="body1">
              {data?.gd_parameters_weightage ? "Yes" : "No"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Box className="interview-header-divider-box">
        <Divider
          sx={{
            display: { xs: "none", sm: "block", md: "block" },
            height: "76px",
            "&.MuiDivider-root": {
              borderColor: "#FFF",
              borderWidth: "1px",
            },
          }}
          className="interview-header-divider"
          orientation="vertical"
          flexItem
        ></Divider>
      </Box>
      <Grid item xs={4} sm={4} md={2.3}>
        <Box className="selection-procedure-items-box">
          <Typography variant="h4">4</Typography>
          <Typography variant="subtitle1">Personal Interview</Typography>
          <Box className="selection-procedure-program-name">
            <Typography variant="body1">
              {data?.pi_parameters_weightage ? "Yes" : "No"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Box className="interview-header-divider-box">
        <Divider
          sx={{
            display: { xs: "none", sm: "none", md: "block" },
            height: "76px",
            "&.MuiDivider-root": {
              borderColor: "#FFF",
              borderWidth: "1px",
            },
          }}
          className="interview-header-divider"
          orientation="vertical"
          flexItem
        ></Divider>
      </Box>
      <Grid item xs={4} sm={4} md={2}>
        <Box className="selection-procedure-items-box">
          <Typography variant="h4">5</Typography>
          <Typography variant="subtitle1">Offer Letter</Typography>
          <Box className="selection-procedure-program-name">
            <Typography variant="body1">
              {data?.offer_letter?.authorized_approver_name}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Box
        sx={{
          pt: 1,
          pl: { xs: 4, sm: 4, md: 0 },
          pb: { xs: 1, sm: 1, md: 0 },
        }}
      >
        <IconButton
          onClick={() => {
            setOpenViewSelectionProcedure(true);
            setSelectedProcedureIndex(index);
            setEditSelectionProcedure(true);
          }}
        >
          <EditIcon sx={{ color: "#fff" }} />
        </IconButton>
        <IconButton
          onClick={() => {
            setOpenViewSelectionProcedure(true);
            setSelectedProcedureIndex(index);
            setEditSelectionProcedure(false);
          }}
        >
          <VisibilityIcon sx={{ color: "#fff" }} />
        </IconButton>
        <Checkbox
          sx={{ p: 0, color: "#fff" }}
          checked={
            selectedSelectionProcedure?.includes(data?.procedure_id)
              ? true
              : false
          }
          onChange={(e) => {
            singleCheckboxHandlerFunction(
              e,
              data?.procedure_id,
              "",
              selectedSelectionProcedure,
              setSelectedSelectionProcedure
            );
          }}
        />
      </Box>
    </Grid>
  );
};

export default SelectionProcedureCard;
