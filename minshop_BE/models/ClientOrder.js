const pool = require('../config/db');

class ClientOrder {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM client_orders');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM client_orders WHERE order_code = ?', [id]);
    return rows;
  }

  static async create({ customer_id, product_id, quantity, unit_price, order_code }) {
    const [result] = await pool.execute(
      'INSERT INTO client_orders (customer_id, product_id, quantity, unit_price, order_code) VALUES (?, ?, ?, ?, ?)',
      [customer_id, product_id, quantity, unit_price, order_code]
    );
    return result.insertId;
  }

  static async update(id, data) {
    const { customer_id, product_id, quantity, unit_price, order_code } = data;
    await pool.execute(
      'UPDATE client_orders SET customer_id=?, product_id=?, quantity=?, unit_price=?, order_code=? WHERE id=?',
      [customer_id, product_id, quantity, unit_price, order_code, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM client_orders WHERE id = ?', [id]);
  }
}

module.exports = ClientOrder;
