"use strict";
function gD(a) {
    return a.filter((v, i, s) => s.indexOf(v) === i).sort((a, b) => a - b);
}
function getUniqueSortedNumbers(numbers) {
    const uniqueNumbers = removeDuplicates(numbers);
    const sortedNumbers = sortAscending(uniqueNumbers);
    return sortedNumbers;
}
function removeDuplicates(numbers) {
    return [...new Set(numbers)];
}
function sortAscending(numbers) {
    return [...numbers].sort((a, b) => a - b);
}
function getUserData(id) {
    const d = { n: "Rue", e: "rue@email.com", a: 25 };
    const x = d.n + " " + d.e;
    const ag = d.a;
    return { x, ag, raw: d };
}
function getUser(id) {
    const user = { name: "Rue", email: "rue@email.com", age: 25 };
    return user;
}
function formatUserSummary(user) {
    return `${user.name} (${user.email})`;
}
function proc(d, f) {
    const r = [];
    for (let i = 0; i < d.length; i++) {
        if (d[i].length > f) {
            r.push(d[i].toUpperCase());
        }
    }
    return r;
}
function getCapitalizedLongWords(words, minimumLength) {
    const longWords = words.filter(word => isLongerThan(word, minimumLength));
    const capitalizedWords = longWords.map(word => capitalize(word));
    return capitalizedWords;
}
function isLongerThan(word, minimumLength) {
    return word.length > minimumLength;
}
function capitalize(word) {
    return word.toUpperCase();
}
const rawNumbers = [5, 3, 8, 3, 1, 8, 2, 5];
console.log("Unique sorted numbers:", getUniqueSortedNumbers(rawNumbers));
const user = getUser(1);
console.log("User summary:", formatUserSummary(user));
console.log("User details:", user);
const sampleWords = ["hi", "clean", "code", "readability", "go", "prose"];
console.log("Capitalized long words:", getCapitalizedLongWords(sampleWords, 3));
