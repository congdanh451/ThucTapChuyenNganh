import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userFastFood');
        alert("Đã đăng xuất khỏi Admin!");
        window.location.href = '/dang-nhap'; 
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Admin Portal</h3>
                <p>FastFood VN</p>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                        📊 Tổng Quan
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
                        🍔 Quản Lý Món Ăn
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? "active" : ""}>
                        📦 Quản Lý Đơn Hàng
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/branches" className={({ isActive }) => isActive ? "active" : ""}>
                        📍 Quản Lý Chi Nhánh
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/admin/accounts" className={({ isActive }) => isActive ? "active" : ""}>
                        👥 Quản Lý Tài Khoản
                    </NavLink>
                </li>
            </ul>

            <div className="sidebar-footer">
                {/* NÚT MỚI: QUAY VỀ TRANG WEB BÁN HÀNG */}
                <button onClick={() => navigate('/')} className="btn-go-home">
                    🏠 Xem Trang Web
                </button>

                <button onClick={handleLogout} className="btn-logout-admin">
                    🚪 Đăng Xuất
                </button>
            </div>
        </div>
    );
};

export default Sidebar;