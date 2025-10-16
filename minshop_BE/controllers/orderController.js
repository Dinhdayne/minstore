const OrderModel = require("../models/orderModel");

const OrderController = {
    // ✅ Tạo đơn hàng mới
    async create(req, res) {
        try {
            const { user_id, address_id, items, total_amount, shipping_fee, discount_amount, notes } = req.body;

            if (!user_id || !address_id || !items?.length) {
                return res.status(400).json({ message: "Thiếu thông tin đặt hàng" });
            }

            const result = await OrderModel.createOrder({
                user_id,
                address_id,
                items,
                total_amount,
                shipping_fee,
                discount_amount,
                notes,
            });

            res.status(201).json({
                message: "Đặt hàng thành công!",
                order_id: result.order_id,
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
        }
    },

    // 📜 Lấy danh sách đơn hàng theo user
    async getByUser(req, res) {
        try {
            const { user_id } = req.params;
            const orders = await OrderModel.getOrdersByUser(user_id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
        }
    },

    // 🧾 Lấy danh sách tất cả đơn hàng (admin)
    async getAll(req, res) {
        try {
            const orders = await OrderModel.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy tất cả đơn hàng", error: error.message });
        }
    },

    // 🔍 Lấy chi tiết đơn hàng
    async getDetail(req, res) {
        try {
            const { order_id } = req.params;
            const order = await OrderModel.getOrderDetail(order_id);
            if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: error.message });
        }
    },
    async updateOrderStatus(req, res) {
        try {
            const { order_id } = req.params;
            const { status } = req.body;

            const result = await OrderModel.updateStatus(order_id, status);
            if (!result.success) return res.status(404).json({ message: result.message });

            res.json({ message: result.message });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: err.message });
        }
    }

};

module.exports = OrderController;
