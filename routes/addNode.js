const express = require('express');
const router = express.Router();
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getCoordsFromAddrAndAddToDB}= require('../utils/getCoordsFromAddr.js');

router.post('/new-node', async function(req, res, next){
    console.log('what');
    res.send("ok");
    res.end();
    /*
    if(isValidKey(req.headers)) {
        let added = await getCoordsFromAddrAndAddToDB(req);
        if(added === true){
            res.send(`Successfully added ${req.body.Neighbor_ID} to database t_nodes`);
        }
    }else{
       res.send("Invalid API Key");
    }

     */
});

router.get('/', function(req,res,next){
    console.log('hi');
    res.send('hi');
});



module.exports = router;