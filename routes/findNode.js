const express = require('express');
const {deleteNodeByID} = require("../databaseController/databaseConnection");
const router = express.Router();
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getNodeFromNeighborID}= require('../databaseController/databaseConnection');


router.get('/by-neighborhood-id', function(req, res, next){
    if(isValidKey(req.headers)) {
        let node = getNodeFromNeighborID(req.headers['neighborhood_id']);
        res.send(JSON.stringify(node));
    }
});


router.get('/delete-by-neighborhood-id', function(req, res, next){
    if(isValidKey(req.headers)){
        deleteNodeByID(req.headers['neighborhood_id'], res);
    }
});


module.exports = router;