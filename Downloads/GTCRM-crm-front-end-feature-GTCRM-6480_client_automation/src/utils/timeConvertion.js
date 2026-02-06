
export const secondsToHms = (seconds) => {
    seconds = parseInt(seconds);
    let hour = Math.floor(seconds / 3600);
    let minute = Math.floor(seconds % 3600 / 60);
    let second = Math.floor(seconds % 3600 % 60);

    let hourDisplay = hour > 0 ? hour + (hour === 1 ? "h " : "h ") : "";
    let minuteDisplay = minute > 0 ? minute + (minute === 1 ? "m " : "m ") : "";
    let secondDisplay = second > 0 ? second + (second === 1 ? "s" : "s") : "0s";
    return hourDisplay + minuteDisplay + secondDisplay;
}