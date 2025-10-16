import React, { useState, useEffect } from "react";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Header from "./components/Header";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Footer from "./components/Footer";
import Login from "./Login";
import CartPage from "./CartPage";
import AccountPage from "./AccountPage";
import AdminPage from "./AdminPage";

import { getProducts, getCategories } from "./include/api";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        const categoriesData = await getCategories();

        if (productsData.error) setError(productsData.error);
        else setProducts(productsData);

        if (categoriesData.error) setError(categoriesData.error);
        else setCategories(categoriesData);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Đang tải...</div>;

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Banner />
                  <Categories categories={categories} error={error} />
                  <Products products={products} error={error} />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/AccountPage" element={<AccountPage />} />
            <Route path="/AdminPage" element={<AdminPage />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
