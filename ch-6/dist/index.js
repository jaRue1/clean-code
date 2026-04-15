"use strict";
class BadPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class GoodPoint {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    setCartesian(x, y) {
        this.x = x;
        this.y = y;
    }
    getR() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    getTheta() {
        return Math.atan2(this.y, this.x);
    }
    setPolar(r, theta) {
        this.x = r * Math.cos(theta);
        this.y = r * Math.sin(theta);
    }
}
class BadVehicle {
    constructor(capacity, fuel) {
        this.fuelTankCapacityInGallons = capacity;
        this.gallonsOfFuel = fuel;
    }
}
class GoodVehicle {
    constructor(capacity, fuel) {
        this.fuelTankCapacity = capacity;
        this.currentFuel = fuel;
    }
    getFuelPercentRemaining() {
        return (this.currentFuel / this.fuelTankCapacity) * 100;
    }
}
class Engine {
    constructor(temperature) {
        this.temperature = temperature;
    }
    getTemperature() {
        return this.temperature;
    }
    isOverheating() {
        return this.temperature > 200;
    }
}
class Car {
    constructor(engine) {
        this.engine = engine;
    }
    getEngine() {
        return this.engine;
    }
    needsCooldown() {
        return this.engine.isOverheating();
    }
}
class Garage {
    constructor(car) {
        this.car = car;
    }
    getCar() {
        return this.car;
    }
}
function badCheckTemperature(garage) {
    return garage.getCar().getEngine().getTemperature();
}
function goodCheckOverheating(car) {
    return car.needsCooldown();
}
function proceduralArea(shape) {
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
function proceduralPerimeter(shape) {
    switch (shape.kind) {
        case "circle":
            return 2 * Math.PI * shape.radius;
        case "rectangle":
            return 2 * (shape.width + shape.height);
        case "triangle":
            const side = Math.sqrt(Math.pow((shape.base / 2), 2) + Math.pow(shape.height, 2));
            return shape.base + 2 * side;
        default:
            throw new Error("Unknown shape");
    }
}
class Shape {
}
class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    area() {
        return Math.PI * this.radius * this.radius;
    }
    perimeter() {
        return 2 * Math.PI * this.radius;
    }
}
class Rectangle extends Shape {
    constructor(width, height) {
        super();
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
class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }
    area() {
        return 0.5 * this.base * this.height;
    }
    perimeter() {
        const side = Math.sqrt(Math.pow((this.base / 2), 2) + Math.pow(this.height, 2));
        return this.base + 2 * side;
    }
}
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
const engine = new Engine(220);
const car = new Car(engine);
const garage = new Garage(car);
console.log("Bad (train wreck):", badCheckTemperature(garage));
console.log("Good (tell don't ask):", goodCheckOverheating(car));
const circleData = { kind: "circle", radius: 5 };
const rectData = { kind: "rectangle", width: 4, height: 6 };
const triData = { kind: "triangle", base: 3, height: 4 };
console.log("Procedural circle area:", proceduralArea(circleData).toFixed(2));
console.log("Procedural rect area:", proceduralArea(rectData).toFixed(2));
console.log("Procedural tri area:", proceduralArea(triData).toFixed(2));
const ooCircle = new Circle(5);
const ooRect = new Rectangle(4, 6);
const ooTri = new Triangle(3, 4);
console.log("OO circle area:", ooCircle.area().toFixed(2));
console.log("OO rect area:", ooRect.area().toFixed(2));
console.log("OO tri area:", ooTri.area().toFixed(2));
