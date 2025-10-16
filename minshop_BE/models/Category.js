const pool = require("../config/db");

class Category {
    // 📦 Lấy toàn bộ danh mục
    static async findAll() {
        const [rows] = await pool.query("SELECT * FROM Categories");
        return rows;
    }

    // 🔍 Lấy 1 danh mục theo ID
    static async findById(id) {
        const [rows] = await pool.query("SELECT * FROM Categories WHERE category_id = ?", [id]);
        return rows[0];
    }

    // ➕ Thêm danh mục mới
    static async create({ name, description, slug, parent_id = null, image_url, alt_text, is_active = 1 }) {
        const [result] = await pool.query(
            `INSERT INTO Categories 
                (name, description, slug, parent_id, image_url, alt_text, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, slug, parent_id, image_url, alt_text, is_active]
        );
        return result.insertId;
    }

    // ✏️ Cập nhật danh mục
    static async update(id, { name, description, slug, parent_id, image_url, alt_text, is_active }) {
        const [result] = await pool.query(
            `UPDATE Categories 
             SET name = ?, description = ?, slug = ?, parent_id = ?, 
                 image_url = ?, alt_text = ?, is_active = ?
             WHERE category_id = ?`,
            [name, description, slug, parent_id, image_url, alt_text, is_active, id]
        );
        return result.affectedRows;
    }

    // ❌ Xóa danh mục
    static async delete(id) {
        const [result] = await pool.query("DELETE FROM Categories WHERE category_id = ?", [id]);
        return result.affectedRows;
    }
}

module.exports = Category;
