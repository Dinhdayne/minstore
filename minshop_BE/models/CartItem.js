const pool = require('../config/db');

// Lấy danh sách item trong giỏ hàng
const getCartItems = async (cartId) => {
    const [rows] = await pool.query(`
        SELECT 
            ci.cart_item_id,
            ci.cart_id,
            ci.variant_id,
            ci.quantity,
            pv.price,
            pv.attributes,
            p.product_id,
            p.name AS product_name,
            COALESCE(
                (SELECT image_url FROM Product_Images WHERE variant_id = pv.variant_id LIMIT 1),
                (SELECT image_url FROM Product_Images WHERE product_id = p.product_id AND is_primary = 1 LIMIT 1)
            ) AS image_url
        FROM Cart_Items ci
        JOIN Product_Variants pv ON ci.variant_id = pv.variant_id
        JOIN Products p ON pv.product_id = p.product_id
        WHERE ci.cart_id = ?
        ORDER BY ci.cart_item_id DESC
    `, [cartId]);

    // 🟢 thêm danh sách variant khác cùng product để FE render dropdown chọn màu
    for (const item of rows) {
        const [variants] = await pool.query(`
            SELECT variant_id, attributes
            FROM Product_Variants
            WHERE product_id = (
                SELECT product_id FROM Product_Variants WHERE variant_id = ?
            )
        `, [item.variant_id]);

        item.available_variants = variants;
    }

    return rows;
};


// Thêm item vào giỏ hàng
const addCartItem = async (cartId, variantId, quantity) => {
    const [exist] = await pool.query(
        "SELECT * FROM Cart_Items WHERE cart_id = ? AND variant_id = ?",
        [cartId, variantId]
    );

    if (exist.length > 0) {
        await pool.query(
            "UPDATE Cart_Items SET quantity = quantity + ? WHERE cart_item_id = ?",
            [quantity, exist[0].cart_item_id]
        );
    } else {
        await pool.query(
            "INSERT INTO Cart_Items (cart_id, variant_id, quantity) VALUES (?, ?, ?)",
            [cartId, variantId, quantity]
        );
    }
};

// Cập nhật số lượng
const updateCartItem = async (cartItemId, quantity) => {
    await pool.query(
        "UPDATE Cart_Items SET quantity = ? WHERE cart_item_id = ?",
        [quantity, cartItemId]
    );
};

// Cập nhật variant trong cart item
const updateCartItemVariant = async (cartItemId, variantId) => {
    // Lấy thông tin variant mới
    const [variantRows] = await pool.query(
        `SELECT variant_id, price, attributes 
         FROM Product_Variants 
         WHERE variant_id = ? LIMIT 1`,
        [variantId]
    );

    if (variantRows.length === 0) {
        throw new Error("Biến thể không tồn tại");
    }

    const variant = variantRows[0];

    // Cập nhật variant trong cart item
    await pool.query(
        `UPDATE Cart_Items 
         SET variant_id = ?, price = ?, attributes = ? 
         WHERE cart_item_id = ?`,
        [variant.variant_id, variant.price, variant.attributes, cartItemId]
    );
};

const updateVariantInCart = async (cartItemId, newVariantId) => {
    await pool.query(
        "UPDATE Cart_Items SET variant_id = ? WHERE cart_item_id = ?",
        [newVariantId, cartItemId]
    );
};

// Xóa item
const removeCartItem = async (cartItemId) => {
    await pool.query(
        "DELETE FROM Cart_Items WHERE cart_item_id = ?",
        [cartItemId]
    );
};

// Xóa tất cả item trong giỏ
const clearCart = async (cartId) => {
    await pool.query(
        "DELETE FROM Cart_Items WHERE cart_id = ?",
        [cartId]
    );
};

const getVariantById = async (variantId) => {
    const [rows] = await pool.query(`
        SELECT 
            pv.variant_id,
            pv.product_id,
            pv.price,
            pv.attributes,
            COALESCE(
                (SELECT image_url FROM Product_Images WHERE variant_id = pv.variant_id LIMIT 1),
                (SELECT image_url FROM Product_Images WHERE product_id = pv.product_id AND is_primary = 1 LIMIT 1)
            ) AS image_url
        FROM Product_Variants pv
        WHERE pv.variant_id = ?
    `, [variantId]);

    return rows[0] || null;
};

module.exports = {
    getCartItems,
    addCartItem,
    updateCartItem,
    removeCartItem,
    clearCart,
    updateCartItemVariant,
    updateVariantInCart,
    getVariantById
};
