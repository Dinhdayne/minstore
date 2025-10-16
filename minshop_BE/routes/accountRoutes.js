const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { login, getAccounts, createAccount, updateAccount, deleteAccount, changePassword } = require('../controllers/accountController');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Yêu cầu access token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token không hợp lệ' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Yêu cầu quyền admin' });
    }
    next();
};

router.post('/login', login);
router.post('/change-password', authenticateToken, changePassword);
router.get('/accounts', authenticateToken, requireAdmin, getAccounts);
router.post('/accounts', createAccount);
router.put('/accounts/:id', authenticateToken, requireAdmin, updateAccount);
router.delete('/accounts/:id', authenticateToken, requireAdmin, deleteAccount);

module.exports = router;