import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThanhToan.css';

const BRANCH_LOCATION_MAP = {
    1: "Quận 1",
    2: "Thủ Đức",
    3: "Gò Vấp",
};

const ThanhToan = ({ gioHang, xoaSachGioHang }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userFastFood'));
    const currentBranch = JSON.parse(localStorage.getItem('chiNhanhHienTai'));
    const branchDistrictName = currentBranch ? BRANCH_LOCATION_MAP[currentBranch.id] : "Quận 1";

    const chuanHoa = (str) => {
        if (!str) return "";
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().trim();
    };

    // State form
    const [nguoiDat, setNguoiDat] = useState({ hoTen: user ? user.HoTen : '', sdt: user ? user.SoDienThoai : '', soNha: '', quan: '' });
    const [nguoiNhan, setNguoiNhan] = useState({ hoTen: '', sdt: '', soNha: '', quan: '' });
    const [giaoChoNguoiKhac, setGiaoChoNguoiKhac] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('TienMat');
    const [showQR, setShowQR] = useState(false);

    // --- CẤU HÌNH ĐƠN VỊ VẬN CHUYỂN ---
    const [partnersList, setPartnersList] = useState([]); 
    const [selectedPartnerId, setSelectedPartnerId] = useState(4); // Mặc định ID 4
    const [phiShip, setPhiShip] = useState(25000);

    // 1. GỌI API LẤY DANH SÁCH (Chỉ map Icon, không map giá tiền nữa)
    useEffect(() => {
        fetch('http://localhost:5000/api/shipping-partners')
            .then(res => res.json())
            .then(data => {
                const processedData = data.map(dv => {
                    let icon = '🚚'; // Icon mặc định
                    
                    // Gán icon cho đẹp
                    if (dv.TenDonVi.toLowerCase().includes('grab')) icon = '🟢'; 
                    else if (dv.TenDonVi.toLowerCase().includes('shopee')) icon = '🟠'; 
                    else if (dv.TenDonVi.toLowerCase().includes('be')) icon = '🟡'; 
                    else if (dv.TenDonVi.toLowerCase().includes('tự giao')) icon = '🏠'; 

                    return { ...dv, icon };
                });
                setPartnersList(processedData);
            })
            .catch(err => console.error("Lỗi lấy ĐVVC:", err));
    }, []);

    // 2. TÍNH PHÍ SHIP (CHỈ DỰA VÀO QUẬN)
    useEffect(() => {
        const quanNhap = giaoChoNguoiKhac ? nguoiNhan.quan : nguoiDat.quan;
        const inputClean = chuanHoa(quanNhap);
        const branchClean = chuanHoa(branchDistrictName);
        
        // Logic cũ: Cùng quận 15k, khác quận 25k
        if (inputClean === branchClean || (inputClean && inputClean.includes(branchClean))) {
            setPhiShip(15000); 
        } else {
            setPhiShip(25000); 
        }

        // KHÔNG CỘNG THÊM PHỤ PHÍ NỮA

    }, [nguoiDat.quan, nguoiNhan.quan, giaoChoNguoiKhac, branchDistrictName]);

    const tienMonAn = gioHang.reduce((sum, item) => sum + item.gia * item.soLuong, 0);
    const tongThanhToan = tienMonAn + phiShip;

    const submitOrder = () => {
        if (!nguoiDat.hoTen || !nguoiDat.sdt || !nguoiDat.quan || !nguoiDat.soNha) {
            alert("Vui lòng điền đầy đủ thông tin người đặt!"); return;
        }
        
        const diaChiDat = `${nguoiDat.soNha}, ${nguoiDat.quan}`;
        const diaChiNhan = `${nguoiNhan.soNha}, ${nguoiNhan.quan}`;
        const finalNguoiDat = { ...nguoiDat, diaChi: diaChiDat };
        const finalNguoiNhan = giaoChoNguoiKhac ? { ...nguoiNhan, diaChi: diaChiNhan } : { ...nguoiDat, diaChi: diaChiDat }; 

        const partner = partnersList.find(p => p.MaDonViVC === parseInt(selectedPartnerId));

        const orderData = {
            maKhachHang: user ? user.MaTaiKhoan : null,
            tongTien: tongThanhToan,
            phiShip: phiShip,
            gioHang,
            hinhThucThanhToan: paymentMethod,
            maDonViVC: selectedPartnerId,
            tenDonViVC: partner ? partner.TenDonVi : '',
            infoNguoiDat: finalNguoiDat,
            infoNguoiNhan: finalNguoiNhan
        };

        fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                alert("🎉 Đặt hàng thành công!");
                xoaSachGioHang();
                navigate('/lich-su-don');
            } else {
                alert("Lỗi: " + data.message);
            }
        })
        .catch(err => alert("Lỗi kết nối!"));
    };

    const handleDatHang = (e) => {
        e.preventDefault();
        if (gioHang.length === 0) { alert("Giỏ hàng trống!"); return; }
        if (paymentMethod === 'ChuyenKhoan') setShowQR(true);
        else submitOrder();
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Thanh Toán</h2>
            <div className="branch-alert">
                Đang đặt từ: <strong>{currentBranch ? currentBranch.ten : "Chi nhánh mặc định"} ({branchDistrictName})</strong>
            </div>

            <div className="checkout-layout">
                <div className="info-section">
                    <form id="checkoutForm" onSubmit={handleDatHang}>
                        {/* 1. NGƯỜI ĐẶT */}
                        <div className="form-block">
                            <h3 className="block-title">👤 Người Đặt</h3>
                            <div className="form-group"><label>Họ tên</label><input className="form-input" value={nguoiDat.hoTen} onChange={e=>setNguoiDat({...nguoiDat, hoTen: e.target.value})} required/></div>
                            <div className="form-group"><label>SĐT</label><input className="form-input" value={nguoiDat.sdt} onChange={e=>setNguoiDat({...nguoiDat, sdt: e.target.value})} required/></div>
                            <div className="row-2-col">
                                <div className="form-group"><label>Quận/Huyện (*)</label><input className="form-input" placeholder="Nhập quận..." value={nguoiDat.quan} onChange={e=>setNguoiDat({...nguoiDat, quan: e.target.value})} required /></div>
                                <div className="form-group"><label>Số nhà</label><input className="form-input" placeholder="Địa chỉ..." value={nguoiDat.soNha} onChange={e=>setNguoiDat({...nguoiDat, soNha: e.target.value})} required/></div>
                            </div>
                        </div>

                        <div className="shipping-option">
                            <label className="checkbox-label">
                                <input type="checkbox" checked={giaoChoNguoiKhac} onChange={e=>setGiaoChoNguoiKhac(e.target.checked)}/>
                                <span>🎁 Giao cho người khác</span>
                            </label>
                        </div>

                        {giaoChoNguoiKhac && (
                             <div className="form-block fade-in">
                                <h3 className="block-title">🚚 Người Nhận</h3>
                                <div className="form-group"><label>Họ tên</label><input className="form-input" value={nguoiNhan.hoTen} onChange={e=>setNguoiNhan({...nguoiNhan, hoTen: e.target.value})} required/></div>
                                <div className="form-group"><label>SĐT</label><input className="form-input" value={nguoiNhan.sdt} onChange={e=>setNguoiNhan({...nguoiNhan, sdt: e.target.value})} required/></div>
                                <div className="row-2-col">
                                    <div className="form-group"><label>Quận/Huyện (*)</label><input className="form-input" placeholder="Nhập quận..." value={nguoiNhan.quan} onChange={e=>setNguoiNhan({...nguoiNhan, quan: e.target.value})} required /></div>
                                    <div className="form-group"><label>Số nhà</label><input className="form-input" placeholder="Địa chỉ..." value={nguoiNhan.soNha} onChange={e=>setNguoiNhan({...nguoiNhan, soNha: e.target.value})} required/></div>
                                </div>
                            </div>
                        )}

                        {/* 2. CHỌN ĐƠN VỊ VẬN CHUYỂN (KHÔNG CÓ GIÁ TIỀN) */}
                        <div className="form-block">
                            <h3 className="block-title">🛵 Chọn Đơn Vị Giao Hàng</h3>
                            {partnersList.length === 0 ? <p>Đang tải danh sách...</p> : (
                                <div className="shipping-partners">
                                    {partnersList.map(partner => (
                                        <label key={partner.MaDonViVC} className={`partner-card ${parseInt(selectedPartnerId) === partner.MaDonViVC ? 'active' : ''}`}>
                                            <input 
                                                type="radio" 
                                                name="shipping" 
                                                value={partner.MaDonViVC} 
                                                checked={parseInt(selectedPartnerId) === partner.MaDonViVC}
                                                onChange={() => setSelectedPartnerId(partner.MaDonViVC)}
                                                hidden
                                            />
                                            <div className="partner-icon">{partner.icon}</div>
                                            <div className="partner-info">
                                                <span className="partner-name">{partner.TenDonVi}</span>
                                            </div>
                                            {/* Đã bỏ phần hiển thị giá tiền ở đây */}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 3. THANH TOÁN */}
                        <div className="payment-section">
                            <h3>Thanh Toán</h3>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'TienMat' ? 'active' : ''}`}>
                                    <input type="radio" name="pay" value="TienMat" checked={paymentMethod==='TienMat'} onChange={()=>setPaymentMethod('TienMat')}/>
                                    <span>💵 Tiền mặt</span>
                                </label>
                                <label className={`payment-option ${paymentMethod === 'ChuyenKhoan' ? 'active' : ''}`}>
                                    <input type="radio" name="pay" value="ChuyenKhoan" checked={paymentMethod==='ChuyenKhoan'} onChange={()=>setPaymentMethod('ChuyenKhoan')}/>
                                    <span>💳 Chuyển khoản QR</span>
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* TÓM TẮT */}
                <div className="summary-section">
                    <h3>Đơn Hàng</h3>
                    <div className="summary-list">
                        {gioHang.map((item, idx) => (
                            <div key={idx} className="summary-item">
                                <span>{item.ten} (x{item.soLuong})</span>
                                <span>{(item.gia * item.soLuong).toLocaleString()}đ</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="cost-breakdown">
                        <div className="cost-row">
                            <span>Tạm tính:</span>
                            <span>{tienMonAn.toLocaleString()} đ</span>
                        </div>
                        <div className="cost-row">
                            <span>Phí Ship (Cố định):</span>
                            <span style={{color: '#d32f2f', fontWeight: 'bold'}}>{phiShip.toLocaleString()} đ</span>
                        </div>
                        <div className="summary-total">
                            <span>TỔNG CỘNG:</span>
                            <span className="total-price">{tongThanhToan.toLocaleString()} đ</span>
                        </div>
                    </div>
                    
                    <button type="submit" form="checkoutForm" className="btn-confirm">
                        {paymentMethod === 'ChuyenKhoan' ? `Thanh toán ${tongThanhToan.toLocaleString()}đ` : 'Xác Nhận Đặt Hàng'}
                    </button>
                </div>
            </div>

            {/* QR Modal */}
            {showQR && (
                <div className="modal-overlay">
                    <div className="qr-modal">
                        <h3>Quét Mã Thanh Toán</h3>
                        <p>Số tiền: <strong>{tongThanhToan.toLocaleString()} đ</strong></p>
                        <div className="qr-box">
                            <img src={`https://img.vietqr.io/image/MB-0000000000-compact.jpg?amount=${tongThanhToan}&addInfo=FastFood Don ${Date.now()}`} alt="QR" />
                        </div>
                        <div className="qr-actions">
                            <button className="btn-cancel" onClick={() => setShowQR(false)}>Quay lại</button>
                            <button className="btn-paid" onClick={submitOrder}>✅ Tôi đã chuyển tiền</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThanhToan;