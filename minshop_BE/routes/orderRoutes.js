const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");
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
// Tạo đơn hàng
router.post("/orders/create/", authenticateToken, OrderController.create);

// Lấy tất cả đơn hàng (admin)
router.get("/orders/all", authenticateToken, OrderController.getAll);

// Lấy danh sách đơn hàng theo user_id
router.get("/orders/user/:user_id", authenticateToken, OrderController.getByUser);

// Lấy chi tiết đơn hàng theo order_id
router.get("/orders/:order_id", authenticateToken, OrderController.getDetail);

router.put("/orders/:order_id/status", authenticateToken, OrderController.updateOrderStatus);

// Thêm route mới để lấy số lượng đơn hàng có trạng thái 'pending'
router.get("/orders/pending/count", authenticateToken, OrderController.getPendingOrdersCount);

// Thanh toán qua MoMo
router.post("/orders/payment/momo", authenticateToken, OrderController.paymentMomo);

// Callback từ MoMo khi thanh toán xong
router.post("/orders/momo/callback", OrderController.momoCallback);
module.exports = router;
