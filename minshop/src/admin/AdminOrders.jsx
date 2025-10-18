import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [updating, setUpdating] = useState(false);

    // 🟦 Lấy danh sách tất cả đơn hàng
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/orders/all", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Không thể tải đơn hàng");
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🟦 Lấy chi tiết đơn hàng
    const fetchOrderDetails = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (res.ok) setOrderDetails(data);
            else alert(data.message);
        } catch (error) {
            console.error(error);
            alert("Không thể tải chi tiết đơn hàng");
        }
    };

    // 🟦 Cập nhật tồn kho khi đơn hàng đã giao
    const updateStockAfterDelivery = async (orderId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}/update-stock`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (res.ok) {
                console.log("✅ Cập nhật tồn kho thành công:", data.message);
            } else {
                console.error("❌ Lỗi khi cập nhật tồn kho:", data.message);
            }
        } catch (err) {
            console.error("❌ Lỗi API cập nhật tồn kho:", err);
        }
    };

    // 🟦 Cập nhật trạng thái đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        if (!window.confirm("Xác nhận thay đổi trạng thái đơn hàng?")) return;

        try {
            setUpdating(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ " + data.message);
                // 🔹 Nếu trạng thái là "delivered" thì cập nhật tồn kho
                if (newStatus === "delivered") {
                    await updateStockAfterDelivery(orderId);
                }
                fetchOrders();
            } else {
                alert("❌ " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật trạng thái!");
        } finally {
            setUpdating(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="admin-page">
            <h2 className="admin-title">Danh sách đơn hàng</h2>

            {loading ? (
                <p>Đang tải...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : orders.length === 0 ? (
                <p>Chưa có đơn hàng nào.</p>
            ) : (
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                            <th>Địa chỉ</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.user_email || "Ẩn danh"}</td>
                                <td>{new Date(order.order_date).toLocaleString("vi-VN")}</td>
                                <td>{order.total_amount?.toLocaleString("vi-VN")}₫</td>
                                <td>{order.phone}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order.order_id, e.target.value)
                                        }
                                        // 🔹 Disable khi đang cập nhật hoặc đã giao / hủy
                                        disabled={
                                            updating ||
                                            order.status === "delivered" ||
                                            order.status === "cancelled"
                                        }
                                    >
                                        <option value="pending">pending</option>
                                        <option value="processing">processing</option>
                                        <option value="shipped">shipped</option>
                                        <option value="delivered">delivered</option>
                                        <option value="cancelled">cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    {[order.address_line, order.ward, order.district, order.city]
                                        .filter(Boolean)
                                        .join(", ")}
                                </td>
                                <td>
                                    <button
                                        className="btn-view"
                                        onClick={() => {
                                            setSelectedOrder(order.order_id);
                                            fetchOrderDetails(order.order_id);
                                        }}
                                    >
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* 🟡 Modal xem chi tiết đơn hàng */}
            {selectedOrder && orderDetails && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Chi tiết đơn #{orderDetails.order_id}</h3>
                        <p><strong>Người đặt:</strong> {orderDetails.first_name || orderDetails.email} {orderDetails.last_name}</p>
                        <p><strong>SĐT:</strong> {orderDetails.phone}</p>
                        <p><strong>Ngày đặt:</strong> {new Date(orderDetails.order_date).toLocaleString("vi-VN")}</p>
                        <p><strong>Trạng thái:</strong> {orderDetails.status}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> {[orderDetails.address_line, orderDetails.ward, orderDetails.district, orderDetails.city].filter(Boolean).join(", ")}</p>

                        <h4>Sản phẩm trong đơn:</h4>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Màu</th>
                                    <th>Size</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderDetails.items.map((item) => (
                                    <tr key={item.order_item_id}>
                                        <td>{item.product_name}</td>
                                        <td>{item.attributes?.color
                                            ? `${item.attributes.color}`
                                            : ""}</td>
                                        <td>{item.attributes.size}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price?.toLocaleString("vi-VN")}₫</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p><strong>Tổng tiền:</strong> {orderDetails.total_amount?.toLocaleString("vi-VN")}₫</p>
                        <div className="modal-footer">
                            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
