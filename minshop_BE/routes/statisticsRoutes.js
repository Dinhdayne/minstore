const express = require("express");
const router = express.Router();
const StatisticsController = require("../controllers/StatisticsController");
const jwt = require('jsonwebtoken');

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

// 🔹 Route doanh thu
router.get("/revenue", authenticateToken, StatisticsController.getRevenueSummary);

// 🔹 Route top sản phẩm bán chạy
router.get("/top-products", authenticateToken, StatisticsController.getTopProducts);

// 🔹 Route tổng quan tồn kho
router.get("/inventory", authenticateToken, StatisticsController.getInventoryOverview);

// 🔹 Route lịch sử thay đổi kho
router.get("/inventory/logs", authenticateToken, StatisticsController.getInventoryLogs);

// 🔹 Route thống kê khách hàng
router.get("/customers", authenticateToken, StatisticsController.getCustomerStats);

// 🔹 Hoàn hàng
router.get("/returns", authenticateToken, StatisticsController.getReturnStats);
module.exports = router;
