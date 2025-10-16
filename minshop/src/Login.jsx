import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from "./include/config";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./contexts/AuthContext";
import { googleLogin } from "./include/auth";

const clientId = GOOGLE_CLIENT_ID;

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const decoded = jwtDecode(token);
            console.log("Google decoded:", decoded);

            // Gọi API backend xác thực token Google
            const res = await googleLogin(token);

            // lưu user + token vào context
            login(res.data.user, res.data.token);

            // chuyển hướng sau khi đăng nhập thành công
            navigate("/");
        } catch (err) {
            console.error("Login Failed:", err);
            setError("Đăng nhập Google thất bại");
        }
    };

    const handleError = () => {
        console.log("Login Failed");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Vui lòng điền đầy đủ thông tin");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok || !data.token) {
                setError(data.message || "Tên đăng nhập hoặc mật khẩu không đúng");
                return;
            }

            // Lưu token và role vào localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("id", data.id);

            if (data.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError("Lỗi khi kết nối đến server");
        }
    };

    return (
        <div className="containers">
            <form onSubmit={handleSubmit}>
                <div className="login-section">
                    <h1>MinShop</h1>

                    <div className="tabs">
                        <div className="tab active">Đăng nhập</div>
                        <Link to="/register" className="tab">Đăng ký</Link>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Vui lòng nhập email của bạn</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Vui lòng nhập mật khẩu của bạn</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            required
                        />
                    </div>

                    <div className="recaptcha-notice">
                        This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
                    </div>

                    <div className="divider"></div>

                    <button type="submit" className="login-btn">ĐĂNG NHẬP</button>
                    <GoogleOAuthProvider clientId={clientId}>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleError}
                        />
                    </GoogleOAuthProvider>
                    <div className="links">
                        <Link to="/register">Bạn chưa có tài khoản? Đăng ký</Link>
                        <Link to="/forgot-password">Bạn quên mật khẩu?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};
export default Login;
