const http = require('http');
const syncMysql = require('sync-mysql');

const syncConnection = new syncMysql({
    host: "localhost",
    user: "root",
    database: "test",
    password: "root"
});

const PORT = 3000;

let query = "SELECT * FROM pokemon";

const server = http.createServer((req, res) =>{
    console.log('Server request');
    console.log(req.url, req.method);

    res.writeHead(201, {'Content-Type': 'application/json'});

    const result = syncConnection.query(query);

    res.write(JSON.stringify(result));
    res.end();

});

server.listen(PORT, 'localhost', (error) =>{
    error ? console.log(error): console.log("Listening port 3000");
});

// Database
// const mysql = require('mysql');
//
// const connection = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     database: "test",
//     password: "root"
// })
//
// connection.connect( err => {
//     if (err) {
//         console.log(err);
//         return err
//     } else {
//         console.log("Database works");
//     }
// })
//
// connection.query(query, function(err, results) {
//     if(err) console.log(err);
//
//     toSend = results[0];
//
//     connection.end();
// });



