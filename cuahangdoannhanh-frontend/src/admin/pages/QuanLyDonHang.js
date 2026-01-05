import React, { useState, useEffect } from 'react';
import './QuanLyDonHang.css';

const QuanLyDonHang = () => {
    // 1. KHAI BÁO HOOKS (LUÔN Ở ĐẦU)
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Lấy user hiện tại
    const currentUser = JSON.parse(localStorage.getItem('userFastFood'));

    // Hàm lấy danh sách đơn hàng
    const fetchOrders = () => {
        fetch('http://localhost:5000/api/orders')
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    };

    // useEffect cũng phải gọi ở đây
    useEffect(() => {
        // Chỉ gọi API nếu có quyền
        if (currentUser && currentUser.MaVaiTro <= 3) {
            fetchOrders();
        }
    }, []);

    // 2. KIỂM TRA QUYỀN VÀ RETURN SỚM (ĐẶT Ở ĐÂY MỚI ĐÚNG)
    if (!currentUser || currentUser.MaVaiTro > 3) {
        return (
            <div style={{ textAlign: 'center', padding: '50px', color: '#d32f2f' }}>
                <h2>⛔ Không có quyền truy cập!</h2>
                <p>Trang này chỉ dành cho Nhân viên cửa hàng.</p>
            </div>
        );
    }

    // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        fetch(`http://localhost:5000/api/orders/${order.MaDonHang}/details`)
            .then(res => res.json())
            .then(data => {
                setOrderDetails(data);
                setShowModal(true);
            })
            .catch(err => console.error(err));
    };

    const handleUpdateStatus = (maDonHang, newStatus) => {
        let confirmMsg = "";
        if(newStatus === 'DangGiao') confirmMsg = "Xác nhận duyệt và giao đơn hàng này?";
        if(newStatus === 'HoanTat') confirmMsg = "Xác nhận đơn hàng đã giao thành công và thu tiền?";
        if(newStatus === 'Huy') confirmMsg = "Bạn có chắc chắn muốn HỦY đơn hàng này?";

        if(window.confirm(confirmMsg)) {
            fetch(`http://localhost:5000/api/orders/${maDonHang}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trangThai: newStatus })
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                fetchOrders();
                setShowModal(false);
            })
            .catch(err => alert("Lỗi cập nhật trạng thái!"));
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'ChoXacNhan': return <span className="badge badge-warning" style={{background:'#fff3cd', color:'#856404', padding:'5px 10px', borderRadius:'10px'}}>⏳ Chờ xác nhận</span>;
            case 'DangGiao': return <span className="badge badge-info" style={{background:'#d1ecf1', color:'#0c5460', padding:'5px 10px', borderRadius:'10px'}}>🚚 Đang giao</span>;
            case 'HoanTat': return <span className="badge badge-success" style={{background:'#d4edda', color:'#155724', padding:'5px 10px', borderRadius:'10px'}}>✅ Hoàn tất</span>;
            case 'Huy': return <span className="badge badge-danger" style={{background:'#f8d7da', color:'#721c24', padding:'5px 10px', borderRadius:'10px'}}>❌ Đã hủy</span>;
            default: return status;
        }
    };

    // 3. RETURN GIAO DIỆN CHÍNH
    return (
        <div className="admin-page-container">
            <h2 className="page-title">Quản Lý Đơn Hàng</h2>
            <p style={{marginBottom: '20px', color: '#666'}}>
                Xin chào, <strong>{currentUser.HoTen}</strong>
            </p>

            <div className="admin-card">
                <div className="table-responsive">
                    <table className="modern-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Người Đặt</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Thanh Toán</th>
                                <th>Trạng Thái</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.MaDonHang}>
                                    <td>#{order.MaDonHang}</td>
                                    <td>
                                        <strong>{order.TenNguoiDat || order.TenNguoiNhan}</strong><br/>
                                        <small>{order.SDT_NguoiDat || order.SDT}</small>
                                    </td>
                                    <td>{new Date(order.NgayDat).toLocaleString('vi-VN')}</td>
                                    <td className="price-text">{(order.TongTien || 0).toLocaleString()}đ</td>
                                    <td>
                                        {order.HinhThucThanhToan === 'ChuyenKhoan' 
                                            ? <span style={{color: 'blue', fontWeight:'bold'}}>💳 Chuyển khoản</span> 
                                            : <span style={{color: 'green', fontWeight:'bold'}}>💵 Tiền mặt</span>
                                        }
                                    </td>
                                    <td>{getStatusBadge(order.TrangThai)}</td>
                                    <td>
                                        <button className="btn-icon view" 
                                            style={{background:'#3498db', color:'white', border:'none', padding:'5px 10px', borderRadius:'5px', cursor:'pointer'}}
                                            onClick={() => handleViewDetails(order)}>
                                            👁️ Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {showModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content large-modal" style={{width: '900px'}}>
                        <div className="modal-header">
                            <h3>Xử lý đơn hàng #{selectedOrder.MaDonHang}</h3>
                            <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        
                        <div className="modal-body-grid" style={{display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:'20px'}}>
                            {/* CỘT TRÁI */}
                            <div className="col-products">
                                <h4>🛒 Danh sách món ăn</h4>
                                <table className="mini-table" style={{width:'100%', borderCollapse:'collapse'}}>
                                    <thead>
                                        <tr style={{background:'#eee'}}>
                                            <th style={{padding:'8px'}}>Món</th>
                                            <th>SL</th>
                                            <th>Đơn giá</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.map((item, idx) => (
                                            <tr key={idx} style={{borderBottom:'1px solid #eee'}}>
                                                <td style={{padding:'8px'}}>
                                                    <div style={{display:'flex', alignItems:'center'}}>
                                                        <img src={item.anh} alt="" style={{width:'40px', height:'40px', objectFit:'cover', marginRight:'10px', borderRadius:'4px'}} />
                                                        <span>{item.TenMonAn}</span>
                                                    </div>
                                                </td>
                                                <td style={{textAlign:'center'}}>x{item.SoLuong}</td>
                                                <td>{item.DonGia.toLocaleString()}</td>
                                                <td>{(item.DonGia * item.SoLuong).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                <div className="bill-summary" style={{marginTop:'20px', borderTop:'2px solid #eee', paddingTop:'10px'}}>
                                    <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold', fontSize:'18px', color:'#d32f2f', marginTop:'10px'}}>
                                        <span>TỔNG CỘNG:</span>
                                        <span>{(selectedOrder.TongTien || 0).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            </div>

                            {/* CỘT PHẢI */}
                            <div className="col-info">
                                <div className="info-box" style={{background:'#f9f9f9', padding:'15px', borderRadius:'8px', marginBottom:'15px'}}>
                                    <h4 style={{marginTop:0}}>🚚 Thông tin giao hàng</h4>
                                    <p><strong>Người nhận:</strong> {selectedOrder.TenNguoiNhan}</p>
                                    <p><strong>SĐT:</strong> {selectedOrder.SDT}</p>
                                    <p><strong>Địa chỉ:</strong> {selectedOrder.DiaChi}</p>
                                </div>

                                <div className="info-box" style={{background:'#e3f2fd', padding:'15px', borderRadius:'8px'}}>
                                    <h4 style={{marginTop:0}}>⚙️ Tác vụ</h4>
                                    <div className="action-buttons" style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'15px'}}>
                                        {selectedOrder.TrangThai === 'ChoXacNhan' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(selectedOrder.MaDonHang, 'DangGiao')}
                                                    style={{background:'#3498db', color:'white', padding:'10px', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>
                                                    🚀 Duyệt & Giao hàng
                                                </button>
                                                <button onClick={() => handleUpdateStatus(selectedOrder.MaDonHang, 'Huy')}
                                                    style={{background:'#e74c3c', color:'white', padding:'10px', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>
                                                    ❌ Hủy Đơn
                                                </button>
                                            </>
                                        )}
                                        {selectedOrder.TrangThai === 'DangGiao' && (
                                            <button onClick={() => handleUpdateStatus(selectedOrder.MaDonHang, 'HoanTat')}
                                                style={{background:'#27ae60', color:'white', padding:'10px', border:'none', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>
                                                ✅ Xác nhận Hoàn Tất
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuanLyDonHang;