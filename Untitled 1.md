# TÀI LIỆU ÔN THI TỔNG HỢP MÔN PHÂN TÍCH VÀ THIẾT KẾ QUY TRÌNH NGHIỆP VỤ (EC201)

Chào các em sinh viên, với tư cách là giảng viên phụ trách học phần, thầy biên soạn tài liệu này nhằm giúp các em hệ thống hóa kiến thức cốt lõi, từ lý thuyết học thuật đến kỹ năng thực hành để chuẩn bị tốt nhất cho kỳ thi kết thúc học phần. Hãy tập trung vào các công thức định lượng và logic rẽ nhánh trong BPMN – đây là những nội dung thường xuyên xuất hiện trong đề thi.

## 1. Tổng quan về Quản trị Quy trình Kinh doanh (BPM)

### Khái niệm Cải tiến quy trình (Process Improvement)

Cải tiến quy trình là quá trình tìm kiếm những cơ hội để thay đổi quy trình kinh doanh hiện tại. Mục tiêu cốt lõi là tối ưu hóa kết quả, nâng cao hiệu quả hoạt động, đạt được các tiêu chuẩn thực hành tốt nhất (best practices) và cải thiện chất lượng dịch vụ/sản phẩm đầu ra.

### Vòng đời Quản trị Quy trình Kinh doanh (BPM Life Cycle)

Các em cần nắm vững 6 giai đoạn và đầu ra (output) tương ứng của chúng để hiểu sự vận hành của một dự án BPM:

1. **Xác định quy trình (Process identification):** Xác định phạm vi. Đầu ra là **Kiến trúc quy trình (Process architecture)**.
2. **Khám phá quy trình (Process discovery):** Thu thập dữ liệu thực tế. Đầu ra là **Mô hình quy trình hiện trạng (As-is process model)**.
3. **Phân tích quy trình (Process analysis):** Nhận diện vấn đề. Đầu ra là **Các hiểu biết về điểm yếu và tác động (Insights on weaknesses)**.
4. **Thiết kế lại quy trình (Process redesign):** Đề xuất thay đổi. Đầu ra là **Mô hình quy trình tương lai (To-be process model)**.
5. **Triển khai quy trình (Process implementation):** Chuyển đổi sang hệ thống. Đầu ra là **Mô hình quy trình có thể thực thi (Executable process model)**.
6. **Kiểm soát quy trình (Process monitoring and controlling):** Đo lường thực tế. Đầu ra là **Thông tin về tính tuân thủ và hiệu suất (Conformance & Performance insights)**.

## 2. Nhận diện và Khám phá Quy trình

### Bảng tra cứu thuật ngữ Anh - Việt chuyên ngành

Sử dụng chính xác thuật ngữ là yêu cầu bắt buộc trong bài thi mô hình hóa:

|   |   |
|---|---|
|Thuật ngữ tiếng Anh|Cách dịch chuyên ngành|
|Business process|Quy trình nghiệp vụ / quy trình kinh doanh|
|Control flow|Luồng điều khiển|
|Gateway|Cổng rẽ nhánh / cổng điều khiển luồng|
|Data object / Business object|Đối tượng dữ liệu / đối tượng nghiệp vụ|
|Resource|Nguồn lực tham gia quy trình|
|Pool / Lane|Pool / Lane (Vùng chứa / Làn đường)|
|As-is process|Quy trình hiện trạng|
|To-be process|Quy trình tương lai|
|Process discovery|Khám phá quy trình|
|Claim / Claimant|Yêu cầu bồi thường / người yêu cầu bồi thường|

### Vai trò của Khám phá Quy trình trong Kiến trúc Hệ thống

Khám phá quy trình không chỉ đơn thuần là vẽ lại sơ đồ. Nó đóng vai trò là "chiếc cầu nối" then chốt: biến một **Kiến trúc quy trình** (bức tranh tổng thể cấp cao) thành một **Mô hình quy trình hiện trạng (As-is)** chi tiết. Nếu không có bước Discovery này, các em sẽ không thể thấy được sự sai lệch giữa quy trình "trên giấy tờ" và quy trình vận hành thực tế.

## 3. Phân tích Quy trình Định tính và Định lượng

### Phân tích Định tính (VA/BVA/NVA & 7 Wastes)

Trong bài thi, khi được yêu cầu phân tích các hoạt động, các em phải phân loại theo 3 nhóm:

- **Giá trị gia tăng (Value-adding - VA):** Các bước trực tiếp tạo ra giá trị mà khách hàng sẵn lòng chi trả.
- **Giá trị gia tăng nghiệp vụ (Business Value-adding - BVA):** Các hoạt động cần thiết cho việc vận hành kinh doanh (như tuân thủ pháp lý, kiểm soát rủi ro) nhưng không tạo giá trị trực tiếp cho khách hàng. Mục tiêu là **giảm thiểu**.
- **Không tạo giá trị gia tăng (Non-Value-adding - NVA):** Các lãng phí cần **loại bỏ**.

**7 Loại lãng phí (7 Wastes) của Lean cần nhận diện:**

1. **Sản xuất thừa (Overproduction):** Làm nhiều hơn mức cần thiết.
2. **Chờ đợi (Waiting):** Thời gian chết giữa các bước.
3. **Vận chuyển (Transport):** Di chuyển hồ sơ/vật tư không cần thiết.
4. **Xử lý thừa (Overprocessing):** Các bước kiểm tra chồng chéo.
5. **Tồn kho (Inventory):** Hồ sơ tồn đọng chưa xử lý.
6. **Cử động thừa (Motion):** Thao tác dư thừa của nhân viên.
7. **Lỗi (Defects):** Sai sót dẫn đến phải làm lại (Rework).

_Gợi ý:_ Sử dụng sơ đồ xương cá (Ishikawa) để truy tìm nguyên nhân gốc rễ của các lãng phí này.

### Phân tích Dòng chảy Định lượng

Đây là phần các em thường mất điểm do quên công thức. Hãy ghi nhớ:
![[Pasted image 20260611062758.png]]
- **Thời gian chu kỳ (Cycle Time - CT):** CT = \text{Thời gian xử lý (Processing Time)} + \text{Thời gian chờ (Waiting Time)}
- **Hiệu suất thời gian chu kỳ (Cycle Time Efficiency - CTE):** CTE = \frac{\text{Thời gian chu kỳ lý thuyết (Theoretical CT)}}{\text{Tổng thời gian chu kỳ thực tế (Total CT)}} _Trong đó, thời gian lý thuyết chỉ bao gồm các hoạt động VA._

**Ý nghĩa:** Chỉ số CTE thấp cho biết quy trình đang tồn tại nhiều "điểm nghẽn" hoặc thời gian chờ đợi lãng phí. Mục tiêu của phân tích định lượng là làm cho quy trình "nhanh hơn, rẻ hơn" dựa trên dữ liệu thực tế.

## 4. Mô hình hóa quy trình với ký hiệu BPMN

### Phân biệt Tác vụ trong Hệ thống điều khiển (Process Engine)

Khi mô hình hóa để thực thi hệ thống, cần phân biệt rõ:

- **Service Task (Tác vụ tự động - Biểu tượng hai bánh răng):** Các web services được hệ thống thực hiện hoàn toàn tự động (Kiến trúc SOA).
- **User Task (Tác vụ con người - Biểu tượng hình người):** Nhiệm vụ do con người thực hiện nhưng dưới sự điều phối của hệ thống (ví dụ: nhân viên nhận thông báo duyệt đơn trên phần mềm).

**Pro-tip dành cho sinh viên:** Đừng bao giờ nhầm lẫn giữa **Luồng điều khiển (Control Flow)** – thể hiện thứ tự bước đi, và **Luồng thông báo (Message Flow)** – thể hiện sự trao đổi giữa hai Pool khác nhau.

## 5. Cải tiến và Thiết kế lại Quy trình (Process Redesign)

### Bảng so sánh 3 cấp độ thay đổi

|   |   |   |   |
|---|---|---|---|
|Tiêu chí|Cải tiến (Improvement)|Thiết kế lại (Redesign)|Đổi mới (Innovation)|
|**Mục tiêu**|Tối ưu hiệu suất hiện tại|Thay đổi cấu trúc hiện có|Sáng tạo quy trình mới|
|**Phạm vi**|Cục bộ, từng phần|Toàn diện|Cách mạng, đột phá|
|**Rủi ro**|Thấp|Cao|Rất cao|
|**Chi phí**|Thấp|Cao|Rất cao|
|**Ví dụ**|Loại bỏ bước ký tên thừa|Chuyển từ mua hàng Offline sang Online|Áp dụng AI cá nhân hóa hoàn toàn|

### Mô hình Tứ giác đối nghịch (The Devil’s Quadrangle)

Khi cải tiến, chúng ta luôn đối mặt với sự đánh đổi (trade-offs) giữa 4 chiều: **Thời gian (Time), Chi phí (Cost), Chất lượng (Quality), và Tính linh hoạt (Flexibility)**. _Ví dụ:_ Muốn tăng Chất lượng thường phải tăng thêm các bước kiểm tra, điều này dẫn đến tăng Chi phí và kéo dài Thời gian. Đây là lý do nó được gọi là "Tứ giác của quỷ".

### Cách tiếp cận Redesign

- **Exploitative Redesign (Khai thác):** Mang tính phân tích (Analytical) và hướng nội (Inward-looking). Tập trung tối ưu quy trình hiện có (như 7FE).
- **Explorative Redesign (Khám phá):** Mang tính sáng tạo (Creative) và hướng ngoại (Outward-looking). Đổi mới toàn diện dựa trên góc nhìn khách hàng hoặc công nghệ mới.

## 6. Các phương pháp cải tiến cụ thể

### Phương pháp 7FE (Seven Forms of Efficiency)

7FE là cách tiếp cận hướng nội để tối ưu hóa hiệu quả:

1. **Functional Efficiency:** Đảm bảo mọi bước đều tạo giá trị (Loại bỏ phê duyệt thừa).
2. **Flow Efficiency:** Giảm điểm nghẽn/thời gian chờ (Tự động hóa chuyển giao).
3. **Financial Efficiency:** Tối ưu nguồn lực tài chính (Giảm chi phí vật tư).
4. **Flexibility Efficiency:** Tăng khả năng thích ứng (Sử dụng nguồn lực đa năng).
5. **Failure Efficiency:** Giảm lỗi (Kiểm tra chất lượng tự động).
6. **Frequency Efficiency:** Tối ưu tần suất thực hiện (Điều chỉnh lịch giao hàng).
7. **Focus Efficiency:** Tập trung hoạt động cốt lõi (Phân công vai trò rõ ràng).

### Kỹ thuật Heuristic (4 Quy tắc vàng)

1. **Eliminate (Loại bỏ):** Triệt tiêu các hoạt động NVA.
2. **Combine (Kết hợp):** Ghép các bước có cùng nguồn lực.
3. **Rearrange (Sắp xếp lại):** Thay đổi trình tự để giảm thời gian chờ.
4. **Simplify (Đơn giản hóa):** Giảm độ phức tạp của các thao tác.

## 7. Quản trị thay đổi trong BPM

### Quy trình 4 bước triển khai

- **Bước 1: Đề xuất:** Điều chỉnh quy trình để loại bỏ lãng phí.
- **Bước 2: Chuẩn bị:** Đảm bảo phương tiện kỹ thuật và tài nguyên.
- **Bước 3: Truyền thông:** Đào tạo nhân viên về quy trình mới.
- **Bước 4: Điều chỉnh:** Rà soát và cải tiến liên tục (Continuous Improvement).

### Chiến lược loại bỏ trở ngại

Để vượt qua kháng cự từ con người, lãnh đạo cần:

- **Truyền đạt tầm nhìn:** Giải thích lý do và lợi ích của thay đổi.
- **Loại bỏ rào cản cơ cấu:** Điều chỉnh hệ thống lương thưởng và mô tả công việc phù hợp tầm nhìn mới.
- **Tạo chiến thắng ngắn hạn (Short-term wins):** Chọn các dự án nhỏ, chắc chắn thành công để tạo động lực và niềm tin cho tổ chức.

## 8. Case Study và Bài tập thực hành

### Case Study Ford: Bài học về Tái cấu trúc (Reengineering)

- **Trước cải tiến:** Ford có 500 nhân viên chỉ để đối chiếu bộ 3 chứng từ (Đơn hàng, Phiếu nhập kho, Hóa đơn). Sai sót nhiều dẫn đến chậm thanh toán.
- **Sau cải tiến:** Họ chuyển từ việc "kiểm tra chứng từ giấy" sang "truy xuất dữ liệu chung". Khi hàng đến, kho chỉ cần kiểm tra với dữ liệu trên Database. Nếu khớp, hệ thống tự động thanh toán.
- **Kết quả:** Giảm **75% nhân sự** tại bộ phận kế toán phải trả, thông tin tài chính chính xác tuyệt đối.

### Bài tập 3.16: Quy trình bồi thường thiệt hại

**Lời khuyên về logic BPMN:** Khi giải quyết bài toán này, các em cần chú ý sử dụng cổng rẽ nhánh **XOR (Exclusive Gateway)** để xử lý tình trạng nộp phí của chủ sở hữu:

- **Nhánh 1:** Đã nộp đủ phí -> Ấn định ngày điều trần.
- **Nhánh 2:** Cần nộp thêm và đã nộp -> Lập biên lai phí bổ sung -> Ấn định ngày điều trần.
- **Nhánh 3:** Chưa nộp đủ -> Lập thông báo phí -> Chờ thanh toán -> Quay lại bước đánh giá tính hợp lệ (Loop).

_Lưu ý:_ Quy trình chỉ kết thúc sau khi ngày điều trần đã được ấn định. Hãy đảm bảo mọi luồng đi đều dẫn đến kết quả cuối cùng này.

Chúc các em ôn tập tốt và đạt kết quả cao nhất trong kỳ thi sắp tới!