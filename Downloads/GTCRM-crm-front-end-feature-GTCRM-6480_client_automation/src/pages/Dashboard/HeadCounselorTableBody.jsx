import { IconButton, TableBody, TableRow, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import Mail from "../../components/userProfile/Mail";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useMemo } from "react";
import useTableCellDesign from "../../hooks/useTableCellDesign";

const HeadCounselorTableBody = ({ allHeadCounselorList, currentSeason }) => {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedAllEmail, setSelectedAllEmail] = useState(false);
  const [openSentEmailBox, setOpenSentEmailBox] = useState(false);
  const allEmailsArray = allHeadCounselorList.map(
    (items) => items?.counselor_mail
  );
  const StyledTableCell = useTableCellDesign();
  let totalTodays = useMemo(() => {
    return allHeadCounselorList?.reduce(
      (accum, item) => accum + (item?.todays ? item?.todays : 0),
      0
    );
  }, [allHeadCounselorList]);
  let totalUpcoming = useMemo(() => {
    return allHeadCounselorList?.reduce(
      (accum, item) => accum + (item?.future ? item?.future : 0),
      0
    );
  }, [allHeadCounselorList]);
  let totalPast = useMemo(() => {
    return allHeadCounselorList?.reduce(
      (accum, item) => accum + (item?.past ? item?.past : 0),
      0
    );
  }, [allHeadCounselorList]);
  let totalCompleted = useMemo(() => {
    return allHeadCounselorList?.reduce(
      (accum, item) => accum + (item?.completed ? item?.completed : 0),
      0
    );
  }, [allHeadCounselorList]);

  return (
    <>
      <TableBody>
        {allHeadCounselorList.map((headCounselor, index) => (
          <TableRow>
            <StyledTableCell>
              <span style={{ fontWeight: "500" }}>
                {headCounselor?.counselor_name}
              </span>
            </StyledTableCell>
            <StyledTableCell align="left">
              <Typography variant="body2" fontWeight={600} fontSize={15}>
                {headCounselor?.todays}
              </Typography>
            </StyledTableCell>
            <StyledTableCell align="left">
              <Typography variant="body2" fontWeight={600} fontSize={15}>
                {headCounselor?.future}
              </Typography>
            </StyledTableCell>
            <StyledTableCell align="left">
              <Typography variant="body2" fontWeight={600} fontSize={15}>
                {headCounselor?.past}
              </Typography>
            </StyledTableCell>
            <StyledTableCell align="left">
              <Typography variant="body2" fontWeight={600} fontSize={15}>
                {headCounselor?.completed}
              </Typography>
            </StyledTableCell>
            <StyledTableCell align="left">
              <IconButton
                sx={{ p: 0 }}
                disabled={currentSeason ? false : true}
                onClick={() => {
                  setSelectedAllEmail(false);
                  setOpenSentEmailBox(true);
                  setSelectedEmail(headCounselor?.counselor_mail);
                }}
              >
                <EmailOutlinedIcon
                  sx={{ color: currentSeason ? "#3498ff" : "" }}
                />
              </IconButton>
            </StyledTableCell>
          </TableRow>
        ))}
        <TableRow>
          <StyledTableCell>
            <Typography sx={{ fontWeight: "bold" }} variant="subtitle">
              Total
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left">
            <Typography variant="subtitle" fontWeight={600} fontSize={15}>
              {totalTodays}
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left">
            <Typography variant="subtitle" fontWeight={600} fontSize={15}>
              {totalUpcoming}
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left">
            <Typography variant="subtitle" fontWeight={600} fontSize={15}>
              {totalPast}
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left">
            <Typography variant="subtitle" fontWeight={600} fontSize={15}>
              {totalCompleted}
            </Typography>
          </StyledTableCell>
          <StyledTableCell align="left">
            <IconButton
              disabled={currentSeason ? false : true}
              onClick={() => {
                setSelectedAllEmail(true);
                setOpenSentEmailBox(true);
              }}
              sx={{ p: 0 }}
            >
              <EmailOutlinedIcon
                sx={{ color: currentSeason ? "#3498ff" : "" }}
              />
            </IconButton>
          </StyledTableCell>
        </TableRow>
      </TableBody>
      {!selectedAllEmail ? (
        <Mail
          email={selectedEmail}
          open={openSentEmailBox}
          onClose={setOpenSentEmailBox}
        ></Mail>
      ) : (
        <Mail
          hideToInputField={true}
          sendBulkEmail={true}
          selectedEmails={allEmailsArray}
          open={openSentEmailBox}
          onClose={setOpenSentEmailBox}
        ></Mail>
      )}
    </>
  );
};

export default HeadCounselorTableBody;
