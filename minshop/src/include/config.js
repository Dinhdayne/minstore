/**
 * File cấu hình cho ứng dụng Minshop
 * Chứa các điểm cuối API và hằng số chung
 */

// Cấu hình Google Client
export const GOOGLE_CLIENT_ID = '1052442191401-vkro7mlv2pkqo6rpcnf9addejamcp5dk.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';

// URL cơ sở API
export const API_BASE_URL = 'http://localhost:3000/api';

// Các điểm cuối API
export const API_PRODUCTS = `${API_BASE_URL}/products`;
export const API_CUSTOMERS = `${API_BASE_URL}/customers`;
export const API_USER = `${API_BASE_URL}/users`;
export const API_ORDERS = `${API_BASE_URL}/orders`;
export const API_ORDER_DETAILS = `${API_BASE_URL}/order-details`;
export const API_CLIENT_ORDERS = `${API_BASE_URL}/client-orders`;
export const API_CATEGORIES = `${API_BASE_URL}/categories`;
export const API_ADDTOCART = `${API_BASE_URL}/cart/add`;

// Giá trị mặc định
export const DEFAULT_USER_ID = '2';
export const DEFAULT_QUANTITY = 1;
export const DEFAULT_DISCOUNT = 0.2; // Giảm giá 20%

// Mã trạng thái HTTP
export const HTTP_OK = 200;
export const HTTP_CREATED = 201;
export const HTTP_FORBIDDEN = 403;