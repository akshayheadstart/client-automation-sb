import React from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Cookies from 'js-cookie';
function SearchBox({ handleEmailInputField, searchedEmail, setSearchedEmail, handleSearchByEmail, handleResetSearchByEmail, initialColumns, setItems }) {

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSearchByEmail();
            if (setItems) {
                setItems(initialColumns)
                localStorage.setItem(
                    `${Cookies.get("userId")}leadArrangedCollumns`,
                    JSON.stringify(initialColumns)
                );
                localStorage.setItem(`${Cookies.get("userId")}leadAddedCollumnsOrder`, JSON.stringify([]))
            }
        }}>
            <Box className="lead-search-container">
                <TextField
                    value={searchedEmail}
                    placeholder="Search..."
                    size="small"
                    color='info'
                    id="outlined-start-adornment"
                    onChange={(event) => handleEmailInputField(event.target.value)}
                    sx={{
                        mt: 1,
                        // input: {
                        //     "&::placeholder": {
                        //         color: "#008be2",
                        //         opacity: 1
                        //     },
                        // }
                    }}
                    InputProps={{
                        endAdornment: <InputAdornment position='end'>
                            {searchedEmail?.length > 0 && <IconButton
                                onClick={() => handleResetSearchByEmail()}
                            >
                                <CloseOutlinedIcon color='info' />
                            </IconButton>}
                            {
                                searchedEmail?.length ===0 &&
                            <IconButton type='submit'>
                                <SearchOutlinedIcon color='info' />
                            </IconButton>
                            }
                        </InputAdornment>
                    }}
                />
                {/* <WarningMessage message="Filters will not work during search" /> */}
            </Box>
        </form>
    )
}

export default SearchBox