const PurchaseModel = require("../models/purchaseModel");

const PurchaseController = {
    async getAll(req, res) {
        try {
            const data = await PurchaseModel.getAll();
            res.json(data);
        } catch (err) {
            console.error("Lỗi getAll purchases:", err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách đơn nhập hàng" });
        }
    },

    async getById(req, res) {
        try {
            const data = await PurchaseModel.getById(req.params.id);
            res.json(data);
        } catch (err) {
            console.error("Lỗi getById:", err);
            res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn nhập hàng" });
        }
    },

    async create(req, res) {
        try {
            const result = await PurchaseModel.create(req.body);
            res.json(result);
        } catch (err) {
            console.error("Lỗi create purchase:", err);
            res.status(500).json({ message: "Lỗi khi tạo đơn nhập hàng" });
        }
    },

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await PurchaseModel.updateStatus(id, status);
            res.json(result);
        } catch (err) {
            console.error("Lỗi updateStatus:", err);
            res.status(500).json({ message: "Lỗi khi cập nhật trạng thái" });
        }
    },

    async delete(req, res) {
        try {
            const result = await PurchaseModel.delete(req.params.id);
            res.json(result);
        } catch (err) {
            console.error("Lỗi delete purchase:", err);
            res.status(500).json({ message: "Lỗi khi xóa đơn nhập hàng" });
        }
    }
};

module.exports = PurchaseController;
