const pool = require("../config/db");

class OrderModel {
    //  Tạo đơn hàng mới
    static async createOrder({
        user_id,
        address_id,
        items,
        total_amount,
        shipping_fee = 0,
        discount_amount = 0,
        coupon_code = null,
        payment_method = "cod",
        notes = "",
        status_Pay,
    }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            let coupon_id = null;

            //  Nếu có mã giảm giá thì kiểm tra tính hợp lệ
            if (coupon_code) {
                const [couponRows] = await conn.query(
                    `SELECT * FROM Coupons 
                 WHERE code = ? 
                   AND is_active = TRUE 
                   AND (expiry_date IS NULL OR expiry_date > NOW()) 
                   AND (max_uses IS NULL OR uses_count < max_uses)`,
                    [coupon_code]
                );

                if (couponRows.length === 0) {
                    throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
                }

                const coupon = couponRows[0];
                coupon_id = coupon.coupon_id;

                //  Kiểm tra điều kiện đơn tối thiểu
                if (coupon.min_order_amount && total_amount < coupon.min_order_amount) {
                    throw new Error(
                        `Đơn hàng chưa đạt giá trị tối thiểu để dùng mã giảm giá (${coupon.min_order_amount}₫)`
                    );
                }

                //  Tính giảm giá
                let discount = 0;
                if (coupon.discount_type === "percentage") {
                    discount = (total_amount * coupon.discount_value) / 100;
                } else {
                    discount = coupon.discount_value;
                }

                discount_amount = Math.min(discount, total_amount);
                total_amount = total_amount - discount_amount;

                //  Cập nhật số lần sử dụng mã
                await conn.query(
                    `UPDATE Coupons SET uses_count = uses_count + 1 WHERE coupon_id = ?`,
                    [coupon_id]
                );
            }

            //  Tạo đơn hàng
            const [orderResult] = await conn.query(
                `INSERT INTO Orders 
             (user_id, address_id, total_amount, shipping_fee, discount_amount, notes, payment_method, status_Pay)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user_id, address_id, total_amount, shipping_fee, discount_amount, notes, payment_method, status_Pay]
            );

            const order_id = orderResult.insertId;

            //  Thêm sản phẩm vào Order_Items
            for (const item of items) {
                await conn.query(
                    `INSERT INTO Order_Items (order_id, variant_id, quantity, price)
                 VALUES (?, ?, ?, ?)`,
                    [order_id, item.variant_id, item.quantity, item.price]
                );
            }

            //  Nếu có mã giảm giá → lưu vào bảng Order_Coupons
            if (coupon_id) {
                await conn.query(
                    `INSERT INTO Order_Coupons (order_id, coupon_id) VALUES (?, ?)`,
                    [order_id, coupon_id]
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


    //  Lấy danh sách đơn hàng theo user_id
    static async getOrdersByUser(user_id) {
        // 1️ Lấy danh sách đơn hàng cơ bản
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

        //  Nếu không có đơn thì trả rỗng
        if (orders.length === 0) return [];

        //  Gắn danh sách sản phẩm vào từng đơn
        for (const order of orders) {
            const [items] = await pool.query(
                `SELECT 
                    oi.order_item_id,
                    oi.quantity,
                    oi.price,
                    p.name AS product_name,
                    p.product_id,
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

    //  Lấy tất cả đơn hàng (cho admin)
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

    //  Lấy chi tiết đơn hàng
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
    static async getOrdersByStatus() {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS count FROM Orders WHERE status = 'pending'`
        );
        return rows[0].count;
    }
    static async updatePaymentStatus(order_id, status) {
        try {
            const [result] = await pool.query(
                'UPDATE Orders SET status_Pay = ? WHERE order_id = ?',
                [status, order_id]
            );
            return result;
        } catch (err) {
            console.error('❌ Lỗi updatePaymentStatus:', err);
            throw err;
        }
    }
}

module.exports = OrderModel;
