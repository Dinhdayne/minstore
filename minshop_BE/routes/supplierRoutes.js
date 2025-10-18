const express = require("express");
const router = express.Router();
const SupplierController = require("../controllers/supplierController");
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

// 🔹 Route chính
router.get("/", SupplierController.getAll);
router.get("/:id", authenticateToken, SupplierController.getById);
router.post("/", authenticateToken, SupplierController.create);
router.put("/:id", authenticateToken, SupplierController.update);
router.delete("/:id", authenticateToken, SupplierController.delete);

module.exports = router;

