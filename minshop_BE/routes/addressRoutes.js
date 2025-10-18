const express = require('express');
const AddressController = require('../controllers/addressController');
const router = express.Router();
const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Yêu cầu access token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

router.get('/user/:userId', authenticateToken, AddressController.getUserAddresses);
router.post('/', authenticateToken, AddressController.createAddress);
router.put('/:addressId', authenticateToken, AddressController.updateAddress);
router.delete('/:addressId', authenticateToken, AddressController.deleteAddress);
router.put("/set-default/:address_id", authenticateToken, AddressController.setDefault);
module.exports = router;
