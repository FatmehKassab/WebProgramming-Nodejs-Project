var mysql = require('mysql2')

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"oracle",
    database:"webproj"
})

con.connect((err) => {
    if (err) throw err
    console.log("Connected!");
});

exports.con = con