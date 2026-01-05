// src/trang/DangKy.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function DangKy() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        password: '',
        confirmPassword: '',
        sdt: '' // Thêm trường SĐT
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra mật khẩu nhập lại
        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            // 2. Gọi API Node.js (Cổng 5000)
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hoTen: formData.hoTen,
                    email: formData.email,
                    password: formData.password,
                    sdt: formData.sdt || "" 
                })
            });

            const data = await response.json(); // Nhận kết quả từ Server

            // 3. Xử lý kết quả
            if (response.ok) { // Nếu server trả về 200 OK
                alert("Đăng ký thành công! Mời bạn đăng nhập.");
                navigate('/dang-nhap');
            } else {
                // Nếu lỗi (VD: Email trùng)
                alert("Lỗi: " + data.message);
            }

        } catch (error) {
            console.error("Lỗi kết nối:", error);
            alert("Không thể kết nối đến máy chủ (Backend chưa chạy?)");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h2 className="auth-title">Đăng Ký</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label>Họ và Tên</label>
                        <input type="text" name="hoTen" onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label>Email</label>
                        <input type="email" name="email" onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label>Số điện thoại</label>
                        <input type="text" name="sdt" onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label>Mật khẩu</label>
                        <input type="password" name="password" onChange={handleChange} required />
                    </div>
                    <div className="form-control">
                        <label>Nhập lại mật khẩu</label>
                        <input type="password" name="confirmPassword" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="auth-btn">ĐĂNG KÝ</button>
                </form>

                <div className="auth-link">
                    <p>Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập ngay</Link></p>
                </div>
            </div>
        </div>
    );
}

export default DangKy;