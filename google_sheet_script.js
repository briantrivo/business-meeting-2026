/**
 * HƯỚNG DẪN KẾT NỐI GOOGLE SHEETS VỚI FORM ĐĂNG KÝ
 * 
 * Bước 1: Mở Google Sheets mới (hoặc file có sẵn).
 * Bước 2: Tạo các tiêu đề cột ở dòng 1:
 *   Cột A: Thời gian
 *   Cột B: Họ và tên
 *   Cột C: Số điện thoại
 *   Cột D: Email
 *   Cột E: Doanh nghiệp / Chức vụ
 *   Cột F: Hạng vé
 *   Cột G: Số người
 *   Cột H: Nguồn đăng ký
 *   Cột I: Ghi chú / Trạng thái
 * 
 * Bước 3: Trên menu Google Sheets, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * Bước 4: Xóa hết code cũ, dán toàn bộ đoạn code dưới đây vào -> Nhấn Lưu (Ctrl + S).
 * Bước 5: Nhấn nút "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment):
 *   - Chọn loại: Ứng dụng web (Web app).
 *   - Mô tả: Nhận dữ liệu đăng ký Business Meeting 2026.
 *   - Người có quyền truy cập (Who has access): BẤT KỲ AI (Anyone) - RẤT QUAN TRỌNG!
 *   - Nhấn "Triển khai" (Deploy) -> Cấp quyền (Authorize access) cho tài khoản Google của bạn.
 * Bước 6: Copy đường link URL ứng dụng web (có dạng https://script.google.com/macros/s/.../exec).
 * Bước 7: Dán URL đó vào file .env mục GOOGLE_SHEET_WEBHOOK_URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }

    var time = data.time || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var fullName = data.full_name || data.name || "";
    var phone = "'" + (data.phone || ""); // Thêm dấu ' để giữ nguyên số 0 ở đầu
    var email = data.email || "";
    var company = data.company || "";
    var ticket = data.ticket || "";
    var attendees = data.attendees || "1";
    var source = data.source || "Landing Page";
    var note = data.note || "Mới đăng ký";

    // Tự động thêm dòng mới vào Google Sheet
    sheet.appendRow([
      time,
      fullName,
      phone,
      email,
      company,
      ticket,
      attendees,
      source,
      note
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, message: "Đã lưu vào Google Sheet thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Webhook Google Sheet đang hoạt động bình thường!");
}
