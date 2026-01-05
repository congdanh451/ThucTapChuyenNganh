import React, { useState, useEffect } from 'react';
import './QuanLyTaiKhoan.css';

const QuanLyTaiKhoan = () => {
    // 1. KHAI BÁO HOOKS TRƯỚC (LUÔN LUÔN Ở ĐẦU)
    const [users, setUsers] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [sdt, setSdt] = useState('');
    const [role, setRole] = useState(4); 

    // Lấy thông tin user hiện tại
    const currentUser = JSON.parse(localStorage.getItem('userFastFood'));

    // Hàm lấy danh sách
    const fetchUsers = () => {
        fetch('http://localhost:5000/api/accounts')
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err));
    };

    // useEffect cũng phải gọi ở đây
    useEffect(() => {
        // Chỉ gọi API nếu là Admin
        if (currentUser && currentUser.MaVaiTro === 1) {
            fetchUsers();
        }
    }, []);

    // 2. SAU ĐÓ MỚI ĐẾN ĐOẠN KIỂM TRA QUYỀN VÀ RETURN SỚM
    if (!currentUser || currentUser.MaVaiTro !== 1) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>
                <h2>⛔ Truy cập bị từ chối!</h2>
                <p>Chức năng này chỉ dành cho Admin hệ thống.</p>
            </div>
        );
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN (Handlers) ---

    const handleSave = (e) => {
        e.preventDefault();
        const url = isEdit 
            ? `http://localhost:5000/api/accounts/${editId}` 
            : 'http://localhost:5000/api/accounts';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ hoTen, email, password: pass, sdt, maVaiTro: role })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.status === 'success') {
                fetchUsers();
                resetForm();
            }
        });
    };

    const handleEdit = (user) => {
        setIsEdit(true);
        setEditId(user.MaTaiKhoan);
        setHoTen(user.HoTen);
        setEmail(user.Email);
        setSdt(user.SoDienThoai);
        setRole(user.MaVaiTro);
        setPass(''); 
    };

    const resetForm = () => {
        setIsEdit(false);
        setEditId(null);
        setHoTen(''); setEmail(''); setPass(''); setSdt(''); setRole(4);
    };

    const handleDelete = (id) => {
        if(window.confirm("Xóa tài khoản này?")) {
            fetch(`http://localhost:5000/api/accounts/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                fetchUsers();
            });
        }
    };

    // 3. RETURN GIAO DIỆN CHÍNH
    return (
        <div className="admin-page-container">
            <h2 className="page-title">Quản Lý Tài Khoản Hệ Thống</h2>
            
            <div className="admin-card">
                <div className="card-header">
                    <h3>{isEdit ? `✏️ Cập Nhật User #${editId}` : '+ Tạo Tài Khoản Mới'}</h3>
                    {isEdit && <button className="btn-cancel-edit" onClick={resetForm}>Hủy / Thêm mới</button>}
                </div>
                <div className="card-body">
                    <form onSubmit={handleSave} className="form-grid-account">
                        <div className="form-group">
                            <input className="form-input" placeholder="Họ tên" value={hoTen} onChange={e=>setHoTen(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <input 
                                className="form-input" 
                                placeholder="Email" 
                                value={email} 
                                onChange={e=>setEmail(e.target.value)} 
                                required 
                                disabled={isEdit} 
                                style={isEdit ? {background: '#eee', cursor: 'not-allowed'} : {}}
                            />
                        </div>
                        <div className="form-group">
                            <input 
                                className="form-input" 
                                placeholder={isEdit ? "Mật khẩu mới (bỏ trống nếu không đổi)" : "Mật khẩu"} 
                                type="password" 
                                value={pass} 
                                onChange={e=>setPass(e.target.value)} 
                                required={!isEdit} 
                            />
                        </div>
                        <div className="form-group">
                            <input className="form-input" placeholder="SĐT" value={sdt} onChange={e=>setSdt(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <select className="form-input" value={role} onChange={e=>setRole(e.target.value)}>
                                <option value={1}>Admin</option>
                                <option value={2}>Quản Lý</option>
                                <option value={3}>Nhân Viên</option>
                                <option value={4}>Khách Hàng</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn-submit">
                                {isEdit ? 'Lưu Thay Đổi' : 'Tạo Tài Khoản'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="admin-card">
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ Tên</th>
                                <th>Email</th>
                                <th>SĐT</th>
                                <th>Vai Trò</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.MaTaiKhoan}>
                                    <td>#{u.MaTaiKhoan}</td>
                                    <td>{u.HoTen}</td>
                                    <td>{u.Email}</td>
                                    <td>{u.SoDienThoai}</td>
                                    <td>
                                        <span className={`role-badge role-${u.MaVaiTro}`}>
                                            {u.TenVaiTro || 'Chưa phân quyền'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-icon edit" onClick={() => handleEdit(u)}>✏️</button>
                                        
                                        {/* Không cho xóa chính mình */}
                                        {u.MaVaiTro !== 1 && ( 
                                            <button className="btn-icon delete" onClick={() => handleDelete(u.MaTaiKhoan)}>🗑️</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuanLyTaiKhoan;