/**
 * @file Script for blog page, used to put each article in a category bucket 
 * @author Owen Griffiths
 */

// Get jank element and clean it's data
let e = document.getElementById("jank");
let jank = e.textContent.replace(/(\r\n|\n|\r)/gm, "").replace(/ +/gm, " ").replace(/ . /gm, ".").trimStart().split(".").filter(n => n);

// Remove jank element
e.remove();

// Put each article in buckets
let buckets = {};
for (let article of jank) {
    // Split into information
    let [name, date, link, categories] = article.split("=")
    categories = categories.trim().split(" ");

    // Assemble into article object
    let assembled = { name: name, date: date, link: link };

    // Add to buckets
    for (let category of categories) {
        // Create bucket if it didn't exist
        if (!(category in buckets)) {
            buckets[category] = [];
        }
        buckets[category].push(assembled);
    }
}

// Assemble buckets into html
for (category in buckets) {
    // Create category node
    let ec = document.createElement("div");
    ec.classList.add("category");

    // Add title
    let et = document.createElement("h1");
    et.textContent = category;
    ec.appendChild(et);

    // Make articles element
    let ep = document.createElement("div");
    ep.classList.add("articles");

    // Add articles
    for (let article of buckets[category]) {
        console.log(article)

        // Make article element
        let ea = document.createElement("a");
        ea.href = article["link"];

        // Add title
        let eat = document.createElement("div");
        eat.textContent = article["name"];
        ea.appendChild(eat);

        // Add date
        let ead = document.createElement("div");
        ead.classList.add("date");
        ead.textContent = article["date"];
        ea.appendChild(ead);

        // Add to articles
        ep.appendChild(ea);
    }

    // Add articles
    ec.appendChild(ep);

    // Add category node to content
    document.getElementById("content").appendChild(ec);
}