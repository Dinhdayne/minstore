const pool = require("../config/db");

const SupplierModel = {
    //  Lấy danh sách tất cả nhà cung cấp
    async getAll() {
        const [rows] = await pool.query(`
            SELECT supplier_id, name, contact_email, phone, created_at
            FROM Suppliers
            ORDER BY created_at DESC
        `);
        return rows;
    },

    //  Lấy 1 nhà cung cấp theo ID
    async getById(id) {
        const [rows] = await pool.query(`
            SELECT supplier_id, name, contact_email, phone, created_at
            FROM Suppliers
            WHERE supplier_id = ?
        `, [id]);
        return rows[0];
    },

    //  Thêm nhà cung cấp mới
    async create({ name, contact_email, phone }) {
        const [result] = await pool.query(`
            INSERT INTO Suppliers (name, contact_email, phone)
            VALUES (?, ?, ?)
        `, [name, contact_email, phone]);
        return { supplier_id: result.insertId };
    },

    //  Cập nhật thông tin nhà cung cấp
    async update(id, { name, contact_email, phone }) {
        await pool.query(`
            UPDATE Suppliers
            SET name = ?, contact_email = ?, phone = ?
            WHERE supplier_id = ?
        `, [name, contact_email, phone, id]);
        return { message: "Cập nhật thành công" };
    },

    //  Xóa nhà cung cấp
    async delete(id) {
        await pool.query(`
            DELETE FROM Suppliers WHERE supplier_id = ?
        `, [id]);
        return { message: "Đã xóa nhà cung cấp" };
    },
};

module.exports = SupplierModel;
