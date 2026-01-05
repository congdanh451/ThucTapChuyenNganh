import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Import Component Khách hàng
import Header from './thanhphan/header';
import Footer from './thanhphan/footer';
import ModalChiNhanh from './thanhphan/ModalChiNhanh';

import TrangChinh from './trang/trangchinh';
import ThucDon from './trang/ThucDon';
import ChiTietMon from './trang/ChiTietMon';
import GioHang from './trang/GioHang';
import ThanhToan from './trang/ThanhToan';
import LichSuDon from './trang/LichSuDon';
import DangNhap from './trang/DangNhap';
import DangKy from './trang/DangKy';
import ThongTinCaNhan from './trang/ThongTinCaNhan';

// Import Component Admin
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import QuanLySanPham from './admin/pages/QuanLySanPham';
import QuanLyDonHang from './admin/pages/QuanLyDonHang';
import QuanLyChiNhanh from './admin/pages/QuanLyChiNhanh';
import QuanLyTaiKhoan from './admin/pages/QuanLyTaiKhoan'; // <--- BẠN ĐANG THIẾU DÒNG NÀY


function App() {
  // --- 1. STATE GIỎ HÀNG ---
  const [gioHang, setGioHang] = useState(() => {
      const luuTru = localStorage.getItem('gioHangFastFood');
      return luuTru ? JSON.parse(luuTru) : [];
  });
  useEffect(() => { localStorage.setItem('gioHangFastFood', JSON.stringify(gioHang)); }, [gioHang]);

  // --- 2. STATE CHI NHÁNH ---
  const [chiNhanh, setChiNhanh] = useState(() => {
      const savedCN = localStorage.getItem('chiNhanhHienTai');
      return savedCN ? JSON.parse(savedCN) : null;
  });
  const [hienModalCN, setHienModalCN] = useState(false);

  // --- 3. STATE USER & HÀM LOGIN ---
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('userFastFood');
      return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
      setUser(userData);
      localStorage.setItem('userFastFood', JSON.stringify(userData));
  };

  const handleLogout = () => {
      setUser(null);
      localStorage.removeItem('userFastFood');
      alert("Đã đăng xuất thành công!");
  };

  // --- CÁC HÀM XỬ LÝ KHÁC ---
  const themVaoGio = (sanPham, soLuongMua = 1) => {
      const tonTai = gioHang.find(i => i.id === sanPham.id);
      if (tonTai) {
        setGioHang(gioHang.map(i => i.id === sanPham.id ? { ...i, soLuong: i.soLuong + soLuongMua } : i));
      } else {
        setGioHang([...gioHang, { ...sanPham, soLuong: soLuongMua }]);
      }
      alert(`Đã thêm "${sanPham.ten}" vào giỏ!`);
  };
  const xoaSachGioHang = () => setGioHang([]);
  const chonChiNhanh = (cn) => {
      setChiNhanh(cn);
      localStorage.setItem('chiNhanhHienTai', JSON.stringify(cn));
      setHienModalCN(false);
  };

  // Layout cho Khách
  const UserLayout = () => (
      <>
        <Header 
            soLuongGioHang={gioHang.length} 
            chiNhanhHienTai={chiNhanh} 
            moModalChiNhanh={() => setHienModalCN(true)}
            user={user} 
            logout={handleLogout} 
        />
        <ModalChiNhanh dangHien={hienModalCN} dongModal={() => setHienModalCN(false)} chonChiNhanh={chonChiNhanh} />
        
        {/* VÙNG CHỨA NỘI DUNG CHÍNH */}
        <main className="main-content-wrapper"> 
            <Outlet />
        </main>
        
        <Footer />
      </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* KHÁCH HÀNG */}
          <Route element={<UserLayout />}>
              <Route path="/" element={<TrangChinh />} />
              <Route path="/thuc-don" element={<ThucDon themVaoGio={themVaoGio} />} />
              <Route path="/chi-tiet/:id" element={<ChiTietMon themVaoGio={themVaoGio} />} />
              <Route path="/cart" element={<GioHang gioHang={gioHang} setGioHang={setGioHang} />} />
              <Route path="/thanh-toan" element={<ThanhToan gioHang={gioHang} xoaSachGioHang={xoaSachGioHang} />} />
              <Route path="/lich-su-don" element={<LichSuDon />} />
              
              <Route path="/login" element={<DangNhap onLogin={handleLogin} />} />
              <Route path="/dang-nhap" element={<DangNhap onLogin={handleLogin} />} />
              <Route path="/dang-ky" element={<DangKy />} />
              <Route path="/profile" element={<ThongTinCaNhan onUpdateUser={handleLogin} />} />
              <Route path="/thong-tin-ca-nhan" element={<ThongTinCaNhan onUpdateUser={handleLogin} />} />
          </Route>

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<QuanLySanPham />} />
              <Route path="orders" element={<QuanLyDonHang />} />
              <Route path="branches" element={<QuanLyChiNhanh />} />
              <Route path="accounts" element={<QuanLyTaiKhoan />} /> {/* Route quản lý tài khoản */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;