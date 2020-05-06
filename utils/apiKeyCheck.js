
exports.isValidKey = function(headers){
    if(headers['api_key'] === null) return false;
    if(headers['api_key'].toString() === process.env.API_KEY.toString()){
        return true;
    }else{
        return false;
    }
};


