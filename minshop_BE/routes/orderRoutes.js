const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/orderController");

// Tạo đơn hàng
router.post("/orders/create/", OrderController.create);

// Lấy tất cả đơn hàng (admin)
router.get("/orders/all", OrderController.getAll);

// Lấy danh sách đơn hàng theo user_id
router.get("/orders/user/:user_id", OrderController.getByUser);

// Lấy chi tiết đơn hàng theo order_id
router.get("/orders/:order_id", OrderController.getDetail);

router.put("/orders/:order_id/status", OrderController.updateOrderStatus);
module.exports = router;
