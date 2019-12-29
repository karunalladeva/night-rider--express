var mysql = require('mysql');
const util = require('util')

var connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'consensys'
});

connection.getConnection((err, pool) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (pool) pool.release()
    return
})

// Promisify for Node.js async/await.
connection.query = util.promisify(connection.query)

module.exports = connection