import React, { useRef, useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import util from "../utils/util";
import { addToCartItem } from "../include/api";
import "../App.css";

const Products = ({ products = [], error }) => {
    const { addToCartItem: addToCartContext } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [selectedVariants, setSelectedVariants] = useState({});
    const [selectedImages, setSelectedImages] = useState({});
    const [selectedColor, setSelectedColor] = useState(null); // 🟢 Thêm dòng này
    const [selectedSize, setSelectedSize] = useState(null);   // 🟢 Thêm dòng này
    const sliderRef = useRef(null);
    const [index, setIndex] = useState(0);

    // helper parse JSON-safe (products may come with 'images'/'variants' as JSON string)
    const parseMaybeJSON = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val;
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return [];
            }
        }
        return [];
    };

    useEffect(() => {
        // Khi products thay đổi, set ảnh & variant mặc định cho mỗi product
        const initialImages = {};
        const initialVariants = {};

        products.forEach((p) => {
            const imgs = parseMaybeJSON(p.images);
            const variants = parseMaybeJSON(p.variants);

            const firstVariant = variants && variants.length ? variants[0] : null;
            const defaultVariantId = firstVariant ? firstVariant.variant_id : null;
            initialVariants[p.product_id] = defaultVariantId;

            // tìm ảnh của variant mặc định (ưu tiên)
            let variantImage = null;
            if (defaultVariantId != null && imgs && imgs.length) {
                const found = imgs.find((img) => {
                    // variant_id có thể là number hoặc string
                    return img.variant_id != null && String(img.variant_id) === String(defaultVariantId);
                });
                if (found) variantImage = found.image_url;
            }

            // nếu không có ảnh variant, lấy ảnh is_primary
            let primaryImage = null;
            if (imgs && imgs.length) {
                const primary = imgs.find((img) => img.is_primary === 1 || img.is_primary === true);
                primaryImage = primary ? primary.image_url : imgs[0]?.image_url;
            }

            initialImages[p.product_id] = variantImage || primaryImage || `https://via.placeholder.com/300x350?text=${encodeURIComponent(p.name)}`;
        });

        setSelectedImages(initialImages);
        setSelectedVariants(initialVariants);
    }, [products]);

    const handleAddToCart = async (productId) => {
        const product = products.find((p) => p.product_id === productId);
        if (!product) return alert("Sản phẩm không tồn tại");

        const variants = parseMaybeJSON(product.variants);
        const fallbackVariantId = variants && variants.length ? variants[0].variant_id : null;
        const variantId = selectedVariants[productId] ?? fallbackVariantId;
        const quantity = 1;

        if (!variantId) {
            alert("Vui lòng chọn màu/biến thể trước khi thêm vào giỏ hàng!");
            return;
        }

        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        try {
            // addToCartItem có thể chấp nhận (variantId, quantity) hoặc object tùy implement của bạn
            const response = await addToCartItem(variantId, quantity);
            if (response && !response.error) {
                // nếu bạn có context để cập nhật giỏ local, gọi ở đây (nếu cần)
                // addToCartContext({ productId, variantId, quantity });
                alert("🛒 Đã thêm vào giỏ hàng thành công!");
            } else {
                alert("❌ Thêm giỏ hàng thất bại: " + (response?.error || "Không rõ nguyên nhân"));
            }
        } catch (err) {
            alert("⚠️ Lỗi khi thêm vào giỏ hàng: " + err.message);
        }
    };

    const handleViewDetails = (productId) => {
        window.location.href = `product-detail.php?id=${productId}`;
    };

    const handleColorChange = (productId, image, variantId) => {
        setSelectedImages((prev) => ({ ...prev, [productId]: image }));
        setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
    };

    const scroll = (direction) => {
        if (!sliderRef.current) return;
        const cardWidth = sliderRef.current.querySelector(".product-card").offsetWidth;
        const containerWidth = sliderRef.current.offsetWidth;
        const visibleCards = Math.floor(containerWidth / cardWidth);
        const maxIndex = Math.max(0, products.length - visibleCards);

        let newIndex = index;
        if (direction === "next" && index < maxIndex) newIndex = index + 1;
        else if (direction === "prev" && index > 0) newIndex = index - 1;

        setIndex(newIndex);
        sliderRef.current.style.transform = `translateX(-${newIndex * cardWidth}px)`;
    };


    if (error) {
        return (
            <section className="products">
                <div className="container">
                    <div className="products-header">
                        <h2>SẢN PHẨM KHUYẾN MÃI</h2>
                    </div>
                    <p className="error">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="products">
            <div className="container">
                <div className="products-header">
                    <h2>SẢN PHẨM KHUYẾN MÃI</h2>
                    <div className="arrow">
                        <button onClick={() => scroll("prev")}>&#10094;</button>
                        <button onClick={() => scroll("next")}>&#10095;</button>
                    </div>
                </div>

                <div className="products-wrapper">
                    <div className="product-grid" ref={sliderRef}>
                        {products.map((product) => {
                            const imgs = parseMaybeJSON(product.images);
                            const variants = parseMaybeJSON(product.variants);

                            // build mapping image per variant id (string keys)
                            const variantImages = {};
                            imgs.forEach((img) => {
                                if (img.variant_id != null) variantImages[String(img.variant_id)] = img.image_url;
                            });

                            // build colors mapping (variant_id => color)
                            const colors = {};
                            variants.forEach((variant) => {
                                let attrs = variant.attributes;
                                if (typeof attrs === "string") {
                                    try {
                                        attrs = JSON.parse(attrs);
                                    } catch {
                                        attrs = {};
                                    }
                                }
                                if (attrs && attrs.color) {
                                    colors[String(variant.variant_id)] = attrs.color;
                                }
                            });

                            const originalPrice = product.base_price;
                            const discountedPrice = originalPrice * 0.8;
                            const discountPercentage = 20;

                            // determine which variant is currently selected
                            const currentVariantId = selectedVariants[product.product_id] ?? (variants[0]?.variant_id ?? null);
                            const currentImage = selectedImages[product.product_id] || variantImages[String(currentVariantId)] || imgs.find(i => i.is_primary === 1)?.image_url || imgs[0]?.image_url || `https://via.placeholder.com/300x350?text=${encodeURIComponent(product.name)}`;
                            // 🔹 Lấy danh sách màu và size duy nhất
                            const uniqueColors = [...new Set(
                                variants.map(v => {
                                    let attrs = typeof v.attributes === "string" ? JSON.parse(v.attributes) : v.attributes;
                                    return attrs.color;
                                }).filter(Boolean)
                            )];

                            const uniqueSizes = [...new Set(
                                variants.map(v => {
                                    let attrs = typeof v.attributes === "string" ? JSON.parse(v.attributes) : v.attributes;
                                    return attrs.size;
                                }).filter(Boolean)
                            )];

                            return (
                                <div key={product.product_id} className="product-card">
                                    <div className="image-container">
                                        <img
                                            src={currentImage}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    </div>
                                    {discountPercentage > 0 && <div className="discount">-{discountPercentage}%</div>}
                                    <h3>{product.name}</h3>

                                    {/* Nếu không có color variants thì ẩn dropdown */}
                                    {Object.keys(colors).length > 0 && (
                                        <div className="color-selector">
                                            <label htmlFor={`color-${product.product_id}`}>Chọn màu:</label>
                                            <select
                                                id={`color-${product.product_id}`}
                                                className="color-dropdown"
                                                value={currentVariantId ?? ""}
                                                onChange={(e) => {
                                                    const selectedVariantId = e.target.value;
                                                    const selectedImage = e.target.options[e.target.selectedIndex].dataset.image;
                                                    handleColorChange(product.product_id, selectedImage, selectedVariantId);
                                                }}
                                            >
                                                {uniqueColors.map((color) => {
                                                    // tìm variantId đầu tiên có màu đó
                                                    const variantId = Object.keys(colors).find(
                                                        (key) => colors[key] === color
                                                    );
                                                    return (
                                                        <option
                                                            key={variantId}
                                                            value={variantId}
                                                            data-image={variantImages[variantId] || currentImage}
                                                        >
                                                            {color}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    )}

                                    <div className="price">
                                        {discountedPrice.toLocaleString("vi-VN")}đ
                                        <span className="original-price">{originalPrice.toLocaleString("vi-VN")}đ</span>
                                    </div>

                                    <div className="details">{Object.keys(colors).length} Màu sắc</div>

                                    <div className="buttons">
                                        <button
                                            className="add-to-cart"
                                            onClick={() => handleAddToCart(product.product_id)}
                                        >
                                            Thêm vào giỏ
                                        </button>

                                        <button
                                            className="view-details"
                                            onClick={() => handleViewDetails(product.product_id)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="btt">
                <button className="view-full-sale">Xem tất cả sản phẩm khuyến mãi</button>
            </div>
        </section>
    );
};

export default Products;
