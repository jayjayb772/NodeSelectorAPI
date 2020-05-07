const mysql = require('mysql');
const express = require('express');
const {formatQueryReturnHTML} = require("../routes/formatQuery");
const Node = require('../dataTypes/nodeStruct');
const router = express.Router();
const con = mysql.createConnection({
    host: `${process.env.DB_HOST}`,
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    database:`${process.env.DB_DB}`
});



con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

exports.testCon = function(){
    con.query("SELECT * FROM t_nodes", function (err, result) {
        if (err) throw err;
        //console.log("Result: " + result);
    });

};


exports.getNodeFromNeighborID = function(node_id){
    return new Promise(function(fulfill, reject) {
        con.query(`SELECT * FROM t_nodes WHERE NEIGHBORHOOD_ID = "${node_id}" ;`, function (err, result) {
            if (err) throw err;
            let node = new Node(result[0]);
            fulfill(node);
        });
    });
};



exports.findNearestNode = async function(x,y, addr){
    return new Promise(function(fulfill, reject){


    let nodeResponse = '';
    let dist = 100;
    con.query("SELECT * FROM t_nodes", function(err, result){
       if(err) reject(err);

       for(let i = 0; i<result.length; i++){
           let xs = parseFloat(result[i].X_COORD) - parseFloat(x);
           let xSquared = xs*xs;
           let ys = parseFloat(result[i].Y_COORD) - parseFloat(y);
           let ySquared = ys*ys;
           let tempDist =  Math.abs(Math.sqrt(xSquared+ySquared));        //console.log(tempDist);
           // console.log("\n\nCur node:" + result[i].NODE_NAME);
           // console.log("cur best: " + nodeResponse);
           // console.log("dist to cut:" + tempDist);
           // console.log("dist to best:" + dist);
           if(tempDist < dist){
               nodeResponse = `${JSON.stringify(result[i])}`;
               //console.log(nodeResponse);
               dist = tempDist;
           }
       }
       //console.log(nodeResponse);
       fulfill(formatQueryReturnHTML(nodeResponse, addr));


    });


    });
};





exports.addNodeToDatabase = function(node){
    return new Promise(function(fulfill, reject){
    con.query(`INSERT INTO t_nodes (NEIGHBORHOOD_ID, NODE_NAME, PRIMARY_CONTACT, ADDRESS, PHONE, EMAIL, X_COORD, Y_COORD) SELECT "${node.neighborhood_id}", "${node.node_name}", "${node.primary_contact}", "${node.address}", "${node.phone}", "${node.email}", "${node.x_coord}", "${node.y_coord}" FROM dual WHERE NOT EXISTS(SELECT 1 FROM t_nodes WHERE NEIGHBORHOOD_ID = "${node.neighborhood_id}");`, function (err, result) {
        if (err) reject(err);
        //console.log(`Added ${node.neighborhood_id} to db`);
        fulfill(true);
        //console.log("Result: " + result);
    });
    });
};

exports.getAllNodes = function(res){
    con.query("SELECT * FROM t_nodes;", function (err, result) {
        if (err) throw err;
        //console.log(JSON.stringify(result));
        res.send(result);

    });
};


exports.deleteNodeByID = function(neighborhood_id, res){
    con.query(`DELETE FROM t_nodes WHERE NEIGHBORHOOD_ID = '${neighborhood_id}'`, function(err, result){
        if(err) throw err;
        //console.log(result);
        res.send(Response.ok);
    })
};


exports.getCoordsByID = function(neighborhood_id){

    return new Promise(function(fulfill, reject){
        con.query(`SELECT X_COORD, Y_COORD FROM t_nodes WHERE NEIGHBORHOOD_ID = '${neighborhood_id}'`, function(err, result){
            if(err) reject(err);
            let node = new Node(result[0]);
            fulfill(node);
        });
    });


};
