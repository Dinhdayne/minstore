import React, { useState, useEffect } from "react";
import "./App.css";
const user = JSON.parse(localStorage.getItem("user"));
const CartPage = ({ userId = user.user_id }) => {
    const [cart, setCart] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");
    // const [selectedColor, setSelectedColor] = useState(initialColor);
    // const [selectedSize, setSelectedSize] = useState(initialSize);

    // Hàm hỗ trợ parse JSON an toàn
    const parseMaybeJSON = (val) => {
        if (!val) return {};
        if (typeof val === "object") return val;
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return {};
            }
        }
        return {};
    };

    // 🧭 Thêm state lưu danh sách địa chỉ & địa chỉ được chọn
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);

    // 🧭 Lấy danh sách địa chỉ người dùng
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/addresses/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Không thể tải địa chỉ");
                const data = await res.json();

                setAddresses(data);

                // Tìm địa chỉ mặc định
                const defaultAddr = data.find((a) => a.is_default === 1 || a.is_default === true);
                if (defaultAddr) {
                    setSelectedAddressId(defaultAddr.address_id);
                    setSelectedAddress(defaultAddr);
                }
            } catch (err) {
                console.error("Lỗi tải địa chỉ:", err);
            }
        };

        fetchAddresses();
    }, [userId, token]);

    // 🧭 Khi chọn địa chỉ khác
    useEffect(() => {
        const addr = addresses.find((a) => a.address_id === selectedAddressId);
        setSelectedAddress(addr || null);
    }, [selectedAddressId, addresses]);


    // Lấy giỏ hàng
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Không thể tải giỏ hàng");
                const data = await res.json();
                setCart(data.cart);
                setItems(data.items || []);
            } catch (err) {
                console.error("Lỗi tải giỏ hàng:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [userId, token]);

    // 🟢 Cập nhật số lượng
    const updateQuantity = async (cartItemId, delta) => {
        const item = items.find((i) => i.cart_item_id === cartItemId);
        if (!item) return;
        const newQuantity = Math.max(1, item.quantity + delta);

        try {
            const res = await fetch(`http://localhost:3000/api/cart/update/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });

            if (!res.ok) throw new Error("Cập nhật thất bại");
            setItems((prev) =>
                prev.map((i) =>
                    i.cart_item_id === cartItemId ? { ...i, quantity: newQuantity } : i
                )
            );
        } catch (err) {
            console.error("Lỗi updateQuantity:", err);
        }
    };

    // 🟢 Cập nhật màu/variant
    const updateVariant = async (cartItemId, newVariantId) => {
        try {
            // 1️⃣ Cập nhật variant_id trong DB
            const res = await fetch(`http://localhost:3000/api/cart/update-variant/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ variantId: newVariantId }),
            });

            if (!res.ok) throw new Error("Không thể cập nhật màu sắc");

            // 2️⃣ Lấy thông tin variant mới (để đổi ảnh hiển thị)
            const variantRes = await fetch(`http://localhost:3000/api/variants/${newVariantId}`);
            if (!variantRes.ok) throw new Error("Không lấy được thông tin variant mới");
            const variantData = await variantRes.json();

            // 3️⃣ Cập nhật lại item trong FE (ảnh, màu, giá)
            setItems((prev) =>
                prev.map((i) =>
                    i.cart_item_id === cartItemId
                        ? {
                            ...i,
                            variant_id: newVariantId,
                            image_url: variantData.image_url,
                            price: variantData.price,
                            attributes: variantData.attributes,
                        }
                        : i
                )
            );
        } catch (err) {
            console.error("Lỗi updateVariant:", err);
        }
    };

    // 🟢 Xóa sản phẩm
    const removeItem = async (cartItemId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            const res = await fetch(`http://localhost:3000/api/cart/item/${cartItemId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Xóa thất bại");
            setItems((prev) => prev.filter((i) => i.cart_item_id !== cartItemId));
        } catch (err) {
            console.error("Lỗi removeItem:", err);
        }
    };

    const totalPrice = items.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );
    // 🟢 Hàm xử lý đặt hàng
    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert("Vui lòng chọn địa chỉ giao hàng!");
            return;
        }

        if (items.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }

        if (!window.confirm("Xác nhận đặt hàng?")) return;

        try {
            const orderData = {
                user_id: userId,
                address_id: selectedAddressId,
                total_amount: totalPrice,
                shipping_fee: 0,
                discount_amount: 0,
                notes: document.querySelector(".shipping-form textarea")?.value || "",
                items: items.map((item) => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.price,
                })),
            };

            const res = await fetch("http://localhost:3000/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Đặt hàng thất bại");

            alert("✅ Đặt hàng thành công!");
            // Xóa giỏ hàng sau khi đặt
            // setItems([]);
            // setCart(null);
        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            alert("❌ Lỗi khi đặt hàng. Vui lòng thử lại.");
        }
    };

    if (loading) return <p className="loading">Đang tải giỏ hàng...</p>;

    return (
        <div className="cart-container">
            {/* Bên trái - thông tin giao hàng */}
            <div className="cart-left">
                <h2>Thông tin vận chuyển</h2>

                {selectedAddress ? (
                    <div className="default-address-box">
                        <p><strong>Địa chỉ mặc định:</strong></p>
                        <p>{selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}</p>
                    </div>
                ) : (
                    <p>Không tìm thấy địa chỉ mặc định.</p>
                )}

                <div className="address-selector">
                    <label>Chọn địa chỉ giao hàng khác:</label>
                    <select
                        value={selectedAddressId || ""}
                        onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                    >
                        {addresses.map((addr) => (
                            <option key={addr.address_id} value={addr.address_id}>
                                {addr.ward}, {addr.district}, {addr.city}
                                {addr.is_default ? " (Mặc định)" : ""}
                            </option>
                        ))}
                    </select>
                </div>

                <form className="shipping-form">
                    <div className="form-row">
                        <select>
                            <option>Anh/Chị</option>
                        </select>
                        <input type="text" placeholder="Nhập họ tên của bạn" />
                        <input type="text" placeholder="Nhập số điện thoại của bạn" />
                    </div>
                    <input type="email" placeholder="Nhập email của bạn" />
                    <textarea placeholder="Nhập ghi chú"></textarea>
                </form>
            </div>


            {/* Bên phải - giỏ hàng */}
            <div className="cart-right">
                <h2>Giỏ hàng</h2>
                <div className="cart-note">Yên tâm 60 ngày đổi trả - Freeship đơn từ 200k</div>

                {items.length === 0 ? (
                    <p>Giỏ hàng trống.</p>
                ) : (
                    <>
                        {items.map((item) => {
                            const attributes = parseMaybeJSON(item.attributes);
                            const color = attributes?.color || "Không có màu";

                            // ảnh thật tương ứng variant
                            const imageUrl =
                                item.image_url ||
                                `https://via.placeholder.com/300x350?text=${encodeURIComponent(item.product_name)}`;

                            // Nếu có nhiều variant trong product, hiển thị dropdown đổi màu
                            const availableVariants = parseMaybeJSON(item.available_variants || []);
                            const variantOptions = Array.isArray(availableVariants)
                                ? availableVariants
                                : [];

                            return (
                                <div key={item.cart_item_id} className="cart-item">
                                    <div className="item-info">
                                        {/* Dropdown chọn màu thật */}
                                        <div key={item.cart_item_id} className="cart-item">
                                            <img src={imageUrl} alt={item.product_name} />
                                            <div className="item-info">
                                                <h3>{item.product_name}</h3>

                                                {/* --- chọn màu sắc --- */}
                                                {variantOptions.length > 0 && (
                                                    <div className="variant-section">
                                                        <div className="variant-label">Màu sắc:</div>
                                                        <div className="color-options">
                                                            {[
                                                                ...new Set(
                                                                    variantOptions
                                                                        .map((v) => parseMaybeJSON(v.attributes)?.color)
                                                                        .filter(Boolean)
                                                                ),
                                                            ].map((colorOption) => {
                                                                // tìm variant có cùng màu
                                                                const matchedVariant = variantOptions.find((v) => {
                                                                    const attr = parseMaybeJSON(v.attributes);
                                                                    return attr?.color === colorOption;
                                                                });

                                                                return (
                                                                    <button
                                                                        key={matchedVariant.variant_id}
                                                                        className={`color-btn ${item.variant_id === matchedVariant.variant_id
                                                                            ? "selected"
                                                                            : ""
                                                                            }`}
                                                                        onClick={() =>
                                                                            updateVariant(
                                                                                item.cart_item_id,
                                                                                matchedVariant.variant_id
                                                                            )
                                                                        }
                                                                    >
                                                                        {colorOption}
                                                                        {item.variant_id === matchedVariant.variant_id && (
                                                                            <span className="corner-flag"></span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* --- chọn kích thước --- */}
                                                {variantOptions.length > 0 && (
                                                    <div className="variant-section">
                                                        <div className="variant-label">Kích thước:</div>
                                                        <div className="size-options">
                                                            {(() => {
                                                                const currentColor = parseMaybeJSON(item.attributes)?.color;

                                                                // 🔹 Lọc ra các variant cùng màu đang chọn
                                                                const sizeVariants = variantOptions.filter((v) => {
                                                                    const attr = parseMaybeJSON(v.attributes);
                                                                    return attr?.color === currentColor;
                                                                });

                                                                // 🔹 Lấy danh sách size duy nhất
                                                                const uniqueSizes = [
                                                                    ...new Set(sizeVariants.map((v) => parseMaybeJSON(v.attributes)?.size).filter(Boolean)),
                                                                ];

                                                                return uniqueSizes.map((sizeOption) => {
                                                                    const matchedVariant = sizeVariants.find((v) => {
                                                                        const attr = parseMaybeJSON(v.attributes);
                                                                        return attr?.size === sizeOption;
                                                                    });

                                                                    return (
                                                                        <button
                                                                            key={matchedVariant.variant_id}
                                                                            className={`size-btn ${item.variant_id === matchedVariant.variant_id ? "selected" : ""
                                                                                }`}
                                                                            onClick={() =>
                                                                                updateVariant(item.cart_item_id, matchedVariant.variant_id)
                                                                            }
                                                                        >
                                                                            {sizeOption}
                                                                            {item.variant_id === matchedVariant.variant_id && (
                                                                                <span className="corner-flag"></span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                });
                                                            })()}
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        </div>


                                        {/* Số lượng */}
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.cart_item_id, -1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.cart_item_id, 1)}>+</button>
                                        </div>

                                        {/* Giá + xóa */}
                                        <div className="price-row">
                                            <span className="price">
                                                {parseFloat(item.price).toLocaleString()}₫
                                            </span>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeItem(item.cart_item_id)}
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="cart-summary">
                            <p>
                                <strong>Tổng cộng:</strong>{" "}
                                <span className="total">{totalPrice.toLocaleString()}₫</span>
                            </p>
                            <button className="checkout-btn" onClick={handlePlaceOrder}>
                                Đặt hàng
                            </button>
                        </div>

                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;
