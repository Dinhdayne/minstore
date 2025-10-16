const ClientOrder = require('../models/ClientOrder');

// Lấy toàn bộ đơn hàng
const getAllOrders = async (req, res) => {
    try {
        const orders = await ClientOrder.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng', error: error.message });
    }
};

// Lấy đơn hàng theo ID
const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const order = await ClientOrder.getById(id);

        if (!order) {
            return res.status(404).json({ message: `Không tìm thấy đơn hàng với id: ${id}` });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng theo ID', error: error.message });
    }
};

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
    try {
        const id = await ClientOrder.create(req.body);
        res.status(201).json({ message: 'Đơn hàng đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng', error: error.message });
    }
};

// Cập nhật đơn hàng theo ID
const updateOrder = async (req, res) => {
    try {
        await ClientOrder.update(req.params.id, req.body);
        res.json({ message: 'Đơn hàng đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật đơn hàng', error: error.message });
    }
};

// Xóa đơn hàng theo ID
const deleteOrder = async (req, res) => {
    try {
        await ClientOrder.delete(req.params.id);
        res.json({ message: 'Đơn hàng đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa đơn hàng', error: error.message });
    }
};

module.exports = {getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
