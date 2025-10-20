import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addToCartItem } from "./include/api";
import { useAuth } from "./contexts/AuthContext";
import "./CategoryPage.css";

const CategoryPage = () => {
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);
    const { user, isAuthenticated } = useAuth();
    const [selectedVariants, setSelectedVariants] = useState({});
    const [selectedImages, setSelectedImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState("");
    const [sortOption, setSortOption] = useState("default");
    const [filter, setFilter] = useState({
        color: "",
        size: "",
        minPrice: 0,
        maxPrice: 3000000,
    });

    useEffect(() => {
        fetchProducts();
    }, [categoryId]);
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

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:3000/api/products/category/${categoryId}`);
            const data = await res.json();

            if (data.length > 0) {
                setCategoryName(data[0].category_name || "");
            }

            // Parse variants & images
            const formatted = data.map((p) => ({
                ...p,
                variants: JSON.parse(p.variants || "[]"),
                images: JSON.parse(p.images || "[]"),
            }));
            setProducts(formatted);
        } catch (err) {
            console.error("Lỗi tải sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };
    const handleViewDetails = (productId) => {
        window.location.href = `/product/${productId}`;
    };
    const handleColorChange = (productId, image, variantId) => {
        setSelectedImages((prev) => ({ ...prev, [productId]: image }));
        setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
    };
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
    const applyFilter = (list) => {
        return list.filter((p) => {
            const price = parseFloat(p.base_price);
            const matchPrice = price >= filter.minPrice && price <= filter.maxPrice;

            const variants = p.variants || [];
            const matchColor =
                !filter.color || variants.some((v) => v.attributes.includes(filter.color));
            const matchSize =
                !filter.size || variants.some((v) => v.attributes.includes(filter.size));

            return matchPrice && matchColor && matchSize;
        });
    };

    const applySort = (list) => {
        switch (sortOption) {
            case "price_asc":
                return [...list].sort((a, b) => a.base_price - b.base_price);
            case "price_desc":
                return [...list].sort((a, b) => b.base_price - a.base_price);
            case "name_asc":
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
            case "name_desc":
                return [...list].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return list;
        }
    };

    const filteredProducts = applySort(applyFilter(products));

    if (loading) return <p className="loading">Đang tải sản phẩm...</p>;

    return (
        <div className="category-container">
            {/* Bộ lọc bên trái */}
            <aside className="filter-sidebar">
                <h3>Bộ lọc</h3>

                <div className="filter-group">
                    <label>Màu sắc:</label>
                    <select
                        value={filter.color}
                        onChange={(e) => setFilter({ ...filter, color: e.target.value })}
                    >
                        <option value="">Tất cả</option>
                        <option value="Blue">Xanh</option>
                        <option value="Black">Đen</option>
                        <option value="White">Trắng</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Kích thước:</label>
                    <select
                        value={filter.size}
                        onChange={(e) => setFilter({ ...filter, size: e.target.value })}
                    >
                        <option value="">Tất cả</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Khoảng giá:</label>
                    <input
                        type="range"
                        min="0"
                        max="3000000"
                        value={filter.maxPrice}
                        onChange={(e) => setFilter({ ...filter, maxPrice: e.target.value })}
                    />
                    <p>
                        0đ - {Number(filter.maxPrice).toLocaleString()}đ
                    </p>
                </div>
            </aside>

            {/* Danh sách sản phẩm */}
            <section className="product-list">
                <div className="products-wrapper">
                    <div className="product-list-header">
                        <h2>
                            {categoryName || "Danh mục"} ({filteredProducts.length})
                        </h2>

                        <div className="sort-box">
                            <label>Sắp xếp theo:</label>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="default">Mặc định</option>
                                <option value="price_asc">Giá tăng dần</option>
                                <option value="price_desc">Giá giảm dần</option>
                                <option value="name_asc">Tên A-Z</option>
                                <option value="name_desc">Tên Z-A</option>
                            </select>
                        </div>
                    </div>
                    <div className="product-grid" >
                        {filteredProducts.map((product) => {
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
                            const discountPercentage = parseFloat(product.sale);
                            const discountedPrice = originalPrice * (1 - discountPercentage / 100);

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
            </section>
        </div>
    );
};

export default CategoryPage;
