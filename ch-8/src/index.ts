// Boundaries
// "Code at the boundaries needs clear separation and tests that define expectations."

// ============================================================================
// 1. Wrapping Third-Party Code
// ============================================================================

// Bad - using Map directly everywhere in the codebase.
// Any consumer can clear, remove, or cast the contents to the wrong type.
// The Map interface is broad and exposes more than callers need.
function badSensorManager(): void {
  const sensors = new Map<string, { id: string; value: number }>();
  sensors.set("temp-1", { id: "temp-1", value: 72.5 });
  sensors.set("temp-2", { id: "temp-2", value: 68.3 });

  // Anyone can do anything with the raw Map:
  // sensors.clear()  -- accidentally wipes all sensors
  // sensors.delete("temp-1") -- uncontrolled removal
  const sensor = sensors.get("temp-1");
  console.log("Bad (raw Map):", sensor);
}

// Good - wrapping the Map in a domain-specific class.
// The Sensors class exposes only the operations callers actually need.
// If the underlying data structure changes, only this class needs updating.
interface Sensor {
  id: string;
  value: number;
}

class Sensors {
  private data: Map<string, Sensor> = new Map();

  getById(id: string): Sensor | undefined {
    return this.data.get(id);
  }

  register(sensor: Sensor): void {
    this.data.set(sensor.id, sensor);
  }

  getAll(): Sensor[] {
    return Array.from(this.data.values());
  }

  count(): number {
    return this.data.size;
  }
}

function goodSensorManager(): void {
  const sensors = new Sensors();
  sensors.register({ id: "temp-1", value: 72.5 });
  sensors.register({ id: "temp-2", value: 68.3 });

  // Consumers only see the narrow, domain-appropriate interface.
  // No way to accidentally call .clear() or .delete().
  const sensor = sensors.getById("temp-1");
  console.log("Good (wrapped):", sensor);
  console.log("Good (count):", sensors.count());
}

// ============================================================================
// 2. Using Code That Does Not Exist Yet
// ============================================================================

// When the real API is not ready yet, define your own interface that
// describes what you need. Write your code against that interface.
// When the real API arrives, write an adapter to bridge the gap.

// Step 1: Define the interface you wish you had.
interface MessageTransmitter {
  transmit(channel: string, message: string): TransmitResult;
}

interface TransmitResult {
  success: boolean;
  timestamp: number;
}

// Step 2: Write your code against that interface.
class CommunicationController {
  constructor(private transmitter: MessageTransmitter) {}

  sendAlert(channel: string, alertText: string): string {
    const result = this.transmitter.transmit(channel, alertText);
    if (result.success) {
      return `Alert sent on ${channel} at ${result.timestamp}`;
    }
    return `Failed to send alert on ${channel}`;
  }
}

// Step 3: When the real third-party API arrives, build an adapter.
// This simulates a third-party API with a different interface.
class ThirdPartyRadioApi {
  sendData(freq: number, payload: string, encoding: string): boolean {
    // Simulate the real API doing its work
    console.log(`[ThirdPartyRadioApi] freq=${freq}, payload=${payload}, encoding=${encoding}`);
    return true;
  }
}

// The adapter translates between your interface and the real API.
class RadioTransmitterAdapter implements MessageTransmitter {
  private channelFrequencies: Record<string, number> = {
    emergency: 121.5,
    weather: 162.55,
    general: 156.8,
  };

  constructor(private radio: ThirdPartyRadioApi) {}

  transmit(channel: string, message: string): TransmitResult {
    const freq = this.channelFrequencies[channel] || 156.8;
    const success = this.radio.sendData(freq, message, "utf-8");
    return {
      success,
      timestamp: Date.now(),
    };
  }
}

// A fake implementation for use before the real API is available.
class FakeTransmitter implements MessageTransmitter {
  transmit(channel: string, message: string): TransmitResult {
    console.log(`[FakeTransmitter] channel=${channel}, message=${message}`);
    return { success: true, timestamp: Date.now() };
  }
}

// ============================================================================
// 3. Boundary Interfaces (Adapter Pattern for External APIs)
// ============================================================================

// Bad - scattered direct API calls throughout the codebase.
// Every consumer is tightly coupled to the external service's interface.
// If the API changes, every call site must be updated.
function badGetWeather(city: string): string {
  // Imagine this is a real HTTP call with specific headers, auth, etc.
  const apiKey = "abc123";
  const url = `https://api.weather.com/v2/current?city=${city}&key=${apiKey}&format=json`;
  // fetch(url) ...
  return `[Direct call] Weather for ${city} from ${url}`;
}

function badGetForecast(city: string, days: number): string {
  const apiKey = "abc123";
  const url = `https://api.weather.com/v2/forecast?city=${city}&days=${days}&key=${apiKey}&format=json`;
  // fetch(url) ...
  return `[Direct call] ${days}-day forecast for ${city} from ${url}`;
}

// Good - a single adapter class encapsulates all external API interaction.
// The rest of the codebase depends on your own WeatherService interface.
interface WeatherData {
  city: string;
  temperature: number;
  description: string;
}

interface ForecastData {
  city: string;
  days: number;
  entries: { day: number; high: number; low: number }[];
}

interface WeatherService {
  getCurrentWeather(city: string): WeatherData;
  getForecast(city: string, days: number): ForecastData;
}

class WeatherApiAdapter implements WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weather.com/v2";
  }

  getCurrentWeather(city: string): WeatherData {
    // All API-specific logic is contained here.
    // const url = `${this.baseUrl}/current?city=${city}&key=${this.apiKey}&format=json`;
    // const response = fetch(url);
    // Simulated response:
    return {
      city,
      temperature: 72,
      description: "Partly cloudy",
    };
  }

  getForecast(city: string, days: number): ForecastData {
    // const url = `${this.baseUrl}/forecast?city=${city}&days=${days}&key=${this.apiKey}&format=json`;
    // const response = fetch(url);
    // Simulated response:
    return {
      city,
      days,
      entries: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        high: 70 + Math.floor(Math.random() * 15),
        low: 55 + Math.floor(Math.random() * 10),
      })),
    };
  }
}

// Application code depends only on the WeatherService interface.
// If the API vendor changes, only WeatherApiAdapter needs updating.
class WeatherReporter {
  constructor(private service: WeatherService) {}

  report(city: string): string {
    const weather = this.service.getCurrentWeather(city);
    return `${weather.city}: ${weather.temperature}F, ${weather.description}`;
  }

  forecastReport(city: string, days: number): string {
    const forecast = this.service.getForecast(city, days);
    const lines = forecast.entries.map(
      (e) => `  Day ${e.day}: High ${e.high}F, Low ${e.low}F`
    );
    return `${forecast.city} ${forecast.days}-day forecast:\n${lines.join("\n")}`;
  }
}

// ============================================================================
// Run examples
// ============================================================================

// 1. Wrapping third-party code
console.log("--- Wrapping Third-Party Code ---");
badSensorManager();
goodSensorManager();

// 2. Using code that does not exist yet
console.log("\n--- Using Code That Does Not Exist Yet ---");
const fakeController = new CommunicationController(new FakeTransmitter());
console.log(fakeController.sendAlert("emergency", "System overheating"));

const realRadio = new ThirdPartyRadioApi();
const realAdapter = new RadioTransmitterAdapter(realRadio);
const realController = new CommunicationController(realAdapter);
console.log(realController.sendAlert("emergency", "System overheating"));

// 3. Boundary interfaces
console.log("\n--- Boundary Interfaces ---");
console.log("Bad (direct calls):");
console.log(badGetWeather("Austin"));
console.log(badGetForecast("Austin", 3));

console.log("Good (adapter):");
const weatherService = new WeatherApiAdapter("abc123");
const reporter = new WeatherReporter(weatherService);
console.log(reporter.report("Austin"));
console.log(reporter.forecastReport("Austin", 3));
