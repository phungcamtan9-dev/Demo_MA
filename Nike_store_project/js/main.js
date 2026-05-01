document.getElementById('admin-page').style.display = 'none';

// Biến toàn cục để lưu trữ sản phẩm sau khi tải từ DB về
let globalProducts = [];

// Khởi chạy mọi thứ một cách đồng bộ khi trang web load xong
window.onload = async () => {
    try {
        // 1. Tải danh sách sản phẩm từ DB
        globalProducts = await fetchProductsFromAPI();
        
        // 2. Hiển thị tất cả sản phẩm lên màn hình chính ngay lập tức
        renderProducts('all'); 
        
        // 3. Kiểm tra xem người dùng đã đăng nhập trước đó chưa
        checkLoginStatus(); 
    } catch (error) {
        console.error("Lỗi khi khởi chạy trang:", error);
    }
};

// Hàm hiển thị trang tương ứng (Trang chủ / Sản phẩm / Chi tiết)
function showPage(pageId) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('product-page').style.display = 'none';
    document.getElementById('detail-page').style.display = 'none';
    
    document.getElementById(pageId + '-page').style.display = 'block';
}

// Hàm render danh sách sản phẩm theo danh mục (Nam / Nữ / Tất cả)
function renderProducts(filterGender) {
    showPage('product');
    const productListDiv = document.getElementById('product-list');
    const pageTitle = document.getElementById('page-title-text');
    productListDiv.innerHTML = ''; 

    if (filterGender === 'nam') pageTitle.innerText = "Giày Nam";
    else if (filterGender === 'nu') pageTitle.innerText = "Giày Nữ";
    else pageTitle.innerText = "Tất cả giày";

    // Thay đổi từ `products` (file data.js cũ) thành `globalProducts`
    globalProducts.forEach(product => {
        if (filterGender === 'all' || product.gender === filterGender) {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.onclick = () => viewDetail(product.id);
            
            productCard.innerHTML = `
                <img src="${product.image}" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">${product.price}</div>
            `;
            productListDiv.appendChild(productCard);
        }
    });
}

// Hàm hiển thị trang chi tiết khi click vào 1 sản phẩm
function viewDetail(productId) {
    const product = globalProducts.find(p => p.id === productId);
    if (!product) return;

    // Đổ dữ liệu vào trang chi tiết
    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-price').innerText = product.price;

    // Tạo lưới chọn size từ 37 đến 44
    const sizeGrid = document.getElementById('size-grid');
    sizeGrid.innerHTML = '';
    for (let size = 37; size <= 44; size++) {
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.innerText = `EU ${size}`;
        btn.onclick = () => selectSize(btn);
        sizeGrid.appendChild(btn);
    }

    // Chuyển sang màn hình chi tiết
    showPage('detail');
}

// Hàm xử lý chọn size giày
let currentSelectedSize = null;
function selectSize(clickedBtn) {
    // Xóa class 'selected' ở tất cả các nút
    const buttons = document.querySelectorAll('.size-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // Thêm class 'selected' cho nút vừa bấm
    clickedBtn.classList.add('selected');
    currentSelectedSize = clickedBtn.innerText;
}

// ==========================================
// XỬ LÝ GIỎ HÀNG & THANH TOÁN
// ==========================================
let cart = []; // Mảng chứa các sản phẩm được chọn

// Hàm thêm vào giỏ hàng
function addToCart() {
    if (!currentSelectedSize) {
        alert("Vui lòng chọn size trước khi thêm vào giỏ hàng nhé!");
        return;
    }
    
    const productName = document.getElementById('detail-name').innerText;
    const productPrice = document.getElementById('detail-price').innerText;
    
    // Thêm sản phẩm vào mảng cart
    cart.push({
        name: productName,
        price: productPrice,
        size: currentSelectedSize
    });
    
    // Cập nhật số lượng trên icon giỏ hàng
    document.getElementById('cart-count').innerText = `(${cart.length})`;
    alert(`Đã thêm ${productName} (Size: ${currentSelectedSize}) vào giỏ hàng!`);
}

// Hàm hiển thị hộp thoại giỏ hàng
function showCartModal() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    
    if (cart.length === 0) {
        cartDiv.innerHTML = '<p>Giỏ hàng của bạn đang trống.</p>';
    } else {
        cart.forEach((item, index) => {
            cartDiv.innerHTML += `
                <div style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                    <b>${item.name}</b> (Size: ${item.size}) <br>
                    <span style="color: #9e3500;">${item.price}</span>
                </div>
            `;
        });
    }
    document.getElementById('cart-modal').style.display = 'block';
}

// Hàm Xử lý Thanh toán
async function processCheckout() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
        alert("Bạn cần đăng nhập để thanh toán!");
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('auth-modal').style.display = 'block';
        return;
    }

    const user = JSON.parse(userString);

    // KIỂM TRA: Bắt buộc phải có tên và sđt mới cho thanh toán
    if (!user.fullname || !user.phone) {
        alert("Vui lòng cập nhật Họ Tên và Số điện thoại trước khi mua hàng!");
        document.getElementById('cart-modal').style.display = 'none';
        document.getElementById('update-modal').style.display = 'block';
        return;
    }

    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }

    // Gửi từng sản phẩm trong giỏ hàng xuống DB
    for (const item of cart) {
        const orderData = {
            user_id: user.id,
            buyer_name: user.fullname,
            product_name: `${item.name} (Size: ${item.size})`,
            price: item.price
        };
        await apiCheckout(orderData);
    }

    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
    cart = []; // Làm rỗng giỏ hàng
    document.getElementById('cart-count').innerText = `(0)`;
    document.getElementById('cart-modal').style.display = 'none';
}

// ==========================================
// QUẢN LÝ XÁC THỰC & NGƯỜI DÙNG
// ==========================================

let isLoginMode = true; // Trạng thái mặc định là Đăng nhập

// Hàm chuyển đổi giữa Form Đăng nhập và Đăng ký
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Đăng Nhập" : "Đăng Ký";
    document.querySelector('#auth-modal p').innerText = isLoginMode ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập";
}

// Hàm xử lý nút Xác nhận (Đăng nhập/Đăng ký)
async function submitAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert("Vui lòng nhập đầy đủ email và mật khẩu!");
        return;
    }

    if (isLoginMode) {
        // Xử lý Đăng nhập
        const res = await apiLogin(email, password);
        if (res.user) {
            alert(res.message);
            // Lưu thông tin user vào trình duyệt để dùng cho các trang khác
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            document.getElementById('auth-modal').style.display = 'none';
            checkLoginStatus(); // Cập nhật lại giao diện Header
        } else {
            alert(res.error);
        }
    } else {
        // Xử lý Đăng ký
        const res = await apiRegister(email, password);
        if (res.userId) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            toggleAuthMode(); // Chuyển về form đăng nhập
        } else {
            alert(res.error);
        }
    }
}

// Hàm kiểm tra trạng thái đăng nhập khi load web
function checkLoginStatus() {
    const userString = localStorage.getItem('currentUser');
    const statusDiv = document.getElementById('user-status');
    
    if (userString) {
        const user = JSON.parse(userString);
        statusDiv.innerHTML = `Xin chào, <b>${user.fullname || user.email}</b> | <span style="cursor:pointer;" onclick="logout()">Đăng xuất</span>`;
    } else {
        statusDiv.innerHTML = `<span style="cursor:pointer;" onclick="document.getElementById('auth-modal').style.display='block'">Tham Gia | Đăng Nhập</span>`;
    }
}

// Hàm Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    alert("Đã đăng xuất!");
}

// Chạy hàm kiểm tra lúc khởi động web
window.addEventListener('DOMContentLoaded', checkLoginStatus);

// ==========================================
// XỬ LÝ TRANG QUẢN TRỊ (ADMIN)
// ==========================================

// Cập nhật lại hàm checkLoginStatus để hiện nút Admin
function checkLoginStatus() {
    const userString = localStorage.getItem('currentUser');
    const statusDiv = document.getElementById('user-status');
    
    if (userString) {
        const user = JSON.parse(userString);
        let html = `Xin chào, <b>${user.fullname || user.email}</b> | `;
        
        // Nếu là admin thì hiện thêm nút vào trang quản trị
        if (user.role === 'admin') {
            html += `<span style="cursor:pointer; color:red; font-weight:bold;" onclick="loadAdminPage()">Trang Admin</span> | `;
        }
        
        html += `<span style="cursor:pointer;" onclick="logout()">Đăng xuất</span>`;
        statusDiv.innerHTML = html;
    } else {
        statusDiv.innerHTML = `<span style="cursor:pointer;" onclick="document.getElementById('auth-modal').style.display='block'">Tham Gia | Đăng Nhập</span>`;
    }
}
    
let globalAdminUsers = []; // Biến lưu tạm danh sách user để xem chi tiết

// Hàm tải dữ liệu và hiển thị trang Admin
async function loadAdminPage() {
    showPage('admin'); 
    
    globalAdminUsers = await apiGetUsers(); // Lưu vào biến toàn cục
    const orders = await apiGetOrders();
    
    const usersTable = document.getElementById('admin-users-table');
    usersTable.innerHTML = '';
    globalAdminUsers.forEach(u => {
        // Thêm onclick và thay đổi con trỏ chuột (cursor:pointer) để báo hiệu có thể click
        usersTable.innerHTML += `<tr style="cursor:pointer;" title="Nhấn vào để xem Mật khẩu" onclick="showUserDetails(${u.id})">
            <td>${u.id}</td><td>${u.email}</td>
            <td style="${u.role === 'admin' ? 'color:red; font-weight:bold;' : ''}">${u.role}</td>
            <td>${u.fullname || 'Chưa cập nhật'}</td>
            <td>${u.phone || 'Chưa cập nhật'}</td>
        </tr>`;
    });

    const ordersTable = document.getElementById('admin-orders-table');
    ordersTable.innerHTML = '';
    orders.forEach(o => {
        const time = new Date(o.created_at).toLocaleString('vi-VN'); 
        ordersTable.innerHTML += `<tr>
            <td>#${o.id}</td><td>${o.buyer_name}</td><td>${o.product_name}</td>
            <td style="color: #9e3500; font-weight:bold;">${o.price}</td><td>${time}</td>
        </tr>`;
    });
}

// Hàm mới: Hiển thị mật khẩu và email khi click vào dòng tài khoản
function showUserDetails(userId) {
    const user = globalAdminUsers.find(u => u.id === userId);
    if (user) {
        alert(`BẢO MẬT TÀI KHOẢN:\n\n- Email: ${user.email}\n- Mật khẩu: ${user.password}\n- Địa chỉ: ${user.address || 'Chưa cập nhật'}`);
    }
}

// ==========================================
// CẬP NHẬT THÔNG TIN (MASS ASSIGNMENT LAB)
// ==========================================

// Hàm lưu thông tin cập nhật
async function submitUpdateProfile() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return alert("Bạn cần đăng nhập!");
    let user = JSON.parse(userString);

    const fullname = document.getElementById('update-name').value;
    const phone = document.getElementById('update-phone').value;
    const address = document.getElementById('update-address').value; // Lấy giá trị địa chỉ

    // TẠO OBJECT DỮ LIỆU ĐỂ GỬI ĐI (Cập nhật thêm address)
    const payload = {
        fullname: fullname,
        phone: phone,
        address: address
    };

    const res = await apiUpdateProfile(user.id, payload);
    
    if (res.message) {
        alert("Đã cập nhật thông tin!");
        user.fullname = fullname;
        user.phone = phone;
        user.address = address; // Lưu vào trình duyệt
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        document.getElementById('update-modal').style.display = 'none';
        checkLoginStatus();
    } else {
        alert("Lỗi: " + res.error);
    }
}