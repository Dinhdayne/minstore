const pool = require("../config/db");

const AddressModel = {
    // 🔹 Lấy danh sách địa chỉ theo user_id
    async getByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM Addresses 
             WHERE user_id = ? 
             ORDER BY is_default DESC, address_id DESC`,
            [userId]
        );
        return rows;
    },

    // 🔹 Thêm địa chỉ mới
    async create({ user_id, ward, district, city, zip_code, is_default }) {
        if (is_default) {
            // Nếu thêm địa chỉ mặc định mới → hủy mặc định cũ
            await pool.query(
                `UPDATE Addresses SET is_default = FALSE WHERE user_id = ?`,
                [user_id]
            );
        }

        const [result] = await pool.query(
            `INSERT INTO Addresses (user_id, ward, district, city, zip_code, is_default)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, ward, district, city, zip_code, is_default]
        );

        return { address_id: result.insertId };
    },

    // 🔹 Cập nhật địa chỉ
    async update(address_id, { ward, district, city, zip_code, is_default }) {
        const [existing] = await pool.query(
            `SELECT * FROM Addresses WHERE address_id = ?`,
            [address_id]
        );

        if (existing.length === 0) throw new Error("Địa chỉ không tồn tại");

        const user_id = existing[0].user_id;

        if (is_default) {
            await pool.query(
                `UPDATE Addresses SET is_default = FALSE WHERE user_id = ?`,
                [user_id]
            );
        }

        await pool.query(
            `UPDATE Addresses 
             SET ward = ?, district = ?, city = ?, zip_code = ?, is_default = ?
             WHERE address_id = ?`,
            [ward, district, city, zip_code, is_default, address_id]
        );
    },

    // 🔹 Xóa địa chỉ
    async delete(address_id) {
        await pool.query(`DELETE FROM Addresses WHERE address_id = ?`, [address_id]);
    },

    // 🔹 Đặt làm mặc định
    async setDefault(address_id) {
        const [[addr]] = await pool.query(
            `SELECT user_id FROM Addresses WHERE address_id = ?`,
            [address_id]
        );

        if (!addr) throw new Error("Địa chỉ không tồn tại");

        await pool.query(
            `UPDATE Addresses SET is_default = FALSE WHERE user_id = ?`,
            [addr.user_id]
        );

        await pool.query(
            `UPDATE Addresses SET is_default = TRUE WHERE address_id = ?`,
            [address_id]
        );
    },
};

module.exports = AddressModel;
