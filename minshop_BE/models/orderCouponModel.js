const pool = require("../config/db");

const OrderCouponModel = {
    // 🟢 Gán coupon vào đơn hàng
    async link(order_id, coupon_id) {
        const [result] = await pool.query(
            "INSERT INTO Order_Coupons (order_id, coupon_id) VALUES (?, ?)",
            [order_id, coupon_id]
        );
        return { oc_id: result.insertId };
    },

    // 🟢 Lấy coupon theo đơn hàng
    async findByOrder(order_id) {
        const [rows] = await pool.query(
            `SELECT oc.*, c.code, c.discount_type, c.discount_value
       FROM Order_Coupons oc
       JOIN Coupons c ON oc.coupon_id = c.coupon_id
       WHERE oc.order_id = ?`,
            [order_id]
        );
        return rows;
    },
};

module.exports = OrderCouponModel;
