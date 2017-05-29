
// Express App Initialization
var express = require('express')
var accountApp = express();

// Crypto variables / functions
var crypto = require('crypto')
var jwt = require('jsonwebtoken');

var secretKey = "Durango502";

var generateToken = function(username) {
    var payload = {
        name: username
    };
    var options = {
        algorithm: 'HS256',
        expiresIn: '1h'
    };
    var token = jwt.sign(payload, secretKey, options);
    return token;
};

var parseToken = function(token) {
    try{
        return jwt.verify(token, secretKey);
    } catch(err){
        console.log("Error decoding token: " + token);
    }
};

var generateSalt = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex')
            .slice(0, length);
};

var securePassword = function(password, salt) {
  var hmac = crypto.createHmac('sha512', salt);
  hmac.update(password);
  var hash = hmac.digest('hex');
  return {
    hash: hash,
    salt: salt
  };
};

// Database integration / query definitions
var db = require('./database').db();

var userExistsQuery = 'SELECT EXISTS(SELECT 1 FROM UserTb WHERE UserName=$name LIMIT 1) as UserExists';
var addUserQuery = 'INSERT INTO UserTb values ($username, $passHash, $passSalt)';
var getUserCredentials = 'SELECT PassHash as hash, PassSalt as salt from UserTb where UserName=$username';

// Data validation definitions
// 6 - 20 alphanumerics starting with letter, not ending with underscore, without more than 1 underscore in a row
var usernameRegex = /^[A-Za-z](?:\w(?!_{2,})){4,18}[A-Za-z0-9]$/;
// password must be 8 - 50 characters with at least 1 lowercase, 1 uppercase, 1 number, 1 special character
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?:.{8,50})$/;

var validateUserCreation = function(res, data){
    var username = data.username;
    var password1 = data.password1;
    var password2 = data.password2;
    if(!(username && password1 && password2)){
        return denyReq(res, 'Request missing username, password, or password confirm');
    }
    if(password1 != password2){
        return denyReq(res, 'Password and Confirm Password must match');
    }
    if(!username.match(usernameRegex)){
        return denyReq(res, 'Invalid username string');
    }
    if(!password1.match(passwordRegex)){
        return denyReq(res, 'Invalid password string');
    }
    return true;
};

var validateUserLogin = function(res, data){
    var username = data.username;
    var password = data.password;
    if(!(username && password)){
        return denyReq(res, 'Request missing username or password');
    }
    if(!username.match(usernameRegex)){
        return denyReq(res, 'Invalid username string');
    }
    if(!password.match(passwordRegex)){
        return denyReq(res, 'Invalid password string');
    }
    return true;
};

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
accountApp.post('/login', function(req, res){

    var valid = validateUserLogin(res, req.body);
    if(!valid){ return; }

    db.get(getUserCredentials, {$username: req.body.username }, function (err, row){
        if(err != null){ return dbError(err, res); }
        if(!row) { return denyReq(res, 'Username doesn\'t exist'); }

        var secure = securePassword(req.body.password, row.salt);

        if(secure.hash == row.hash){
            return res.send({
                success: true,
                token: generateToken(req.body.username),
                message: 'Login Successful'
            });
        }    
        return denyReq(res, 'Invalid username / password');
    });

});

accountApp.post('/create', function(req, res){

    var valid = validateUserCreation(res, req.body);
    if(!valid){ return; }

    db.get(userExistsQuery, {$name: req.body.username }, function (err, row){
        if(err != null){ return dbError(err, res); }

        if(row['UserExists']){ return denyReq(res, 'Username already exists'); }

        var secure = securePassword(req.body.password1, generateSalt(10));
        db.get(addUserQuery, {$username: req.body.username, $passHash: secure.hash, $passSalt: secure.salt },
            function (err,row){
                if(err != null){ return dbError(err, res); }

                return res.send({
                    success: true,
                    token: generateToken(req.body.username),
                    message: 'Account successfully created'
                });
            }
        );
    });


});

module.exports = accountApp;