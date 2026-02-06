
import React from 'react'
import { Box } from '@mui/system'
import ExtraFilters from '../../components/shared/filters/ExtraFilters'
import { Loader } from 'rsuite';




function ExtraFilterList({ loading, allExtraFiltersList, searchedEmail, selectedExtraFilters, setSelectedExtraFilters, handleFilterOption }) {

    return (
        <>
            {loading ? <Box className="extra-filter-loader ">
                <Loader size="sm" />
            </Box> : (
                <>
                    {allExtraFiltersList.map((filter) => (

                        <ExtraFilters
                            searchedEmail={searchedEmail}
                            data={filter.data}
                            placeholder={filter.labelText}
                            allValue={filter.data.map(value => value.value)}
                            setSelectedPicker={setSelectedExtraFilters}
                            pickerValue={selectedExtraFilters}
                            handleFilterOption={handleFilterOption}
                        />
                    ))}
                </>
            )}
        </>
    )
}

export default React.memo(ExtraFilterList);