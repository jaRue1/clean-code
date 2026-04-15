// Systems
// "Software systems should separate the startup process from the runtime logic."

// ============================================================================
// 1. Construction vs Use (Separation of Concerns)
// ============================================================================

// Bad - class creates its own dependencies with new (hardcoded)
class OrderProcessorBad {
  processOrder(orderId: string): string {
    // This class constructs its own dependencies
    const taxRate = 0.08;
    const shippingCost = 5.99;
    const discount = 0;

    const orderTotal = 100; // pretend we looked this up
    const tax = orderTotal * taxRate;
    const total = orderTotal + tax + shippingCost - discount;

    // Logging is also hardcoded; we cannot swap it out
    console.log(`[BAD LOG] Processing order ${orderId}`);

    return `Order ${orderId}: $${total.toFixed(2)}`;
  }
}

// Good - dependencies are injected, construction is separate from use

interface TaxCalculator {
  calculate(amount: number): number;
}

interface ShippingCalculator {
  calculate(orderId: string): number;
}

interface Logger {
  log(message: string): void;
}

class OrderProcessor {
  constructor(
    private taxCalculator: TaxCalculator,
    private shippingCalculator: ShippingCalculator,
    private logger: Logger
  ) {}

  processOrder(orderId: string, orderTotal: number): string {
    this.logger.log(`Processing order ${orderId}`);
    const tax = this.taxCalculator.calculate(orderTotal);
    const shipping = this.shippingCalculator.calculate(orderId);
    const total = orderTotal + tax + shipping;
    return `Order ${orderId}: $${total.toFixed(2)}`;
  }
}

class StandardTaxCalculator implements TaxCalculator {
  constructor(private rate: number) {}

  calculate(amount: number): number {
    return amount * this.rate;
  }
}

class FlatRateShipping implements ShippingCalculator {
  constructor(private cost: number) {}

  calculate(_orderId: string): number {
    return this.cost;
  }
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

// ============================================================================
// 2. Factory Pattern
// ============================================================================

// Bad - hardcoded object creation scattered throughout the code
class NotificationSenderBad {
  send(type: string, recipient: string, message: string): void {
    if (type === "email") {
      // Hardcoded creation of email-specific objects
      const subject = "Notification";
      console.log(`[BAD] Sending email to ${recipient}: subject="${subject}", body="${message}"`);
    } else if (type === "sms") {
      // Hardcoded creation of SMS-specific objects
      const truncated = message.substring(0, 160);
      console.log(`[BAD] Sending SMS to ${recipient}: "${truncated}"`);
    } else if (type === "push") {
      console.log(`[BAD] Sending push notification to ${recipient}: "${message}"`);
    } else {
      throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// Good - factory abstracts the creation, each notification type is its own class

interface NotificationChannel {
  send(recipient: string, message: string): void;
}

class EmailChannel implements NotificationChannel {
  send(recipient: string, message: string): void {
    console.log(`[Email] To: ${recipient}, Subject: Notification, Body: ${message}`);
  }
}

class SmsChannel implements NotificationChannel {
  send(recipient: string, message: string): void {
    const truncated = message.substring(0, 160);
    console.log(`[SMS] To: ${recipient}, Message: ${truncated}`);
  }
}

class PushChannel implements NotificationChannel {
  send(recipient: string, message: string): void {
    console.log(`[Push] To: ${recipient}, Alert: ${message}`);
  }
}

class NotificationFactory {
  private channels: Map<string, NotificationChannel> = new Map();

  register(type: string, channel: NotificationChannel): void {
    this.channels.set(type, channel);
  }

  create(type: string): NotificationChannel {
    const channel = this.channels.get(type);
    if (!channel) {
      throw new Error(`Unknown notification type: ${type}`);
    }
    return channel;
  }
}

// ============================================================================
// 3. Dependency Injection
// ============================================================================

// Bad - tightly coupled; the service creates its own data access layer
class UserServiceBad {
  getUser(id: string): { id: string; name: string; source: string } {
    // Hardcoded dependency on a specific data source
    const fakeDatabase: Record<string, string> = {
      "1": "Alice",
      "2": "Bob",
    };
    const name = fakeDatabase[id] || "Unknown";
    console.log(`[BAD] Fetched user ${id} directly from hardcoded data`);
    return { id, name, source: "hardcoded" };
  }
}

// Good - constructor injection makes the dependency explicit and swappable

interface UserDataAccess {
  findById(id: string): { id: string; name: string } | undefined;
}

class DatabaseUserAccess implements UserDataAccess {
  private users: Map<string, string>;

  constructor(initialUsers: [string, string][]) {
    this.users = new Map(initialUsers);
  }

  findById(id: string): { id: string; name: string } | undefined {
    const name = this.users.get(id);
    if (!name) return undefined;
    return { id, name };
  }
}

class CacheUserAccess implements UserDataAccess {
  private cache: Map<string, { id: string; name: string }> = new Map();

  constructor(private delegate: UserDataAccess) {}

  findById(id: string): { id: string; name: string } | undefined {
    if (this.cache.has(id)) {
      console.log(`  Cache hit for user ${id}`);
      return this.cache.get(id);
    }
    console.log(`  Cache miss for user ${id}, delegating to data source`);
    const user = this.delegate.findById(id);
    if (user) this.cache.set(id, user);
    return user;
  }
}

class UserService {
  constructor(private dataAccess: UserDataAccess) {}

  getUser(id: string): { id: string; name: string } | undefined {
    return this.dataAccess.findById(id);
  }

  getUserName(id: string): string {
    const user = this.dataAccess.findById(id);
    return user ? user.name : "Unknown";
  }
}

// ============================================================================
// Run examples
// ============================================================================

console.log("=== Bad: Class creates its own dependencies ===");
const badProcessor = new OrderProcessorBad();
console.log(badProcessor.processOrder("ORD-001"));

console.log("\n=== Good: Dependencies injected (construction separated from use) ===");
const taxCalc = new StandardTaxCalculator(0.08);
const shipping = new FlatRateShipping(5.99);
const logger = new ConsoleLogger();
const goodProcessor = new OrderProcessor(taxCalc, shipping, logger);
console.log(goodProcessor.processOrder("ORD-001", 100));

console.log("\n=== Bad: Hardcoded object creation (no factory) ===");
const badNotifier = new NotificationSenderBad();
badNotifier.send("email", "user@example.com", "Your order has shipped");
badNotifier.send("sms", "+1234567890", "Your order has shipped");

console.log("\n=== Good: Factory pattern abstracts creation ===");
const factory = new NotificationFactory();
factory.register("email", new EmailChannel());
factory.register("sms", new SmsChannel());
factory.register("push", new PushChannel());

const emailChannel = factory.create("email");
emailChannel.send("user@example.com", "Your order has shipped");

const smsChannel = factory.create("sms");
smsChannel.send("+1234567890", "Your order has shipped");

const pushChannel = factory.create("push");
pushChannel.send("device-token-abc", "Your order has shipped");

console.log("\n=== Bad: Tightly coupled (hardcoded data access) ===");
const badUserService = new UserServiceBad();
console.log(badUserService.getUser("1"));
console.log(badUserService.getUser("3"));

console.log("\n=== Good: Dependency injection (swappable data access) ===");
const dbAccess = new DatabaseUserAccess([
  ["1", "Alice"],
  ["2", "Bob"],
  ["3", "Charlie"],
]);
const cachedAccess = new CacheUserAccess(dbAccess);
const userService = new UserService(cachedAccess);

console.log("First lookup (cache miss):");
console.log(userService.getUser("1"));

console.log("Second lookup (cache hit):");
console.log(userService.getUser("1"));

console.log("Unknown user:");
console.log(userService.getUserName("99"));
