"use strict";



const express = require('express');
const hbs = require('hbs');
var documentClient = require("documentdb").DocumentClient;
var url = require('url');

var app = express();
var client = new documentClient("https://rds-map-data.documents.azure.com:443/", { "masterKey": "tMJPCtK6o1oFXHvu7URmAzLMwIzjfkdUX1hAkiCbIdka3ALNmIIRhVJRZwhUrVxH5uqexjEqhktLaOpTkEStow==" });

// ADD THIS PART TO YOUR CODE
var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = 'dbs/sekken';
var collectionUrl = `${databaseUrl}/colls/sensor-data`;

function getDatabase() {
    console.log(`Getting database:\nsekken\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

// ADD THIS PART TO YOUR COE



    function queryCollection(mapList) {
        console.log(`Querying collection through index:\nsekken`);
    
        return new Promise((resolve, reject) => {
            client.queryDocuments(
                collectionUrl,
                'SELECT VALUE r.coordinate FROM root r'
            ).toArray((err, results) => {
                if (err) reject(err)
                else {
                    for (var queryResult of results) {
                        mapList.push(queryResult);
                        let resultString = JSON.stringify(queryResult);
                        console.log(`\tQuery returned ${resultString}`);
                    }
                    console.log();
                    resolve(results);
                }
            });
        });
    };





function exit(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

getDatabase()
.then(() => { exit(`Completed successfully`); })
.catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) })







app.set('view engine', 'hbs');

hbs.registerHelper('getGpsData', () => {
    return [[60.397076,5.324383], [51.509865,-0.118092]];
})

app.get('/', async (req, res) => {
    var mapList = [];
    var cor = await queryCollection(mapList);
    console.log(mapList);    

    res.sendFile(__dirname + '/public/index.html');

});

app.listen(3000, () => {
    console.log("Listening to port 3000");
})