const pool = require('../config/db');
const ReviewModel = {
    //  Thêm đánh giá mới
    async addReview({ user_id, product_id, rating, comment }) {
        const [result] = await pool.query(
            'INSERT INTO Reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())',
            [user_id, product_id, rating, comment]
        );
        return { review_id: result.insertId };
    },

    //  Lấy đánh giá theo sản phẩm
    async getReviewsByProduct(product_id) {
        const [rows] = await pool.query(`
                SELECT 
                    r.review_id, 
                    r.user_id, 
                    CONCAT(up.first_name, ' ', up.last_name) AS full_name,
                    r.rating, 
                    r.comment, 
                    r.created_at
                FROM Reviews r 
                JOIN Users u ON r.user_id = u.user_id
                JOIN User_Profiles up ON u.user_id = up.user_id
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
            `,
            [product_id]
        );
        return rows;
    },

    //  Cập nhật đánh giá
    async updateReview({ review_id, rating, comment }) {
        const [result] = await pool.query(
            'UPDATE Reviews SET rating = ?, comment = ? WHERE review_id = ?',
            [rating, comment, review_id]
        );
        return { affectedRows: result.affectedRows };
    },

    //  Xoá đánh giá      
    async deleteReview(review_id) {
        const [result] = await pool.query(
            'DELETE FROM Reviews WHERE review_id = ?',
            [review_id]
        );
        return { affectedRows: result.affectedRows };
    }
};

module.exports = ReviewModel;