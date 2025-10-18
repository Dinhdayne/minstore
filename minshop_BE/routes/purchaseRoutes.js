const express = require("express");
const router = express.Router();
const PurchaseController = require("../controllers/purchaseController");
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

// 🔹 Danh sách đơn nhập hàng
router.get("/", authenticateToken, PurchaseController.getAll);

// 🔹 Chi tiết 1 đơn nhập
router.get("/:id", authenticateToken, PurchaseController.getById);

// 🔹 Tạo đơn nhập hàng
router.post("/", authenticateToken, PurchaseController.create);

// 🔹 Cập nhật trạng thái (pending → received)
router.put("/:id/status", authenticateToken, PurchaseController.updateStatus);

// 🔹 Xóa đơn nhập hàng
router.delete("/:id", authenticateToken, PurchaseController.delete);

module.exports = router;
