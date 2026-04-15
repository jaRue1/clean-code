// Objects and Data Structures
// "Objects hide their data behind abstractions and expose functions that operate on that data."

// ============================================================================
// 1. Data Abstraction
// ============================================================================

// Bad - exposing implementation details with public fields.
// Consumers are coupled to the internal representation.
class BadPoint {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// Good - hiding implementation behind an abstract interface.
// The consumer has no idea whether the implementation uses rectangular
// or polar coordinates internally.
interface Point {
  getX(): number;
  getY(): number;
  setCartesian(x: number, y: number): void;
  getR(): number;
  getTheta(): number;
  setPolar(r: number, theta: number): void;
}

class GoodPoint implements Point {
  private x: number = 0;
  private y: number = 0;

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  setCartesian(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  getR(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getTheta(): number {
    return Math.atan2(this.y, this.x);
  }

  setPolar(r: number, theta: number): void {
    this.x = r * Math.cos(theta);
    this.y = r * Math.sin(theta);
  }
}

// Bad - exposing the raw fuel level; callers depend on the unit (gallons).
class BadVehicle {
  public fuelTankCapacityInGallons: number;
  public gallonsOfFuel: number;

  constructor(capacity: number, fuel: number) {
    this.fuelTankCapacityInGallons = capacity;
    this.gallonsOfFuel = fuel;
  }
}

// Good - abstracting the concept as a percentage; implementation is hidden.
class GoodVehicle {
  private fuelTankCapacity: number;
  private currentFuel: number;

  constructor(capacity: number, fuel: number) {
    this.fuelTankCapacity = capacity;
    this.currentFuel = fuel;
  }

  getFuelPercentRemaining(): number {
    return (this.currentFuel / this.fuelTankCapacity) * 100;
  }
}

// ============================================================================
// 2. Law of Demeter Violation (Train Wrecks)
// ============================================================================

// Supporting classes for the example
class Engine {
  private temperature: number;

  constructor(temperature: number) {
    this.temperature = temperature;
  }

  getTemperature(): number {
    return this.temperature;
  }

  isOverheating(): boolean {
    return this.temperature > 200;
  }
}

class Car {
  private engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  getEngine(): Engine {
    return this.engine;
  }

  // Good - tell, don't ask. The car decides based on its own internals.
  needsCooldown(): boolean {
    return this.engine.isOverheating();
  }
}

class Garage {
  private car: Car;

  constructor(car: Car) {
    this.car = car;
  }

  getCar(): Car {
    return this.car;
  }
}

// Bad - Law of Demeter violation; reaching through a chain of objects.
// The caller knows the internal structure of Garage, Car, and Engine.
function badCheckTemperature(garage: Garage): number {
  return garage.getCar().getEngine().getTemperature();
}

// Good - tell, don't ask. Each object handles its own responsibility.
// The caller only talks to its immediate collaborator.
function goodCheckOverheating(car: Car): boolean {
  return car.needsCooldown();
}

// ============================================================================
// 3. Objects vs Data Structures (Procedural vs Polymorphic)
// ============================================================================

// --- Procedural approach (data structures + external functions) ---
// Easy to add new functions, hard to add new shapes.

interface ProceduralCircle {
  kind: "circle";
  radius: number;
}

interface ProceduralRectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface ProceduralTriangle {
  kind: "triangle";
  base: number;
  height: number;
}

type ProceduralShape = ProceduralCircle | ProceduralRectangle | ProceduralTriangle;

function proceduralArea(shape: ProceduralShape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius * shape.radius;
    case "rectangle":
      return shape.width * shape.height;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      throw new Error("Unknown shape");
  }
}

function proceduralPerimeter(shape: ProceduralShape): number {
  switch (shape.kind) {
    case "circle":
      return 2 * Math.PI * shape.radius;
    case "rectangle":
      return 2 * (shape.width + shape.height);
    case "triangle":
      // Simplified: assumes isoceles for demonstration
      const side = Math.sqrt((shape.base / 2) ** 2 + shape.height ** 2);
      return shape.base + 2 * side;
    default:
      throw new Error("Unknown shape");
  }
}

// --- Object-Oriented approach (polymorphic shapes) ---
// Easy to add new shapes, hard to add new functions across all shapes.

abstract class Shape {
  abstract area(): number;
  abstract perimeter(): number;
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius * this.radius;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  area(): number {
    return 0.5 * this.base * this.height;
  }

  perimeter(): number {
    const side = Math.sqrt((this.base / 2) ** 2 + this.height ** 2);
    return this.base + 2 * side;
  }
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Data Abstraction
const badPoint = new BadPoint(3, 4);
console.log("Bad Point (raw fields):", badPoint.x, badPoint.y);

const goodPoint = new GoodPoint();
goodPoint.setCartesian(3, 4);
console.log("Good Point (abstracted):", goodPoint.getX(), goodPoint.getY());
console.log("Good Point (polar r):", goodPoint.getR().toFixed(2));

const badCar = new BadVehicle(15, 7.5);
console.log("Bad Vehicle (raw gallons):", badCar.gallonsOfFuel, "/", badCar.fuelTankCapacityInGallons);

const goodCar = new GoodVehicle(15, 7.5);
console.log("Good Vehicle (abstracted %):", goodCar.getFuelPercentRemaining().toFixed(1) + "%");

// 2. Law of Demeter
const engine = new Engine(220);
const car = new Car(engine);
const garage = new Garage(car);

console.log("Bad (train wreck):", badCheckTemperature(garage));
console.log("Good (tell don't ask):", goodCheckOverheating(car));

// 3. Procedural vs OO
const circleData: ProceduralCircle = { kind: "circle", radius: 5 };
const rectData: ProceduralRectangle = { kind: "rectangle", width: 4, height: 6 };
const triData: ProceduralTriangle = { kind: "triangle", base: 3, height: 4 };

console.log("Procedural circle area:", proceduralArea(circleData).toFixed(2));
console.log("Procedural rect area:", proceduralArea(rectData).toFixed(2));
console.log("Procedural tri area:", proceduralArea(triData).toFixed(2));

const ooCircle = new Circle(5);
const ooRect = new Rectangle(4, 6);
const ooTri = new Triangle(3, 4);

console.log("OO circle area:", ooCircle.area().toFixed(2));
console.log("OO rect area:", ooRect.area().toFixed(2));
console.log("OO tri area:", ooTri.area().toFixed(2));
