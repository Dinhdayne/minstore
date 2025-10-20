import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { addToCartItem } from "./include/api";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    const [selectedVariants, setSelectedVariants] = useState({});
    const [quantity, setQuantity] = useState(1);

    // Parse an toàn
    const parseMaybeJSON = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    // Gọi API
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/products/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setProduct(data);
                    setVariants(parseMaybeJSON(data.variants));
                    setImages(parseMaybeJSON(data.images));
                }
            } catch (err) {
                console.error("Lỗi kết nối:", err);
            }
        };
        fetchProduct();
    }, [id]);

    // Danh sách màu & size
    const colors = [
        ...new Set(
            variants.map((v) => JSON.parse(v.attributes || "{}").color)
        ),
    ].filter(Boolean);

    const sizes = [
        ...new Set(
            variants
                .filter(
                    (v) =>
                        JSON.parse(v.attributes || "{}").color === selectedColor
                )
                .map((v) => JSON.parse(v.attributes || "{}").size)
        ),
    ].filter(Boolean);

    // Đổi ảnh khi chọn màu
    useEffect(() => {
        if (!selectedColor || variants.length === 0) return;

        const variant = variants.find(
            (v) => JSON.parse(v.attributes || "{}").color === selectedColor
        );
        if (variant) {
            const img = images.find((i) => i.variant_id === variant.variant_id);
            setSelectedImage(img?.image_url || images[0]?.image_url || "");
        }
    }, [selectedColor, variants, images]);

    const selectedVariant = variants.find((v) => {
        const attr = JSON.parse(v.attributes || "{}");
        return attr.color === selectedColor && attr.size === selectedSize;
    });

    const handleAddToCart = async () => {
        const variant = selectedVariant;
        if (!variant) {
            alert("Vui lòng chọn màu và kích thước trước khi thêm vào giỏ!");
            return;
        }

        const isAuthenticated = !!localStorage.getItem("token");
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        try {
            const response = await addToCartItem(variant.variant_id, quantity);
            if (response && !response.error) {
                alert("🛒 Đã thêm vào giỏ hàng thành công!");
            } else {
                alert("❌ Thêm giỏ hàng thất bại: " + (response?.error || "Không rõ nguyên nhân"));
            }
        } catch (err) {
            alert("⚠️ Lỗi khi thêm vào giỏ hàng: " + err.message);
        }
    };

    // Lọc ảnh trùng nhau theo image_url
    const uniqueImages = images.filter(
        (img, index, self) =>
            index === self.findIndex((t) => t.image_url === img.image_url)
    );

    if (!product) return <div>Đang tải...</div>;
    const originalPrice = product.base_price;
    const discountPercentage = parseFloat(product.sale);
    const discountedPrice = originalPrice * (1 - discountPercentage / 100);
    return (
        <div className="product-detail-container">
            {/* Cột trái: ảnh */}
            <div className="image-section">
                <img
                    src={selectedImage || images[0]?.image_url}
                    alt={product.name}
                    className="main-image"
                />
                <div className="thumbnail-list">
                    {uniqueImages.map((img, index) => (
                        <img
                            key={index}
                            src={img.image_url}
                            alt={`thumb-${index}`}
                            className={`thumbnail ${selectedImage === img.image_url ? "active" : ""}`}
                            onClick={() => setSelectedImage(img.image_url)}
                        />
                    ))}
                </div>

            </div>

            {/* Cột phải: thông tin */}
            <div className="info-section">
                <h1 className="product-name">{product.name}</h1>
                <p className="product-code">
                    Mã sản phẩm: <span>{product.sku || "Đang cập nhật"}</span>
                </p>
                <p className="product-status">
                    Tình trạng: <span className="in-stock">Còn hàng</span>
                </p>

                {/* Giá */}
                <div className="price-box">
                    <span className="new-price">
                        {(discountedPrice).toLocaleString()}₫
                    </span>
                    {discountPercentage > 0 && <span className="old-price">
                        {originalPrice ? originalPrice.toLocaleString() + "₫" : ""}
                    </span>}

                    {discountPercentage > 0 && <span className="discount">-{discountPercentage}%</span>}

                </div>

                {/* Màu sắc */}
                <div className="option-group">
                    <h4>Màu sắc:</h4>
                    <div className="color-options">
                        {colors.map((color) => (
                            <button
                                key={color}
                                className={`option-btn ${selectedColor === color ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedColor(color);
                                    setSelectedSize("");
                                }}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kích thước */}
                {selectedColor && (
                    <div className="option-group">
                        <h4>Kích thước:</h4>
                        <div className="size-options">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`option-btn ${selectedSize === size ? "active" : ""}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Số lượng */}
                <div className="quantity-section">
                    <h4>Số lượng:</h4>
                    <div className="quantity-box">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <input
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="action-buttons">
                    <button
                        className="add-cart"
                        onClick={() => handleAddToCart(product.product_id)}
                    >
                        🛒 Thêm vào giỏ
                    </button>
                </div>

                {/* Chính sách */}
                <div className="policy-section">
                    <ul>
                        <li>Miễn phí giao hàng cho đơn từ 500K</li>
                        <li>Hàng phân phối chính hãng 100%</li>
                        <li>Đổi sản phẩm dễ dàng trong 7 ngày</li>
                        <li>Kiểm tra, thanh toán khi nhận hàng (COD)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
