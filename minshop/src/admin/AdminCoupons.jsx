import React, { useEffect, useState } from "react";
import "./AdminPage.css";

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [form, setForm] = useState({
        code: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_uses: "",
        expiry_date: "",
    });

    const token = localStorage.getItem("token");

    // 🧠 Load danh sách coupon
    const fetchCoupons = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/coupons", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setCoupons(data);
        } catch (err) {
            console.error("❌ Lỗi khi load coupons:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // 🧩 Xử lý nhập form
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🟢 Tạo hoặc cập nhật coupon
    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editingCoupon ? "PUT" : "POST";
        const url = editingCoupon
            ? `http://localhost:3000/api/coupons/${editingCoupon.coupon_id}`
            : "http://localhost:3000/api/coupons";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Lỗi khi lưu coupon");

            alert(editingCoupon ? "Cập nhật mã thành công!" : "Thêm mã mới thành công!");
            setForm({
                code: "",
                discount_type: "percentage",
                discount_value: "",
                min_order_amount: "",
                max_uses: "",
                expiry_date: "",
            });
            setEditingCoupon(null);
            fetchCoupons();
        } catch (err) {
            alert(err.message);
        }
    };

    // 🟠 Sửa coupon
    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setForm({
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            min_order_amount: coupon.min_order_amount,
            max_uses: coupon.max_uses,
            expiry_date: coupon.expiry_date?.split("T")[0],
        });
    };

    // 🔴 Xóa coupon
    const handleDelete = async (coupon_id) => {
        if (!window.confirm("Xóa mã này?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/coupons/${coupon_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Lỗi khi xóa");
            alert("Xóa thành công!");
            fetchCoupons();
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="admin-coupons-container">
            <h2>Quản lý mã giảm giá</h2>

            {/* Form thêm/sửa */}
            <form className="coupon-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="code"
                    placeholder="Mã giảm giá"
                    value={form.code}
                    onChange={handleChange}
                    required
                />
                <select
                    name="discount_type"
                    value={form.discount_type}
                    onChange={handleChange}
                >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định</option>
                </select>
                <input
                    type="number"
                    step="0.01"
                    name="discount_value"
                    placeholder="Giá trị giảm"
                    value={form.discount_value}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="min_order_amount"
                    placeholder="Đơn tối thiểu (tùy chọn)"
                    value={form.min_order_amount}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="max_uses"
                    placeholder="Số lần sử dụng tối đa"
                    value={form.max_uses}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="expiry_date"
                    value={form.expiry_date}
                    onChange={handleChange}
                />
                <button type="submit">
                    {editingCoupon ? "Cập nhật" : "Thêm mã"}
                </button>
                {editingCoupon && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingCoupon(null);
                            setForm({
                                code: "",
                                discount_type: "percentage",
                                discount_value: "",
                                min_order_amount: "",
                                max_uses: "",
                                expiry_date: "",
                            });
                        }}
                        className="cancel-btn"
                    >
                        Hủy
                    </button>
                )}
            </form>

            {/* Bảng danh sách */}
            <table className="coupon-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã</th>
                        <th>Loại</th>
                        <th>Giá trị</th>
                        <th>Tối thiểu</th>
                        <th>Lượt / Tối đa</th>
                        <th>Hết hạn</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.length === 0 ? (
                        <tr>
                            <td colSpan="9">Chưa có mã giảm giá nào.</td>
                        </tr>
                    ) : (
                        coupons.map((c) => (
                            <tr key={c.coupon_id}>
                                <td>{c.coupon_id}</td>
                                <td>{c.code}</td>
                                <td>{c.discount_type}</td>
                                <td>{c.discount_value}</td>
                                <td>{c.min_order_amount || "-"}</td>
                                <td>
                                    {c.uses_count}/{c.max_uses || "∞"}
                                </td>
                                <td>
                                    {c.expiry_date
                                        ? new Date(c.expiry_date).toLocaleDateString("vi-VN")
                                        : "-"}
                                </td>
                                <td>
                                    {c.is_active ? (
                                        <span className="active-status">Đang hoạt động</span>
                                    ) : (
                                        <span className="inactive-status">Ngừng</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCoupons;
