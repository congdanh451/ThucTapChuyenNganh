const express = require("express");
const router = express.Router();
const pool = require("../db");

// 1. TẠO ĐƠN HÀNG MỚI
router.post("/", async (req, res) => {
    const conn = await pool.getConnection();
    try {
        const { 
            maKhachHang, tongTien, gioHang, hinhThucThanhToan,
            infoNguoiDat, infoNguoiNhan, 
            phiShip 
        } = req.body;

        await conn.beginTransaction();

        const MAC_DINH_CHI_NHANH = 1;
        const MAC_DINH_DVVC = 1; 
        const phuongThuc = hinhThucThanhToan || 'TienMat';

        // Câu lệnh INSERT dữ liệu
        const sqlDonHang = `
            INSERT INTO donhang 
            (MaKhachHang, MaChiNhanh, MaDonViVC, 
             TenNguoiDat, SDT_NguoiDat, DiaChi_NguoiDat,
             TenNguoiNhan, SDT, DiaChi, 
             TongTien, PhiShip, TrangThai, NgayDat, HinhThucThanhToan) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ChoXacNhan', NOW(), ?)
        `;
        
        // --- SỬA LỖI Ở DÒNG DƯỚI ĐÂY (Thêm const [result] =) ---
        const [result] = await conn.query(sqlDonHang, [
            maKhachHang || null, MAC_DINH_CHI_NHANH, MAC_DINH_DVVC,
            infoNguoiDat.hoTen, infoNguoiDat.sdt, infoNguoiDat.diaChi,
            infoNguoiNhan.hoTen, infoNguoiNhan.sdt, infoNguoiNhan.diaChi,
            tongTien, 
            phiShip || 0,
            phuongThuc
        ]);
        
        const maDonHang = result.insertId; // Giờ biến result đã tồn tại, dòng này sẽ chạy ngon lành

        // Thêm chi tiết đơn hàng
        const sqlChiTiet = `INSERT INTO chitietdonhang (MaDonHang, MaSanPham, SoLuong) VALUES (?, ?, ?)`;
        for (const item of gioHang) {
            await conn.query(sqlChiTiet, [maDonHang, item.id, item.soLuong]);
        }

        await conn.commit();
        res.json({ status: "success", message: "Đặt hàng thành công!", maDonHang });

    } catch (err) {
        await conn.rollback();
        console.error("Lỗi đặt hàng:", err);
        res.status(500).json({ message: "Lỗi Server: " + err.message });
    } finally {
        conn.release();
    }
});

// 2. LẤY DANH SÁCH ĐƠN HÀNG (Admin)
router.get("/", async (req, res) => {
    try {
        const sql = `SELECT * FROM donhang ORDER BY NgayDat DESC`;
        const [rows] = await pool.query(sql);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy danh sách đơn" });
    }
});

// 3. LẤY CHI TIẾT MÓN TRONG ĐƠN
router.get("/:id/details", async (req, res) => {
    try {
        const maDonHang = req.params.id;
        const sql = `
            SELECT c.*, m.TenMonAn, m.HinhAnhURL, s.GiaNiemYet as DonGia
            FROM chitietdonhang c
            JOIN sanpham s ON c.MaSanPham = s.MaSanPham
            JOIN monan m ON s.MaSanPham = m.MaMonAn
            WHERE c.MaDonHang = ?
        `;
        const [rows] = await pool.query(sql, [maDonHang]);
        
        const details = rows.map(item => ({
            ...item,
            anh: item.HinhAnhURL ? (item.HinhAnhURL.startsWith('http') ? item.HinhAnhURL : `http://localhost:5000/uploads/${item.HinhAnhURL}`) : ''
        }));

        res.json(details);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy chi tiết đơn" });
    }
});

// 4. CẬP NHẬT TRẠNG THÁI
router.put("/:id/status", async (req, res) => {
    try {
        const maDonHang = req.params.id;
        const { trangThai } = req.body; 
        await pool.query("UPDATE donhang SET TrangThai = ? WHERE MaDonHang = ?", [trangThai, maDonHang]);
        res.json({ status: "success", message: "Cập nhật trạng thái thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi cập nhật trạng thái" });
    }
});

// 5. LẤY LỊCH SỬ ĐƠN CỦA KHÁCH HÀNG
router.get("/user/:id", async (req, res) => {
    try {
        const maKhachHang = req.params.id;
        const sql = "SELECT * FROM donhang WHERE MaKhachHang = ? ORDER BY NgayDat DESC";
        const [rows] = await pool.query(sql, [maKhachHang]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy lịch sử đơn" });
    }
});

module.exports = router;