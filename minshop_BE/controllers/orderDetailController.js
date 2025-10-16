const OrderDetail = require('../models/OrderDetail');

const getOrderDetails = async (req, res) => {
    try {
        const orderDetails = await OrderDetail.findAll();
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const OrderDetailByOrderId = async (req, res) => {
    try {
        const order_id = req.params.order_id;
        const orderDetails = await OrderDetail.findByOrderId(order_id); // Sử dụng phương thức từ model Customer
        res.json(orderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy khách hàng', error });
    }
};

const createOrderDetail = async (req, res) => {
    try {
        const id = await OrderDetail.create(req.body);
        res.status(201).json({ message: 'Chi tiết đơn hàng đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateOrderDetail = async (req, res) => {
    try {
        await OrderDetail.update(req.params.id, req.body);
        res.json({ message: 'Chi tiết đơn hàng đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteOrderDetail = async (req, res) => {
    try {
        await OrderDetail.delete(req.params.id);
        res.json({ message: 'Chi tiết đơn hàng đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { getOrderDetails, OrderDetailByOrderId, createOrderDetail, updateOrderDetail, deleteOrderDetail };