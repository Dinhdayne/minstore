const Reviews = require('../models/Review');
const ReviewController = {
    // 🟢 Thêm đánh giá mới
    async addReview(req, res) {
        try {
            const { user_id, product_id, rating, comment } = req.body;
            if (!user_id || !product_id || !rating) {
                return res.status(400).json({ message: 'Thiếu thông tin đánh giá' });
            }
            console.log("📩 Body received:", req.body);

            const result = await Reviews.addReview({ user_id, product_id, rating, comment });
            res.status(201).json({ message: 'Đánh giá đã được thêm', review_id: result.review_id });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi thêm đánh giá', error: error.message });
        }
    },

    // 📜 Lấy đánh giá theo sản phẩm
    async getReviewsByProduct(req, res) {
        try {
            const { product_id } = req.params;
            const reviews = await Reviews.getReviewsByProduct(product_id);
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error: error.message });
        }
    },
    // 🔄 Cập nhật đánh giá
    async updateReview(req, res) {
        try {
            const { review_id } = req.params;
            const { rating, comment } = req.body;
            const result = await Reviews.updateReview({ review_id, rating, comment });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            }
            res.json({ message: 'Đánh giá đã được cập nhật' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá', error: error.message });
        }
    },
    // ❌ Xoá đánh giá
    async deleteReview(req, res) {
        try {
            const { review_id } = req.params;
            const result = await Reviews.deleteReview(review_id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Đánh giá không tồn tại' });
            }
            res.json({ message: 'Đánh giá đã được xoá' });
        } catch (error) {
            res.status(500).json({ message: 'Lỗi khi xoá đánh giá', error: error.message });
        }
    }
};
module.exports = ReviewController;