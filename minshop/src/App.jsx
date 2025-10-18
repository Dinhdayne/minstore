import React, { useState, useEffect } from "react";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Header from "./components/Header";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Best from "./components/Best-selling";
import Footer from "./components/Footer";
import Login from "./Login";
import CartPage from "./CartPage";
import AccountPage from "./AccountPage";
import AdminPage from "./AdminPage";
import ProductDetail from "./ProductDetail";

import { getProducts, getCategories, getProductTOP, getProductSale } from "./include/api";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [productSales, setProductSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productTOP, setProductTOP] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        const productSalesData = await getProductSale();
        const categoriesData = await getCategories();
        const bestSellingProducts = await getProductTOP();

        if (productsData.error) setError(productsData.error);
        else setProducts(productsData);

        if (productSalesData.error) setError(productSalesData.error);
        else setProductSales(productSalesData);

        if (categoriesData.error) setError(categoriesData.error);
        else setCategories(categoriesData);

        if (bestSellingProducts.error) setError(bestSellingProducts.error);
        else setProductTOP(bestSellingProducts);
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
                  <Products products={productSales} error={error} />
                  <Best products={productTOP} error={error} />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/CartPage" element={<CartPage />} />
            <Route path="/AccountPage" element={<AccountPage />} />
            <Route path="/AdminPage" element={<AdminPage />} />
            <Route path="/:id" element={<ProductDetail />} />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
