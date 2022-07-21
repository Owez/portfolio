/**
 * 
 * @param {Date} d Raw datetime to format
 * @returns {string} Formatted datetime
 */
function date(dt) {
    let day = dt.getDate();
    let month = new Intl.DateTimeFormat('en-US', { month: "long" }).format(dt);
    return day.toString() + ordinal(day) + " " + month + " " + dt.getFullYear().toString();
}

/**
 * 
 * @param {Int} d Day of month
 * @returns {string} Ordinal day, e.g. "th" or "st"
 */
function ordinal(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// Loop over all date classes and parse their content into fancy date
let elements = document.getElementsByClassName("date");
for (let element of elements) {
    element.textContent = date(new Date(element.textContent))
}
