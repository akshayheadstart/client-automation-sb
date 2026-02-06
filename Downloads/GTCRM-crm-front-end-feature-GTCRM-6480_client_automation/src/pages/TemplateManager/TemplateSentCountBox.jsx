import React from 'react';
import CustomTooltip from '../../components/shared/Popover/Tooltip';
import "../../styles/CreateViewTemplate.css";
import "../../styles/activePanelistManager.css";
import { Button } from '@mui/material';
const TemplateSentCountBox = ({item}) => {
    return (
        <>
            {item?.sent_count?.manual_count?.length> 0 || item?.sent_count?.automated_count?.length> 0 ? 
                            <CustomTooltip
                              color={true}
                              description={
                                <div>
                                  {" "}
                                  <ul className='items-data-align-design-tooltip'>
                                  <li className="custom-tooltip-text-design">{`Manual: ${item?.sent_count?.manual_count?item?.sent_count?.manual_count:"0"}`}</li>
                                          <li className="custom-tooltip-text-design">{`Automated: ${item?.sent_count?.automated_count?item?.sent_count?.automated_count:"0"}`}</li>
                                      
                                  </ul>
                                </div>
                              }
                              component={
                                  <Button
                                    className="tooltip-deign-text"
                                  >{`${
                                    item?.sent_count?.total_count
                                  }`}</Button>
                             
                              }
                              placement={'right'}
                            />
                            :"---"
                          } 
        </>
    );
};

export default TemplateSentCountBox;