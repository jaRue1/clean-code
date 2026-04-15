// Error Handling
// "Error handling is important, but if it obscures logic, it's wrong."

// ============================================================================
// 1. Return Codes vs Exceptions
// ============================================================================

// Bad - using return codes to signal errors.
// The caller must remember to check every return value, and the happy path
// is buried inside nested conditionals.
function badFetchUserData(userId: number): { status: number; data: string | null } {
  if (userId <= 0) {
    return { status: -1, data: null };
  }
  if (userId > 1000) {
    return { status: -2, data: null };
  }
  return { status: 0, data: `User_${userId}` };
}

function badProcessUser(userId: number): string {
  const result = badFetchUserData(userId);
  if (result.status === -1) {
    return "Error: invalid user ID";
  }
  if (result.status === -2) {
    return "Error: user not found";
  }
  return `Processed: ${result.data}`;
}

// Good - using exceptions so the happy path reads cleanly.
// Error handling is separated into its own block.
class InvalidUserIdError extends Error {
  constructor(userId: number) {
    super(`Invalid user ID: ${userId}`);
    this.name = "InvalidUserIdError";
  }
}

class UserNotFoundError extends Error {
  constructor(userId: number) {
    super(`User not found: ${userId}`);
    this.name = "UserNotFoundError";
  }
}

function goodFetchUserData(userId: number): string {
  if (userId <= 0) throw new InvalidUserIdError(userId);
  if (userId > 1000) throw new UserNotFoundError(userId);
  return `User_${userId}`;
}

function goodProcessUser(userId: number): string {
  try {
    const data = goodFetchUserData(userId);
    return `Processed: ${data}`;
  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    }
    return "Error: unknown failure";
  }
}

// ============================================================================
// 2. Don't Return Null
// ============================================================================

// Bad - returning null forces every caller to add null checks.
// Forgetting a single check leads to runtime crashes.
function badGetEmployees(): string[] | null {
  const employees: string[] = [];
  if (employees.length === 0) {
    return null;
  }
  return employees;
}

function badCountEmployees(): string {
  const employees = badGetEmployees();
  if (employees !== null) {
    return `Employee count: ${employees.length}`;
  }
  return "No employees found";
}

// Good - return an empty array instead of null.
// Callers can iterate safely without null checks.
function goodGetEmployees(): string[] {
  const employees: string[] = [];
  return employees;
}

function goodCountEmployees(): string {
  const employees = goodGetEmployees();
  return `Employee count: ${employees.length}`;
}

// Another good approach: throw when data is expected but missing.
function getEmployeeById(id: number): string {
  const employees: Record<number, string> = { 1: "Alice", 2: "Bob" };
  const employee = employees[id];
  if (!employee) {
    throw new Error(`Employee with ID ${id} does not exist`);
  }
  return employee;
}

// ============================================================================
// 3. Don't Pass Null
// ============================================================================

// Bad - the function accepts nullable parameters and must guard against them.
// Every function in the chain must defensively check for null.
function badCalculateArea(width: number | null, height: number | null): number {
  if (width === null || height === null) {
    return -1; // Magic error value
  }
  return width * height;
}

// Good - use clear parameter types and validate at boundaries.
// Functions deeper in the call stack can trust their inputs.
function goodCalculateArea(width: number, height: number): number {
  if (width <= 0 || height <= 0) {
    throw new Error(
      `Dimensions must be positive. Received width=${width}, height=${height}`
    );
  }
  return width * height;
}

// Good - use default values to eliminate the possibility of null.
function calculateVolume(
  width: number,
  height: number,
  depth: number = 1
): number {
  return width * height * depth;
}

// ============================================================================
// 4. Define Exceptions by Caller Needs (Wrapping)
// ============================================================================

// Bad - catching many specific exception types from a third-party library.
// The caller is tightly coupled to the library's exception hierarchy.
class NetworkError extends Error {
  constructor(message: string) { super(message); this.name = "NetworkError"; }
}
class TimeoutError extends Error {
  constructor(message: string) { super(message); this.name = "TimeoutError"; }
}
class AuthError extends Error {
  constructor(message: string) { super(message); this.name = "AuthError"; }
}

function simulateApiCall(scenario: string): string {
  if (scenario === "network") throw new NetworkError("Connection refused");
  if (scenario === "timeout") throw new TimeoutError("Request timed out");
  if (scenario === "auth") throw new AuthError("Invalid token");
  return `Response for ${scenario}`;
}

// Bad - the caller handles every specific exception type.
function badCallApi(scenario: string): string {
  try {
    return simulateApiCall(scenario);
  } catch (error) {
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

// Good - wrap the third-party API so the caller deals with one exception type.
class ApiError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  call(scenario: string): string {
    try {
      return simulateApiCall(scenario);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(`API call failed: ${error.message}`, error);
      }
      throw new ApiError("API call failed with unknown error");
    }
  }
}

function goodCallApi(scenario: string): string {
  const client = new ApiClient();
  try {
    return client.call(scenario);
  } catch (error) {
    if (error instanceof ApiError) {
      return `Handled: ${error.message}`;
    }
    return "Unknown error";
  }
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Return codes vs exceptions
console.log("Bad (return codes):", badProcessUser(-5));
console.log("Bad (return codes):", badProcessUser(42));
console.log("Good (exceptions):", goodProcessUser(-5));
console.log("Good (exceptions):", goodProcessUser(42));

// 2. Don't return null
console.log("Bad (returns null):", badCountEmployees());
console.log("Good (returns empty array):", goodCountEmployees());
try {
  console.log("Good (throws on missing):", getEmployeeById(1));
  console.log("Good (throws on missing):", getEmployeeById(99));
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught:", error.message);
  }
}

// 3. Don't pass null
console.log("Bad (accepts null):", badCalculateArea(null, 5));
console.log("Good (rejects invalid):");
try {
  console.log(goodCalculateArea(4, 5));
  console.log(goodCalculateArea(-1, 5));
} catch (error) {
  if (error instanceof Error) {
    console.log("Caught:", error.message);
  }
}
console.log("Good (default depth):", calculateVolume(4, 5));
console.log("Good (explicit depth):", calculateVolume(4, 5, 3));

// 4. Wrapping exceptions
console.log("Bad (many catches):", badCallApi("timeout"));
console.log("Good (wrapped):", goodCallApi("timeout"));
console.log("Good (wrapped, success):", goodCallApi("ok"));
