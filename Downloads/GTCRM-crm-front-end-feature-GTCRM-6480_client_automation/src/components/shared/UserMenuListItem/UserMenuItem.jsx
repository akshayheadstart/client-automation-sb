import { ListItem, ListItemText, Switch } from '@mui/material';
import React from 'react';
// user Menu List Items features component
const UserMenuItem = ({featureSub,feature,userPermissionData, handleOnChange}) => {
    return (
        <ListItem>
                  <ListItemText sx={{width:'150px', wordWrap:'break-word'}} id="switch-list" primary={featureSub}  />
                  <Switch
                  color="info"
                    size="medium"
                    edge="end"
                    onChange={() => handleOnChange(feature, featureSub)}
                      
                    
                    checked={userPermissionData?.[feature]?.[featureSub]?.menu}
                    inputProps={{
                      "aria-labelledby": "switch-list-label-wifi",
                    }}
                  />
                </ListItem>
    );
};

export default UserMenuItem;