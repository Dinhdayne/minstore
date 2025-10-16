import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        is_active: "",
    });

    // 🧩 Lấy danh sách categories
    const fetchCategories = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/categories");
            const data = await res.json();
            if (res.ok) setCategories(data);
            else console.error("Lỗi lấy categories:", data.message);
        } catch (err) {
            console.error("Lỗi fetch categories:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ➕ Thêm danh mục
    const handleAddCategory = async () => {
        if (!newCategory.name.trim()) {
            alert("Tên danh mục không được để trống!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newCategory),
            });
            if (res.ok) {
                alert("Đã thêm danh mục mới!");
                setNewCategory({
                    name: "",
                    slug: "",
                    description: "",
                    image_url: "",
                    is_active: "",
                });
                fetchCategories();
            } else {
                alert("Lỗi khi thêm danh mục!");
            }
        } catch (err) {
            console.error("Lỗi thêm category:", err);
        }
    };

    // ✏️ Cập nhật danh mục
    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `http://localhost:3000/api/categories/${editingCategory.category_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(editingCategory),
                }
            );
            if (res.ok) {
                alert("Cập nhật thành công!");
                setEditingCategory(null);
                fetchCategories();
            } else {
                alert("Lỗi khi lưu danh mục!");
            }
        } catch (err) {
            console.error("Lỗi cập nhật category:", err);
        }
    };

    // ❌ Xóa danh mục
    const handleDeleteCategory = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                alert("Đã xóa danh mục!");
                fetchCategories();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (err) {
            console.error("Lỗi xóa category:", err);
        }
    };

    if (loading) return <p>Đang tải danh sách danh mục...</p>;

    return (
        <div className="brands-container">
            <div className="products-header">
                <h2>Quản lý danh mục</h2>
            </div>

            {/* Form thêm danh mục */}
            <div className="add-brand-form">
                <input
                    placeholder="Tên danh mục"
                    value={newCategory.name}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                    }
                />
                <input
                    placeholder="Slug (vd: ao-thun-nam)"
                    value={newCategory.slug}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, slug: e.target.value })
                    }
                />
                <input
                    placeholder="Mô tả"
                    value={newCategory.description}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, description: e.target.value })
                    }
                />
                <input
                    placeholder="Link ảnh"
                    value={newCategory.image_url}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, image_url: e.target.value })
                    }
                />
                <input
                    placeholder="Trang thái"
                    value={newCategory.is_active}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, is_active: e.target.value })
                    }
                />
                <button className="btn-add" onClick={handleAddCategory}>
                    + Thêm danh mục
                </button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Slug</th>
                        <th>Mô tả</th>
                        <th>Ảnh</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? (
                        categories.map((c) => {
                            const isEditing =
                                editingCategory && editingCategory.category_id === c.category_id;

                            return (
                                <tr key={c.category_id}>
                                    <td>{c.category_id}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingCategory.name}
                                                onChange={(e) =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            c.name
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingCategory.slug}
                                                onChange={(e) =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        slug: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            c.slug
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingCategory.description || ""}
                                                onChange={(e) =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            c.description || "—"
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                value={editingCategory.image_url || ""}
                                                onChange={(e) =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        image_url: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            c.image_url ? (
                                                <img
                                                    src={c.image_url}
                                                    alt={c.name}
                                                    style={{ width: 60, height: 60, borderRadius: 6 }}
                                                />
                                            ) : (
                                                "—"
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <select
                                                value={editingCategory.is_active ? "true" : "false"}
                                                onChange={(e) =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        is_active: e.target.value === "true",
                                                    })
                                                }
                                            >
                                                <option value="true">Hoạt động</option>
                                                <option value="false">Ngừng</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={
                                                    c.is_active
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }
                                            >
                                                {c.is_active ? "Hoạt động" : "Ngừng"}
                                            </span>
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
                                                    onClick={() => setEditingCategory(null)}
                                                >
                                                    Hủy
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        setEditingCategory({ ...c })
                                                    }
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() =>
                                                        handleDeleteCategory(c.category_id)
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
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                Chưa có danh mục nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategories;
