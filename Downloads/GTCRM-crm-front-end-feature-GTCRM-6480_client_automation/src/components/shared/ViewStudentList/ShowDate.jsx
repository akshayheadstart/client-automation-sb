import { Box } from "@mui/system";
import { formatDateAndTime } from "../../../helperFunctions/formatDateAndTime";
import { Typography } from "@mui/material";

export const ShowDate = ({ date }) => {
  const modifiedDate = formatDateAndTime(date);
  return (
    <Box>
      <Typography>{modifiedDate?.formattedDate}</Typography>
      <Typography>{modifiedDate?.formattedTime}</Typography>
    </Box>
  );
};
