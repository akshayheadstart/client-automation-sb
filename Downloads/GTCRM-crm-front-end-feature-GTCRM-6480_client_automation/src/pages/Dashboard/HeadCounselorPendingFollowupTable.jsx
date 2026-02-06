import { IconButton, TableRow, Typography } from "@mui/material";
import React from "react";
import "../../styles/FollowupTaskTable.css";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import useTableCellDesign from "../../hooks/useTableCellDesign";

const HeadCounselorPendingFollowupTable = ({
  headCounselor,
  setOpenSentEmailBox,
  setSelectedEmail,
  currentSeason,
}) => {
  const StyledTableCell = useTableCellDesign();
  return (
    <>
      <TableRow>
        <StyledTableCell component="th" scope="row">
          {headCounselor?.counselor_name}
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography color="secondary.main" variant="body2">
            {headCounselor?.todays}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography color="secondary.main" variant="body2">
            {headCounselor?.future}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography color="secondary.main" variant="body2">
            {headCounselor?.past}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <Typography color="secondary.main" variant="body2">
            {headCounselor?.completed}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left">
          <IconButton
            disabled={currentSeason ? false : true}
            onClick={() => {
              setOpenSentEmailBox(true);
              setSelectedEmail(headCounselor.email);
            }}
          >
            <EmailOutlinedIcon sx={{ color: currentSeason ? "#3498ff" : "" }} />
          </IconButton>
        </StyledTableCell>
      </TableRow>
    </>
  );
};

export default HeadCounselorPendingFollowupTable;
