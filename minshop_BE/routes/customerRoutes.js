const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getCustomers, CustomerByAccountId, createCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');

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

router.get('/customers', authenticateToken, getCustomers);
router.get('/customers/:account_id', CustomerByAccountId);
router.post('/customers', createCustomer);
router.put('/customers/:id', authenticateToken, updateCustomer);
router.delete('/customers/:id', authenticateToken, deleteCustomer);

module.exports = router;