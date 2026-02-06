import React from 'react';
import CustomTooltip from '../../components/shared/Popover/Tooltip';
import "../../styles/CreateViewTemplate.css";
import "../../styles/activePanelistManager.css";
import { Box, Typography } from '@mui/material';
const TemplateTagBox = ({item}) => {
    return (
        <Box
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
        }}
      >
        {item?.added_tags?.length > 0
          ? item?.added_tags
              ?.slice(0, 1)
              .map((tag, index) => (
                <span
                  key={index}
                >
                  {tag?.tag_name}
                </span>
              ))
          : `---`}
        {item?.added_tags?.length > 1 && (
          <CustomTooltip
            color={true}
            description={
              <div>
                {" "}
                <ul className='items-data-align-design-tooltip'>
                  {" "}
                  {item?.added_tags
                    ?.slice(1)
                    .map((tag) => {
                      return (
                        <li className="custom-tooltip-text-design">{tag?.tag_name}</li>
                      );
                    })}
                </ul>
              </div>
            }
            component={
              <Box
                sx={{ borderRadius: 10 }}
                className="template-tags-length-box"
              >
                <Typography
                  sx={{ fontSize: "10px", color: "white" }}
                >{`+${
                  item?.added_tags?.slice(1)?.length
                }`}</Typography>
              </Box>
            }
            placement={'right'}
          />
        )}
      </Box>
    );
};

export default TemplateTagBox;