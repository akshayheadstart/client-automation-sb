import { Typography } from '@mui/material';
import React from 'react';
import '../../../styles/CalendarMOD.css'

const CalendarTimeData = ({time}) => {
    return (
        <>
        <Typography
          className='calendarTimeData-text-container'
        >
          <Typography
            sx={{ whiteSpace: "nowrap", fontSize: "15px", fontWeight: 600 }}
          >
            {time}
          </Typography>
          <Typography className="hr-color" sx={{ width: "100%" }}>
            <hr className="hr-container" />
          </Typography>
        </Typography>
        </>
    );
};

export default CalendarTimeData;