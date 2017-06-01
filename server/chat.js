
// Express App Initialization
var express = require('express');
var chatApp = express();

// Database integration / query definitions
var db = require('./database').db();

var addMessageQuery = 'INSERT INTO MessageTb (username, message) values ($username, $message)';
var getMessageQuery = 'SELECT username, message FROM MessageTb';

// Response helper functions
var dbError = function(err, res){
    console.log("Database Error: " + err);
    res.send({
        success: false,
        message: 'Internal database error'
    });
    return false;
};

var denyReq = function(res, msg){
    res.send({
        success: false,
        message: msg
    });
    return false;
};

// Route handling

chatApp.use(function(req, res, next){
    if(!req.jwt){
        return denyReq(res, 'Please login to use chat functionality');
    }
    console.log("Req jwt exists");
    next();
});

module.exports = chatApp;