const request = require('supertest');
const app = require('./index');

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('GET /api', () => {
  it('should return 200 and hello message', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Hello from the Node.js Backend Service' });
  });
});

describe('GET /', () => {
  it('should return 200 and an HTML landing page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Cloud-Native Architecture');
  });
});
