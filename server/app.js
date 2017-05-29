var express = require('express');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var jwt = require('jsonwebtoken');
app.use(function(req, res, next) {
  var auth = req.get('authorization');
  if(auth && auth.startsWith('Bearer')){
    var token = auth.replace('Bearer ', '');
    var decoded = jwt.verify(token, 'Durango502', function(err, decoded){
      if(err){
        console.log("jwt error : " + err);
      }else{
        req['jwt'] = decoded;
      }
      next();
    });
  }else{
    next();
  }
});

var account = require('./account');
app.use('/account', account);

app.listen(8081, function () {
  console.log('Example app listening on port 8081!!')
});