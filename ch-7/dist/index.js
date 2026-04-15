"use strict";
function badFetchUserData(userId) {
    if (userId <= 0) {
        return { status: -1, data: null };
    }
    if (userId > 1000) {
        return { status: -2, data: null };
    }
    return { status: 0, data: `User_${userId}` };
}
function badProcessUser(userId) {
    const result = badFetchUserData(userId);
    if (result.status === -1) {
        return "Error: invalid user ID";
    }
    if (result.status === -2) {
        return "Error: user not found";
    }
    return `Processed: ${result.data}`;
}
class InvalidUserIdError extends Error {
    constructor(userId) {
        super(`Invalid user ID: ${userId}`);
        this.name = "InvalidUserIdError";
    }
}
class UserNotFoundError extends Error {
    constructor(userId) {
        super(`User not found: ${userId}`);
        this.name = "UserNotFoundError";
    }
}
function goodFetchUserData(userId) {
    if (userId <= 0)
        throw new InvalidUserIdError(userId);
    if (userId > 1000)
        throw new UserNotFoundError(userId);
    return `User_${userId}`;
}
function goodProcessUser(userId) {
    try {
        const data = goodFetchUserData(userId);
        return `Processed: ${data}`;
    }
    catch (error) {
        if (error instanceof Error) {
            return `Error: ${error.message}`;
        }
        return "Error: unknown failure";
    }
}
function badGetEmployees() {
    const employees = [];
    if (employees.length === 0) {
        return null;
    }
    return employees;
}
function badCountEmployees() {
    const employees = badGetEmployees();
    if (employees !== null) {
        return `Employee count: ${employees.length}`;
    }
    return "No employees found";
}
function goodGetEmployees() {
    const employees = [];
    return employees;
}
function goodCountEmployees() {
    const employees = goodGetEmployees();
    return `Employee count: ${employees.length}`;
}
function getEmployeeById(id) {
    const employees = { 1: "Alice", 2: "Bob" };
    const employee = employees[id];
    if (!employee) {
        throw new Error(`Employee with ID ${id} does not exist`);
    }
    return employee;
}
function badCalculateArea(width, height) {
    if (width === null || height === null) {
        return -1;
    }
    return width * height;
}
function goodCalculateArea(width, height) {
    if (width <= 0 || height <= 0) {
        throw new Error(`Dimensions must be positive. Received width=${width}, height=${height}`);
    }
    return width * height;
}
function calculateVolume(width, height, depth = 1) {
    return width * height * depth;
}
class NetworkError extends Error {
    constructor(message) { super(message); this.name = "NetworkError"; }
}
class TimeoutError extends Error {
    constructor(message) { super(message); this.name = "TimeoutError"; }
}
class AuthError extends Error {
    constructor(message) { super(message); this.name = "AuthError"; }
}
function simulateApiCall(scenario) {
    if (scenario === "network")
        throw new NetworkError("Connection refused");
    if (scenario === "timeout")
        throw new TimeoutError("Request timed out");
    if (scenario === "auth")
        throw new AuthError("Invalid token");
    return `Response for ${scenario}`;
}
function badCallApi(scenario) {
    try {
        return simulateApiCall(scenario);
    }
    catch (error) {
        if (error instanceof NetworkError) {
            return `Network failure: ${error.message}`;
        }
        if (error instanceof TimeoutError) {
            return `Timeout failure: ${error.message}`;
        }
        if (error instanceof AuthError) {
            return `Auth failure: ${error.message}`;
        }
        return "Unknown error";
    }
}
class ApiError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "ApiError";
    }
}
class ApiClient {
    call(scenario) {
        try {
            return simulateApiCall(scenario);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ApiError(`API call failed: ${error.message}`, error);
            }
            throw new ApiError("API call failed with unknown error");
        }
    }
}
function goodCallApi(scenario) {
    const client = new ApiClient();
    try {
        return client.call(scenario);
    }
    catch (error) {
        if (error instanceof ApiError) {
            return `Handled: ${error.message}`;
        }
        return "Unknown error";
    }
}
console.log("Bad (return codes):", badProcessUser(-5));
console.log("Bad (return codes):", badProcessUser(42));
console.log("Good (exceptions):", goodProcessUser(-5));
console.log("Good (exceptions):", goodProcessUser(42));
console.log("Bad (returns null):", badCountEmployees());
console.log("Good (returns empty array):", goodCountEmployees());
try {
    console.log("Good (throws on missing):", getEmployeeById(1));
    console.log("Good (throws on missing):", getEmployeeById(99));
}
catch (error) {
    if (error instanceof Error) {
        console.log("Caught:", error.message);
    }
}
console.log("Bad (accepts null):", badCalculateArea(null, 5));
console.log("Good (rejects invalid):");
try {
    console.log(goodCalculateArea(4, 5));
    console.log(goodCalculateArea(-1, 5));
}
catch (error) {
    if (error instanceof Error) {
        console.log("Caught:", error.message);
    }
}
console.log("Good (default depth):", calculateVolume(4, 5));
console.log("Good (explicit depth):", calculateVolume(4, 5, 3));
console.log("Bad (many catches):", badCallApi("timeout"));
console.log("Good (wrapped):", goodCallApi("timeout"));
console.log("Good (wrapped, success):", goodCallApi("ok"));
