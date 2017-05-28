var express = require('express');
var app = express();

var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

var account = require('./account');
app.use('/account', account);

app.listen(8081, function () {
  console.log('Example app listening on port 8081!!')
});