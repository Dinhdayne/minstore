const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require('../controllers/clientOrderController');

// Middleware kiểm tra token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Yêu cầu access token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

// Định nghĩa các tuyến
router.get('/client-orders', getAllOrders);          // Lấy tất cả đơn hàng
router.get('/client-orders/:id', getOrderById);      // Lấy 1 đơn hàng theo ID
router.post('/client-orders', authenticateToken, createOrder);          // Tạo mới đơn hàng (cần token)
router.put('/client-orders/:id', authenticateToken, updateOrder);       // Cập nhật (cần token)
router.delete('/client-orders/:id', authenticateToken, deleteOrder);    // Xóa (cần token)

module.exports = router;
