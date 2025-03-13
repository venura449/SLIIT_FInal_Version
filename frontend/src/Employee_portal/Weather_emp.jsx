import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header_emp.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "../Employee_portal/InnerNavigations/CropInnav.jsx";


// Function to get weather icons based on description
const getWeatherIcon = (description) => {
    if (description.includes("clear")) return "☀️";
    if (description.includes("cloud")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("thunderstorm")) return "⛈️";
    if (description.includes("snow")) return "❄️";
    return "🌥️";
};

const WeatherApp = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [city, setCity] = useState("");  // To store city name for search
    const [searchTerm, setSearchTerm] = useState("");  // To bind input field
    const [loading, setLoading] = useState(true); // Loading state
    const [location, setLocation] = useState(null);

    const API_KEY = "68289041a417a0cd64d991676cdbb729";

    // Get the location based on IP address
    const getLocationByIp = async () => {
        try {
            const res = await fetch("http://ip-api.com/json");
            const data = await res.json();
            if (data.status === "fail") {
                console.error("Failed to get IP location");
            } else {
                const { lat, lon } = data;
                setLocation({ latitude: lat, longitude: lon });
            }
        } catch (error) {
            console.error("Error getting IP location:", error);
        }
    };

    // Fetch weather for current location or searched city
    const fetchWeather = async (city = "") => {
        try {
            setLoading(true); // Start loading
            let url;
            if (city) {
                // If a city is provided, use the city-based API
                url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
            } else if (location) {
                // Otherwise, use location-based API
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`;
            }
            const res = await fetch(url);
            const data = await res.json();
            if (data.cod === 200) {
                setWeather(data);
            } else {
                setWeather(null);
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Fetch 5-day forecast data
    const fetchForecast = async () => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${API_KEY}`
            );
            const data = await res.json();
            if (data.cod === "200") {
                setForecast(data);
            } else {
                setForecast(null);
            }
        } catch (error) {
            console.error("Error fetching forecast:", error);
        }
    };

    useEffect(() => {
        // Fetch location and weather data when component mounts
        getLocationByIp();
    }, []);

    useEffect(() => {
        // Fetch weather and forecast data if location is available
        if (location) {
            fetchWeather();
            fetchForecast();
        }
    }, [location]);

    useEffect(() => {
        // Fetch weather data if the city is set or changed
        if (city) {
            fetchWeather(city);  // Trigger city-based weather fetch
        }
    }, [city]);

    return (
        <>
            <Header />
            <h1 className="text-3xl font-bold mt-10 mb-6 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
                Weather Forecast in {weather ? weather.name : city}
            </h1>
            <Innav />
            <div className="flex flex-col items-center rounded-3xl mt-10 min-h-screen p-6 bg-gray-900 text-gray-300">
                {/* Search Box */}
                <div className="flex space-x-2 mb-6">
                    <input
                        type="text"
                        placeholder="Enter city..."
                        className="px-4 py-2 rounded-md text-white outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="px-4 py-2 bg-green-800 text-white rounded-md font-semibold hover:bg-green-600 transition"
                        onClick={() => {
                            setCity(searchTerm); // Set the city from search field
                            setSearchTerm(""); // Clear search field
                        }}
                    >
                        Search
                    </button>
                </div>

                {/* Loading Screen with Circular Spinner */}
                {loading && (
                    <div className="flex justify-center items-center h-64 w-full bg-gray-800 rounded-xl text-white relative">
                        <motion.div
                            className="absolute flex justify-center items-center"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <div className="animate-spin rounded-full border-8 border-t-8 border-green-600 h-24 w-24 border-gray-300"></div>
                        </motion.div>
                        <p className="absolute text-lg mt-28">Loading Weather Data...</p> {/* Text below the spinner */}
                    </div>
                )}

                {/* Current Weather Card */}
                {weather && !loading && (
                    <motion.div
                        className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-lg rounded-xl p-6 text-white text-center w-80"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-xl font-bold mb-2">Current Weather</h2>
                        <div className="text-6xl">{getWeatherIcon(weather.weather[0].description)}</div>
                        <p className="text-lg mt-2">{weather.name}, {weather.sys.country}</p>
                        <p className="text-2xl font-semibold">{weather.main.temp}°C</p>
                        <p className="capitalize">{weather.weather[0].description}</p>
                        <div className="mt-3 text-sm opacity-80">
                            <p>Humidity: {weather.main.humidity}%</p>
                            <p>Wind: {weather.wind.speed} m/s</p>
                        </div>
                    </motion.div>
                )}

                {/* 5-Day Forecast */}
                {!loading && forecast && (
                    <>
                        <h2 className="text-xl font-bold mt-8 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
                            5-Day Forecast
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                            {forecast.list
                                .filter((_, index) => index % 8 === 0) // Show only one forecast per day
                                .map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gray-800 shadow-md rounded-lg p-4 text-center text-gray-300 transition transform hover:scale-105"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-sm font-semibold">{new Date(item.dt_txt).toLocaleDateString()}</p>
                                        <div className="text-4xl">{getWeatherIcon(item.weather[0].description)}</div>
                                        <p className="text-lg font-bold">{item.main.temp}°C</p>
                                        <p className="text-gray-400 text-sm capitalize">{item.weather[0].description}</p>
                                    </motion.div>
                                ))}
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default WeatherApp;
