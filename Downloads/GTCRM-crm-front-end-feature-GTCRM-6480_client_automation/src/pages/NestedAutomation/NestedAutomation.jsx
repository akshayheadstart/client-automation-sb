/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import "../../styles/automationTreeDesign.css";
import AutomationCReateWindowDialog from "../../components/ui/NestedAutomation/Automation-Drawer/AutomationCReateWindowDialog";
import { useSelector } from "react-redux";
import CreateAutomationDrawer from "../../components/ui/NestedAutomation/Automation-Drawer/CreateAutomationDrawer";
import SelectDataSegmentDrawer from "../../components/ui/NestedAutomation/Automation-Drawer/SelectDataSegmentDrawer";
import CreateDataSegmentDrawer from "../../components/ui/DataSegmentManager/CreateDataSegmentDrawer";
import { useSearchParams } from "react-router-dom";

const NestedAutomation = ({
  openCreateAutomationDialog,
  handleManageCreateAutomationDialogue,
}) => {
  const nestedAutomationPayload = useSelector(
    (state) => state.authentication.nestedAutomationPayload
  );
  const [searchParams] = useSearchParams();

  const [automationDaysRange, setAutomationDaysRange] = useState([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
  ]);

  const [selectedOptionInWIndowTwo, setSelectedOptionInWIndowTwo] = useState(
    nestedAutomationPayload?.automation_details?.data_type === "Lead"
      ? "Origin"
      : nestedAutomationPayload?.automation_details?.data_type === "Application"
      ? "Change in application stage"
      : null
  );

  const [openCreateAutomationDrawer, setOpenCreateAutomationDrawer] =
    useState(false);

  const [openSelectDataSegmentDrawer, setOpenSelectDataSegmentDrawer] =
    useState(false);

  const [openCreateDataSegmentDrawer, setOpenCreateDataSegmentDrawer] =
    useState(false);

  useEffect(() => {
    if (searchParams.get("redirect") === "create-automation") {
      handleManageCreateAutomationDialogue(true);
    }
  }, []);

  return (
    <Box sx={{ mt: 2, p: 2 }}>
      <AutomationCReateWindowDialog
        open={openCreateAutomationDialog}
        handleManageCreateAutomationDialogue={
          handleManageCreateAutomationDialogue
        }
        daysRange={automationDaysRange}
        setDaysRange={setAutomationDaysRange}
        readOnlyBoxes={false}
        setSelectedOptionInWIndowTwo={setSelectedOptionInWIndowTwo}
        selectedOptionInWIndowTwo={selectedOptionInWIndowTwo}
        setOpenCreateAutomationDrawer={setOpenCreateAutomationDrawer}
        setOpenSelectDataSegmentDrawer={setOpenSelectDataSegmentDrawer}
        setOpenCreateDataSegmentDrawer={setOpenCreateDataSegmentDrawer}
      ></AutomationCReateWindowDialog>
      {openCreateAutomationDrawer && (
        <CreateAutomationDrawer
          openDrawer={openCreateAutomationDrawer}
          setOpenDrawer={setOpenCreateAutomationDrawer}
          selectedCondition={selectedOptionInWIndowTwo}
          handleManageCreateAutomationDialogue={
            handleManageCreateAutomationDialogue
          }
        />
      )}
      {openSelectDataSegmentDrawer && (
        <SelectDataSegmentDrawer
          openDrawer={openSelectDataSegmentDrawer}
          setOpenDrawer={setOpenSelectDataSegmentDrawer}
          handleManageCreateAutomationDialogue={
            handleManageCreateAutomationDialogue
          }
        />
      )}
      {openCreateDataSegmentDrawer && (
        <CreateDataSegmentDrawer
          openCreateDataSegmentDrawer={openCreateDataSegmentDrawer}
          setOpenCreateDataSegmentDrawer={setOpenCreateDataSegmentDrawer}
          from="automation"
          handleManageCreateAutomationDialogue={
            handleManageCreateAutomationDialogue
          }
        />
      )}
    </Box>
  );
};

export default NestedAutomation;
