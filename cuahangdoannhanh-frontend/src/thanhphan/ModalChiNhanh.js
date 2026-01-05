import React, { useState, useEffect } from 'react';
import './ModalChiNhanh.css';

const ModalChiNhanh = ({ dangHien, dongModal, chonChiNhanh }) => {
    const [danhSachChiNhanh, setDanhSachChiNhanh] = useState([]);
    const [loading, setLoading] = useState(true);

    // GỌI API ĐỂ LẤY DỮ LIỆU THẬT
    useEffect(() => {
        if (dangHien) { // Chỉ gọi khi modal mở để tiết kiệm tài nguyên
            setLoading(true);
            fetch('http://localhost:5000/api/branches')
                .then(res => res.json())
                .then(data => {
                    setDanhSachChiNhanh(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi tải chi nhánh:", err);
                    setLoading(false);
                });
        }
    }, [dangHien]);

    if (!dangHien) return null;

    return (
        <div className="modal-overlay-cn">
            <div className="modal-container-cn">
                <button className="btn-close-cn" onClick={dongModal}>×</button>
                
                <h2 className="modal-title-cn">Chọn Chi Nhánh Gần Bạn</h2>
                <p className="modal-desc-cn">Để nhận được ưu đãi và phí ship tốt nhất!</p>

                {loading ? (
                    <div style={{textAlign: 'center', padding: '20px'}}>Đang tải danh sách...</div>
                ) : (
                    <div className="branch-list">
                        {danhSachChiNhanh.length > 0 ? (
                            danhSachChiNhanh.map((cn) => (
                                <div key={cn.id} className="branch-item" onClick={() => chonChiNhanh(cn)}>
                                    <div className="branch-info">
                                        <h3 className="branch-name">{cn.ten}</h3>
                                        <p className="branch-address">📍 {cn.diachi}</p>
                                        <p className="branch-phone">📞 {cn.sdt}</p>
                                    </div>
                                    <div className="branch-arrow">➤</div>
                                </div>
                            ))
                        ) : (
                            <p style={{textAlign: 'center'}}>Chưa có chi nhánh nào hoạt động.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalChiNhanh;