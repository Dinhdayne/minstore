const Brand = require('../models/Brand');

const getBrands = async (req, res) => {
    try {
        const Brands = await Brand.findAll();
        res.json(Brands);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const createBrand = async (req, res) => {
    try {
        const id = await Brand.create(req.body);
        res.status(201).json({ message: 'Danh mục đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        await Brand.update(req.params.id, req.body);
        res.json({ message: 'Danh mục đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        await Brand.delete(req.params.id);
        res.json({ message: 'Danh mục đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };