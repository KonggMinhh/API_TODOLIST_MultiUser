const express = require('express');
const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');

const app = express();

app.use('/:username', (req, res, next) => {
  const username = req.params.username;
  const dbPath = path.join(__dirname, 'user', `db-${username}.json`);

  if (!fs.existsSync(dbPath)) {
    return res.status(404).send(`Không tìm thấy dữ liệu cho user "${username}"`);
  }

  const router = jsonServer.router(dbPath);
  const middlewares = jsonServer.defaults();

  const subApp = express();
  subApp.use(middlewares);
  subApp.use(jsonServer.bodyParser);
  subApp.use('/', router);
  subApp(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`JSON Server running at http://localhost:${PORT}/<username>`);
});