// ==========================================
// BIẾN TOÀN CỤC (GLOBAL VARIABLES)
// ==========================================
let globalProducts = [];
let globalAdminUsers = [];
let cart = []; 
let currentSelectedSize = null;
let isLoginMode = true; 

// ==========================================
// KHỞI CHẠY HỆ THỐNG
// ==========================================
window.onload = async () => {
    try {
        globalProducts = await fetchProductsFromAPI();
        renderProducts('all'); 
        checkLoginStatus(); 
    } catch (error) {
        console.error("Lỗi khởi chạy:", error);
    }
};

// ==========================================
// ĐIỀU HƯỚNG GIAO DIỆN (ROUTING)
// ==========================================
function showPage(pageId) {
    document.getElementById('home-page').style.display = 'none';
    document.getElementById('product-page').style.display = 'none';
    document.getElementById('detail-page').style.display = 'none';
    document.getElementById('cart-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'none';
    
    document.getElementById(pageId + '-page').style.display = 'block';
}

// ==========================================
// XỬ LÝ SẢN PHẨM (PRODUCTS)
// ==========================================
function renderProducts(filterGender) {
    showPage('product');
    const productListDiv = document.getElementById('product-list');
    const pageTitle = document.getElementById('page-title-text');
    productListDiv.innerHTML = ''; 

    if (filterGender === 'nam') pageTitle.innerText = "Giày Nam";
    else if (filterGender === 'nu') pageTitle.innerText = "Giày Nữ";
    else pageTitle.innerText = "Tất cả giày";

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

function viewDetail(productId) {
    const product = globalProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('detail-img').src = product.image;
    document.getElementById('detail-name').innerText = product.name;
    document.getElementById('detail-category').innerText = product.category;
    document.getElementById('detail-price').innerText = product.price;

    const sizeGrid = document.getElementById('size-grid');
    sizeGrid.innerHTML = '';
    for (let size = 37; size <= 44; size++) {
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.innerText = `EU ${size}`;
        btn.onclick = () => selectSize(btn);
        sizeGrid.appendChild(btn);
    }
    showPage('detail');
}

function selectSize(clickedBtn) {
    const buttons = document.querySelectorAll('.size-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    clickedBtn.classList.add('selected');
    currentSelectedSize = clickedBtn.innerText;
}

// ==========================================
// XÁC THỰC & NGƯỜI DÙNG (AUTH & PROFILE)
// ==========================================
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Đăng Nhập" : "Đăng Ký";
    document.querySelector('#auth-modal p').innerText = isLoginMode ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập";
}

async function submitAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) return alert("Vui lòng nhập đầy đủ email và mật khẩu!");

    if (isLoginMode) {
        const res = await apiLogin(email, password);
        if (res.user) {
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            document.getElementById('auth-modal').style.display = 'none';
            checkLoginStatus();
        } else alert(res.error);
    } else {
        const res = await apiRegister(email, password);
        if (res.userId) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            toggleAuthMode();
        } else alert(res.error);
    }
}

function checkLoginStatus() {
    const userString = localStorage.getItem('currentUser');
    const statusDiv = document.getElementById('user-status');
    const profileIcon = document.getElementById('profile-icon');
    
    if (userString) {
        const user = JSON.parse(userString);
        let html = `Xin chào, <b>${user.fullname || user.email}</b> | `;
        
        if (user.role === 'admin') {
            html += `<span style="cursor:pointer; color:red; font-weight:bold;" onclick="loadAdminPage()">Trang Admin</span> | `;
        }
        
        html += `<span style="cursor:pointer;" onclick="logout()">Đăng xuất</span>`;
        statusDiv.innerHTML = html;
        if (profileIcon) profileIcon.style.display = 'inline'; 
    } else {
        statusDiv.innerHTML = `<span style="cursor:pointer;" onclick="document.getElementById('auth-modal').style.display='block'">Tham Gia | Đăng Nhập</span>`;
        if (profileIcon) profileIcon.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    checkLoginStatus();
    showPage('home');
}

async function submitUpdateProfile() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return alert("Bạn cần đăng nhập!");
    let user = JSON.parse(userString);

    const fullname = document.getElementById('update-name').value;
    const phone = document.getElementById('update-phone').value;
    const address = document.getElementById('update-address').value;

    const payload = { fullname, phone, address };
    const res = await apiUpdateProfile(user.id, payload);
    
    if (res.message) {
        alert("Đã cập nhật thông tin!");
        user.fullname = fullname; user.phone = phone; user.address = address;
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('update-modal').style.display = 'none';
        checkLoginStatus();
    } else alert("Lỗi: " + res.error);
}

// ==========================================
// GIỎ HÀNG & THANH TOÁN (CART & CHECKOUT)
// ==========================================
function addToCart() {
    if (!currentSelectedSize) return alert("Vui lòng chọn size!");
    const productName = document.getElementById('detail-name').innerText;
    const productPrice = document.getElementById('detail-price').innerText;
    
    cart.push({ name: productName, price: productPrice, size: currentSelectedSize });
    document.getElementById('cart-count').innerText = `(${cart.length})`;
    alert(`Đã thêm ${productName} vào giỏ hàng!`);
}

function showCartPage() {
    showPage('cart'); 
    const cartDiv = document.getElementById('cart-page-items');
    cartDiv.innerHTML = '';
    let totalMoney = 0; 

    if (cart.length === 0) {
        cartDiv.innerHTML = '<p style="color:#707070;">There are no items in your bag.</p>';
    } else {
        cart.forEach((item) => {
            let itemPriceNum = parseInt(item.price.replace(/,/g, '').replace('đ', '')) || 0;
            totalMoney += itemPriceNum;
            cartDiv.innerHTML += `
                <div style="display:flex; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
                    <div style="flex:1;">
                        <div style="font-weight: 500; font-size: 16px;">${item.name}</div>
                        <div style="color: #707070; margin-top: 5px;">Size: ${item.size}</div>
                    </div>
                    <div style="font-weight: 500;">${item.price}</div>
                </div>
            `;
        });
    }

    let formattedTotal = totalMoney.toLocaleString('vi-VN') + 'đ';
    document.getElementById('cart-subtotal').innerText = formattedTotal;
    document.getElementById('cart-total').innerText = formattedTotal;
}

async function processCheckout() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
        alert("Bạn cần đăng nhập để thanh toán!");
        return document.getElementById('auth-modal').style.display = 'block';
    }

    const user = JSON.parse(userString);
    if (!user.fullname || !user.phone || !user.address) {
        alert("Vui lòng cập nhật Họ Tên, SĐT và Địa chỉ trước khi mua hàng!");
        return document.getElementById('update-modal').style.display = 'block';
    }

    if (cart.length === 0) return alert("Giỏ hàng trống!");

    for (const item of cart) {
        await apiCheckout({
            user_id: user.id, buyer_name: user.fullname,
            product_name: `${item.name} (Size: ${item.size})`, price: item.price
        });
    }

    alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
    cart = []; 
    document.getElementById('cart-count').innerText = `(0)`;
    showCartPage(); 
}

// ==========================================
// TRANG QUẢN TRỊ (ADMIN)
// ==========================================
async function loadAdminPage() {
    try {
        showPage('admin'); 
        globalAdminUsers = await apiGetUsers(); 
        const orders = await apiGetOrders();
        
        const usersTable = document.getElementById('admin-users-table');
        usersTable.innerHTML = '';
        if (!globalAdminUsers || globalAdminUsers.length === 0) {
            usersTable.innerHTML = '<tr><td colspan="6" style="text-align:center;">Không có tài khoản nào</td></tr>';
        } else {
            globalAdminUsers.forEach(u => {
                usersTable.innerHTML += `<tr style="cursor:pointer;" title="Nhấn vào để xem Mật khẩu" onclick="showUserDetails(${u.id})">
                    <td>${u.id}</td><td>${u.email}</td>
                    <td style="${u.role === 'admin' ? 'color:red; font-weight:bold;' : ''}">${u.role}</td>
                    <td>${u.fullname || 'Chưa cập nhật'}</td>
                    <td>${u.phone || 'Chưa cập nhật'}</td>
                    <td>
                        <button onclick="event.stopPropagation(); deleteUserAdmin(${u.id})" style="background:#ff4d4f; color:white; border:none; padding:8px 12px; cursor:pointer; border-radius: 4px; font-weight: bold;">Xóa</button>
                    </td>
                </tr>`;
            });
        }

        const ordersTable = document.getElementById('admin-orders-table');
        ordersTable.innerHTML = '';
        if (!orders || orders.length === 0) {
            ordersTable.innerHTML = '<tr><td colspan="5" style="text-align:center;">Chưa có đơn hàng nào</td></tr>';
        } else {
            orders.forEach(o => {
                const time = new Date(o.created_at).toLocaleString('vi-VN'); 
                ordersTable.innerHTML += `<tr>
                    <td>#${o.id}</td><td>${o.buyer_name}</td><td>${o.product_name}</td>
                    <td style="color: #9e3500; font-weight:bold;">${o.price}</td><td>${time}</td>
                </tr>`;
            });
        }
    } catch (error) {
        console.error("Lỗi khi tải trang Admin:", error);
    }
}

function showUserDetails(userId) {
    const user = globalAdminUsers.find(u => u.id === userId);
    if (user) alert(`BẢO MẬT TÀI KHOẢN:\n\n- Email: ${user.email}\n- Mật khẩu: ${user.password}\n- Địa chỉ: ${user.address || 'Chưa cập nhật'}`);
}

async function deleteUserAdmin(userId) {
    if (confirm("Bro có chắc chắn muốn xóa tài khoản này không?")) {
        const res = await apiDeleteUser(userId);
        if (res.message) {
            alert(res.message);
            loadAdminPage(); 
        } else alert("Lỗi: " + res.error);
    }
}