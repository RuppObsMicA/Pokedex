const http = require('http');
const PORT = 3000;
const mysql = require('mysql');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const express = require('express');

let queryToInsertIntoPokemons;
let queryToInsertIntoEvolution;
let queryToInsertIntoSkills;
let queryToGetDataFromDB;

const app = express();

app.post("/", upload.any(), (req, res) => {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "pokedex",
        password: "root"
    });

    connection.connect(err => {
        if (err) {
            console.log(err);
            return err
        } else {
            console.log("Database works");
        }
    });

    // console.log(req.files);
    // console.log(req.body);

    (async function (){
        if(await isThePokemonAlreadyExist()){
            console.log("The pokemon Exist");
            res.send("Already exist"); // Come up with how to write on the origin page that the pokemon exists
            res.end();
            connection.end();
            console.log("Closed connection");
        } else {
            console.log("Not Exist");
            insertDataIntoDB();
        }
    })();

    async function isThePokemonAlreadyExist(){
        let query = `SELECT Id FROM pokemons WHERE Title = "${req.body. title}"`;

        let promiseDB = new Promise((resolve, reject) => { // Process reject
            connection.query(query, (err, results) => {
                if (err) console.log(err);
                console.log("Check complete");
                if (Object.keys(results).length === 0){
                    resolve(false)
                } else {
                    resolve(true)
                }
            });
        });
        return await promiseDB;
    }

        async function insertDataIntoDB(){

            queryToInsertIntoPokemons = `INSERT INTO pokemons (Title, Image, Description, Weaknesses, Types, Height, Weight, Gender, Category, Abilities)
                        VALUES ("${req.body.title}", "${req.files[0].filename}", "${req.body.description}", "${req.body.weakness}", "${req.body.type}",
                        "${req.body.height}", "${req.body.weight}", "${req.body.gender}", "${req.body.category}", "${req.body.abilities}")`;

            await insertDataIntoDB(queryToInsertIntoPokemons);

            let IdOfCurrentPokemon = await getIdOfCurrentPokemon(`SELECT Id FROM pokemons WHERE Title = "${req.body.title}"`);

            if (req.files.length > 2){
                queryToInsertIntoEvolution = `INSERT INTO evolution (Id, EvolutionName, EvolutionImage, SecondEvolutionName, SecondEvolutionImage)
                        VALUES ("${IdOfCurrentPokemon[0].Id}", "${req.body.firstTitle}", "${req.files[1].filename}", "${req.body.secondTitle}", "${req.files[2].filename}")`;
            } else {
                queryToInsertIntoEvolution = `INSERT INTO evolution (Id, EvolutionName, EvolutionImage) 
                        VALUES ("${IdOfCurrentPokemon[0].Id}", "${req.body.firstTitle}", "${req.files[1].filename}")`;
            }


            queryToInsertIntoSkills = `INSERT INTO skills (Id, Hp, Attack, Defense, SpecialAttack, SpecialDefense, Speed) 
                        VALUES ("${IdOfCurrentPokemon[0].Id}", "${req.body.hp}", "${req.body.attack}", "${req.body.defense}", "${req.body.specialAttack}", "${req.body.specialDefense}", "${req.body.speed}")`;

            await insertDataIntoDB(queryToInsertIntoSkills);
            await insertDataIntoDB(queryToInsertIntoEvolution);


            async function insertDataIntoDB(query){
                let promiseDB = new Promise((resolve, reject) => { // Process reject
                    connection.query(query, (err, results) => {
                        if (err) console.log(err);
                        console.log("Added data into DB");
                        resolve(results);
                    });
                });
                await promiseDB;
            }

            async function getIdOfCurrentPokemon(query){
                let promiseDB = new Promise((resolve, reject) => { // Process reject
                    connection.query(query, (err, results) => {
                        if (err) console.log(err);
                        console.log("Id was received");
                        resolve(results);
                    });
                });
                let result = await promiseDB;
                JSON.stringify(result);
                return result
            }

            res.send("Successful adding")
            res.end();
            connection.end();
            console.log("Closed connection");
        }
});

app.get("/", (req, res) => {

    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        database: "pokedex",
        password: "root"
    });

    connection.connect(err => {
        if (err) {
            console.log(err);
            return err
        } else {
            console.log("Database works");
        }
    });

    queryToGetDataFromDB = "SELECT * FROM pokemons INNER JOIN skills ON pokemons.Id=skills.Id RIGHT JOIN evolution ON pokemons.ID=evolution.Id";

        (async function () {
            let promise = new Promise((resolve, reject) => {
                connection.query(queryToGetDataFromDB, function (err, results) {
                    if (err) console.log(err);
                    resolve(results);
                });
            });
            let result = await promise;
            sendResponse(result);
            connection.end();
        })();

    function sendResponse(response) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.send(JSON.stringify(response));
            console.log("Sent")
            res.end();
    }
});

app.listen(PORT, (error) => {
    error ? console.log(error): console.log("Listening port 3000");
})

// server.listen(PORT, 'localhost', (error) =>{
//     error ? console.log(error): console.log("Listening port 3000");
// });


// const server = http.createServer((req, res) => {
//
//     const connection = mysql.createConnection({
//         host: "localhost",
//         user: "root",
//         database: "pokedex",
//         password: "root"
//     });
//
//     connection.connect(err => {
//         if (err) {
//             console.log(err);
//             return err
//         } else {
//             console.log("Database works");
//         }
//     });
//
//     if (req.method === "GET") {
//        query = "SELECT * FROM pokemons";
//         (async function () {
//             let promise = new Promise((resolve, reject) => {
//                 connection.query(query, function (err, results) {
//                     if (err) console.log(err);
//                     resolve(results);
//                 });
//             });
//             let result = await promise;
//             sendResponse(result);
//             connection.end();
//         })();
//
//         // Second version of the async code
//
//         // let promise = new Promise((resolve, reject) => {
//         //     connection.query(query, function (err, results) {
//         //         if (err) console.log(err);
//         //         resolve(results);
//         //     });
//         // })
//         // promise.then(result => {
//         //     sendResponse(result);
//         //     connection.end();
//         // });
//
//         function sendResponse(response) {
//             res.writeHead(200, {'Content-Type': 'application/json'});
//             res.write(JSON.stringify(response));
//             res.end();
//         }
//     }
//
//
//     // else if (req.method === "POST"){
//     //     let req.body;
//     //     (async function (){
//     //         // let promise = new Promise((resolve, reject) => {
//     //         //     req.on("data", chunk =>{
//     //         //     req.body += chunk;
//     //         //     resolve(req.body);
//     //         //     })
//     //         //     // req.body = req.body;
//     //         // });
//     //         // await promise;
//     //
//     //
//     //
//     //         // req.body = JSON.parse(req.body);
//     //         //
//     //         // query = `INSERT INTO req.bodys (Title, Image, Description, Weaknesses, Types, Evolution, Height, Weight, Gender, Category, Abilities, Skills)
//     //         //             VALUES ("${req.body.title}", "${req.body.image.name}", "${req.body.description}", "${req.body.weaknesses}", "${req.body.types}", "${req.body.evolution[0].title}",
//     //         //             "${req.body.height}", "${req.body.weight}", "${req.body.gender}", "${req.body.category}", "${req.body.abilities}", "${req.body.skills[0].hp}")`;
//     //         //
//     //         // let promiseDB = new Promise((resolve, reject) => {
//     //         //     connection.query(query, (err, results) => {
//     //         //         if (err) console.log(err);
//     //         //         console.log("Added data into DB")
//     //         //         resolve(results)
//     //         //     });
//     //         // });
//     //         // await promiseDB;
//     //
//     //         res.end();
//     //         console.log("Closed connection")
//     //     })();
//     // }
// });


