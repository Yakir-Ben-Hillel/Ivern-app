/* eslint-disable no-undef */
import express = require('express');
import path = require('path');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function (req, res) {
  console.log(path.join(__dirname, 'build', 'index.html'));
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);
