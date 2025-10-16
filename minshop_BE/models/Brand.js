const pool = require('../config/db');

class Brand {
    // Lấy tất cả brands
    static async findAll() {
        const [rows] = await pool.query('SELECT * FROM Brands');
        return rows;
    }

    // Tạo brand mới
    static async create({ name, description, logo_url }) {
        const [result] = await pool.query(
            'INSERT INTO Brands (name, description, logo_url) VALUES (?, ?, ?)',
            [name, description, logo_url]
        );
        return result.insertId;
    }

    // Cập nhật brand theo id
    static async update(id, { name, description, logo_url }) {
        await pool.query(
            'UPDATE Brands SET name = ?, description = ?, logo_url = ? WHERE brand_id = ?',
            [name, description, logo_url, id]
        );
    }

    // Xóa brand theo id
    static async delete(id) {
        await pool.query('DELETE FROM Brands WHERE brand_id = ?', [id]);
    }

    // Tìm 1 brand theo id
    static async findById(id) {
        const [rows] = await pool.query('SELECT * FROM Brands WHERE brand_id = ?', [id]);
        return rows[0];
    }
}

module.exports = Brand;
