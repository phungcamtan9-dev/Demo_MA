// Hàm gọi API lấy danh sách sản phẩm từ Backend
async function fetchProductsFromAPI() {
    try {
        // Gọi đến địa chỉ máy chủ Node.js của chúng ta
        const response = await fetch('http://localhost:3000/api/products');
        
        if (!response.ok) {
            throw new Error('Lỗi mạng hoặc server không phản hồi');
        }
        
        // Chuyển đổi dữ liệu nhận được thành mảng JavaScript
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ Database:', error);
        return []; // Trả về mảng rỗng nếu có lỗi để web không bị sập
    }
}

// Gọi API Đăng ký
async function apiRegister(email, password) {
    const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

// Gọi API Đăng nhập
async function apiLogin(email, password) {
    const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

// Gọi API Cập nhật thông tin (Nơi chứa lỗ hổng Mass Assignment)
async function apiUpdateProfile(userId, updateData) {
    const response = await fetch(`http://localhost:3000/api/users/${userId}/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Chú ý: Toàn bộ đối tượng updateData được chuyển thành chuỗi và gửi đi. 
        // Kẻ tấn công có thể chèn thêm {"role": "admin"} vào đây trước khi gửi.
        body: JSON.stringify(updateData) 
    });
    return await response.json();


}

// Gọi API Thanh toán
async function apiCheckout(orderData) {
    const response = await fetch('http://localhost:3000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    return await response.json();
}

// Gọi API Lấy danh sách Users (Admin)
async function apiGetUsers() {
    const response = await fetch('http://localhost:3000/api/admin/users');
    return await response.json();
}

// Gọi API Lấy danh sách Đơn hàng (Admin)
async function apiGetOrders() {
    const response = await fetch('http://localhost:3000/api/admin/orders');
    return await response.json();
}