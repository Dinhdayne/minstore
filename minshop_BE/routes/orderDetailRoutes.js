const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getOrderDetails, OrderDetailByOrderId, createOrderDetail, updateOrderDetail, deleteOrderDetail } = require('../controllers/orderDetailController');

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

router.get('/order-details', authenticateToken, getOrderDetails);
router.get('/order-details/:order_id', authenticateToken, OrderDetailByOrderId);
router.post('/order-details', authenticateToken, createOrderDetail);
router.put('/order-details/:id', authenticateToken, updateOrderDetail);
router.delete('/order-details/:id', authenticateToken, deleteOrderDetail);

module.exports = router;