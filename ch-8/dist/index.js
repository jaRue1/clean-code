"use strict";
function badSensorManager() {
    const sensors = new Map();
    sensors.set("temp-1", { id: "temp-1", value: 72.5 });
    sensors.set("temp-2", { id: "temp-2", value: 68.3 });
    const sensor = sensors.get("temp-1");
    console.log("Bad (raw Map):", sensor);
}
class Sensors {
    constructor() {
        this.data = new Map();
    }
    getById(id) {
        return this.data.get(id);
    }
    register(sensor) {
        this.data.set(sensor.id, sensor);
    }
    getAll() {
        return Array.from(this.data.values());
    }
    count() {
        return this.data.size;
    }
}
function goodSensorManager() {
    const sensors = new Sensors();
    sensors.register({ id: "temp-1", value: 72.5 });
    sensors.register({ id: "temp-2", value: 68.3 });
    const sensor = sensors.getById("temp-1");
    console.log("Good (wrapped):", sensor);
    console.log("Good (count):", sensors.count());
}
class CommunicationController {
    constructor(transmitter) {
        this.transmitter = transmitter;
    }
    sendAlert(channel, alertText) {
        const result = this.transmitter.transmit(channel, alertText);
        if (result.success) {
            return `Alert sent on ${channel} at ${result.timestamp}`;
        }
        return `Failed to send alert on ${channel}`;
    }
}
class ThirdPartyRadioApi {
    sendData(freq, payload, encoding) {
        console.log(`[ThirdPartyRadioApi] freq=${freq}, payload=${payload}, encoding=${encoding}`);
        return true;
    }
}
class RadioTransmitterAdapter {
    constructor(radio) {
        this.radio = radio;
        this.channelFrequencies = {
            emergency: 121.5,
            weather: 162.55,
            general: 156.8,
        };
    }
    transmit(channel, message) {
        const freq = this.channelFrequencies[channel] || 156.8;
        const success = this.radio.sendData(freq, message, "utf-8");
        return {
            success,
            timestamp: Date.now(),
        };
    }
}
class FakeTransmitter {
    transmit(channel, message) {
        console.log(`[FakeTransmitter] channel=${channel}, message=${message}`);
        return { success: true, timestamp: Date.now() };
    }
}
function badGetWeather(city) {
    const apiKey = "abc123";
    const url = `https://api.weather.com/v2/current?city=${city}&key=${apiKey}&format=json`;
    return `[Direct call] Weather for ${city} from ${url}`;
}
function badGetForecast(city, days) {
    const apiKey = "abc123";
    const url = `https://api.weather.com/v2/forecast?city=${city}&days=${days}&key=${apiKey}&format=json`;
    return `[Direct call] ${days}-day forecast for ${city} from ${url}`;
}
class WeatherApiAdapter {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = "https://api.weather.com/v2";
    }
    getCurrentWeather(city) {
        return {
            city,
            temperature: 72,
            description: "Partly cloudy",
        };
    }
    getForecast(city, days) {
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
class WeatherReporter {
    constructor(service) {
        this.service = service;
    }
    report(city) {
        const weather = this.service.getCurrentWeather(city);
        return `${weather.city}: ${weather.temperature}F, ${weather.description}`;
    }
    forecastReport(city, days) {
        const forecast = this.service.getForecast(city, days);
        const lines = forecast.entries.map((e) => `  Day ${e.day}: High ${e.high}F, Low ${e.low}F`);
        return `${forecast.city} ${forecast.days}-day forecast:\n${lines.join("\n")}`;
    }
}
console.log("--- Wrapping Third-Party Code ---");
badSensorManager();
goodSensorManager();
console.log("\n--- Using Code That Does Not Exist Yet ---");
const fakeController = new CommunicationController(new FakeTransmitter());
console.log(fakeController.sendAlert("emergency", "System overheating"));
const realRadio = new ThirdPartyRadioApi();
const realAdapter = new RadioTransmitterAdapter(realRadio);
const realController = new CommunicationController(realAdapter);
console.log(realController.sendAlert("emergency", "System overheating"));
console.log("\n--- Boundary Interfaces ---");
console.log("Bad (direct calls):");
console.log(badGetWeather("Austin"));
console.log(badGetForecast("Austin", 3));
console.log("Good (adapter):");
const weatherService = new WeatherApiAdapter("abc123");
const reporter = new WeatherReporter(weatherService);
console.log(reporter.report("Austin"));
console.log(reporter.forecastReport("Austin", 3));
