
import { Box, ListItem, ListItemText } from '@mui/material';
import React from 'react';
import { Checkbox } from 'rsuite';
// user Menu List Items Sub features component
const UserMenuSubItem = ({featureSubFeature, feature, featureSub, userPermissionData, handleOnChange }) => {
    return (
        <Box  className='tree' sx={{marginLeft:2, marginRight:2.5}}>
                <ListItem data-testid='add-new-feature-id1' className="li-child tree_label_listItem" sx={{ mb: -2 }}>
                 
                   <ListItemText  id="switch-list" secondary={featureSubFeature} />
                   <Checkbox
                   className="input-checkbox-container-box"
                   checked={userPermissionData?.[feature]?.[featureSub]?.features?.[featureSubFeature]}
                   onChange={()=>handleOnChange(feature, featureSub, featureSubFeature)}
                   />
                 </ListItem>
                </Box>
    );
};

export default UserMenuSubItem;