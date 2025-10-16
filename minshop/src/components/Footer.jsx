import React from "react";
import "../App.css";

const Footer = () => {
    return (
        <footer>
            <div className="footer-container">
                <div className="footer-column">
                    <h4>Về Minshop</h4>
                    <ul>
                        <li><a href="#">Giới thiệu</a></li>
                        <li><a href="#">Tuyển dụng</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Hỗ trợ khách hàng</h4>
                    <ul>
                        <li><a href="#">Hướng dẫn mua hàng</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                        <li><a href="#">Chính sách bảo hành</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Liên hệ</h4>
                    <ul>
                        <li><a href="#">Hotline: 0964942121</a></li>
                        <li><a href="#">Email: support@minshop.vn</a></li>
                        <li><a href="#">Chat trực tuyến</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Theo dõi chúng tôi</h4>
                    <ul>
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Instagram</a></li>
                        <li><a href="#">Tiktok</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 Minshop. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
