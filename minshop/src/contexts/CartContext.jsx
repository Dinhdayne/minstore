import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({});

    const addToCart = (productId, quantity) => {
        setCart((prev) => ({
            ...prev,
            [productId]: (prev[productId] || 0) + quantity,
        }));
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
