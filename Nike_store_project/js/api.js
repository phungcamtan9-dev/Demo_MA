// Đọc URL từ bộ nhớ trình duyệt, nếu chưa có thì dùng tạm một link mặc định
let API_URL = localStorage.getItem('SAVED_API_URL') || 'https://chuadatchuan.trycloudflare.com/api';

// Hàm cấu hình API động (dành cho Admin/Developer lúc demo)
function configAPI() {
    let currentLink = API_URL.replace('/api', '');
    let newUrl = prompt("Nhập đường dẫn Cloudflare mới vào đây:", currentLink);
    
    if (newUrl) {
        // Xử lý chuỗi để đảm bảo định dạng luôn đúng dù bro copy dư dấu /
        if(newUrl.endsWith('/')) newUrl = newUrl.slice(0, -1);
        if(!newUrl.endsWith('/api')) newUrl += '/api';
        
        API_URL = newUrl;
        localStorage.setItem('SAVED_API_URL', API_URL); // Lưu vào bộ nhớ
        alert("Đã cập nhật API mới! Trang web sẽ tự tải lại.");
        location.reload(); // Tự động F5 lại trang
    }
}

// Hàm gọi API dùng chung (Tự động đính kèm chìa khóa vượt rào)
async function fetchAPI(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        // ĐÂY LÀ CHÌA KHÓA ĐỂ VƯỢT QUA TRANG CẢNH BÁO CỦA LOCALTUNNEL
        'Bypass-Tunnel-Reminder': 'true' 
    };

    const response = await fetch(API_URL + endpoint, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {})
        }
    });
    
    // Nếu có lỗi, trình duyệt sẽ báo đỏ trong Console thay vì sập im lặng
    if (!response.ok) {
        console.error("Lỗi gọi API:", response.status, await response.text());
        return { error: "Không thể kết nối đến máy chủ API" };
    }
    
    return await response.json();
}

// ==========================================
// CÁC HÀM GIAO TIẾP VỚI BACKEND
// ==========================================

// Lấy danh sách sản phẩm
async function fetchProductsFromAPI() {
    return await fetchAPI('/products');
}

// Đăng ký
async function apiRegister(email, password) {
    return await fetchAPI('/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// Đăng nhập
async function apiLogin(email, password) {
    return await fetchAPI('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

// Cập nhật thông tin (Chứa lỗ hổng Mass Assignment)
async function apiUpdateProfile(userId, updateData) {
    return await fetchAPI(`/users/${userId}/update-profile`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
    });
}

// Thanh toán
async function apiCheckout(orderData) {
    return await fetchAPI('/checkout', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

// Admin lấy danh sách User
async function apiGetUsers() {
    return await fetchAPI('/admin/users');
}

// Admin lấy lịch sử đơn hàng
async function apiGetOrders() {
    return await fetchAPI('/admin/orders');
}

// Admin xóa tài khoản
async function apiDeleteUser(userId) {
    return await fetchAPI(`/admin/users/${userId}`, {
        method: 'DELETE'
    });
}