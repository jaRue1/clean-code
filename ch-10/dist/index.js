"use strict";
class UserManager {
    constructor() {
        this.users = [];
    }
    authenticate(email, password) {
        const user = this.users.find((u) => u.email === email);
        if (!user)
            return false;
        return user.password === password;
    }
    resetPassword(email, newPassword) {
        const user = this.users.find((u) => u.email === email);
        if (user)
            user.password = newPassword;
    }
    register(email, name, password) {
        this.users.push({ email, name, password });
    }
    updateProfile(email, name) {
        const user = this.users.find((u) => u.email === email);
        if (user)
            user.name = name;
    }
    getProfile(email) {
        const user = this.users.find((u) => u.email === email);
        if (user)
            return { email: user.email, name: user.name };
        return undefined;
    }
    sendWelcomeEmail(email) {
        console.log(`Sending welcome email to ${email}`);
    }
    sendPasswordResetEmail(email) {
        console.log(`Sending password reset email to ${email}`);
    }
}
class UserRepository {
    constructor() {
        this.users = [];
    }
    add(user) {
        this.users.push(user);
    }
    findByEmail(email) {
        return this.users.find((u) => u.email === email);
    }
    update(email, data) {
        const user = this.findByEmail(email);
        if (user)
            Object.assign(user, data);
    }
}
class AuthenticationService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    authenticate(email, password) {
        const user = this.userRepo.findByEmail(email);
        if (!user)
            return false;
        return user.password === password;
    }
    resetPassword(email, newPassword) {
        this.userRepo.update(email, { password: newPassword });
    }
}
class ProfileService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    register(email, name, password) {
        this.userRepo.add({ email, name, password });
    }
    updateName(email, name) {
        this.userRepo.update(email, { name });
    }
    getProfile(email) {
        const user = this.userRepo.findByEmail(email);
        if (user)
            return { email: user.email, name: user.name };
        return undefined;
    }
}
class NotificationService {
    sendWelcomeEmail(email) {
        console.log(`Sending welcome email to ${email}`);
    }
    sendPasswordResetEmail(email) {
        console.log(`Sending password reset email to ${email}`);
    }
}
class ReportGenerator {
    constructor(title, data, headerColor, footerText, pageSize) {
        this.title = title;
        this.data = data;
        this.headerColor = headerColor;
        this.footerText = footerText;
        this.pageSize = pageSize;
    }
    calculateTotal() {
        return this.data.reduce((sum, n) => sum + n, 0);
    }
    calculateAverage() {
        return this.calculateTotal() / this.data.length;
    }
    getSummary() {
        return `${this.title}: total=${this.calculateTotal()}, avg=${this.calculateAverage().toFixed(2)}`;
    }
    getHeaderStyle() {
        return `color: ${this.headerColor}`;
    }
    getFooter() {
        return this.footerText;
    }
    getPageSize() {
        return this.pageSize;
    }
}
class ReportData {
    constructor(title, data) {
        this.title = title;
        this.data = data;
    }
    calculateTotal() {
        return this.data.reduce((sum, n) => sum + n, 0);
    }
    calculateAverage() {
        return this.calculateTotal() / this.data.length;
    }
    getSummary() {
        return `${this.title}: total=${this.calculateTotal()}, avg=${this.calculateAverage().toFixed(2)}`;
    }
}
class ReportLayout {
    constructor(headerColor, footerText, pageSize) {
        this.headerColor = headerColor;
        this.footerText = footerText;
        this.pageSize = pageSize;
    }
    getHeaderStyle() {
        return `color: ${this.headerColor}`;
    }
    getFooter() {
        return this.footerText;
    }
    getPageSize() {
        return this.pageSize;
    }
}
class ShapeCalculatorBad {
    calculateArea(shape) {
        var _a, _b, _c, _d, _e;
        switch (shape.type) {
            case "rectangle":
                return ((_a = shape.width) !== null && _a !== void 0 ? _a : 0) * ((_b = shape.height) !== null && _b !== void 0 ? _b : 0);
            case "circle":
                return Math.PI * Math.pow(((_c = shape.radius) !== null && _c !== void 0 ? _c : 0), 2);
            case "triangle":
                return (((_d = shape.width) !== null && _d !== void 0 ? _d : 0) * ((_e = shape.height) !== null && _e !== void 0 ? _e : 0)) / 2;
            default:
                throw new Error(`Unknown shape: ${shape.type}`);
        }
    }
    calculatePerimeter(shape) {
        var _a, _b, _c, _d, _e, _f, _g;
        switch (shape.type) {
            case "rectangle":
                return 2 * (((_a = shape.width) !== null && _a !== void 0 ? _a : 0) + ((_b = shape.height) !== null && _b !== void 0 ? _b : 0));
            case "circle":
                return 2 * Math.PI * ((_c = shape.radius) !== null && _c !== void 0 ? _c : 0);
            case "triangle":
                return ((_d = shape.width) !== null && _d !== void 0 ? _d : 0) + ((_e = shape.height) !== null && _e !== void 0 ? _e : 0) + Math.sqrt(Math.pow(((_f = shape.width) !== null && _f !== void 0 ? _f : 0), 2) + Math.pow(((_g = shape.height) !== null && _g !== void 0 ? _g : 0), 2));
            default:
                throw new Error(`Unknown shape: ${shape.type}`);
        }
    }
}
class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    area() {
        return this.width * this.height;
    }
    perimeter() {
        return 2 * (this.width + this.height);
    }
}
class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    area() {
        return Math.PI * Math.pow(this.radius, 2);
    }
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}
class Triangle {
    constructor(base, height, sideA, sideB) {
        this.base = base;
        this.height = height;
        this.sideA = sideA;
        this.sideB = sideB;
    }
    area() {
        return (this.base * this.height) / 2;
    }
    perimeter() {
        return this.base + this.sideA + this.sideB;
    }
}
class Trapezoid {
    constructor(topBase, bottomBase, height, leftSide, rightSide) {
        this.topBase = topBase;
        this.bottomBase = bottomBase;
        this.height = height;
        this.leftSide = leftSide;
        this.rightSide = rightSide;
    }
    area() {
        return ((this.topBase + this.bottomBase) / 2) * this.height;
    }
    perimeter() {
        return this.topBase + this.bottomBase + this.leftSide + this.rightSide;
    }
}
function printShapeInfo(shape) {
    console.log(`  Area: ${shape.area().toFixed(2)}`);
    console.log(`  Perimeter: ${shape.perimeter().toFixed(2)}`);
}
console.log("=== Bad: SRP violation (UserManager does everything) ===");
const badManager = new UserManager();
badManager.register("rue@email.com", "Rue", "secret");
console.log("Authenticated:", badManager.authenticate("rue@email.com", "secret"));
console.log("Profile:", badManager.getProfile("rue@email.com"));
badManager.sendWelcomeEmail("rue@email.com");
console.log("\n=== Good: SRP (separate classes, single responsibility each) ===");
const userRepo = new UserRepository();
const authService = new AuthenticationService(userRepo);
const profileService = new ProfileService(userRepo);
const notificationService = new NotificationService();
profileService.register("rue@email.com", "Rue", "secret");
console.log("Authenticated:", authService.authenticate("rue@email.com", "secret"));
console.log("Profile:", profileService.getProfile("rue@email.com"));
notificationService.sendWelcomeEmail("rue@email.com");
console.log("\n=== Bad: Low cohesion (ReportGenerator) ===");
const badReport = new ReportGenerator("Sales", [100, 200, 300], "blue", "Page Footer", 25);
console.log(badReport.getSummary());
console.log("Header style:", badReport.getHeaderStyle());
console.log("\n=== Good: High cohesion (split into ReportData and ReportLayout) ===");
const reportData = new ReportData("Sales", [100, 200, 300]);
const reportLayout = new ReportLayout("blue", "Page Footer", 25);
console.log(reportData.getSummary());
console.log("Header style:", reportLayout.getHeaderStyle());
console.log("\n=== Bad: Open/Closed violation (switch statements) ===");
const badCalc = new ShapeCalculatorBad();
console.log("Rectangle area:", badCalc.calculateArea({ type: "rectangle", width: 5, height: 3 }));
console.log("Circle area:", badCalc.calculateArea({ type: "circle", radius: 4 }));
console.log("\n=== Good: Open/Closed Principle (polymorphism) ===");
const shapes = [
    new Rectangle(5, 3),
    new Circle(4),
    new Triangle(6, 4, 5, 5),
    new Trapezoid(3, 7, 4, 4.5, 4.5),
];
const shapeNames = ["Rectangle", "Circle", "Triangle", "Trapezoid"];
shapes.forEach((shape, i) => {
    console.log(`${shapeNames[i]}:`);
    printShapeInfo(shape);
});
