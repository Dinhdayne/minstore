import React, { useState, useEffect } from "react";
import "./AccountPage.css"; // import CSS này nhé

const AddAddressModal = ({ onClose, onSaved }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [detail, setDetail] = useState("");
    const [isDefault, setIsDefault] = useState(false);

    // 🟦 Lấy danh sách tỉnh/thành
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch("https://provinces.open-api.vn/api/?depth=3");
                const data = await res.json();
                setProvinces(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách tỉnh/thành:", error);
            }
        };
        fetchProvinces();
    }, []);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict("");
        setSelectedWard("");
        const province = provinces.find((p) => p.code.toString() === provinceCode);
        setDistricts(province ? province.districts : []);
        setWards([]);
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        setSelectedWard("");
        const district = districts.find((d) => d.code.toString() === districtCode);
        setWards(district ? district.wards : []);
    };

    const handleSave = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.user_id) return alert("Không tìm thấy user_id!");

        const province = provinces.find(p => p.code == selectedProvince)?.name || "";
        const district = districts.find(d => d.code == selectedDistrict)?.name || "";
        const ward = wards.find(w => w.code == selectedWard)?.name || "";

        const addressData = {
            user_id: user.user_id,
            city: province,
            district,
            ward,
            zip_code: "",
            is_default: isDefault,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/addresses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(addressData),
            });

            if (res.ok) {
                alert("Thêm địa chỉ thành công!");
                onSaved(); // reload danh sách
                onClose();
            } else {
                const err = await res.json();
                alert("Lỗi: " + err.message);
            }
        } catch (error) {
            console.error("Lỗi khi lưu địa chỉ:", error);
            alert("Không thể lưu địa chỉ!");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Thêm Địa Chỉ</h2>

                <input
                    type="text"
                    className="full-input"
                    placeholder="Địa chỉ (số nhà, đường...)"
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                />

                {/* Tỉnh/TP */}
                <select
                    className="full-input"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((p) => (
                        <option key={p.code} value={p.code}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* Quận/Huyện */}
                {districts.length > 0 && (
                    <select
                        className="full-input"
                        value={selectedDistrict}
                        onChange={handleDistrictChange}
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((d) => (
                            <option key={d.code} value={d.code}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                )}

                {/* Phường/Xã */}
                {wards.length > 0 && (
                    <select
                        className="full-input"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                    >
                        <option value="">Chọn phường/xã</option>
                        {wards.map((w) => (
                            <option key={w.code} value={w.code}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                )}

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                    />{" "}
                    Đặt làm địa chỉ mặc định
                </label>

                <div className="button-group">
                    <button className="btn-cancel" onClick={onClose}>
                        Đóng
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

// 🧩 Modal cập nhật thông tin cá nhân
const UpdateProfileModal = ({ profile, onClose, onUpdated }) => {
    const [form, setForm] = useState({
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        phone: profile?.phone || "",
        gender: profile?.gender || "",
        date_of_birth: profile?.date_of_birth
            ? profile.date_of_birth.split("T")[0]
            : "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.user_id) return alert("Không tìm thấy user_id!");

            const res = await fetch(
                `http://localhost:3000/api/userProfile/${user.user_id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();
            if (res.ok) {
                alert("Cập nhật thành công!");
                onUpdated();
                onClose();
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Không thể cập nhật thông tin!");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Cập nhật thông tin cá nhân</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            placeholder="Họ"
                        />
                        <input
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            placeholder="Tên"
                        />
                    </div>

                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="full-input"
                    />

                    <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="full-input"
                    >
                        <option value="">Giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>

                    <input
                        type="date"
                        name="date_of_birth"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        className="full-input"
                    />

                    <div className="button-group">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button type="submit" className="btn-save">
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState("Thông tin tài khoản");
    const [showModal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    // ⭐ Form đánh giá sản phẩm
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewOrderId, setReviewOrderId] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");

    // Mở form đánh giá
    const handleReviewProduct = (productId) => {
        setReviewOrderId(productId);
        setIsReviewModalOpen(true);
    };

    // Gửi đánh giá lên server
    const handleSubmitReview = async () => {
        if (!reviewComment.trim()) {
            alert("Vui lòng nhập nội dung đánh giá!");
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    user_id: user.user_id,
                    product_id: reviewOrderId,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đánh giá sản phẩm thành công!");
                setIsReviewModalOpen(false);
                setReviewComment("");
                setReviewRating(5);
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            console.error("Lỗi khi gửi đánh giá:", err);
            alert("Không thể gửi đánh giá!");
        }
    };

    const fetchOrders = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.user_id) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/orders/user/${user.user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

            });
            const data = await res.json();
            if (res.ok) {
                setOrders(data);
            } else {
                console.error("Lỗi khi lấy danh sách đơn:", data.message);
            }
        } catch (err) {
            console.error("Lỗi fetchOrders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    useEffect(() => {
        if (activeTab === "Lịch sử đơn hàng") {
            fetchOrders();
        }
    }, [activeTab]);

    const menuItems = [
        "Thông tin tài khoản",
        "Lịch sử đơn hàng",
        "Ví Voucher",
        "Sổ địa chỉ",
    ];

    const InfoRow = ({ label, value }) => (
        <div className="info-row">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );


    const fetchProfile = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user || !user.user_id) {
                console.warn("Không tìm thấy user_id trong localStorage");
                setLoading(false);
                return;
            }

            const res = await fetch(
                `http://localhost:3000/api/userProfile/${user.user_id}`
            );
            const data = await res.json();

            if (res.ok) setProfile(data);
            else console.error("Lỗi khi lấy profile:", data.message);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };
    // 🟨 Lấy danh sách địa chỉ
    const fetchAddresses = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.user_id) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/addresses/user/${user.user_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
            );

            const data = await res.json();
            if (res.ok) setAddresses(data);
        } catch (error) {
            console.error("Lỗi khi lấy địa chỉ:", error);
        }
    };
    // 🔹 Đặt mặc định
    const handleSetDefault = async (addressId) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/addresses/set-default/${addressId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchAddresses();
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Không thể đặt mặc định!");
        }
    };

    // 🔹 Xóa địa chỉ
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Bạn có chắc muốn xoá địa chỉ này không?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/addresses/${addressId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                fetchAddresses();
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Không thể xoá địa chỉ!");
        }
    };

    // 🔹 Sửa địa chỉ
    const handleEditAddress = (addr) => {
        setShowModal(true);
        setEditingAddress(addr); // thêm state này
    };

    // 🔹 Huỷ đơn hàng
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc muốn huỷ đơn hàng này không?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "cancelled" }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đã huỷ đơn hàng thành công!");
                fetchOrders(); // reload lại danh sách
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            console.error("Lỗi khi huỷ đơn:", err);
            alert("Không thể huỷ đơn hàng!");
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchAddresses();
    }, []);

    const safeValue = (val, fallback = "Chưa cập nhật") =>
        val && val !== "" ? val : fallback;

    const renderContent = () => {
        switch (activeTab) {
            case "Thông tin tài khoản":
                return (
                    <>
                        <h2>Thông tin tài khoản</h2>
                        <div className="info-section">
                            <InfoRow
                                label="Họ và tên"
                                value={`${safeValue(profile?.first_name)} ${safeValue(
                                    profile?.last_name
                                )}`}
                            />
                            <InfoRow
                                label="Số điện thoại"
                                value={safeValue(profile?.phone)}
                            />
                            <InfoRow
                                label="Giới tính"
                                value={
                                    profile?.gender === "male"
                                        ? "Nam"
                                        : profile?.gender === "female"
                                            ? "Nữ"
                                            : "Chưa cập nhật"
                                }
                            />
                            <InfoRow
                                label="Ngày sinh"
                                value={
                                    profile?.date_of_birth
                                        ? new Date(
                                            profile.date_of_birth
                                        ).toLocaleDateString("vi-VN")
                                        : "Hãy cập nhật ngày sinh để chúng tôi gửi quà sinh nhật nhé"
                                }
                            />
                        </div>

                        <button
                            className="btn-update"
                            onClick={() => setShowUpdateModal(true)}
                        >
                            Cập nhật
                        </button>

                        {showUpdateModal && (
                            <UpdateProfileModal
                                profile={profile}
                                onClose={() => setShowUpdateModal(false)}
                                onUpdated={fetchProfile}
                            />
                        )}
                        {/* 
                        <div className="info-login">
                            <h3>Thông tin đăng nhập</h3>
                            <InfoRow
                                label="Email"
                                value={safeValue(profile?.email)}
                            />
                            <InfoRow label="Mật khẩu" value="************" />
                        </div> */}
                    </>
                );

            case "Lịch sử đơn hàng":
                return (
                    <div className="orders-section">
                        <h2>Lịch sử đơn hàng</h2>

                        {loadingOrders ? (
                            <p>Đang tải đơn hàng...</p>
                        ) : orders.length === 0 ? (
                            <p>Bạn chưa có đơn hàng nào.</p>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.order_id} className="order-card">
                                        <div className="order-header">
                                            <div>
                                                <strong>Mã đơn:</strong> #{order.order_id}

                                            </div>
                                            <div>
                                                <strong>Ngày đặt:</strong>{" "}
                                                {new Date(order.order_date).toLocaleDateString("vi-VN")}
                                            </div>
                                            <div className={`order-status status-${order.status}`}>
                                                {order.status === "pending"
                                                    ? "Chờ xử lý"
                                                    : order.status === "processing"
                                                        ? "Đang xử lý"
                                                        : order.status === "shipped"
                                                            ? "Đang giao"
                                                            : order.status === "delivered"
                                                                ? "Hoàn thành"
                                                                : order.status === "cancelled"
                                                                    ? "Đã hủy"
                                                                    : order.status}
                                            </div>
                                        </div>

                                        {/* Danh sách sản phẩm */}
                                        <div className="order-items">
                                            {order.items.map((item) => (
                                                <div key={item.order_item_id} className="order-item">
                                                    <img
                                                        src={
                                                            item.image_url ||
                                                            `https://via.placeholder.com/80x80?text=${encodeURIComponent(
                                                                item.product_name
                                                            )}`
                                                        }
                                                        alt={item.product_name}
                                                    />
                                                    <div className="item-info">
                                                        <p className="product-name">{item.product_name}</p>
                                                        <p className="variant">
                                                            {item.attributes?.color
                                                                ? `Màu: ${item.attributes.color}`
                                                                : ""}
                                                        </p>
                                                        <p className="variant">
                                                            {item.attributes?.size
                                                                ? `Size: ${item.attributes.size}`
                                                                : ""}
                                                        </p>
                                                        <p>
                                                            SL: <strong>{item.quantity}</strong>
                                                        </p>
                                                    </div>
                                                    <div className="item-price">
                                                        {(item.price * item.quantity).toLocaleString()}₫
                                                    </div>
                                                    <div className="order-actions">
                                                        {order.status === "delivered" && (
                                                            <button
                                                                className="btn-review"
                                                                onClick={() => handleReviewProduct(item.product_id)}
                                                            >
                                                                Đánh giá sản phẩm
                                                            </button>
                                                        )}

                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tổng tiền */}
                                        <div className="order-total">
                                            <span>Tổng tiền:</span>{" "}
                                            <strong>{order.total_amount.toLocaleString()}₫</strong>
                                        </div>
                                        {/* Nút hành động cho đơn hàng */}
                                        <div className="order-actions">
                                            {(order.status === "processing" || order.status === "pending") && (
                                                <button
                                                    className="btn-cancel"
                                                    onClick={() => handleCancelOrder(order.order_id)}
                                                >
                                                    Huỷ đơn hàng
                                                </button>
                                            )}

                                        </div>

                                        {/* Địa chỉ giao hàng */}
                                        <div className="order-address">
                                            <small>
                                                Giao đến: {order.ward}, {order.district}, {order.city}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );


            case "Ví Voucher":
                return (
                    <>
                        <h2>Ví Voucher</h2>
                        <p>Bạn chưa có voucher nào.</p>
                    </>
                );

            case "Sổ địa chỉ":
                return (
                    <div className="address-book">
                        <div className="address-header">
                            <h2>Địa chỉ của tôi</h2>
                            <button onClick={() => setShowModal(true)} className="btn-save">
                                + Thêm địa chỉ mới
                            </button>
                        </div>

                        {showModal && (
                            <AddAddressModal
                                onClose={() => setShowModal(false)}
                                onSaved={fetchAddresses}
                                editingAddress
                            />
                        )}

                        {addresses.length === 0 ? (
                            <p className="no-address">Bạn chưa có địa chỉ nào!</p>
                        ) : (
                            <div className="address-list">
                                {addresses.map((addr) => (
                                    <div key={addr.address_id} className="address-item">
                                        <div className="address-info">
                                            {addr.ward}, {addr.district}, {addr.city}
                                            {Boolean(addr.is_default) && (
                                                <span className="default-icon" title="Địa chỉ mặc định">✔</span>
                                            )}
                                        </div>

                                        <div className="address-actions">
                                            {!addr.is_default && (
                                                <button
                                                    className="btn-set-default"
                                                    onClick={() => handleSetDefault(addr.address_id)}
                                                >
                                                    Đặt mặc định
                                                </button>
                                            )}
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleEditAddress(addr)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() => handleDeleteAddress(addr.address_id)}
                                            >
                                                Xoá
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>
                );

            case "Đánh giá và phản hồi":
                return (
                    <>
                        <h2>Đánh giá & phản hồi</h2>
                        <p>Chưa có đánh giá nào.</p>
                    </>
                );

            default:
                return null;
        }
    };


    return (
        <div className="account-container">
            {/* Sidebar trái */}
            <div className="account-sidebar">
                {menuItems.map((item) => (
                    <button
                        key={item}
                        onClick={() => setActiveTab(item)}
                        className={`sidebar-item ${activeTab === item ? "active" : ""
                            }`}
                    >
                        <span>{item}</span>
                    </button>
                ))}
            </div>

            {/* Nội dung phải */}
            <div className="account-content">{renderContent()}</div>
            {/* 🟨 Modal đánh giá sản phẩm */}
            {
                isReviewModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2>Đánh giá sản phẩm</h2>

                            <div className="rating-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={`star ${reviewRating >= star ? "active" : ""}`}
                                        onClick={() => setReviewRating(star)}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>

                            <textarea
                                placeholder="Nhập nhận xét của bạn..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="full-input"
                                rows={4}
                            />

                            <div className="button-group">
                                <button className="btn-cancel" onClick={() => setIsReviewModalOpen(false)}>
                                    Hủy
                                </button>
                                <button className="btn-save" onClick={handleSubmitReview}>
                                    Gửi đánh giá
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default AccountPage;
