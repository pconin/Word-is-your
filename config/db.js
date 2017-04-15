const mysql = require('mysql');

module.exports = mysql.createPool({
    multipleStatements: true,
    connectionLimit: 100,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'rootroot'
});
