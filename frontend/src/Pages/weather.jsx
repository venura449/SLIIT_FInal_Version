import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import Innav from "../components/In_nav.jsx";

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
    const [city, setCity] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);

    const API_KEY = "68289041a417a0cd64d991676cdbb729";

    const getLocationByIp = async () => {
        try {
            const res = await fetch("http://ip-api.com/json");
            const data = await res.json();
            if (data.status === "fail") {
                console.error("Failed to get IP location");
            } else {
                setLocation({ latitude: data.lat, longitude: data.lon });
            }
        } catch (error) {
            console.error("Error getting IP location:", error);
        }
    };

    const fetchWeather = async (city = "") => {
        try {
            setLoading(true);
            let url = city
                ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
                : `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&units=metric&appid=${API_KEY}`;
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
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const fetchForecast = async () => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.latitude}&lon=${location?.longitude}&units=metric&appid=${API_KEY}`
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
        getLocationByIp();
    }, []);

    useEffect(() => {
        if (location) {
            fetchWeather();
            fetchForecast();
        }
    }, [location]);

    useEffect(() => {
        if (city) {
            fetchWeather(city);
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
                            setCity(searchTerm);
                            setSearchTerm("");
                        }}
                    >
                        Search
                    </button>
                </div>

                {/* Smooth Loading Skeleton */}
                {loading && (
                    <motion.div
                        className="bg-gray-800 shadow-lg rounded-xl p-6 w-80 h-40 flex flex-col justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-16 h-16 border-t-4 border-green-600 border-solid rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-400">Loading Weather Data...</p>
                    </motion.div>
                )}

                {/* Current Weather Card */}
                {!loading && weather && (
                    <motion.div
                        className="bg-gradient-to-br from-gray-800 to-gray-700 shadow-lg rounded-xl p-6 text-white text-center w-80"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
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

                {/* 5-Day Forecast with Smooth Loading */}
                {!loading && forecast && (
                    <>
                        <h2 className="text-xl font-bold mt-8 bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
                            5-Day Forecast
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                            {forecast.list
                                .filter((_, index) => index % 8 === 0)
                                .map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="bg-gray-800 shadow-md rounded-lg p-4 text-center text-gray-300 transition transform hover:scale-105"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
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
