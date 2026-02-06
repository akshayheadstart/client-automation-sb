import React from "react";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Dropdown, Popover, Whisper } from "rsuite";
function ChangeStatus({ reference, statusList, handleSelectMenu }) {
  return (
    <>
      <ModeEditOutlineOutlinedIcon />{" "}
      <Whisper
        placement="top"
        controlId="control-id-with-dropdown"
        trigger="click"
        ref={reference}
        speaker={
          <Popover ref={reference} full>
            <Dropdown.Menu
              onSelect={(keyIndex) => {
                reference.current.close();
                handleSelectMenu(statusList[keyIndex]);
              }}
            >
              {statusList.map((value, index) => (
                <Dropdown.Item eventKey={index}>{value}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Popover>
        }
      >
        <span> Change Status</span>
      </Whisper>
    </>
  );
}

export default ChangeStatus;
