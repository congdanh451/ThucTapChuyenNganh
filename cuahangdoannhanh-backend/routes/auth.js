const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db'); 

// --- 1. ĐĂNG KÝ ---
router.post('/register', async (req, res) => {
    const { hoTen, email, password, sdt } = req.body;
    try {
        const [check] = await db.query("SELECT * FROM TaiKhoan WHERE Email = ?", [email]);
        if (check.length > 0) return res.json({ status: 'error', message: "Email đã tồn tại!" });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const sqlInsert = "INSERT INTO TaiKhoan (HoTen, Email, MatKhau, SoDienThoai) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sqlInsert, [hoTen, email, hash, sdt]);
        
        // Mặc định vai trò là Khách hàng (4)
        await db.query("INSERT INTO TaiKhoan_VaiTro (MaTaiKhoan, MaVaiTro) VALUES (?, 4)", [result.insertId]);

        res.json({ status: 'success', message: "Đăng ký thành công!" });
    } catch (err) {
        console.error("Lỗi đăng ký:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
});

// --- 2. ĐĂNG NHẬP ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const sql = `
            SELECT t.*, v.TenVaiTro, tv.MaVaiTro 
            FROM TaiKhoan t
            JOIN TaiKhoan_VaiTro tv ON t.MaTaiKhoan = tv.MaTaiKhoan
            JOIN VaiTro v ON tv.MaVaiTro = v.MaVaiTro
            WHERE t.Email = ?
        `;
        const [users] = await db.query(sql, [email]);
        if (users.length === 0) return res.json({ status: 'error', message: "Email không tồn tại!" });

        const user = users[0];
        const checkPass = bcrypt.compareSync(password, user.MatKhau);
        if (!checkPass) return res.json({ status: 'error', message: "Mật khẩu không đúng!" });

        const { MatKhau, ...userInfo } = user;
        res.json({ status: 'success', message: "Đăng nhập thành công", user: userInfo });
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
});

// --- 3. CẬP NHẬT THÔNG TIN (MỚI) ---
// API này nhận ID từ URL và cập nhật tên, sđt, mật khẩu (nếu có)
router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    const { hoTen, sdt, matKhauMoi } = req.body;

    try {
        // 1. Cập nhật tên và sdt
        await db.query("UPDATE TaiKhoan SET HoTen = ?, SoDienThoai = ? WHERE MaTaiKhoan = ?", [hoTen, sdt, id]);

        // 2. Nếu có mật khẩu mới thì mã hóa và cập nhật
        if (matKhauMoi) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(matKhauMoi, salt);
            await db.query("UPDATE TaiKhoan SET MatKhau = ? WHERE MaTaiKhoan = ?", [hash, id]);
        }

        // 3. Lấy lại thông tin mới nhất từ DB để trả về cho Frontend cập nhật State
        const sqlGet = `
            SELECT t.*, v.TenVaiTro, tv.MaVaiTro 
            FROM TaiKhoan t
            JOIN TaiKhoan_VaiTro tv ON t.MaTaiKhoan = tv.MaTaiKhoan
            JOIN VaiTro v ON tv.MaVaiTro = v.MaVaiTro
            WHERE t.MaTaiKhoan = ?
        `;
        const [rows] = await db.query(sqlGet, [id]);
        
        if(rows.length > 0) {
            const { MatKhau, ...userInfo } = rows[0];
            res.json({ status: 'success', message: "Cập nhật thành công!", user: userInfo });
        } else {
            res.status(404).json({ message: "Không tìm thấy user" });
        }

    } catch (err) {
        console.error("Lỗi update:", err);
        res.status(500).json({ message: "Lỗi Server: " + err.message });
    }
});

module.exports = router;