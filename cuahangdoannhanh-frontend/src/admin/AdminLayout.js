import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const AdminLayout = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false); // Trạng thái được phép truy cập

    useEffect(() => {
        const userStored = localStorage.getItem('userFastFood');
        
        if (!userStored) {
            alert("Vui lòng đăng nhập để truy cập Admin!");
            navigate('/dang-nhap');
            return;
        }

        const user = JSON.parse(userStored);

        // --- CẬP NHẬT LOGIC BẢO VỆ ---
        // Cho phép: Admin (1), Quản Lý (2), VÀ Nhân Viên (3)
        // Chỉ chặn: Khách hàng (4)
        if (user.MaVaiTro === 1 || user.MaVaiTro === 2 || user.MaVaiTro === 3) {
            setIsAuthorized(true); // Được phép vào
        } else {
            alert("⛔ Bạn không có quyền truy cập trang Quản Trị!");
            navigate('/'); // Đá về trang chủ
        }

    }, [navigate]);

    // Nếu chưa được cấp quyền, không render gì cả
    if (!isAuthorized) return null;

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ flex: 1, backgroundColor: '#f4f6f8', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;