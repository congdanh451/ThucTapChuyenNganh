const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// 1. LẤY DANH SÁCH TÀI KHOẢN
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT t.MaTaiKhoan, t.HoTen, t.Email, t.SoDienThoai, v.TenVaiTro, tv.MaVaiTro 
            FROM TaiKhoan t
            LEFT JOIN TaiKhoan_VaiTro tv ON t.MaTaiKhoan = tv.MaTaiKhoan
            LEFT JOIN VaiTro v ON tv.MaVaiTro = v.MaVaiTro
            ORDER BY t.MaTaiKhoan DESC
        `;
        const [rows] = await db.query(sql);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// 2. TẠO TÀI KHOẢN MỚI
router.post('/', async (req, res) => {
    const { hoTen, email, password, sdt, maVaiTro } = req.body;
    try {
        const [check] = await db.query("SELECT * FROM TaiKhoan WHERE Email = ?", [email]);
        if (check.length > 0) return res.json({ status: 'error', message: "Email đã tồn tại!" });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const [resTK] = await db.query(
            "INSERT INTO TaiKhoan (HoTen, Email, MatKhau, SoDienThoai) VALUES (?, ?, ?, ?)", 
            [hoTen, email, hash, sdt]
        );
        
        await db.query("INSERT INTO TaiKhoan_VaiTro VALUES (?, ?)", [resTK.insertId, maVaiTro]);

        res.json({ status: 'success', message: "Tạo tài khoản thành công!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

// 3. SỬA TÀI KHOẢN (MỚI THÊM)
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { hoTen, sdt, maVaiTro, password } = req.body; 
    // Lưu ý: Không cho sửa Email để tránh lỗi định danh

    try {
        // Cập nhật thông tin cơ bản
        await db.query("UPDATE TaiKhoan SET HoTen = ?, SoDienThoai = ? WHERE MaTaiKhoan = ?", [hoTen, sdt, id]);

        // Cập nhật Vai trò (Quyền)
        await db.query("UPDATE TaiKhoan_VaiTro SET MaVaiTro = ? WHERE MaTaiKhoan = ?", [maVaiTro, id]);

        // Nếu Admin nhập mật khẩu mới thì mới cập nhật (Reset pass), bỏ trống thì giữ nguyên
        if (password && password.trim() !== "") {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await db.query("UPDATE TaiKhoan SET MatKhau = ? WHERE MaTaiKhoan = ?", [hash, id]);
        }

        res.json({ status: 'success', message: "Cập nhật tài khoản thành công!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi cập nhật tài khoản" });
    }
});

// 4. XÓA TÀI KHOẢN
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await db.query("DELETE FROM TaiKhoan_VaiTro WHERE MaTaiKhoan = ?", [id]);
        await db.query("DELETE FROM TaiKhoan WHERE MaTaiKhoan = ?", [id]);
        res.json({ status: 'success', message: "Đã xóa tài khoản!" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi: Không thể xóa (có thể do ràng buộc dữ liệu đơn hàng)" });
    }
});

module.exports = router;