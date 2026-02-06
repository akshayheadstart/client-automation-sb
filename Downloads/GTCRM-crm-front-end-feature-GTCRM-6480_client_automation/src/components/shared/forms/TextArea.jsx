import { TextField } from '@mui/material'

const TextArea = ({ value }) => {
    return (
        <TextField
            variant='outlined'
            fullWidth
            id="outlined-multiline-static"
            multiline
            minRows={1}
            value={value ? value : "N/A"}
            InputProps={{
                readOnly: true
            }}
            color="info"
        />
    )
}

export default TextArea