


![gif-crud](https://wingedseraph.github.io/dump/assets/crud.gif)


A simple **crud-api** built with Node.js. Supports user creation, reading, updating, and deletion.

## Requirements

* Node.js **v24.14.0** or higher
* `.env` file defining application port (see `.env.example`)

## Installation

```bash
git clone https://github.com/wingedseraph/crud-api.git
cd crud-api
npm install
```

Create `.env` file based on `.env.example`:

```ini
# port for default/single
SINGLE_PORT=4000
# port for multi
MULTI_PORT=5000
```

## Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run start:dev`   | Start development server (nodemon / ts-node-dev) |
| `npm run start:prod`  | Build and run production bundle                  |
| `npm run start:multi` | Run clustered mode using Node.js Cluster API     |

## Usage

**Base URL:** `http://localhost:<PORT>/api/users`

### Endpoints

| Method   | Endpoint          | Description     |
| -------- | ----------------- | --------------- |
| `GET`    | `/api/users`      | Get all users   |
| `GET`    | `/api/users/{id}` | Get user by ID  |
| `POST`   | `/api/users`      | Create new user |
| `PUT`    | `/api/users/{id}` | Update user     |
| `DELETE` | `/api/users/{id}` | Delete user     |

### User object schema

```json
{
  "id": "string (uuid)",
  "username": "string",
  "age": "number",
  "hobbies": ["string"]
}
```



