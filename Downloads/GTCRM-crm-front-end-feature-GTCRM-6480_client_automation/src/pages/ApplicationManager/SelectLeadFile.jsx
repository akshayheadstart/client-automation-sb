import { Box, Card, Typography } from "@mui/material";
import React from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState } from "react";
import LeadUploadDialog from "./LeadUploadDialog";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import CheckListDialog from "../Query_Manager/CheckListDialog";
const SelectLeadFile = ({ state }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [openUploadLeadDialog, setOpenUploadLeadDialog] = useState(false);
  const [openChecklistDialog, setOpenChecklistDialog] = useState(false);
  const [checklistCompleted, setChecklistCompleted] = useState(false);

  const handleFileInputClick = (event) => {
    event.preventDefault();
    if (!checklistCompleted) {
      setOpenChecklistDialog(true);
    } else {
      document.getElementById("lead-upload").click();
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOpenUploadLeadDialog(true);
  };
  return (
    <Box sx={{ mt: 3 }}>
      <Card sx={{ mt: 3 }} className="common-box-shadow">
        <input
          onChange={handleFileChange}
          accept={".csv, .xlsx"}
          style={{ display: "none" }}
          id="lead-upload"
          type="file"
          onClick={(event) => (event.target.value = null)}
        />
        <label htmlFor={"lead-upload"}>
          <Box
            sx={{
              cursor: "pointer",
            }}
            className="lead-upload-card-wrapper"
            onClick={handleFileInputClick}
          >
            <Box>
              {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                <CustomTooltip
                  description={<div>Will not work in demo</div>}
                  component={<CloudUploadOutlinedIcon color="info" />}
                  color={true}
                  placement={"top"}
                  accountType={
                    import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
                  }
                />
              ) : (
                <CloudUploadOutlinedIcon color="info" />
              )}
            </Box>
            <Typography variant="subtitle1">
              Select a CSV or Excel file to upload
            </Typography>
            {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
              <CustomTooltip
                description={<div>Will not work in demo</div>}
                component={
                  <Typography variant="caption">Select a file</Typography>
                }
                color={true}
                placement={"top"}
                accountType={
                  import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? true : false
                }
              />
            ) : (
              <Typography variant="caption">Select a file</Typography>
            )}
          </Box>
        </label>
      </Card>

      {openUploadLeadDialog && (
        <LeadUploadDialog
          state={state}
          openUploadLeadDialog={openUploadLeadDialog}
          setOpenUploadLeadDialog={setOpenUploadLeadDialog}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      )}
      <CheckListDialog
        openChecklistDialog={openChecklistDialog}
        setOpenChecklistDialog={setOpenChecklistDialog}
        setChecklistCompleted={setChecklistCompleted}
      />
    </Box>
  );
};

export default SelectLeadFile;
