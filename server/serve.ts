/* eslint-disable no-undef */
import express = require('express');
import path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);
