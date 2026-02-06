import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import QuizIcon from "@mui/icons-material/Quiz";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserCollegeInfo } from "../../../Redux/Slices/authSlice";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const CollegeListDialogue = ({
  collegeDetails,
  openDialog,
  handleCloseDialog,
  currentToken,
  submitDetails,
  from,
}) => {
  const dispatch = useDispatch();
  const college = useSelector(
    (state) => state.authentication.currentUserInitialCollege
  );
  const [collegeID, setCollegeId] = useState(college?.id ? college : null);

  return (
    <Dialog minWidth={400} open={openDialog} onClose={handleCloseDialog}>
      <Box sx={{ px: 2 }}>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <QuizIcon
            sx={{
              height: 40,
              width: 40,
              color: "red",
            }}
          />
        </Box>
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
          }}
        >
          {from === "ChangeCollege"
            ? "Select College "
            : "Multiple Colleges Found"}
        </Typography>
        <DialogContent sx={{ textAlign: "right" }}>
          <DialogContentText sx={{ textAlign: "center" }}>
            Please select your preferred college from the options below.
          </DialogContentText>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (collegeID !== null) {
                dispatch(
                  setUserCollegeInfo({
                    initialCollege: collegeID,
                    collegeList: collegeDetails,
                  })
                );
                Cookies.set("COLLEGE_ID", JSON.stringify(collegeID), {
                  expires: 30,
                });
                Cookies.set("COLLEGE_LIST", JSON.stringify(collegeDetails), {
                  expires: 30,
                });
              }
              if (from !== "ChangeCollege") {
                submitDetails(currentToken?.token, currentToken?.decoded);
              } else {
                window.location.reload();
              }
            }}
          >
            <Autocomplete
              sx={{ mt: 2 }}
              defaultValue={college}
              value={collegeID ? collegeID : null}
              required
              size="small"
              getOptionLabel={(option) => option?.name}
              options={collegeDetails}
              onChange={(event, newValue) => {
                setCollegeId(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  required={true}
                  fullWidth
                  label="Select Colleges"
                  name="colleges"
                  {...params}
                  color="info"
                />
              )}
            />

            <br />
            <Button
              size="small"
              sx={{ mt: 2, mr: 2 }}
              onClick={handleCloseDialog}
              variant="contained"
            >
              Cancel
            </Button>
            <Button
              size="small"
              type="submit"
              sx={{ mt: 2 }}
              variant="contained"
            >
              Done
            </Button>
          </form>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CollegeListDialogue;
