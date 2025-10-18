const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        products.forEach(p => {
            p.variants = JSON.parse(p.variants);
            p.images = JSON.parse(p.images);
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getProductsOnSale = async (req, res) => {
    try {
        const products = await Product.findAllSale();
        products.forEach(p => {
            p.variants = JSON.parse(p.variants);
            p.images = JSON.parse(p.images);
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getTopProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // mặc định 10 sản phẩm
        const days = parseInt(req.query.days) || 7;   // mặc định 7 ngày gần nhất

        // 🔹 Lấy danh sách top sản phẩm bán chạy từ model
        const products = await Product.findAlltopProduct(limit, days);

        // 🔹 Parse JSON nếu có cột variants / images
        products.forEach(p => {
            try {
                if (p.variants && typeof p.variants === "string") {
                    p.variants = JSON.parse(p.variants);
                }
                if (p.images && typeof p.images === "string") {
                    p.images = JSON.parse(p.images);
                }
            } catch (e) {
                console.warn(`Lỗi parse JSON cho product_id ${p.product_id}:`, e.message);
                p.variants = [];
                p.images = [];
            }
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Lỗi khi lấy top sản phẩm bán chạy:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const getVariants = async (req, res) => {
    try {
        const variants = await Product.findVariants();
        res.json(variants);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const id = req.params.id; // Lấy id từ URL, ví dụ: /products/:id
        console.log('Fetching product for id:', id); // Debug
        const product = await Product.findById(id);

        if (!product) {
            console.log('No product found for id:', id);
            return res.status(404).json({ message: `Không tìm thấy sản phẩm với id: ${id}` });
        }
        // product.forEach(p => {
        //     p.variants = JSON.parse(p.variants);
        //     p.images = JSON.parse(p.images);
        // });
        console.log('Product found:', product);
        res.json(product);
    } catch (error) {
        console.error('Error in getProductById:', error);
        res.status(500).json({ message: 'Lỗi khi lấy sản phẩm', error: error.message });
    }
};

const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.findByCategory(categoryId);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const createProducts = async (req, res) => {
    try {
        const id = await Product.createProduct(req.body);
        res.status(201).json({ message: 'Sản phẩm đã được tạo', id });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const createVariantsAndImages = async (req, res) => {
    try {
        const { productId, variants, images } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Thiếu productId!" });
        }

        await Product.addVariantsAndImages(productId, variants, images);

        res.status(201).json({ message: "Thêm biến thể và ảnh thành công!" });
    } catch (error) {
        console.error("❌ Lỗi khi thêm biến thể/ảnh:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


const updateProducts = async (req, res) => {
    try {
        await Product.updateProduct(req.params.id, req.body);
        res.json({ message: 'Sản phẩm đã được cập nhật' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateVariantById = async (req, res) => {
    try {
        const variantId = req.params.variantId;
        const data = req.body;

        console.log("🟢 Controller nhận variantId:", variantId);
        console.log("🟢 Dữ liệu cập nhật:", data);

        const result = await Product.updateVariantById(variantId, data);

        if (result.affectedRows > 0) {
            res.json({ message: "Cập nhật biến thể thành công!" });
        } else {
            res.status(404).json({ message: "Không tìm thấy biến thể!" });
        }
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật biến thể:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật biến thể", error });
    }
};



const deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Sản phẩm đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteVariants = async (req, res) => {
    try {
        await Product.deleteVariant(req.params.id);
        res.json({ message: 'Sản phẩm đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { getProducts, getProductsOnSale, getTopProducts, getProductsByCategory, getProductById, createProducts, updateProducts, deleteProduct, createVariantsAndImages, updateVariantById, deleteVariants, getVariants };