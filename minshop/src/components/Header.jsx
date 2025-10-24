import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getCustomer } from "../include/api";
import { io } from "socket.io-client";
import "../App.css";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const [customer, setCustomer] = useState(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [cartCount, setCartCount] = useState(0);


    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) return; // ⛔ Không connect socket nếu chưa đăng nhập
        console.log("🔍 user_id khi connect socket:", userId);
        const socket = io("http://localhost:3000", {
            auth: { user_id: userId },
        });

        socket.on("connect", () => {
            console.log("🟢 Kết nối socket thành công:", socket.id);
        });

        socket.on("newCartItem", (data) => {
            console.log("🛒 Có sản phẩm mới trong giỏ:", data);

            // 🟢 Cập nhật realtime số lượng
            setCartCount((prev) => prev + (data.quantity || 1));

            // 🟡 Hiển thị thông báo tạm thời
            const toast = document.createElement("div");
            toast.textContent = `🎉 ${data.product_name || "Sản phẩm"} đã được thêm vào giỏ hàng!`;
            toast.className = "cart-toast";
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add("hide");
                setTimeout(() => toast.remove(), 500);
            }, 2500);
        });


        socket.on("disconnect", () => {
            console.log("🔴 Socket ngắt kết nối");
        });

        return () => socket.disconnect();
    }, []);

    // Ẩn menu tài khoản khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".account-dropdown")) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Lấy thông tin khách hàng
    useEffect(() => {
        const fetchCustomer = async () => {
            if (isAuthenticated && user?.user_id) {
                try {
                    const customerData = await getCustomer(user.user_id);
                    setCustomer(customerData);
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin khách hàng:", error);
                }
            }
        };
        fetchCustomer();
    }, [isAuthenticated, user]);



    // 🛒 Lấy số lượng sản phẩm trong giỏ hàng
    useEffect(() => {
        const fetchCartCount = async () => {
            if (isAuthenticated && user?.user_id) {
                try {
                    const response = await fetch(
                        `http://localhost:3000/api/cart/${user.user_id}`
                    );
                    const data = await response.json();
                    console.log(data);

                    // Nếu API trả về danh sách sản phẩm
                    if (Array.isArray(data.items)) {
                        setCartCount(data.items.length);
                    } else if (Array.isArray(data)) {
                        setCartCount(data.length);
                    } else {
                        setCartCount(0);
                    }

                } catch (error) {
                    console.error("Lỗi khi lấy giỏ hàng:", error);
                }
            } else {
                setCartCount(0);
            }
        };

        fetchCartCount();
    }, [isAuthenticated, user]);
    // Hiệu ứng header ẩn khi scroll
    useEffect(() => {
        const handleScroll = () => {
            setShowHeader(window.scrollY < lastScrollY);
            setLastScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <>
            <header className={`site-header ${showHeader ? "visible" : "hidden"}`}>
                <div className="header-container">

                    {/* Nút menu mobile */}
                    <button
                        className="menu-toggle mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        ☰
                    </button>

                    {/* Logo */}
                    <a href="/" className="logo">
                        <img src="/images/logo2.png" alt="Minshop Logo" />
                    </a>

                    {/* Menu desktop */}
                    <nav className="desktop-menu">
                        <ul>
                            <li><a href="#">Sản phẩm mới</a></li>
                            <li><a href="#">Danh mục sale</a></li>
                            <li>
                                <a href="#">Áo nam</a>
                                <ul>
                                    <li><a href="#">Áo Polo</a></li>
                                    <li><a href="#">Áo Thun</a></li>
                                    <li><a href="#">Áo Sơ Mi</a></li>
                                    <li><a href="#">Áo Blazer</a></li>
                                    <li><a href="#">Áo Khoác</a></li>
                                    <li><a href="#">Áo Liền</a></li>
                                </ul>
                            </li>
                            <li>
                                <a href="#">Quần nam</a>
                                <ul>
                                    <li><a href="#">Quần Tây</a></li>
                                    <li><a href="#">Quần Jeans</a></li>
                                    <li><a href="#">Quần Short</a></li>
                                </ul>
                            </li>

                            <li><a href="#">Hệ thống cửa hàng</a></li>
                        </ul>
                    </nav>

                    {/* Icon phải */}
                    <div className="header-icons">
                        <a
                            className="search-icon"
                            onClick={() => setShowSearchBar(!showSearchBar)}
                        >
                            <img
                                src={isAuthenticated ? "/images/search1.png" : "/images/search.png"}
                                alt="Tìm kiếm"
                            />
                        </a>

                        {isAuthenticated ? (
                            <div
                                className="account-dropdown"
                                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                            >
                                <div className="account-icon">
                                    <img src="/images/check.png" alt="Tài khoản" />
                                </div>

                                {isAccountMenuOpen && (
                                    <div className="account-menu">
                                        <p className="menu-title">THÔNG TIN TÀI KHOẢN</p>
                                        <p className="account-name">
                                            {customer?.display_name || customer?.name || customer?.email || "Người dùng"}
                                        </p>
                                        <hr className="menu-divider" />
                                        <ul>
                                            <li><a href={isAuthenticated ? "/AccountPage" : "/Login"}>Tài khoản của tôi</a></li>
                                            <li><a href="/" onClick={logout}>Đăng xuất</a></li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <a href="/Login">
                                <img src="/images/user1.png" alt="Đăng nhập" />
                            </a>
                        )}

                        <a href={isAuthenticated ? "/CartPage" : "/Login"}>
                            <img
                                src={isAuthenticated ? "/images/bag1.png" : "images/bag.png"}
                                alt="Giỏ hàng"
                            />
                            {/* 🛒 Badge hiển thị số lượng sản phẩm */}
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </a>
                    </div>
                </div>

                {/* Menu mobile */}
                {isMobileMenuOpen && (
                    <nav className="mobile-menu">
                        <button className="close" onClick={() => setIsMobileMenuOpen(false)}>×</button>
                        <ul>
                            <li><a href="#">Sản phẩm mới</a></li>
                            <li><a href="#">Danh mục sale</a></li>
                            <li><a href="#">Áo nam</a></li>
                            <li><a href="#">Quần nam</a></li>
                            <li><a href="#">Bộ sưu tập</a></li>
                            <li><a href="#">Hệ thống cửa hàng</a></li>
                        </ul>
                    </nav>
                )}
            </header>

            {/* 🔍 Thanh tìm kiếm che header */}
            {showSearchBar && (
                <div className="search-overlay">
                    <div className="search-overlay-content">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="search-overlay-input"
                        />
                        <button
                            className="search-overlay-close"
                            onClick={() => setShowSearchBar(false)}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </>
    );

};

export default Header;
