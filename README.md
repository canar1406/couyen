# Uyên English - Nền tảng học Tiếng Anh cá nhân hóa 🇺🇸

Chào mừng đến với hệ thống học tập 1-kèm-1 **Uyên English**! Website được thiết kế với giao diện hiện đại, tốc độ cao (không sử dụng thư viện cồng kềnh) và đặc biệt tối ưu cho lộ trình cá nhân hóa của từng học viên.

---

## 📚 Hướng Dẫn Sử Dụng (Dành Cho Admin - Cô Uyên)

### 1. Quản lý Tài khoản (Thêm/Sửa học viên)
- Mở file `data/users.json` bằng Notepad hoặc bất kỳ trình soạn thảo văn bản nào.
- Để thêm học viên mới, bạn chỉ cần copy cấu trúc của một học viên có sẵn và sửa lại thông tin:
  - `id`: Mã học viên (Ví dụ: `u004`).
  - `name`: Tên đầy đủ.
  - `email` & `password`: Thông tin đăng nhập.
  - `courses`: Điền `["custom-course"]` (Hệ thống sẽ tự động tìm giáo trình cá nhân hóa tương ứng).

### 2. Quản lý Giáo trình & Bài giảng
- Mỗi học viên có một file giáo trình riêng biệt nằm trong thư mục `data/` với tên gọi theo ID. 
- Ví dụ học viên `u003` sẽ có file bài giảng là `data/course-data-u003.json`.
- Bạn có thể vào file đó để cập nhật:
  - Thêm tuần học mới (`weeks`).
  - Sửa đổi nội dung buổi học (`sessions`).
  - Gắn link video, tài liệu bài tập (Điền mã `drive_id` của file trên Google Drive).

### 3. Xem báo cáo học tập
- Admin đăng nhập bằng tài khoản (mặc định: `phamnhauyen2008@gmail.com` / `admin2026`).
- Admin có thể vào xem **toàn bộ khóa học** để kiểm tra tiến độ, cũng như xem tổng số bài tập cần chấm trong bảng điều khiển.

---

## ⚙️ Hướng Dẫn Kỹ Thuật (Dành Cho Kỹ Thuật Viên / Chuyên Viên IT)

### 1. Kiến trúc hệ thống
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+).
- **Animation:** GSAP (để tạo hiệu ứng mượt mà), ScrollTrigger.
- **Database:** Dữ liệu tĩnh dạng JSON File (Phù hợp mô hình lớp học dưới 100 học viên, không tốn chi phí server/backend).
- **Email:** EmailJS (Gửi mail trực tiếp từ Client-side).

### 2. Cấu hình EmailJS (Form Đăng Ký)
Form đăng ký ở trang chủ (`index.html`) được cấu hình tự động gửi email cho Admin khi có học viên ghi danh.
- **Vị trí config:** Mở file `index.html` và cuộn xuống dòng ~386-410.
- **Thông số:** 
  - `Public Key`: Đã cấu hình (`AoPRyLOGRSwXBhPRW`).
  - `Service ID`: Đã cấu hình (`service_uc5rns9`).
  - `Template ID`: Đã cấu hình (`template_0ouwdjp`).
- Nếu sau này có thay đổi tài khoản, kỹ thuật viên chỉ cần cập nhật lại 3 biến này. Template EmailJS cần khai báo các biến: `{{student_name}}`, `{{phone}}`, `{{email}}`, `{{course}}`, `{{message}}`.

### 3. Tùy biến UI/UX (Design System)
- Màu sắc và các biến thiết kế chuẩn (Design Tokens) đều được khai báo tại root trong file `css/common.css`.
- Để thay đổi màu chủ đạo (Primary Color), chỉ cần tìm biến `--primary-500` và các sắc độ liên quan để đổi mã HEX.
- Logo mặc định là dạng Vector/CSS (chữ `UE` với gradient). Nếu thay thế logo ảnh, có thể trực tiếp gắn `<img>` vào class `.nav-logo-icon` hoặc `.sidebar-logo-icon`.
