// // src/services/weatherApi.js

// import axios from 'axios';

// // Get API key from environment variable or replace with your actual API key
// const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'YOUR_API_KEY'; 
// const BASE_URL = 'https://api.openweathermap.org/data/2.5';



// export const fetchWeatherData = async (city) => { 
//     try {
//       const response = await axios.get(`${BASE_URL}/weather`, {
//         params: {
//           q: city,
//           appid: API_KEY,
//           units: 'metric'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   };

  

// // For 5-day forecast (bonus feature)
// export const fetchForecastData = async (city) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/forecast`, {
//       params: {
//         q: city,
//         appid: API_KEY,
//         units: 'metric'
//       }
//     });
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// };

// src/services/weatherApi.js

import axios from "axios";

// Load API key from environment variable (Make sure .env file has VITE_OPENWEATHER_API_KEY)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const ONE_CALL_URL = "https://api.openweathermap.org/data/3.0/onecall";

// Function to fetch current weather data
export const fetchWeatherData = async (city) => {
  try {
    if (!API_KEY) {
      throw new Error("API key is missing. Please check your .env file.");
    }

    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    return response.data;
  } catch (error) {
    // Don't log the error to console to prevent error messages
    if (error.response?.status !== 404) {
      // Only log non-404 errors
      console.error("Error fetching weather data:", error.response?.data || error.message);
    }
    throw error;
  }
};

// Function to fetch forecast data - updated to get more data points
export const fetchForecastData = async (city) => {
  try {
    if (!API_KEY) {
      throw new Error("API key is missing. Please check your .env file.");
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        cnt: 56, // Increased from default 40 (5 days) to 56 (7 days)
      },
    });

    return response.data;
  } catch (error) {
    // Don't log the error to console to prevent error messages
    if (error.response?.status !== 404) {
      // Only log non-404 errors
      console.error("Error fetching forecast data:", error.response?.data || error.message);
    }
    throw error;
  }
};

// Function to fetch extended forecast data (up to 30 days)
// This uses a combination of the 5-day forecast and historical data to simulate a longer forecast
export const fetchExtendedForecast = async (city) => {
  try {
    if (!API_KEY) {
      throw new Error("API key is missing. Please check your .env file.");
    }

    // First get the current weather to get coordinates
    const currentWeather = await fetchWeatherData(city);
    const { lat, lon } = currentWeather.coord;
    
    // First get the 7-day forecast using the standard forecast endpoint
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        cnt: 56, // 7 days of 3-hour forecasts
      },
    });

    // Then create dummy forecast data for remaining days (8-30)
    // This is a simulation since OpenWeather's free tier doesn't offer 30-day forecasts
    const firstWeekData = forecastResponse.data;
    
    // Create extended forecast based on patterns in the first week
    // For a real implementation, you would need a premium API that offers long-range forecasts
    const extendedDays = generateExtendedForecast(firstWeekData, 30);
    
    return {
      city: firstWeekData.city,
      list: extendedDays
    };
    
  } catch (error) {
    // Don't log the error to console to prevent error messages
    if (error.response?.status !== 404) {
      // Only log non-404 errors
      console.error("Error fetching extended forecast:", error.response?.data || error.message);
    }
    throw error;
  }
};

// Helper function to generate simulated forecast data
const generateExtendedForecast = (firstWeekData, totalDays) => {
  const firstWeekList = firstWeekData.list;
  let extendedList = [...firstWeekList];
  
  // Get the pattern from the first 7 days (56 entries of 3-hour forecasts)
  const patternLength = Math.min(firstWeekList.length, 56);
  const pattern = firstWeekList.slice(0, patternLength);
  
  // Calculate how many more entries we need for the desired total days
  // Each day has 8 entries (24 hours / 3 hours per entry)
  const targetLength = totalDays * 8;
  
  // Keep adding data until we reach the target length
  while (extendedList.length < targetLength) {
    const nextIndex = extendedList.length % patternLength;
    const baseEntry = pattern[nextIndex];
    
    // Create a new entry based on the pattern but with adjusted date/time
    const daysToAdd = Math.floor(extendedList.length / patternLength) * 7;
    const newDate = new Date((baseEntry.dt + daysToAdd * 86400) * 1000);
    
    const newEntry = {
      ...baseEntry,
      dt: Math.floor(newDate.getTime() / 1000),
      dt_txt: newDate.toISOString().replace('T', ' ').substring(0, 19)
    };
    
    extendedList.push(newEntry);
  }
  
  return extendedList;
};
