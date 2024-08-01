// utils.js

/**
 * Checks if two strings are equal, ignoring case.
 * @param {string} str1 - The first string to compare.
 * @param {string} str2 - The second string to compare.
 * @returns {boolean} - True if the strings are equal (case-insensitive), false otherwise.
 */
function equalsIgnoreCase(str1, str2) {
    if (typeof str1 === 'string' && typeof str2 === 'string') {
      return str1.toLowerCase() === str2.toLowerCase();
    }
    return false;
  }
  
  /**
   * Checks if a string is null, undefined, or empty.
   * @param {string} str - The string to check.
   * @returns {boolean} - True if the string is null, undefined, or empty, false otherwise.
   */
  function isNullOrEmpty(str) {
    return str === null || str === undefined || str.trim().length === 0;
  }
  
  /**
   * Capitalizes the first letter of each word in a string.
   * @param {string} str - The string to capitalize.
   * @returns {string} - The capitalized string.
   */
  function capitalizeWords(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
  
  /**
   * Deep clones an object or array.
   * @param {Object|Array} obj - The object or array to clone.
   * @returns {Object|Array} - A deep clone of the input.
   */
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  /**
   * Formats a date object into a string (YYYY-MM-DD).
   * @param {Date} date - The date to format.
   * @returns {string} - The formatted date string.
   */
  function formatDate(date) {
    if (!(date instanceof Date)) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  /**
   * Generates a random integer between two values (inclusive).
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} - A random integer between min and max.
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Checks if an object is empty (has no enumerable properties).
   * @param {Object} obj - The object to check.
   * @returns {boolean} - True if the object is empty, false otherwise.
   */
  function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
  
  module.exports = {
    equalsIgnoreCase,
    isNullOrEmpty,
    capitalizeWords,
    deepClone,
    formatDate,
    getRandomInt,
    isEmptyObject
  };
  