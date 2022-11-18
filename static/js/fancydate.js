/** 
 * @file Utilities for generating fancy dates for all `date` classes automatically
 * @author Owen Griffiths
 */

/**
 * Generates a fancy date
 * @param {Date} dt Raw datetime to format
 * @returns {string} Formatted datetime
 */
function date(dt) {
    let day = dt.getDate();
    let month = new Intl.DateTimeFormat('en-US', { month: "long" }).format(dt);
    return day.toString() + ordinal(day) + " " + month + " " + dt.getFullYear().toString();
}

/**
 * Returns ordinal suffix for provided data
 * @param {number} d Day of month
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

/**
 * Calculates days between first and second dates
 * @param {Date} d1 First date
 * @param {Date} d2 Second date
 * @returns Number of days between {@link d1} and {@link d2}
 */
function daysBetween(d1, d2) {
    var diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
};

// Get current date for recent indicator
const current_date = new Date();

// Loop over all date classes and parse their content into fancy date
const elements = document.getElementsByClassName("date");
for (const element of elements) {
    // Get date from current element
    const element_date = new Date(element.textContent);

    // Format date and add a recent indicator if it's new
    let formatted = date(element_date);
    // if (daysBetween(current_date, element_date) < 60) {
    //     formatted = `✨ ${formatted}`
    // }

    // Set formatted date
    element.textContent = formatted
}
