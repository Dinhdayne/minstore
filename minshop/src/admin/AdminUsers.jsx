import React, { useEffect, useState } from "react";
import "./AdminPage.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);

    // 🧩 Lấy danh sách user
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/users");
            const data = await res.json();
            if (res.ok) setUsers(data);
            else console.error("Lỗi lấy users:", data.message);
        } catch (err) {
            console.error("Lỗi fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // ❌ Xóa user
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                alert("Đã xóa người dùng!");
                fetchUsers();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (err) {
            console.error("Lỗi khi xóa user:", err);
        }
    };

    // 🔄 Bật/tắt tài khoản
    const toggleActive = async (user) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/users/${user.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ is_active: !user.is_active }),
            });
            if (res.ok) {
                fetchUsers();
            } else {
                alert("Không thể thay đổi trạng thái!");
            }
        } catch (err) {
            console.error("Lỗi cập nhật trạng thái:", err);
        }
    };

    // 🧑‍💼 Lưu thay đổi quyền
    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/users/${editingUser.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    role: editingUser.role,
                    is_active: editingUser.is_active,
                }),
            });
            if (res.ok) {
                alert("Cập nhật thành công!");
                setEditingUser(null);
                fetchUsers();
            } else {
                alert("Lỗi khi lưu!");
            }
        } catch (err) {
            console.error("Lỗi lưu user:", err);
        }
    };

    if (loading) return <p>Đang tải danh sách người dùng...</p>;

    return (
        <div className="users-container">
            <div className="products-header">
                <h2>Quản lý người dùng</h2>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Quyền</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => {
                        const isEditing = editingUser && editingUser.user_id === u.user_id;
                        return (
                            <tr key={u.user_id}>
                                <td>{u.user_id}</td>
                                <td>{u.email}</td>
                                <td>
                                    {isEditing ? (
                                        <select
                                            value={editingUser.role}
                                            onChange={(e) =>
                                                setEditingUser({
                                                    ...editingUser,
                                                    role: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={
                                                u.role === "admin"
                                                    ? "role-admin"
                                                    : "role-user"
                                            }
                                        >
                                            {u.role}
                                        </span>
                                    )}
                                </td>
                                <td>
                                    {isEditing ? (
                                        <select
                                            value={editingUser.is_active ? "true" : "false"}
                                            onChange={(e) =>
                                                setEditingUser({
                                                    ...editingUser,
                                                    is_active: e.target.value === "true",
                                                })
                                            }
                                        >
                                            <option value="true">Hoạt động</option>
                                            <option value="false">Bị khóa</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={
                                                u.is_active
                                                    ? "status-active"
                                                    : "status-inactive"
                                            }
                                        >
                                            {u.is_active ? "Hoạt động" : "Bị khóa"}
                                        </span>
                                    )}
                                </td>
                                <td>{new Date(u.created_at).toLocaleDateString()}</td>
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
                                                onClick={() => setEditingUser(null)}
                                            >
                                                Hủy
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    setEditingUser({ ...u })
                                                }
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn-toggle"
                                                onClick={() => toggleActive(u)}
                                            >
                                                {u.is_active ? "Khóa" : "Mở"}
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    handleDeleteUser(u.user_id)
                                                }
                                            >
                                                Xóa
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
