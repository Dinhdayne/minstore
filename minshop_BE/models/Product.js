const pool = require('../config/db');

class Product {
    //  Lấy tất cả sản phẩm (kèm biến thể và ảnh)
    static async findAll() {
        const [rows] = await pool.query(`
            SELECT 
                p.product_id,
                p.name,
                p.description,
                CAST(p.base_price AS DECIMAL(10, 2)) AS base_price,
                p.sku,
                p.category_id,
                p.brand_id,
                CAST(p.weight AS DECIMAL(5, 2)) AS weight,
                p.is_active,
                p.created_at,
                p.updated_at,
                p.sale,
                c.name AS category_name,
                b.name AS brand_name,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'variant_id', pv.variant_id,
                            'price', CAST(pv.price AS DECIMAL(10, 2)),
                            'stock_quantity', pv.stock_quantity,
                            'sku', pv.sku,
                            'attributes', pv.attributes
                        )
                    ),
                    ']'
                ) AS variants,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'image_id', pi.image_id,
                            'image_url', pi.image_url,
                            'is_primary', pi.is_primary,
                            'alt_text', pi.alt_text,
                            'variant_id', pi.variant_id
                        )
                    ),
                    ']'
                ) AS images
            FROM Products p
            LEFT JOIN Product_Variants pv ON p.product_id = pv.product_id
            LEFT JOIN Product_Images pi ON p.product_id = pi.product_id
            LEFT JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Brands b ON p.brand_id = b.brand_id
            GROUP BY p.product_id
            ORDER BY p.created_at DESC;
        `);
        return rows;
    }

    static async findAllSale() {
        const [rows] = await pool.query(`
            SELECT 
                p.product_id,
                p.name,
                p.description,
                CAST(p.base_price AS DECIMAL(10, 2)) AS base_price,
                p.sku,
                p.category_id,
                p.brand_id,
                CAST(p.weight AS DECIMAL(5, 2)) AS weight,
                p.is_active,
                p.created_at,
                p.updated_at,
                p.sale,
                c.name AS category_name,
                b.name AS brand_name,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'variant_id', pv.variant_id,
                            'price', CAST(pv.price AS DECIMAL(10, 2)),
                            'stock_quantity', pv.stock_quantity,
                            'sku', pv.sku,
                            'attributes', pv.attributes
                        )
                    ),
                    ']'
                ) AS variants,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'image_id', pi.image_id,
                            'image_url', pi.image_url,
                            'is_primary', pi.is_primary,
                            'alt_text', pi.alt_text,
                            'variant_id', pi.variant_id
                        )
                    ),
                    ']'
                ) AS images
            FROM Products p
            LEFT JOIN Product_Variants pv ON p.product_id = pv.product_id
            LEFT JOIN Product_Images pi ON p.product_id = pi.product_id
            LEFT JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Brands b ON p.brand_id = b.brand_id
            WHERE p.sale > 0
            GROUP BY p.product_id
            ORDER BY p.created_at DESC;
            
        `);
        return rows;
    }

    static async findAlltopProduct(limit = 10, days = 7) {
        const [rows] = await pool.query(
            `
    SELECT
      p.product_id,
      p.name,
      p.description,
      CAST(p.base_price AS DECIMAL(10,2)) AS base_price,
      p.sku,
      p.category_id,
      p.brand_id,
      CAST(p.weight AS DECIMAL(5,2)) AS weight,
      p.is_active,
      p.created_at,
      p.updated_at,
      p.sale,
      c.name AS category_name,
      b.name AS brand_name,

      -- Lấy tổng bán và doanh thu từ subquery (đã aggregate)
      COALESCE(s.total_sold, 0) AS total_sold,
      COALESCE(s.total_revenue, 0) AS total_revenue,

      -- Gộp variants (GROUP_CONCAT trên pv)
      CONCAT(
        '[',
        GROUP_CONCAT(DISTINCT JSON_OBJECT(
          'variant_id', pv.variant_id,
          'price', CAST(pv.price AS DECIMAL(10,2)),
          'stock_quantity', pv.stock_quantity,
          'sku', pv.sku,
          'attributes', pv.attributes
        ) ORDER BY pv.variant_id SEPARATOR ','),
        ']'
      ) AS variants,

      -- Gộp images
      CONCAT(
        '[',
        GROUP_CONCAT(DISTINCT JSON_OBJECT(
          'image_id', pi.image_id,
          'image_url', pi.image_url,
          'is_primary', pi.is_primary,
          'alt_text', pi.alt_text,
          'variant_id', pi.variant_id
        ) ORDER BY pi.image_id SEPARATOR ','),
        ']'
      ) AS images

    FROM Products p
    LEFT JOIN Categories c ON p.category_id = c.category_id
    LEFT JOIN Brands b ON p.brand_id = b.brand_id

    -- variants & images (chỉ để gộp thông tin hiển thị)
    LEFT JOIN Product_Variants pv ON p.product_id = pv.product_id
    LEFT JOIN Product_Images pi ON p.product_id = pi.product_id

    -- subquery tính tổng bán theo product (aggregate trước để tránh nhân bản)
    LEFT JOIN (
      SELECT pv.product_id,
             SUM(oi.quantity) AS total_sold,
             SUM(oi.price * oi.quantity) AS total_revenue
      FROM Order_Items oi
      JOIN Product_Variants pv ON oi.variant_id = pv.variant_id
      JOIN Orders o ON oi.order_id = o.order_id
        AND o.status IN ('delivered','shipped')
        AND o.order_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY pv.product_id
    ) s ON p.product_id = s.product_id

    GROUP BY p.product_id
    ORDER BY total_sold DESC, p.created_at DESC
    LIMIT ?;
    `,
            [days, limit]
        );

        return rows;
    }

    static async findVariants() {
        const [rows] = await pool.query(`
            SELECT * FROM Product_Variants;
        `);
        return rows;
    }

    // Lấy 1 sản phẩm theo ID
    static async findById(productId) {
        const [rows] = await pool.query(`
            SELECT 
                p.product_id,
                p.name,
                p.description,
                CAST(p.base_price AS DECIMAL(10, 2)) AS base_price,
                p.sku,
                p.category_id,
                p.brand_id,
                CAST(p.weight AS DECIMAL(5, 2)) AS weight,
                p.is_active,
                p.created_at,
                p.updated_at,
                p.sale,
                AVG(r.rating) as "average_rating",
                COUNT(DISTINCT r.review_id) as "review_count",
                c.name AS category_name,
                b.name AS brand_name,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'variant_id', pv.variant_id,
                            'price', CAST(pv.price AS DECIMAL(10, 2)),
                            'stock_quantity', pv.stock_quantity,
                            'sku', pv.sku,
                            'attributes', pv.attributes
                        )
                    ),
                    ']'
                ) AS variants,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'image_id', pi.image_id,
                            'image_url', pi.image_url,
                            'is_primary', pi.is_primary,
                            'alt_text', pi.alt_text,
                            'variant_id', pi.variant_id
                        )
                    ),
                    ']'
                ) AS images
            FROM Products p
            LEFT JOIN Product_Variants pv ON p.product_id = pv.product_id
            LEFT JOIN Product_Images pi ON p.product_id = pi.product_id
            LEFT JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Brands b ON p.brand_id = b.brand_id
            LEFT JOIN Reviews r ON p.product_id = r.product_id
            WHERE p.product_id = ?
            GROUP BY p.product_id;
        `, [productId]);
        return rows[0];
    }

    // Lấy sản phẩm theo danh mục
    static async findByCategory(categoryId) {
        const [rows] = await pool.query(`
            SELECT 
                p.product_id,
                p.name,
                p.description,
                CAST(p.base_price AS DECIMAL(10, 2)) AS base_price,
                p.sku,
                p.category_id,
                p.brand_id,
                CAST(p.weight AS DECIMAL(5, 2)) AS weight,
                p.is_active,
                p.created_at,
                p.updated_at,
                p.sale,
                c.name AS category_name,
                b.name AS brand_name,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'variant_id', pv.variant_id,
                            'price', CAST(pv.price AS DECIMAL(10, 2)),
                            'stock_quantity', pv.stock_quantity,
                            'sku', pv.sku,
                            'attributes', pv.attributes
                        )
                    ),
                    ']'
                ) AS variants,
                CONCAT(
                    '[',
                    GROUP_CONCAT(
                        DISTINCT JSON_OBJECT(
                            'image_id', pi.image_id,
                            'image_url', pi.image_url,
                            'is_primary', pi.is_primary,
                            'alt_text', pi.alt_text,
                            'variant_id', pi.variant_id
                        )
                    ),
                    ']'
                ) AS images
            FROM Products p
            LEFT JOIN Product_Variants pv ON p.product_id = pv.product_id
            LEFT JOIN Product_Images pi ON p.product_id = pi.product_id
            LEFT JOIN Categories c ON p.category_id = c.category_id
            LEFT JOIN Brands b ON p.brand_id = b.brand_id
            WHERE p.category_id = ?
            GROUP BY p.product_id
            ORDER BY p.created_at DESC;
        `, [categoryId]);
        return rows;
    }

    //  Thêm sản phẩm
    static async createProduct({ name, description, base_price, category_id, brand_id, sku, weight }) {
        const [result] = await pool.query(
            `INSERT INTO Products (name, description, base_price, category_id, brand_id, sku, weight)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, description, base_price, category_id, brand_id, sku, weight]
        );
        return result.insertId;
    }
    // Thêm biến thể và ảnh
    static async addVariantsAndImages(productId, variants = [], images = []) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const variantMap = {};
            for (const variant of variants) {
                const [vResult] = await conn.query(
                    `INSERT INTO Product_Variants (product_id, price, stock_quantity, sku, attributes)
                 VALUES (?, ?, ?, ?, JSON_OBJECT('size', ?, 'color', ?))`,
                    [
                        productId,
                        variant.price,
                        variant.stock_quantity,
                        variant.sku,
                        variant.size || null,
                        variant.color || null, // ✅ giờ color không null nữa
                    ]
                );
                variantMap[variant.sku] = vResult.insertId;
            }

            for (const image of images) {
                const variantId =
                    image.variant_sku && variantMap[image.variant_sku]
                        ? variantMap[image.variant_sku]
                        : null;
                await conn.query(
                    `INSERT INTO Product_Images (product_id, variant_id, image_url, is_primary, alt_text)
                 VALUES (?, ?, ?, ?, ?)`,
                    [
                        productId,
                        variantId,
                        image.image_url,
                        image.is_primary || false,
                        image.alt_text || null,
                    ]
                );
            }

            await conn.commit();
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    // 1 Cập nhật thông tin sản phẩm chính
    static async updateProduct(productId, { name, description, base_price, category_id, brand_id, sku, weight, is_active, sale }) {
        await pool.query(
            `UPDATE Products 
             SET name=?, description=?, base_price=?, category_id=?, brand_id=?, sku=?, weight=?, is_active=?, sale=?, updated_at=NOW() 
             WHERE product_id=?`,
            [name, description, base_price, category_id, brand_id, sku, weight, is_active, sale, productId]
        );
    }

    //  2 Cập nhật biến thể & ảnh (xóa cũ → thêm lại)
    static async updateVariantById(variantId, data) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // UPDATE Product_Variants
            const [result] = await conn.query(
                `UPDATE Product_Variants 
             SET price = ?, stock_quantity = ?, sku = ?, attributes = JSON_OBJECT('size', ?, 'color', ?) 
             WHERE variant_id = ?`,
                [data.price, data.stock_quantity, data.sku, data.size, data.color, variantId]
            );

            // UPDATE/INSERT Product_Images nếu có
            if (data.image_url) {
                const [exists] = await conn.query(
                    `SELECT image_id FROM Product_Images WHERE variant_id = ? LIMIT 1`,
                    [variantId]
                );

                if (exists.length > 0) {
                    await conn.query(
                        `UPDATE Product_Images SET image_url = ?, alt_text = ? WHERE variant_id = ?`,
                        [data.image_url, `Ảnh biến thể ${data.color}`, variantId]
                    );
                } else {
                    await conn.query(
                        `INSERT INTO Product_Images (product_id, variant_id, image_url, is_primary, alt_text)
                     VALUES (?, ?, ?, false, ?)`,
                        [data.product_id, variantId, data.image_url, `Ảnh biến thể ${data.color}`]
                    );
                }
            }

            await conn.commit();
            return result; // ✅ Trả về kết quả để controller dùng affectedRows
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    //  Xoá sản phẩm
    static async delete(productId) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Xoá ảnh trước
            await conn.query(`DELETE FROM Product_Images WHERE product_id = ?`, [productId]);

            // Xoá biến thể
            await conn.query(`DELETE FROM Product_Variants WHERE product_id = ?`, [productId]);

            // Cuối cùng xoá sản phẩm
            const [result] = await conn.query(
                `DELETE FROM Products WHERE product_id = ?`, [productId]
            );

            await conn.commit();
            return { message: "Đã xoá sản phẩm thành công", affected: result.affectedRows };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    //  Xoá từng biến thể riêng
    static async deleteVariant(variantId) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Xoá ảnh gắn với biến thể đó
            await conn.query(`DELETE FROM Product_Images WHERE variant_id = ?`, [variantId]);

            // Sau đó xoá biến thể
            const [result] = await conn.query(
                `DELETE FROM Product_Variants WHERE variant_id = ?`, [variantId]
            );

            await conn.commit();
            return { message: "Xoá biến thể thành công", affected: result.affectedRows };

        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }
}
module.exports = Product;
