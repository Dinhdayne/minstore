const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');

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

router.get('/brands', getBrands);
router.post('/brands', authenticateToken, createBrand);
router.put('/brands/:id', authenticateToken, updateBrand);
router.delete('/brands/:id', authenticateToken, deleteBrand);

module.exports = router;