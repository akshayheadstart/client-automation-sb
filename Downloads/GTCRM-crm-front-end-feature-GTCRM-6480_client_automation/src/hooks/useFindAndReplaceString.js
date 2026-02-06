import React from 'react';

const useFindAndReplaceString = () => {
    const findAndReplaceString = (string, sequence) => {
        // Initialize the message
        let message = string;

        // Find the index of the first occurrence of "{#var#}"
        let varIndex = message.indexOf(sequence);


        // Replace "{#var#}" with user input
        if (varIndex !== -1) {
            message = message.substring(0, varIndex) + '1' + message.substring(varIndex + 1 + 6);
            findAndReplaceString(message, sequence)
        }

        // Output the modified message
        return message;
    }
    return findAndReplaceString;
};

export default useFindAndReplaceString;