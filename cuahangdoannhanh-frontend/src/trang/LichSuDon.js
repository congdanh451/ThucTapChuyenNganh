import React, { useState, useEffect } from 'react';
import './LichSuDon.css';

const LichSuDon = () => {
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userStored = JSON.parse(localStorage.getItem('userFastFood'));
        if (userStored) {
            setUser(userStored);
            fetch(`http://localhost:5000/api/orders/user/${userStored.MaTaiKhoan}`)
                .then(res => res.json())
                .then(data => setOrders(data))
                .catch(err => console.error("Lỗi:", err));
        }
    }, []);

    const getStatusText = (status) => {
        switch(status) {
            case 'ChoXacNhan': return <span className="st-pending">🕒 Chờ xác nhận</span>;
            case 'DangGiao': return <span className="st-shipping">🚚 Đang giao hàng</span>;
            case 'HoanTat': return <span className="st-success">✅ Hoàn tất</span>;
            case 'Huy': return <span className="st-cancel">❌ Đã hủy</span>;
            default: return status;
        }
    };

    if (!user) return <div className="history-container"><h2>Vui lòng đăng nhập!</h2></div>;

    return (
        <div className="history-container">
            <h2 className="history-title">Lịch Sử Đơn Hàng</h2>
            
            {orders.length === 0 ? (
                <p className="empty-msg">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="order-list">
                    {orders.map(order => (
                        <div key={order.MaDonHang} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Đơn hàng #{order.MaDonHang}</span>
                                <span className="order-date">{new Date(order.NgayDat).toLocaleString('vi-VN')}</span>
                            </div>
                            
                            <div className="order-body">
                                <div className="body-row">
                                    <strong>Người nhận:</strong> {order.TenNguoiNhan} - {order.SDT}
                                </div>
                                <div className="body-row">
                                    <strong>Giao đến:</strong> {order.DiaChi}
                                </div>
                                <div className="body-row">
                                    <strong>Thanh toán:</strong> {order.HinhThucThanhToan === 'ChuyenKhoan' ? 'Chuyển khoản (QR)' : 'Tiền mặt'}
                                </div>
                                <hr/>
                                <div className="price-breakdown">
                                    <span>Tiền hàng: {(order.TongTien - order.PhiShip).toLocaleString()}đ</span>
                                    <span> + Ship: {(order.PhiShip || 0).toLocaleString()}đ</span>
                                </div>
                                <div className="total-final">
                                    Tổng thanh toán: <span>{order.TongTien.toLocaleString()} đ</span>
                                </div>
                            </div>

                            <div className="order-footer">
                                <div className="status-area">
                                    Trạng thái: {getStatusText(order.TrangThai)}
                                </div>
                                {/* Có thể thêm nút "Mua lại" ở đây sau này */}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LichSuDon;