const express = require('express');
const router = express.Router();
const pool = require('../db');

// API lấy số liệu thống kê tổng quát
router.get('/stats', async (req, res) => {
    try {
        // 1. DOANH THU THỰC TẾ HÔM NAY (Trừ tiền Ship ra)
        // Logic: Tổng tiền thu được - Phí ship. 
        // Dùng COALESCE(PhiShip, 0) để nếu đơn cũ chưa có phí ship thì tính là 0.
        const [revRows] = await pool.query(
            "SELECT SUM(TongTien - COALESCE(PhiShip, 0)) as total FROM donhang WHERE DATE(NgayDat) = CURDATE() AND TrangThai != 'Huy'"
        );
        const revenueToday = revRows[0].total || 0;

        // 2. Số đơn hàng hôm nay
        const [ordRows] = await pool.query(
            "SELECT COUNT(*) as count FROM donhang WHERE DATE(NgayDat) = CURDATE()"
        );
        const ordersToday = ordRows[0].count || 0;

        // 3. Tổng số khách hàng (Role = 4)
        const [custRows] = await pool.query(
            "SELECT COUNT(*) as count FROM taikhoan_vaitro WHERE MaVaiTro = 4"
        );
        const totalCustomers = custRows[0].count || 0;

        // 4. Tổng số món ăn đang kinh doanh
        const [prodRows] = await pool.query("SELECT COUNT(*) as count FROM sanpham");
        const totalProducts = prodRows[0].count || 0;

        res.json({
            revenue: revenueToday,
            orders: ordersToday,
            customers: totalCustomers,
            products: totalProducts
        });
    } catch (err) {
        console.error("Lỗi thống kê:", err);
        res.status(500).json({ message: "Lỗi Server" });
    }
});

// API lấy 5 đơn hàng mới nhất (Cập nhật hiển thị tên người đặt cho đúng)
router.get('/recent-orders', async (req, res) => {
    try {
        // Ưu tiên lấy TenNguoiDat, nếu không có (đơn cũ) thì lấy HoTen từ bảng taikhoan
        const sql = `
            SELECT d.MaDonHang, 
                   COALESCE(d.TenNguoiDat, t.HoTen, d.TenNguoiNhan) as NguoiDat, 
                   d.TongTien, 
                   d.TrangThai, 
                   d.NgayDat
            FROM donhang d
            LEFT JOIN taikhoan t ON d.MaKhachHang = t.MaTaiKhoan
            ORDER BY d.NgayDat DESC
            LIMIT 5
        `;
        const [rows] = await pool.query(sql);
        
        // Format lại dữ liệu trả về
        const formattedRows = rows.map(order => ({
            ...order,
            HoTen: order.NguoiDat // Gán vào biến HoTen để Frontend hiển thị
        }));

        res.json(formattedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy đơn mới" });
    }
});

module.exports = router;