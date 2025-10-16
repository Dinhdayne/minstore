const StatisticsModel = require('../models/StatisticsModel');

const StatisticsController = {
    async getRevenueSummary(req, res) {
        try {
            const { type, start, end } = req.query;
            const data = await StatisticsModel.getRevenueSummary(type || 'month', start, end);
            res.json(data);
        } catch (err) {
            console.error("Lỗi lấy doanh thu:", err);
            res.status(500).json({ error: "Lỗi khi lấy thống kê doanh thu" });
        }
    },


    async getTopProducts(req, res) {
        try {
            // Lấy tham số từ query (nếu không có thì mặc định là 7 ngày)
            const days = parseInt(req.query.days) || 7;
            const limit = parseInt(req.query.limit) || 10;

            const data = await StatisticsModel.getTopProducts(limit, days);
            res.json(data);
        } catch (err) {
            console.error("Lỗi getTopProducts:", err);
            res.status(500).json({ message: "Lỗi khi lấy top sản phẩm bán chạy" });
        }
    },


    async getInventoryOverview(req, res) {
        try {
            const data = await StatisticsModel.getInventoryOverview();
            res.json(data);
        } catch (err) {
            console.error("Lỗi getInventoryOverview:", err);
            res.status(500).json({ message: "Lỗi khi lấy thống kê tồn kho" });
        }
    },

    async getInventoryLogs(req, res) {
        try {
            const data = await StatisticsModel.getInventoryLogs(100);
            res.json(data);
        } catch (err) {
            console.error("Lỗi getInventoryLogs:", err);
            res.status(500).json({ message: "Lỗi khi lấy lịch sử kho" });
        }
    },

    async getCustomerStats(req, res) {
        try {
            const data = await StatisticsModel.getCustomerStats();
            res.json(data);
        } catch (err) {
            console.error("Lỗi getCustomerStats:", err);
            res.status(500).json({ message: "Lỗi khi lấy thống kê khách hàng" });
        }
    },
    async getReturnStats(req, res) {
        try {
            const data = await StatisticsModel.getReturnStats();
            res.json(data);
        } catch (err) {
            console.error("Lỗi thống kê hoàn hàng:", err);
            res.status(500).json({ message: "Lỗi thống kê hoàn hàng" });
        }
    }
};

module.exports = StatisticsController;
