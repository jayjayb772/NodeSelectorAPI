const express = require('express');
const router = express.Router();
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const req = require('request');
const { request } = require("@esri/arcgis-rest-request");
const { ApplicationSession } = require("@esri/arcgis-rest-auth");
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getAllNodes,findNearestNode} = require('../databaseController/databaseConnection.js');

const parse = require('csv-parse');
const fs = require('fs');

let nodeFile = './routes/out.csv';
const nodes = [];

function initNodes() {
    const parser = parse({delimiter: ','}, function (err, data) {
        for (let i = 1; i < data.length; i++) {
            let node = {
                "Neighbor_ID": data[i][0]
                , "Node_Name": data[i][1]
                , "Primary_Contact": data[i][2]
                , "Address": data[i][3]
                , "Xcoord": data[i][4]
                , "Ycoord": data[i][5]
            };
            nodes.push(node);
        }
    });
    fs.createReadStream(nodeFile).pipe(parser);
}
initNodes();






let params = {
    'f':'json',
    //'token':'',
    stops:[]
};


const authentication = new ApplicationSession({
    clientId: process.env.AGOL_CLIENT_ID,
    clientSecret: process.env.AGOL_CLIENT_SECRET
});

const WithAddressesURL = `http://logistics.arcgis.com/arcgis/rest/services/World/Route/GPServer/FindRoutes/submitJob?parameters`;
const getCoordsURL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';

let coordsParams = {
    'f':'json',
    'singleLine':'',
    'outFields': 'Match_addr,Addr_type',
    //'token':''
};




let thisXcoord, thisYcoord;
router.get('/find-nearest/', async function(req, res, next){

    //if(isValidKey(req.headers)) {

        let searchAddr = req.query['address'];
        coordsParams.singleLine = searchAddr;
        console.log(req);
        await request(getCoordsURL, {authentication, params: coordsParams}).then(async function(r){
            console.log(r);
            thisXcoord = r.candidates[0].location.x;
            thisYcoord = r.candidates[0].location.y;
            await findNearestNode(thisXcoord, thisYcoord, res);
        }).catch((err) => {
            console.log(err);

            res.send("Could not find coordinates");
        });



    //}else{
     //   res.send('Invalid API key');
   // }
});


router.get('/list-all', function(req, res, next){
    if(isValidKey(req.headers)) {
        getAllNodes(res);
    }else{
        res.send('Invalid api key?')
    }
});





module.exports = router;