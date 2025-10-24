const OrderCouponModel = require("../models/orderCouponModel");
const CouponModel = require("../models/couponModel");

const OrderCouponController = {
    async link(req, res) {
        try {
            const { order_id, coupon_id } = req.body;
            await OrderCouponModel.link(order_id, coupon_id);
            await CouponModel.incrementUsage(coupon_id);
            res.json({ message: "Gán mã giảm giá cho đơn hàng thành công" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getByOrder(req, res) {
        try {
            const { order_id } = req.params;
            const coupons = await OrderCouponModel.findByOrder(order_id);
            res.json(coupons);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = OrderCouponController;
