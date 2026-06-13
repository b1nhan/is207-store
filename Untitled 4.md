# Distributed Consensus trong Hệ Thống Phân Tán

> Dịch và biên soạn từ bài viết _"Consensus in Distributed System"_ — SOURAJIT BHATTACHARJEE & Sahil Mahapatra (MTech CSE, IIT Kharagpur)

---

## Mở đầu — Câu chuyện về hai người bạn

> **Sahil:** Này Sourajit! Chơi gì đó đi! **Sourajit:** Chơi bóng đá đi. **Sahil:** Ừ được! Tụi mình đều thích môn đó mà.

Cả hai muốn chơi một trò gì đó. Sourajit đề xuất bóng đá, và Sahil đồng ý. Họ đã **thống nhất về một lựa chọn chung** — do một người đề xuất và người kia chấp thuận, sau đó cùng hành động theo đó.

Sự thống nhất về giá trị chung này gọi là **consensus** (đồng thuận).

---

## Phần 1 — WHAT: Distributed Consensus là gì?

Trong hệ thống phân tán (_distributed system_), nhiều máy tính — gọi là các **node** — kết nối và cộng tác với nhau thông qua việc truyền tin (_message passing_). Trong quá trình tính toán, các node cần **thống nhất về một giá trị chung** để phối hợp giữa các tiến trình. Hiện tượng này gọi là **Distributed Consensus**.

---

## Phần 2 — WHY: Tại sao cần Consensus?

Trong hệ thống phân tán, có thể xảy ra trường hợp nhiều node đang xử lý những tính toán lớn theo kiểu phân tán, và chúng cần biết kết quả của từng node để giữ cho toàn bộ hệ thống luôn được cập nhật đồng bộ. Trong tình huống đó, các node cần **thống nhất về một giá trị chung** — và đây chính là lúc Consensus trở nên cần thiết.

**Ví dụ thực tế:** Hãy hình dung hệ thống đặt vé máy bay. Khi hàng trăm người cùng lúc cố đặt chiếc ghế cuối cùng còn trống, nhiều server khác nhau đang xử lý đồng thời các yêu cầu này. Nếu không có cơ chế đồng thuận, nhiều người có thể cùng được xác nhận đặt vé thành công cho **một chiếc ghế duy nhất** — dẫn đến hỗn loạn khi lên máy bay.

---

## Phần 3 — Cách đạt được Consensus

Giả sử có một hệ thống phân tán với `n` node. Một node gửi thông điệp đến tất cả các node còn lại: _"Tôi chọn giá trị v, các bạn có đồng ý không?"_

Lúc này có thể xảy ra hai tình huống:

- Tất cả đồng ý với giá trị `v`
- Một số node không đồng ý

**Tình huống 1:** Tất cả node tiến hành công việc với `v` làm giá trị chung. Đơn giản.

**Tình huống 2:** Một node phản hồi: _"Tôi thích giá trị w hơn."_ Lúc này việc đạt được đồng thuận trở nên phức tạp.

Để đạt được consensus, tất cả node trong hệ thống phải tuân theo **cùng một giao thức** khi giao tiếp. Có ba điều kiện cơ bản mà hệ thống cần thỏa mãn:


1. **Agreement** (Nhất trí): Tất cả node không bị lỗi phải đồng ý về cùng một giá trị
2. **Validity** (Hợp lệ)      | Giá trị được chọn phải do một node không bị lỗi đề xuất; các node còn lại cũng phải quyết định giá trị đó |
3. **Termination** (Kết thúc) | Mọi node không bị lỗi đều phải đi đến quyết định — không được treo mãi mãi

> **Node không bị lỗi** (_non-faulty node_) là node không bị crash, không bị tấn công, và hoạt động bình thường.

---

## Phần 4 — WHAT IF NOT: Nếu không có Consensus thì sao?

### Thách thức: Hai loại lỗi trong hệ thống phân tán

Một hệ thống phân tán chủ yếu đối mặt với hai loại lỗi:

#### Crash Failure (Lỗi sập node)

Xảy ra khi một node ngừng phản hồi các node khác do lỗi phần cứng, phần mềm, hoặc mạng. Đây là vấn đề phổ biến và có thể xử lý tương đối đơn giản bằng cách bỏ qua node đó.

**Ví dụ thực tế:** Một server trong cụm xử lý đơn hàng của sàn thương mại điện tử bị mất điện đột ngột. Hệ thống phát hiện server không phản hồi và chuyển toàn bộ yêu cầu sang các server còn lại — người dùng gần như không cảm nhận được gián đoạn.

#### Byzantine Failure (Lỗi "kẻ phản bội")

Xảy ra khi một hoặc nhiều node **không sập**, nhưng lại **hành xử bất thường** — gửi các thông điệp khác nhau đến các node khác nhau, do bị tấn công từ bên trong hoặc bên ngoài. Xử lý loại lỗi này trong hệ thống phân tán rất phức tạp.

**Ví dụ thực tế:** Một node trong mạng thanh toán bị hacker kiểm soát. Node đó không sập mà hoạt động bình thường — nhưng cố tình báo cáo số dư tài khoản sai cho các node khác nhau, khiến toàn hệ thống nhận được thông tin mâu thuẫn nhau.

> Một thuật toán consensus nếu xử lý được **Byzantine failure** thì có thể xử lý được **mọi loại** vấn đề consensus trong hệ thống phân tán.

---

## Phần 5 — Các thuật toán Consensus

### Nhóm 1: Voting-based (Dựa trên bỏ phiếu)

Những cài đặt đầu tiên của consensus sử dụng các kỹ thuật bỏ phiếu. Chúng có đủ khả năng chịu lỗi và có nền tảng toán học vững chắc để đảm bảo tính an toàn và ổn định. Tuy nhiên, do tính chất "dân chủ" của chúng, các thuật toán này **rất chậm và kém hiệu quả** khi mạng ngày càng lớn hơn.

#### Practical Byzantine Fault Tolerance (pBFT)

Hãy hiểu **pBFT** qua câu chuyện kinh điển về **Bài toán các Tướng Byzantine**:

> Nhiều đội quân Byzantine đang bao vây một thành phố, mỗi đội do một tướng chỉ huy. Các tướng chỉ có thể liên lạc với nhau qua người đưa tin. Sau khi quan sát kẻ thù, họ phải thống nhất một kế hoạch chung.
> 
> Tuy nhiên, **một số tướng là kẻ phản bội**, cố tình ngăn các tướng trung thành đạt được thỏa thuận. Các tướng cần chọn thời điểm tấn công, nhưng phải có đủ đa số quân cùng tấn công một lúc mới thắng được.
> 
> Thuật toán phải đảm bảo: **(a)** tất cả tướng trung thành quyết định cùng một kế hoạch, và **(b)** một số ít kẻ phản bội không thể khiến các tướng trung thành chọn kế hoạch tệ.

"Cha đẻ của Hệ thống Phân tán" **Leslie Lamport** đã chứng minh:

> **Nếu hơn 2/3 tổng số node trong hệ thống là trung thực, thì có thể đạt được consensus.**

**Ví dụ thực tế:** Trong mạng blockchain doanh nghiệp dùng pBFT với 10 node, kẻ tấn công phải kiểm soát ít nhất 4 node (hơn 1/3) mới có thể phá vỡ hệ thống. Chi phí tấn công tăng theo quy mô mạng, khiến việc phá hoại ngày càng khó khả thi.

**Cơ chế hoạt động — pBFT chia hệ thống thành 3 giai đoạn** (_pre-prepare → prepare → commit_), với một node đóng vai **Primary** (leader) và các node còn lại là **Secondary** (backup). Mục tiêu là tất cả node không bị lỗi cùng đồng thuận về trạng thái hệ thống theo nguyên tắc đa số.

**Một vòng đồng thuận pBFT diễn ra như sau:**

1. Client gửi yêu cầu đến node Primary
2. Node Primary phát tán yêu cầu đến tất cả node Secondary
3. Tất cả node thực hiện dịch vụ được yêu cầu và gửi phản hồi về cho client
4. Yêu cầu được coi là thành công khi client nhận được **ít nhất 2/3 phản hồi giống nhau** từ tổng số node
5. Nếu node Primary không phát tán yêu cầu trong khoảng thời gian cho phép, nó sẽ bị thay thế bởi một node Primary mới thông qua **"view change protocol"**

#### Các thuật toán voting-based đáng chú ý khác

- **HotStuff** — tối ưu hóa hiệu suất pBFT cho blockchain
- **Paxos** — nền tảng lý thuyết, dùng trong Google Spanner, Apache Zookeeper
- **Raft** — đơn giản hơn Paxos, dùng trong Kubernetes (etcd), CockroachDB

---

### Nhóm 2: Proof-based (Dựa trên bằng chứng)

Cùng với sự phát triển của công nghệ blockchain và sổ cái phân tán (_distributed ledger_), mạng lưới trở nên rộng lớn hơn đáng kể và không cần "xin phép" để tham gia (_permissionless_). Trong bối cảnh đó, kỹ thuật đồng thuận dựa trên bằng chứng trở nên phù hợp hơn. Thay vì bỏ phiếu, mỗi người tham gia phải **chứng minh một điều gì đó** mới có quyền tham gia vào quá trình ra quyết định.

Một số thuật toán proof-based phổ biến:

- **Proof of Work (PoW)** — Bitcoin: miner phải giải bài toán tính toán phức tạp để được quyền ghi block mới
- **Proof of Stake (PoS)** — Ethereum: validator "cược" tài sản của mình để có quyền xác nhận giao dịch

---

## Ứng dụng thực tế của Distributed Consensus

Các thuật toán consensus được dùng rộng rãi trong nhiều ứng dụng thực tế trên các mạng phân tán hoặc phi tập trung:

- ✅ **Blockchain và tiền mã hóa** — đồng thuận về lịch sử giao dịch không thể giả mạo
- ✅ **Google PageRank** — các server phân tán đồng thuận về điểm xếp hạng trang web
- ✅ **Cân bằng tải** (_load balancing_) — các node đồng thuận về việc phân phối yêu cầu

---

## Tổng kết nhanh

```
Consensus = cơ chế để nhiều node phân tán
            thống nhất về một giá trị chung,
            dù có node crash (Crash Failure)
            hay node gian lận (Byzantine Failure).
```

|Loại thuật toán|Ví dụ|Xử lý được|
|---|---|---|
|Voting-based|Raft, Paxos, pBFT|Crash + Byzantine failure|
|Proof-based|PoW, PoS|Byzantine failure quy mô lớn|

---

_Nguồn: Sourajit Bhattacharjee & Sahil Mahapatra — MTech CSE, IIT Kharagpur_ _Tham khảo thêm: preethikasireddy.com, baeldung.com, geeksforgeeks.org_