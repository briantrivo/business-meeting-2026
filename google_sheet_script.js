/**
 * BỘ MÃ NGUỒN GOOGLE APPS SCRIPT ĐỒNG BỘ 2 CHIỀU (ĐỌC & GHI DỮ LIỆU)
 * Dành cho Sự Kiện: Business Meeting 2026 (Astronixa & Ohana)
 * 
 * HƯỚNG DẪN CÀI ĐẶT / CẬP NHẬT TRÊN GOOGLE SHEETS:
 * -------------------------------------------------------------
 * Bước 1: Mở Google Sheet quản lý danh sách đăng ký.
 * Bước 2: Tạo tiêu đề các cột ở Dòng 1 (nếu chưa có):
 *   - Cột A: Thời gian
 *   - Cột B: Họ và tên
 *   - Cột C: Số điện thoại
 *   - Cột D: Email
 *   - Cột E: Doanh nghiệp / Chức vụ
 *   - Cột F: Hạng vé
 *   - Cột G: Số người
 *   - Cột H: Nguồn đăng ký
 *   - Cột I: Ghi chú
 *   - Cột J: Trạng thái CRM
 * 
 * Bước 3: Trên menu Google Sheet, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * Bước 4: Xóa toàn bộ mã cũ trong Apps Script, copy và dán toàn bộ file này vào.
 * Bước 5: Nhấn Lưu (Ctrl + S).
 * Bước 6: Nhấn nút "Triển khai" (Deploy) -> "Quản lý bản triển khai" (Manage deployments) hoặc "Tùy chọn triển khai mới" (New deployment):
 *   - Chọn loại: Ứng dụng web (Web app).
 *   - Mô tả: Business Meeting 2026 2-Way Sync.
 *   - Người có quyền truy cập (Who has access): BẤT KỲ AI (Anyone) -> RẤT QUAN TRỌNG ĐỂ VERCEL GỌI ĐƯỢC!
 *   - Nhấn "Triển khai" (Deploy) và cấp quyền truy cập.
 * Bước 7: Copy đường link URL Web App (dạng https://script.google.com/macros/s/.../exec) và dán vào file .env mục GOOGLE_SHEET_WEBHOOK_URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};
    
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Action: Sync All / Bulk Sync
    if (data.action === "sync_all" && Array.isArray(data.leads)) {
      // Clear old rows except header
      var lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 10).clearContent();
      }
      var rows = data.leads.map(function(l) {
        return [
          l.received_at ? Utilities.formatDate(new Date(l.received_at), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss") : (l.time || ""),
          l.full_name || "",
          "'" + (l.phone || ""),
          l.email || "",
          l.company || "",
          l.ticket || "",
          l.attendees || "1",
          l.source || "",
          l.note || "",
          l.status || "moi"
        ];
      });
      if (rows.length > 0) {
        sheet.getRange(2, 1, rows.length, 10).setValues(rows);
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true, count: rows.length }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Standard Action: Insert new single lead
    var time = data.time || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    var fullName = data.full_name || data.name || "";
    var phone = "'" + (data.phone || ""); // Thêm dấu ' để giữ nguyên số 0 ở đầu
    var email = data.email || "";
    var company = data.company || "";
    var ticket = data.ticket || "";
    var attendees = data.attendees || "1";
    var source = data.source || "Landing Page";
    var note = data.note || "Mới đăng ký";
    var status = data.status || "moi";

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
      note,
      status
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, message: "Đã lưu vào Google Sheet thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ ok: true, leads: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var leads = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var name = String(row[1] || "").trim();
      var phone = String(row[2] || "").replace(/^'/, "").trim();
      if (!name && !phone) continue; // Bỏ qua dòng trống

      var timeVal = row[0];
      var isoTime = new Date().toISOString();
      if (timeVal instanceof Date) {
        isoTime = timeVal.toISOString();
      } else if (timeVal) {
        isoTime = String(timeVal);
      }

      leads.push({
        id: "gs-lead-" + i + "-" + phone.slice(-4),
        received_at: isoTime,
        full_name: name,
        phone: phone,
        email: String(row[3] || "").trim(),
        company: String(row[4] || "").trim(),
        ticket: String(row[5] || "THUONG").trim().toUpperCase(),
        attendees: String(row[6] || "1").trim(),
        source: String(row[7] || "Google Sheets").trim(),
        note: String(row[8] || "").trim(),
        status: String(row[9] || "moi").trim().toLowerCase()
      });
    }

    // Sắp xếp người mới nhất lên đầu
    leads.reverse();

    return ContentService.createTextOutput(JSON.stringify({ ok: true, total: leads.length, leads: leads }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.toString(), leads: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
