import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0 });
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        // Lấy thống kê số liệu
        fetch('http://localhost:5000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Lỗi tải stats:", err));

        // Lấy đơn hàng mới nhất
        fetch('http://localhost:5000/api/dashboard/recent-orders')
            .then(res => res.json())
            .then(data => setRecentOrders(data))
            .catch(err => console.error("Lỗi tải đơn mới:", err));
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusClass = (status) => {
        if (status === 'ChoXacNhan') return 'badge-warning';
        if (status === 'DangGiao') return 'badge-info';
        if (status === 'HoanTat') return 'badge-success';
        if (status === 'Huy') return 'badge-danger';
        return '';
    };

    return (
        <div className="dashboard-container">
            <h2 className="page-title">Tổng Quan Kinh Doanh</h2>

            {/* CÁC THẺ THỐNG KÊ (CARDS) */}
            <div className="stats-grid">
                <div className="stat-card blue">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <h3>Đơn Hôm Nay</h3>
                        <p className="stat-number">{stats.orders}</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Doanh Thu Ngày</h3>
                        <p className="stat-number">{formatCurrency(stats.revenue)}</p>
                    </div>
                </div>
                <div className="stat-card orange">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                        <h3>Khách Hàng</h3>
                        <p className="stat-number">{stats.customers}</p>
                    </div>
                </div>
                <div className="stat-card red">
                    <div className="stat-icon">🍔</div>
                    <div className="stat-info">
                        <h3>Tổng Món Ăn</h3>
                        <p className="stat-number">{stats.products}</p>
                    </div>
                </div>
            </div>

            {/* BẢNG ĐƠN HÀNG MỚI NHẤT */}
            <div className="recent-orders-card">
                <div className="card-header">
                    <h3>Đơn Hàng Mới Nhất</h3>
                </div>
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách Hàng</th>
                                <th>Tổng Tiền</th>
                                <th>Thời Gian</th>
                                <th>Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.length > 0 ? recentOrders.map(order => (
                                <tr key={order.MaDonHang}>
                                    <td><strong>#{order.MaDonHang}</strong></td>
                                    <td>{order.HoTen}</td>
                                    <td className="price-text">{formatCurrency(order.TongTien)}</td>
                                    <td>{new Date(order.NgayDat).toLocaleString('vi-VN')}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.TrangThai)}`}>
                                            {order.TrangThai}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="text-center">Chưa có đơn hàng nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;