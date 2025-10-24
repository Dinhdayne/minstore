const CouponModel = require("../models/couponModel");

const CouponController = {
    // 🟢 Tạo coupon
    async create(req, res) {
        try {
            const coupon = await CouponModel.create(req.body);
            res.status(201).json({ message: "Tạo mã giảm giá thành công", coupon });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // 🟢 Lấy tất cả coupon
    async getAll(req, res) {
        try {
            const coupons = await CouponModel.getAll();
            res.json(coupons);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // 🟢 Áp dụng mã giảm giá
    async apply(req, res) {
        try {
            const { code, orderAmount } = req.body;
            const coupon = await CouponModel.findByCode(code);

            if (!coupon) return res.status(404).json({ error: "Mã không tồn tại" });
            if (!coupon.is_active) return res.status(400).json({ error: "Mã đã bị vô hiệu hóa" });
            if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date())
                return res.status(400).json({ error: "Mã đã hết hạn" });
            if (coupon.max_uses && coupon.uses_count >= coupon.max_uses)
                return res.status(400).json({ error: "Mã đã hết lượt sử dụng" });
            if (coupon.min_order_amount && orderAmount < coupon.min_order_amount)
                return res.status(400).json({ error: `Đơn hàng phải tối thiểu ${coupon.min_order_amount}` });

            let discount = 0;
            if (coupon.discount_type === "percentage") {
                discount = (orderAmount * coupon.discount_value) / 100;
            } else {
                discount = coupon.discount_value;
            }

            res.json({
                message: "Áp dụng mã thành công",
                coupon,
                discount,
                finalAmount: Math.max(0, orderAmount - discount),
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};

module.exports = CouponController;
