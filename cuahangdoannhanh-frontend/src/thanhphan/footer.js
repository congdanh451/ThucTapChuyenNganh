import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css'; // Lưu ý tên file css chữ thường

function Footer() {
    return (
        <footer className="footer-wrapper">
            <div className="footer-container">
                
                {/* CỘT 1: THÔNG TIN THƯƠNG HIỆU */}
                <div className="footer-col">
                    <h2 className="footer-logo">
                        FastFood<span className="logo-vn">VN</span>
                    </h2>
                    <p className="footer-desc">
                        Hệ thống thức ăn nhanh hàng đầu Việt Nam với hương vị tuyệt hảo và dịch vụ tận tâm. Chúng tôi cam kết mang đến những bữa ăn ngon miệng và an toàn nhất.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon">Facebook</a>
                        <a href="#" className="social-icon">Instagram</a>
                        <a href="#" className="social-icon">Youtube</a>
                    </div>
                </div>

                {/* CỘT 2: LIÊN KẾT NHANH */}
                <div className="footer-col">
                    <h3>Khám Phá</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Trang Chủ</Link></li>
                        <li><Link to="/thuc-don">Thực Đơn</Link></li>
                        <li><Link to="/khuyen-mai">Khuyến Mãi</Link></li>
                        <li><Link to="/cua-hang">Hệ Thống Cửa Hàng</Link></li>
                    </ul>
                </div>

                {/* CỘT 3: HỖ TRỢ KHÁCH HÀNG */}
                <div className="footer-col">
                    <h3>Hỗ Trợ</h3>
                    <ul className="footer-links">
                        <li><Link to="/chinh-sach">Chính Sách Bảo Mật</Link></li>
                        <li><Link to="/dieu-khoan">Điều Khoản Dịch Vụ</Link></li>
                        <li><Link to="/tuyen-dung">Tuyển Dụng</Link></li>
                        <li><Link to="/lien-he">Liên Hệ Góp Ý</Link></li>
                    </ul>
                </div>

                {/* CỘT 4: LIÊN HỆ */}
                <div className="footer-col">
                    <h3>Liên Hệ</h3>
                    <ul className="footer-contact">
                        <li>
                            <strong>📍 Trụ sở chính:</strong><br />
                            273 An Dương Vương, Q.5, TP.HCM
                        </li>
                        <li>
                            <strong>📞 Hotline:</strong><br />
                            <a href="tel:19001234">1900 1234</a>
                        </li>
                        <li>
                            <strong>✉️ Email:</strong><br />
                            <a href="mailto:cskh@fastfoodvn.com">cskh@fastfoodvn.com</a>
                        </li>
                    </ul>
                </div>

            </div>

            {/* DÒNG BẢN QUYỀN CUỐI CÙNG */}
            <div className="footer-bottom">
                <p>&copy; 2025 FastFood VN. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;