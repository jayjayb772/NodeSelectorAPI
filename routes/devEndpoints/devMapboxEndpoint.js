const express = require('express');
const {getNodeFromNeighborID} = require("../../databaseController/databaseConnection");
const {GetDirectionsFromWaypoints} = require("../mapboxControl/mapboxDirections");
const Node = require('../../dataTypes/nodeStruct');
const {getCoordsFromAddr} = require("../../utils/getCoordsFromAddr");
const router = express.Router();


router.get('/', async function(req, res, next){
    console.log(req.query.node_id);
    console.log(req.query.addr);


    let nodeOne = await getNodeFromNeighborID(`${req.query.node_id}`);

    let nodeTwo = await getCoordsFromAddr(`${req.query.addr}`);
        //await getNodeFromNeighborID('GetMePPE-Alex Clos');
    let myRoad = req.query.addr.split(" ");
    myRoad = myRoad[1];

    let waypoints = [
                // nodeOne.x_coord,
                // nodeOne.y_coord,
                // nodeTwo.x_coord,
                // nodeTwo.y_coord

                {
                    name:`${nodeOne.road}`,
                    coordinates:nodeOne.waypoints()
                },
                {
                    name:myRoad,
                    coordinates: nodeTwo
                }


    ];




    console.log(waypoints);
    let directions = await GetDirectionsFromWaypoints(waypoints);
    let travelTime = directions.body.routes[0].duration / 60;
    console.log(directions.body.routes[0]);
    console.log(travelTime);



    res.send("ok");//("" + waypoints + "\n\n" + directions );
    // console.log(wayTwo);

});




module.exports = router;