const express = require('express');
const router = express.Router();
const {isValidKey} = require('../utils/apiKeyCheck.js');
const {getCoordsFromAddr}= require('../utils/getCoordsFromAddr.js');

router.post('/', async function(req, res, next){
    if(isValidKey(req.headers)) {
        console.log(req.body);
        await getCoordsFromAddr(req, res);
    }else{
        return "Invalid API Key";
    }
});

module.exports = router;