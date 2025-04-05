// src/components/RecentSearches.jsx
import React from "react";

const RecentSearches = ({ searches, onSelect }) => {
    if (!searches || searches.length === 0) return null;
  
    return (
      <div className="mt-4 w-full max-w-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Searches:</h3>
        <div className="flex flex-wrap gap-2">
          {searches.map((city, index) => (
            <button
              key={`${city}-${index}`}
              onClick={() => onSelect(city)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full text-sm transition-colors text-gray-800 dark:text-gray-200"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default RecentSearches;