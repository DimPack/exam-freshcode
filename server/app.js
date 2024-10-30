const express = require('express');
const cors = require('cors');
const router = require('./src/router');
const handlerError = require('./src/handlerError/handler');
const app = express();
app.use(cors());

app.use('/public', express.static('../public'));
app.use(express.json());

app.use('/', router);
app.use(handlerError);

module.exports = app;
