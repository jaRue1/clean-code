"use strict";
function isAdult(age) {
    return age >= 18;
}
function isEligibleToVote(age) {
    const minimumVotingAge = 18;
    return age >= minimumVotingAge;
}
function processEmployees(employees) {
    const results = [];
    for (const employee of employees) {
        if (employee.salary > 50000 && employee.department === "engineering") {
            const bonus = employee.salary * 0.1;
            results.push(`${employee.name}: $${bonus.toFixed(2)} bonus`);
        }
    }
    return results;
}
function isEligibleForBonus(employee) {
    return employee.salary > 50000 && employee.department === "engineering";
}
function calculateBonus(salary) {
    const bonusRate = 0.1;
    return salary * bonusRate;
}
function formatBonusNotification(name, bonus) {
    return `${name}: $${bonus.toFixed(2)} bonus`;
}
function getBonusNotifications(employees) {
    return employees
        .filter(isEligibleForBonus)
        .map(employee => formatBonusNotification(employee.name, calculateBonus(employee.salary)));
}
function getDiscountRate(customerType) {
    if (customerType === "premium")
        return 0.2;
    if (customerType === "standard")
        return 0.1;
    return 0;
}
function rebuildSearchIndex(documents) {
    const indexed = [];
    for (const doc of documents) {
        indexed.push(`indexed:${doc}`);
    }
    return indexed;
}
function compareRankings(a, b) {
    return a - b;
}
function calculateTaxBad(income) {
    if (income <= 0)
        return 0;
    return income * 0.3;
}
function calculateTax(income) {
    if (income <= 0)
        return 0;
    const taxRate = 0.3;
    return income * taxRate;
}
function getServerPort() {
    const defaultPort = 3000;
    return defaultPort;
}
function getDefaultPort() {
    return 3000;
}
function processAllDataBad(items) {
    const results = [];
    for (const item of items) {
        if (item.length > 0) {
            if (item.startsWith("valid")) {
                results.push(item.toUpperCase());
            }
        }
    }
    return results;
}
function isNonEmpty(item) {
    return item.length > 0;
}
function isValid(item) {
    return item.startsWith("valid");
}
function processAllData(items) {
    return items
        .filter(isNonEmpty)
        .filter(isValid)
        .map(item => item.toUpperCase());
}
console.log("Is 21 eligible to vote:", isEligibleToVote(21));
console.log("Is 16 eligible to vote:", isEligibleToVote(16));
const employees = [
    { name: "Alice", salary: 75000, department: "engineering" },
    { name: "Bob", salary: 45000, department: "engineering" },
    { name: "Carol", salary: 80000, department: "marketing" },
    { name: "Dave", salary: 60000, department: "engineering" },
];
console.log("Bonus notifications:", getBonusNotifications(employees));
console.log("Premium discount:", getDiscountRate("premium"));
console.log("Search index:", rebuildSearchIndex(["doc1", "doc2", "doc3"]));
console.log("Tax on 50000:", calculateTax(50000));
console.log("Default port:", getDefaultPort());
console.log("Processed data:", processAllData(["valid-item", "invalid", "valid-entry", ""]));
