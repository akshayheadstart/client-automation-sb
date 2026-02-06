import { Box, Typography, Checkbox, IconButton } from "@mui/material";
import React from "react";
import { checklistDialogContents } from "../../components/Calendar/utils";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CustomTooltip from "../../components/shared/Popover/Tooltip";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
const DialogContents = ({
  checklistChecked,
  setChecklistChecked,
  showChecklist,
  setOpenChecklistDialog,
  setShowCheckList,
}) => {
  const handleListCheckOnChange = (event, index) => {
    if (event.target.checked && !checklistChecked.includes(index)) {
      setChecklistChecked((prev) => [...prev, index]);
    } else {
      // in this block, we are finding and removing the index from the state which is unchecked
      const checkedList = [...checklistChecked];
      const currentUncheckedIndex = checkedList.indexOf(index);
      checkedList.splice(currentUncheckedIndex, 1);
      setChecklistChecked(checkedList);
    }
  };
  const handleCloseIconClick = () => {
    setChecklistChecked([]); // Uncheck all checkboxes
    setOpenChecklistDialog(false);
  };
  return (
    <>
      <Box
        sx={{
          marginBottom: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <KeyboardArrowLeftIcon
          onClick={() => setShowCheckList(false)}
          sx={{ opacity: showChecklist ? 1 : 0, cursor: "pointer" }}
        />
        <CloseIcon
          onClick={handleCloseIconClick}
          sx={{ opacity: showChecklist ? 0 : 1, cursor: "pointer" }}
        />
      </Box>
      <Box className="check-list-check-box-container">
        <Typography className="check-list-title">
          Checklist - Review few things before you starts
        </Typography>
        {showChecklist && (
          <CustomTooltip
            description="All the check boxes need to be ticked to proceed further."
            component={
              <IconButton sx={{ p: 0 }}>
                <InfoOutlinedIcon color="info" />
              </IconButton>
            }
          />
        )}
      </Box>
      <Box className="check-list-dialog-contents">
        {checklistDialogContents.map((content, index) => (
          <Box key={content.title} sx={{ mt: 2 }}>
            <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-start" }}>
              {showChecklist && (
                <Checkbox
                  checked={checklistChecked.includes(index)}
                  onChange={(event) => handleListCheckOnChange(event, index)}
                  sx={{ p: 0 }}
                  color="info"
                />
              )}

              <Typography variant="subtitle1">{content.title}</Typography>
            </Box>

            {!showChecklist && (
              <Typography sx={{ mt: 0.5 }} variant="body2">
                {content.text}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
};

export default React.memo(DialogContents);
