const express = require("express");
const router = express.Router();
const StatisticsController = require("../controllers/StatisticsController");

// 🔹 Route doanh thu
router.get("/revenue", StatisticsController.getRevenueSummary);

// 🔹 Route top sản phẩm bán chạy
router.get("/top-products", StatisticsController.getTopProducts);

// 🔹 Route tổng quan tồn kho
router.get("/inventory", StatisticsController.getInventoryOverview);

// 🔹 Route lịch sử thay đổi kho
router.get("/inventory/logs", StatisticsController.getInventoryLogs);

// 🔹 Route thống kê khách hàng
router.get("/customers", StatisticsController.getCustomerStats);

// 🔹 Hoàn hàng
router.get("/returns", StatisticsController.getReturnStats);
module.exports = router;
