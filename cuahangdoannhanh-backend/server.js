const dns = require('dns');
try {

    dns.setDefaultResultOrder('ipv4first'); 
} catch (e) {
    console.log("Node.js phiên bản cũ, bỏ qua dns fix.");
}

// --- 2. CHỐNG VĂNG TUYỆT ĐỐI ---
process.on('uncaughtException', (err) => {
    console.error('🔥 LỖI (Nhưng server không tắt):', err.message);
});

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// --- Import DB & Routes ---
const pool = require("./db");
const authRoutes = require("./routes/auth");
const monAnRoutes = require("./routes/monan");
const chiNhanhRoutes = require("./routes/chinhanh");
const donHangRoutes = require("./routes/donhang");
const multer = require("multer");
const dashboardRoutes = require("./routes/dashboard");
// --- Cấu hình Middleware ---
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Cấu hình thư mục ảnh ---
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

// --- Log kiểm tra ---
app.use((req, res, next) => {
    console.log(`👉 [REQUEST]: ${req.method} ${req.url}`);
    next();
});





// --- Routes ---
app.use("/api", authRoutes);
app.use("/api/products", monAnRoutes);
app.use("/api/branches", chiNhanhRoutes);
app.use("/api/orders", donHangRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/accounts", require("./routes/taikhoan"));

// --- Test kết nối khi khởi động ---
const PORT = 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    try {
        // Thử kết nối Database
        await pool.query("SELECT 1"); 
        console.log("✅ Kết nối Database OK (đang dùng localhost)");
    } catch (err) {
        console.error("❌ Lỗi kết nối Database:", err.code);
        console.error("👉 Hãy kiểm tra xem WAMP đã bật chưa?");
    }
});
// --- API LẤY DANH SÁCH ĐƠN VỊ VẬN CHUYỂN ---
app.get('/api/shipping-partners', async (req, res) => {
    try {
        // Lấy dữ liệu từ bảng `donvivanchuyen` (như trong hình bạn gửi)
        const [rows] = await pool.query('SELECT * FROM donvivanchuyen');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi lấy ĐVVC" });
    }
});