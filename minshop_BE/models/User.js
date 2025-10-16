const pool = require('../config/db');
class User {
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM Users');
        return rows;
    }

    static async create({ account_id, full_name, phone, email, gender, address }) {
        const [result] = await pool.query(
            'INSERT INTO Users (account_id, full_name, phone, email, gender, address) VALUES (?, ?, ?, ?, ?, ?)',
            [account_id, full_name, phone, email, gender, address]
        );
        return result.insertId;
    }

    static async update(id, { display_name, role, is_active, email_verified }) {
        try {
            await pool.query(
                `UPDATE Users 
             SET display_name = ?, 
                 role = ?, 
                 is_active = ?, 
                 email_verified = ?
             WHERE user_id = ?`,
                [display_name, role, is_active, email_verified, id]
            );
        } catch (err) {
            console.error("Error updating user:", err);
            throw err;
        }
    }


    static async delete(id) {
        try {
            const [result] = await pool.query('DELETE FROM Users WHERE user_id = ?', [id]);
            return result;
        } catch (err) {
            console.error('Lỗi khi xoá user:', err);
            throw err;
        }
    }

    static async createUser({ email, password_hash, provider, provider_id, display_name, role, email_verified }) {
        const [result] = await pool.query(
            `INSERT INTO Users (email, password_hash, provider, provider_id, display_name, role, email_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [email, password_hash, provider, provider_id, display_name, role, email_verified]
        );
        return result.insertId;
    }

    // ➕ Thêm hồ sơ mới

    static async createUserProfile({ user_id, first_name, last_name, phone, date_of_birth, gender, avatar_url, loyalty_points }) {
        const [result] = await pool.query(
            `INSERT INTO User_Profiles 
        (user_id, first_name, last_name, phone, date_of_birth, gender, avatar_url, loyalty_points)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                user_id, first_name || null, last_name || null, phone || null, date_of_birth || null, gender || null, avatar_url || null, loyalty_points || 0,
            ]
        );

        return result.insertId;
    };

    static async findUserByUserId(user_id) {
        const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [user_id]);
        return rows[0];
    };

    // Tìm user theo provider_id (Google sub)
    static async findUserByProviderId(provider_id) {
        const [rows] = await pool.query("SELECT * FROM Users WHERE provider_id = ?", [provider_id]);
        return rows[0];
    };
    static async findUserByEmail(email) {
        const [rows] = await pool.query("SELECT * FROM Users WHERE email = ?", [email]);
        return rows[0];
    };
}

module.exports = User;