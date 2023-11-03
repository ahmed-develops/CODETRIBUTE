const mysql = require('mysql');

const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection({
    database : process.env.DATABASE,
    user     : process.env.USER,
    password : process.env.PASSWORD,
    host     : process.env.HOST
});

module.exports = db;