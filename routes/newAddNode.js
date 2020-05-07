const express = require('express');
const router = express.Router();
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getCoordsFromAddrAndAddToDB}= require('../utils/getCoordsFromAddr.js');

router.post('/', async function(req, res){

    if(isValidKey(req.headers)) {
        let added = await getCoordsFromAddrAndAddToDB(req);
        if(added === true){
            res.status(200).send(`Successfully added ${req.fields.Neighbor_ID} to database t_nodes`);
        }else{
            res.status(400).send(added);
        }
    }else{
       res.send("Invalid API Key");
    }


});

module.exports = router;