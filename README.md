# IS207 Store - Hệ Thống Thương Mại Điện Tử Quần Áo

## Giới thiệu
Dự án là một hệ thống quản lý và bán hàng thương mại điện tử dành cho cửa hàng quần áo. Hệ thống bao gồm giao diện cửa hàng trực tuyến dành cho khách hàng (tìm kiếm, xem chi tiết, giỏ hàng, đặt hàng) và trang quản trị dành cho admin (quản lý sản phẩm, danh mục, đơn hàng, voucher, chiến dịch quảng cáo). Dự án được phát triển theo mô hình Client-Server với Frontend sử dụng Next.js và Backend sử dụng Node.js, kết hợp cùng hệ quản trị cơ sở dữ liệu MySQL.

## Công nghệ sử dụng
- **Frontend**: Next.js (React), Tailwind CSS, Zustand, Shadcn UI, Recharts.
- **Backend**: Node.js, Express.js.
- **Cơ sở dữ liệu**: MySQL.
- **Dịch vụ tích hợp**: Cloudinary (lưu trữ và xử lý hình ảnh), Nodemailer (gửi email thông báo), JWT (xác thực và phân quyền).

## Yêu cầu hệ thống
Để có thể cài đặt và chạy dự án, máy tính của bạn cần cài đặt sẵn các phần mềm sau:
- Node.js (khuyến nghị phiên bản v18 trở lên).
- MySQL Server đang hoạt động.
- Tài khoản Cloudinary (để cấu hình lưu ảnh sản phẩm).
- Tài khoản Email có hỗ trợ SMTP (để gửi thông báo).

## Hướng dẫn cài đặt

1. Tải mã nguồn dự án về máy:
```bash
git clone <url-kho-chứa>
cd IS207
```

2. Cài đặt các gói thư viện cho Backend:
```bash
cd backend
npm install
```

3. Cài đặt các gói thư viện cho Frontend:
```bash
cd ../frontend
npm install
```

## Cấu hình môi trường

### Cấu hình Backend
1. Di chuyển vào thư mục `backend`.
2. Tạo file `.env` bằng cách sao chép từ file mẫu:
```bash
cp "env example" .env
```
3. Mở file `.env` vừa tạo và điền các thông tin cần thiết:
   - Thông tin kết nối MySQL (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
   - Khóa bảo mật JWT (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_SECRET`). Có thể sử dụng lệnh node để tạo chuỗi ngẫu nhiên.
   - Thông tin API của Cloudinary (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
   - Thông tin cấu hình SMTP để gửi email (`SMTP_USER`, `SMTP_PASS`,...).
4. Tạo database trong hệ quản trị MySQL có tên tương ứng với biến `DB_NAME` bạn đã cấu hình. Sau đó import dữ liệu (nếu có file .sql đi kèm).

### Cấu hình Frontend
1. Di chuyển vào thư mục `frontend`.
2. Tạo file `.env.local` bằng cách sao chép từ file mẫu:
```bash
cp "env .example" .env.local
```
3. Mở file `.env.local` và kiểm tra biến `NEXT_PUBLIC_API_URL`. Hãy đảm bảo biến này trỏ đúng vào địa chỉ API của Backend (mặc định là `http://localhost:8080/api/v1`).

## Hướng dẫn chạy dự án

Để dự án hoạt động đầy đủ, bạn cần mở 2 cửa sổ terminal (dòng lệnh) riêng biệt để chạy song song cả Backend và Frontend.

### 1. Khởi động Backend
Mở cửa sổ terminal, di chuyển vào thư mục `backend` và chạy lệnh sau:
```bash
npm run dev
```
Server backend sẽ được khởi chạy. Mặc định server sẽ lắng nghe ở cổng 8080 (hoặc cổng được thiết lập ở biến PORT).

### 2. Khởi động Frontend
Mở một cửa sổ terminal khác, di chuyển vào thư mục `frontend` và chạy lệnh sau:
```bash
npm run dev
```
Giao diện ứng dụng web sẽ được khởi chạy tại địa chỉ `http://localhost:3000`. Bạn có thể mở trình duyệt và truy cập vào đường dẫn này để bắt đầu sử dụng hệ thống.
