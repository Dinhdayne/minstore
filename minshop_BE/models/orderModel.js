const pool = require("../config/db");

class OrderModel {
    // 🔹 Tạo đơn hàng mới
    static async createOrder({ user_id, address_id, items, total_amount, shipping_fee, discount_amount, notes }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [orderResult] = await conn.query(
                `INSERT INTO Orders (user_id, address_id, total_amount, shipping_fee, discount_amount, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, address_id, total_amount, shipping_fee, discount_amount, notes]
            );

            const order_id = orderResult.insertId;

            for (const item of items) {
                await conn.query(
                    `INSERT INTO Order_Items (order_id, variant_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
                    [order_id, item.variant_id, item.quantity, item.price]
                );
            }

            await conn.commit();
            return { success: true, order_id };
        } catch (error) {
            await conn.rollback();
            console.error("❌ Lỗi khi tạo đơn hàng:", error);
            throw error;
        } finally {
            conn.release();
        }
    }

    // 🔹 Lấy danh sách đơn hàng theo user_id
    static async getOrdersByUser(user_id) {
        // 1️⃣ Lấy danh sách đơn hàng cơ bản
        const [orders] = await pool.query(
            `SELECT 
                o.order_id,
                o.order_date,
                o.status,
                o.total_amount,
                o.shipping_fee,
                o.discount_amount,
                a.city,
                a.district,
                a.ward
            FROM Orders o
            LEFT JOIN Addresses a ON o.address_id = a.address_id
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC`,
            [user_id]
        );

        // 2️⃣ Nếu không có đơn thì trả rỗng
        if (orders.length === 0) return [];

        // 3️⃣ Gắn danh sách sản phẩm vào từng đơn
        for (const order of orders) {
            const [items] = await pool.query(
                `SELECT 
                    oi.order_item_id,
                    oi.quantity,
                    oi.price,
                    p.name AS product_name,
                    pv.variant_id,
                    pv.attributes,
                    (SELECT image_url FROM Product_Images WHERE variant_id = pv.variant_id LIMIT 1) AS image_url
                FROM Order_Items oi
                JOIN Product_Variants pv ON oi.variant_id = pv.variant_id
                JOIN Products p ON pv.product_id = p.product_id
                WHERE oi.order_id = ?`,
                [order.order_id]
            );

            order.items = items.map((item) => ({
                ...item,
                attributes: (() => {
                    try {
                        return JSON.parse(item.attributes);
                    } catch {
                        return {};
                    }
                })(),
            }));
        }

        return orders;
    }

    // 🔹 Lấy tất cả đơn hàng (cho admin)
    static async getAllOrders() {
        const [rows] = await pool.query(
            `SELECT 
          o.order_id,
          o.order_date,
          o.status,
          o.total_amount,
          o.shipping_fee,
          o.discount_amount,
          u.user_id,
          u.email AS user_email,
          a.city,
          a.district,
          a.ward,
          p.phone
       FROM Orders o
       LEFT JOIN Users u ON o.user_id = u.user_id
       LEFT JOIN Addresses a ON o.address_id = a.address_id
       LEFT JOIN User_profiles p ON o.user_id = p.user_id
       ORDER BY o.order_date DESC`
        );
        return rows;
    }

    // 🔹 Lấy chi tiết đơn hàng
    static async getOrderDetail(order_id) {
        try {
            const [orderRows] = await pool.query(`
            SELECT o.*, a.city, a.district, a.ward, u.email AS user_email, p.first_name, p.last_name, p.phone
            FROM Orders o
            LEFT JOIN Addresses a ON o.address_id = a.address_id
            LEFT JOIN Users u ON o.user_id = u.user_id
            LEFT JOIN User_profiles p ON o.user_id = p.user_id
            WHERE o.order_id = ?
        `, [order_id]);

            if (orderRows.length === 0) return null;

            let [items] = await pool.query(`
            SELECT oi.order_item_id, oi.variant_id, oi.quantity, oi.price,
                   p.name AS product_name, pv.attributes
            FROM Order_Items oi
            JOIN Product_Variants pv ON oi.variant_id = pv.variant_id
            JOIN Products p ON pv.product_id = p.product_id
            WHERE oi.order_id = ?
        `, [order_id]);
            items = items.map((item) => ({
                ...item,
                attributes: (() => {
                    try {
                        return JSON.parse(item.attributes);
                    } catch {
                        return {};
                    }
                })(),
            }));

            return { ...orderRows[0], items };
        } catch (err) {
            console.error("Lỗi getOrderDetail:", err);
            throw err;
        }
    }
    static async updateStatus(order_id, status) {
        try {
            const [result] = await pool.query(
                `UPDATE Orders SET status = ? WHERE order_id = ?`,
                [status, order_id]
            );

            if (result.affectedRows === 0) {
                return { success: false, message: "Không tìm thấy đơn hàng" };
            }

            return { success: true, message: "Cập nhật trạng thái thành công" };
        } catch (error) {
            console.error("Lỗi updateStatus:", error);
            throw error;
        }
    }
}

module.exports = OrderModel;
