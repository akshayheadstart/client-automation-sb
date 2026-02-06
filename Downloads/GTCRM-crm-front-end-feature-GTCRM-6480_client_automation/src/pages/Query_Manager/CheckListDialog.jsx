import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { leadUploadSampleFile } from "../../images/imageAmajonS3Url";
import DialogContents from "./DialogContents";
import { useState } from "react";
import CustomTooltip from "../../components/shared/Popover/Tooltip";

export default function CheckListDialog({
  openChecklistDialog,
  setOpenChecklistDialog,
  setChecklistCompleted,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [checklistChecked, setChecklistChecked] = useState([]);
  const [showChecklist, setShowCheckList] = useState(false);

  const handleCloseChecklistDialog = () => {
    if (checklistChecked.length === 4) {
      setChecklistCompleted(true);
      setOpenChecklistDialog(false);
      document.getElementById("lead-upload").click();
    }
  };

  return (
    <Box>
      <Dialog
        className="check-list-dialog-container"
        fullScreen={fullScreen}
        open={openChecklistDialog}
        onClose={() => setOpenChecklistDialog(false)}
      >
        {!showChecklist ? (
          <>
            <Box sx={{ m: 3.5 }}>
              <DialogContents
                checklistChecked={checklistChecked}
                setChecklistChecked={setChecklistChecked}
                showChecklist={showChecklist}
                setShowCheckList={setShowCheckList}
                setOpenChecklistDialog={setOpenChecklistDialog}
              />
            </Box>
            <DialogActions className="sample-file-and-next-btn-box">
              <Button
                color="info"
                onClick={() => window.open(leadUploadSampleFile)}
                variant="text"
                size="small"
              >
                Click here to download sample CSV
              </Button>
              <Box>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => setShowCheckList(true)}
                >
                  Continue
                </Button>
              </Box>
            </DialogActions>
          </>
        ) : (
          <>
            <Box sx={{ m: 3.5 }}>
              <DialogContents
                checklistChecked={checklistChecked}
                setChecklistChecked={setChecklistChecked}
                showChecklist={showChecklist}
                setShowCheckList={setShowCheckList}
                setOpenChecklistDialog={setOpenChecklistDialog}
              />
            </Box>
            <DialogActions className="sample-file-and-next-btn-box">
              <Button
                color="info"
                onClick={() => window.open(leadUploadSampleFile)}
                variant="text"
                size="small"
              >
                Click here to download sample CSV
              </Button>
              <Box>
                {import.meta.env.VITE_ACCOUNT_TYPE === "demo" ? (
                  <CustomTooltip
                    description={<div>Will not work in demo</div>}
                    component={
                      <Button
                        size="small"
                        variant="contained"
                        className={
                          checklistChecked.length === 4
                            ? "common-contained-button"
                            : ""
                        }
                        onClick={handleCloseChecklistDialog}
                        disabled={checklistChecked.length !== 4}
                      >
                        Continue
                      </Button>
                    }
                    color={true}
                    placement={"top"}
                    accountType={import.meta.env.VITE_ACCOUNT_TYPE === "demo"}
                  />
                ) : (
                  <Button
                    size="small"
                    variant="contained"
                    className={
                      checklistChecked.length === 4
                        ? "common-contained-button"
                        : ""
                    }
                    onClick={handleCloseChecklistDialog}
                    disabled={checklistChecked.length !== 4}
                  >
                    Continue
                  </Button>
                )}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
