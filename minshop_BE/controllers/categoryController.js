const Category = require('../models/Category');

const getCategories = async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const id = await Category.create(req.body);
        res.status(201).json({ message: 'Danh mục đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        await Category.update(req.params.id, req.body);
        res.json({ message: 'Danh mục đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        await Category.delete(req.params.id);
        res.json({ message: 'Danh mục đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };