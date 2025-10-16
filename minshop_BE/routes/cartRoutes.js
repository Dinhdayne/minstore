const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { getCart, addToCart, updateQuantity, removeItem, clearCartAll, updateVariant, getVariant } = require("../controllers/cartController");

// Middleware xác thực token
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Yêu cầu access token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

// Routes giỏ hàng
router.get("/cart/:userId", getCart);
router.post("/cart/add", authenticateToken, addToCart);
router.put("/cart/update/:cartItemId", authenticateToken, updateQuantity);
router.delete("/cart/item/:cartItemId", authenticateToken, removeItem);
router.delete("/cart/clear/:userId", authenticateToken, clearCartAll);
router.put("/cart/update-variant/:cartItemId", authenticateToken, updateVariant);
router.get("/variants/:variantId", getVariant);

module.exports = router;
