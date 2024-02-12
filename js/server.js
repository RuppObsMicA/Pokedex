const PORT = 3000;
const mysql = require('mysql');
const multer = require('multer');
const upload = multer({dest: "uploads/"});
const express = require('express');
const fs = require('fs');


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

    req.files[0].file;

    async function isThePokemonAlreadyExist(){
        let query = `SELECT Id FROM pokemons WHERE Title = "${req.body. title}"`;

        let promiseDB = new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    reject(err);
                }
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
                let promiseDB = new Promise((resolve, reject) => {
                    connection.query(query, (err, results) => {
                        if (err){
                            reject(err);
                        }
                        console.log("Added data into DB");
                        resolve(results);
                    });
                });
                await promiseDB;
            }

            async function getIdOfCurrentPokemon(query){
                let promiseDB = new Promise((resolve, reject) => {
                    connection.query(query, (err, results) => {
                        if (err) {
                            reject(err)
                        }
                        console.log("Id was received");
                        resolve(results);
                    });
                });
                let result = await promiseDB;
                JSON.stringify(result);
                return result
            }


            res.send("Successful adding");
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
                if (err) {
                    reject(err);
                }
                resolve(results);
            });
        });
        let result = await promise;

        console.log(result);

        let images = [];
        let evolutionImages = [];
        let secondFormEvolutionImages = [];

        result.forEach((elem, index) => {
            images.push(fs.promises.readFile(`uploads/${result[index].Image}`));
        })

        result.forEach((elem, index) => {
            evolutionImages.push(fs.promises.readFile(`uploads/${result[index].EvolutionImage}`));
        })

        result.forEach((elem, index) => {
            if (result[index].SecondEvolutionImage != null) {
                secondFormEvolutionImages.push(fs.promises.readFile(`uploads/${result[index].SecondEvolutionImage}`));
            }
        })

        Promise.all(images).then(data => {

            result.forEach((elem, index) => {
                result[index].Image = data[index].toString('base64');
            })

            Promise.all(evolutionImages).then(data => {
                result.forEach((elem, index) => {
                    result[index].EvolutionImage = data[index].toString(`base64`);
                });

                let counterOfSecondForms = 0;

                Promise.all(secondFormEvolutionImages).then(data =>{
                    for (let i = 0; i < secondFormEvolutionImages.length; i++){
                        if (result[i].SecondEvolutionImage != null) {
                            result[i+counterOfSecondForms].SecondEvolutionImage = data[i].toString(`base64`);
                        } else {
                            counterOfSecondForms++;
                        }
                    }

                    sendResponse(result);
                    connection.end();
                })
            })
        })
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

// Google disc related section

// const { google } = require('googleapis');
// const apikey = require('F:\\WebDev Projects\\Pokedex git\\Pokedex\\apikey.json');
// const SCOPE = ['https://www.googleapis.com/auth/drive'];
//
// const ReadSCOPE = ['https://www.googleapis.com/auth/drive.readonly',
//                     'https://www.googleapis.com/auth/drive.metadata.readonly'];
// //
// const fs = require('fs');
// const {version} = require("http-server/lib/core");
// const {auth} = require("mysql/lib/protocol/Auth");
//
// async function authorize(){
//     const jwtClient = new google.auth.JWT(
//         apikey.client_email,
//         null,
//         apikey.private_key,
//         SCOPE
//     );
//     await jwtClient.authorize();
//
//     return jwtClient;
// }
//
// async function uploadImages(authClient){
//
//     console.log("Upload started...")
//     return new Promise((resolve, reject) =>{
//         const drive = google.drive({version:`v3`, auth:authClient});
//
//         console.log(req.files[0]);
//
//         let imageMetaData = {
//             name: `${req.files[0].originalname}`,
//             parents:["1bFk_869-ZchOY_AL7QuHRJCjgqQbYO26"]
//         }
//
//         drive.files.create({
//             resource: imageMetaData,
//             media:{
//                 body: fs.createReadStream(`uploads/${req.files[0].filename}`),
//                 mimeType: "image/*"
//             },
//             fields:"id"
//         }, function (err, file){
//             if (err){
//                 return reject(err)
//             }
//             console.log("Uploaded")
//             resolve(file)
//         })
//     })
// }
//
// async function listFiles(authClient) {
//     const drive = google.drive({version: 'v3', auth: authClient});
//     const res = await drive.files.list({
//         fields: 'nextPageToken, files(id, name)',
//     });
//     const files = res.data.files;
//     if (files.length === 0) {
//         console.log('No files found.');
//         return;
//     }
//
//     console.log('Files:');
//     files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//     });
// }

// authorize().then(listFiles).catch(console.error);

// await authorize().then(uploadImages).catch("Error", console.error());

