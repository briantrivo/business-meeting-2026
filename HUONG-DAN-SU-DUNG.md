# 🚀 HƯỚNG DẪN SỬ DỤNG WEBSITE BUSINESS MEETING 2026 & CRM

Website sự kiện chuyên nghiệp dành cho **Business Meeting 2026** (ASTRONIXA & Cộng đồng Ohana) tích hợp hệ thống **Landing Page chuẩn brochure/in ấn A4**, **Form đăng ký tự động** và **Trang Quản trị CRM Realtime**.

---

## 🌟 1. CÁC TÍNH NĂNG NỔI BẬT

### A. Landing Page Sự Kiện (`http://localhost:3000/`)
1. **Giao diện Cosmic Violet & Gold sang trọng:** Hiệu ứng hạt sáng, sao lấp lánh (Sparkling Stars) và hiệu ứng Ken Burns tại thư viện ảnh không gian Athena Hotel.
2. **Bộ đếm ngược thời gian (Countdown Timer):** Tự động đếm ngược đến 08:30 ngày 10/10/2026.
3. **8 Quyền lợi thành viên Astronixa:** Hiển thị thẻ card hiện đại với huy hiệu số gradient.
4. **Bản đồ chỉ đường thông minh:** Tích hợp Google Maps iframe tương tác cùng nút chỉ đường và hotline gọi nhanh.
5. **Nội dung trọng tâm & Lịch trình chi tiết:** Phân chia rõ ràng phiên sáng, tiệc trưa, workshop chiều và tiệc tối SUPERVIP.
6. **3 Hạng thư mời linh hoạt:**
   - **STANDARD:** 299.000đ (Dành cho 1 người)
   - **VIP:** 699.000đ (+1 thư mời STANDARD, quà tặng 2 triệu)
   - **SUPERVIP:** 1.299.000đ (+2 thư mời STANDARD, tiệc tối cùng Diễn giả & Coaching 1-1)
   - *Nút chọn nhanh từng hạng vé tự động điền form và scroll mượt.*
7. **Form Đăng ký Giữ chỗ:**
   - Kiểm tra định dạng số điện thoại 10 số & Email.
   - Honeypot chống spam bot tự động.
   - Bắt nguồn tiếp thị UTM (utm_source, utm_medium, utm_campaign).
8. **Chế độ In ấn & Xuất Brochure A4 (@media print):** Tự động dàn trang thành đúng 2 trang A4 chuẩn brochure thư mời khi ấn `Ctrl + P`.

---

### B. Bộ Tạo Thiệp Mời VIP Cá Nhân Hóa (`http://localhost:3000/thiep-moi`)
1. **Cá nhân hóa theo tên & chức danh:** Tự động điều chỉnh kích cỡ font chữ khi người dùng nhập tên và vai trò để luôn cân đối, thẩm mỹ.
2. **Tải & căn chỉnh ảnh chân dung:** Hỗ trợ kéo thả/tải ảnh, thanh trượt phóng to/thu nhỏ (Zoom 80% - 280%), căn chỉnh vị trí dọc (Y) và ngang (X), kèm sẵn 4 ảnh đại diện mẫu của dàn Diễn giả.
3. **3 Phong cách màu sắc đẳng cấp (Theme Switcher):**
   - 🌌 **Cosmic Neon:** Tím vũ trụ & Xanh điện quang (phong cách công nghệ AI Astronixa).
   - 👑 **Royal Gold:** Đen huyền bí & Vàng kim hoàng gia sang trọng.
   - 💎 **Cyber Emerald:** Xanh ngọc lục bảo & Hologram tương lai.
4. **Mã vé VIP & Mã QR Check-in động:** Tự động sinh mã định danh duy nhất (`BM26-VIP-XXXX`) cùng mã QR dẫn trực tiếp về website sự kiện.
5. **Xuất ảnh đa định dạng siêu nét:**
   - 📥 **Tải thiệp PNG:** Độ phân giải cao Ultra-HD (2160px width, tỉ lệ 2x) chuẩn in ấn & đăng mạng xã hội.
   - 📥 **Tải thiệp JPG:** Tối ưu dung lượng nhẹ để đăng Story, Zalo, Facebook.
   - 📋 **Sao chép ảnh vào Clipboard (1-Click):** Dán trực tiếp ngay vào Zalo, Messenger, Canva hoặc Photoshop.

---

### C. Hệ Thống Quản Trị CRM (`http://localhost:3000/admin`)
1. **Bảo mật bằng mật khẩu:** Mặc định `astronixa2026` (lưu phiên làm việc an toàn).
2. **Thống kê KPI Realtime:**
   - Tổng số lượt đăng ký.
   - Số lượng từng hạng vé (STANDARD, VIP, SUPERVIP).
3. **Bộ lọc Pipeline phân loại khách hàng:**
   - `Tất cả` · `Mới` · `Đã gọi` · `Quan tâm` · `Đã chốt` · `Hủy`.
4. **Tìm kiếm tức thì:** Gõ tên, SĐT, email, doanh nghiệp hoặc ghi chú để lọc ngay lập tức.
5. **Chăm sóc khách hàng trực tiếp trên bảng:**
   - Đổi trạng thái khách hàng chỉ với 1 click dropdown (tự động lưu).
   - Nhập ghi chú chăm sóc (tự động lưu khi gõ xong hoặc ấn Enter).
   - Nút gọi điện thoại nhanh `tel:` và gửi mail `mailto:`.
   - Nút xóa khách test.
6. **Tự động cập nhật Realtime (Polling 15s):** Thông báo Toast tức thì khi có người vừa đăng ký trên website.
7. **Xuất Excel / CSV (1 Click):** Đã tích hợp chuẩn UTF-8 BOM giúp mở bằng Microsoft Excel hiển thị đầy đủ tiếng Việt có dấu và giữ nguyên số 0 đầu số điện thoại.

---

## 🛠️ 2. HƯỚNG DẪN CHẠY CỤC BỘ (LOCAL)

### Bước 1: Mở thư mục dự án trong Terminal
```bash
cd "d:\AI AGENT ANTIGRAVITY\11-business-meeting-2026"
```

### Bước 2: Cài đặt thư viện (nếu chưa cài)
```bash
cmd /c npm install
```

### Bước 3: Khởi động máy chủ
```bash
npm start
# hoặc chế độ dev tự reload:
npm run dev
```

### Bước 4: Mở trình duyệt
- **Trang chủ Landing Page:** [http://localhost:3000](http://localhost:3000)
- **Trang Tạo Thiệp Mời VIP:** [http://localhost:3000/thiep-moi](http://localhost:3000/thiep-moi)
- **Trang Quản trị CRM:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Mật khẩu Quản trị mặc định:** `astronixa2026`

---

## ⚙️ 3. TÙY CHỈNH THÔNG TIN (FILE `.env`)

Mở file [`.env`](file:///d:/AI%20AGENT%20ANTIGRAVITY/11-business-meeting-2026/.env) để chỉnh sửa các thông số theo ý muốn:

```env
PORT=3000
ADMIN_PASSWORD=astronixa2026
EVENT_NAME="Business Meeting 2026"
EVENT_DATE="2026-10-10"
EVENT_LOCATION="Athena Hotel, 280 Tô Hiến Thành, TP. Hồ Chí Minh"
HOTLINE="0931332671"
HOTLINE_DISPLAY="0931 332 671"
REPRESENTATIVE_NAME="Võ Quốc Trí"
REPRESENTATIVE_TITLE="Giám đốc Thị trường Việt Nam"
BANK_NAME="VietinBank"
BANK_BRANCH="CN 7 - TP HCM - PGD Lương Định Của"
BANK_ACCOUNT_NUMBER="102884237305"
BANK_ACCOUNT_HOLDER="VO QUOC TRI"
GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
```

---

## 📊 4. HƯỚNG DẪN TỰ ĐỘNG ĐẨY DỮ LIỆU VỀ GOOGLE SHEETS

Hệ thống đã chuẩn bị sẵn file mã nguồn Apps Script tại [`google_sheet_script.js`](file:///d:/AI%20AGENT%20ANTIGRAVITY/11-business-meeting-2026/google_sheet_script.js):

1. **Bước 1:** Mở một file **Google Sheets** mới (hoặc file có sẵn).
2. **Bước 2:** Đặt tiêu đề các cột ở Dòng 1:
   - **Cột A:** `Thời gian`
   - **Cột B:** `Họ và tên`
   - **Cột C:** `Số điện thoại`
   - **Cột D:** `Email`
   - **Cột E:** `Doanh nghiệp / Chức vụ`
   - **Cột F:** `Hạng vé`
   - **Cột G:** `Số người`
   - **Cột H:** `Nguồn đăng ký`
   - **Cột I:** `Ghi chú / Trạng thái`
3. **Bước 3:** Trên menu Google Sheets, chọn: **Tiện ích mở rộng** (Extensions) -> **Apps Script**.
4. **Bước 4:** Xóa hết code mặc định, copy toàn bộ nội dung trong file [`google_sheet_script.js`](file:///d:/AI%20AGENT%20ANTIGRAVITY/11-business-meeting-2026/google_sheet_script.js) dán vào -> Nhấn **Lưu (Ctrl + S)**.
5. **Bước 5:** Nhấn nút **Triển khai** (Deploy) ở góc trên bên phải -> Chọn **Tùy chọn triển khai mới** (New deployment):
   - Chọn loại: **Ứng dụng web (Web app)**
   - Mô tả: `Nhận lead Business Meeting 2026`
   - Người có quyền truy cập (*Who has access*): **BẤT KỲ AI (*Anyone*)** *(Rất quan trọng)*
   - Nhấn **Triển khai (Deploy)** -> Chọn tài khoản Google của bạn -> Nhấn **Cho phép (Allow)**.
6. **Bước 6:** Sao chép đường link **URL Ứng dụng web** (dạng `https://script.google.com/macros/s/.../exec`).
7. **Bước 7:** Dán URL này vào file [`.env`](file:///d:/AI%20AGENT%20ANTIGRAVITY/11-business-meeting-2026/.env) tại mục:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/AKfycbx.../exec"
   ```
👉 Kể từ lúc này, mỗi khi có khách điền form trên website, dữ liệu sẽ **ngay lập tức tự động xuất hiện trên Google Sheet** của bạn!

---

## 🚀 5. HƯỚNG DẪN DEPLOY LÊN VERCEL / RENDER

### Cách 1: Deploy lên Vercel (Khuyên dùng)
Dự án đã có sẵn file [`vercel.json`](file:///d:/AI%20AGENT%20ANTIGRAVITY/11-business-meeting-2026/vercel.json):
1. Đẩy code lên GitHub repository của bạn.
2. Vào [Vercel Dashboard](https://vercel.com) -> Nhấn **Add New Project** -> Chọn repo vừa tạo.
3. Tại phần **Environment Variables**, thêm biến:
   - `ADMIN_PASSWORD` = `mật_khẩu_bạn_chọn`
4. Nhấn **Deploy** -> Website sẽ sẵn sàng hoạt động với tên miền miễn phí dạng `*.vercel.app`.

### Cách 2: Deploy lên Render / Railway
1. Chọn kiểu triển khai **Web Service** (Node.js).
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Cấu hình biến môi trường `ADMIN_PASSWORD`.

---

## 📂 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```
11-business-meeting-2026/
├── api/                   # Thư mục chứa endpoint mở rộng
├── data/
│   └── leads.json         # Cơ sở dữ liệu lưu danh sách khách đăng ký
├── public/
│   ├── images/            # Logo, icon, ảnh sảnh & hội trường Athena Hotel
│   ├── index.html         # Giao diện Landing Page chuẩn brochure A4
│   └── admin.html         # Giao diện Quản trị CRM chuyên nghiệp
├── .env                   # Cấu hình cổng, hotline, mật khẩu admin
├── package.json           # Khai báo dependencies (express, cors, dotenv)
├── server.js              # Máy chủ Express & REST API xử lý dữ liệu
├── vercel.json            # Cấu hình routing deploy Vercel
└── HUONG-DAN-SU-DUNG.md   # Hướng dẫn chi tiết bằng tiếng Việt
```
