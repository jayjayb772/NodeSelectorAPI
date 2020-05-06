const express = require('express');
const router = express.Router();
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getCoordsFromAddrAndAddToDB}= require('../utils/getCoordsFromAddr.js');

router.post('/', async function(req, res, next){
    if(isValidKey(req.headers)) {
        await getCoordsFromAddrAndAddToDB(req, res);
    }else{
        return "Invalid API Key";
    }
});

module.exports = router;