import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./AccountPage.css";
import AdminProducts from "./admin/AdminProducts";
import AdminUsers from "./admin/AdminUsers";
import AdminCategories from "./admin/AdminCategories";
import AdminBrands from "./admin/AdminBrands";
import AdminOrders from "./admin/AdminOrders";
import AdminReports from "./admin/Statistics";
import AdminPurchases from "./admin/AdminPurchases";
import AdminSuppliers from "./admin/AdminSuppliers";
import AdminCoupons from "./admin/AdminCoupons";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("Products");
    const [newOrderCount, setNewOrderCount] = useState(0); // 🔥 thêm
    const [showNotification, setShowNotification] = useState(false); // 🔥 thêm
    const navigate = useNavigate(); // ⬅️ khởi tạo hook điều hướng

    // 🧩 Kiểm tra quyền truy cập
    useEffect(() => {
        const role = localStorage.getItem("role");

        // Nếu chưa đăng nhập hoặc không phải admin → chặn truy cập
        if (!role || role.toLowerCase() !== "admin") {
            alert("Bạn không có quyền truy cập trang này!");
            navigate("/"); // chuyển về trang chủ hoặc login
        }
    }, [navigate]);
    // 🧠 Kết nối socket.io để nhận đơn hàng mới
    useEffect(() => {
        // 🟢 Hàm lấy số đơn hàng pending từ server
        const fetchPendingCount = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3000/api/orders/pending/count",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                setNewOrderCount(data.pendingCount || 0);
            } catch (error) {
                console.error("❌ Lỗi khi lấy số đơn pending:", error);
            }
        };

        // Gọi 1 lần khi trang load
        fetchPendingCount();

        // 🔥 Kết nối socket
        const socket = io("http://localhost:3000");

        socket.on("connect", () => {
            console.log("✅ Kết nối socket:", socket.id);
        });

        socket.on("newOrder", async (order) => {
            console.log("📦 Có đơn hàng mới:", order);

            // Cập nhật lại số đơn pending (thay vì chỉ +1)
            await fetchPendingCount();

            // Hiển thị thông báo popup
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 4000);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const menuItems = [
        "Products",
        "Categories",
        "Brands",
        "Suppliers",
        "Users",
        "Orders",
        "Purchases",
        "Statistics",
        "Coupons",
    ];

    const InfoRow = ({ label, value }) => (
        <div className="info-row">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.user_id) {
                console.warn("Không tìm thấy user_id trong localStorage");
                setLoading(false);
                return;
            }

            const res = await fetch(
                `http://localhost:3000/api/userProfile/${user.user_id}`
            );
            const data = await res.json();

            if (res.ok) setProfile(data);
            else console.error("Lỗi khi lấy profile:", data.message);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const safeValue = (val, fallback = "Chưa cập nhật") =>
        val && val !== "" ? val : fallback;

    const renderContent = () => {
        switch (activeTab) {
            case "Products":
                return <AdminProducts />;

            case "Categories":
                return <AdminCategories />;

            case "Users":
                return <AdminUsers />;

            case "Orders":
                // reset badge khi admin click vào Orders
                // if (newOrderCount > 0) setNewOrderCount(0);
                return <AdminOrders />;

            case "Purchases":
                return <AdminPurchases />;

            case "Statistics":
                return <AdminReports />;

            case "Brands":
                return <AdminBrands />;

            case "Coupons":
                return <AdminCoupons />;
            case "Suppliers":
                return <AdminSuppliers />;
            default:
                return null;
        }
    };

    return (
        <div className="account-container">
            {/* Sidebar trái */}
            <div className="account-sidebar">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`sidebar-item ${activeTab === item ? "active" : ""}`}
                    >
                        <span>{item}</span>

                        {/* 🔥 Nếu là tab Orders và có đơn hàng mới thì hiển thị badge */}
                        {item === "Orders" && newOrderCount > 0 && (
                            <span className="order-badge">{newOrderCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Nội dung phải */}
            <div className="account-content">{renderContent()}</div>
            {/* Thông báo đơn hàng mới */}
            {showNotification && (
                <div className="realtime-toast">
                    🔔 Có đơn hàng mới vừa được tạo!
                </div>
            )}
        </div>
    );
};

export default AccountPage;
