const express = require('express');
const router = express.Router();
const parse = require('csv-parse');
const fs = require('fs');
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const {addNodeToDatabase, deleteDB} = require('../databaseController/databaseConnection.js');
const { request } = require("@esri/arcgis-rest-request");
const { ApplicationSession } = require("@esri/arcgis-rest-auth");
const {isValidKey} = require('../utils/apiKeyCheck.js');

let nodeFile = './routes/nodesFile.csv';

let nodes =[];
const getCoordsURL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

let coordsParams = {
    'f':'json',
    'singleLine':'',
    'outFields': 'Match_addr,Addr_type',
    //'token':''
};

const authentication = new ApplicationSession({
    clientId: process.env.AGOL_CLIENT_ID,
    clientSecret: process.env.AGOL_CLIENT_SECRET
});




const parser = parse({delimiter: ','}, async function (err, data) {
    if(err) throw err;
    // when all countries are available,then process them
    // note: array element at index 0 contains the row of headers that we should skip
    console.log(data);

    for (let i = 1; i < data.length; i++) {
        coordsParams.singleLine = data[i][3];

        await request(getCoordsURL, {authentication, params: coordsParams}).then((r) => {

            let node = {
                "neighborhood_id": data[i][0]
                , "node_name": data[i][1]
                , "primary_contact": data[i][2]
                , "address": data[i][3]
                , "phone": data[i][4]
                , "email": data[i][5]
                , "x_coord": r.candidates[0].location.x
                , "y_coord": r.candidates[0].location.y
            };
            nodes.push(node);
            addNodeToDatabase(node);

        }).catch((err) => {
            console.log(err);
        });


    }

});



router.get('/', async function(req, res, next){
    if(isValidKey(req.headers)) {
        await fs.createReadStream(nodeFile).pipe(parser);
        res.send(nodes);
    }
});




module.exports = router;


