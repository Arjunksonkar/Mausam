import React from "react";

const Footer = () => {
  return (
    <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Weather Dashboard. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Powered by OpenWeather API
        </p>
        <div className="flex justify-center mt-3 space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <span className="sr-only">Twitter</span>
            <i className="fas fa-cloud"></i>
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <span className="sr-only">GitHub</span>
            <i className="fas fa-github"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 