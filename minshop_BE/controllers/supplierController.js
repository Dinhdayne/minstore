const SupplierModel = require("../models/supplierModel");

const SupplierController = {
    //  GET /api/suppliers
    async getAll(req, res) {
        try {
            const data = await SupplierModel.getAll();
            res.json(data);
        } catch (err) {
            console.error("Lỗi getAll suppliers:", err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách nhà cung cấp" });
        }
    },

    //  GET /api/suppliers/:id
    async getById(req, res) {
        try {
            const { id } = req.params;
            const data = await SupplierModel.getById(id);
            if (!data) return res.status(404).json({ message: "Không tìm thấy nhà cung cấp" });
            res.json(data);
        } catch (err) {
            console.error("Lỗi getById supplier:", err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin nhà cung cấp" });
        }
    },

    //  POST /api/suppliers
    async create(req, res) {
        try {
            const { name, contact_email, phone } = req.body;
            if (!name) return res.status(400).json({ message: "Tên nhà cung cấp là bắt buộc" });

            const result = await SupplierModel.create({ name, contact_email, phone });
            res.status(201).json({ message: "Thêm nhà cung cấp thành công", ...result });
        } catch (err) {
            console.error("Lỗi create supplier:", err);
            res.status(500).json({ message: "Lỗi khi thêm nhà cung cấp" });
        }
    },

    //  PUT /api/suppliers/:id
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, contact_email, phone } = req.body;

            await SupplierModel.update(id, { name, contact_email, phone });
            res.json({ message: "Cập nhật nhà cung cấp thành công" });
        } catch (err) {
            console.error("Lỗi update supplier:", err);
            res.status(500).json({ message: "Lỗi khi cập nhật nhà cung cấp" });
        }
    },

    //  DELETE /api/suppliers/:id
    async delete(req, res) {
        try {
            const { id } = req.params;
            await SupplierModel.delete(id);
            res.json({ message: "Xóa nhà cung cấp thành công" });
        } catch (err) {
            console.error("Lỗi delete supplier:", err);
            res.status(500).json({ message: "Lỗi khi xóa nhà cung cấp" });
        }
    },
};

module.exports = SupplierController;
