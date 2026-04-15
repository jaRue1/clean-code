"use strict";
function calc(d) {
    let r = 0;
    for (let i = 0; i < d.length; i++) {
        let t = 0;
        for (let j = 0; j < d[i].s.length; j++) {
            t += d[i].s[j];
        }
        r += t / d[i].s.length >= 70 ? 1 : 0;
    }
    return r;
}
function calculateAverageScore(scores) {
    const total = scores.reduce((sum, score) => sum + score, 0);
    return total / scores.length;
}
function isPassingStudent(student) {
    const passingThreshold = 70;
    const averageScore = calculateAverageScore(student.scores);
    return averageScore >= passingThreshold;
}
function countPassingStudents(students) {
    return students.filter(isPassingStudent).length;
}
function generateSalesReport(data) {
    let report = "=== SALES REPORT ===\n";
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += "--------------------\n";
    for (const entry of data) {
        report += `${entry.month}: $${entry.revenue.toFixed(2)}\n`;
    }
    report += "--------------------\n";
    const total = data.reduce((sum, entry) => sum + entry.revenue, 0);
    report += `Total: $${total.toFixed(2)}\n`;
    report += "=== END REPORT ===\n";
    return report;
}
function generateInventoryReport(data) {
    let report = "=== INVENTORY REPORT ===\n";
    report += `Generated: ${new Date().toLocaleDateString()}\n`;
    report += "--------------------\n";
    for (const entry of data) {
        report += `${entry.item}: ${entry.quantity} units\n`;
    }
    report += "--------------------\n";
    const total = data.reduce((sum, entry) => sum + entry.quantity, 0);
    report += `Total: ${total} units\n`;
    report += "=== END REPORT ===\n";
    return report;
}
function generateReport(title, formatBody, formatTotal) {
    const lines = [];
    lines.push(`=== ${title} ===`);
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push("--------------------");
    lines.push(...formatBody());
    lines.push("--------------------");
    lines.push(formatTotal());
    lines.push("=== END REPORT ===");
    return lines.join("\n") + "\n";
}
function buildSalesReport(data) {
    return generateReport("SALES REPORT", () => data.map((entry) => `${entry.month}: $${entry.revenue.toFixed(2)}`), () => {
        const total = data.reduce((sum, entry) => sum + entry.revenue, 0);
        return `Total: $${total.toFixed(2)}`;
    });
}
function buildInventoryReport(data) {
    return generateReport("INVENTORY REPORT", () => data.map((entry) => `${entry.item}: ${entry.quantity} units`), () => {
        const total = data.reduce((sum, entry) => sum + entry.quantity, 0);
        return `Total: ${total} units`;
    });
}
class UpperCaseFormatter {
    format(input) {
        return input.toUpperCase();
    }
}
class LowerCaseFormatter {
    format(input) {
        return input.toLowerCase();
    }
}
class TitleCaseFormatter {
    format(input) {
        return input
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ");
    }
}
class StringFormatterFactory {
    createFormatter(type) {
        switch (type) {
            case "upper":
                return new UpperCaseFormatter();
            case "lower":
                return new LowerCaseFormatter();
            case "title":
                return new TitleCaseFormatter();
            default:
                throw new Error(`Unknown formatter type: ${type}`);
        }
    }
}
const factory = new StringFormatterFactory();
const formatter = factory.createFormatter("title");
const _overEngineeredResult = formatter.format("hello world");
function formatString(input, style) {
    switch (style) {
        case "upper":
            return input.toUpperCase();
        case "lower":
            return input.toLowerCase();
        case "title":
            return input
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
    }
}
const students = [
    { name: "Alice", age: 20, scores: [85, 92, 78] },
    { name: "Bob", age: 22, scores: [55, 60, 65] },
    { name: "Carol", age: 21, scores: [90, 88, 95] },
];
const crypticResult = calc(students.map((s) => ({ n: s.name, a: s.age, s: s.scores })));
console.log("Cryptic calc result:", crypticResult);
const passingCount = countPassingStudents(students);
console.log("Passing students:", passingCount);
const salesData = [
    { month: "January", revenue: 15000 },
    { month: "February", revenue: 18500 },
];
const inventoryData = [
    { item: "Widgets", quantity: 150 },
    { item: "Gadgets", quantity: 75 },
];
console.log("\n--- Extracted Template Method ---");
console.log(buildSalesReport(salesData));
console.log(buildInventoryReport(inventoryData));
console.log("--- Minimal Design ---");
console.log(formatString("hello world", "title"));
console.log(formatString("hello world", "upper"));
console.log(formatString("HELLO WORLD", "lower"));
