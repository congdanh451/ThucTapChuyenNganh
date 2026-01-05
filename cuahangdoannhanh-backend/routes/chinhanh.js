const express = require('express');
const router = express.Router();
const pool = require('../db');

// 1. LẤY DANH SÁCH CHI NHÁNH (Cho cả Admin và User)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM chinhanh");
        
        // Map lại tên trường cho thống nhất với Frontend (id, ten, diachi...)
        const data = rows.map(row => ({
            id: row.MaChiNhanh,
            ten: row.TenChiNhanh,
            diachi: row.DiaChi,
            sdt: row.SoDienThoai
        }));
        
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// 2. THÊM CHI NHÁNH MỚI
router.post('/', async (req, res) => {
    const { ten, diachi, sdt } = req.body;
    try {
        await pool.query("INSERT INTO chinhanh (TenChiNhanh, DiaChi, SoDienThoai) VALUES (?, ?, ?)", [ten, diachi, sdt]);
        res.json({ status: 'success', message: "Thêm chi nhánh thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi thêm chi nhánh" });
    }
});

// 3. SỬA CHI NHÁNH (Chức năng bạn cần)
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { ten, diachi, sdt } = req.body;
    try {
        await pool.query(
            "UPDATE chinhanh SET TenChiNhanh = ?, DiaChi = ?, SoDienThoai = ? WHERE MaChiNhanh = ?", 
            [ten, diachi, sdt, id]
        );
        res.json({ status: 'success', message: "Cập nhật thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi cập nhật chi nhánh" });
    }
});

// 4. XÓA CHI NHÁNH
router.delete('/:id', async (req, res) => {
    try {
        await pool.query("DELETE FROM chinhanh WHERE MaChiNhanh = ?", [req.params.id]);
        res.json({ status: 'success', message: "Đã xóa chi nhánh!" });
    } catch (err) {
        // Lỗi do ràng buộc khóa ngoại (đã có đơn hàng thuộc chi nhánh này)
        if (err.errno === 1451) {
            res.status(400).json({ message: "Không thể xóa: Đang có đơn hàng thuộc chi nhánh này!" });
        } else {
            res.status(500).json({ message: "Lỗi xóa chi nhánh" });
        }
    }
});

module.exports = router;