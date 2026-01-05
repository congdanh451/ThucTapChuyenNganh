const express = require("express");
const router = express.Router();
const pool = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- CẤU HÌNH UPLOAD ẢNH ---
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// --- HÀM XỬ LÝ LINK ẢNH ---
const getImageUrl = (req, filename) => {
  if (!filename) return "";
  return filename.startsWith("http")
    ? filename
    : `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// --- 1. LẤY DANH SÁCH MÓN ---
router.get("/", async (req, res) => {
  try {
    // Dùng LEFT JOIN để lỡ nhóm bị xóa thì món vẫn hiện ra
    const sql = `
      SELECT s.MaSanPham AS id, m.TenMonAn AS ten, s.GiaNiemYet AS gia,
             m.HinhAnhURL AS anh, m.MoTa AS mota, s.MaNhom AS maNhom,
             n.TenNhom AS tenNhom
      FROM sanpham s
      JOIN monan m ON s.MaSanPham = m.MaMonAn
      LEFT JOIN nhomsanpham n ON s.MaNhom = n.MaNhom 
      ORDER BY s.MaSanPham DESC
    `;
    const [rows] = await pool.query(sql);

    const products = rows.map(item => ({
      id: parseInt(item.id),
      ten: item.ten,
      gia: parseFloat(item.gia),
      mota: item.mota || "",
      maNhom: item.maNhom, // Trả về ID nhóm để Frontend hiển thị đúng badge
      tenNhom: item.tenNhom,
      anh: getImageUrl(req, item.anh)
    }));

    res.json(products);
  } catch (err) {
    console.error("Lỗi lấy danh sách món:", err);
    res.status(500).json({ message: "Lỗi Server" });
  }
});

// --- 2. THÊM MÓN MỚI ---
router.post("/", upload.single("image"), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { ten, gia, mota = "", maNhom = 1 } = req.body; // Mặc định nhóm 1 nếu thiếu
    const imageFilename = req.file ? req.file.filename : "";

    if (!ten || !gia) return res.status(400).json({ message: "Thiếu tên hoặc giá!" });

    await conn.beginTransaction();

    // Thêm vào bảng cha (Sanpham) trước
    const [resSP] = await conn.query(
      "INSERT INTO sanpham (MaNhom, GiaNiemYet, LoaiSanPham) VALUES (?, ?, 'MonAn')",
      [maNhom, gia]
    );

    // Thêm vào bảng con (MonAn)
    await conn.query(
      "INSERT INTO monan (MaMonAn, TenMonAn, HinhAnhURL, MoTa) VALUES (?, ?, ?, ?)",
      [resSP.insertId, ten, imageFilename, mota]
    );

    await conn.commit();

    res.json({
      status: "success",
      message: "Thêm món thành công!",
      product: {
        id: resSP.insertId,
        ten,
        gia,
        mota,
        maNhom,
        anh: getImageUrl(req, imageFilename)
      }
    });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi thêm món:", err);
    res.status(500).json({ message: "Lỗi Server" });
  } finally {
    conn.release();
  }
});

// --- 3. CẬP NHẬT MÓN (ĐÃ SỬA: CẬP NHẬT CẢ MA_NHOM) ---
router.put("/:id", upload.single("image"), async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;
    // Nhận thêm maNhom từ Frontend gửi lên
    const { ten, gia, mota = "", anhCu, maNhom } = req.body;
    const imageFilename = req.file ? req.file.filename : anhCu;

    await conn.beginTransaction();

    // 1. Cập nhật bảng SanPham (Giá và Nhóm)
    // QUAN TRỌNG: Cần update cả MaNhom ở đây
    const sqlSP = "UPDATE sanpham SET GiaNiemYet = ?, MaNhom = ? WHERE MaSanPham = ?";
    await conn.query(sqlSP, [gia, maNhom, id]);

    // 2. Cập nhật bảng MonAn (Tên, Ảnh, Mô tả)
    const sqlMon = "UPDATE monan SET TenMonAn = ?, HinhAnhURL = ?, MoTa = ? WHERE MaMonAn = ?";
    await conn.query(sqlMon, [ten, imageFilename, mota, id]);

    await conn.commit();

    // Xóa ảnh cũ nếu có upload ảnh mới
    if (req.file && anhCu) {
      const oldPath = path.join(uploadDir, anhCu);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    res.json({
      status: "success",
      message: "Cập nhật thành công!",
    });

  } catch (err) {
    await conn.rollback();
    console.error("Lỗi cập nhật món:", err);
    res.status(500).json({ message: "Lỗi Server" });
  } finally {
    conn.release();
  }
});

// --- 4. XÓA MÓN ---
router.delete("/:id", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const id = req.params.id;

    await conn.beginTransaction();

    // Lấy tên ảnh để xóa file
    const [rows] = await conn.query("SELECT HinhAnhURL FROM monan WHERE MaMonAn = ?", [id]);
    const oldImage = rows.length > 0 ? rows[0].HinhAnhURL : null;

    // Xóa bảng con trước
    await conn.query("DELETE FROM monan WHERE MaMonAn = ?", [id]);
    // Xóa bảng cha sau
    await conn.query("DELETE FROM sanpham WHERE MaSanPham = ?", [id]);

    await conn.commit();

    // Xóa file ảnh vật lý
    if (oldImage) {
      const filePath = path.join(uploadDir, oldImage);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ status: "success", message: "Đã xóa món ăn!" });
  } catch (err) {
    await conn.rollback();
    console.error("Lỗi xóa món:", err);
    res.status(500).json({ message: "Lỗi Server khi xóa" });
  } finally {
    conn.release();
  }
});

module.exports = router;