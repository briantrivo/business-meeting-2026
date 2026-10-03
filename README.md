# Business Meeting 2026 - Landing Page & Admin CRM

Hệ thống Website Landing Page và Dashboard Quản lý Đăng ký (CRM) cho sự kiện **Business Meeting 2026** (ASTRONIXA & Cộng đồng Ohana).

## Tính năng chính
- **Giao diện Landing Page chuẩn A4 Brochure:** Tối ưu hóa hiển thị trên mọi thiết bị và xuất file in ấn chuẩn A4.
- **Hiệu ứng sao đêm lấp lánh & Ambient Light:** Mang lại trải nghiệm thị giác cao cấp.
- **Bộ đếm ngược sự kiện:** Tự động đếm ngược đến ngày tổ chức 10/10/2026.
- **Bản đồ chỉ đường & Hotline tương tác:** Tích hợp trực tiếp Google Maps và gọi hotline 1-chạm.
- **Hệ thống 3 Hạng vé (STANDARD, VIP, SUPERVIP):** Chọn vé nhanh tự động điền form.
- **Form đăng ký thông minh:** Xác thực dữ liệu, chống spam honeypot và lưu trữ thời gian thực.
- **Dashboard Quản trị CRM (`/admin`):**
  - Mật khẩu bảo mật: `astronixa2026`
  - Thống kê thời gian thực theo từng hạng vé.
  - Phân loại trạng thái (Mới, Đã gọi, Quan tâm, Đã chốt, Hủy).
  - Tự động cập nhật mỗi 15 giây & thông báo Toast khi có đăng ký mới.
  - Xuất file Excel / CSV UTF-8 hiển thị tiếng Việt chuẩn.

## Khởi chạy
```bash
npm install
npm start
```

Xem chi tiết tại [HUONG-DAN-SU-DUNG.md](HUONG-DAN-SU-DUNG.md).
