const express = require('express');
const router = express.Router();
require("cross-fetch/polyfill");
require("isomorphic-form-data");
const req = require('request');
const { request } = require("@esri/arcgis-rest-request");
const { ApplicationSession } = require("@esri/arcgis-rest-auth");
const {isValidKey} = require('./apiKeyCheck.js');

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
router.get('/', async function(req, res, next){

    if(isValidKey(req.headers)) {

        let searchAddr = req.headers['given_address'];
        coordsParams.singleLine = searchAddr;
        await request(getCoordsURL, {authentication, params: coordsParams}).then((r) => {
            thisXcoord = r.candidates[0].location.x;
            thisYcoord = r.candidates[0].location.y;
            res.send(findNearNode(thisXcoord, thisYcoord));
        }).catch((err) => {
            console.log(err);
        });


    }else{
        res.send('Invalid API key');
    }
});

function findNearNode(x, y){
    let closest = '';
    let dist = 10;
    for( let i = 0; i<nodes.length; i++){
        let tempDist =  Math.abs(Math.sqrt(((parseFloat(nodes[i].Xcoord)-parseFloat(x))*(parseFloat(nodes[i].Xcoord)-parseFloat(x)))+((parseFloat(nodes[i].Ycoord)-parseFloat(y))*(parseFloat(nodes[i].Ycoord)-parseFloat(y)))));
        //console.log(tempDist);
        if(tempDist < dist){
            closest = `${nodes[i].Node_Name}, ${nodes[i].Address}\n Primary Contact ${nodes[i].Primary_Contact}`;
            dist = tempDist;
        }
        //console.log(`cur node: ${nodes[i].Node_Name}, dist: ${dist}, cur closest:${closest}`)
    }
    return `Nearest node is ${closest}`;
}




module.exports = router;