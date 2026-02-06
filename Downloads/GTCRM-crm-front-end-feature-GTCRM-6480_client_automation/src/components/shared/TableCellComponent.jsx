import { Box } from '@mui/material';
import React from 'react';
import BootsrapTooltipWithAvatar from './Tooltip/BootsrapTooltipWithAvatar';
import sortAscendingIcon from '../../icons/sort-ascending.png';
import sortDescendingIcon from '../../icons/sort-descending.png';
import { useState } from 'react';
import { handleSortingAScDes } from '../../helperFunctions/handleSortAscDes';
import { removeLocalStorageWithSkip } from '../../helperFunctions/removeLocaStorageSorted';
import Cookies from 'js-cookie';
import useTableCellDesign from '../../hooks/useTableCellDesign';

const TableCellComponent = ({ column, setList, hold, list, index, setLoading, CurrentDataLocalStorageKeyName, sortingIndexName }) => {

    const [sort, setSort] = useState(localStorage.getItem(`${Cookies.get("userId")}${sortingIndexName}${index}`) ? localStorage.getItem(`${Cookies.get("userId")}${sortingIndexName}${index}`) : 'default');

    const setAfterSortState = (sorting, callHandleSort) => {
        callHandleSort && handleSortingAScDes(column?.id, sorting, list, setLoading, setList)
        setSort(sorting)
        localStorage.setItem(`${Cookies.get("userId")}${sortingIndexName}${index}`, sorting)
        localStorage.setItem(`${Cookies.get("userId")}${CurrentDataLocalStorageKeyName}`, JSON.stringify({ index: index, sort: sorting, columnID: column?.id }))
    }
    const StyledTableCell = useTableCellDesign();
    return (
        <StyledTableCell className="data" align="left" width={"15%"} sx={{whiteSpace:'nowrap'}}>
            <Box sx={{ display: 'flex', alignItems: 'center',width:column?.columnName==='Name'?'200px':column?.columnName==='Email'?'300px':''}}>
                <Box sx={{ mr: 1,fontSize:'16px' ,fontWeight:500,color:'#7E92A2 !important' }}>{column?.columnName}</Box>
                {(sort === 'asc' || sort === "default") ?
                    <Box sx={{ cursor: 'pointer', opacity: (sort === "default") ? '0.3' : '1' }} onClick={() => {
                        removeLocalStorageWithSkip(index, list, sortingIndexName)
                        if (sort === "default") {
                            setAfterSortState('asc', true)
                        } else if (sort === 'asc') {
                            setAfterSortState('des', true)
                        }

                    }}> <BootsrapTooltipWithAvatar
                        placement="top"
                        title={(sort === "default") ? "Unsorted" : "Sorted as ascending"}
                        iconImage={sortAscendingIcon}
                    ></BootsrapTooltipWithAvatar> </Box>
                    :
                    <Box sx={{ cursor: 'pointer' }} onClick={() => {
                        removeLocalStorageWithSkip(index, list, sortingIndexName)
                        if (sort === 'des') {
                            setLoading(true)
                            setList([...hold])
                            setTimeout(() => {
                                setLoading(false)
                            }, 100);
                            setAfterSortState('default', false)
                        }

                    }}> <BootsrapTooltipWithAvatar
                        placement="top"
                        title="Sorted as descending"
                        iconImage={sortDescendingIcon}
                    ></BootsrapTooltipWithAvatar></Box>}
            </Box>

        </StyledTableCell>
    );
};

export default TableCellComponent;