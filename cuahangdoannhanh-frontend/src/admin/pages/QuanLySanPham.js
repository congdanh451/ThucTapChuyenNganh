import React, { useState, useEffect } from 'react';
import './QuanLySanPham.css'; 

// Danh sách nhóm món
const CATEGORIES = [
    { id: 1, name: "Combo" },
    { id: 2, name: "Gà Rán" },
    { id: 3, name: "Burger" },
    { id: 4, name: "Nước Uống" }
];

const QuanLySanPham = () => {
    const [products, setProducts] = useState([]);
    
    // State form Thêm Mới
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(''); 
    const [categoryId, setCategoryId] = useState(1); 
    const [imageFile, setImageFile] = useState(null);
    const [previewImg, setPreviewImg] = useState(null);

    // State cho Modal Sửa
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState({ 
        id: null, ten: '', gia: '', mota: '', anh: '', anhCu: '', maNhom: 1 
    });
    const [newImageFile, setNewImageFile] = useState(null);
    const [editPreviewImg, setEditPreviewImg] = useState(null);

    // 1. LẤY DANH SÁCH
    const fetchProducts = () => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                if(Array.isArray(data)) setProducts(data);
            }) 
            .catch(err => console.error("Lỗi API:", err));
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleFileChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- 2. THÊM MỚI (ĐÃ SỬA: CHECK GIÁ DƯƠNG) ---
    const handleAdd = (e) => {
        e.preventDefault();

        // 🛑 KIỂM TRA GIÁ TRỊ HỢP LỆ
        if (parseFloat(price) <= 0) {
            alert("⚠️ Vui lòng nhập giá lớn hơn 0!");
            return; // Dừng lại, không gửi lên server
        }

        const formData = new FormData();
        formData.append('ten', name);
        formData.append('gia', price);
        formData.append('mota', description); 
        formData.append('maNhom', categoryId); 
        if (imageFile) formData.append('image', imageFile);

        fetch('http://localhost:5000/api/products', { method: 'POST', body: formData })
        .then(async (res) => {
            const data = await res.json();
            if(data.status === "success") { 
                alert("🎉 Thêm món thành công!");
                fetchProducts(); 
                setName(''); setPrice(''); setDescription(''); setCategoryId(1);
                setImageFile(null); setPreviewImg(null);
                document.getElementById('fileInput').value = "";
            } else {
                alert("Lỗi: " + data.message);
            }
        })
        .catch(err => alert("Lỗi kết nối Server!"));
    };

    const handleEditClick = (p) => {
        const oldImgName = p.anh ? p.anh.split('/').pop() : '';
        setEditingProduct({ ...p, anhCu: oldImgName, maNhom: p.maNhom || 1 });
        setNewImageFile(null);
        setEditPreviewImg(p.anh);
        setIsEditModalOpen(true);
    }
    
    // --- 3. CẬP NHẬT (ĐÃ SỬA: CHECK GIÁ DƯƠNG) ---
    const handleUpdate = async (e) => {
        e.preventDefault();

        // 🛑 KIỂM TRA GIÁ TRỊ HỢP LỆ
        if (parseFloat(editingProduct.gia) <= 0) {
            alert("⚠️ Giá sản phẩm phải là số dương!");
            return;
        }

        const formData = new FormData();
        formData.append('ten', editingProduct.ten);
        formData.append('gia', editingProduct.gia);
        formData.append('mota', editingProduct.mota); 
        formData.append('maNhom', editingProduct.maNhom); 
        formData.append('anhCu', editingProduct.anhCu); 
        if (newImageFile) formData.append('image', newImageFile);
        
        try {
            const res = await fetch(`http://localhost:5000/api/products/${editingProduct.id}`, { method: 'PUT', body: formData });
            const data = await res.json();
            if(data.status === "success") {
                alert("Đã cập nhật xong!");
                fetchProducts(); 
                setIsEditModalOpen(false);
            } else {
                alert("Lỗi cập nhật: " + data.message);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleDelete = (id) => {
        if(window.confirm("Bạn chắc chắn muốn xóa món này chứ?")) {
            fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' })
            .then(() => fetchProducts())
            .catch(err => alert("Lỗi xóa!"));
        }
    }

    return (
        <div className="admin-page-container">
            <h2 className="page-title">Quản Lý Thực Đơn</h2>
            
            {/* CARD 1: FORM THÊM MỚI */}
            <div className="admin-card">
                <div className="card-header">
                    <h3>+ Thêm Món Ăn Mới</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleAdd}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tên món</label>
                                <input type="text" placeholder="VD: Gà rán giòn..." required value={name} onChange={e => setName(e.target.value)} className="form-input" />
                            </div>
                            
                            <div className="form-group">
                                <label>Giá bán (VNĐ)</label>
                                {/* Thêm min="0" để gợi ý trình duyệt */}
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    min="1000" 
                                    required 
                                    value={price} 
                                    onChange={e => setPrice(e.target.value)} 
                                    className="form-input" 
                                />
                            </div>

                            <div className="form-group">
                                <label>Phân Loại (Nhóm)</label>
                                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="form-input">
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Hình ảnh</label>
                                <div className="mini-upload-control">
                                    <label htmlFor="fileInput" className="mini-upload-btn">📂 Chọn ảnh</label>
                                    <input id="fileInput" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImageFile, setPreviewImg)} hidden />
                                    {previewImg && <img src={previewImg} alt="Preview" className="mini-preview" />}
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Mô tả chi tiết</label>
                                <textarea placeholder="Thành phần, hương vị..." value={description} onChange={e => setDescription(e.target.value)} className="form-textarea" rows="2" />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-submit">Lưu Món Mới</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* CARD 2: DANH SÁCH MÓN */}
            <div className="admin-card">
                <div className="card-header">
                    <h3>Danh Sách Món Ăn ({products.length})</h3>
                </div>
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th width="50">ID</th>
                                <th width="80">Ảnh</th>
                                <th>Tên món</th>
                                <th>Phân Loại</th>
                                <th>Giá bán</th>
                                <th>Mô tả</th> 
                                <th width="120">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">Chưa có món ăn nào.</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>
                                        <div className="img-wrapper">
                                            {p.anh ? 
                                                <img src={p.anh} alt={p.ten} onError={(e)=>{e.target.src='https://placehold.co/50x50?text=No+Img'}} /> 
                                                : <span className="no-img">No</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="fw-bold">{p.ten}</td>
                                    <td>
                                        <span className={`badge badge-${p.maNhom}`}>
                                            {p.tenNhom || "Khác"}
                                        </span>
                                    </td>
                                    <td className="price-text">{p.gia.toLocaleString('vi-VN')} đ</td>
                                    <td className="desc-text" title={p.mota}>{p.mota}</td> 
                                    <td>
                                        <div className="action-buttons">
                                            <button onClick={() => handleEditClick(p)} className="btn-icon btn-edit" title="Sửa">✏️</button>
                                            <button onClick={() => handleDelete(p.id)} className="btn-icon btn-delete" title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL SỬA */}
            {isEditModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content slide-down">
                        <div className="modal-header">
                            <h3>Cập nhật món #{editingProduct.id}</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="btn-close">×</button>
                        </div>
                        <form onSubmit={handleUpdate} className="modal-body">
                            <label>Tên món</label>
                            <input type="text" value={editingProduct.ten} onChange={e => setEditingProduct({...editingProduct, ten: e.target.value})} className="form-input mb-3"/>

                            <div className="row-2-col">
                                <div>
                                    <label>Giá bán</label>
                                    <input 
                                        type="number" 
                                        min="1000"
                                        value={editingProduct.gia} 
                                        onChange={e => setEditingProduct({...editingProduct, gia: e.target.value})} 
                                        className="form-input mb-3"
                                    />
                                </div>
                                <div>
                                    <label>Phân Loại</label>
                                    <select value={editingProduct.maNhom} onChange={e => setEditingProduct({...editingProduct, maNhom: e.target.value})} className="form-input mb-3">
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <label>Mô tả</label>
                            <textarea value={editingProduct.mota} onChange={e => setEditingProduct({...editingProduct, mota: e.target.value})} className="form-textarea mb-3" rows="3"/>

                            <label>Ảnh sản phẩm</label>
                            <div className="mini-upload-control mb-3">
                                <label htmlFor="editFileInput" className="mini-upload-btn">📂 Đổi ảnh</label>
                                <input id="editFileInput" type="file" accept="image/*" onChange={(e) => handleFileChange(e, setNewImageFile, setEditPreviewImg)} hidden />
                                {editPreviewImg && <img src={editPreviewImg} alt="Edit Preview" className="mini-preview" />}
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-cancel">Hủy</button>
                                <button type="submit" className="btn-submit">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLySanPham;