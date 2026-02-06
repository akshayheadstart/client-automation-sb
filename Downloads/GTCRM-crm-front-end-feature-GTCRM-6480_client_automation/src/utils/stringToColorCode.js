function stringToColor(name) {
    let hash = 0;
    let letter;

    /* eslint-disable no-bitwise */
    for (letter = 0; letter < name.length; letter += 1) {
        hash = name.charCodeAt(letter) + ((hash << 5) - hash);
    }

    let color = '#';

    for (letter = 0; letter < 3; letter += 1) {
        const value = (hash >> (letter * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}