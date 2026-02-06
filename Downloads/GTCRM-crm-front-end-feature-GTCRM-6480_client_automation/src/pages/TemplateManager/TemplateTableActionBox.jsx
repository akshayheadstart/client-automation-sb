import { Box, IconButton } from '@mui/material';
import React from 'react';
import EditIcon from "../../icons/edit-icon.svg";
import DeleteIcon from "../../icons/delete-icon.svg";
import PreviewIcon from "../../images/previewEye.svg";
const TemplateTableActionBox = ({handleEditClick,handleDeleteClick,getTemplateParams,item}) => {
    return (
        <Box>
            <IconButton
              onClick={() => handleEditClick(getTemplateParams(item, true), item?.template_id)}
            >
              <img src={PreviewIcon} alt="Preview Template" />
            </IconButton>
            <IconButton
             onClick={() => handleEditClick(getTemplateParams(item, false), item?.template_id)}
            >
              <img src={EditIcon} alt="Edit Template" />
            </IconButton>
            <IconButton
              onClick={() => {
                handleDeleteClick(item);
              }}
            >
              <img
                src={DeleteIcon}
                height={18}
                width={18}
                alt="Delete Template"
              />
            </IconButton>
          </Box>
    );
};

export default TemplateTableActionBox;