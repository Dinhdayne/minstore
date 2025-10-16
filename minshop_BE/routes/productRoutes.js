const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getProducts, getProductsByCategory, getProductById, createProducts, updateProducts, deleteProduct, createVariantsAndImages, updateVariantById, deleteVariants } = require('../controllers/productController');

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

router.get('/products', getProducts);
router.get('/products/category/:categoryId', getProductsByCategory);
router.get('/products/:id', getProductById);

router.post('/products', authenticateToken, createProducts);
router.put('/products/:id', authenticateToken, updateProducts);
router.delete('/products/:id', authenticateToken, deleteProduct);

router.post('/products/variants-images/:id', authenticateToken, createVariantsAndImages);
router.put('/products/variants-update/:variantId', authenticateToken, updateVariantById);
router.delete('/products/variants/:id', authenticateToken, deleteVariants);
module.exports = router;