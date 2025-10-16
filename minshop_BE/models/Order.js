const pool = require('../config/db').default;

class Order {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM Orders');
        return rows;
    }

    static async findByCustomerId(customer_id) {
        const [rows] = await pool.query('SELECT * FROM Orders WHERE customer_id = ?', [customer_id]);
        return rows;
    }

    static async create({ order_code, customer_id, user_id, total_amount, status }) {
        const [result] = await pool.query(
            'INSERT INTO Orders (order_code, customer_id, user_id, total_amount, status) VALUES (?, ?, ?, ?, ?)',
            [order_code, customer_id, user_id, total_amount, status]
        );
        return result.insertId;
    }

    static async update(id, { order_code, customer_id, user_id, total_amount, status }) {
        await pool.query(
            'UPDATE Orders SET order_code = ?, customer_id = ?, user_id = ?, total_amount = ?, status = ? WHERE id = ?',
            [order_code, customer_id, user_id, total_amount, status, id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM Orders WHERE id = ?', [id]);
    }
}

module.exports = Order;