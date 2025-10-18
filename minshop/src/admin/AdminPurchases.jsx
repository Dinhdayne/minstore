import React, { useEffect, useState } from "react";
import "./AdminPage.css";

const AdminPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [variants, setVariants] = useState([]);
    const [formData, setFormData] = useState({
        supplier_id: "",
        total_cost: "",
        notes: "",
        items: [],
    });

    const [newItem, setNewItem] = useState({ variant_id: "", quantity: "", unit_cost: "" });

    // 📦 Lấy danh sách đơn nhập hàng
    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/purchases", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setPurchases(data);
        } catch (err) {
            console.error("Lỗi lấy danh sách nhập hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        const res = await fetch("http://localhost:3000/api/suppliers");
        const data = await res.json();
        setSuppliers(data);
    };

    const fetchVariants = async () => {
        const res = await fetch("http://localhost:3000/api/variants");
        const data = await res.json();
        setVariants(data);
    };

    // 🔹 Xem chi tiết
    const fetchPurchaseDetail = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/purchases/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setSelectedPurchase(data);
        } catch (err) {
            console.error("Lỗi xem chi tiết:", err);
        }
    };

    // 🔹 Tạo mới đơn nhập hàng
    const createPurchase = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/purchases", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Tạo đơn nhập thất bại");
            alert("✅ Tạo đơn nhập hàng thành công!");
            setShowAddForm(false);
            fetchPurchases();
        } catch (err) {
            alert("❌ Lỗi khi tạo đơn nhập hàng");
            console.error(err);
        }
    };

    // 🔹 Cập nhật trạng thái đơn nhập
    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            await fetch(`http://localhost:3000/api/purchases/${id}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchPurchases();
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    useEffect(() => {
        fetchPurchases();
        fetchSuppliers();
        fetchVariants();
    }, []);

    if (loading) return <p>Đang tải dữ liệu nhập hàng...</p>;

    return (
        <div className="admin-container">
            <h2 className="page-title">📦 Quản lý nhập hàng</h2>

            {/* Nút thêm mới */}
            <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
                ➕ Thêm đơn nhập
            </button>

            {/* --- Form thêm đơn nhập --- */}
            {showAddForm && (
                <div className="form-card">
                    <h3>Tạo đơn nhập hàng</h3>
                    <label>Nhà cung cấp:</label>
                    <select
                        value={formData.supplier_id}
                        onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                    >
                        <option value="">-- Chọn nhà cung cấp --</option>
                        {suppliers.map((s) => (
                            <option key={s.supplier_id} value={s.supplier_id}>
                                {s.name}
                            </option>
                        ))}
                    </select>


                    <label>Tổng chi phí:</label>
                    <input
                        type="number"
                        value={formData.total_cost}
                        onChange={(e) =>
                            setFormData({ ...formData, total_cost: e.target.value })
                        }
                    />

                    <label>Ghi chú:</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                        }
                    />

                    {/* Danh sách item nhập */}
                    <h4>Danh sách sản phẩm nhập</h4>
                    <div className="purchase-items">
                        {formData.items.map((item, i) => (
                            <div key={i} className="purchase-item">
                                <span>
                                    Variant #{item.variant_id} | SL: {item.quantity} | Giá:
                                    {item.unit_cost}
                                </span>
                            </div>
                        ))}

                        <div className="purchase-item add-item">
                            <select
                                value={newItem.variant_id}
                                onChange={(e) => setNewItem({ ...newItem, variant_id: e.target.value })}
                            >
                                <option value="">-- Chọn biến thể --</option>
                                {variants.map((v) => (
                                    <option key={v.variant_id} value={v.variant_id}>
                                        {v.sku} - {JSON.parse(v.attributes).color || "No color"} /{" "}
                                        {JSON.parse(v.attributes).size || "No size"}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Số lượng"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Giá nhập"
                                value={newItem.unit_cost}
                                onChange={(e) => setNewItem({ ...newItem, unit_cost: e.target.value })}
                            />

                            <button
                                onClick={() => {
                                    if (!newItem.variant_id || !newItem.quantity || !newItem.unit_cost)
                                        return alert("Điền đầy đủ thông tin sản phẩm!");
                                    setFormData({
                                        ...formData,
                                        items: [...formData.items, newItem],
                                    });
                                    setNewItem({ variant_id: "", quantity: "", unit_cost: "" });
                                }}
                            >
                                ➕ Thêm sản phẩm
                            </button>
                        </div>

                    </div>

                    <button className="btn-success" onClick={createPurchase}>
                        ✅ Lưu đơn nhập
                    </button>
                </div>
            )}

            {/* --- Danh sách đơn nhập --- */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nhà cung cấp</th>
                        <th>Ngày nhập</th>
                        <th>Tổng chi phí</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {purchases.map((p) => (
                        <tr key={p.purchase_id}>
                            <td>{p.purchase_id}</td>
                            <td>{p.supplier_name || "—"}</td>
                            <td>{new Date(p.purchase_date).toLocaleDateString()}</td>
                            <td>{p.total_cost.toLocaleString()} VNĐ</td>
                            <td>
                                <span
                                    className={`status-badge ${p.status}`}
                                    title="Click để đổi trạng thái"
                                    onClick={() => {
                                        const next =
                                            p.status === "pending"
                                                ? "received"
                                                : p.status === "received"
                                                    ? "cancelled"
                                                    : "pending";
                                        updateStatus(p.purchase_id, next);
                                    }}
                                >
                                    {p.status}
                                </span>
                            </td>
                            <td>{p.notes || "—"}</td>
                            <td>
                                <button
                                    className="btn-detail"
                                    onClick={() => fetchPurchaseDetail(p.purchase_id)}
                                >
                                    🔍
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- Chi tiết đơn nhập --- */}
            {selectedPurchase && (
                <div className="detail-card">
                    <h3>Chi tiết đơn #{selectedPurchase.purchase_id}</h3>
                    <p>Nhà cung cấp: {selectedPurchase.supplier_name || "—"}</p>
                    <p>Ngày nhập: {new Date(selectedPurchase.purchase_date).toLocaleString()}</p>
                    <p>Trạng thái: {selectedPurchase.status}</p>
                    <p>Tổng chi phí: {selectedPurchase.total_cost?.toLocaleString()} VNĐ</p>
                    <p>Ghi chú: {selectedPurchase.notes || "—"}</p>

                    <h4>Sản phẩm nhập:</h4>
                    <table className="sub-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Tên sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá nhập</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedPurchase.items.map((i) => (
                                <tr key={i.pi_id}>
                                    <td>{i.sku}</td>
                                    <td>{i.product_name}</td>
                                    <td>{i.quantity}</td>
                                    <td>{i.unit_cost.toLocaleString()} VNĐ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <button className="btn-close" onClick={() => setSelectedPurchase(null)}>
                        ✖ Đóng
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminPurchases;
