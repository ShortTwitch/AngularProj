'use strict';

let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./http-server');

// Create web socket server on top of a regular http server
var jwt = require('jsonwebtoken');
var url = require('url');

let wss = new WSServer({
  server: server,
  verifyClient: function(info){
      var params = url.parse(info.req.url, true).query;
      var token = params.token
      try{
        var decoded = jwt.verify(token, 'password123');
        info.req['abc123'] = decoded.name;
        return true;
      }catch(err){
          console.log("JWT ERROR : " + err);
          return false;
      }
  }
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection(ws, req) {
    let user = req['abc123'];
    ws['socket_user'] = user;

    // notify everyone when new user joins
    let joinData = {
        type : 'status',
        message : user + ' has joined the chat.'
    };
    wss.clients.forEach(function(client){
        if(client.readyState === 1){
            client.send(JSON.stringify(joinData));
        }
    });


  ws.on('message', function incoming(data) {
    let dataObj = JSON.parse(data);
    let msgData = {
        type : 'message',
        message : "{ " + ws['socket_user'] + " } : " + dataObj.message
    };
    wss.clients.forEach(function(client){
        if(client.readyState === 1){
            client.send(JSON.stringify(msgData));
        }
    });
  });
});


server.listen(8081, function() {
  console.log('http/ws server listening on 8081');
});