export function getTwoDigitMonthYearDate(date) {
    const dateJS = new Date(date)
    const month = dateJS.getMonth() + 1;
    const fullYear = dateJS.getFullYear();
    const formattedMonth = month < 10 ? `<span style="visibility: hidden;">1</span>${month}` : month;
    const formattedYear = fullYear.toString().slice(2);
    const dateFormatted = `${formattedMonth}/${formattedYear}`;
    return dateFormatted;
}

export function getFullYear(date) {
    const dateJS = new Date(date)
    const fullYear = dateJS.getFullYear();
    return fullYear;
}