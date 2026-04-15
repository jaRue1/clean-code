"use strict";
function parseDateString(dateStr) {
    const parts = dateStr.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    return { year, month, day };
}
function isValidYear(year) {
    return year >= 1900 && year <= 2100;
}
function isValidMonth(month) {
    return month >= 1 && month <= 12;
}
function isValidDay(day) {
    return day >= 1 && day <= 31;
}
function validateDateBad(dateStr) {
    const parsed = parseDateString(dateStr);
    return isValidYear(parsed.year) && isValidMonth(parsed.month) && isValidDay(parsed.day);
}
function validateDate(dateStr) {
    const date = parseDate(dateStr);
    return isYearInRange(date.year) && isMonthInRange(date.month) && isDayInRange(date.day);
}
function parseDate(dateStr) {
    const [yearStr, monthStr, dayStr] = dateStr.split("-");
    return {
        year: parseInt(yearStr, 10),
        month: parseInt(monthStr, 10),
        day: parseInt(dayStr, 10),
    };
}
function isYearInRange(year) {
    return year >= 1900 && year <= 2100;
}
function isMonthInRange(month) {
    return month >= 1 && month <= 12;
}
function isDayInRange(day) {
    return day >= 1 && day <= 31;
}
function generateReportBad(data) {
    const grouped = groupByCategory(data);
    const totals = calculateCategoryTotals(grouped);
    return formatReport(totals);
}
function unrelatedUtilityA() {
    return "I don't belong between generateReport and its helpers";
}
function unrelatedUtilityB() {
    return 42;
}
function groupByCategory(data) {
    const grouped = new Map();
    for (const item of data) {
        const existing = grouped.get(item.category) || [];
        existing.push(item.amount);
        grouped.set(item.category, existing);
    }
    return grouped;
}
function calculateCategoryTotals(grouped) {
    const totals = new Map();
    grouped.forEach((amounts, category) => {
        totals.set(category, amounts.reduce((sum, val) => sum + val, 0));
    });
    return totals;
}
function formatReport(totals) {
    const lines = [];
    totals.forEach((total, category) => {
        lines.push(`${category}: $${total.toFixed(2)}`);
    });
    return lines.join(" | ");
}
function generateReport(data) {
    const grouped = groupDataByCategory(data);
    const totals = sumByCategory(grouped);
    return formatCategoryReport(totals);
}
function groupDataByCategory(data) {
    const grouped = new Map();
    for (const item of data) {
        const existing = grouped.get(item.category) || [];
        existing.push(item.amount);
        grouped.set(item.category, existing);
    }
    return grouped;
}
function sumByCategory(grouped) {
    const totals = new Map();
    grouped.forEach((amounts, category) => {
        totals.set(category, amounts.reduce((sum, val) => sum + val, 0));
    });
    return totals;
}
function formatCategoryReport(totals) {
    const lines = [];
    totals.forEach((total, category) => {
        lines.push(`${category}: $${total.toFixed(2)}`);
    });
    return lines.join(" | ");
}
function getEligibleUserNamesBad(users) {
    const result = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].active) {
            if (users[i].age >= 18) {
                for (let j = 0; j < users[i].roles.length; j++) {
                    if (users[i].roles[j] === "admin" || users[i].roles[j] === "editor") {
                        result.push(users[i].name);
                        break;
                    }
                }
            }
        }
    }
    return result;
}
function getEligibleUserNames(users) {
    return users
        .filter(isActiveAdult)
        .filter(hasPrivilegedRole)
        .map(user => user.name);
}
function isActiveAdult(user) {
    return user.active && user.age >= 18;
}
function hasPrivilegedRole(user) {
    const privilegedRoles = ["admin", "editor"];
    return user.roles.some(role => privilegedRoles.indexOf(role) !== -1);
}
console.log("Valid date '2024-06-15':", validateDate("2024-06-15"));
console.log("Valid date '1800-13-45':", validateDate("1800-13-45"));
const salesData = [
    { category: "Electronics", amount: 299.99 },
    { category: "Books", amount: 15.99 },
    { category: "Electronics", amount: 149.50 },
    { category: "Books", amount: 24.99 },
    { category: "Clothing", amount: 75.00 },
];
console.log("Report:", generateReport(salesData));
const users = [
    { name: "Alice", age: 30, active: true, roles: ["admin", "user"] },
    { name: "Bob", age: 17, active: true, roles: ["admin"] },
    { name: "Carol", age: 25, active: false, roles: ["editor"] },
    { name: "Dave", age: 40, active: true, roles: ["user"] },
    { name: "Eve", age: 28, active: true, roles: ["editor", "user"] },
];
console.log("Eligible users:", getEligibleUserNames(users));
