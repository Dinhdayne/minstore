const AddressModel = require('../models/Address');

const AddressController = {
    async getUserAddresses(req, res) {
        try {
            const { userId } = req.params;
            const data = await AddressModel.getByUserId(userId);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async createAddress(req, res) {
        try {
            const result = await AddressModel.create(req.body);
            res.json({ message: 'Thêm địa chỉ thành công', ...result });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async updateAddress(req, res) {
        try {
            const { addressId } = req.params;
            await AddressModel.update(addressId, req.body);
            res.json({ message: 'Cập nhật địa chỉ thành công' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async deleteAddress(req, res) {
        try {
            const { addressId } = req.params;
            await AddressModel.delete(addressId);
            res.json({ message: 'Xóa địa chỉ thành công' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async setDefault(req, res) {
        try {
            const { address_id } = req.params;
            await AddressModel.setDefault(address_id);
            console.log("📩 Received setDefault for:", req.params.address_id);
            res.json({ message: 'Đặt làm mặc định thành công' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
};

module.exports = AddressController;
