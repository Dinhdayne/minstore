// 📁 models/cartModel.js
const pool = require('../config/db');

// Tạo giỏ hàng mới nếu chưa có
const getOrCreateCart = async (userId, sessionId = null) => {
    const [rows] = await pool.query(
        'SELECT * FROM Carts WHERE user_id = ? OR session_id = ? LIMIT 1',
        [userId, sessionId]
    );

    if (rows.length > 0) return rows[0];

    const [result] = await pool.query(
        'INSERT INTO Carts (user_id, session_id) VALUES (?, ?)',
        [userId, sessionId]
    );

    return { cart_id: result.insertId, user_id: userId, session_id: sessionId };
};

module.exports = { getOrCreateCart };
