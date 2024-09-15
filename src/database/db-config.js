const mysql = require("mysql2");

module.exports.pool = mysql.createPool({
    host: process.env.MYSQL_HOST,//127.0.0.1
    database: process.env.MYSQL_DATABASE,//universitysystem
    user: process.env.MYSQL_USER,//root
    password: process.env.MYSQL_PASSWORD//J!9K2&yE5$@s
}).promise();