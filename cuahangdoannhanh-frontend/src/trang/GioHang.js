// src/trang/GioHang.js
import React from 'react';
import { Link } from 'react-router-dom';
import './GioHang.css';

// QUAN TRỌNG: Nhận gioHang và setGioHang từ props (do App.js truyền vào)
function GioHang({ gioHang, setGioHang }) {
    
    // Hàm định dạng tiền
    const dinhDangTien = (soTien) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
    };

    // Hàm thay đổi số lượng (Gọi setGioHang để cập nhật dữ liệu thật ở App.js)
    const thayDoiSoLuong = (id, delta) => {
        setGioHang(gioHang.map(item => {
            if (item.id === id) {
                const soLuongMoi = item.soLuong + delta;
                return { ...item, soLuong: soLuongMoi > 0 ? soLuongMoi : 1 };
            }
            return item;
        }));
    };

    // Hàm xóa món
    const xoaMon = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa món này không?")) {
            setGioHang(gioHang.filter(item => item.id !== id));
        }
    };

    // Tính tổng tiền dựa trên giỏ hàng thật
    const tongTien = gioHang.reduce((tong, item) => tong + (item.gia * item.soLuong), 0);

    // Nếu giỏ hàng trống
    if (gioHang.length === 0) {
        return (
            <div className="gio-hang-trong">
                <h2>Giỏ hàng của bạn đang trống!</h2>
                <p>Hãy chọn thêm món ăn ngon nhé.</p>
                <Link to="/thuc-don" className="nut-mua-tiep">Xem thực đơn ngay</Link>
            </div>
        );
    }

    return (
        <div className="gio-hang-container">
            <h2 className="tieu-de-gio-hang">Giỏ Hàng Của Bạn</h2>

            <div className="noi-dung-gio-hang">
                {/* Cột trái: Danh sách món */}
                <div className="danh-sach-mon">
                    {gioHang.map((item) => (
                        <div key={item.id} className="item-gio-hang">
                            <img src={item.anh} alt={item.ten} className="anh-item" />
                            
                            <div className="thong-tin-item">
                                <h3>{item.ten}</h3>
                                <p className="gia-item">{dinhDangTien(item.gia)}</p>
                            </div>

                            <div className="bo-dieukhien-soluong">
                                <button onClick={() => thayDoiSoLuong(item.id, -1)}>-</button>
                                <span>{item.soLuong}</span>
                                <button onClick={() => thayDoiSoLuong(item.id, 1)}>+</button>
                            </div>

                            <div className="tong-tien-item">
                                {dinhDangTien(item.gia * item.soLuong)}
                            </div>

                            <button className="nut-xoa" onClick={() => xoaMon(item.id)}>×</button>
                        </div>
                    ))}
                </div>

                {/* Cột phải: Tổng kết hóa đơn */}
                <div className="tong-ket-don">
                    <h3>Cộng Giỏ Hàng</h3>
                    <div className="dong-tong">
                        <span>Tạm tính:</span>
                        <span>{dinhDangTien(tongTien)}</span>
                    </div>
                    <hr />
                    <div className="dong-tong tong-cong">
                        <span>Tổng cộng:</span>
                        <span>{dinhDangTien(tongTien)}</span>
                    </div>

                    {/* Nút chuyển trang Thanh Toán */}
                    <Link to="/thanh-toan">
                        <button className="nut-thanh-toan">
                            Tiến Hành Thanh Toán
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default GioHang;