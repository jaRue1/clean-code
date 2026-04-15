"use strict";
function processOrder(items) {
    let total = 0;
    for (const item of items) {
        if (item.price < 0 || item.qty < 0) {
            console.log("Invalid item: " + item.name);
            continue;
        }
        total += item.price * item.qty;
    }
    const tax = total * 0.08;
    const finalTotal = total + tax;
    return `Order Total: $${total.toFixed(2)} + Tax: $${tax.toFixed(2)} = $${finalTotal.toFixed(2)}`;
}
function calculateSubtotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function calculateTax(subtotal) {
    return subtotal * 0.08;
}
function formatOrderSummary(subtotal, tax) {
    const total = subtotal + tax;
    return `Order Total: $${subtotal.toFixed(2)} + Tax: $${tax.toFixed(2)} = $${total.toFixed(2)}`;
}
function renderUserProfile(userId) {
    const headers = { "Content-Type": "application/json", Authorization: "Bearer token123" };
    const response = fetch(`https://api.example.com/users/${userId}`, { headers });
    const html = `<div class="profile"><h1>${userId}</h1></div>`;
    return html;
}
function renderProfile(userId) {
    const user = fetchUser(userId);
    const validatedUser = validateUser(user);
    return buildProfileHtml(validatedUser);
}
function fetchUser(userId) {
    return { id: userId, name: "Rue" };
}
function validateUser(user) {
    if (!user.id || !user.name)
        throw new Error("Invalid user");
    return user;
}
function buildProfileHtml(user) {
    return `<div class="profile"><h1>${user.name}</h1></div>`;
}
function getCurrentTimestamp() {
    return Date.now();
}
function isValid(email) {
    return email.includes("@");
}
function createPoint(x, y) {
    return { x, y };
}
function createUser(name, email, role) {
    return { name, email, role };
}
function sendNotification(to, from, subject, body, isUrgent) {
    return { to, from, subject, body, isUrgent };
}
function sendNotificationClean(config) {
    return config;
}
const notification = sendNotificationClean({
    to: "user@email.com",
    from: "admin@email.com",
    subject: "Welcome",
    body: "Hello!",
    isUrgent: false,
});
function getUsers(includeInactive) {
    if (includeInactive) {
        return ["active1", "active2", "inactive1"];
    }
    return ["active1", "active2"];
}
function getActiveUsers() {
    return ["active1", "active2"];
}
function getAllUsers() {
    return ["active1", "active2", "inactive1"];
}
function divide(a, b) {
    if (typeof a !== "number" || typeof b !== "number") {
        console.error("Invalid input");
        return "Error";
    }
    if (b === 0) {
        console.error("Cannot divide by zero");
        return "Error";
    }
    const result = a / b;
    if (!isFinite(result)) {
        console.error("Result is not finite");
        return "Error";
    }
    return result.toFixed(2);
}
function safeDivide(a, b) {
    try {
        return performDivision(a, b);
    }
    catch (error) {
        handleMathError(error);
        return 0;
    }
}
function performDivision(a, b) {
    if (b === 0)
        throw new Error("Cannot divide by zero");
    return a / b;
}
function handleMathError(error) {
    if (error instanceof Error) {
        console.error(`Math error: ${error.message}`);
    }
}
function createAdmin(name, email) {
    if (!name || name.length < 2)
        throw new Error("Invalid name");
    if (!email || !email.includes("@"))
        throw new Error("Invalid email");
    return { name, email, role: "admin" };
}
function createEditor(name, email) {
    if (!name || name.length < 2)
        throw new Error("Invalid name");
    if (!email || !email.includes("@"))
        throw new Error("Invalid email");
    return { name, email, role: "editor" };
}
function validateInput(name, email) {
    if (!name || name.length < 2)
        throw new Error("Invalid name");
    if (!email || !email.includes("@"))
        throw new Error("Invalid email");
}
function createMember(name, email, role) {
    validateInput(name, email);
    return { name, email, role };
}
const items = [
    { name: "Book", price: 15.99, qty: 2 },
    { name: "Pen", price: 1.5, qty: 5 },
];
const subtotal = calculateSubtotal(items);
const tax = calculateTax(subtotal);
console.log(formatOrderSummary(subtotal, tax));
console.log("Timestamp:", getCurrentTimestamp());
console.log("Valid email:", isValid("rue@email.com"));
console.log("Point:", createPoint(10, 20));
console.log("Active users:", getActiveUsers());
console.log("All users:", getAllUsers());
console.log("10 / 3 =", safeDivide(10, 3));
console.log("10 / 0 =", safeDivide(10, 0));
console.log(createMember("Rue", "rue@email.com", "admin"));
console.log(createMember("Jay", "jay@email.com", "editor"));
