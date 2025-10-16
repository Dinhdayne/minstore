import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBrand, setEditingBrand] = useState(null);
    const [newBrand, setNewBrand] = useState({
        name: "",
        description: "",
        logo_url: "",
    });

    // 🧩 Lấy danh sách brand
    const fetchBrands = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/brands");
            const data = await res.json();
            if (res.ok) setBrands(data);
            else console.error("Lỗi lấy thương hiệu:", data.message);
        } catch (err) {
            console.error("Lỗi fetch brands:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // ➕ Thêm brand
    const handleAddBrand = async () => {
        if (!newBrand.name.trim()) {
            alert("Tên thương hiệu không được để trống!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/brands", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newBrand),
            });
            if (res.ok) {
                alert("Đã thêm thương hiệu mới!");
                setNewBrand({ name: "", description: "", logo_url: "" });
                fetchBrands();
            } else {
                alert("Lỗi khi thêm thương hiệu!");
            }
        } catch (err) {
            console.error("Lỗi thêm brand:", err);
        }
    };

    // ✏️ Cập nhật brand
    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:3000/api/brands/${editingBrand.brand_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(editingBrand),
                }
            );
            if (res.ok) {
                alert("Cập nhật thành công!");
                setEditingBrand(null);
                fetchBrands();
            } else {
                alert("Lỗi khi lưu thương hiệu!");
            }
        } catch (err) {
            console.error("Lỗi cập nhật brand:", err);
        }
    };

    // ❌ Xóa brand
    const handleDeleteBrand = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa thương hiệu này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/brands/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                alert("Đã xóa thương hiệu!");
                fetchBrands();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (err) {
            console.error("Lỗi xóa brand:", err);
        }
    };

    if (loading) return <p>Đang tải danh sách thương hiệu...</p>;

    return (
        <div className="brands-container">
            <div className="products-header">
                <h2>Quản lý thương hiệu</h2>
            </div>

            {/* Form thêm thương hiệu */}
            <div className="add-brand-form">
                <input
                    placeholder="Tên thương hiệu"
                    value={newBrand.name}
                    onChange={(e) =>
                        setNewBrand({ ...newBrand, name: e.target.value })
                    }
                />
                <input
                    placeholder="Mô tả"
                    value={newBrand.description}
                    onChange={(e) =>
                        setNewBrand({ ...newBrand, description: e.target.value })
                    }
                />
                <input
                    placeholder="Link logo"
                    value={newBrand.logo_url}
                    onChange={(e) =>
                        setNewBrand({ ...newBrand, logo_url: e.target.value })
                    }
                />
                <button className="btn-add" onClick={handleAddBrand}>
                    + Thêm thương hiệu
                </button>
            </div>

            {/* Bảng danh sách thương hiệu */}
            <table className="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Logo</th>
                        <th>Tên thương hiệu</th>
                        <th>Mô tả</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {brands.length > 0 ? (
                        brands.map((b) => {
                            const isEditing =
                                editingBrand && editingBrand.brand_id === b.brand_id;

                            return (
                                <tr key={b.brand_id}>
                                    <td>{b.brand_id}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingBrand.logo_url}
                                                onChange={(e) =>
                                                    setEditingBrand({
                                                        ...editingBrand,
                                                        logo_url: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : b.logo_url ? (
                                            <img
                                                src={b.logo_url}
                                                alt={b.name}
                                                style={{ width: 60, height: 60, borderRadius: 6 }}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingBrand.name}
                                                onChange={(e) =>
                                                    setEditingBrand({
                                                        ...editingBrand,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            b.name
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingBrand.description || ""}
                                                onChange={(e) =>
                                                    setEditingBrand({
                                                        ...editingBrand,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            b.description || "—"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <>
                                                <button
                                                    className="btn-save"
                                                    onClick={handleSaveEdit}
                                                >
                                                    Lưu
                                                </button>
                                                <button
                                                    className="btn-cancel"
                                                    onClick={() => setEditingBrand(null)}
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        setEditingBrand({ ...b })
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() =>
                                                        handleDeleteBrand(b.brand_id)
                                                    }
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>
                                Chưa có thương hiệu nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminBrands;
