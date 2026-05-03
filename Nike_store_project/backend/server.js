// Khai báo thư viện
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Bypass-Tunnel-Reminder']
}));
app.use(express.json());
// // ==========================================
// // WAF BẢO VỆ TẦNG HTTP (KIỂM DUYỆT GÓI TIN)
// // ==========================================
// app.use((req, res, next) => {
//     // Chỉ kiểm tra các gói tin có mang theo dữ liệu (POST, PUT, PATCH)
//     if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        
//         // Rà quét xem trong gói hàng (req.body) có chứa thuộc tính 'role' không
//         if (req.body && req.body.role !== undefined) {
//             console.log(`[CẢNH BÁO BẢO MẬT] Phát hiện nỗ lực tấn công Mass Assignment từ IP: ${req.ip}`);
            
//             // Chặn đứng kết nối ở ngay vòng ngoài, trả về mã 403 (Cấm truy cập)
//             return res.status(403).json({ 
//                 error: "Access Denied: Phát hiện dữ liệu không hợp lệ trong gói tin mạng!" 
//             });
//         }
//     }
//     // Nếu gói tin an toàn, cho phép đi tiếp vào Backend
//     next(); 
// });


// Kết nối Database
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'nike_store'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối MySQL:', err.message);
        return;
    }
    console.log('Đã kết nối thành công với MySQL Database!');
    initDatabase();
});

// Hàm tạo bảng và dữ liệu mẫu
function initDatabase() {
    // 1. Bảng Products
    db.query(`CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price VARCHAR(50), category VARCHAR(100), gender VARCHAR(50), image VARCHAR(500))`, (err) => {
        if (!err) {
            db.query(`SELECT COUNT(*) AS count FROM products`, (err, results) => {
                if (results[0].count === 0) {
                    const insertQuery = `INSERT INTO products (name, price, category, gender, image) VALUES ?`;
                    const values = [
                        ["Air Jordan 1", "12,500,000đ", "Giày Nam", "nam", "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80"],
                        ["Nike Air Force 1", "2,000,000đ", "Giày Nam", "nam", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80"],
                        ["Nike Ava X", "2,500,000đ", "Giày Nam", "nam", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80"],
                        ["Nike Downshifter 14", "1,700,000đ", "Giày Nam", "nam", "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80"],
                        ["Air Force 1 '07 LV8 'Denim'", "3,000,000đ", "Giày Nữ", "nu", "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80"],
                        ["Ja 3 'Jelly Bean'", "2,700,000đ", "Giày Nữ", "nu", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80"]
                    ];
                    db.query(insertQuery, [values], () => console.log("Đã tự động thêm giày mẫu!"));
                }
            });
        }
    });

    // 2. Bảng Users
    db.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255), role VARCHAR(50) DEFAULT 'user', fullname VARCHAR(255), phone VARCHAR(20), address VARCHAR(500), gender VARCHAR(10))`, (err) => {
        if (!err) {
            db.query(`INSERT IGNORE INTO users (email, password, role, fullname) VALUES ('admin@nike.com', 'admin123', 'admin', 'Quản trị viên')`);
        }
    });

    // 3. Bảng Orders
    db.query(`CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, buyer_name VARCHAR(255), product_name VARCHAR(255), price VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
}

// ==========================================
// CÁC API CỦA HỆ THỐNG
// ==========================================

// Lấy danh sách sản phẩm
app.get('/api/products', (req, res) => {
    db.query(`SELECT * FROM products`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Đăng ký
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    db.query(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], (err, result) => {
        if (err) return res.status(500).json({ error: "Email đã tồn tại hoặc lỗi hệ thống" });
        res.json({ message: "Đăng ký thành công", userId: result.insertId });
    });
});

// Đăng nhập
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) res.json({ message: "Đăng nhập thành công", user: results[0] });
        else res.status(401).json({ error: "Sai email hoặc mật khẩu" });
    });
});

// Cập nhật thông tin (Chứa lỗi Mass Assignment để test)
app.put('/api/users/:id/update-profile', (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
    db.query('UPDATE users SET ? WHERE id = ?', [updateData, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Cập nhật thông tin thành công!", data: updateData });
    });
});

// Admin: Xem User
app.get('/api/admin/users', (req, res) => {
    db.query(`SELECT id, email, password, role, fullname, phone, address, gender FROM users`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// User: Thanh toán
app.post('/api/checkout', (req, res) => {
    const { user_id, buyer_name, product_name, price } = req.body;
    db.query(`INSERT INTO orders (user_id, buyer_name, product_name, price) VALUES (?, ?, ?, ?)`, [user_id, buyer_name, product_name, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Thanh toán thành công!" });
    });
});

// Admin: Xem Lịch sử mua hàng
app.get('/api/admin/orders', (req, res) => {
    db.query(`SELECT * FROM orders ORDER BY created_at DESC`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server Backend đang chạy tại: http://localhost:${PORT}`);
});

// Admin: Xóa tài khoản
app.delete('/api/admin/users/:id', (req, res) => {
    const userId = req.params.id;
    // Không cho phép tự xóa tài khoản Admin mặc định (id = 1) để tránh lỗi hệ thống
    if (userId == 1) {
        return res.status(400).json({ error: "Không thể xóa Admin gốc!" });
    }
    
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Đã xóa tài khoản thành công!" });
    });
});

