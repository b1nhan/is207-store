---

KEY POINTS TO REMEMBER — CONSENSUS IN DISTRIBUTED SYSTEMS

Every distributed system requires consensus because nodes processing computations independently must agree on a shared value to keep the entire system synchronized and consistent.

Mỗi hệ thống phân tán đều cần consensus vì các node xử lý độc lập phải thống nhất về một giá trị chung để giữ cho toàn bộ hệ thống được đồng bộ và nhất quán.

---

A valid consensus algorithm must satisfy three non-negotiable conditions simultaneously: Agreement (all non-faulty nodes decide the same value), Validity (the decided value must have been proposed by a non-faulty node), and Termination (every non-faulty node must eventually reach a decision).

Một thuật toán consensus hợp lệ phải thỏa mãn đồng thời ba điều kiện không thể thiếu: Agreement — tất cả node không bị lỗi đồng ý cùng một giá trị; Validity — giá trị được chọn phải do một node không bị lỗi đề xuất; Termination — mọi node không bị lỗi đều phải đi đến quyết định cuối cùng.

---

Distributed systems face two fundamentally different failure types: Crash Failure, where a node stops responding entirely and can be safely ignored, and Byzantine Failure, where a node remains active but sends inconsistent or malicious messages to different peers — the latter being significantly harder to handle.

Hệ thống phân tán đối mặt với hai loại lỗi về bản chất khác nhau: Crash Failure — node ngừng phản hồi hoàn toàn và có thể bỏ qua một cách an toàn; Byzantine Failure — node vẫn hoạt động nhưng gửi các thông điệp không nhất quán hoặc có hại đến các node khác nhau, loại này khó xử lý hơn đáng kể.

---

A consensus algorithm capable of tolerating Byzantine Failure is considered the strongest class of consensus algorithm, as it can handle any failure scenario in a distributed system.

Một thuật toán consensus có khả năng chịu được Byzantine Failure được coi là lớp thuật toán consensus mạnh nhất, vì nó có thể xử lý mọi tình huống lỗi trong hệ thống phân tán.

---

Leslie Lamport's foundational proof establishes that Byzantine consensus requires a minimum of 3f+1 total nodes to tolerate f faulty (Byzantine) nodes — meaning the system needs more than two-thirds of all nodes to be honest for consensus to be achievable.

Chứng minh nền tảng của Leslie Lamport xác lập rằng đồng thuận Byzantine yêu cầu tối thiểu 3f+1 node tổng cộng để chịu được f node lỗi (Byzantine) — nghĩa là hệ thống cần hơn 2/3 tổng số node hoạt động trung thực thì mới có thể đạt được consensus.

---

pBFT operates through three sequential phases (pre-prepare, prepare, commit) with a designated Primary node coordinating each round. If the Primary node fails to broadcast within an allotted time, the view change protocol automatically elects a replacement.

pBFT hoạt động qua ba giai đoạn tuần tự (pre-prepare, prepare, commit) với một node Primary được chỉ định điều phối mỗi vòng. Nếu node Primary không phát tán yêu cầu trong thời gian cho phép, giao thức "view change" sẽ tự động bầu chọn node thay thế.

---

Voting-based algorithms (pBFT, Raft, Paxos) are mathematically proven and stable but become increasingly slow as the network grows larger. Proof-based algorithms (PoW, PoS) are better suited for large permissionless networks but trade off speed for scale.

Các thuật toán dựa trên bỏ phiếu (pBFT, Raft, Paxos) được chứng minh toán học và ổn định nhưng ngày càng chậm khi mạng lưới mở rộng. Các thuật toán dựa trên bằng chứng (PoW, PoS) phù hợp hơn cho các mạng lớn không cần cấp phép, nhưng đánh đổi tốc độ để lấy khả năng mở rộng.

---

QUESTIONS FOR REVIEW — CONSENSUS IN DISTRIBUTED SYSTEMS

What is Distributed Consensus and what triggers the need for it in a distributed system? Sự đồng thuận phân tán là gì và điều gì làm phát sinh nhu cầu về nó trong hệ thống phân tán?

- Distributed Consensus is the mechanism by which multiple nodes in a distributed system agree on a single common value during computation, so that all nodes remain synchronized about the overall state of the system.
- Sự đồng thuận phân tán là cơ chế mà qua đó nhiều node trong hệ thống phân tán thống nhất về một giá trị chung trong quá trình tính toán, để tất cả node luôn được đồng bộ về trạng thái tổng thể của hệ thống.

---

What are the three mandatory conditions for a consensus algorithm? Briefly explain each. Ba điều kiện bắt buộc của một thuật toán consensus là gì? Giải thích ngắn gọn từng điều kiện.

- Agreement: every non-faulty node must decide the same value. Validity: the decided value must originate from a non-faulty node's proposal. Termination: every non-faulty node must eventually arrive at a decision — the algorithm cannot run indefinitely.
- Agreement: mọi node không bị lỗi phải quyết định cùng một giá trị. Validity: giá trị được quyết định phải xuất phát từ đề xuất của một node không bị lỗi. Termination: mọi node không bị lỗi phải đi đến quyết định cuối cùng — thuật toán không được chạy vô thời hạn.

---

What is the difference between Crash Failure and Byzantine Failure? Which is harder to handle and why? Sự khác biệt giữa Crash Failure và Byzantine Failure là gì? Loại nào khó xử lý hơn và tại sao?

- Crash Failure: a node stops responding entirely — it can be ignored. Byzantine Failure: a node remains active but sends different, potentially malicious messages to different peers. Byzantine Failure is harder to handle because the faulty node is invisible — it appears to be working normally while actively corrupting the system's decision-making process.
- Crash Failure: một node ngừng phản hồi hoàn toàn — có thể bỏ qua. Byzantine Failure: một node vẫn hoạt động nhưng gửi các thông điệp khác nhau, có thể độc hại, đến các node khác nhau. Byzantine Failure khó xử lý hơn vì node lỗi không bị phát hiện — nó trông có vẻ hoạt động bình thường trong khi đang âm thầm phá hoại quá trình ra quyết định của hệ thống.

---

What did Leslie Lamport prove about the minimum number of honest nodes required for Byzantine consensus? Leslie Lamport đã chứng minh điều gì về số lượng node trung thực tối thiểu cần thiết cho đồng thuận Byzantine?

- Lamport proved that consensus can be reached if and only if more than two-thirds of all nodes in the system are honest. In formula terms: to tolerate f faulty nodes, the system needs a minimum of 3f+1 total nodes.
- Lamport chứng minh rằng consensus có thể đạt được khi và chỉ khi hơn 2/3 tổng số node trong hệ thống là trung thực. Theo công thức: để chịu được f node lỗi, hệ thống cần tối thiểu 3f+1 node.

---

Describe a complete pBFT consensus round from client request to successful response. Mô tả một vòng đồng thuận pBFT hoàn chỉnh từ yêu cầu của client đến phản hồi thành công.

- The client sends a request to the Primary node. The Primary broadcasts it to all Secondary nodes. All nodes execute the requested service and send their replies directly to the client. The request is considered successfully served when the client receives at least two-thirds of identical replies from the total node count.
- Client gửi yêu cầu đến node Primary. Node Primary phát tán yêu cầu đến tất cả node Secondary. Tất cả node thực thi dịch vụ được yêu cầu và gửi phản hồi trực tiếp về cho client. Yêu cầu được coi là thành công khi client nhận được ít nhất 2/3 phản hồi giống nhau từ tổng số node.

---

What triggers the view change protocol in pBFT, and what does it do? Điều gì kích hoạt giao thức "view change" trong pBFT, và nó làm gì?

- The view change protocol is triggered when the Primary node fails to broadcast a request to Secondary nodes within a predetermined time window. It automatically removes the current Primary and elects a new one to prevent the system from stalling.
- Giao thức view change được kích hoạt khi node Primary không phát tán yêu cầu đến các node Secondary trong khoảng thời gian định trước. Nó tự động loại bỏ node Primary hiện tại và bầu chọn một node Primary mới để ngăn hệ thống bị đình trệ.

---

What is the fundamental difference between voting-based and proof-based consensus algorithms? Give one example of each and its real-world application. Sự khác biệt cơ bản giữa thuật toán dựa trên bỏ phiếu và dựa trên bằng chứng là gì? Cho một ví dụ về mỗi loại và ứng dụng thực tế của nó.

- Voting-based algorithms require nodes to communicate and vote to reach agreement — they are stable and proven but slow at scale. Example: Raft, used in Kubernetes (etcd). Proof-based algorithms require participants to demonstrate computational or financial proof before contributing to a decision — they are better suited for large permissionless networks. Example: Proof of Work (PoW), used in Bitcoin.
- Thuật toán dựa trên bỏ phiếu yêu cầu các node giao tiếp và bỏ phiếu để đạt đồng thuận — ổn định và được chứng minh nhưng chậm khi mở rộng quy mô. Ví dụ: Raft, dùng trong Kubernetes (etcd). Thuật toán dựa trên bằng chứng yêu cầu người tham gia chứng minh năng lực tính toán hoặc tài chính trước khi được tham gia quyết định — phù hợp hơn với các mạng lớn không cần cấp phép. Ví dụ: Proof of Work (PoW), dùng trong Bitcoin.

---

Name three real-world applications of distributed consensus algorithms and explain briefly what role consensus plays in each. Nêu ba ứng dụng thực tế của các thuật toán đồng thuận phân tán và giải thích ngắn gọn vai trò của consensus trong từng ứng dụng.

- Blockchain and cryptocurrencies: consensus ensures all nodes agree on a single, tamper-proof transaction history. Google PageRank: distributed servers must agree on consistent ranking scores across the network. Load balancing: nodes must agree on how to distribute incoming requests so no single server is overloaded.
- Blockchain và tiền mã hóa: consensus đảm bảo tất cả node đồng ý về một lịch sử giao dịch duy nhất, không thể giả mạo. Google PageRank: các server phân tán phải thống nhất về điểm xếp hạng nhất quán trên toàn mạng. Cân bằng tải: các node phải thống nhất về cách phân phối yêu cầu đến để không server nào bị quá tải.