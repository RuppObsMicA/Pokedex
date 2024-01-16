const http = require('http');
const mysql = require('mysql2');
const queryAllCustomers = "SELECT * FROM customers";
const PORT = 3000;

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "sftp_test"
});

http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(await getAllCustomers()));

}).listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log("Listening port 3000");
});

function getAllCustomers() {
    const data = new Promise((resolve, reject)=>{
        con.query(queryAllCustomers,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });

    con.end();
    return data;
};
