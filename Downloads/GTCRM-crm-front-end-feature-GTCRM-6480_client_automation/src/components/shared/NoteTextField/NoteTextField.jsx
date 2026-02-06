import { TextField } from '@mui/material'
import React from 'react'
import '../../../styles/sharedStyles.css'

const NoteTextField = ({ setNoteFieldValue, style }) => {
    return (
        <TextField
            sx={{ mt: 2, ...style }}
            id="outlined-multiline-static"
            label="Note"
            multiline
            rows={3}
            color='info'
            fullWidth
            onChange={(e) => setNoteFieldValue(e.target.value)}
            className='note-Text-Field-width'
        />
    )
}

export default NoteTextField