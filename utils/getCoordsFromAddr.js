const { request } = require("@esri/arcgis-rest-request");
const { ApplicationSession } = require("@esri/arcgis-rest-auth");
const getCoordsURL = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates';
const {addNodeToDatabase} = require('../databaseController/databaseConnection.js');

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


exports.getCoordsFromAddrAndAddToDB = async function(req,addr){
    return new Promise(function(fulfill, reject){
    coordsParams.singleLine = req.fields.Address;
    request(getCoordsURL, {authentication, params: coordsParams}).then(async function(r){
        console.log(r);
        let node = {
            "neighborhood_id": req.fields.Neighbor_ID
            , "node_name": req.fields.Node_Name
            , "primary_contact": req.fields.Primary_Contact
            , "address": req.fields.Address
            , "phone": req.fields.Phone
            , "email": req.fields.Email
            , "x_coord": r.candidates[0].location.x
            , "y_coord": r.candidates[0].location.y
        };
        console.log(node);
        let added = await addNodeToDatabase(node);
        if(added === true){
            fulfill(true);
        }
    });
    });

};

exports.getCoordsFromAddr = async function(addr){
    return new Promise(function(fulfill, reject){
        coordsParams.singleLine = addr;
        request(getCoordsURL, {authentication:authentication, params:coordsParams}).then((res)=>{
            let coords = [res.candidates[0].location.x, res.candidates[0].location.y];
            return fulfill(coords);
        })
    })
};