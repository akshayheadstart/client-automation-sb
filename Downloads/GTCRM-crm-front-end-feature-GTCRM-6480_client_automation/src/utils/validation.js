const allRegex =
{
    emailRegex: /(<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(>|$)/i,
    alphabetRegex: /^[A-Za-z.\s]+$/,
    tagRegex: /^[A-Za-z0-9]+$/
}
export const tagsValidation = (event) => {
    if (allRegex.tagRegex.test(event.key) === false) {
        return false
    } else {
        return true
    }
}

export const phoneNumberValidation = (e) =>
    ["e", "E", "-"].includes(e.key) && e.preventDefault();


export const conventionCheck = (e, type) => {
    if (e.target.value.match(allRegex[type])) {
        return true
    } else {
        return false
    }
}
export const emailValidation = (emailChar) => {
    const emailMatcher = /(<|^)[\w\d._%+-]+@(?:[\w\d-]+\.)+(\w{2,})(>|$)/i;
    if (emailMatcher.test(emailChar)) {
        return true;
    } else {
        return false;
    }
};
export const numberValidation = (e) => {
    if (["e", "E", "-"].includes(e.key)) {
        return false;
    } else {
        return true;
    }
};
export const nameValidation = (nameChar) => {
    const charMatcher = /^[a-zA-Z\s]*$/;
    if (charMatcher.test(nameChar)) {
        return true;
    } else {
        return false;
    }
};
export function isValidEmail(email) {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  }
 export function isValidPhoneNumber(phoneNumber) {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    return /^[0-9]{10}$/.test(cleanedPhoneNumber);
  }

export const removeCharacters = (str = '') => {
    return str
        .replace(/[^0-9.]/g, '')
        .replace(/^\.+/g, '');
};


