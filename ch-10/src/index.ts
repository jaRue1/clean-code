// Classes
// "The first rule of classes is that they should be small. The second rule is that they should be smaller than that."

// ============================================================================
// 1. Single Responsibility Principle (SRP) Violation
// ============================================================================

// Bad - UserManager handles authentication, profile management, AND notifications
class UserManager {
  private users: { email: string; name: string; password: string }[] = [];

  // Authentication responsibility
  authenticate(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email);
    if (!user) return false;
    return user.password === password;
  }

  resetPassword(email: string, newPassword: string): void {
    const user = this.users.find((u) => u.email === email);
    if (user) user.password = newPassword;
  }

  // Profile responsibility
  register(email: string, name: string, password: string): void {
    this.users.push({ email, name, password });
  }

  updateProfile(email: string, name: string): void {
    const user = this.users.find((u) => u.email === email);
    if (user) user.name = name;
  }

  getProfile(email: string): { email: string; name: string } | undefined {
    const user = this.users.find((u) => u.email === email);
    if (user) return { email: user.email, name: user.name };
    return undefined;
  }

  // Notification responsibility
  sendWelcomeEmail(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }

  sendPasswordResetEmail(email: string): void {
    console.log(`Sending password reset email to ${email}`);
  }
}

// Good - each class has a single reason to change

interface UserRecord {
  email: string;
  name: string;
  password: string;
}

class UserRepository {
  private users: UserRecord[] = [];

  add(user: UserRecord): void {
    this.users.push(user);
  }

  findByEmail(email: string): UserRecord | undefined {
    return this.users.find((u) => u.email === email);
  }

  update(email: string, data: Partial<UserRecord>): void {
    const user = this.findByEmail(email);
    if (user) Object.assign(user, data);
  }
}

class AuthenticationService {
  constructor(private userRepo: UserRepository) {}

  authenticate(email: string, password: string): boolean {
    const user = this.userRepo.findByEmail(email);
    if (!user) return false;
    return user.password === password;
  }

  resetPassword(email: string, newPassword: string): void {
    this.userRepo.update(email, { password: newPassword });
  }
}

class ProfileService {
  constructor(private userRepo: UserRepository) {}

  register(email: string, name: string, password: string): void {
    this.userRepo.add({ email, name, password });
  }

  updateName(email: string, name: string): void {
    this.userRepo.update(email, { name });
  }

  getProfile(email: string): { email: string; name: string } | undefined {
    const user = this.userRepo.findByEmail(email);
    if (user) return { email: user.email, name: user.name };
    return undefined;
  }
}

class NotificationService {
  sendWelcomeEmail(email: string): void {
    console.log(`Sending welcome email to ${email}`);
  }

  sendPasswordResetEmail(email: string): void {
    console.log(`Sending password reset email to ${email}`);
  }
}

// ============================================================================
// 2. Cohesion
// ============================================================================

// Bad - low cohesion: methods only use some of the fields
class ReportGenerator {
  private title: string;
  private data: number[];
  private headerColor: string;
  private footerText: string;
  private pageSize: number;

  constructor(
    title: string,
    data: number[],
    headerColor: string,
    footerText: string,
    pageSize: number
  ) {
    this.title = title;
    this.data = data;
    this.headerColor = headerColor;
    this.footerText = footerText;
    this.pageSize = pageSize;
  }

  // Only uses title and data
  calculateTotal(): number {
    return this.data.reduce((sum, n) => sum + n, 0);
  }

  calculateAverage(): number {
    return this.calculateTotal() / this.data.length;
  }

  getSummary(): string {
    return `${this.title}: total=${this.calculateTotal()}, avg=${this.calculateAverage().toFixed(2)}`;
  }

  // Only uses headerColor, footerText, pageSize
  getHeaderStyle(): string {
    return `color: ${this.headerColor}`;
  }

  getFooter(): string {
    return this.footerText;
  }

  getPageSize(): number {
    return this.pageSize;
  }
}

// Good - split into cohesive classes where every method uses the class fields

class ReportData {
  constructor(
    private title: string,
    private data: number[]
  ) {}

  calculateTotal(): number {
    return this.data.reduce((sum, n) => sum + n, 0);
  }

  calculateAverage(): number {
    return this.calculateTotal() / this.data.length;
  }

  getSummary(): string {
    return `${this.title}: total=${this.calculateTotal()}, avg=${this.calculateAverage().toFixed(2)}`;
  }
}

class ReportLayout {
  constructor(
    private headerColor: string,
    private footerText: string,
    private pageSize: number
  ) {}

  getHeaderStyle(): string {
    return `color: ${this.headerColor}`;
  }

  getFooter(): string {
    return this.footerText;
  }

  getPageSize(): number {
    return this.pageSize;
  }
}

// ============================================================================
// 3. Open/Closed Principle
// ============================================================================

// Bad - switch statement means modifying the class whenever a new shape is added
class ShapeCalculatorBad {
  calculateArea(shape: { type: string; width?: number; height?: number; radius?: number }): number {
    switch (shape.type) {
      case "rectangle":
        return (shape.width ?? 0) * (shape.height ?? 0);
      case "circle":
        return Math.PI * (shape.radius ?? 0) ** 2;
      case "triangle":
        return ((shape.width ?? 0) * (shape.height ?? 0)) / 2;
      default:
        throw new Error(`Unknown shape: ${shape.type}`);
    }
  }

  calculatePerimeter(shape: { type: string; width?: number; height?: number; radius?: number }): number {
    switch (shape.type) {
      case "rectangle":
        return 2 * ((shape.width ?? 0) + (shape.height ?? 0));
      case "circle":
        return 2 * Math.PI * (shape.radius ?? 0);
      case "triangle":
        return (shape.width ?? 0) + (shape.height ?? 0) + Math.sqrt((shape.width ?? 0) ** 2 + (shape.height ?? 0) ** 2);
      default:
        throw new Error(`Unknown shape: ${shape.type}`);
    }
  }
}

// Good - polymorphism: open for extension, closed for modification
interface Shape {
  area(): number;
  perimeter(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number
  ) {}

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Circle implements Shape {
  constructor(private radius: number) {}

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Triangle implements Shape {
  constructor(
    private base: number,
    private height: number,
    private sideA: number,
    private sideB: number
  ) {}

  area(): number {
    return (this.base * this.height) / 2;
  }

  perimeter(): number {
    return this.base + this.sideA + this.sideB;
  }
}

// Adding a new shape requires NO changes to existing code
class Trapezoid implements Shape {
  constructor(
    private topBase: number,
    private bottomBase: number,
    private height: number,
    private leftSide: number,
    private rightSide: number
  ) {}

  area(): number {
    return ((this.topBase + this.bottomBase) / 2) * this.height;
  }

  perimeter(): number {
    return this.topBase + this.bottomBase + this.leftSide + this.rightSide;
  }
}

function printShapeInfo(shape: Shape): void {
  console.log(`  Area: ${shape.area().toFixed(2)}`);
  console.log(`  Perimeter: ${shape.perimeter().toFixed(2)}`);
}

// ============================================================================
// Run examples
// ============================================================================

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
const shapes: Shape[] = [
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
