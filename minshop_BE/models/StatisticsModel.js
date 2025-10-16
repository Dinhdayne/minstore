const pool = require("../config/db");

const StatisticsModel = {
    // 🟢 Doanh thu tổng hợp theo ngày / tháng / năm
    async getRevenueSummary(period = 'month', startDate = null, endDate = null) {
        const dateFormat =
            period === "day"
                ? "%Y-%m-%d"
                : period === "year"
                    ? "%Y"
                    : "%Y-%m"; // mặc định theo tháng

        // 🔹 Điều kiện WHERE động (nếu có chọn khoảng thời gian)
        let whereClause = "WHERE status IN ('delivered', 'shipped')";
        const params = [dateFormat];

        if (startDate && endDate) {
            whereClause += " AND order_date BETWEEN ? AND ?";
            params.push(startDate, endDate);
        }

        const [rows] = await pool.query(
            `
        SELECT 
            DATE_FORMAT(order_date, ?) AS date,
            COUNT(order_id) AS total_orders,
            SUM(total_amount) AS total_revenue,
            AVG(total_amount) AS avg_order_value
        FROM Orders
        ${whereClause}
        GROUP BY date
        ORDER BY date ASC;
        `,
            params
        );

        return rows;
    },


    // 🟢 Top sản phẩm bán chạy
    async getTopProducts(limit = 10, days = 7) {
        const [rows] = await pool.query(
            `
            SELECT 
                p.product_id,
                p.name AS product_name,
                SUM(oi.quantity) AS total_sold,
                SUM(oi.price * oi.quantity) AS total_revenue
            FROM Order_Items oi
            JOIN Product_Variants pv ON oi.variant_id = pv.variant_id
            JOIN Products p ON pv.product_id = p.product_id
            JOIN Orders o ON oi.order_id = o.order_id
            WHERE 
                o.status IN ('delivered', 'shipped')
                AND o.order_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY p.product_id
            ORDER BY total_sold DESC
            LIMIT ?;
            `,
            [days, limit]
        );
        return rows;
    },

    // 🟢 Tổng quan tồn kho
    async getInventoryOverview() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(*) AS total_variants,
                SUM(stock_quantity) AS total_stock,
                SUM(CASE WHEN stock_quantity <= 5 THEN 1 ELSE 0 END) AS low_stock_count
            FROM Product_Variants;
        `);
        return rows[0];
    },

    // 🟢 Lịch sử biến động kho
    async getInventoryLogs(limit = 100) {
        const [rows] = await pool.query(
            `
            SELECT 
                il.log_id,
                il.variant_id,
                il.change_amount,
                il.reason,
                il.changed_at,
                u.email AS changed_by,
                p.name AS product_name
            FROM Inventory_Logs il
            LEFT JOIN Users u ON il.changed_by = u.user_id
            LEFT JOIN Product_Variants pv ON il.variant_id = pv.variant_id
            LEFT JOIN Products p ON pv.product_id = p.product_id
            ORDER BY il.changed_at DESC
            LIMIT ?;
        `,
            [limit]
        );
        return rows;
    },

    // 🟢 Thống kê khách hàng
    async getCustomerStats() {
        const [rows] = await pool.query(`
            SELECT 
                COUNT(DISTINCT user_id) AS total_customers,
                COUNT(order_id) AS total_orders,
                SUM(total_amount) AS total_revenue,
                (SUM(total_amount) / COUNT(DISTINCT user_id)) AS avg_spent_per_customer
            FROM Orders
            WHERE status IN ('delivered', 'shipped');
        `);
        return rows[0];
    },
    // 🔁 Thống kê hoàn hàng (cancelled hoặc returned)
    async getReturnStats() {
        const [rows] = await pool.query(`
            SELECT 
                DATE(o.order_date) AS date,
                COUNT(*) AS total_returns,
                SUM(o.total_amount) AS total_refund
            FROM Orders o
            WHERE o.status IN ('cancelled', 'returned')
            GROUP BY DATE(o.order_date)
            ORDER BY date ASC
        `);
        return rows;
    }
};

module.exports = StatisticsModel;
