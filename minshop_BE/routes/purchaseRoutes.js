const express = require("express");
const router = express.Router();
const PurchaseController = require("../controllers/purchaseController");

// 🔹 Danh sách đơn nhập hàng
router.get("/", PurchaseController.getAll);

// 🔹 Chi tiết 1 đơn nhập
router.get("/:id", PurchaseController.getById);

// 🔹 Tạo đơn nhập hàng
router.post("/", PurchaseController.create);

// 🔹 Cập nhật trạng thái (pending → received)
router.put("/:id/status", PurchaseController.updateStatus);

// 🔹 Xóa đơn nhập hàng
router.delete("/:id", PurchaseController.delete);

module.exports = router;
