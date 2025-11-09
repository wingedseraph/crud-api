import 'dotenv/config';
import { createServer, Server } from 'node:http';
import request from 'supertest';
import { requestListener } from '../src/index';

describe('GET/POST scenario', () => {
  let server: Server;

  beforeAll((done) => {
    server = createServer(requestListener);
    server.listen(0, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  test('1. GET /api/users: should return empty array when database is empty', async () => {
    const response = await request(server).get('/api/users').expect(200);
    const { message }: { message: string } = response.body;

    expect(Array.isArray(message)).toBe(true);
    expect(message.length).toBe(0);
  });

  test('2. POST api/users: should return newly created record', async () => {
    const body = { username: 'jack', age: 20, hobbies: ['money'] };
    const response = await request(server)
      .post('/api/users')
      .send(body)
      .expect(201);
    const { username, age, hobbies } = response.body.message;

    expect(response.body.message).toHaveProperty('id');
    expect(username).toBe(body.username);
    expect(age).toBe(body.age);
    expect(hobbies).toStrictEqual(body.hobbies);
  });
  test('3. POST api/users: should return newly created record', async () => {
    const body = { username: 'jack', age: 20, hobbies: ['money'] };
    const getAllUsers = await request(server).get('/api/users').expect(200);
    const { id } = getAllUsers.body.message[0];
    const getUser = await request(server).get(`/api/users${id}`).expect(200);
    const { username, age, hobbies } = getUser.body.message[0];

    expect(id).toBe(getAllUsers.body.message[0].id);
    expect(username).toBe(body.username);
    expect(age).toBe(body.age);
    expect(hobbies).toStrictEqual(body.hobbies);
  });
});
