const http = require('http');
const PORT = 3000;
const mysql = require('mysql');

const query = "SELECT * FROM pokemon";

const server = http.createServer((req, res) =>{
    console.log('Server request');
    console.log(req.url, req.method);

    res.writeHead(200, {'Content-Type': 'application/json'});


    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "test",
        password: "root"
    });

    connection.connect( err => {
        if (err) {
            console.log(err);
            return err
        } else {
            console.log("Database works");
        }
    });

    (async function (){
        let promise = new Promise((resolve, reject) => {
            connection.query(query, function (err, results) {
                if (err) console.log(err);
                resolve(results);
            });
        });
        let result = await promise;
        sendResponse(result);
        connection.end();
    })();

    // Second version of async code

    // let promise = new Promise((resolve, reject) => {
    //     connection.query(query, function (err, results) {
    //         if (err) console.log(err);
    //         resolve(results);
    //     });
    // })
    // promise.then(result => {
    //     sendResponse(result);
    //     connection.end();
    // });

    function sendResponse (response){
        res.write(JSON.stringify(response));
        res.end();
    }
});

server.listen(PORT, 'localhost', (error) =>{
    error ? console.log(error): console.log("Listening port 3000");
});




