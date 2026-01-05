# FASTFOOD VN - WEBSITE QUẢN LÝ VÀ ĐẶT MÓN THỨC ĂN NHANH
1. Giới thiệu
FastFood VN là hệ thống website thương mại điện tử chuyên cung cấp các món ăn nhanh (Gà rán, Burger, Combo...). Hệ thống giúp khách hàng đặt món trực tuyến dễ dàng, tự động tính toán phí vận chuyển dựa trên khu vực và tích hợp đa dạng hình thức thanh toán. Đồng thời cung cấp trang quản trị mạnh mẽ giúp cửa hàng quản lý đơn hàng và doanh thu hiệu quả.

Sinh viên thực hiện: Nguyễn Công Danh

MSSV: DH52200451

Lớp: D22_TH06

Môn học: Thực tập chuyên ngành

2. Công nghệ sử dụng
Backend: Node.js, Express.js (RESTful API)

Frontend: ReactJS, React Router DOM, CSS3 (Modern UI)

Database: MySQL

Server: XAMPP (Sử dụng MySQL Server)

3. Các chức năng chính
Khách hàng (User):

Xem thực đơn, tìm kiếm và lọc món ăn theo danh mục.

Thêm món vào giỏ hàng, tự động tính tổng tiền.

Tính phí ship thông minh: Tự động so sánh Quận/Huyện để tính phí (Cùng quận/Khác quận).

Lựa chọn đơn vị vận chuyển (Grab, Shopee, Tự giao...).

Thanh toán đa dạng: Tiền mặt (COD) hoặc Quét mã QR chuyển khoản.

Xem lịch sử đơn hàng và trạng thái giao hàng.

Quản trị viên (Admin):

Dashboard: Thống kê doanh thu, số lượng đơn hàng.

Quản lý Thực đơn: Thêm, Xóa, Sửa món ăn, Upload hình ảnh trực tiếp.

Quản lý Đơn hàng: Duyệt đơn, Xác nhận đang giao, Hoàn tất đơn hàng.

Quản lý Hệ thống: Quản lý tài khoản, Đơn vị vận chuyển.

4. Hướng dẫn cài đặt
Bước 1: Cài đặt môi trường

Cài đặt Node.js (v14 trở lên).

Cài đặt XAMPP (để chạy MySQL).

Bước 2: Cấu hình Cơ sở dữ liệu

Khởi động MySQL trong XAMPP.

Truy cập http://localhost/phpmyadmin.

Tạo database mới tên: cuahangdoannhanh.

Import file database.sql (nằm trong thư mục gốc của project).

Bước 3: Cài đặt và Chạy Server (Backend)

Mở Terminal tại thư mục server.

Chạy lệnh cài đặt thư viện:

Bash

npm install
Khởi động Server:

Bash

node server.js
(Server sẽ chạy tại: http://localhost:5000)

Bước 4: Cài đặt và Chạy Client (Frontend)

Mở Terminal mới tại thư mục client.

Chạy lệnh cài đặt thư viện:

Bash

npm install
Khởi động Website:

Bash

npm start
(Trình duyệt sẽ tự mở tại: http://localhost:3000)

Tài khoản Admin mặc định:

Username: admin (hoặc SĐT trong DB của bạn)

Password: 123 (hoặc mật khẩu bạn đã tạo)

5. Liên hệ
Mọi thắc mắc vui lòng liên hệ qua email: dh52200451@student.stu.edu.vn.
