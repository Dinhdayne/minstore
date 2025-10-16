const pool = require("../config/db");

const PurchaseModel = {
    // 🔹 Lấy tất cả đơn nhập hàng
    async getAll() {
        const [rows] = await pool.query(`
            SELECT p.*, s.name AS supplier_name
            FROM Purchases p
            LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
            ORDER BY p.purchase_date DESC
        `);
        return rows;
    },

    // 🔹 Lấy chi tiết 1 đơn nhập hàng
    async getById(id) {
        const [purchase] = await pool.query(`
            SELECT p.*, s.name AS supplier_name
            FROM Purchases p
            LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
            WHERE p.purchase_id = ?
        `, [id]);

        const [items] = await pool.query(`
            SELECT pi.*, pv.sku, pv.attributes, pr.name AS product_name
            FROM Purchase_Items pi
            JOIN Product_Variants pv ON pi.variant_id = pv.variant_id
            JOIN Products pr ON pv.product_id = pr.product_id
            WHERE pi.purchase_id = ?
        `, [id]);

        return { ...purchase[0], items };
    },

    // 🔹 Tạo đơn nhập hàng mới
    async create({ supplier_id, total_cost, notes, items = [] }) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // 1️⃣ Thêm đơn nhập hàng
            const [result] = await conn.query(
                `INSERT INTO Purchases (supplier_id, total_cost, notes) VALUES (?, ?, ?)`,
                [supplier_id, total_cost, notes]
            );

            const purchaseId = result.insertId;

            // 2️⃣ Thêm các mặt hàng nhập
            for (const item of items) {
                await conn.query(
                    `INSERT INTO Purchase_Items (purchase_id, variant_id, quantity, unit_cost)
                     VALUES (?, ?, ?, ?)`,
                    [purchaseId, item.variant_id, item.quantity, item.unit_cost]
                );

                // 3️⃣ Cập nhật Product_Costs
                await conn.query(
                    `INSERT INTO Product_Costs (variant_id, cost_price, effective_date, notes)
                     VALUES (?, ?, CURDATE(), ?)`,
                    [item.variant_id, item.unit_cost, "Tự động thêm khi nhập hàng"]
                );

                // 4️⃣ Cập nhật kho (Inventory_Logs)
                await conn.query(
                    `INSERT INTO Inventory_Logs (variant_id, change_amount, reason, changed_by)
                     VALUES (?, ?, 'restock', NULL)`,
                    [item.variant_id, item.quantity]
                );
            }

            await conn.commit();
            return { message: "Tạo đơn nhập hàng thành công", purchaseId };
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    },

    // 🔹 Cập nhật trạng thái đơn hàng (vd: từ pending → received)
    async updateStatus(purchaseId, status) {
        await pool.query(
            `UPDATE Purchases SET status = ? WHERE purchase_id = ?`,
            [status, purchaseId]
        );
        return { message: "Cập nhật trạng thái thành công" };
    },

    // 🔹 Xóa đơn nhập hàng
    async delete(purchaseId) {
        await pool.query(`DELETE FROM Purchases WHERE purchase_id = ?`, [purchaseId]);
        return { message: "Đã xóa đơn nhập hàng" };
    }
};

module.exports = PurchaseModel;
