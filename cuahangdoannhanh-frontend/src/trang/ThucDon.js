import React, { useState, useEffect } from 'react';
import './ThucDon.css'; 

// Danh sách danh mục (Khớp với Database)
const CATEGORIES = [
    { id: 'all', name: "Tất cả" },
    { id: 1, name: "Combo" },
    { id: 2, name: "Gà Rán" },
    { id: 3, name: "Burger" },
    { id: 4, name: "Nước Uống" }
];

const ThucDon = ({ themVaoGio }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sau khi lọc
    
    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    // 1. Lấy dữ liệu từ API
    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data); // Ban đầu hiển thị hết
            })
            .catch(err => console.error(err));
    }, []);

    // 2. Hàm xử lý Lọc (Chạy mỗi khi searchTerm hoặc activeCategory thay đổi)
    useEffect(() => {
        let result = products;

        // Lọc theo Nhóm
        if (activeCategory !== 'all') {
            // Lưu ý: maNhom trong DB là số, activeCategory cũng phải ép kiểu cho khớp nếu cần
            result = result.filter(p => p.maNhom === parseInt(activeCategory));
        }

        // Lọc theo Từ khóa tìm kiếm
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(p => p.ten.toLowerCase().includes(lowerTerm));
        }

        setFilteredProducts(result);
    }, [searchTerm, activeCategory, products]);

    return (
        <div className="menu-page-container">
            <h2 className="menu-title">Thực Đơn Hấp Dẫn</h2>

            {/* --- THANH TÌM KIẾM & BỘ LỌC --- */}
            <div className="filter-bar">
                {/* Ô Tìm kiếm */}
                <div className="search-wrapper">
                    <input 
                        type="text" 
                        placeholder="🔍 Bạn muốn tìm món gì?..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {/* Các nút danh mục */}
                <div className="category-list">
                    {CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveCategory(cat.id)}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- DANH SÁCH MÓN ĂN --- */}
            <div className="product-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((mon) => (
                        <div key={mon.id} className="product-card">
                            <div className="product-img-box">
                                <img 
                                    src={mon.anh} 
                                    alt={mon.ten} 
                                    onError={(e)=>{e.target.src='https://placehold.co/300x200?text=Mon+An'}} 
                                />
                            </div>
                            <div className="product-info">
                                <h3>{mon.ten}</h3>
                                <p className="desc">{mon.mota}</p>
                                <div className="price-row">
                                    <span className="price">{mon.gia.toLocaleString()} đ</span>
                                    <button className="add-btn" onClick={() => themVaoGio(mon)}>
                                        + Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-result">
                        <p>😔 Không tìm thấy món ăn nào phù hợp!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThucDon;