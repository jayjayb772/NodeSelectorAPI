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


exports.getCoordsFromAddrAndAddToDB = async function(req,res){
    coordsParams.singleLine = req.body.Address;
    request(getCoordsURL, {authentication, params: coordsParams}).then((r) => {

        let node = {
            "neighborhood_id": req.body.Neighbor_ID
            , "node_name": req.body.Node_Name
            , "primary_contact": req.body.Primary_Contact
            , "address": req.body.Address
            , "phone": req.body.Phone
            , "email": req.body.Email
            , "x_coord": r.candidates[0].location.x
            , "y_coord": r.candidates[0].location.y
        };
        console.log(node);
        addNodeToDatabase(node, {res:res});

    });
};