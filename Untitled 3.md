# Distributed Consensus trong Hệ Thống Phân Tán

> Tài liệu này được dịch và biên soạn lại từ bài viết _"Consensus in Distributed System"_ — SOURAJIT BHATTACHARJEE & Sahil Mahapatra (IIT Kharagpur)

---

## Phần 1 — WHAT: Distributed Consensus là gì?

### Câu chuyện mở đầu

Hai người bạn, Minh và Tuấn, đang rảnh và muốn chơi gì đó cùng nhau.

> **Minh:** Tao muốn chơi game. Mày thích gì? **Tuấn:** Bóng đá đi! **Minh:** Ừ được, bóng đá thôi!

Hai người đã **thống nhất** được một quyết định chung — chơi bóng đá — dựa trên đề xuất của một người và sự đồng ý của người còn lại. Đây chính là **consensus** (sự đồng thuận).

---

### Định nghĩa

Trong hệ thống phân tán (_distributed system_), nhiều máy tính — gọi là các **node** — kết nối và phối hợp với nhau thông qua việc truyền tin (_message passing_). Trong quá trình xử lý, các node cần **thống nhất về một giá trị chung** để phối hợp hành động. Cơ chế làm được điều đó gọi là **Distributed Consensus**.

> **Nói đơn giản hơn:** Distributed Consensus là cách để một nhóm máy tính "bỏ phiếu" và đi đến quyết định chung — dù có một số máy trong nhóm bị lỗi hoặc phản hồi sai.

---

### Ví dụ thực tế: Hệ thống thanh toán ngân hàng

Giả sử bạn chuyển 5 triệu đồng cho một người bạn. Giao dịch này có thể được xử lý đồng thời bởi nhiều server khác nhau (ở Hà Nội, ở TP.HCM, ở nước ngoài). Nếu không có cơ chế đồng thuận, có thể xảy ra tình huống:

- Server A ghi nhận: **đã trừ tiền**
- Server B ghi nhận: **chưa trừ tiền**
- Server C ghi nhận: **trừ tiền 2 lần**

→ Tài khoản của bạn bị sai. Distributed Consensus chính là thứ ngăn điều này xảy ra.

---

### Ba tính chất bắt buộc của Consensus

Để được coi là đạt đồng thuận hợp lệ, một hệ thống phải đảm bảo đồng thời ba điều:

|Tính chất|Ý nghĩa|Ví dụ|
|---|---|---|
|**Agreement** (Nhất trí)|Tất cả các node không bị lỗi phải đồng ý về cùng một giá trị|Mọi server đều ghi nhận "đã trừ 5 triệu"|
|**Validity** (Hợp lệ)|Giá trị được chọn phải là giá trị do một node thực sự đề xuất — không được "bịa ra"|Giá trị 5 triệu phải do client gửi lên, không phải server tự đặt|
|**Termination** (Kết thúc)|Hệ thống phải đi đến quyết định trong thời gian hữu hạn — không được treo mãi mãi|Giao dịch phải được xác nhận hoặc từ chối, không treo indefinitely|

---

### Hai kịch bản xảy ra khi đề xuất giá trị

Giả sử trong mạng có `n` node, một node gửi đi đề nghị: _"Tôi chọn giá trị v, các bạn đồng ý không?"_

- **Kịch bản 1 — Thuận lợi:** Tất cả các node đều chấp nhận `v`. Hệ thống đạt đồng thuận dễ dàng.
- **Kịch bản 2 — Phức tạp:** Một node khác phản hồi: _"Tôi thích giá trị w hơn."_ → Lúc này cần một thuật toán để phân xử và đi đến quyết định cuối cùng.

---

### Byzantine Fault Tolerance (BFT) — Vấn đề của những "kẻ phản bội"

Có một tình huống đặc biệt phức tạp hơn được mô phỏng qua bài toán kinh điển **Byzantine Generals Problem** (Bài toán các Tướng Byzantine):

> Một nhóm tướng quân đang bao vây thành. Họ phải **đồng thuận** về quyết định: **tấn công** hay **rút lui**. Nếu chỉ một số tấn công còn số khác rút lui → thất bại hoàn toàn. Vấn đề: **một số tướng là kẻ phản bội**, cố tình gửi thông tin sai để phá vỡ sự đồng thuận.

Trong hệ thống máy tính, "tướng phản bội" tương ứng với **node bị tấn công hoặc gửi dữ liệu sai** (Byzantine fault). Thuật toán **pBFT** (Practical Byzantine Fault Tolerance) giải quyết vấn đề này bằng quy tắc:

- Cần tối thiểu **3f + 1** node để chịu được tối đa **f** node phản bội
- Tức là, nếu có 10 node, hệ thống chịu được tối đa 3 node gian lận và vẫn đưa ra quyết định đúng

---

### Các thuật toán Consensus phổ biến

|Thuật toán|Loại lỗi xử lý|Dùng ở đâu|
|---|---|---|
|**Raft**|Node bị crash (không gian lận)|etcd, Kubernetes, CockroachDB|
|**Paxos**|Node bị crash (không gian lận)|Google Spanner, Zookeeper|
|**pBFT**|Node gian lận / tấn công|Hyperledger Fabric, blockchain doanh nghiệp|
|**PoW / PoS**|Node gian lận ở quy mô lớn|Bitcoin, Ethereum|

---

## Phần 2 — WHY: Tại sao hệ thống microservice cần Consensus?

### Microservice là gì — và tại sao nó "cần bạn bè"?

Trong kiến trúc microservice, một ứng dụng lớn được tách ra thành nhiều service nhỏ độc lập — mỗi service chạy trên máy chủ riêng và giao tiếp với nhau qua mạng. Ví dụ: ứng dụng đặt vé máy bay có thể gồm các service: `booking-service`, `payment-service`, `inventory-service`, `notification-service`,...

Vấn đề: các service này **không chia sẻ bộ nhớ chung**. Mỗi service có database riêng. Khi cần phối hợp (ví dụ: "đã thanh toán chưa để tôi trừ ghế?"), chúng phải **đồng thuận qua mạng** — và mạng thì không đáng tin tuyệt đối.

---

### Lý do 1: Nhất quán dữ liệu (_Data Consistency_)

**Ví dụ thực tế — Flash sale trên Shopee:**

Đợt 12/12, một chiếc điện thoại còn **1 chiếc** trong kho. Có 500 người cùng lúc nhấn "Mua ngay". Hàng chục server xử lý đồng thời. Nếu không có đồng thuận:

- Server A: _"Còn hàng, bán cho user 1"_
- Server B (chưa biết): _"Còn hàng, bán cho user 2"_
- Server C (chưa biết): _"Còn hàng, bán cho user 3"_

→ 1 sản phẩm bán cho 3 người. Khiếu nại, hoàn tiền, mất uy tín.

Với Distributed Consensus, các server sẽ thống nhất: _"Chỉ có 1 chiếc — user 1 thắng, phần còn lại từ chối."_

---

### Lý do 2: Bầu chọn Leader (_Leader Election_)

Nhiều hệ thống microservice cần một node đóng vai trò **điều phối viên** (leader) — ví dụ node phân phối task cho các worker. Nhưng leader có thể bị crash bất cứ lúc nào.

**Ví dụ thực tế — Hệ thống xử lý đơn hàng của Tiki:**

Giả sử `order-coordinator` (node leader) đột ngột sập. Nếu không có cơ chế bầu chọn leader mới:

- Các worker đứng chờ mãi không có task
- Đơn hàng mới không được xử lý
- Khách hàng chờ xác nhận vô thời hạn

Thuật toán **Raft** giải quyết điều này bằng cách tự động tổ chức bầu chọn: các node còn sống sẽ "bỏ phiếu" và bầu ra một leader mới trong vài giây — khách hàng gần như không cảm nhận được sự gián đoạn.

---

### Lý do 3: Nhân bản dữ liệu (_Data Replication_)

Để chịu được lỗi, dữ liệu được sao chép sang nhiều node. Nhưng khi có ghi mới, các bản sao phải được cập nhật **theo đúng thứ tự** và **nhất quán**.

**Ví dụ thực tế — Cập nhật điểm thưởng MoMo:**

Bạn thanh toán bằng MoMo và nhận 100 điểm thưởng. Dữ liệu điểm thưởng được nhân bản trên 5 server. Nếu không có đồng thuận về thứ tự ghi:

- Server 1: +100 điểm, sau đó -50 điểm → còn 50 điểm ✅
- Server 2: -50 điểm (chưa có +100), sau đó +100 → còn 50 điểm ✅ (may mắn)
- Server 3: chỉ nhận được -50 điểm, không nhận +100 → còn -50 điểm ❌

→ Tra cứu điểm thưởng từ các server trả về kết quả khác nhau. Consensus đảm bảo mọi server đồng ý về **thứ tự** và **nội dung** các thao tác ghi.

---

### Lý do 4: Giao dịch phân tán (_Distributed Transaction_)

Trong microservice, một hành động người dùng (ví dụ: đặt hàng) có thể chạm tới 3–4 service khác nhau. Tất cả phải **cùng thành công hoặc cùng thất bại** — không thể có trạng thái "nửa vời".

Đây gọi là tính **Atomicity** (nguyên tử), và Consensus chính là nền tảng để đảm bảo điều này trong môi trường phân tán.

---

## Phần 3 — WHAT IF: Chuyện gì xảy ra nếu không có Consensus?

### Kịch bản 1: Dữ liệu không nhất quán — "Split Brain"

**"Split Brain"** xảy ra khi mạng bị phân vùng (_network partition_): hai nhóm node bị cắt đứt liên lạc với nhau nhưng vẫn tiếp tục hoạt động độc lập, mỗi nhóm nghĩ mình là "sự thật".

**Ví dụ thực tế — Hệ thống đặt phòng khách sạn:**

> Phòng 101 còn 1 phòng trống. Mạng bị lỗi, server Hà Nội và server TP.HCM mất liên lạc.
> 
> - Server Hà Nội: cho khách A đặt phòng 101 → ghi "đã đặt"
> - Server TP.HCM (không biết): cho khách B đặt phòng 101 → ghi "đã đặt"
> 
> Khi mạng phục hồi: cả hai đều nghĩ mình đúng. Hai khách cùng check-in → hỗn loạn.

Không có Consensus → **không có ai phân xử** → dữ liệu bị xung đột và hệ thống không biết phải tin ai.

---

### Kịch bản 2: Mất giao dịch hoặc thực hiện giao dịch hai lần

**Ví dụ thực tế — Chuyển tiền ngân hàng:**

> Bạn chuyển 10 triệu. `payment-service` thực hiện giao dịch. Vừa xong thì node đó crash trước khi thông báo cho `account-service`.
> 
> Khi node khởi động lại, không có đồng thuận về trạng thái cũ:
> 
> - Nếu hệ thống **thực hiện lại**: 20 triệu bị trừ ❌
> - Nếu hệ thống **bỏ qua**: giao dịch mất, người nhận không nhận được tiền ❌

Consensus đảm bảo hệ thống **ghi nhớ chính xác** điều gì đã xảy ra trước khi crash, tránh cả hai trường hợp trên.

---

### Kịch bản 3: Không bầu được Leader — Hệ thống đóng băng

Không có cơ chế đồng thuận để bầu leader, các node "tranh giành" vô hồi hoặc không ai dám nhận vai trò điều phối → toàn bộ hệ thống **đứng yên**.

**Ví dụ thực tế — Kubernetes cluster:**

Kubernetes dùng **etcd** (dựa trên Raft) để lưu trạng thái cluster. Nếu etcd không có đồng thuận:

- Không biết pod nào đang chạy, pod nào đã chết
- Không thể scale up/down
- Không thể deploy service mới
- Toàn bộ hệ thống vào trạng thái không xác định

---

### Kịch bản 4: Node gian lận phá hoại cả hệ thống

Không có BFT Consensus, chỉ cần **một node bị tấn công** và bắt đầu gửi dữ liệu sai → toàn hệ thống bị nhiễm độc thông tin.

**Ví dụ thực tế — Mạng blockchain:**

Trong một mạng blockchain không có BFT, kẻ tấn công kiểm soát một node và liên tục xác nhận các giao dịch gian lận. Với pBFT, cần kiểm soát ít nhất **1/3 tổng số node** mới phá được hệ thống — điều này làm chi phí tấn công tăng lên rất nhiều lần.

---

## Tổng kết

```
                    ┌─────────────────────────────────────┐
                    │        DISTRIBUTED CONSENSUS         │
                    └──────────────┬──────────────────────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
    ┌─────────────┐       ┌──────────────┐       ┌──────────────────┐
    │    WHAT     │       │     WHY      │       │    WHAT IF NOT   │
    │─────────────│       │──────────────│       │──────────────────│
    │ Thống nhất  │       │ Nhất quán    │       │ Split Brain      │
    │ giá trị     │       │ dữ liệu      │       │ Giao dịch trùng  │
    │ chung giữa  │       │ Bầu Leader   │       │ Hệ thống đóng   │
    │ các node    │       │ Replication  │       │ băng             │
    │ phân tán    │       │ Distributed  │       │ Node gian lận    │
    │             │       │ Transaction  │       │ phá hoại         │
    └─────────────┘       └──────────────┘       └──────────────────┘
```

|Thuật toán|Kẻ địch|Ứng dụng thực tế|
|---|---|---|
|**Raft**|Node crash|Kubernetes (etcd), CockroachDB|
|**Paxos**|Node crash|Google Spanner, Apache Zookeeper|
|**pBFT**|Node gian lận|Hyperledger Fabric|
|**PoW**|Node gian lận quy mô lớn|Bitcoin|

> **Một câu để nhớ:** Distributed Consensus là "trọng tài" trong thế giới phân tán — đảm bảo rằng dù mạng có chập chờn, dù node có crash, dù kẻ xấu có cố phá — hệ thống vẫn đi đến **một sự thật duy nhất**.

---

_Nguồn tham khảo: Sourajit Bhattacharjee & Sahil Mahapatra (IIT Kharagpur), preethikasireddy.com, baeldung.com, geeksforgeeks.org_