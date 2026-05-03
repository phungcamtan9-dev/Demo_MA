import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// Metrics
const errorRate = new Rate('errors');
const loginLatency = new Trend('login_duration');
const commentsLatency = new Trend('comments_duration');
const heavyLatentcy =  new Trend("heavyLoad_duration");

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 50 },   // warm-up
        { duration: '40s', target: 150 },  // medium load
        { duration: '40s', target: 300 },  // heavy load
        { duration: '30s', target: 500 },  // BREAK zone
        { duration: '20s', target: 0 },    // cooldown
      ],
      gracefulRampDown: '5s',
    }
  },

  thresholds: {
    http_req_duration: ['p(95)<1500'], // relax a bit to observe degradation
    errors: ['rate<0.2'],              // expect errors under stress
  }
};

const BASE_URL = 'http://localhost:3000';

export default function () {

  // 1. Hit comments more (likely DB heavy)
  let commentsRes = http.get(`${BASE_URL}/api/comments`, { timeout: '2s' });
  commentsLatency.add(commentsRes.timings.duration);

  let ok1 = check(commentsRes, {
    'comments ok': (r) => r.status === 200,
  });
  if (!ok1) errorRate.add(1);

  // 2. Login burst (expensive endpoint)
  const payload = JSON.stringify({
    username: 'admin',
    password: 'admin123'
  });

  let loginRes = http.post(`${BASE_URL}/api/login`, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: '2s',
  });

  loginLatency.add(loginRes.timings.duration);

  let ok2 = check(loginRes, {
    'login responded': (r) => r.status === 200 || r.status === 401,
  });
  if (!ok2) errorRate.add(1);

    // 3. Hit heavy endpoint to observe CPU bottleneck
    let heavyRes = http.get(`${BASE_URL}/api/heavy`, { timeout: '5s' });
    heavyLatentcy.add(heavyRes.timings.duration);

    let ok3 = check(heavyRes, {
      'heavy endpoint ok': (r) => r.status === 200,
    });
    if (!ok3) errorRate.add(1);
  // 3. Minimal sleep → higher pressure
  sleep(0.1);
}