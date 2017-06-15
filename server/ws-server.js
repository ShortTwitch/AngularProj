'use strict';

let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./http-server');

// Create web socket server on top of a regular http server
var jwt = require('jsonwebtoken');
var url = require('url');

let wss = new WSServer({
  server: server,
  clientTracking: true,
  verifyClient: function(info){
      var params = url.parse(info.req.url, true).query;
      var token = params.token
      try{
        var decoded = jwt.verify(token, 'password123');
        info.req['jwt_token'] = decoded;
      }catch(err){
          console.log("JWT ERROR : " + err);
          return false;
      }
      return true;
  }
});

// Also mount the app here
server.on('request', app);

function onMessageEvent(ws, data) {
    let user = ws['socket_user'];
    let dataObj = JSON.parse(data);
    let msgData = {
        type : 'message',
        data : {
            fromUser: user.name,
            message: dataObj.message
        }
    };
    wss.clients.forEach(function(client){
        if(client.readyState === 1){
            client.send(JSON.stringify(msgData));
        }
    });
};

function onCloseEvent(ws, code, reason){
    let user = ws['socket_user'];
    let msgData = {
        type : 'userLeave',
        data : user.name
    };
    wss.clients.forEach(function(client){
        if(client.readyState === 1){
            client.send(JSON.stringify(msgData));
        }
    });
};

function print(msg, data){
    var cache = [];
    console.log(msg + ' : ' + JSON.stringify(data, function(key, value){
        if(typeof value === 'object' && value !== null){
            if (cache.indexOf(value) !== -1){
                return;
            }
            cache.push(value);
        }
        return value;
    }));
    cache = null;
}

wss.on('connection', function connection(ws, req) {
    let user = req['jwt_token'];
    ws['socket_user'] = user;

    // prevent multiple connections from same user
    for(let client of wss.clients){
        if(client != ws && client['socket_user'].name == user.name){
            console.log("Multiple sign in for " + user. name + ", logging out other user");
            client.close();
        }
    }

    // notify everyone when new user joins
    let joinData = {
        type : 'userJoin',
        data : user.name
    };
    wss.clients.forEach(function(client){
        if(client.readyState === 1){
            client.send(JSON.stringify(joinData));
        }
    });

    // Send the new user the list of people in the chat room
    let guests = [];
    for(let client of wss.clients){
        guests.push(client['socket_user'].name);
    }
    let guestData = {
        type : 'guestStatus',
        data : guests
    };
    ws.send(JSON.stringify(guestData));


    // subscribe to various web socket events
  ws.on('message', function(data){
    onMessageEvent(ws, data);
  });

  ws.on('close', function(code, reason){
    onCloseEvent(ws, code, reason);
  });

});


server.listen(8081, function() {
  console.log('http/ws server listening on 8081');
});