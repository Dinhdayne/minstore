const pool = require('../config/db').default;
const bcrypt = require('bcryptjs');

class Account {
    static async findAll() {
        const [rows] = await pool.query('SELECT id, username, role FROM Accounts');
        return rows;
    }

    static async findByUsername(username) {
        const [rows] = await pool.query('SELECT * FROM Accounts WHERE username = ?', [username]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM Accounts WHERE id = ?', [id]);
        return rows[0];
    }

    static async updatePassword(id, hashedPassword) {
        await pool.query('UPDATE Accounts SET password = ? WHERE id = ?', [hashedPassword, id]);
    }

    static async create({ username, password, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO Accounts (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );
        return result.insertId;
    }

    static async update(id, { username, password, role }) {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
        const query = password
            ? 'UPDATE Accounts SET username = ?, password = ?, role = ? WHERE id = ?'
            : 'UPDATE Accounts SET username = ?, role = ? WHERE id = ?';
        const params = password
            ? [username, hashedPassword, role, id]
            : [username, role, id];
        await pool.query(query, params);
    }

    static async delete(id) {
        await pool.query('DELETE FROM Accounts WHERE id = ?', [id]);
    }
}

module.exports = Account;