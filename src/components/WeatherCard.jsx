// src/components/ErrorMessage.jsx
import React from "react";


const ErrorMessage = ({ message }) => {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 dark:bg-red-900 dark:border-red-800 dark:text-red-200" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{message || "Failed to fetch weather data. Please try again."}</span>
      </div>
    );
  };
  
  export default ErrorMessage;