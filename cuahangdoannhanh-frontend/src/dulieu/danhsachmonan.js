// src/dulieu/danhsachmonan.js

// 1. IMPORT HÌNH ẢNH TỪ THƯ MỤC 'anh'
// (Lưu ý: Tên file 'combo.jpg' phải khớp đúng với tên file bạn đã lưu trong thư mục src/anh)
import hinhCombo from '../anh/combo.jpg'; 
import hinhBurger from '../anh/burger.jpg';
import hinhGaRan from '../anh/garan.jpg';
import hinhKhoaiTay from '../anh/khoaitay.jpg';
import hinhCoca from '../anh/coca.jpg';
// import hinhBurgerTom from '../anh/burgertom.jpg'; (Nếu có)

const danhSachMon = [
    {
      id: 1,
      ten: "Combo Gà Rán Vui Vẻ",
      gia: 89000,
      phanloai: "Combo",
      // 2. DÙNG BIẾN ĐÃ IMPORT (Không để trong ngoặc kép "")
      anh: hinhCombo, 
    },
    {
      id: 2,
      ten: "Burger Bò Phô Mai",
      gia: 45000,
      phanloai: "Burger",
      anh: hinhBurger,
    },
    {
      id: 3,
      ten: "Gà Rán Giòn Cay",
      gia: 32000,
      phanloai: "Gà Rán",
      anh: hinhGaRan,
    },
    {
      id: 4,
      ten: "Khoai Tây Chiên",
      gia: 25000,
      phanloai: "Ăn Kèm",
      anh: hinhKhoaiTay,
    },
    {
      id: 5,
      ten: "Coca Cola Tươi",
      gia: 15000,
      phanloai: "Nước Uống",
      anh: hinhCoca,
    },
    // ... các món khác
];

export default danhSachMon;