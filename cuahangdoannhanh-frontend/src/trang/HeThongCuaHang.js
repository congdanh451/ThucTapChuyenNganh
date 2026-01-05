import React from 'react';
import danhSachChiNhanh from '../dulieu/danhsachchinhanh';
import './HeThongCuaHang.css';

function HeThongCuaHang() {
    return (
        <div className="cua-hang-container">
            <h2 className="tieu-de-trang">Hệ Thống Cửa Hàng</h2>
            <p style={{textAlign: 'center', marginBottom: '30px'}}>Hiện tại chúng tôi có {danhSachChiNhanh.length} chi nhánh hoạt động tại TP.HCM</p>

            <div className="ds-cua-hang-grid">
                {danhSachChiNhanh.map((cn) => (
                    <div key={cn.id} className="card-cua-hang">
                        <div className="card-header">
                            <h3>{cn.ten}</h3>
                        </div>
                        <div className="card-body">
                            <p><strong>📍 Địa chỉ:</strong> {cn.diaChi}</p>
                            <p><strong>📞 Hotline:</strong> {cn.sdt}</p>
                            <p><strong>⏰ Giờ mở cửa:</strong> 08:00 - 22:00</p>
                        </div>
                        <button className="btn-chi-duong" onClick={() => window.open(`https://www.google.com/maps/search/${cn.diaChi}`)}>
                            🗺️ Chỉ đường
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HeThongCuaHang;