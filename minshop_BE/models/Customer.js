const pool = require('../config/db').default;

class Customer {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM Customers');
        return rows;
    }

    static async findByAccountId(account_id) {
        const [rows] = await pool.query('SELECT * FROM Customers WHERE account_id = ?', [account_id]);
        return rows;
    }

    static async create({ full_name, phone, email, address, gender, account_id }) {
        const [result] = await pool.query(
            'INSERT INTO Customers (name, phone, email, address, gender, account_id) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, phone, email, address, gender, account_id]
        );
        return result.insertId;
    }

    static async update(id, { full_name, phone, email, address, gender, account_id }) {
        await pool.query(
            'UPDATE Customers SET name = ?, phone = ?, email = ?, address = ?, gender = ?, account_id = ? WHERE id = ?',
            [full_name, phone, email, address, gender, id, account_id]
        );
    }

    static async delete(id) {
        await pool.query('DELETE FROM Customers WHERE id = ?', [id]);
    }
}

module.exports = Customer;