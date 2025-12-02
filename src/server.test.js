const request = require('supertest');
const { app } = require('./server');
const http = require('http');

const srv = app.listen(0); // Listen on a random available port

afterAll(() => {
  srv.close();
});

describe('GET /v1/rides', () => {
test('should return empty ride list', async () => {
    const res = await request(srv).get('/v1/rides');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});