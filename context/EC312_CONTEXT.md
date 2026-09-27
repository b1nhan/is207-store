# EC312 – SmartGear: Context tổng hợp

> File này là điểm vào chính. Chi tiết nghiệp vụ/pháp lý/TCO: xem `Bai_tap_1_Project_Charter_SmartGear.docx.md` (Bài tập 1 – Project Charter, nguồn chuẩn).

## 1. Bối cảnh

- Repo này ban đầu là đồ án **IS207 (Phát triển web)**: shop **quần áo** "IS207 Store" (Next.js + Express + MySQL).
- Học kỳ này tái sử dụng làm đồ án **EC312 (Thiết kế hệ thống thương mại điện tử)**, đổi thành **SmartGear** – website TMĐT bán **thiết bị điện tử chính hãng**.
- Giữ nguyên phần lớn kiến trúc/code; thay đổi chính: **cấu trúc DB sản phẩm** (quần áo → điện tử) + **thêm tính năng mới** (mục 4).
- Quy trình: **Scrum**, học theo buổi, mỗi tuần có bài tập nhóm (tài liệu phân tích/thiết kế: ERD, Class Diagram, use case...).

## 2. Nhóm (8 người)

| Vai trò      | Thành viên                  |
| ------------ | --------------------------- |
| PO           | An (chủ repo, git `b1nhan`) |
| Scrum Master | Huy                         |
| BA           | Bảo                         |
| UX/UI        | Đình Hoàng                  |
| FE           | Khang                       |
| BE           | Hoàng                       |
| Data         | Cẩm Tú                      |
| QA           | Diễm Ngọc                   |

## 3. Định vị sản phẩm (tóm tắt Charter)

- **Mô hình:** B2C single-seller. SmartGear tự nhập hàng, sở hữu tồn kho, tự niêm yết giá. Không cho người bán thứ ba → là _website TMĐT bán hàng_, không phải sàn.
- **Khách hàng:** 18–35 tuổi, HCM/HN/ĐN, thu nhập 8–25tr; quan tâm thông số, so sánh giá, săn deal; thanh toán ví (Momo/ZaloPay), thẻ, trả góp 0% cho đơn ≥ 10tr.
- **Pain point:** khó tự đọc thông số/cấu hình, sợ mua nhầm phụ kiện không tương thích, mua lẻ đắt hơn mua nhóm.
- **Danh mục (≥ 510 SKU giả định):** Điện thoại & Tablet (120), Laptop & PC (110), Phụ kiện (150), Âm thanh & hình ảnh (60), Smart Home (40), Đồng hồ/thiết bị đeo (30).
- **KPI 3 tháng:** 5.000 đơn/tháng; conversion 2,5–3,5%; ≥ 30% khách dùng Chatbot; ≥ 15% đơn từ Group Deal; AOV +10–15%.
- **Quyết định triển khai (trong báo cáo):** Build from Scratch. Charter ghi "microservices Node.js/Python"; code thực tế là **monolith Express**. Sau này có thể sẽ tách riêng service AI (Python).

## 4. Phạm vi MVP

**In-scope**

1. Danh mục + tìm kiếm, lọc theo thương hiệu/giá/**thông số kỹ thuật**.
2. Giỏ hàng.
3. Thanh toán online **VNPay, Momo** + COD.
4. OMS: tạo đơn, theo dõi trạng thái, huỷ/đổi trả.
5. **Group Deal:** mua chung, càng nhiều người giá càng giảm (xem mục 5).
6. **AI Chatbot tư vấn (RAG)** trên dataset sản phẩm: chọn điện thoại, cấu hình PC, phụ kiện theo nhu cầu/ngân sách. Có cơ chế chuyển sang nhân viên thật.
7. **Gamification:** minigame nhận voucher/quà theo dịp lễ (tựu trường, hè, 2/9). Có captcha + giới hạn tần suất.
8. **AI quản trị (Admin Analytics):** thống kê bán hàng, đọc insight, đề xuất nhập hàng/khuyến mãi.

**Out-of-scope:** loyalty nâng cao, đa ngôn ngữ/đa tiền tệ, recommendation engine theo hành vi dài hạn, cross-border.

## 5. Group Deal – quy tắc nghiệp vụ

Tham khảo mô hình "GroupDeal" (tài liệu mẫu, đã rút gọn vào đây):

- **Chiến dịch** gắn với sản phẩm, có `start`/`end`, **số người tối thiểu** và các **bậc giá theo số người tham gia**. Ví dụ: 1–4 người 500k · 5–9 người 450k · 10–19 người 420k · ≥ 20 người 390k.
- Khi có người tham gia, hệ thống xác định bậc giá hiện tại và cập nhật tiến độ (số người, thời gian còn lại, giá đang áp dụng). Người tham gia được thông báo khi lên bậc mới, khi chiến dịch thành công hoặc thất bại.
- Kết thúc: **đạt ngưỡng** thì xác nhận đơn và chuyển sang xử lý/giao. **Không đạt** thì deal thất bại, tự động huỷ và **hoàn 100% trong 24h**.
- Mỗi người tham gia = **1 đơn + 1 hoá đơn + 1 bảo hành riêng**. Người rủ nhóm chỉ giới thiệu, không định giá, không hưởng chênh lệch.
- Pháp lý: công bố rõ điều kiện/thời hạn/giá cuối (NĐ 81/2018). Chống gian lận: cảnh báo khi 1 tài khoản tạo nhiều đơn deal lớn trong thời gian ngắn, kích hoạt OTP.

## 6. Hiện trạng code (kế thừa từ IS207)

- **FE:** Next.js 16 (App Router), React 19, Tailwind 4, shadcn/radix, Zustand, Recharts, axios. Route groups: `(shop)`, `(admin)/admin`, `(auth)`.
- **BE:** Express 5 (ESM), mysql2, zod, JWT (access/refresh), bcrypt, Cloudinary, Nodemailer. Layer: `routes → controllers → services → repositories`, validations bằng zod.
- **DB:** MySQL. Schema đang dùng là `backend/database/new_schema.sql` (`schema.sql` là bản cũ).
- **Phần đặc thù quần áo, cần đổi:**
  - `products.material`, `products.gender` (men/women/unisex/kids).
  - `product_variants.size`, `product_variants.color`. Với điện tử nên chuyển thành biến thể theo cấu hình (vd RAM/ROM/màu) + bảng **thông số kỹ thuật** để lọc theo spec.
  - Seed data, category, UI filter theo size/giới tính.
- **Có sẵn, tái dùng được:** users/roles, brands, categories, cart, orders (+ `order_shipping_address`, `shipping_profiles`), vouchers (+ usages), **campaigns** (`PERCENTAGE | FIXED_PRICE | TIER_DISCOUNT | FREESHIP`).
  - Lưu ý: `campaign_tiers` hiện tính bậc theo **tổng giá trị đơn** (`min_order_value`), **không phải theo số người tham gia**. Group Deal cần bảng/logic mới (vd `group_deals`, `group_deal_tiers(min_participants, price)`, `group_deal_participants`).
- **Chưa có:** bảng `payments`, tích hợp VNPay/Momo (hiện chỉ có `orders.payment_status`), shipments, invoices, chatbot, gamification, AI analytics.
- Order status: `pending → confirmed → shipping → delivered`, cộng thêm `cancelled` và `returned`.
