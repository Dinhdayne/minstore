const OrderModel = require("../models/orderModel");
const { notifyNewOrder } = require("../socket");
const axios = require("axios");
const crypto = require("crypto");
let io;

const OrderController = {
    //  Tạo đơn hàng mới
    async create(req, res) {
        try {
            const {
                user_id,
                address_id,
                items,
                total_amount,
                shipping_fee = 0,
                discount_amount = 0,
                notes = "",
                coupon_code = null,
                payment_method = "cod",
                status_Pay = "pending",
            } = req.body;

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
                coupon_code,
                payment_method,
                status_Pay,
            });

            res.status(201).json({
                message: "Đặt hàng thành công!",
                order_id: result.order_id,
            });

            if (io) {
                io.emit("new_order", {
                    user_id,
                    order_id: result.order_id,
                    total_amount,
                });
            }

            notifyNewOrder({
                user_id,
                order_id: result.order_id,
                total_amount,
            });
        } catch (error) {
            console.error(" Lỗi khi tạo đơn hàng:", error);
            res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
        }
    },


    //  Lấy danh sách đơn hàng theo user
    async getByUser(req, res) {
        try {
            const { user_id } = req.params;
            const orders = await OrderModel.getOrdersByUser(user_id);
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy danh sách đơn hàng", error: error.message });
        }
    },

    //  Lấy danh sách tất cả đơn hàng (admin)
    async getAll(req, res) {
        try {
            const orders = await OrderModel.getAllOrders();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Lỗi khi lấy tất cả đơn hàng", error: error.message });
        }
    },

    //  Lấy chi tiết đơn hàng
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
    },

    // GET /api/orders/pending/count
    async getPendingOrdersCount(req, res) {
        try {
            const count = await OrderModel.getOrdersByStatus();
            res.json({ pendingCount: count });
        } catch (err) {
            res.status(500).json({ message: "Lỗi khi đếm đơn hàng chờ xử lý", error: err.message });
        }
    },

    //  Thanh toán bằng MOMO
    async paymentMomo(req, res) {
        try {
            const { order_id, amount } = req.body;
            if (!order_id || !amount) {
                return res.status(400).json({ message: "Thiếu order_id hoặc amount" });
            }

            // --- Cấu hình MoMo test ---
            const partnerCode = "MOMO";
            const accessKey = "F8BBA842ECF85";
            const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
            const requestId = partnerCode + Date.now();
            const momoOrderId = `${order_id}_${Date.now()}`; //  orderId unique mỗi lần

            const orderInfo = `Thanh toán đơn #${order_id}`;

            const redirectUrl = "http://localhost:5173/CartPage"; // URL FE redirect khi thanh toán xong
            const ipnUrl = "http://localhost:3000/api/orders/momo/callback"; // backend nhận callback
            const requestType = "payWithMethod";
            const extraData = "";

            // --- Tạo chuỗi ký ---
            const rawSignature =
                `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
                `&orderId=${momoOrderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
                `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

            const signature = crypto
                .createHmac("sha256", secretKey)
                .update(rawSignature)
                .digest("hex");

            const requestBody = {
                partnerCode,
                accessKey,
                requestId,
                amount,
                orderId: momoOrderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                extraData,
                requestType,
                signature,
                lang: "vi",
            };

            // --- Gọi API MoMo ---
            const momoResponse = await axios.post(
                "https://test-payment.momo.vn/v2/gateway/api/create",
                requestBody,
                { headers: { "Content-Type": "application/json" } }
            );

            console.log(" MoMo response:", momoResponse.data);

            // Lưu trạng thái pending vào DB (nếu chưa có)
            await OrderModel.updatePaymentStatus(order_id, "pending");

            // --- Trả URL thanh toán về FE ---
            res.json({
                payUrl: momoResponse.data.payUrl,
                message: "Tạo thanh toán MoMo thành công!",
            });

        } catch (error) {
            console.error(" Lỗi khi thanh toán MoMo:", error.response?.data || error.message);
            res.status(500).json({ message: "Lỗi khi thanh toán MoMo", error: error.message });
        }
    },

    //  MoMo callback khi thanh toán thành công
    async momoCallback(req, res) {
        try {
            const { orderId, resultCode } = req.body;
            const realOrderId = orderId.split("_")[0]; // ✅ Lấy mã đơn thật trong DB

            if (resultCode === 0) {
                await OrderModel.updatePaymentStatus(realOrderId, "paid");
                console.log(` Đơn hàng ${realOrderId} đã thanh toán thành công`);
            } else {
                await OrderModel.updatePaymentStatus(realOrderId, "failed");
                console.log(` Thanh toán thất bại cho đơn hàng ${realOrderId}`);
            }

            res.status(200).json({ message: "Callback received" });
        } catch (error) {
            console.error(" Lỗi callback MoMo:", error);
            res.status(500).json({ message: "Lỗi callback MoMo" });
        }
    }



};

module.exports = OrderController;
