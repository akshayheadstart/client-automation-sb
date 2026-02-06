import { Box, Button, Popover } from '@mui/material';
import "../../../styles/CommonPopover.css";

const CommonPopover = (props) => {
    const { absentStartDate, absentEndDate } = props.dates || {};

    return (
        <Popover
            style={{ zIndex: 0 }}
            id={props?.id}
            open={props?.open}
            anchorEl={props?.anchorEl}
            onClose={props?.handleClose}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
        >
            {props?.children}
            <Box className="popover-buttons">
                <Button
                    disabled={props?.selectedItem ? false : (absentStartDate && absentEndDate) ? false : true}
                    className="popover-single-button"
                    size="small"
                    variant="contained" onClick={() => props?.handleApply()}>
                    Apply
                </Button>
                <Button
                    className="popover-single-button"
                    size="small"
                    variant="text" onClick={() => props?.handleReset()}>
                    Reset
                </Button>
            </Box>
        </Popover>
    )
}

export default CommonPopover