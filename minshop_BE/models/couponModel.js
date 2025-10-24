const pool = require("../config/db");

const CouponModel = {
    // 🟢 Tạo coupon mới
    async create({ code, discount_type, discount_value, min_order_amount, max_uses, expiry_date }) {
        const [result] = await pool.query(
            `INSERT INTO Coupons (code, discount_type, discount_value, min_order_amount, max_uses, expiry_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [code, discount_type, discount_value, min_order_amount, max_uses, expiry_date]
        );
        return { coupon_id: result.insertId };
    },

    // 🟢 Lấy danh sách tất cả coupon
    async getAll() {
        const [rows] = await pool.query("SELECT * FROM Coupons");
        return rows;
    },

    // 🟢 Tìm coupon theo code
    async findByCode(code) {
        const [rows] = await pool.query("SELECT * FROM Coupons WHERE code = ?", [code]);
        return rows[0];
    },

    // 🟢 Cập nhật coupon
    async update(coupon_id, data) {
        const fields = Object.keys(data).map((key) => `${key} = ?`).join(", ");
        const values = [...Object.values(data), coupon_id];
        await pool.query(`UPDATE Coupons SET ${fields} WHERE coupon_id = ?`, values);
    },

    // 🟢 Xóa coupon
    async remove(coupon_id) {
        await pool.query("DELETE FROM Coupons WHERE coupon_id = ?", [coupon_id]);
    },

    // 🟢 Tăng lượt sử dụng
    async incrementUsage(coupon_id) {
        await pool.query("UPDATE Coupons SET uses_count = uses_count + 1 WHERE coupon_id = ?", [coupon_id]);
    },
};

module.exports = CouponModel;
