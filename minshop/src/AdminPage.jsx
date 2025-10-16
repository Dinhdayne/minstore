import React, { useState, useEffect } from "react";
import "./AccountPage.css"; // import CSS này nhé
import AdminProducts from "./admin/AdminProducts";
import AdminUsers from "./admin/AdminUsers";
import AdminCategories from "./admin/AdminCategories";
import AdminBrands from "./admin/AdminBrands";
import AdminOrders from "./admin/AdminOrders";

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("Products");

    const menuItems = [
        "Products",
        "Categories",
        "Suppliers",
        "Users",
        "Orders",
        "Purchases",
        "Inventory",
        "Reports",
        "Coupons",
        "Chat",
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
                return <AdminOrders />;


            case "Purchases":
                return (
                    <>
                        <h2>Purchases</h2>
                        <p>Chưa có đánh giá nào.</p>
                    </>
                );
            case "Inventory":
                return (
                    <>
                        <h2>Inventory</h2>
                        <p>Chưa có đánh giá nào.</p>
                    </>
                );
            case "Reports":
                return (
                    <>
                        <h2>Reports</h2>
                        <p>Chưa có đánh giá nào.</p>
                    </>
                );
            case "Suppliers":
                return <AdminBrands />;
            case "Coupons":

            case "Chat":
                return (
                    <>
                        <h2>Chat</h2>
                        <p>Chưa có đánh giá nào.</p>
                    </>
                );
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
                        className={`sidebar-item ${activeTab === item ? "active" : ""
                            }`}
                    >
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            {/* Nội dung phải */}
            <div className="account-content">{renderContent()}</div>
        </div>
    );
};

export default AccountPage;
