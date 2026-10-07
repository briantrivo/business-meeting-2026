const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'astronixa2026';
const IS_VERCEL = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const SEED_DATA_FILE = path.join(__dirname, 'data', 'leads.json');
const DATA_FILE = IS_VERCEL ? path.join('/tmp', 'leads.json') : SEED_DATA_FILE;
const GOOGLE_SHEET_WEBHOOK_URL = process.env.GOOGLE_SHEET_WEBHOOK_URL || 'https://script.google.com/macros/s/AKfycbwlYK0UcsFwZStFfjWhMUcT-62HDwJx32_kCtYfuaNYqnI9ebD9T1lOzkGu9PYkBSRX/exec';

// In-memory leads cache and tombstone IDs
let memoryLeads = null;
const memoryDeletedIds = new Set();

// Helper: Forward lead data to Google Sheet Webhook
async function forwardToGoogleSheet(lead) {
  if (!GOOGLE_SHEET_WEBHOOK_URL) return;
  try {
    const payload = {
      time: new Date(lead.received_at || Date.now()).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      company: lead.company,
      ticket: lead.ticket,
      attendees: lead.attendees,
      event: lead.event,
      source: [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(' / ') || lead.source,
      note: lead.note || 'Mới đăng ký'
    };

    if (typeof fetch === 'function') {
      const resp = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      const text = await resp.text();
      console.log('✅ Forwarded lead to Google Sheet:', lead.full_name, 'Response:', text.substring(0, 100));
    }
  } catch (err) {
    console.error('Google Sheet forward failed:', err.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper: Ensure data directory and file exist
function getLeads() {
  if (memoryLeads !== null) {
    return memoryLeads.filter(l => !memoryDeletedIds.has(l.id));
  }
  try {
    if (!fs.existsSync(DATA_FILE)) {
      let initialData = '[]';
      if (fs.existsSync(SEED_DATA_FILE)) {
        initialData = fs.readFileSync(SEED_DATA_FILE, 'utf8');
      }
      try {
        fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
        fs.writeFileSync(DATA_FILE, initialData, 'utf8');
      } catch (wErr) {
        console.warn('Cannot write initial DATA_FILE to disk:', wErr.message);
      }
      memoryLeads = JSON.parse(initialData || '[]');
      return memoryLeads.filter(l => !memoryDeletedIds.has(l.id));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    memoryLeads = JSON.parse(data || '[]');
    return memoryLeads.filter(l => !memoryDeletedIds.has(l.id));
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function saveLeads(leads) {
  memoryLeads = leads;
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving leads to file:', err.message);
    return true; // Still true because memoryLeads is updated in RAM
  }
}

// Admin Authentication Middleware
function checkAdminAuth(req, res, next) {
  const reqPw = req.headers['x-admin-password'] || req.query.pw;
  if (!reqPw || reqPw !== ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Mật khẩu quản trị không chính xác hoặc đã hết hạn.' });
  }
  next();
}

// API: Public Config
app.get('/api/config', (req, res) => {
  res.json({
    ok: true,
    eventName: process.env.EVENT_NAME || 'Business Meeting 2026',
    eventDate: process.env.EVENT_DATE || '2026-10-10',
    eventLocation: process.env.EVENT_LOCATION || 'Athena Hotel, TP. Hồ Chí Minh',
    hotline: process.env.HOTLINE || '0931332671',
    hotlineDisplay: process.env.HOTLINE_DISPLAY || '0931 332 671',
    repName: process.env.REPRESENTATIVE_NAME || 'Võ Quốc Trí',
    repTitle: process.env.REPRESENTATIVE_TITLE || 'Giám đốc Thị trường Việt Nam'
  });
});

// API: Register Lead (Submit Form)
app.post('/api/register', async (req, res) => {
  try {
    const body = req.body || {};
    
    // Honeypot spam check
    if (body.website && String(body.website).trim() !== '') {
      return res.status(400).json({ ok: false, error: 'Spam detected.' });
    }

    const fullName = String(body.full_name || '').trim();
    const phone = String(body.phone || '').replace(/[^\d+]/g, '');
    const email = String(body.email || '').trim();
    const company = String(body.company || '').trim();
    const ticket = String(body.ticket || '').toUpperCase();
    const attendees = String(body.attendees || '1');
    const event = body.event || 'Business Meeting 2026 - 10/10/2026 - Athena Hotel';

    // Validation
    if (!fullName) {
      return res.status(400).json({ ok: false, error: 'Vui lòng nhập họ và tên.' });
    }
    if (!phone || !/^(\+?84|0)\d{9,10}$/.test(phone)) {
      return res.status(400).json({ ok: false, error: 'Số điện thoại không hợp lệ (cần 10 số).' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Email không hợp lệ.' });
    }
    if (!ticket) {
      return res.status(400).json({ ok: false, error: 'Vui lòng chọn hạng thư mời.' });
    }

    const leads = getLeads();
    const newLead = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      received_at: new Date().toISOString(),
      full_name: fullName,
      phone: phone,
      email: email,
      company: company,
      ticket: ticket,
      attendees: attendees,
      status: 'moi',
      note: '',
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      event: event,
      source: body.source || 'landing-page'
    };

    leads.unshift(newLead);
    saveLeads(leads);

    // Forward to Google Sheet Webhook
    await forwardToGoogleSheet(newLead);

    res.json({
      ok: true,
      message: 'Đăng ký thành công! Ban tổ chức sẽ liên hệ với Quý khách trong 24 giờ.',
      lead: newLead
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi máy chủ khi xử lý đăng ký.' });
  }
});

// API: Get Leads (Admin Only)
app.get('/api/leads', checkAdminAuth, (req, res) => {
  try {
    const leads = getLeads();
    res.json({ ok: true, leads });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Không thể tải danh sách khách đăng ký.' });
  }
});

// API: Update Lead (Admin Only)
app.patch('/api/leads', checkAdminAuth, (req, res) => {
  try {
    const { id, status, note } = req.body;
    if (!id) {
      return res.status(400).json({ ok: false, error: 'Thiếu mã ID khách đăng ký.' });
    }

    const leads = getLeads();
    const index = leads.findIndex(l => l.id === id);
    if (index === -1) {
      return res.status(404).json({ ok: false, error: 'Không tìm thấy khách đăng ký.' });
    }

    if (status !== undefined) leads[index].status = status;
    if (note !== undefined) leads[index].note = note;
    leads[index].updated_at = new Date().toISOString();

    saveLeads(leads);
    res.json({ ok: true, lead: leads[index] });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Lỗi cập nhật dữ liệu.' });
  }
});

// API: Sync Deleted Leads (Admin Only)
app.post('/api/leads/sync-deleted', checkAdminAuth, (req, res) => {
  try {
    const { ids } = req.body || {};
    if (Array.isArray(ids)) {
      ids.forEach(id => memoryDeletedIds.add(String(id)));
      let leads = getLeads().filter(l => !memoryDeletedIds.has(l.id));
      saveLeads(leads);
    }
    res.json({ ok: true, deletedCount: memoryDeletedIds.size });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Lỗi đồng bộ xóa dữ liệu.' });
  }
});

// API: Delete Lead (Admin Only)
app.delete('/api/leads/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    memoryDeletedIds.add(id);
    let leads = getLeads().filter(l => l.id !== id);
    saveLeads(leads);
    res.json({ ok: true, message: 'Đã xóa đăng ký thành công.', deletedId: id });
  } catch (err) {
    res.status(500).json({ ok: false, error: 'Lỗi xóa dữ liệu.' });
  }
});

// API: Export CSV (Admin Only)
app.get('/api/export-csv', checkAdminAuth, (req, res) => {
  try {
    const leads = getLeads();
    const TICKET_MAP = { THUONG: 'STANDARD', VIP: 'VIP', VVIP: 'SUPERVIP' };
    const STATUS_MAP = { moi: 'Mới', da_goi: 'Đã gọi', quan_tam: 'Quan tâm', da_chot: 'Đã chốt', huy: 'Hủy' };
    
    const headers = ['STT', 'Thời gian', 'Họ và tên', 'Số điện thoại', 'Email', 'Doanh nghiệp / Chức vụ', 'Hạng vé', 'Số người', 'Trạng thái', 'Ghi chú', 'Nguồn UTM'];
    
    const csvRows = [headers.map(h => `"${h}"`).join(',')];
    
    leads.forEach((l, idx) => {
      const row = [
        idx + 1,
        new Date(l.received_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
        l.full_name || '',
        `\t${l.phone || ''}`, // Tab prefix to preserve leading zero in Excel
        l.email || '',
        l.company || '',
        TICKET_MAP[l.ticket] || l.ticket,
        l.attendees || '1',
        STATUS_MAP[l.status] || l.status || 'Mới',
        (l.note || '').replace(/"/g, '""'),
        [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(' / ') || 'Trực tiếp'
      ];
      csvRows.push(row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n'); // BOM for UTF-8 in Excel
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=danh-sach-dang-ky-${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvContent);
  } catch (err) {
    res.status(500).send('Lỗi khi xuất file Excel/CSV.');
  }
});

// Admin Route
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Invitation Card Routes
app.get(['/thiep-moi', '/thiepmoi', '/invitation'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thiep-moi.html'));
});

// Root Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export app for Vercel Serverless
module.exports = app;

// Start Server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Business Meeting 2026 Server running at:`);
    console.log(`👉 Landing Page: http://localhost:${PORT}`);
    console.log(`👉 Admin CRM:   http://localhost:${PORT}/admin`);
    console.log(`👉 Password:     ${ADMIN_PASSWORD}`);
    console.log(`====================================================`);
  });
}

