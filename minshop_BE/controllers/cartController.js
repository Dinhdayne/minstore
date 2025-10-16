const { getOrCreateCart } = require('../models/Cart');
const {
    getVariantById,
    updateCartItemVariant,
    updateVariantInCart,
    getCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart
} = require('../models/CartItem');
const pool = require("../config/db");

const getVariant = async (req, res) => {
    try {
        const { variantId } = req.params;
        const variant = await getVariantById(variantId);

        if (!variant) {
            return res.status(404).json({ message: "Không tìm thấy variant" });
        }

        res.json(variant);
    } catch (error) {
        console.error("Lỗi lấy variant:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};


// 📥 GET /api/cart/:userId
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await getOrCreateCart(userId);
        const items = await getCartItems(cart.cart_id);
        res.json({ cart, items });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ➕ POST /api/cart/add
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.user_id || req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Không xác định được người dùng" });
        }

        const { variantId, quantity } = req.body;
        if (!variantId || !quantity) {
            return res.status(400).json({ error: "Thiếu variantId hoặc quantity" });
        }

        // 🔹 Tìm hoặc tạo giỏ hàng
        const [existingCart] = await pool.query("SELECT * FROM carts WHERE user_id = ?", [userId]);
        let cartId;

        if (existingCart.length > 0) {
            cartId = existingCart[0].cart_id;
        } else {
            const [newCart] = await pool.query(
                "INSERT INTO carts (user_id, created_at) VALUES (?, NOW())",
                [userId]
            );
            cartId = newCart.insertId;
        }

        // 🔹 Thêm hoặc cập nhật sản phẩm trong cart_items
        await pool.query(
            `INSERT INTO cart_items (cart_id, variant_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [cartId, variantId, quantity]
        );

        // ✅ Gửi response một lần duy nhất
        return res.json({ message: "Thêm vào giỏ hàng thành công", cartId });

    } catch (error) {
        console.error("Lỗi khi thêm giỏ hàng:", error);
        return res.status(500).json({ error: "Lỗi server khi thêm giỏ hàng" });
    }
};



// ✏️ PUT /api/cart/update/:cartItemId
const updateQuantity = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;
        await updateCartItem(cartItemId, quantity);
        res.json({ message: "Cập nhật số lượng thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🎨 PUT /api/cart/update-variant/:cartItemId
const updateVariant = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { variantId } = req.body;

        if (!variantId) {
            return res.status(400).json({ message: "Thiếu variantId" });
        }

        await updateVariantInCart(cartItemId, variantId);
        res.status(200).json({ message: "Cập nhật variant thành công" });
    } catch (err) {
        console.error("Lỗi updateVariant:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
};


// ❌ DELETE /api/cart/item/:cartItemId
const removeItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        await removeCartItem(cartItemId);
        res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 🗑️ DELETE /api/cart/clear/:userId
const clearCartAll = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await getOrCreateCart(userId);
        await clearCart(cart.cart_id);
        res.json({ message: "Đã xóa toàn bộ giỏ hàng" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getCart, addToCart, updateQuantity, removeItem, clearCartAll, updateVariant, getVariant };
