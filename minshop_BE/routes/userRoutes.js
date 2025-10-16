const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUsers, create, updateUser, deleteUser, googleLogin, CustomerByAccountId } = require('../controllers/userController');


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

router.get('/users', getUsers);
router.get('/users/:id', authenticateToken, CustomerByAccountId);
router.get('/check-auth', authenticateToken, (req, res) => {
    res.json({ user: req.user }); // Trả lại thông tin user từ token
});

router.post('/google', googleLogin);
router.post('/createUser', create);

router.put('/users/:id', authenticateToken, updateUser);
router.delete('/users/:id', authenticateToken, deleteUser);

module.exports = router;