const ReviewController = require('../controllers/reviewController');
const express = require('express');
const router = express.Router();

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

// 🟢 Thêm đánh giá mới
router.post('/', authenticateToken, ReviewController.addReview);

// 📜 Lấy đánh giá theo sản phẩm
router.get('/product/:product_id', authenticateToken, ReviewController.getReviewsByProduct);
// 🔄 Cập nhật đánh giá
router.put('/:review_id', authenticateToken, ReviewController.updateReview);

// ❌ Xoá đánh giá
router.delete('/:review_id', authenticateToken, ReviewController.deleteReview);
module.exports = router;