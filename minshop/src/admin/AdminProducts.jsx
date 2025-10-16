import React, { useState, useEffect } from "react";
import "./AdminPage.css";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingVariant, setEditingVariant] = useState(null);
    const [newVariant, setNewVariant] = useState({});

    const [expandedProducts, setExpandedProducts] = useState([]); // 🔽 Theo dõi sp nào đang mở biến thể
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false); // ✅ form sửa sp
    const [selectedProduct, setSelectedProduct] = useState(null); // ✅ sp đang sửa

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    useEffect(() => {
        // Gọi API lấy danh mục & thương hiệu
        const fetchData = async () => {
            const [catRes, brandRes] = await Promise.all([
                fetch("http://localhost:3000/api/categories").then(r => r.json()),
                fetch("http://localhost:3000/api/brands").then(r => r.json()),
            ]);
            setCategories(catRes);
            setBrands(brandRes);
        };
        fetchData();
    }, []);


    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        base_price: "",
        category_id: "",
        brand_id: "",
        sku: "",
        weight: "",
        is_active: 1,
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/products");
            const data = await res.json();
            if (res.ok) setProducts(data);
            else console.error("Lỗi lấy sản phẩm:", data.message);
        } catch (err) {
            console.error("Lỗi fetch sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const toggleExpand = (productId) => {
        setExpandedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };
    // ✅ Mở form sửa
    const handleEditProductClick = (product) => {
        setSelectedProduct({ ...product });
        setShowEditForm(true);
        setShowAddForm(false);
    };

    // ✅ Cập nhật sản phẩm
    const handleUpdateProduct = async () => {
        if (!selectedProduct) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/products/${selectedProduct.product_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedProduct),
            });
            const data = await res.json();
            if (res.ok) {
                alert("Cập nhật sản phẩm thành công!");
                setShowEditForm(false);
                setSelectedProduct(null);
                fetchProducts();
            } else {
                alert(data.message || "Lỗi khi cập nhật sản phẩm!");
            }
        } catch (err) {
            console.error("Lỗi cập nhật sản phẩm:", err);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.category_id || !newProduct.brand_id || !newProduct.base_price) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newProduct),
            });
            const data = await res.json();

            if (res.ok) {
                alert("Thêm sản phẩm thành công!");
                setShowAddForm(false);
                setNewProduct({
                    name: "",
                    description: "",
                    base_price: "",
                    category_id: "",
                    brand_id: "",
                    sku: "",
                    weight: "",
                    is_active: 1,
                });
                fetchProducts();
            } else {
                alert(data.message || "Lỗi khi thêm sản phẩm!");
            }
        } catch (err) {
            console.error("Lỗi thêm sản phẩm:", err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                alert("Đã xóa sản phẩm!");
                fetchProducts();
            }
        } catch (err) {
            console.error("Lỗi khi xóa sản phẩm:", err);
        }
    };
    // 🔽 THÊM BIẾN THỂ CHO SẢN PHẨM
    const handleAddVariant = async (productId) => {
        try {
            const token = localStorage.getItem("token");

            // 👉 Lấy đúng biến thể cho productId
            const variantData = newVariant[productId] || {};

            // Chuẩn hóa dữ liệu
            const body = {
                productId,
                variants: [
                    {
                        price: Number(variantData.price) || 0,
                        stock_quantity: Number(variantData.stock_quantity) || 0,
                        sku: variantData.sku?.trim() || `SKU-${Date.now()}`,
                        size: variantData.size?.trim() || "default",
                        color: variantData.color?.trim() || "default",
                    },
                ],
                images: variantData.image_url
                    ? [
                        {
                            image_url: variantData.image_url,
                            is_primary: false,
                            alt_text: `Ảnh biến thể ${variantData.color || ""}`,
                            variant_sku: variantData.sku?.trim() || `SKU-${Date.now()}`,
                        },
                    ]
                    : [],
            };

            const res = await fetch(
                `http://localhost:3000/api/products/variants-images/${productId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(body),
                }
            );

            const data = await res.json();

            if (res.ok) {
                alert("✅ Thêm biến thể thành công!");
                setNewVariant((prev) => ({
                    ...prev,
                    [productId]: {
                        sku: "",
                        color: "",
                        size: "",
                        price: "",
                        stock_quantity: "",
                        image_url: "",
                    },
                }));
                fetchProducts();
            } else {
                console.error("❌ Lỗi khi thêm biến thể:", data);
                alert("Lỗi khi thêm biến thể: " + (data.message || ""));
            }
        } catch (err) {
            console.error("❌ Lỗi hệ thống khi thêm biến thể:", err);
            alert("Lỗi hệ thống khi thêm biến thể!");
        }
    };

    const handleEditVariant = async (variantId) => {
        const cleanData = { ...editingVariant };
        Object.keys(cleanData).forEach((key) => {
            if (cleanData[key] === undefined) delete cleanData[key];
        });

        console.log("🔵 Gửi PUT /variants", variantId, cleanData);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/products/variants-update/${variantId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(cleanData),
            });

            if (res.ok) {
                alert("✅ Cập nhật thành công!");
                setEditingVariant(null);
                fetchProducts();
            } else {
                const data = await res.json();
                alert("❌ Lỗi khi cập nhật biến thể: " + (data.message || ""));
            }
        } catch (err) {
            console.error("Lỗi cập nhật biến thể:", err);
        }
    };


    const handleDeleteVariant = async (variantId) => {
        if (!window.confirm("Xóa biến thể này?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:3000/api/products/variants/${variantId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
            });
            if (res.ok) {
                alert("Đã xóa biến thể!");
                fetchProducts();
            } else {
                alert("Xóa thất bại!");
            }
        } catch (err) {
            console.error("Lỗi xóa biến thể:", err);
        }
    };

    if (loading) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className="products-container">
            <div className="products-header">
                <h2>Quản lý sản phẩm</h2>
                {/* FORM THÊM SẢN PHẨM */}
                {showAddForm && (
                    <div className="add-product-form">
                        <h3>Thêm sản phẩm mới</h3>
                        <input
                            type="text"
                            placeholder="Tên sản phẩm"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <textarea
                            placeholder="Mô tả"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Giá cơ bản"
                            value={newProduct.base_price}
                            onChange={(e) => setNewProduct({ ...newProduct, base_price: e.target.value })}
                        />

                        {/* Dropdown danh mục */}
                        <select
                            value={newProduct.category_id}
                            onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                            ))}
                        </select>

                        {/* Dropdown thương hiệu */}
                        <select
                            value={newProduct.brand_id}
                            onChange={(e) => setNewProduct({ ...newProduct, brand_id: e.target.value })}
                        >
                            <option value="">-- Chọn thương hiệu --</option>
                            {brands.map(b => (
                                <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
                            ))}
                        </select>

                        <input
                            placeholder="SKU"
                            value={newProduct.sku}
                            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Trọng lượng (gram)"
                            value={newProduct.weight}
                            onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                        />

                        <div className="form-actions">
                            <button className="btn-save" onClick={handleAddProduct}>Lưu</button>
                            <button className="btn-cancel" onClick={() => setShowAddForm(false)}>Hủy</button>
                        </div>
                    </div>
                )}

                {/* FORM SỬA SẢN PHẨM */}
                {showEditForm && selectedProduct && (
                    <div className="add-product-form">
                        <h3>Chỉnh sửa sản phẩm</h3>

                        <input type="text" placeholder="Tên sản phẩm"
                            value={selectedProduct.name}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />

                        <textarea placeholder="Mô tả"
                            value={selectedProduct.description}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })} />

                        <input type="number" placeholder="Giá cơ bản"
                            value={selectedProduct.base_price}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, base_price: e.target.value })} />

                        {/* Dropdown danh mục */}
                        <select
                            value={selectedProduct.category_id}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, category_id: e.target.value })}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                            ))}
                        </select>

                        {/* Dropdown thương hiệu */}
                        <select
                            value={selectedProduct.brand_id}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, brand_id: e.target.value })}
                        >
                            <option value="">-- Chọn thương hiệu --</option>
                            {brands.map(b => (
                                <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
                            ))}
                        </select>

                        <input placeholder="SKU"
                            value={selectedProduct.sku}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })} />

                        <input placeholder="Trọng lượng (gram)"
                            value={selectedProduct.weight}
                            onChange={(e) => setSelectedProduct({ ...selectedProduct, weight: e.target.value })} />

                        {/* Dropdown trạng thái */}
                        <select
                            value={String(selectedProduct.is_active)} // ép kiểu để khớp option.value
                            onChange={(e) =>
                                setSelectedProduct({
                                    ...selectedProduct,
                                    is_active: e.target.value === "1" ? 1 : 0, // convert lại trước khi gửi
                                })
                            }
                        >
                            <option value="1">Hoạt động</option>
                            <option value="0">Ngừng kinh doanh</option>
                        </select>


                        <div className="form-actions">
                            <button className="btn-save" onClick={handleUpdateProduct}>Lưu thay đổi</button>
                            <button className="btn-cancel" onClick={() => setShowEditForm(false)}>Hủy</button>
                        </div>
                    </div>
                )}


                <button className="btn-add" onClick={() => setShowAddForm(!showAddForm)}>
                    {showAddForm ? "Đóng form" : "+ Thêm sản phẩm"}
                </button>
            </div>

            <table className="products-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Thương hiệu</th>
                        <th>Giá cơ bản</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => {
                        const isExpanded = expandedProducts.includes(p.product_id);
                        return (
                            <React.Fragment key={p.product_id}>
                                <tr className="product-row">
                                    <td className="expand-cell">
                                        {p.variants?.length > 0 && (
                                            <button
                                                className="expand-btn"
                                                onClick={() => toggleExpand(p.product_id)}
                                            >
                                                {isExpanded ? "▲" : "▼"}
                                            </button>
                                        )}
                                    </td>
                                    <td>{p.product_id}</td>
                                    <td>{p.name}</td>
                                    <td>{p.category_name}</td>
                                    <td>{p.brand_name}</td>
                                    <td>{Number(p.base_price).toLocaleString()}₫</td>
                                    <td>
                                        {p.is_active ? (
                                            <span className="status-active">Đang bán</span>
                                        ) : (
                                            <span className="status-inactive">Ngừng</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEditProductClick(p)} // ✅ mở form sửa
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDeleteProduct(p.product_id)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>

                                {isExpanded && p.variants?.length > 0 && (
                                    <tr className="variant-row">
                                        <td colSpan="8">
                                            <div className="variant-wrapper">
                                                <h4>Biến thể sản phẩm</h4>
                                                <table className="variant-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Ảnh</th>
                                                            <th>SKU</th>
                                                            <th>Cỡ</th>
                                                            <th>Màu</th>
                                                            <th>Giá</th>
                                                            <th>Tồn kho</th>
                                                            <th>Thao tác</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {p.variants.map((v) => {
                                                            const attrs = JSON.parse(v.attributes || "{}");
                                                            const variantImage = p.images?.find(
                                                                (img) => img.variant_id === v.variant_id
                                                            )?.image_url;
                                                            const isEditing =
                                                                editingVariant &&
                                                                editingVariant.variant_id === v.variant_id;

                                                            return (
                                                                <tr key={v.variant_id}>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    editingVariant.image_url ||
                                                                                    variantImage ||
                                                                                    ""
                                                                                }
                                                                                placeholder="URL ảnh"
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        image_url: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : variantImage ? (
                                                                            <img
                                                                                src={variantImage}
                                                                                alt={v.sku}
                                                                                className="variant-thumb"
                                                                            />
                                                                        ) : (
                                                                            "Không có ảnh"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                value={editingVariant.sku}
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        sku: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            v.sku
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                value={editingVariant.size || ""}
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        size: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            attrs.size || "N/A"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                value={editingVariant.color}
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        color: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            attrs.color
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                type="number"
                                                                                value={editingVariant.price}
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        price: e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            Number(v.price).toLocaleString() + "₫"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <input
                                                                                type="number"
                                                                                value={editingVariant.stock_quantity}
                                                                                onChange={(e) =>
                                                                                    setEditingVariant({
                                                                                        ...editingVariant,
                                                                                        stock_quantity:
                                                                                            e.target.value,
                                                                                    })
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            v.stock_quantity
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {isEditing ? (
                                                                            <>
                                                                                <button
                                                                                    className="btn-save"
                                                                                    onClick={() =>
                                                                                        handleEditVariant(v.variant_id)
                                                                                    }
                                                                                >
                                                                                    Lưu
                                                                                </button>
                                                                                <button
                                                                                    className="btn-cancel"
                                                                                    onClick={() =>
                                                                                        setEditingVariant(null)
                                                                                    }
                                                                                >
                                                                                    Hủy
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <button
                                                                                    className="btn-edit-small"
                                                                                    onClick={() =>
                                                                                        setEditingVariant({
                                                                                            ...v,
                                                                                            size: attrs.size,
                                                                                            color: attrs.color,
                                                                                            image_url:
                                                                                                variantImage || "",
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    Sửa
                                                                                </button>
                                                                                <button
                                                                                    className="btn-delete-small"
                                                                                    onClick={() =>
                                                                                        handleDeleteVariant(v.variant_id)
                                                                                    }
                                                                                >
                                                                                    Xóa
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>

                                                <div className="add-variant-form">
                                                    <input
                                                        placeholder="URL ảnh"
                                                        value={newVariant[p.product_id]?.image_url || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    image_url: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <input
                                                        placeholder="SKU"
                                                        value={newVariant[p.product_id]?.sku || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    sku: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <input
                                                        placeholder="Cỡ"
                                                        value={newVariant[p.product_id]?.size || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    size: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <input
                                                        placeholder="Màu"
                                                        value={newVariant[p.product_id]?.color || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    color: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Giá"
                                                        value={newVariant[p.product_id]?.price || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    price: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Tồn kho"
                                                        value={newVariant[p.product_id]?.stock_quantity || ""}
                                                        onChange={(e) =>
                                                            setNewVariant((prev) => ({
                                                                ...prev,
                                                                [p.product_id]: {
                                                                    ...prev[p.product_id],
                                                                    stock_quantity: e.target.value,
                                                                },
                                                            }))
                                                        }
                                                    />
                                                    <button
                                                        className="btn-add-small"
                                                        onClick={() => handleAddVariant(p.product_id)}
                                                    >
                                                        + Thêm
                                                    </button>
                                                </div>

                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProducts;
