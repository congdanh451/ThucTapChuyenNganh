-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th1 05, 2026 lúc 07:52 PM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `cuahangdoannhanh`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chinhanh`
--

DROP TABLE IF EXISTS `chinhanh`;
CREATE TABLE IF NOT EXISTS `chinhanh` (
  `MaChiNhanh` int NOT NULL AUTO_INCREMENT,
  `TenChiNhanh` varchar(200) NOT NULL,
  `DiaChiDayDu` varchar(500) DEFAULT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `TrangThai` varchar(20) DEFAULT 'HoatDong',
  PRIMARY KEY (`MaChiNhanh`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chinhanh`
--

INSERT INTO `chinhanh` (`MaChiNhanh`, `TenChiNhanh`, `DiaChiDayDu`, `SoDienThoai`, `TrangThai`) VALUES
(1, 'CN Quận 1 - Nguyễn Huệ', '123 Phố đi bộ Nguyễn Huệ, Quận 1, TP.HCM', '02838123456', 'HoatDong'),
(2, 'CN Quận 5 - Nguyễn Văn Cừ', '227 Nguyễn Văn Cừ, Quận 5, TP.HCM', '02838789012', 'HoatDong'),
(3, 'CN Thủ Đức - Gigamall', '242 Phạm Văn Đồng, TP. Thủ Đức', '02838999888', 'HoatDong'),
(4, 'qưeqw', 'qưeqwe', '12312', 'HoatDong'),
(5, 'Chi nhánh Mặt Trăng', 'sadas', '12312', 'HoatDong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdonhang`
--

DROP TABLE IF EXISTS `chitietdonhang`;
CREATE TABLE IF NOT EXISTS `chitietdonhang` (
  `MaChiTiet` int NOT NULL AUTO_INCREMENT,
  `MaDonHang` int NOT NULL,
  `MaSanPham` int NOT NULL,
  `SoLuong` int NOT NULL,
  PRIMARY KEY (`MaChiTiet`),
  KEY `MaDonHang` (`MaDonHang`),
  KEY `MaSanPham` (`MaSanPham`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdonhang`
--

INSERT INTO `chitietdonhang` (`MaChiTiet`, `MaDonHang`, `MaSanPham`, `SoLuong`) VALUES
(1, 1, 1, 1),
(8, 17, 33, 1),
(9, 17, 31, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

DROP TABLE IF EXISTS `donhang`;
CREATE TABLE IF NOT EXISTS `donhang` (
  `MaDonHang` int NOT NULL AUTO_INCREMENT,
  `MaKhachHang` int NOT NULL,
  `TenNguoiNhan` varchar(100) DEFAULT NULL,
  `SDT` varchar(20) DEFAULT NULL,
  `DiaChi` varchar(500) DEFAULT NULL,
  `MaChiNhanh` int NOT NULL,
  `MaDonViVC` int DEFAULT NULL,
  `TenNguoiDat` varchar(100) DEFAULT NULL,
  `SDT_NguoiDat` varchar(20) DEFAULT NULL,
  `DiaChi_NguoiDat` varchar(500) DEFAULT NULL,
  `NgayDat` datetime DEFAULT CURRENT_TIMESTAMP,
  `TongTien` decimal(15,2) DEFAULT '0.00',
  `PhiShip` decimal(10,2) DEFAULT '0.00',
  `TrangThai` varchar(30) DEFAULT 'ChoXacNhan',
  `HinhThucThanhToan` varchar(50) DEFAULT 'TienMat',
  PRIMARY KEY (`MaDonHang`),
  KEY `MaKhachHang` (`MaKhachHang`),
  KEY `MaChiNhanh` (`MaChiNhanh`),
  KEY `MaDonViVC` (`MaDonViVC`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`MaDonHang`, `MaKhachHang`, `TenNguoiNhan`, `SDT`, `DiaChi`, `MaChiNhanh`, `MaDonViVC`, `TenNguoiDat`, `SDT_NguoiDat`, `DiaChi_NguoiDat`, `NgayDat`, `TongTien`, `PhiShip`, `TrangThai`, `HinhThucThanhToan`) VALUES
(1, 3, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, '2025-12-05 02:42:00', 104000.00, 0.00, 'HoanTat', 'TienMat'),
(17, 1, 'Quản Trị Viên', '0909000001', 'số 44, đường Nguyễn Trãi, quận 1', 1, 1, 'Quản Trị Viên', '0909000001', 'số 44, đường Nguyễn Trãi, quận 1', '2026-01-06 02:46:13', 79000.00, 15000.00, 'DangGiao', 'ChuyenKhoan');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donvivanchuyen`
--

DROP TABLE IF EXISTS `donvivanchuyen`;
CREATE TABLE IF NOT EXISTS `donvivanchuyen` (
  `MaDonViVC` int NOT NULL AUTO_INCREMENT,
  `TenDonVi` varchar(100) NOT NULL,
  PRIMARY KEY (`MaDonViVC`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `donvivanchuyen`
--

INSERT INTO `donvivanchuyen` (`MaDonViVC`, `TenDonVi`) VALUES
(1, 'GrabFood'),
(2, 'ShopeeFood'),
(3, 'BeFood'),
(4, 'Cửa hàng tự giao');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `monan`
--

DROP TABLE IF EXISTS `monan`;
CREATE TABLE IF NOT EXISTS `monan` (
  `MaMonAn` int NOT NULL,
  `TenMonAn` varchar(200) NOT NULL,
  `MoTa` text,
  `HinhAnhURL` varchar(500) DEFAULT NULL,
  `CongThuc` text,
  PRIMARY KEY (`MaMonAn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `monan`
--

INSERT INTO `monan` (`MaMonAn`, `TenMonAn`, `MoTa`, `HinhAnhURL`, `CongThuc`) VALUES
(24, 'Combo Gia Đình Sum Vầy', 'Bữa tiệc thịnh soạn cho 3-4 người gồm: 4 miếng gà rán giòn, 1 Burger Bò, 2 khoai tây chiên vừa và 3 ly Pepsi tươi mát lạnh.', '1767635785359.png', NULL),
(25, 'Combo 2 người', 'Lựa chọn hoàn hảo cho 2 người gồm: 2 miếng gà sốt cay, 1 Burger Tôm, 1 khoai tây chiên lớn và 2 ly trà đào.', '1767636246178.png', NULL),
(26, 'Gà Sốt Cay Hàn Quốc', 'Gà rán giòn rụm được phủ lớp sốt Gochujang cay nồng chuẩn vị Hàn Quốc, rắc thêm mè rang thơm lừng.', '1767636433973.png', NULL),
(27, 'Gà Lắc Phô Mai Tuyết', 'Lớp vỏ giòn tan kết hợp với bột phô mai mặn ngọt béo ngậy, món khoái khẩu của các tín đồ phô mai.', '1767636707899.png', NULL),
(28, 'Gà Chiên Sốt Bơ Tỏi', 'Hương thơm quyến rũ từ bơ và tỏi phi vàng óng, thấm đẫm vào từng thớ thịt gà mọng nước.', '1767640757418.png', NULL),
(29, 'Burger Bò Hai Tầng', 'Gấp đôi lượng thịt với 2 miếng bò nướng lửa hồng, phô mai Cheddar tan chảy, rau xà lách và sốt BBQ đặc biệt.', '1767640851827.png', NULL),
(30, 'Burger Tôm Sốt Tartar', 'Nhân tôm tươi xay nhuyễn chiên xù, kết hợp với sốt Tartar chua béo nhẹ và bắp cải tím giòn tan.', '1767640936583.png', NULL),
(31, 'Burger Gà Quay Teriyaki', 'Đổi vị với thịt đùi gà quay mềm mại, phủ sốt Teriyaki Nhật Bản mặn ngọt đậm đà và hành tây nướng.', '1767641031624.png', NULL),
(32, 'Trà Đào Cam Sả', 'Thức uống giải nhiệt thanh mát với những miếng đào ngâm giòn ngọt, hương sả thoang thoảng và vị cam tươi.', '1767641101880.png', NULL),
(33, 'Coca-Cola', 'Giải nhiệt tức thì với hương vị ga sảng khoái đặc trưng. Phục vụ kèm đá lạnh giúp cân bằng vị giác hoàn hảo, giảm ngấy cực đã khi dùng chung với gà rán và burger.', '1767641136935.jpg', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhomsanpham`
--

DROP TABLE IF EXISTS `nhomsanpham`;
CREATE TABLE IF NOT EXISTS `nhomsanpham` (
  `MaNhom` int NOT NULL AUTO_INCREMENT,
  `TenNhom` varchar(100) NOT NULL,
  `HinhAnhNhom` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`MaNhom`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `nhomsanpham`
--

INSERT INTO `nhomsanpham` (`MaNhom`, `TenNhom`, `HinhAnhNhom`) VALUES
(1, 'Combo', 'combo_icon.jpg'),
(2, 'Gà Rán', 'garan_icon.jpg'),
(3, 'Burger', 'burger_icon.jpg'),
(4, 'Nước Uống', 'nuoc_icon.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE IF NOT EXISTS `sanpham` (
  `MaSanPham` int NOT NULL AUTO_INCREMENT,
  `MaNhom` int NOT NULL,
  `GiaNiemYet` decimal(15,2) NOT NULL DEFAULT '0.00',
  `LoaiSanPham` varchar(50) DEFAULT 'MonAn',
  PRIMARY KEY (`MaSanPham`),
  KEY `MaNhom` (`MaNhom`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`MaSanPham`, `MaNhom`, `GiaNiemYet`, `LoaiSanPham`) VALUES
(1, 1, 89000.00, 'MonAn'),
(7, 1, 25000.00, 'MonAn'),
(8, 1, 44.00, 'MonAn'),
(9, 1, 33.00, 'MonAn'),
(16, 1, 90000.00, 'MonAn'),
(21, 3, 123233.00, 'MonAn'),
(22, 1, 25000.00, 'MonAn'),
(24, 1, 249000.00, 'MonAn'),
(25, 1, 139000.00, 'MonAn'),
(26, 2, 39000.00, 'MonAn'),
(27, 2, 38000.00, 'MonAn'),
(28, 2, 35000.00, 'MonAn'),
(29, 3, 75000.00, 'MonAn'),
(30, 3, 55000.00, 'MonAn'),
(31, 3, 49000.00, 'MonAn'),
(32, 4, 29000.00, 'MonAn'),
(33, 4, 15000.00, 'MonAn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham_chinhanh`
--

DROP TABLE IF EXISTS `sanpham_chinhanh`;
CREATE TABLE IF NOT EXISTS `sanpham_chinhanh` (
  `MaSanPham` int NOT NULL,
  `MaChiNhanh` int NOT NULL,
  `TrangThai` varchar(20) DEFAULT 'DangKinhDoanh',
  PRIMARY KEY (`MaSanPham`,`MaChiNhanh`),
  KEY `MaChiNhanh` (`MaChiNhanh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham_chinhanh`
--

INSERT INTO `sanpham_chinhanh` (`MaSanPham`, `MaChiNhanh`, `TrangThai`) VALUES
(1, 1, 'DangKinhDoanh'),
(1, 2, 'DangKinhDoanh'),
(1, 3, 'DangKinhDoanh');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan`
--

DROP TABLE IF EXISTS `taikhoan`;
CREATE TABLE IF NOT EXISTS `taikhoan` (
  `MaTaiKhoan` int NOT NULL AUTO_INCREMENT,
  `HoTen` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `MaChiNhanh` int DEFAULT NULL,
  PRIMARY KEY (`MaTaiKhoan`),
  UNIQUE KEY `Email` (`Email`),
  KEY `MaChiNhanh` (`MaChiNhanh`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan`
--

INSERT INTO `taikhoan` (`MaTaiKhoan`, `HoTen`, `Email`, `MatKhau`, `SoDienThoai`, `MaChiNhanh`) VALUES
(1, 'Quản Trị Viên', 'admin@gmail.com', '$2b$10$Q7BirWq.kJ.ZAPjnVGn8h.1ZrNBk.qm4HVWupiKyS5/qqFBD9rWru', '0909000001', NULL),
(2, 'Nguyễn Quản Lý', 'quanly@gmail.com', '$2b$10$saG3e2udT5l5e2Hi6PpOCuW.cGmdSn8oXUmis4lG8mE56XQkOHN6S', '0909000002', 1),
(3, 'Trần Khách Hàng', 'khach@gmail.com', '$2y$10$wS2.1.2.3.4.5.6.7.8.9.0.a.b.c.d.e.f.g.h.i.j.k.l.m', '0909000003', NULL),
(4, 'Nguyễn Công Danh', 'nky3766@gmail.com', '$2b$10$DkoFETPJus1T46FqT7ygHe6Dho6cFF5uQ75ksNXgnK0cYE80CH4km', '03370440934', NULL),
(5, 'test', 'test@gmail.com', '$2b$10$Q7BirWq.kJ.ZAPjnVGn8h.1ZrNBk.qm4HVWupiKyS5/qqFBD9rWru', '0123456', NULL),
(6, 'hòn', 'hon@gmail.com', '$2b$10$Xs.uD7dqSH8vKneKVOOE/eAZL106pO.iVU8n4HIEZyIrDAuCHjeUC', '0258', NULL),
(8, 'aa', 'aa@gmail.com', '$2b$10$8J2uSixHXQh8zg37S.Ffcu5J.MIE8mal4LZRznt/yf4s6WT46ot.i', '456', NULL),
(10, 'eee', 'eee@gmail.com', '$2b$10$pEWiSZdIbY1UTrCzgQ6.z.2Cvpn7dh1WNpAfjcNyKIZlh.0qGMhKq', '121212', NULL),
(11, 'Khách Hàng VIP', 'khachmoi@gmail.com', '$2b$10$CEynzvL0uB.mhgnnD4iOPOZYcfFM5g/D5dRFV88WkTb6lk2FCECZK', '0909999999', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `taikhoan_vaitro`
--

DROP TABLE IF EXISTS `taikhoan_vaitro`;
CREATE TABLE IF NOT EXISTS `taikhoan_vaitro` (
  `MaTaiKhoan` int NOT NULL,
  `MaVaiTro` int NOT NULL,
  PRIMARY KEY (`MaTaiKhoan`,`MaVaiTro`),
  KEY `MaVaiTro` (`MaVaiTro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `taikhoan_vaitro`
--

INSERT INTO `taikhoan_vaitro` (`MaTaiKhoan`, `MaVaiTro`) VALUES
(1, 1),
(2, 2),
(10, 3),
(3, 4),
(4, 4),
(5, 4),
(6, 4),
(8, 4),
(11, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vaitro`
--

DROP TABLE IF EXISTS `vaitro`;
CREATE TABLE IF NOT EXISTS `vaitro` (
  `MaVaiTro` int NOT NULL AUTO_INCREMENT,
  `TenVaiTro` varchar(50) NOT NULL,
  PRIMARY KEY (`MaVaiTro`),
  UNIQUE KEY `TenVaiTro` (`TenVaiTro`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `vaitro`
--

INSERT INTO `vaitro` (`MaVaiTro`, `TenVaiTro`) VALUES
(1, 'Admin'),
(4, 'KhachHang'),
(3, 'NhanVien'),
(2, 'QuanLy');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietdonhang`
--
ALTER TABLE `chitietdonhang`
  ADD CONSTRAINT `chitietdonhang_ibfk_1` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitietdonhang_ibfk_2` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`);

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`MaKhachHang`) REFERENCES `taikhoan` (`MaTaiKhoan`),
  ADD CONSTRAINT `donhang_ibfk_2` FOREIGN KEY (`MaChiNhanh`) REFERENCES `chinhanh` (`MaChiNhanh`),
  ADD CONSTRAINT `donhang_ibfk_3` FOREIGN KEY (`MaDonViVC`) REFERENCES `donvivanchuyen` (`MaDonViVC`);

--
-- Các ràng buộc cho bảng `monan`
--
ALTER TABLE `monan`
  ADD CONSTRAINT `monan_ibfk_1` FOREIGN KEY (`MaMonAn`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MaNhom`) REFERENCES `nhomsanpham` (`MaNhom`);

--
-- Các ràng buộc cho bảng `sanpham_chinhanh`
--
ALTER TABLE `sanpham_chinhanh`
  ADD CONSTRAINT `sanpham_chinhanh_ibfk_1` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE,
  ADD CONSTRAINT `sanpham_chinhanh_ibfk_2` FOREIGN KEY (`MaChiNhanh`) REFERENCES `chinhanh` (`MaChiNhanh`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD CONSTRAINT `taikhoan_ibfk_1` FOREIGN KEY (`MaChiNhanh`) REFERENCES `chinhanh` (`MaChiNhanh`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `taikhoan_vaitro`
--
ALTER TABLE `taikhoan_vaitro`
  ADD CONSTRAINT `taikhoan_vaitro_ibfk_1` FOREIGN KEY (`MaTaiKhoan`) REFERENCES `taikhoan` (`MaTaiKhoan`) ON DELETE CASCADE,
  ADD CONSTRAINT `taikhoan_vaitro_ibfk_2` FOREIGN KEY (`MaVaiTro`) REFERENCES `vaitro` (`MaVaiTro`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
