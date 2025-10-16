const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const CustomerByAccountId = async (req, res) => {
    try {
        const account_id = req.params.account_id;
        const customers = await Customer.findByAccountId(account_id); // Sử dụng phương thức từ model Customer
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy khách hàng', error });
    }
};

const createCustomer = async (req, res) => {
    try {
        const id = await Customer.create(req.body);
        res.status(201).json({ message: 'Khách hàng đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        await Customer.update(req.params.id, req.body);
        res.json({ message: 'Khách hàng đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        await Customer.delete(req.params.id);
        res.json({ message: 'Khách hàng đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { getCustomers, CustomerByAccountId, createCustomer, updateCustomer, deleteCustomer };