import React from 'react';
import './TheMonAn.css';

// (1) NHẬN hàm themVaoGio
function TheMonAn({ monAn, themVaoGio }) {
  const dinhDangTien = (soTien) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(soTien);
  };

  return (
    <div className="the-mon-an">
      <div className="khung-anh">
        <img src={monAn.anh} alt={monAn.ten} />
      </div>
      <div className="thong-tin">
        <h3>{monAn.ten}</h3>
        <p className="phan-loai">{monAn.phanloai}</p>
        <div className="hang-gia">
          <span className="gia-tien">{dinhDangTien(monAn.gia)}</span>
          
          {/* (2) GỌI hàm themVaoGio khi bấm nút */}
          <button className="nut-them" onClick={() => themVaoGio(monAn)}>
            + Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default TheMonAn;