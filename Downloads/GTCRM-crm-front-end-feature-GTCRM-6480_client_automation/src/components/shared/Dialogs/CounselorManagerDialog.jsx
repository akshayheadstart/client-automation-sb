import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Modal } from "rsuite";
import "../../../styles/CounselorManagerDialog.css";
import DatePickerHeader from "react-multi-date-picker/plugins/date_picker_header";
import DatePicker, { DateObject } from "react-multi-date-picker";
import transition from "react-element-popper/animations/transition";
import opacity from "react-element-popper/animations/opacity";
import { useState } from "react";
import { ApiCallHeaderAndBody } from "../../../hooks/ApiCallHeaderAndBody";
import useToasterHook from "../../../hooks/useToasterHook";
import { handleInternalServerError } from "../../../utils/handleInternalServerError";
import Cookies from "js-cookie";
import {
  getAllDates,
  getDateList,
  getFormattedDateList,
} from "../../../utils/getAllDates";
import Toolbar from "react-multi-date-picker/plugins/toolbar";
import { useSelector } from "react-redux";
import { customFetch } from "../../../pages/StudentTotalQueries/helperFunction";

const CounselorManagerDialog = ({
  open,
  setOpen,
  leaveDates,
  setCounsellorManagerInternalServerError,
  counselorId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [multipleOrRangeDate, setMultipleOrRangeDate] = useState(
    "Select date as multiple"
  );
  const [selectedDates, setSelectedDates] = useState([]);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const pushNotification = useToasterHook();
  const handleResetForm = () => {
    setSelectedDates([]);
  };

  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );

  const handleSubmitCounselorAbsent = (event) => {
    event.preventDefault();
    const payload = {
      counselor_id: counselorId,
      dates: [],
      remove_dates: [],
    };
    const absentDate = [];
    const removeAbsentDate = [];
    let allDates = [];

    if (
      multipleOrRangeDate === "Select date as multiple" ||
      selectedDates.length === 1
    ) {
      allDates = getDateList(selectedDates);
    } else {
      const dateList = [];
      selectedDates.forEach((date) => {
        const formattedDate = new DateObject(
          `${date.year}-${date.month.number}-${date.day}`
        ).format("YYYY-MM-DD", ["Date"]);
        dateList.push(formattedDate);
      });

      allDates = getAllDates(dateList[0], dateList[1]);
    }

    allDates.forEach((date) => {
      if (leaveDates.includes(date)) {
        removeAbsentDate.push(date);
      } else {
        absentDate.push(date);
      }
    });
    payload.dates = absentDate;
    payload.remove_dates = removeAbsentDate;

    setIsLoading(true);
    customFetch(
      `${import.meta.env.VITE_API_BASE_URL}/counselor/leave_college_counselor${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "POST", JSON.stringify(payload))
    )
      .then((res) =>
        res.json().then((data) => {
          if (data?.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (data.code === 200) {
            pushNotification("success", data.message);
          } else if (data.detail) {
            pushNotification("error", data.detail);
          }
        })
      )
      .catch(() => {
        handleInternalServerError(
          setCounsellorManagerInternalServerError,
          "",
          5000
        );
      })
      .finally(() => {
        setIsLoading(false);
        handleResetForm();
        setOpen(false);
      });
  };

  return (
    <Modal
      overflow={true}
      open={open}
      onClose={() => {
        setOpen(false);
        handleResetForm();
      }}
    >
      <Modal.Header>
        {isLoading && (
          <Box className="absent-loader">
            <CircularProgress size={35} color="info" />
          </Box>
        )}
        <Modal.Title>
          <Typography variant="h6">UPDATE COUNSELOR HOLIDAY</Typography>
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmitCounselorAbsent}>
        <Grid container className="absent-date-picker-container">
          <Grid item md={6} sm={12} sx={{ pr: 2, pl: 0 }}>
            <Autocomplete
              disableClearable
              options={["Select date as multiple", "Select date as range"]}
              sx={{ width: "100%" }}
              size="small"
              onChange={(event, value) => {
                setMultipleOrRangeDate(value);
                setSelectedDates([]);
              }}
              value={multipleOrRangeDate}
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Multiple or range?"
                  color="info"
                />
              )}
            />
          </Grid>

          <Grid item md={6} sm={12}>
            <Box sx={{ mr: 2 }}>
              <DatePicker
                fixRelativePosition={true}
                fixMainPosition={true}
                calendarPosition={`right-start`}
                placeholder="Select Date"
                value={selectedDates}
                range={
                  multipleOrRangeDate === "Select date as range" ? true : false
                }
                multiple={
                  multipleOrRangeDate === "Select date as multiple"
                    ? true
                    : false
                }
                rangeHover={
                  multipleOrRangeDate === "Select date as range" ? true : false
                }
                plugins={[
                  <DatePickerHeader position="top" size="small" />,
                  <Toolbar
                    position="bottom"
                    names={{
                      today: "Select Today",
                      deselect: "Deselect All",
                      close: "Close",
                    }}
                  />,
                ]}
                onChange={(dates) => {
                  setSelectedDates(dates);
                }}
                minDate={new Date()}
                animations={[
                  opacity(),
                  transition({ from: 35, duration: 800 }),
                ]}
                mapDays={({ date }) => {
                  let color;
                  const formattedDate = new DateObject(
                    `${date.year}-${date.month.number}-${date.day}`
                  ).format("YYYY-MM-DD", ["Date"]);
                  if (leaveDates.includes(formattedDate)) color = "absent-date";

                  if (color)
                    return { className: "highlight highlight-" + color };
                }}
              />
            </Box>
          </Grid>

          {selectedDates.length > 0 && (
            <Grid item md={12} sm={12}>
              <Box>
                <Typography variant="body1">Selected Dates :</Typography>
                {getFormattedDateList(selectedDates).map((date) => (
                  <Typography
                    key={date.date}
                    variant="caption"
                    style={date.style}
                  >
                    {date.date}
                  </Typography>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>

        <Modal.Footer>
          <Box>
            <Button
              variant="outlined"
              size="small"
              color="info"
              onClick={handleResetForm}
              sx={{ borderRadius: 50 }}
            >
              Reset
            </Button>
            <Button
              disabled={selectedDates.length ? false : true}
              type="submit"
              sx={{ ml: 2, borderRadius: 50 }}
              variant="contained"
              size="small"
              color="info"
            >
              Submit
            </Button>
          </Box>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default CounselorManagerDialog;
