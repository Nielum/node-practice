# node-practice

A small Node.js learning project demonstrating routing, middleware, and simple error logging using writeFileSync. This repo is intended as a practice code base to build and explore minimal APIs, middleware patterns, and basic error logging to file.

## Goals / Features

- Minimal Express-like routing (or plain Node.js http routing)
- Middleware pattern (logging, parsing, auth placeholder)
- Centralized error handling
- Error logging to disk using writeFileSync (simple, synchronous approach for learning)
- A couple of example API endpoints and curl examples

> Note: writeFileSync is used here intentionally to keep the example simple and synchronous. In production, prefer appendFile or streams and asynchronous logging libraries to avoid blocking the event loop.

## Prerequisites

- Node.js 14+ (recommended 18+)
- npm or yarn

## Install

Clone the repo and install dependencies (if you use Express or other packages):

```bash
git clone https://github.com/Nielum/node-practice.git
cd node-practice
npm install
```

If the project is plain Node without dependencies, there's nothing to install.

## Run

Start the server (example):

```bash
node index.js
# or, if there is a package.json script:
npm start
```

The server will listen on the port configured in the app (commonly 3000). Check console output for the exact URL (e.g. http://localhost:3000).

## Example API Endpoints

These endpoints are examples you can add or adapt.

- GET /                -> Health check / welcome
- GET /users           -> Return a list of users (sample data)
- POST /users          -> Create a user (simple validation)
- GET /error           -> Endpoint that deliberately throws an error (for testing logging)

Example curl usage:

```bash
# health check
curl http://localhost:3000/

# list users
curl http://localhost:3000/users

# create user (JSON)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com"}'
```

## Middleware

A middleware approach separates concerns like logging, request parsing, authentication, and validation. Example middleware components:

- Request logger: logs incoming requests (method, path, timestamp) to console or file.
- JSON body parser: parse request bodies into JSON objects.
- Error catcher: catches thrown errors and forwards them to the central error handler.

Example pseudo-code for a simple logger middleware:

```js
function requestLogger(req, res, next) {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
}
```

## Error handling and logging (writeFileSync)

This project shows a simple central error handler that writes error details to a log file using fs.writeFileSync. The example below shows how you might collect error details and persist them synchronously to a file named `logs/errors.log`.

Example error handler snippet:

```js
const fs = require('fs');
const path = require('path');

function logErrorToFile(err) {
  try {
    const logsDir = path.resolve(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    const message = `[${new Date().toISOString()}] ${err.name}: ${err.message}\n${err.stack}\n\n`;
    // WARNING: writeFileSync will overwrite the file; using appendFileSync is usually better.
    // For the teaching purpose here, if you want to append, change to fs.appendFileSync.
    fs.writeFileSync(path.join(logsDir, 'errors.log'), message, { flag: 'a' });
  } catch (fsErr) {
    // If logging fails, print to console as a last resort
    console.error('Failed to write error log:', fsErr);
  }
}

function errorHandler(err, req, res) {
  logErrorToFile(err);
  res.statusCode = err.status || 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
}
```

Notes:
- The sample uses the `{ flag: 'a' }` option to append; if you intentionally want writeFileSync (overwrite), remove the flag or set to `'w'`.
- Using synchronous file writes will block the event loop — okay for learning or small utilities, not for high-throughput production servers.

## Project structure (suggested)

This repository can be organized like:

```
.
├─ index.js            # Main server boot
├─ routes/
│  ├─ index.js         # Route registration
│  └─ users.js         # Users endpoints
├─ middleware/
│  ├─ logger.js
│  ├─ parser.js
│  └─ errorHandler.js
├─ logs/
│  └─ errors.log       # Created at runtime
├─ package.json
└─ README.md
```

## Tips while learning

- Start with plain http module to understand request/response basics, then move to Express to simplify routing/middleware.
- Keep middleware pure and focused — one responsibility per middleware.
- Try both synchronous and asynchronous logging to see the difference in behavior.
- Add unit tests for your route handlers and middleware when comfortable.

## Next steps / improvements

- Switch to asynchronous logging (fs.appendFile or a logging library like Winston or Pino).
- Add validation (e.g., using Joi or express-validator).
- Replace simple in-memory data with a lightweight DB (SQLite or lowdb) for persistence.
- Add tests (Jest or Mocha) to validate routes and error handling.

## License

MIT
