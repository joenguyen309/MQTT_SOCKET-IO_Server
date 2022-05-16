var mysql = require('mysql')

var connect_mysql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase'
})

connect_mysql.connect(function(err,connect_mysql){
    if(err) console.log("Fail connect to MySql")
})

module.exports = connect_mysql