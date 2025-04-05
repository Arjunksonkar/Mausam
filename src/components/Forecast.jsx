// src/components/Forecast.jsx
import React from "react";

import { useState, useEffect } from 'react';
import { fetchWeatherData, fetchForecastData, fetchExtendedForecast } from '../../services/weatherApi';

// import { fetchWeatherData } from "../services/weatherApi";


const Forecast = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'month'

  useEffect(() => {
    if (!city) return;
    
    const getForecast = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        if (viewMode === 'week') {
          data = await fetchForecastData(city);
        } else {
          data = await fetchExtendedForecast(city);
        }
        
        // Process the forecast data to get daily forecasts
        const dailyData = processForecastData(data.list);
        setForecast(dailyData);
      } catch (err) {
        // Silently handle errors without logging to console
        setError(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    getForecast();
  }, [city, viewMode]);

  // Process the 3-hour forecast data to get daily forecasts
  const processForecastData = (forecastList) => {
    const dailyForecasts = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [],
          icons: [],
          descriptions: []
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].icons.push(item.weather[0].icon);
      dailyForecasts[date].descriptions.push(item.weather[0].description);
    });
    
    // Get average temp and most frequent icon/description for each day
    return Object.values(dailyForecasts).map(day => {
      const avgTemp = day.temps.reduce((sum, temp) => sum + temp, 0) / day.temps.length;
      
      // Find most frequent icon
      const iconCounts = {};
      day.icons.forEach(icon => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      });
      const mainIcon = Object.keys(iconCounts).reduce((a, b) => 
        iconCounts[a] > iconCounts[b] ? a : b
      );
      
      // Find most frequent description
      const descCounts = {};
      day.descriptions.forEach(desc => {
        descCounts[desc] = (descCounts[desc] || 0) + 1;
      });
      const mainDescription = Object.keys(descCounts).reduce((a, b) => 
        descCounts[a] > descCounts[b] ? a : b
      );
      
      return {
        date: day.date,
        temp: Math.round(avgTemp),
        icon: mainIcon,
        description: mainDescription
      };
    }).slice(0, viewMode === 'week' ? 7 : 30); // Show 7 days or up to 30 days
  };

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'week' ? 'month' : 'week');
  };

  if (loading) return <div className="text-center mt-4">Loading forecast...</div>;
  if (!forecast) return null;

  return (
    <div className="mt-6 w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {viewMode === 'week' ? '7-Day' : '30-Day'} Forecast
        </h3>
        <button 
          onClick={toggleViewMode}
          className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          {viewMode === 'week' ? 'Show Monthly' : 'Show Weekly'}
        </button>
      </div>
      
      <div className="relative overflow-x-auto">
        <div className={`grid grid-cols-2 ${viewMode === 'week' ? 'sm:grid-cols-7' : 'sm:inline-grid'} gap-2`} 
          style={viewMode === 'month' ? {width: 'max-content', gridTemplateColumns: 'repeat(30, minmax(90px, 1fr))'} : {}}
        >
          {forecast.map((day, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow text-center transition-colors">
              <div className="text-sm font-medium text-gray-800 dark:text-white">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <img 
                src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                alt={day.description}
                className="w-12 h-12 mx-auto" 
              />
              <div className="font-bold text-gray-900 dark:text-white">{day.temp}°C</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{day.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      {viewMode === 'month' && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic text-center">
          * Extended forecast beyond 7 days is approximate and for planning purposes only
        </div>
      )}
    </div>
  );
};

export default Forecast;