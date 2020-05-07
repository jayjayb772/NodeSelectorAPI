const mbxClient = require('@mapbox/mapbox-sdk');
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');

const baseClient = mbxClient({ accessToken: process.env.MAPBOX_GOD_TOKEN });
const directionsClient = mbxDirections(baseClient);



exports.GetDirectionsFromWaypoints = function(waypoints){
    return new Promise(function(fulfill, reject){
        directionsClient.getDirections({waypoints:waypoints, profile:"driving"}).send().then((res, err)=>{
          if(err) console.log(err);
          //console.log(res);
          fulfill(res);
        })
    });

    //
    //     directionsClient.getDirections(waypoints, {profile:"mapbox/driving"}, function(err, data, res){
    //         if(err) console.log(err);// err;
    //         console.log(data);
    //         console.log(res);
    //         fulfill(data);
    //         //return fulfill(data);
    //     })
    // });

};

