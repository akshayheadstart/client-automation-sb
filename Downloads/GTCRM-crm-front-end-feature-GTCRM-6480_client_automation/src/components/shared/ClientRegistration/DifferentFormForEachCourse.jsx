import { Box, Button, Tab, Tabs, tabsClasses } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DifferentApplicationForm from "./DifferentApplicationForm";
import RegBackdrop from "./RegBackdrop";

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const DifferentFormForEachCourse = ({
  allCourses,
  formFieldsStates,
  setFormStep,
  handleClientRegistration,
  preview,
}) => {
  const { setTitleOfDialog, setOpenDetailsDialog } = formFieldsStates;
  const [value, setValue] = useState(0);
  const [loadingReg, setLoadingReg] = useState(false);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        aria-label="scrollable auto tabs example"
        TabIndicatorProps={{
          style: {
            display: "none",
          },
        }}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {allCourses.map((course, index) => (
          <Tab
            key={index}
            sx={{
              backgroundColor: "#D7DADC",
              borderRadius: 1,
              mr: 1,
              "&.Mui-selected": {
                color: "white",
                backgroundColor: "#4169E1",
              },
            }}
            label={`${course.course_name} ${
              course?.spec_name ? " in " + course?.spec_name : ""
            }`}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>

      {allCourses.map((course, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Box>
            <DifferentApplicationForm
              fieldDetails={course}
              heading={`${course.course_name} ${
                course?.spec_name ? " in " + course?.spec_name : ""
              }`}
              formFieldsStates={formFieldsStates}
              preview={preview}
              index={index}
            />
          </Box>
        </TabPanel>
      ))}

      {!preview && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => {
              if (value !== 0) {
                setValue((prev) => prev - 1);
              } else {
                setFormStep(3);
              }
            }}
            startIcon={<NavigateBeforeIcon />}
            variant="contained"
          >
            Back
          </Button>
          {value === allCourses.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => setFormStep(5)}
              endIcon={<NavigateNextIcon />}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => {
                setValue((prev) => prev + 1);
              }}
              endIcon={<NavigateNextIcon />}
            >
              Next
            </Button>
          )}
        </Box>
      )}
      <RegBackdrop open={loadingReg}></RegBackdrop>
    </Box>
  );
};

export default DifferentFormForEachCourse;
