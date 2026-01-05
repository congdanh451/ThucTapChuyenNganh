// src/trang/ChiTietMon.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import danhSachMon from '../dulieu/danhsachmonan'; // Đảm bảo tên file đúng
import './ChiTietMon.css';

function ChiTietMon({ themVaoGio }) {
    const { id } = useParams();
    const [soLuong, setSoLuong] = useState(1);

    // --- ĐOẠN CODE DEBUG (SOI LỖI) ---
    console.log("ID trên URL là:", id);
    console.log("Toàn bộ danh sách món:", danhSachMon);
    // --------------------------------

    // Tìm món ăn (Chuyển id sang số để so sánh)
    const sanPham = danhSachMon.find(mon => mon.id === parseInt(id));

    console.log("Sản phẩm tìm được:", sanPham);

    // Nếu không tìm thấy -> Báo lỗi ngay trên màn hình
    if (!sanPham) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', color: 'red' }}>
                <h2>⚠️ Không tìm thấy món ăn có ID: {id}</h2>
                <p>Hãy kiểm tra lại file danhsachmonan.js xem có món nào id là {id} không?</p>
                <Link to="/thuc-don">Quay lại thực đơn</Link>
            </div>
        );
    }

    // Hàm định dạng tiền
    const dinhDangTien = (soTien) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
    };

    const tangSoLuong = () => setSoLuong(soLuong + 1);
    const giamSoLuong = () => {
        if (soLuong > 1) setSoLuong(soLuong - 1);
    };

    return (
        <div className="chi-tiet-container">
            <Link to="/thuc-don" className="nut-quay-lai">← Quay lại thực đơn</Link>

            <div className="chi-tiet-content">
                <div className="chi-tiet-anh">
                    <img src={sanPham.anh} alt={sanPham.ten} />
                </div>

                <div className="chi-tiet-thong-tin">
                    <h1>{sanPham.ten}</h1>
                    <p className="chi-tiet-gia">{dinhDangTien(sanPham.gia)}</p>
                    <p className="chi-tiet-mo-ta">
                        Mô tả: Món ăn tuyệt vời với hương vị đậm đà, giòn tan, được chế biến từ nguyên liệu tươi ngon nhất.
                    </p>

                    <div className="chon-so-luong">
                        <span>Số lượng:</span>
                        <div className="bo-dem">
                            <button onClick={giamSoLuong}>-</button>
                            <input type="text" value={soLuong} readOnly />
                            <button onClick={tangSoLuong}>+</button>
                        </div>
                    </div>

                    <button className="nut-dat-hang" onClick={() => themVaoGio(sanPham, soLuong)}>
                        Thêm vào giỏ - {dinhDangTien(sanPham.gia * soLuong)}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChiTietMon;