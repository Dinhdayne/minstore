import React, { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import "./AdminPage.css";

const AdminReports = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [customerStats, setCustomerStats] = useState({});
    const [returnStats, setReturnStats] = useState([]);
    const [importStats, setImportStats] = useState([]);

    const [loading, setLoading] = useState(true);

    // Bộ lọc thời gian doanh thu
    const [filterType, setFilterType] = useState("day");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Bộ lọc cho top sản phẩm
    const [productDays, setProductDays] = useState(7);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                type: filterType,
                start: startDate || "",
                end: endDate || "",
            });

            const token = localStorage.getItem("token");
            const [revRes, prodRes, cusRes, retRes, impRes] = await Promise.all([
                fetch(`http://localhost:3000/api/statistics/revenue?${queryParams}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch(`http://localhost:3000/api/statistics/top-products?days=${productDays}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch("http://localhost:3000/api/statistics/customers", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch("http://localhost:3000/api/statistics/returns", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
                fetch("http://localhost:3000/api/statistics/inventory/logs", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }),
            ]);

            const [revData, prodData, cusData, retData, impData] = await Promise.all([
                revRes.json(),
                prodRes.json(),
                cusRes.json(),
                retRes.json(),
                impRes.json(),
            ]);

            setRevenueData(revData);
            setTopProducts(prodData);
            setCustomerStats(cusData);
            setReturnStats(retData);
            setImportStats(impData);
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu báo cáo:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    if (loading) return <p>Đang tải dữ liệu thống kê...</p>;

    const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"];

    return (
        <div className="reports-container">
            <h2 className="reports-title">📊 Báo cáo tổng quan</h2>

            {/* --- 1️⃣ Doanh thu theo thời gian --- */}
            <section className="report-section">
                <div className="report-header">
                    <h3>Doanh thu</h3>
                    <div className="filter-controls">
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="day">Theo ngày</option>
                            <option value="month">Theo tháng</option>
                            <option value="year">Theo năm</option>
                        </select>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <span>–</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button className="btn-apply" onClick={fetchReports}>
                            Áp dụng
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total_revenue"
                            stroke="#4F46E5"
                            strokeWidth={2}
                            name="Doanh thu (VNĐ)"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_orders"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Số đơn hàng"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </section>

            {/* --- 2️⃣ Top sản phẩm bán chạy --- */}
            <section className="report-section">
                <div className="report-header">
                    <h3>Top sản phẩm bán chạy</h3>
                    <div className="filter-controls">
                        <label>Khoảng thời gian:</label>
                        <select
                            value={productDays}
                            onChange={(e) => setProductDays(e.target.value)}
                        >
                            <option value="7">7 ngày</option>
                            <option value="30">30 ngày</option>
                            <option value="90">90 ngày</option>
                        </select>
                        <button className="btn-apply" onClick={fetchReports}>
                            Áp dụng
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topProducts}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="product_name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="total_sold" fill="#F59E0B" name="Số lượng bán" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            {/* --- 3️⃣ Thống kê khách hàng --- */}
            <section className="report-section">
                <h3>Thống kê khách hàng</h3>
                <div className="customer-stats">
                    <div className="stat-card">
                        <h4>Tổng khách hàng</h4>
                        <p>{customerStats.total_customers || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Khách hàng mới (30 ngày)</h4>
                        <p>{customerStats.new_customers || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h4>Khách chi tiêu nhiều nhất</h4>
                        <p>{customerStats.top_spender_name || "Chưa có dữ liệu"}</p>
                        <small>
                            {customerStats.top_spender_amount
                                ? `${customerStats.top_spender_amount.toLocaleString()} VNĐ`
                                : ""}
                        </small>
                    </div>
                </div>
            </section>

            {/* --- 4️⃣ Tỷ lệ giới tính khách hàng --- */}
            {customerStats.gender_stats && (
                <section className="report-section">
                    <h3>Tỷ lệ giới tính khách hàng</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={customerStats.gender_stats}
                                dataKey="count"
                                nameKey="gender"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {customerStats.gender_stats.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </section>
            )}

            {/* --- 5️⃣ Thống kê hoàn hàng --- */}
            <section className="report-section">
                <h3>Thống kê hoàn hàng</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={returnStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total_returns"
                            stroke="#EF4444"
                            strokeWidth={2}
                            name="Số đơn hoàn"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_refund"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            name="Tổng tiền hoàn (VNĐ)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </section>
            {/* --- 6️⃣ Thống kê nhập kho --- */}
            {/* <section className="report-section">
                <h3>Thống kê nhập kho</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={importStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total_imports"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            name="Số lần nhập"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_quantity"
                            stroke="#10B981"
                            strokeWidth={2}
                            name="Tổng số lượng nhập"
                        />
                        <Line
                            type="monotone"
                            dataKey="total_cost"
                            stroke="#F59E0B"
                            strokeWidth={2}
                            name="Tổng giá trị nhập (VNĐ)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </section> */}

        </div>
    );
};

export default AdminReports;
