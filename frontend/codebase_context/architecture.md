# Kiến trúc tổng thể Frontend

## 1. Tech Stack & Framework
- **Framework:** Next.js 16.1.6 (sử dụng **App Router**).
- **Core Library:** React 19.2.3.
- **Styling:** Tailwind CSS v4, kết hợp với các component UI từ **shadcn/ui** (dựa trên Radix UI).
- **Icons:** Lucide React.
- **State Management:** Dành sẵn thư mục `store/` với các file (`authStore.js`, `cartStore.js`, `uiStore.js`), dự kiến sử dụng thư viện quản lý state nhẹ như **Zustand** (chưa cài đặt trong `package.json`) hoặc React Context.

## 2. Cấu trúc thư mục (Folder Structure)
Cấu trúc theo chuẩn App Router của Next.js:
- `src/app/`: Chứa các trang và layout.
  - `(auth)/`: Nhóm route cho xác thực (login, register).
  - `(shop)/`: Nhóm route cho ứng dụng chính phía người dùng (cart, checkout, orders, products, trang chủ).
  - `(admin)/`: Nhóm route cho trang quản trị admin.
- `src/components/`: Chứa các component UI chia theo feature:
  - `admin/`, `auth/`, `cart/`, `category/`, `homepage/`, `layout/`, `order/`, `product/`, `ui/` (các component shadcn).
- `src/config/`: File cấu hình, hiện tại có `axios.js`.
- `src/constants/`: Chứa các hằng số dùng chung (như `STORAGE_KEYS`, `API_ENDPOINTS`).
- `src/services/`: Các module gọi API tương ứng với từng resource (`authService.js`, `productService.js`, v.v.).
- `src/store/`: Các file quản lý Global State (hiện đang trống).

## 3. Convention đang sử dụng
- **Naming:**
  - Component/Page: PascalCase (VD: `ProductGridSection.jsx`).
  - Service/Store: camelCase (VD: `productService.js`, `authStore.js`).
- **Giao tiếp API (Axios Instance):**
  - Sử dụng file cấu hình chung `src/config/axios.js`.
  - **Request Interceptor:** Tự động đính kèm `Authorization: Bearer <token>` từ localStorage (`ACCESS_TOKEN`) vào header.
  - **Response Interceptor:** 
    - Có logic **refresh token tự động**: Bắt lỗi `401 Unauthorized` (ngoại trừ route login/refresh) -> Gọi `/auth/refresh` bằng refreshToken -> Cập nhật token và retry lại request cũ.
    - Xử lý hàng đợi (Queue) cho các request bị fail trong lúc đang refresh token.
    - Chuyển hướng người dùng về `/auth/login` nếu refresh token thất bại.
- **Service Layer:**
  - Được đóng gói riêng biệt trong `src/services/`, giúp component phía UI chỉ cần gọi hàm (vd: `productService.getProducts()`) thay vì fetch trực tiếp.

## 4. Xử lý Lỗi & Loading
- **Xử lý lỗi:** Lỗi từ API (bao gồm message từ backend) được reject ra từ interceptor và component sẽ catch bằng khối `try/catch`. 
- **Loading State:** Chưa thấy xử lý Global Loading rõ ràng. Component chủ động quản lý local state hoặc xử lý bằng Suspense của Next.js trong tương lai.
