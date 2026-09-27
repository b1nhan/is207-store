**Danh sách thành viên & phân vai trò**

| Vai trò (Role) | Thành viên | Mô tả công việc dự kiến |
| :---- | :---- | :---- |
| PO (Product Owner) | An | Định hướng tầm nhìn và mục tiêu kinh doanh, phê duyệt phạm vi dự án, quyết định tính năng và chiến lược sản phẩm. |
| Scrum Master | Huy | Điều phối quy trình Scrum, tổ chức họp nhóm, theo dõi tiến độ, tổng hợp và chuẩn hoá kết quả. |
| BA (Business Analyst) | Bảo | Phân tích mô hình kinh doanh, chân dung khách hàng, xác định phạm vi & tính năng MVP. |
| UX/UI Design | Đình Hoàng | Thiết kế trải nghiệm người dùng, các điểm chạm (touchpoint) và user flow. |
| FE (Front-end) | Khang | Phụ trách khía cạnh phân tích và triển khai giao diện. |
| BE (Back-end) | Hoàng | Phân tích và triển khai kiến trúc hệ thống, hạ tầng, server. |
| Data | Cẩm Tú | Phân tích dữ liệu sản phẩm, chi phí hạ tầng AI/Data. Phụ trách dữ liệu dataset cho các tính năng AI. |
| QA | Diễm Ngọc | Kiểm tra tính nhất quán nội dung, rà soát rủi ro pháp lý/tuân thủ, kiểm thử chất lượng sản phẩm. |

# **PHẦN 1\. GIỚI THIỆU DỰ ÁN, MÔ HÌNH KINH DOANH VÀ TẦM NHÌN KINH DOANH**

## **1A. Xác định tên dự án & tầm nhìn kinh doanh**

**Tên dự án (Project Name): SmartGear**

Ngách TMĐT: Thiết bị điện tử (điện thoại, laptop/PC, phụ kiện công nghệ, thiết bị âm thanh \- hình ảnh, nhà thông minh, thiết bị đeo thông minh).

**Tầm nhìn Chiến lược (Vision Statement)**

*“Xây dựng hệ thống thương mại điện tử chuyên về thiết bị điện tử chính hãng tại Việt Nam, nơi khách hàng được tư vấn lựa chọn sản phẩm bằng AI, mua sắm với ưu đãi theo nhóm (Group Deal) và trải nghiệm mua sắm được cá nhân hóa, minh bạch, đáng tin cậy.”*

Pain point mà dự án giải quyết: người tiêu dùng gặp khó khăn khi phải tự tìm hiểu thông số kỹ thuật phức tạp (cấu hình máy tính, linh kiện, phụ kiện tương thích) trước khi mua thiết bị điện tử, dễ mua nhầm sản phẩm không phù hợp nhu cầu hoặc không có ưu đãi tốt khi mua đơn lẻ.

**Mục tiêu Đo lường được (KPIs) — 3 tháng đầu ra mắt**

* Số lượng đơn hàng mục tiêu: 5.000 đơn/tháng vào tháng thứ 3\.

* Tỷ lệ chuyển đổi đơn hàng (conversion rate) kỳ vọng: 2,5% – 3,5% lượt truy cập.

* Tỷ lệ khách hàng sử dụng AI Chatbot tư vấn trước khi mua: ≥ 30%.

* Tỷ lệ đơn hàng phát sinh từ tính năng Group Deal: ≥ 15% tổng đơn hàng.

* Giá trị đơn hàng trung bình (AOV): tăng 10–15% nhờ Group Deal và gợi ý AI.

## **1B. Lựa chọn mô hình kinh doanh & khách hàng**

SLIDE 1 — 1B. LỰA CHỌN MÔ HÌNH KINH DOANH

Ba mô hình cân nhắc

* B2C (Business-to-Consumer): Bán lẻ trực tuyến tới người tiêu dùng cuối.  
* B2B (Business-to-Business): Bán buôn, đấu thầu, quản trị chuỗi cung ứng doanh nghiệp.  
* C2C (Consumer-to-Consumer): Sàn giao dịch, ký gửi, chợ đồ cũ trực tuyến.

SmartGear chọn B2C — Lý do

* Khách hàng mục tiêu là cá nhân 18–35 tuổi mua lẻ, không có nhu cầu công nợ hay hợp đồng khung như B2B.  
* Sản phẩm là thiết bị điện tử chính hãng cần bảo hành rõ ràng — mô hình C2C không đảm bảo được nguồn gốc và trách nhiệm sau bán.  
* B2C cho phép SmartGear kiểm soát giá, tồn kho và dữ liệu khách hàng — điều kiện bắt buộc để vận hành Group Deal và AI Chatbot.

Cách vận hành mô hình

* Tự nhập hàng từ nhà phân phối uỷ quyền, tự sở hữu tồn kho, tự niêm yết giá và chịu trách nhiệm sau bán hàng.  
* Phạm vi MVP không cho phép nhà bán thứ ba đăng bán → định danh là website TMĐT bán hàng, không phải sàn giao dịch TMĐT.  
* Group Deal vẫn là B2C: khách rủ nhau mua chung để đạt bậc giá tốt hơn, nhưng mỗi người vẫn là một đơn hàng – một hoá đơn – một trách nhiệm bảo hành riêng với SmartGear. Khách gom nhóm chỉ đóng vai trò người giới thiệu, không định giá và không hưởng chênh lệch.

SLIDE 2 — PHÂN TÍCH CHÂN DUNG KHÁCH HÀNG (TARGET PERSONA)

Hành vi mua sắm, độ tuổi và thói quen thanh toán số

* Độ tuổi: 18–35 tuổi (Gen Z & Millennials), tập trung tại TP.HCM, Hà Nội, Đà Nẵng; thu nhập 8–25 triệu VNĐ/tháng.  
* Hành vi mua sắm: quan tâm thông số kỹ thuật, so sánh giá nhiều nơi trước khi mua, chịu ảnh hưởng mạnh từ review của KOC công nghệ, thích săn deal theo mùa (9/9, 11/11, tựu trường).  
* Tần suất mua: đồ giá trị cao 1 lần/2–3 năm; phụ kiện và thiết bị nhà thông minh 3–6 lần/năm.  
* Thói quen thanh toán số: ưu tiên ví điện tử (Momo, ZaloPay), thanh toán thẻ, trả góp 0% cho đơn từ 10 triệu trở lên.  
* Pain points chính: sợ chọn nhầm cấu hình hoặc phụ kiện không tương thích; mua lẻ luôn đắt hơn giá mua theo nhóm.

Touchpoints (Điểm chạm) chính trên nền tảng số

* Website & App SmartGear: kênh chính, sở hữu dữ liệu khách hàng; là nơi duy nhất vận hành Group Deal, AI Chatbot và Gamification.  
* Gian hàng trên sàn TMĐT (Shopee, TikTok Shop): mở rộng độ phủ, thu hút khách mua lần đầu rồi điều hướng về App.  
* Fanpage Facebook & Zalo OA: chăm sóc khách hàng, thông báo trạng thái đơn và nhắc nhóm Group Deal sắp hết hạn.  
* KOC/KOL công nghệ trên TikTok, YouTube: tạo nhận biết và niềm tin ở giai đoạn đầu phễu mua hàng.

## **1C. Xác định phạm vi & tính năng MVP**

**Quy mô danh mục sản phẩm (giả định ≥ 500 SKU)**

| Nhóm sản phẩm | Mô tả | Số lượng SKU (giả định) |
| :---- | :---- | :---: |
| Điện thoại & Tablet | Smartphone, tablet chính hãng và like-new | 120 |
| Laptop & PC | Laptop văn phòng/gaming, máy tính để bàn, Mini PC | 110 |
| Phụ kiện công nghệ | Tai nghe, sạc, cáp, chuột, bàn phím, ốp lưng | 150 |
| Thiết bị âm thanh & hình ảnh | Loa, tai nghe không dây, màn hình, máy chiếu mini | 60 |
| Thiết bị nhà thông minh (Smart Home) | Camera an ninh, ổ cắm thông minh, đèn thông minh | 40 |
| Đồng hồ & thiết bị đeo thông minh | Smartwatch, vòng đeo sức khỏe | 30 |
| **Tổng cộng** |  | **≥ 510** |

**In-scope (Phạm vi bắt buộc MVP)**

* Danh mục sản phẩm & tìm kiếm, lọc theo thương hiệu/giá/thông số kỹ thuật.

* Giỏ hàng & quản lý phiên mua sắm.

* Thanh toán trực tuyến tích hợp (VNPay, Momo) & COD.

* Quản lý đơn hàng cơ bản (OMS): tạo đơn, theo dõi trạng thái, huỷ/đổi trả.

* Group Deal: khách hàng tạo/tham gia nhóm mua chung, giá giảm theo số lượng người tham gia (tham khảo mô hình Groupdeal).

* Chatbot AI tư vấn mua hàng: hỗ trợ chọn điện thoại, cấu hình máy tính, phụ kiện phù hợp theo nhu cầu và ngân sách. (*"AI Chatbot tích hợp RAG: Retrieval-Augmented Generation tra cứu trực tiếp trên tập Dataset 500+ SKU của hệ thống"* )

* Gamification: minigame nhận voucher/quà tặng vào các dịp lễ (tựu trường, hè, 2/9).

* AI quản lý hệ thống (Admin Analytics): hỗ trợ đội ngũ vận hành thống kê số liệu bán hàng, đọc insight và đề xuất hành động (nhập hàng, khuyến mãi).

**Out-of-scope (để lại giai đoạn sau)**

* Chương trình tích điểm khách hàng thân thiết nâng cao (Loyalty Program).

* Đa ngôn ngữ / đa tiền tệ quốc tế.

* AI gợi ý sản phẩm cá nhân hoá chuyên sâu (Recommendation Engine dựa trên hành vi dài hạn) — giai đoạn đầu chỉ triển khai Chatbot tư vấn theo yêu cầu trực tiếp.

* Mở rộng bán hàng xuyên biên giới (cross-border).

# **PHẦN 2\. LỰA CHỌN CHIẾN LƯỢC (BUY VS BUILD) KÈM LÝ DO THUYẾT PHỤC**

## **2A. Quyết định triển khai: Buy/Customize vs. Build from Scratch**

Nhóm phân tích hai hướng triển khai theo các tiêu chí đã học:

| Tiêu chí đánh giá | Buy / Customize (SaaS) | Build from Scratch |
| :---- | :---- | :---- |
| Thời gian ra thị trường (Time-to-market) | Nhanh (2–3 tháng) | Chậm hơn (5–7 tháng) |
| Chi phí ban đầu | Thấp – trung bình | Cao |
| Khả năng tùy biến tính năng đặc thù (Group Deal, AI Chatbot, Gamification, AI quản trị) | Hạn chế, phụ thuộc app/plugin bên thứ ba | Toàn quyền tùy biến theo đúng nghiệp vụ |
| Khả năng mở rộng & tích hợp AI/Data | Giới hạn bởi nền tảng SaaS | Chủ động thiết kế kiến trúc microservices, dễ tích hợp mô hình AI riêng |
| Quyền sở hữu & bảo mật dữ liệu | Dữ liệu lưu trên hạ tầng bên thứ ba | Toàn quyền kiểm soát dữ liệu khách hàng & giao dịch |
| Chi phí vận hành dài hạn (OpEx) | Tăng dần theo phí license/giao dịch | Ổn định hơn, chủ động tối ưu hạ tầng |
| Sự phù hợp với năng lực đội ngũ | Không tận dụng hết năng lực FE/BE/Data sẵn có | Tận dụng đầy đủ 8 vai trò Scrum của nhóm |
| Rủi ro triển khai  | Thấp – nền tảng đã ổn định, ít lỗi phát sinh  | Cao hơn – đội tự build đồng thời nhiều hạng mục khó (AI Chatbot, AI quản trị, Gamification) có nguy cơ trễ tiến độ/không đạt scope  |

**Quyết định của nhóm: BUILD FROM SCRATCH**

Nhóm lựa chọn hướng Tự phát triển (Build from Scratch) với kiến trúc Microservices (Node.js/Python cho backend, kết hợp mô hình AI riêng cho Chatbot và phân tích dữ liệu), vì các lý do sau:

* Các tính năng cốt lõi tạo lợi thế cạnh tranh của dự án (Group Deal, AI Chatbot tư vấn, Gamification theo dịp lễ, AI quản lý hệ thống) đều là nghiệp vụ đặc thù, khó/không thể tuỳ biến đầy đủ trên các nền tảng SaaS như Shopify hay WooCommerce.

* Đội ngũ đã có đầy đủ 8 vai trò Scrum (PO, SM, BA, UX/UI, FE, BE, Data, QA) — đủ năng lực để tự thiết kế, phát triển và vận hành hệ thống.

* Việc tích hợp AI (Chatbot tư vấn, AI quản trị) đòi hỏi quyền truy cập sâu vào dữ liệu sản phẩm, đơn hàng và hành vi người dùng — Build from Scratch giúp nhóm toàn quyền kiểm soát dữ liệu, tối ưu mô hình theo thời gian.

* Về dài hạn (3 năm), chi phí vận hành trên nền tảng SaaS (phí license theo doanh thu/giao dịch) có xu hướng tăng nhanh hơn khi quy mô đơn hàng lớn (≥ 500 SKU, mục tiêu 5.000 đơn/tháng), trong khi tự xây dựng giúp chủ động tối ưu chi phí hạ tầng.

Đánh đổi (trade-off) mà nhóm chấp nhận: thời gian ra mắt chậm hơn Buy khoảng 2–3 tháng và chi phí đầu tư ban đầu cao hơn — nhóm bù đắp bằng cách phát triển MVP theo từng Sprint, ưu tiên các tính năng In-scope trước khi mở rộng.

## **2B. Bảng tính toán Tổng chi phí sở hữu (TCO) cho phương án Buy/Build**

Công thức áp dụng: TCO \= Chi phí Setup ban đầu \+ Σ (Chi phí vận hành định kỳ OpEx). Số liệu dưới đây là giả định (đơn vị: VNĐ), dùng cho mục đích minh hoạ bài tập, lập chi tiết cho 3 năm đầu tiên hoạt động của dự án.

| Hạng mục chi phí | Năm 1 (Setup \+ OpEx) | Năm 2 (OpEx) | Năm 3 (OpEx) |
| :---- | ----- | ----- | ----- |
| **A. Chi phí Setup ban đầu** |  |  |  |
| Server Cloud (AWS/GCP) \- cấu hình khởi điểm | 30.000.000 đ | \- | \- |
| Domain, SSL, CDN | 5.000.000 đ | \- | \- |
| Chi phí nhân sự phát triển ban đầu (Dev, BA, QA, UI/UX \- 5 tháng) | 450.000.000 đ | \- | \- |
| Tích hợp cổng thanh toán (VNPay/Momo) \- phí khởi tạo | 20.000.000 đ | \- | \- |
| Xây dựng module AI Chatbot tư vấn (huấn luyện \+ tích hợp API) | 80.000.000 đ | \- | \- |
| Xây dựng module Group Deal & Gamification | 60.000.000 đ | \- | \- |
| **Tổng Setup** | **645.000.000 đ** | \- | \- |
| **B. Chi phí vận hành (OpEx) định kỳ** |  |  |  |
| Server Cloud & lưu trữ (vận hành) | 36.000.000 đ | 48.000.000 đ | 60.000.000 đ |
| Đội ngũ vận hành & bảo trì (Dev/BE/QA part-time) | 240.000.000 đ | 280.000.000 đ | 320.000.000 đ |
| Phí cổng thanh toán theo giao dịch (VNPay/Momo) | 24.000.000 đ | 36.000.000 đ | 50.000.000 đ |
| SMS/Email/OTP marketing & CSKH | 18.000.000 đ | 24.000.000 đ | 30.000.000 đ |
| Chi phí API AI (Chatbot tư vấn, AI quản trị) | 30.000.000 đ | 40.000.000 đ | 50.000.000 đ |
| Marketing vận hành Gamification / voucher | 20.000.000 đ | 30.000.000 đ | 40.000.000 đ |
| **Tổng OpEx** | **368.000.000 đ** | **458.000.000 đ** | **550.000.000 đ** |
| **TỔNG CHI PHÍ THEO NĂM (TCO)** | **1.013.000.000 đ** | **458.000.000 đ** | **550.000.000 đ** |

**Tổng TCO ước tính cho 3 năm đầu tiên: 2.021.000.000 đ.**

*Giả định: tỷ giá và mặt bằng chi phí nhân sự/hạ tầng tại Việt Nam năm hiện hành; chi phí có thể thay đổi theo quy mô traffic thực tế và mức độ sử dụng API AI.*

# **PHẦN 3\. PHƯƠNG ÁN ĐẢM BẢO RỦI RO PHÁP LÝ/THUẾ TẠI VIỆT NAM**

## **3.1. Pháp lý sàn & website**

* Thực hiện đăng ký/thông báo website TMĐT bán hàng với Bộ Công Thương theo Nghị định 52/2013/NĐ-CP (sửa đổi bởi Nghị định 85/2021/NĐ-CP) về TMĐT.

* Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân: xin sự đồng ý rõ ràng khi thu thập dữ liệu khách hàng phục vụ Chatbot AI tư vấn và AI phân tích hành vi, có chính sách lưu trữ/xoá dữ liệu minh bạch.

* Công bố đầy đủ Điều khoản sử dụng, Chính sách đổi trả/bảo hành cho từng nhóm sản phẩm (đặc biệt với thiết bị điện tử có bảo hành hãng).

* Minh bạch cơ chế Group Deal: công bố rõ điều kiện số lượng người tham gia, thời hạn deal, giá cuối cùng — tránh vi phạm quy định về khuyến mãi tại Nghị định 81/2018/NĐ-CP về xúc tiến thương mại.

## **3.2. Nghĩa vụ thuế TMĐT**

* Kê khai Thuế Giá trị gia tăng (VAT 8–10%) và Thuế Thu nhập doanh nghiệp (TNDN) theo doanh thu bán hàng thực tế trên hệ thống.

* Tự động hoá xuất Hoá đơn điện tử (HĐĐT) theo từng giao dịch, tuân thủ Nghị định 123/2020/NĐ-CP và các văn bản hướng dẫn về hoá đơn điện tử khởi tạo từ máy tính tiền.

* Đối với các giao dịch Group Deal có nhiều người mua chung, hệ thống OMS cần tách đúng hoá đơn theo từng khách hàng thực hiện thanh toán để đảm bảo kê khai thuế chính xác.

* Theo dõi các quy định cập nhật của cơ quan thuế về trách nhiệm khấu trừ/kê khai thay cho người bán trên sàn TMĐT (nếu SmartGear phát triển thêm mô hình cho phép nhà bán thứ ba tham gia).

## **3.3. Thanh toán & tiền tệ**

* Tuân thủ pháp lý: Chỉ tích hợp với các cổng thanh toán được Ngân hàng Nhà nước cấp phép theo Nghị định 52/2024/NĐ-CP. Toàn bộ giao dịch niêm yết và thực hiện thanh toán bắt buộc sử dụng đơn vị tiền tệ là Việt Nam Đồng (VNĐ). 

* Quản lý & Đối soát dòng tiền: Dòng tiền thu hộ được chuyển về tài khoản thanh toán định danh của doanh nghiệp. Hệ thống quản lý đơn hàng (OMS) tự động thực hiện quy trình đối soát dữ liệu hàng ngày giữa dữ liệu đơn hàng nội bộ và sao kê cổng thanh toán nhằm phát hiện kịp thời các giao dịch lệch trạng thái hoặc treo tiền. 

* Phòng chống gian lận: Thiết lập hạn mức và cảnh báo giao dịch bất thường (VD: Một tài khoản tạo nhiều đơn Group Deal giá trị lớn trong thời gian ngắn). Hệ thống tự động kích hoạt xác thực tăng cường (SMS/Email OTP hoặc 3D-Secure) để phòng chống rửa tiền và gian lận khuyến mãi.

## **3.4. Rủi ro đặc thù theo tính năng & phương án kiểm soát**

* AI Chatbot tư vấn: Rủi ro AI phản hồi sai lệch dẫn đến tư vấn sai thông số kỹ thuật hoặc thiên vị sản phẩm \-  Cần ràng buộc nguồn tra cứu chặt chẽ trên tập Dataset 500+ SKU đã kiểm duyệt đồng thời có quy trình QA kiểm thử định kỳ và cơ chế chuyển tiếp sang nhân viên tư vấn thật khi cần.

* Gamification: Rủi ro minigame bị coi là cờ bạc trá hình hoặc bị bot tự động cày mã giảm giá \- Cần tuân thủ định mức giải thưởng khuyến mại theo Nghị định 81/2018/NĐ-CP, đồng thời tích hợp mã Captcha và giới hạn tần suất tham gia. 

* AI quản lý hệ thống: Rủi ro rò rỉ dữ liệu cá nhân khách hàng và số liệu kinh doanh nhạy cảm- Cần phân quyền truy cập theo vai trò, mã hóa thông tin và định kỳ sao lưu dữ liệu theo Nghị định 13/2023/NĐ-CP. 

* Group Deal: Rủi ro phát sinh khiếu nại, tranh chấp tiêu dùng do "giam tiền" khách hàng khi nhóm không đủ người \- Cần thiết lập cơ chế tự động hủy giao dịch và hoàn tiền 100% trong vòng 24 giờ nếu deal thất bại.