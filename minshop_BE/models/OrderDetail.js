const pool = require('../config/db');

class OrderDetail {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM OrderDetails');
        return rows;
    }

    static async findByOrderId(order_id) {
        const [rows] = await pool.query('SELECT * FROM OrderDetails WHERE order_id = ?', [order_id]);
        return rows;
    }

    static async create({ order_id, product_id, quantity, unit_price }) {
        const [result] = await pool.query(
            'INSERT INTO OrderDetails (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
            [order_id, product_id, quantity, unit_price]
        );
        return result.insertId;
    }

    static async update(id, { order_id, product_id, quantity, unit_price }) {
        await pool.query(
            'UPDATE OrderDetails SET order_id = ?, product_id = ?, quantity = ?, unit_price = ? WHERE id = ?',
            [order_id, product_id, quantity, unit_price, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM OrderDetails WHERE id = ?', [id]);
    }
}

module.exports = OrderDetail;