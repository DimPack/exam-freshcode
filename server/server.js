const http = require('http');
// ============================
require('dotenv').config();
const app = require('./app');
const controller = require('./src/socketInit');
const PORT = process.env.PORT || 3000;
require('./src/dbMongo/mongoose');
const server = http.createServer(app);

server.listen(PORT, () =>  console.log(`Example app listening on port ${PORT}!`));
controller.createConnection(server);

