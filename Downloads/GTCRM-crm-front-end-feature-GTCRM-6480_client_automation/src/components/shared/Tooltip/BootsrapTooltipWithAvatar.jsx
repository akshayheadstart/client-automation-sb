import { Avatar } from '@mui/material';
import React from 'react';
import { BootstrapTooltip } from './BootsrapTooltip';

const BootsrapTooltipWithAvatar = ({ placement, title, iconImage }) => {
    return (
        <BootstrapTooltip arrow placement={placement} title={title}>
            <Avatar

                variant={"rounded"}
                alt="sort ascending"
                src={iconImage}
                sx={{ width: "25px", height: "25px", }}
            />
        </BootstrapTooltip>
    );
};

export default BootsrapTooltipWithAvatar;