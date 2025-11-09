import 'dotenv/config';
import { createServer, Server } from 'node:http';
import request from 'supertest';
import { requestListener } from '../src/index';

describe('GET /api/users', () => {
  let server: Server;

  beforeAll((done) => {
    server = createServer(requestListener);
    server.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should return empty array when database is empty', async () => {
    const response = await request(server).get('/api/users').expect(200);
    const { message }: {message: string}  = response.body;

    expect(Array.isArray(message)).toBe(true);
    expect(message.length).toBe(0);
  });
});
