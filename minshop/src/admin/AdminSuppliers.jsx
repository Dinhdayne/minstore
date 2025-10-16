import React, { useEffect, useState } from "react";
import "./AdminPage.css";

const AdminSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        contact_email: "",
        phone: "",
    });

    // 🔹 Lấy danh sách nhà cung cấp
    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:3000/api/suppliers");
            const data = await res.json();
            setSuppliers(data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách nhà cung cấp:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // 🔹 Xử lý input form
    const handleChange = (e) => {
        setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
    };

    // 🔹 Thêm mới hoặc cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const method = editing ? "PUT" : "POST";
            const url = editing
                ? `http://localhost:3000/api/suppliers/${editing.supplier_id}`
                : "http://localhost:3000/api/suppliers";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSupplier),
            });

            if (!res.ok) throw new Error("Lỗi khi lưu nhà cung cấp");
            await fetchSuppliers();
            resetForm();
        } catch (err) {
            console.error("Lỗi submit:", err);
        }
    };

    // 🔹 Xóa nhà cung cấp
    const handleDelete = async (id) => {
        if (!window.confirm("Xóa nhà cung cấp này?")) return;
        try {
            await fetch(`http://localhost:3000/api/suppliers/${id}`, { method: "DELETE" });
            await fetchSuppliers();
        } catch (err) {
            console.error("Lỗi khi xóa:", err);
        }
    };

    // 🔹 Sửa
    const handleEdit = (supplier) => {
        setEditing(supplier);
        setNewSupplier({
            name: supplier.name,
            contact_email: supplier.contact_email || "",
            phone: supplier.phone || "",
        });
    };

    // 🔹 Reset form
    const resetForm = () => {
        setNewSupplier({ name: "", contact_email: "", phone: "" });
        setEditing(null);
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="admin-page">
            <h2>🏢 Quản lý nhà cung cấp</h2>

            {/* Form thêm/sửa */}
            <form className="admin-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Tên nhà cung cấp"
                    value={newSupplier.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="contact_email"
                    placeholder="Email liên hệ"
                    value={newSupplier.contact_email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={newSupplier.phone}
                    onChange={handleChange}
                />

                <div className="form-actions">
                    <button type="submit" className="btn-save">
                        {editing ? "💾 Cập nhật" : "➕ Thêm mới"}
                    </button>
                    {editing && (
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            {/* Danh sách nhà cung cấp */}
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Ngày tạo</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.length > 0 ? (
                        suppliers.map((s) => (
                            <tr key={s.supplier_id}>
                                <td>{s.supplier_id}</td>
                                <td>{s.name}</td>
                                <td>{s.contact_email || "-"}</td>
                                <td>{s.phone || "-"}</td>
                                <td>{new Date(s.created_at).toLocaleString("vi-VN")}</td>
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={() => handleEdit(s)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDelete(s.supplier_id)}
                                    >
                                        Xoá
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Chưa có nhà cung cấp nào</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminSuppliers;
