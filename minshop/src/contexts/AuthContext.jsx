import React, { createContext, useContext, useState, useEffect } from "react";
import { checkLogoutRequest } from "../include/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const authData = await checkLogoutRequest();
                if (authData && !authData.error) setUser(authData);
            } catch (error) {
                console.error("Lỗi xác thực:", error);
            } finally {
                setLoading(false);
            }
        };
        initializeAuth();
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/api/check-auth", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    // Token hết hạn hoặc không hợp lệ → xóa
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.error("Lỗi khi xác thực token:", err);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);
    // ✅ Khi app load lại, kiểm tra token trong localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);
    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };
    const logout = async () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        } finally {
            localStorage.removeItem("token");
            setUser(null);
        }
    };
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};
export const useAuth = () => useContext(AuthContext);
