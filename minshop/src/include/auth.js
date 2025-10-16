import axios from "axios";

/**
 * Authentication helper functions
 * Handles user sessions, login state, and logout functionality
 */

/**
 * Check if user is logged in
 * @return {boolean}
 */
export const isLoggedIn = () => {
    return !!localStorage.getItem('token') && !!localStorage.getItem('id_customer');
};

/**
 * Get current user's token
 * @return {string}
 */
export const getAuthToken = () => {
    return localStorage.getItem('token') || '';
};

/**
 * Get current customer ID
 * @return {string|null}
 */
export const getCurrentCustomerId = () => {
    return localStorage.getItem('id_customer') || null;
};

/**
 * Handle user logout
 * Clears localStorage and redirects to home page
 */
export const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id_customer');
    window.location.href = '/';
};

/**
 * Check logout request and handle it
 */
export const checkLogoutRequest = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('actiont') === 'dangxuat') {
        handleLogout();
    }
};

/**
 * Require user to be logged in, redirect if not
 * @param {string} redirectUrl
 */
export const requireLogin = (redirectUrl = '/login') => {
    if (!isLoggedIn()) {
        window.location.href = redirectUrl;
    }
};

/**
 * Get authorization headers for API calls
 * @return {Object}
 */
export const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const googleLogin = async (token) => {
    return axios.post(`http://localhost:3000/api/google`, { token });
};
