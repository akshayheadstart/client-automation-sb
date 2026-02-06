import React from 'react'
import { Button, CheckPicker, Checkbox } from 'rsuite';

const footerStyles = {
    padding: '10px 2px',
    borderTop: '1px solid #e5e5e5',
    display: "flex",
    justifyContent: "space-between",
    marginRight: 10,
};

const ExtraFilters = ({ searchedEmail, data, placeholder, allValue, pickerValue, setSelectedPicker, handleFilterOption }) => {
    const picker = React.useRef();

    const handleCheckAll = (value, checked) => {
        const allTheValue = [...new Set([...pickerValue, ...allValue])]

        if (checked) {
            setSelectedPicker(allTheValue);
            handleFilterOption({ extra_filters: allTheValue })
        } else {
            const otherValue = allTheValue.filter(val => val.field_name !== placeholder);
            setSelectedPicker(otherValue);
            handleFilterOption({ extra_filters: otherValue })
        }

    };

    return (
        <CheckPicker
            disabled={searchedEmail.length > 0}
            ref={picker}
            placeholder={placeholder}
            data={data}
            className='select-picker'
            onChange={(value) => {
                if (value.length) {
                    setSelectedPicker((value));
                    handleFilterOption({ extra_filters: value })
                } else {
                    const otherValue = pickerValue.filter(val => val.field_name !== placeholder);
                    setSelectedPicker(otherValue);
                    handleFilterOption({ extra_filters: otherValue })

                }
            }}
            value={pickerValue}
            renderExtraFooter={() => (
                <div style={footerStyles} >
                    <Checkbox

                        checked={pickerValue.filter((val) => val.field_name === placeholder).length === allValue.length && pickerValue?.length !== 0}
                        onChange={handleCheckAll}
                    >
                        Select all
                    </Checkbox>

                    <Button
                        appearance="primary"
                        size="sm"
                        onClick={() => {
                            picker.current.close();
                        }}
                    >
                        Close
                    </Button>
                </div>
            )}
        />
    )
}

export default ExtraFilters