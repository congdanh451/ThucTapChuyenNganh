// src/trang/DangNhap.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 1. Nhớ import useNavigate
import './Auth.css';

function DangNhap({ onLogin }) {
    const navigate = useNavigate(); // 2. Khởi tạo hàm chuyển hướng
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            // --- ĐOẠN MỚI THÊM ĐỂ SOI LỖI ---
            console.log("Dữ liệu Server trả về:", data);
            if (data.user) {
                console.log("Vai trò của user là:", data.user.TenVaiTro);
            }
            // --------------------------------

            if (data.status === 'success') {
                alert("Đăng nhập thành công! Xin chào " + data.user.HoTen);
                
                onLogin(data.user);

                // LOGIC CHUYỂN TRANG (SỬA LẠI CHO CHẮC CHẮN)
                const role = data.user.TenVaiTro; // Lấy vai trò ra biến riêng

                if (role === 'Admin' || role === 'QuanLy') {
                    console.log("-> Đang chuyển hướng sang Admin...");
                    navigate('/admin/dashboard');
                } else {
                    console.log("-> Đang chuyển hướng về Trang chủ...");
                    navigate('/'); 
                }

            } else {
                alert("Lỗi: " + data.message);
            }

        } catch (error) {
            console.error("Lỗi:", error);
            alert("Không thể kết nối Server!");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-box">
                <h2 className="auth-title">Đăng Nhập</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            onChange={handleChange} 
                            required 
                            placeholder="Ví dụ: admin@gmail.com"
                        />
                    </div>

                    <div className="form-control">
                        <label>Mật khẩu</label>
                        <input 
                            type="password" 
                            name="password" 
                            onChange={handleChange} 
                            required 
                            placeholder="Nhập mật khẩu..."
                        />
                    </div>

                    <button type="submit" className="auth-btn">ĐĂNG NHẬP</button>
                </form>

                <div className="auth-link">
                    <p>Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link></p>
                </div>
            </div>
        </div>
    );
}

export default DangNhap;