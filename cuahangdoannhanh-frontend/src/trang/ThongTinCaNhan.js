import React, { useState, useEffect } from 'react';
import './ThongTinCaNhan.css';

const ThongTinCaNhan = ({ onUpdateUser }) => {
    const [user, setUser] = useState(null);
    
    // Form State
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [sdt, setSdt] = useState('');
    const [matKhauMoi, setMatKhauMoi] = useState('');
    const [xacNhanMK, setXacNhanMK] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('userFastFood'));
        if (storedUser) {
            setUser(storedUser);
            setHoTen(storedUser.HoTen);
            setEmail(storedUser.Email);
            setSdt(storedUser.SoDienThoai);
        }
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();

        // Kiểm tra khớp mật khẩu
        if (matKhauMoi && matKhauMoi !== xacNhanMK) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        const dataToSend = {
            hoTen,
            sdt,
            matKhauMoi: matKhauMoi || null
        };

        // Gọi API Cập nhật
        // Lưu ý: Đảm bảo đường dẫn này khớp với server.js (ví dụ app.use('/api', authRoutes))
        fetch(`http://localhost:5000/api/update/${user.MaTaiKhoan}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        })
        .then(async (res) => {
            const data = await res.json();
            // Ném lỗi nếu status HTTP không phải 200-299
            if (!res.ok) {
                throw new Error(data.message || "Lỗi Server");
            }
            return data;
        })
        .then(data => {
            if (data.status === 'success') {
                alert("🎉 Cập nhật thành công!");
                // Cập nhật lại state user toàn cục (ở App.js)
                onUpdateUser(data.user); 
                
                // Reset ô mật khẩu
                setMatKhauMoi('');
                setXacNhanMK('');
            } else {
                alert("Lỗi: " + data.message);
            }
        })
        .catch(err => {
            console.error("Lỗi chi tiết:", err);
            alert("❌ Không thể kết nối: " + err.message);
        });
    };

    if (!user) return <div className="profile-container"><h2>Vui lòng đăng nhập!</h2></div>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">Hồ Sơ Của Tôi</h2>
            
            <div className="profile-card">
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Email (Không thể thay đổi)</label>
                        <input type="text" className="form-input readonly" value={email} readOnly disabled />
                    </div>

                    <div className="form-group">
                        <label>Họ và Tên</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={hoTen} 
                            onChange={(e) => setHoTen(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input 
                            type="text" 
                            className="form-input" 
                            value={sdt} 
                            onChange={(e) => setSdt(e.target.value)} 
                            required 
                        />
                    </div>

                    <hr className="divider" />
                    <p className="note">Nhập mật khẩu mới nếu bạn muốn thay đổi (bỏ trống để giữ nguyên).</p>

                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={matKhauMoi} 
                            onChange={(e) => setMatKhauMoi(e.target.value)} 
                            placeholder="********"
                        />
                    </div>

                    <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <input 
                            type="password" 
                            className="form-input" 
                            value={xacNhanMK} 
                            onChange={(e) => setXacNhanMK(e.target.value)} 
                            placeholder="********"
                        />
                    </div>

                    <button type="submit" className="btn-save">Lưu Thay Đổi</button>
                </form>
            </div>
        </div>
    );
};

export default ThongTinCaNhan;