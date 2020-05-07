module.exports = Node;
function Node(resultRow){
    this.neighborhood_id = resultRow.NEIGHBORHOOD_ID;
    this.node_name = resultRow.NODE_NAME;
    this.primary_contact = resultRow.PRIMARY_CONTACT;
    this.address = resultRow.ADDRESS;
    this.phone = resultRow.PHONE;
    this.email = resultRow.EMAIL;
    this.x_coord = resultRow.X_COORD;
    this.y_coord = resultRow.Y_COORD;
    this.road = (resultRow.ADDRESS.split(" "));
    if(this.road[1].length <=2){
        this.road = this.road[2];
    }else{
        this.road = this.road[1];
    }

}


Node.prototype.waypoints = function(){
    return  [parseFloat(this.x_coord), parseFloat(this.y_coord)];
};
