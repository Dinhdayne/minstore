/**
 * API helper functions
 * Contains all functions for making API calls to the backend
 */

import { API_PRODUCTS, API_CATEGORIES, API_CUSTOMERS, API_ORDERS, API_ORDER_DETAILS, API_CLIENT_ORDERS, HTTP_OK, HTTP_CREATED, HTTP_FORBIDDEN, API_USER, API_ADDTOCART } from './config';
import * as utils from './utils';
import * as auth from './auth';

export const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
};

/**
 * Make a fetch request to API
 * @param {string} url
 * @param {string} method (GET, POST, PUT, DELETE)
 * @param {Object|null} data
 * @param {boolean} requireAuth
 * @return {Promise<Object>}
 */
export const makeApiRequest = async (url, method = 'GET', data = null, requireAuth = true) => {
    try {
        const headers = requireAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' };
        const options = {
            method: method.toUpperCase(),
            headers,
        };

        if (data && ['POST', 'PUT'].includes(method.toUpperCase())) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const result = await response.json();

        if (response.status === HTTP_FORBIDDEN) {
            return { error: 'Token không hợp lệ. Vui lòng đăng nhập lại.' };
        }

        if (response.status !== HTTP_OK && response.status !== HTTP_CREATED) {
            return { error: `Lỗi HTTP: Mã trạng thái ${response.status} - ${JSON.stringify(result)}` };
        }

        return result;
    } catch (error) {
        return { error: `Lỗi khi kết nối đến server: ${error.message}` };
    }
};

/**
 * Get list of products
 * @return {Promise<Object>}
 */
export const getProducts = async () => {
    const result = await makeApiRequest(API_PRODUCTS, 'GET', null, false);

    if (result.error) {
        console.error('Failed to get products: ' + result.error);
        return { error: 'Không thể lấy danh sách sản phẩm từ API' };
    }

    return result;
};

/**
 * Get list of categories
 * @return {Promise<Object>}
 */
export const getCategories = async () => {
    const result = await makeApiRequest(API_CATEGORIES, 'GET', null, false);

    if (result.error) {
        console.error('Failed to get categories: ' + result.error);
        return { error: 'Không thể lấy danh sách danh mục từ API' };
    }

    return result;
};

/**
 * Get product by ID
 * @param {number} productId
 * @return {Promise<Object>}
 */
export const getProduct = async (productId) => {
    const url = `${API_PRODUCTS}/${productId}`;
    const result = await makeApiRequest(url);

    if (result.error) {
        console.error(`Failed to get product ${productId}: ${result.error}`);
        return result;
    }

    if (!result || Object.keys(result).length === 0) {
        return { error: `Không tìm thấy sản phẩm với ID: ${productId}` };
    }

    return result;
};

/**
 * Get product price by ID
 * @param {number} productId
 * @return {Promise<number|Object>}
 */
export const getProductPrice = async (productId) => {
    const product = await getProduct(productId);

    if (product.error) {
        return product;
    }

    if (!product.price || typeof product.price !== 'number' || product.price <= 0) {
        return { error: `Giá sản phẩm không hợp lệ hoặc không tồn tại cho product_id: ${productId}` };
    }

    return product.price;
};

/**
 * Get customer by account ID
 * @param {number} accountId
 * @return {Promise<Object>}
 */
export const getCustomer = async (user_id) => {
    const url = `${API_USER}/${user_id}`;
    const result = await makeApiRequest(url, 'GET', null, true);

    if (result.error) {
        console.error(`Failed to get customer ${user_id}: ${result.error}`);
        return { error: 'Không thể lấy thông tin khách hàng từ API' };
    }

    return result;
};

/**
 * Get orders by customer ID
 * @param {number} customerId
 * @return {Promise<Object>}
 */
export const getOrders = async (customerId) => {
    const url = `${API_ORDERS}/${customerId}`;
    const result = await makeApiRequest(url);

    if (result.error) {
        console.error(`Failed to get orders for customer ${customerId}: ${result.error}`);
        return result;
    }

    if (!result || Object.keys(result).length === 0) {
        return { error: `Không tìm thấy đơn hàng với customer_id: ${customerId}` };
    }

    return result;
};

/**
 * Get order details by order ID
 * @param {number} orderId
 * @return {Promise<Object>}
 */
export const getOrderDetails = async (orderId) => {
    const url = `${API_ORDER_DETAILS}/${orderId}`;
    const result = await makeApiRequest(url);

    if (result.error) {
        console.error(`Failed to get order details for order ${orderId}: ${result.error}`);
        return result;
    }

    if (!result || Object.keys(result).length === 0) {
        return { error: `Hiện không có mặt hàng nào trong giỏ hàng của bạn với order_id: ${orderId}` };
    }

    return result;
};

/**
 * Get client order details by order code
 * @param {string} orderCode
 * @return {Promise<Object>}
 */
export const getClientOrderDetails = async (orderCode) => {
    const url = `${API_CLIENT_ORDERS}/${orderCode}`;
    const result = await makeApiRequest(url);

    if (result.error) {
        console.error(`Failed to get client order details for order ${orderCode}: ${result.error}`);
        return result;
    }

    if (!result || Object.keys(result).length === 0) {
        return { error: `Không tìm thấy chi tiết đơn hàng với order_code: ${orderCode}` };
    }

    return result;
};

/**
 * Add item to cart (create order detail)
 * @param {number} orderId
 * @param {number} productId
 * @param {number} quantity
 * @param {number} unitPrice
 * @return {Promise<Object>}
 */
export const addToCart = async (orderId, productId, quantity, unitPrice) => {
    const data = {
        order_id: orderId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
    };

    const result = await makeApiRequest(API_ORDER_DETAILS, 'POST', data);

    if (result.error) {
        console.error('Failed to add to cart', data);
        return { error: result.message || 'Thêm vào giỏ hàng không thành công' };
    }

    return result;
};

/**
 * Update order detail
 * @param {number} detailId
 * @param {number} orderId
 * @param {number} productId
 * @param {number} quantity
 * @param {number} unitPrice
 * @return {Promise<Object>}
 */
export const updateOrderDetail = async (detailId, orderId, productId, quantity, unitPrice) => {
    const url = `${API_ORDER_DETAILS}/${detailId}`;
    const data = {
        order_id: orderId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
    };

    const result = await makeApiRequest(url, 'PUT', data);

    if (result.error) {
        console.error(`Failed to update order detail ${detailId}`, data);
    }

    return result;
};

/**
 * Delete order detail
 * @param {number} detailId
 * @return {Promise<Object>}
 */
export const deleteOrderDetail = async (detailId) => {
    const url = `${API_ORDER_DETAILS}/${detailId}`;
    const result = await makeApiRequest(url, 'DELETE');

    if (result.error) {
        console.error(`Failed to delete order detail ${detailId}`);
    }

    return result;
};

/**
 * Create new order
 * @param {string} orderCode
 * @param {number} customerId
 * @param {number} userId
 * @param {number} totalAmount
 * @param {string} status
 * @return {Promise<Object>}
 */
export const createOrder = async (orderCode, customerId, userId, totalAmount, status) => {
    const data = {
        order_code: orderCode,
        customer_id: customerId,
        user_id: userId,
        total_amount: totalAmount,
        status,
    };

    const result = await makeApiRequest(API_ORDERS, 'POST', data);

    if (result.error) {
        console.error('Failed to create order', data);
        return { error: result.message || 'Đặt hàng không thành công' };
    }

    return result;
};

/**
 * Create client order
 * @param {number} customerId
 * @param {number} productId
 * @param {number} quantity
 * @param {number} unitPrice
 * @param {string} orderCode
 * @return {Promise<Object>}
 */
export const createClientOrder = async (customerId, productId, quantity, unitPrice, orderCode) => {
    const data = {
        customer_id: customerId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
        order_code: orderCode,
    };

    const result = await makeApiRequest(API_CLIENT_ORDERS, 'POST', data);

    if (result.error) {
        console.error('Failed to create client order', data);
        return { error: result.message || 'Đặt hàng không thành công' };
    }

    return result;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {number} userId - ID người dùng
 * @param {number} variantId - ID biến thể sản phẩm (size/màu)
 * @param {number} quantity - số lượng
 * @return {Promise<Object>}
 */
export const addToCartItem = async (variantId, quantity) => {
    const token = localStorage.getItem("token");
    console.log("Token đang gửi:", token);

    const url = `${API_ADDTOCART}`;
    const data = { variantId, quantity };

    // ✅ Gọi đúng cách: truyền từng tham số
    const result = await makeApiRequest(url, "POST", data, true);

    if (result.error) {
        console.error("API Error:", result);
        throw new Error(result.error);
    }

    return result;
};


