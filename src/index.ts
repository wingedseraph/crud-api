import 'dotenv/config';
// import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { route } from './router/router';

const PORT = process.env.CRUD_PORT;

// type User = {
//   username: string;
//   age: number;
//   hobbies: string[];
//   id: string;
// };
// const user: User[] = null;

const server = createServer((req, res) => {
  // const { method, url } = req
  route(req, res);

  // if (!url) return null;

  // if (url.startsWith('/api/users')) {
  //   if (method === 'POST') {
  //     res.end(method);
  //   } else if (method === 'PUT' && url.includes('/api/users/')) {
  //     res.end(method);
  //   } else if (method === 'DELETE' && url.includes('/api/users/')) {
  //     res.end(method);
  //   }
  // } else {
  //   // 404 for invalid routes
  //   res.writeHead(404, { 'Content-Type': 'application/json' });
  //   res.end(JSON.stringify({ message: 'Resource Not Found' }));
  // }
});

server.listen(PORT);
