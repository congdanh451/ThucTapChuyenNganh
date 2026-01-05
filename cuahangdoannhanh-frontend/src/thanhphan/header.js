import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css'; 
import logoImg from '../anh/logo.png'; 

function Header({ user, logout, soLuongGioHang, chiNhanhHienTai, moModalChiNhanh }) {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Kiểm tra xem User có phải là Admin/Nhân viên không
    // Giả sử: MaVaiTro = 4 là Khách Hàng. Khác 4 là Admin/Nhân viên
    const isAdmin = user && user.MaVaiTro !== 4;

    return (
        <header className="header-wrapper">
            <div className="header-container">
                
                {/* 1. LOGO */}
                <div className="logo-area">
                    <Link to="/" className="logo-link">
                        <img src={logoImg} alt="FastFood VN" className="logo-image" />
                        <span className="brand-name">FastFood VN</span>
                    </Link>
                </div>

                {/* 2. MENU */}
                <nav className={`nav-menu ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Trang Chủ</Link>
                    <Link to="/thuc-don" onClick={() => setIsMobileMenuOpen(false)}>Thực Đơn</Link>
                    <Link to="/lich-su-don" onClick={() => setIsMobileMenuOpen(false)}>Đơn Hàng</Link>
                    
                    <div className="mobile-only-branch" onClick={() => { moModalChiNhanh(); setIsMobileMenuOpen(false); }}>
                        📍 {chiNhanhHienTai ? chiNhanhHienTai.ten : "Chọn Chi Nhánh"}
                    </div>
                </nav>

                {/* 3. ACTIONS */}
                <div className="header-actions">
                    
                    <div className="branch-selector desktop-only" onClick={moModalChiNhanh}>
                        <span className="icon">📍</span>
                        <span className="text">
                            {chiNhanhHienTai ? chiNhanhHienTai.ten : "Chọn Chi Nhánh"}
                        </span>
                    </div>

                    <Link to="/cart" className="cart-btn">
                        <span className="cart-icon">🛒</span>
                        {soLuongGioHang > 0 && (
                            <span className="cart-badge">{soLuongGioHang}</span>
                        )}
                    </Link>

                    <div className="user-area">
                        {user ? (
                            <div className="user-logged-in">
                                <Link to="/profile" className="user-name-link">
                                    Hi, {user.HoTen}
                                </Link>
                                
                                {/* --- NÚT VÀO ADMIN (Chỉ hiện nếu là Admin) --- */}
                                {isAdmin && (
                                    <Link to="/admin/dashboard" className="btn-admin-access">
                                        ⚙️ Quản Lý
                                    </Link>
                                )}

                                <button onClick={logout} className="btn-logout">Đăng xuất</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/dang-nhap" className="btn-login-main">Đăng Nhập</Link>
                            </div>
                        )}
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;