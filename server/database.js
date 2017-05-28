
var sqlite3 = require('sqlite3').verbose();

var exports = module.exports = {};

exports.db = function() {
    return new sqlite3.Database('../database/dev.sqlite');
}