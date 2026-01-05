import React, { useState, useEffect } from 'react';
import './QuanLySanPham.css'; // Dùng chung CSS

const QuanLyChiNhanh = () => {
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    // Lấy thông tin user
    const currentUser = JSON.parse(localStorage.getItem('userFastFood'));

    // Form State
    const [id, setId] = useState(null);
    const [ten, setTen] = useState('');
    const [diachi, setDiachi] = useState('');
    const [sdt, setSdt] = useState('');

    useEffect(() => { fetchBranches(); }, []);

    const fetchBranches = () => {
        fetch('http://localhost:5000/api/branches')
            .then(res => res.json())
            .then(data => setBranches(data))
            .catch(err => console.error(err));
    };

    const handleAdd = () => {
        setIsEdit(false);
        setTen(''); setDiachi(''); setSdt('');
        setShowModal(true);
    };

    const handleEdit = (cn) => {
        setIsEdit(true);
        setId(cn.id);
        setTen(cn.ten);
        setDiachi(cn.diachi);
        setSdt(cn.sdt);
        setShowModal(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const url = isEdit ? `http://localhost:5000/api/branches/${id}` : 'http://localhost:5000/api/branches';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ten, diachi, sdt })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.status === 'success') {
                setShowModal(false);
                fetchBranches();
            }
        });
    };

    const handleDelete = (id) => {
        if(window.confirm("Xóa chi nhánh này?")) {
            fetch(`http://localhost:5000/api/branches/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if(data.status === 'success') fetchBranches();
            });
        }
    };

    return (
        <div className="admin-page-container">
            <div className="page-header">
                <h2 className="page-title">Quản Lý Chi Nhánh</h2>
                {/* PHÂN QUYỀN: Chỉ Admin (Role 1) mới thấy nút Thêm */}
                {currentUser && currentUser.MaVaiTro === 1 && (
                    <button className="btn-add-new" onClick={handleAdd}>+ Thêm Chi Nhánh</button>
                )}
            </div>

            <div className="admin-card">
                <table className="modern-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên Chi Nhánh</th>
                            <th>Địa Chỉ</th>
                            <th>Hotline</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map(b => (
                            <tr key={b.id}>
                                <td>#{b.id}</td>
                                <td style={{fontWeight:'bold'}}>{b.ten}</td>
                                <td>{b.diachi}</td>
                                <td>{b.sdt}</td>
                                <td>
                                    {/* Quản lý được sửa địa chỉ/sđt */}
                                    <button className="btn-icon edit" onClick={() => handleEdit(b)}>✏️</button>
                                    
                                    {/* PHÂN QUYỀN: Chỉ Admin (Role 1) mới được Xóa */}
                                    {currentUser && currentUser.MaVaiTro === 1 && (
                                        <button className="btn-icon delete" onClick={() => handleDelete(b.id)}>🗑️</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{isEdit ? 'Cập Nhật Chi Nhánh' : 'Thêm Chi Nhánh Mới'}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Tên Chi Nhánh</label>
                                <input className="form-input" value={ten} onChange={e=>setTen(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Địa Chỉ</label>
                                <input className="form-input" value={diachi} onChange={e=>setDiachi(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Số Điện Thoại</label>
                                <input className="form-input" value={sdt} onChange={e=>setSdt(e.target.value)} required />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn-save">Lưu lại</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyChiNhanh;