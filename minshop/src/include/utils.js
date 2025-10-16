/**
 * Utility helper functions
 * Contains common helper functions used across the application
 */


import { DEFAULT_DISCOUNT } from './config';
/**
 * Calculate discounted price
 * @param {number} originalPrice
 * @param {number} discount
 * @return {number}
 */
export const getDiscountedPrice = (originalPrice, discount = DEFAULT_DISCOUNT) => {
    return originalPrice * (1 - discount);
};

/**
 * Generate random string
 * @param {number} length
 * @return {string}
 */
export const randomString = (length = 8) => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format currency (Vietnamese Dong)
 * @param {number} amount
 * @return {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Log error with context
 * @param {string} message
 * @param {Object} context
 */
export const logError = (message, context = {}) => {
    const contextString = Object.keys(context).length ? ` | Context: ${JSON.stringify(context)}` : '';
    console.error(message + contextString);
};

/**
 * Show alert and redirect
 * @param {string} message
 * @param {string} redirectUrl
 */
export const alertAndRedirect = (message, redirectUrl) => {
    window.alert(message);
    window.location.href = redirectUrl;
};

/**
 * Check if array is valid and not empty
 * @param {any} data
 * @return {boolean}
 */
export const isValidArray = (data) => {
    return Array.isArray(data) && data.length > 0;
};

/**
 * Validate product data
 * @param {Object} product
 * @return {boolean}
 */
export const isValidProduct = (product) => {
    return isValidArray(Object.keys(product)) &&
        product.price !== undefined &&
        typeof product.price === 'number' &&
        product.price > 0 &&
        !product.error;
};

/**
 * Clean and validate input
 * @param {string} input
 * @return {string}
 */
export const cleanInput = (input) => {
    const div = document.createElement('div');
    div.textContent = input.trim();
    return div.innerHTML;
};