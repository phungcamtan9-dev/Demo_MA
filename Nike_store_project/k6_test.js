import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate } from 'k6/metrics';

// Khởi tạo các biến đo lường
const errorRate = new Rate('errors');
const productsLatency = new Trend('products_duration');

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 500 },   // Khởi động
        { duration: '40s', target: 2000 },  // Tải trung bình
        { duration: '40s', target: 10000 },  // Tải cực nặng (Ép DB làm việc)
        { duration: '20s', target: 0 },    // Hạ nhiệt
      ],
      gracefulRampDown: '5s',
    }
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'], 
    errors: ['rate<0.1'],              
  }
};

// Đảm bảo trỏ đúng vào cổng Backend đang chạy
const BASE_URL = 'http://localhost:3000';

export default function () {
  // Bắn thẳng vào API lấy danh sách sản phẩm
  // Đây là điểm yếu vì Backend bắt buộc phải query xuống MySQL để lấy dữ liệu
  let productsRes = http.get(`${BASE_URL}/api/products`, { timeout: '5s' });
  
  productsLatency.add(productsRes.timings.duration);

  let isSuccessful = check(productsRes, {
    'Load danh sách giày thành công (200)': (r) => r.status === 200,
  });
  
  if (!isSuccessful) errorRate.add(1);

  // Thời gian nghỉ siêu ngắn để tạo áp lực liên tục
  sleep(0.1);
}