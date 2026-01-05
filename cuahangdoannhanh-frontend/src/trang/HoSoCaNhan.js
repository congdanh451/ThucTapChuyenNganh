import React, { useState } from 'react';
import './HoSoCaNhan.css';

function HoSoCaNhan() {
    // Giả lập dữ liệu người dùng đang đăng nhập
    const [user, setUser] = useState({
        hoTen: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        sdt: "0909123456",
        diaChi: "123 Đường ABC, Quận 1, TP.HCM"
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleLuu = () => {
        alert("Đã cập nhật thông tin thành công!");
        // Sau này sẽ gọi API để lưu xuống CSDL
    };

    return (
        <div className="hoso-container">
            <h2 className="tieu-de-trang">Hồ Sơ Của Tôi</h2>
            
            <div className="hoso-box">
                <div className="hoso-avatar">
                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Avatar" />
                    <p>Khách hàng thân thiết</p>
                </div>

                <div className="hoso-form">
                    <div className="form-group">
                        <label>Họ và Tên:</label>
                        <input type="text" name="hoTen" value={user.hoTen} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={user.email} disabled className="input-disabled" />
                        <small>(Email không thể thay đổi)</small>
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="text" name="sdt" value={user.sdt} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ mặc định:</label>
                        <input type="text" name="diaChi" value={user.diaChi} onChange={handleChange} />
                    </div>

                    <button className="btn-luu" onClick={handleLuu}>Lưu Thay Đổi</button>
                </div>
            </div>
        </div>
    );
}

export default HoSoCaNhan;